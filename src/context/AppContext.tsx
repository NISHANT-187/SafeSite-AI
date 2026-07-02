import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Department,
  Worker,
  IncidentReport,
  EntryLog,
  ConstructionSite,
  AlertNotification,
} from '../utils/mockData';
import {
  INITIAL_DEPARTMENTS,
  INITIAL_WORKERS,
  INITIAL_ENTRY_LOGS,
  INITIAL_INCIDENT_REPORTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SITES,
} from '../utils/mockData';

interface AppContextType {
  departments: Department[];
  workers: Worker[];
  entryLogs: EntryLog[];
  incidentReports: IncidentReport[];
  sites: ConstructionSite[];
  notifications: AlertNotification[];
  currentUser: { name: string; role: string; token?: string } | null;
  activeSite: ConstructionSite | null;
  
  // Actions
  addWorker: (worker: Omit<Worker, 'id' | 'safetyScore'>) => void;
  updateWorker: (worker: Worker) => void;
  addEntryLog: (log: Omit<EntryLog, 'id' | 'timestamp'>) => void;
  addIncidentReport: (incident: Omit<IncidentReport, 'id' | 'timestamp'>) => void;
  updateDepartmentRules: (id: string, helmetColor: string, requiredPPE: string[]) => void;
  addDepartment: (name: string, helmetColor: string, requiredPPE: string[]) => void;
  addSite: (name: string, location: string, supervisor: string) => void;
  deleteWorker: (id: string) => void;
  clearAllLogs: () => void;
  markNotificationsAsRead: () => void;
  loginUser: (name: string, role: string) => boolean;
  logoutUser: () => void;
  setActiveSiteById: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial states from localStorage or defaults
  const [departments, setDepartments] = useState<Department[]>(() => {
    const saved = localStorage.getItem('safesite_departments');
    return saved ? JSON.parse(saved) : INITIAL_DEPARTMENTS;
  });

