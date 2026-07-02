export interface Department {
  id: string;
  name: string;
  helmetColor: string;
  requiredPPE: string[];
}

export interface Worker {
  id: string;
  name: string;
  employeeId: string;
  department: string;
  bloodGroup: string;
  emergencyContact: string;
  experience: string; // e.g. "5 Years"
  certified: boolean;
  assignedSite: string;
  status: 'Active' | 'Suspended' | 'Off-duty';
  photoUrl?: string;
  safetyScore: number;
}

export interface IncidentReport {
  id: string;
  timestamp: string;
  workerName: string;
  employeeId: string;
  department: string;
  reason: string;
  photoUrl: string; // Base64 or placeholder
  confidence: number;
  supervisor: string;
  location: string;
}

export interface EntryLog {
  id: string;
  timestamp: string;
  workerName: string;
  employeeId: string;
  department: string;
  status: 'Access Granted' | 'Access Denied';
  helmetColorDetected: string;
  helmetColorStatus: 'Passed' | 'Failed' | 'N/A';
  detectedPPE: string[];
  missingPPE: string[];
  confidenceScore: number;
  safetyScore: number;
  photoUrl?: string;
}

export interface ConstructionSite {
  id: string;
  name: string;
  location: string;
  supervisor: string;
  activeWorkers: number;
  dangerZones: {
    name: string;
    level: 'High' | 'Medium' | 'Low';
    workersInside: number;
  }[];
}

export interface AlertNotification {
  id: string;
  timestamp: string;
  type: 'Violation' | 'System' | 'Critical';
  title: string;
  message: string;
  read: boolean;
}

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-1',
    name: 'Civil Labour',
    helmetColor: 'Yellow',
    requiredPPE: ['Helmet', 'Reflective Vest', 'Safety Shoes', 'Gloves'],
  },
  {
    id: 'dept-2',
    name: 'Electrical Engineer',
    helmetColor: 'Blue',
    requiredPPE: ['Helmet', 'Safety Goggles', 'Gloves', 'Safety Shoes'],
  },
  {
    id: 'dept-3',
    name: 'Site Supervisor',
    helmetColor: 'White',
    requiredPPE: ['Helmet', 'Reflective Vest', 'ID Card', 'Safety Shoes'],
  },
  {
    id: 'dept-4',
    name: 'Welder',
    helmetColor: 'Green',
    requiredPPE: ['Helmet', 'Face Shield', 'Reflective Vest', 'Gloves', 'Safety Shoes'],
  },
  {
    id: 'dept-5',
    name: 'Painter',
    helmetColor: 'Orange',
    requiredPPE: ['Helmet', 'Respirator', 'Safety Goggles', 'Reflective Vest'],
  },
  {
    id: 'dept-6',
    name: 'Plumber',
    helmetColor: 'Red',
    requiredPPE: ['Helmet', 'Gloves', 'Safety Shoes', 'Harness'],
  },
];

export const HELMET_COLORS_MAP: Record<string, string> = {
  White: 'Supervisor',
  Yellow: 'Labour',
  Blue: 'Engineer',
  Green: 'Safety Officer / Welder',
  Red: 'Fire Team / Plumber',
  Orange: 'Visitors / Painter',
};

export const INITIAL_SITES: ConstructionSite[] = [
  {
    id: 'site-1',
    name: 'Mumbai Terminal 3 Expansion',
    location: 'Sahar, Mumbai',
    supervisor: 'Col. Ranjit Singh',
    activeWorkers: 0,
    dangerZones: [
      { name: 'Crane Zone A', level: 'High', workersInside: 0 },
      { name: 'Excavation Pit B', level: 'High', workersInside: 0 },
      { name: 'Electrical Substation', level: 'Medium', workersInside: 0 },
      { name: 'High-Rise Scaffolding', level: 'High', workersInside: 0 },
      { name: 'Chemical Storage Unit', level: 'Low', workersInside: 0 },
    ],
  },
  {
    id: 'site-2',
    name: 'Delhi Metro Line-8 Extension',
    location: 'Janpath, New Delhi',
    supervisor: 'Vikram Malhotra',
    activeWorkers: 0,
    dangerZones: [
      { name: 'Tunnel Boring Machine', level: 'High', workersInside: 0 },
      { name: 'Concrete Batching Area', level: 'Medium', workersInside: 0 },
      { name: 'Overhead Cable Laying', level: 'High', workersInside: 0 },
    ],
  },
];

export const INITIAL_WORKERS: Worker[] = [];
export const INITIAL_ENTRY_LOGS: EntryLog[] = [];
export const INITIAL_INCIDENT_REPORTS: IncidentReport[] = [];
export const INITIAL_NOTIFICATIONS: AlertNotification[] = [];
