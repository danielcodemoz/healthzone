export interface User {
  id: number;
  name: string;
  username: string;
  avatar?: string;
  dob?: string;
  height?: number;
  weight?: number;
  blood_type?: string;
  is_admin: number;
  created_at: string;
}

export interface WaterEntry {
  id: number; user_id: number; amount: number; date: string; created_at: string;
}

export interface WaterData {
  entries: WaterEntry[]; total: number; goal: number;
}

export interface HeartRateLog {
  id: number; user_id: number; bpm: number; note?: string; recorded_at: string;
}

export interface Medication {
  id: number; user_id: number; name: string; dosage?: string; frequency?: string;
  time?: string; notes?: string; active: number;
}

export interface Allergy {
  id: number; user_id: number; name: string; severity: string; notes?: string;
}

export interface MedicalCondition {
  id: number; user_id: number; name: string; diagnosed_date?: string; notes?: string;
}

export interface EmergencyContact {
  id: number; user_id: number; name: string; phone: string; relationship?: string; is_primary: number;
}

export interface Appointment {
  id: number; user_id: number; doctor_name: string; specialty?: string;
  date: string; time?: string; status: string; notes?: string;
}

export interface HealthTip {
  id: number; category: string; title: string; content: string; icon?: string;
}

export interface UserSettings {
  theme: string; notifications_enabled: number; water_goal: number; reminder_interval: number;
}

export interface AnalyticsOverview {
  water: { total: number; goal: number };
  heartRate: number | null;
  bmi: number | null;
  activeMeds: number;
  streak: number;
  healthScore: number;
}
