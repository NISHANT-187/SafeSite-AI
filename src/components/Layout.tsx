import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import {
  LayoutDashboard,
  Camera,
  Users,
  Sliders,
  ClipboardList,
  AlertTriangle,
  TrendingUp,
  Settings,
  User,
  LogOut,
  Bell,
  Sun,
  Moon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Shield,
  MapPin,
  CheckCircle,
  Eye,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    currentUser,
    logoutUser,
    notifications,
    sites,
    activeSite,
    setActiveSiteById,
    markNotificationsAsRead,
  } = useApp();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Clock tick interval
  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTimeStr(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(
          d.getHours()
        ).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);
  
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  // Grouped Navigation Items matching industrial brief
  const operationsNav = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Live Inspection', path: '/camera', icon: Camera },
    { label: 'Worker Access', path: '/workers', icon: Users },
    { label: 'Access Violations', path: '/incidents', icon: AlertTriangle },
  ];

  const safetyNav = [
    { label: 'PPE Rules & Trades', path: '/departments', icon: Sliders },
    { label: 'Compliance Audits', path: '/logs', icon: ClipboardList },
    { label: 'Accident Analytics', path: '/analytics', icon: TrendingUp },
  ];

  const adminNav = [
    { label: 'CCTV Site Monitors', path: '/cctv', icon: Eye },
    { label: 'Config Settings', path: '/settings', icon: Settings },
    { label: 'Operator Clearance', path: '/profile', icon: User },
  ];

  const allNavItems = [...operationsNav, ...safetyNav, ...adminNav];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F5F7FA] dark:bg-[#0B1220] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-200">
      
      {/* Mobile Top Navbar */}
      <header className="glass-nav sticky top-0 z-40 flex items-center justify-between px-6 py-4 md:hidden">
        <div className="flex items-center gap-2">
          <Shield className="w-6 h-6 text-brand-primary" />
          <span className="text-md font-black tracking-tight text-slate-900 dark:text-white">
            SAFESITE AI
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg hover:bg-slate-500/10"
          >
            <Bell className="w-5 h-5 text-slate-550 dark:text-slate-400" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-brand-danger rounded-full pulse-red" />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-slate-500/10"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-nav fixed top-[64px] left-0 right-0 z-30 p-5 flex flex-col gap-3 md:hidden shadow-xl"
          >
            <div className="text-[10px] font-bold text-slate-550 uppercase tracking-widest px-2 mb-1">
              Inspection Links
            </div>
            {allNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-brand-primary/10 text-brand-primary border border-brand-primary/20'
                      : 'text-slate-550 dark:text-slate-450 hover:bg-slate-500/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
            <div className="border-t border-slate-300 dark:border-slate-800 pt-4 mt-2 flex flex-col gap-2.5">
              <div className="flex justify-between items-center px-4">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Active Hub</span>
                <span className="text-xs font-bold text-brand-primary">{activeSite?.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-brand-danger hover:bg-brand-danger/10"
              >
                <LogOut className="w-4 h-4" />
                Logout Credentials
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (Autodesk / Honeywell style, Collapsible, Subtle Glass) */}
      <aside
        className={`hidden md:flex flex-col min-h-screen sticky top-0 border-r border-slate-300/40 dark:border-slate-800/60 bg-[#FFFFFF]/80 dark:bg-[#141B2D]/85 backdrop-blur-2xl z-20 transition-all duration-200 select-none ${
          isCollapsed ? 'w-20 p-4' : 'w-72 p-6'
        }`}
      >
        {/* Company Branding */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="p-2.5 bg-brand-primary/10 rounded-xl border border-brand-primary/20 shrink-0">
              <Shield className="w-5 h-5 text-brand-primary" />
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <h1 className="text-sm font-black tracking-tight text-slate-900 dark:text-white uppercase">
                  SafeSite AI
                </h1>
                <p className="text-[9px] text-slate-550 dark:text-slate-500 font-bold uppercase tracking-wider">
                  Compliance OS
                </p>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-lg hover:bg-slate-500/10 text-slate-400 dark:text-slate-650 cursor-pointer hidden lg:block"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Hub Switcher Selector (Only when expanded) */}
        {!isCollapsed && (
          <div className="mb-6 bg-slate-200/50 dark:bg-[#1B2335]/60 border border-slate-300/30 dark:border-slate-800/40 p-2.5 rounded-xl">
            <label className="text-[9px] text-slate-500 dark:text-slate-550 font-black uppercase tracking-wider block mb-1.5 px-0.5">
              Active Control Site
            </label>
            <div className="relative">
              <select
                value={activeSite?.id || ''}
                onChange={(e) => setActiveSiteById(e.target.value)}
                className="w-full bg-[#FFFFFF]/90 dark:bg-[#141B2D]/90 border border-slate-300 dark:border-slate-850 rounded-lg px-2.5 py-1.5 text-xs font-semibold focus:outline-none focus:border-brand-primary/50 appearance-none cursor-pointer text-slate-800 dark:text-slate-300"
              >
                {sites.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-slate-400">
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>
          </div>
        )}

        {/* Grouped Sidebar links */}
        <nav className="flex-1 space-y-5 overflow-y-auto pr-1">
          {/* Operations group */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 dark:text-slate-550 font-black tracking-widest block uppercase px-2 pb-1">
                Operations
              </span>
            )}
            {operationsNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                    isActive ? 'text-brand-primary font-bold' : 'text-slate-550 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-brand-primary/8 dark:bg-brand-primary/10 border border-brand-primary/15 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-[1.02] ${isActive ? 'text-brand-primary' : 'text-slate-500 dark:text-slate-500'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Safety group */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 dark:text-slate-550 font-black tracking-widest block uppercase px-2 pb-1">
                Safety
              </span>
            )}
            {safetyNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                    isActive ? 'text-brand-primary font-bold' : 'text-slate-550 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-brand-primary/8 dark:bg-brand-primary/10 border border-brand-primary/15 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-[1.02] ${isActive ? 'text-brand-primary' : 'text-slate-500 dark:text-slate-500'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>

          {/* Administration group */}
          <div className="space-y-1">
            {!isCollapsed && (
              <span className="text-[9px] text-slate-500 dark:text-slate-550 font-black tracking-widest block uppercase px-2 pb-1">
                Administration
              </span>
            )}
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 relative group ${
                    isActive ? 'text-brand-primary font-bold' : 'text-slate-550 dark:text-slate-450 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 bg-brand-primary/8 dark:bg-brand-primary/10 border border-brand-primary/15 rounded-xl -z-10"
                      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                    />
                  )}
                  <Icon className={`w-4.5 h-4.5 shrink-0 transition-transform group-hover:scale-[1.02] ${isActive ? 'text-brand-primary' : 'text-slate-500 dark:text-slate-500'}`} />
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer profile segment */}
        <div className="border-t border-slate-300/60 dark:border-slate-800/60 pt-4 mt-4 space-y-3 shrink-0">
          {!isCollapsed && (
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center font-bold text-brand-primary text-xs uppercase">
                  {currentUser?.name.substring(0, 2) || 'SA'}
                </div>
                <div className="truncate w-28">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate leading-none mb-0.5">
                    {currentUser?.name || 'Operator'}
                  </p>
                  <p className="text-[9px] text-slate-550 dark:text-slate-500 font-black uppercase tracking-wider">
                    {currentUser?.role || ' clearance'}
                  </p>
                </div>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="p-1.5 rounded-lg hover:bg-slate-500/10 border border-slate-300 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-250 cursor-pointer"
                title="Toggle Interface Color Theme"
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              </button>
            </div>
          )}

          <button
            onClick={handleLogout}
            className={`flex items-center justify-center gap-2 border border-slate-350 dark:border-slate-800/80 rounded-xl py-2 text-xs font-bold text-brand-danger hover:bg-brand-danger/5 hover:border-brand-danger/25 transition-all duration-150 cursor-pointer ${
              isCollapsed ? 'w-full px-0' : 'w-full px-3'
            }`}
            title="Log Out Security Session"
          >
            <LogOut className="w-3.5 h-3.5" />
            {!isCollapsed && <span>Logout Session</span>}
          </button>
        </div>
      </aside>

      {/* Main Panel Content & Sticky Top Nav Bar */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F5F7FA] dark:bg-[#0B1220] overflow-y-auto">
        
        {/* Sticky Top Header Navigation */}
        <header className="hidden md:flex items-center justify-between px-8 py-3.5 border-b border-slate-300/40 dark:border-slate-800/60 bg-[#FFFFFF]/80 dark:bg-[#0B1220]/80 backdrop-blur-md sticky top-0 z-30">
          
          {/* Site Filter / Search info */}
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-brand-primary" />
            <span className="text-[11px] font-bold text-slate-550 dark:text-slate-450 uppercase tracking-wide">
              Site Hub:
            </span>
            <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200 bg-slate-200/60 dark:bg-brand-primary/10 px-3 py-1 rounded-lg border border-slate-300 dark:border-brand-primary/20">
              {activeSite?.name}
            </span>
            
            {/* Live Clock Telemetry */}
            <span className="text-[11px] font-mono text-slate-450 dark:text-slate-550 ml-4 font-bold">
              SYSTEM TIME: {timeStr}
            </span>
          </div>

          {/* Telemetry Status badge */}
          <div className="flex items-center gap-4">
            
            {/* HMI Status Badge */}
            <div className="badge-status badge-online">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-primary pulse-green" />
              <span>INSPECTION ACTIVE</span>
            </div>

            {/* Notifications Drawer */}
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 bg-[#FFFFFF] dark:bg-[#141B2D] hover:bg-slate-100 dark:hover:bg-[#1B2335] rounded-xl border border-slate-300 dark:border-slate-800/80 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-slate-650 dark:text-slate-300" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-danger rounded-full pulse-red" />
              )}
            </button>
          </div>
        </header>

        {/* Dynamic page routes render container */}
        <div className="flex-1 p-6 md:p-8 select-text">
          {children}
        </div>
      </main>

      {/* Floating Notifications Drawer */}
      <AnimatePresence>
        {isNotifOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs"
              onClick={() => setIsNotifOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, x: 120 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 120 }}
              transition={{ type: 'tween', duration: 0.18 }}
              className="glass-nav fixed top-0 right-0 bottom-0 w-80 md:w-96 z-50 p-6 flex flex-col shadow-2xl"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-300 dark:border-slate-850">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-brand-primary" />
                  <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Active Safety Alerts</h3>
                  {unreadCount > 0 && (
                    <span className="bg-brand-danger text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsNotifOpen(false)}
                  className="p-1 rounded-full hover:bg-slate-500/10 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Ticker alert list */}
              <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1 text-xs select-text">
                {notifications.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500">
                    <CheckCircle className="w-8 h-8 mb-2 text-slate-600" />
                    <p className="text-xs">No active alerts</p>
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border leading-relaxed transition-colors ${
                        notif.read
                          ? 'bg-slate-200/40 dark:bg-slate-900/20 border-slate-300 dark:border-slate-800/45 text-slate-500 dark:text-slate-400'
                          : 'bg-brand-primary/5 border-brand-primary/20 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`font-black uppercase text-[9px] px-2 py-0.5 rounded-md border ${
                            notif.type === 'Violation'
                              ? 'bg-brand-danger/8 border-brand-danger/15 text-brand-danger'
                              : 'bg-brand-primary/8 border-brand-primary/15 text-brand-primary'
                          }`}
                        >
                          {notif.type}
                        </span>
                        <span className="text-[10px] text-slate-500 font-bold">
                          {new Date(notif.timestamp).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <h4 className="font-extrabold mb-0.5 text-slate-900 dark:text-white">{notif.title}</h4>
                      <p className="text-[11px] text-slate-550 dark:text-slate-400 leading-normal">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>

              {unreadCount > 0 && (
                <button
                  onClick={markNotificationsAsRead}
                  className="w-full py-2.5 bg-brand-primary hover:bg-brand-primary/95 text-white rounded-xl text-xs font-bold transition-colors mt-auto shadow-md"
                >
                  Mark All Alerts Acknowledged
                </button>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