  const [workers, setWorkers] = useState<Worker[]>(() => {
    const saved = localStorage.getItem('safesite_workers');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasMock = parsed.some((w: any) => 
        ['Rajesh Sharma', 'Amit Mishra', 'Vikram Rathore', 'Priya Nair', 'Gurpreet Singh', 'David Parker'].includes(w.name)
      );
      if (hasMock) {
        localStorage.removeItem('safesite_workers');
        return INITIAL_WORKERS;
      }
      return parsed;
    }
    return INITIAL_WORKERS;
  });

  const [entryLogs, setEntryLogs] = useState<EntryLog[]>(() => {
    const saved = localStorage.getItem('safesite_entry_logs');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasMock = parsed.some((l: any) => 
        ['Rajesh Sharma', 'Amit Mishra', 'Vikram Rathore', 'Priya Nair', 'Gurpreet Singh', 'David Parker'].includes(l.workerName)
      );
      if (hasMock) {
        localStorage.removeItem('safesite_entry_logs');
        return INITIAL_ENTRY_LOGS;
      }
      return parsed;
    }
    return INITIAL_ENTRY_LOGS;
  });

  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(() => {
    const saved = localStorage.getItem('safesite_incident_reports');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasMock = parsed.some((i: any) => 
        ['Rajesh Sharma', 'Amit Mishra', 'Vikram Rathore', 'Priya Nair', 'Gurpreet Singh', 'David Parker'].includes(i.workerName)
      );
      if (hasMock) {
        localStorage.removeItem('safesite_incident_reports');
        return INITIAL_INCIDENT_REPORTS;
      }
      return parsed;
    }
    return INITIAL_INCIDENT_REPORTS;
  });

  const [sites, setSites] = useState<ConstructionSite[]>(() => {
    const saved = localStorage.getItem('safesite_sites');
    return saved ? JSON.parse(saved) : INITIAL_SITES;
  });

  const [notifications, setNotifications] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('safesite_notifications');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasMock = parsed.some((n: any) => 
        n.message.includes('Sharma') || n.message.includes('Mishra') || n.message.includes('Parker')
      );
      if (hasMock) {
        localStorage.removeItem('safesite_notifications');
        return INITIAL_NOTIFICATIONS;
      }
      return parsed;
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [currentUser, setCurrentUser] = useState<{ name: string; role: string; token?: string } | null>(() => {
    const saved = localStorage.getItem('safesite_current_user');
    return saved ? JSON.parse(saved) : { name: 'Admin User', role: 'Admin' };
  });

  const [activeSite, setActiveSite] = useState<ConstructionSite | null>(() => {
    const saved = localStorage.getItem('safesite_active_site');
    if (saved) return JSON.parse(saved);
    return sites.length > 0 ? sites[0] : null;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('safesite_departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('safesite_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('safesite_entry_logs', JSON.stringify(entryLogs));
  }, [entryLogs]);

  useEffect(() => {
    localStorage.setItem('safesite_incident_reports', JSON.stringify(incidentReports));
  }, [incidentReports]);

  useEffect(() => {
    localStorage.setItem('safesite_sites', JSON.stringify(sites));
  }, [sites]);

  useEffect(() => {
    localStorage.setItem('safesite_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('safesite_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('safesite_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (activeSite) {
      localStorage.setItem('safesite_active_site', JSON.stringify(activeSite));
    } else {
      localStorage.removeItem('safesite_active_site');
    }
  }, [activeSite]);

  // Worker CRUD
  const addWorker = (workerData: Omit<Worker, 'id' | 'safetyScore'>) => {
    const newWorker: Worker = {
      ...workerData,
      id: `w-${Date.now()}`,
      safetyScore: 100, // Default perfect score
    };
    setWorkers((prev) => [newWorker, ...prev]);

    // Send a system notification
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      timestamp: new Date().toISOString(),
      type: 'System',
      title: 'New Worker Registered',
      message: `${newWorker.name} (${newWorker.employeeId}) registered under ${newWorker.department}.`,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const updateWorker = (updatedWorker: Worker) => {
    setWorkers((prev) =>
      prev.map((w) => (w.id === updatedWorker.id ? updatedWorker : w))
    );
  };

  const deleteWorker = (id: string) => {
    setWorkers((prev) => prev.filter((w) => w.id !== id));
  };

  // Logs & Incidents
  const addEntryLog = (logData: Omit<EntryLog, 'id' | 'timestamp'>) => {
    const timestamp = new Date().toISOString();
    const newLog: EntryLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp,
    };
    
    setEntryLogs((prev) => [newLog, ...prev]);

    // Recalculate worker's latest safety score based on this check
    setWorkers((prev) =>
      prev.map((w) => {
        if (w.employeeId === logData.employeeId) {
          return {
            ...w,
            safetyScore: logData.safetyScore,
            status: logData.status === 'Access Denied' && logData.safetyScore < 80 ? 'Suspended' : 'Active',
          };
        }
        return w;
      })
    );

    // If access was denied, send notification and add incident report
    if (logData.status === 'Access Denied') {
      // 1. Alert Notification
      const newNotif: AlertNotification = {
        id: `notif-${Date.now()}`,
        timestamp,
        type: 'Violation',
        title: `Access Denied - ${logData.workerName}`,
        message: `${logData.workerName} (${logData.employeeId}) was denied access at ${activeSite?.name || 'Site'}. Missing: ${logData.missingPPE.join(', ')}`,
        read: false,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // 2. Incident Report
      const missingDetails = logData.missingPPE.length > 0 
        ? `Missing ${logData.missingPPE.join(', ')}` 
        : '';
      const colorDetails = logData.helmetColorStatus === 'Failed' 
        ? `Wrong helmet color (Detected ${logData.helmetColorDetected})` 
        : '';
      
      const reason = [missingDetails, colorDetails].filter(Boolean).join(', ');

      addIncidentReport({
        workerName: logData.workerName,
        employeeId: logData.employeeId,
        department: logData.department,
        reason: reason || 'Safety score below acceptable threshold (80%)',
        photoUrl: logData.photoUrl || 'https://images.unsplash.com/photo-1589793907316-f94015546115?q=80&w=250&auto=format&fit=crop',
        confidence: logData.confidenceScore,
        supervisor: activeSite?.supervisor || 'Site Admin',
        location: activeSite?.name || 'Main Gate Entrance',
      });
    }
  };

  const addIncidentReport = (incidentData: Omit<IncidentReport, 'id' | 'timestamp'>) => {
    const newIncident: IncidentReport = {
      ...incidentData,
      id: `inc-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setIncidentReports((prev) => [newIncident, ...prev]);
  };

  // Rule configuration
  const updateDepartmentRules = (id: string, helmetColor: string, requiredPPE: string[]) => {
    setDepartments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, helmetColor, requiredPPE } : d))
    );
  };

  const addDepartment = (name: string, helmetColor: string, requiredPPE: string[]) => {
    const newDept: Department = {
      id: `dept-${Date.now()}`,
      name,
      helmetColor,
      requiredPPE,
    };
    setDepartments((prev) => [...prev, newDept]);
  };

  // Site configuration
  const addSite = (name: string, location: string, supervisor: string) => {
    const newSite: ConstructionSite = {
      id: `site-${Date.now()}`,
      name,
      location,
      supervisor,
      activeWorkers: 0,
      dangerZones: [
        { name: 'Crane Zone A', level: 'High', workersInside: 0 },
        { name: 'Excavation Pit', level: 'High', workersInside: 0 },
        { name: 'Electrical Room', level: 'Medium', workersInside: 0 },
      ],
    };
    setSites((prev) => [...prev, newSite]);
  };

  const clearAllLogs = () => {
    setEntryLogs([]);
    setIncidentReports([]);
    localStorage.removeItem('safesite_entry_logs');
    localStorage.removeItem('safesite_incident_reports');
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Authentication
  const loginUser = (name: string, role: string): boolean => {
    if (name.trim()) {
      setCurrentUser({ name, role, token: 'mock-jwt-token-' + Date.now() });
      return true;
    }
    return false;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const setActiveSiteById = (id: string) => {
    const found = sites.find((s) => s.id === id);
    if (found) setActiveSite(found);
  };

  return (
    <AppContext.Provider
      value={{
        departments,
        workers,
        entryLogs,
        incidentReports,
        sites,
        notifications,
        currentUser,
        activeSite,
        addWorker,
        updateWorker,
        addEntryLog,
        addIncidentReport,
        updateDepartmentRules,
        addDepartment,
        addSite,
        deleteWorker,
        clearAllLogs,
        markNotificationsAsRead,
        loginUser,
        logoutUser,
        setActiveSiteById,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
