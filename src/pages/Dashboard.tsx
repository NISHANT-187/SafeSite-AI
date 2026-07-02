import React from 'react';
import { useApp } from '../context/AppContext';
import { GlassCard } from '../components/GlassCard';
import {
  ArrowUpRight,
  Sun,
  Activity,
  Wifi,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { formatDate } from '../utils/helpers';
import { Link } from 'react-router-dom';
import { SafetyCopilot } from '../components/SafetyCopilot';

export const Dashboard: React.FC = () => {
  const { entryLogs, workers, activeSite } = useApp();

  const siteLogs = entryLogs;
  const totalScans = siteLogs.length;
  const grantedCount = siteLogs.filter((l) => l.status === 'Access Granted').length;
  const deniedCount = siteLogs.filter((l) => l.status === 'Access Denied').length;
  const successRate = totalScans > 0 ? Math.round((grantedCount / totalScans) * 100) : 100;
  
  const avgSafetyScore = workers.length > 0 
    ? Math.round(workers.reduce((acc, w) => acc + w.safetyScore, 0) / workers.length)
    : 100;

  // Chart: Daily scan trends computed from actual entryLogs
  const getWeeklyTrendsFromLogs = (logs: typeof entryLogs) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const counts = days.map((day) => ({ day, granted: 0, denied: 0 }));

    logs.forEach((log) => {
      try {
        const date = new Date(log.timestamp);
        const dayName = days[date.getDay()];
        const target = counts.find((c) => c.day === dayName);
        if (target) {
          if (log.status === 'Access Granted') target.granted++;
          else target.denied++;
        }
      } catch (e) {}
    });

    const today = new Date().getDay();
    const orderedTrends = [];
    for (let i = 6; i >= 0; i--) {
      const idx = (today - i + 7) % 7;
      orderedTrends.push({
        day: i === 0 ? 'Today' : days[idx],
        granted: counts[idx].granted,
        denied: counts[idx].denied,
      });
    }
    return orderedTrends;
  };
  const weeklyTrends = getWeeklyTrendsFromLogs(siteLogs);

  // Chart: PPE violations count calculated from actual entryLogs
  const ppeViolationData = [
    { name: 'Gloves', count: siteLogs.filter((l) => l.missingPPE.some(item => item.toLowerCase().includes('glove'))).length },
    { name: 'Harness', count: siteLogs.filter((l) => l.missingPPE.some(item => item.toLowerCase().includes('harness'))).length },
    { name: 'Respirator', count: siteLogs.filter((l) => l.missingPPE.some(item => item.toLowerCase().includes('respirator') || item.toLowerCase().includes('mask'))).length },
    { name: 'Helmet Color', count: siteLogs.filter((l) => l.helmetColorStatus === 'Failed').length },
    { name: 'Goggles', count: siteLogs.filter((l) => l.missingPPE.some(item => item.toLowerCase().includes('goggle') || item.toLowerCase().includes('eye'))).length },
  ].sort((a, b) => b.count - a.count);

  // Chart: Trade safety scores computed dynamically from actual workers
  const getDeptSafetyScores = (workersList: typeof workers) => {
    const defaultDepts = [
      { name: 'Civil Labour', score: 100 },
      { name: 'Electrical Eng', score: 100 },
      { name: 'Supervisor', score: 100 },
      { name: 'Welder', score: 100 },
      { name: 'Painter', score: 100 },
      { name: 'Plumber', score: 100 },
    ];
    if (workersList.length === 0) return defaultDepts;

    const uniqueDepts = Array.from(new Set(workersList.map((w) => w.department)));
    return uniqueDepts.map((dept) => {
      const deptWorkers = workersList.filter((w) => w.department === dept);
      const avg = Math.round(
        deptWorkers.reduce((sum, w) => sum + w.safetyScore, 0) / deptWorkers.length
      );
      return { name: dept, score: avg };
    });
  };
  const deptData = getDeptSafetyScores(workers);

  return (
    <div className="space-y-5 select-none">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
            Construction Command Center
          </h2>
          <p className="text-xs text-slate-550 dark:text-slate-500 mt-0.5">
            Operational dashboard tracking safety checks and credential audits for {activeSite?.name}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/camera"
            className="px-4 py-2.5 bg-brand-primary text-white rounded-lg text-xs font-bold hover:bg-brand-primary/95 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            Launch Inspection Terminal
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Industrial HMI Status Strip */}
      <div className="flex flex-wrap items-center gap-4 py-2 px-3.5 neumorph-inset text-[10px] font-extrabold text-slate-550 dark:text-slate-500">
        <span className="flex items-center gap-1.5">
          <Sun className="w-3.5 h-3.5 text-brand-warning" />
          WEATHER: <span className="text-slate-800 dark:text-slate-350">32°C (HUMID CLEAR)</span>
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
        <span className="flex items-center gap-1.5">
          <Wifi className="w-3.5 h-3.5 text-brand-success" />
          NETWORK: <span className="badge-status badge-online px-1 py-0 border-none bg-transparent">CONNECTED</span>
        </span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800" />
        <span className="flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-brand-primary" />
          CV SCANNERS: <span className="badge-status badge-online px-1 py-0 border-none bg-transparent">SYNCING</span>
        </span>
      </div>

      {/* Stats Deck - Numbers Dominate on Top */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Stat 1 */}
        <GlassCard className="py-4.5">
          <div className="flex flex-col justify-between h-full">
            <span className="stat-number text-brand-primary">{totalScans}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">
              Gate Entries Today
            </span>
            <div className="text-[9px] font-bold text-slate-550 dark:text-slate-500 mt-1">
              <span className="text-brand-success">+12%</span> vs yesterday average
            </div>
          </div>
        </GlassCard>

        {/* Stat 2 */}
        <GlassCard className="py-4.5">
          <div className="flex flex-col justify-between h-full">
            <span className="stat-number text-brand-success">{successRate}%</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">
              Compliance Rate
            </span>
            <div className="text-[9px] font-bold text-slate-550 dark:text-slate-500 mt-1">
              Aggregate success check ratio
            </div>
          </div>
        </GlassCard>

        {/* Stat 3 */}
        <GlassCard className="py-4.5">
          <div className="flex flex-col justify-between h-full">
            <span className="stat-number text-brand-danger">{deniedCount}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">
              Access Violations
            </span>
            <div className="text-[9px] font-bold text-slate-550 dark:text-slate-500 mt-1">
              {deniedCount > 0 ? (
                <span className="text-brand-danger uppercase">Action Required</span>
              ) : (
                <span className="text-brand-success uppercase">Zero Gate incidents</span>
              )}
            </div>
          </div>
        </GlassCard>

        {/* Stat 4 */}
        <GlassCard className="py-4.5">
          <div className="flex flex-col justify-between h-full">
            <span className="stat-number text-slate-700 dark:text-slate-300">{avgSafetyScore}</span>
            <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mt-2.5">
              Site Safety Index
            </span>
            <div className="text-[9px] font-bold text-slate-550 dark:text-slate-500 mt-1">
              Critical limit threshold: &gt; 80
            </div>
          </div>
        </GlassCard>

      </div>

      {/* Main Charts & NLP Copilot Row (Dense grid) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Entrance Log Trends (6 cols) */}
        <GlassCard className="lg:col-span-6 flex flex-col justify-between h-96">
          <div className="flex items-center justify-between mb-4 border-b border-slate-300/40 dark:border-slate-800/60 pb-3">
            <div>
              <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Entrance Log Trends</h3>
              <p className="text-[10px] text-slate-550 dark:text-slate-500 mt-0.5">Verification metrics logged weekly.</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold uppercase">
              <span className="flex items-center gap-1 text-brand-success">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-success" /> Granted
              </span>
              <span className="flex items-center gap-1 text-brand-danger">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-danger" /> Denied
              </span>
            </div>
          </div>

          <div className="flex-1 w-full text-[10px] font-semibold">
            <ResponsiveContainer width="100%" height="90%">
              <LineChart data={weeklyTrends} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" />
                <XAxis dataKey="day" stroke="#64748b" fontSize={9} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141B2D',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="granted"
                  stroke="#22C55E"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="denied"
                  stroke="#EF4444"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* AI Safety Copilot Panel (6 cols) */}
        <div className="lg:col-span-6">
          <SafetyCopilot />
        </div>
      </div>

      {/* Sub-Analytics Deck (Three Columns, 4 cols each) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Trade Safety Levels (4 cols) */}
        <GlassCard className="flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-300/40 dark:border-slate-800/60 mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Trade Safety Levels</h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-500 mt-0.5">Average safety score percentage per trade.</p>
          </div>

          <div className="flex-1 w-full h-44 text-[9px] font-bold">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} layout="vertical" margin={{ top: 5, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" />
                <XAxis type="number" stroke="#64748b" fontSize={9} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" stroke="#64748b" fontSize={9} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141B2D',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="score" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                  {deptData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.score >= 90 ? '#22C55E' : entry.score >= 80 ? '#F97316' : '#EF4444'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Critical PPE Violations (4 cols) */}
        <GlassCard className="flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-300/40 dark:border-slate-800/60 mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Omitted safety gear</h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-500 mt-0.5">Frequency count of flagged missing items.</p>
          </div>

          <div className="space-y-2 mt-2 flex-1">
            {ppeViolationData.map((item) => (
              <div key={item.name} className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-slate-650 dark:text-slate-400">{item.name}</span>
                  <span className="text-slate-900 dark:text-slate-200 font-extrabold">{item.count} events</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary"
                    style={{ width: `${Math.min((item.count / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Site Zone Risk Log (4 cols) */}
        <GlassCard className="flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-300/40 dark:border-slate-800/60 mb-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Site Zone Risk Log</h3>
            <p className="text-[10px] text-slate-550 dark:text-slate-500 mt-0.5">Active risk level per zone.</p>
          </div>

          <div className="space-y-1.5 flex-1 select-text">
            {activeSite?.dangerZones.map((zone) => (
              <div
                key={zone.name}
                className="flex items-center justify-between p-2 bg-slate-200/50 dark:bg-[#1B2335]/40 rounded-lg border border-slate-300/40 dark:border-slate-800/40"
              >
                <div className="truncate w-28">
                  <p className="text-[10px] font-extrabold text-slate-800 dark:text-slate-200 truncate uppercase">{zone.name}</p>
                  <p className="text-[8px] text-slate-500 font-bold uppercase">{zone.level} Risk</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-black text-slate-800 dark:text-slate-200 bg-slate-300/70 dark:bg-slate-850 px-2 py-0.5 rounded-md">
                    {zone.workersInside} ON SITE
                  </span>
                  <span
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      zone.level === 'High'
                        ? 'bg-brand-danger pulse-red'
                        : zone.level === 'Medium'
                        ? 'bg-brand-warning'
                        : 'bg-brand-primary'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Recent Compliance Gate Checks Table */}
      <GlassCard className="pt-5">
        <div className="flex items-center justify-between mb-4 border-b border-slate-300/40 dark:border-slate-800/60 pb-3.5 px-1">
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Recent Compliance Checks</h3>
            <p className="text-[10px] text-slate-555 dark:text-slate-500 mt-0.5 font-medium">Real-time status updates of active worker scans.</p>
          </div>
          <Link
            to="/logs"
            className="text-[10px] font-extrabold text-brand-primary hover:underline uppercase tracking-wide inline-flex items-center gap-0.5"
          >
            Audit Logs Trail
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto w-full select-text">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-350 dark:border-slate-850 text-slate-500 text-[10px] font-black uppercase tracking-widest">
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Worker Identity</th>
                <th className="py-2.5 px-3">Trade Mapped</th>
                <th className="py-2.5 px-3">Helmet Status</th>
                <th className="py-2.5 px-3 text-center">Safety Rating</th>
                <th className="py-2.5 px-3">Gate Decision</th>
              </tr>
            </thead>
            <tbody>
              {siteLogs.slice(0, 4).map((log) => (
                <tr
                  key={log.id}
                  className="border-b border-slate-300/40 dark:border-slate-850 hover:bg-slate-200/20 dark:hover:bg-[#1B2335]/25 text-slate-650 dark:text-slate-350 transition-colors"
                >
                  <td className="py-3 px-3 font-semibold text-[10px] font-mono uppercase">
                    {formatDate(log.timestamp)}
                  </td>
                  <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">
                    {log.workerName}
                    <span className="block text-[9px] text-slate-500 font-semibold">{log.employeeId}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-[10px] text-slate-700 dark:text-slate-450 uppercase">{log.department}</td>
                  <td className="py-3 px-3 font-medium">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold border ${
                        log.helmetColorStatus === 'Passed'
                          ? 'bg-brand-success/5 border-brand-success/15 text-brand-success'
                          : log.helmetColorStatus === 'Failed'
                          ? 'bg-brand-danger/5 border-brand-danger/15 text-brand-danger'
                          : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {log.helmetColorDetected} {log.helmetColorStatus === 'Passed' ? 'PASSED' : 'VIOLATION'}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-center">
                    <span
                      className={`font-black text-[11px] px-2 py-0.5 rounded ${
                        log.safetyScore >= 90
                          ? 'text-brand-success bg-brand-success/5'
                          : log.safetyScore >= 80
                          ? 'text-brand-warning bg-brand-warning/5'
                          : 'text-brand-danger bg-brand-danger/5'
                      }`}
                    >
                      {log.safetyScore}%
                    </span>
                  </td>
                  <td className="py-3 px-3 font-bold">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded text-[10px] uppercase font-black border ${
                        log.status === 'Access Granted'
                          ? 'bg-brand-success/5 border-brand-success/15 text-brand-success'
                          : 'bg-brand-danger/5 border-brand-danger/15 text-brand-danger'
                      }`}
                    >
                      {log.status === 'Access Granted' ? 'GRANTED' : 'DENIED'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
};
