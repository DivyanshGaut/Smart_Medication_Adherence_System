// src/api.ts - Unified API Client connecting to Spring Boot & H2 Database

export interface User {
  id: number
  email: string
  name: string
  timezone: string
  pushNotifications: boolean
  emailReports: boolean
  caregiverAlerts: boolean
}

export interface AuthResponse {
  token: string
  user: User
  message?: string
}

export interface Medication {
  id: number
  name: string
  dosage: string
  detail: string
  pillCount: number
  totalCapacity: number
  color: string
  icon: string
  scheduleTime: string
  refillDate: string
  active: boolean
}

export interface DoseItem {
  medicationId: number
  time: string
  name: string
  detail: string
  color: string
  status: string // Taken, Due soon, Upcoming, Snoozed, Missed
  icon: string
}

export interface ScoreBreakdown {
  taken: number
  missed: number
  skipped: number
  adherencePercent: number
}

export interface TrendChart {
  labels: string[]
  values: number[]
  average: number
}

export interface MedicationStock {
  name: string
  count: string
  width: string
  date: string
  color: string
}

export interface DashboardOverview {
  adherenceRate: number
  todayTaken: number
  todayTotal: number
  streakDays: number
  bestStreakDays: number
  missedDosesCount: number
  todaySchedule: DoseItem[]
  scoreBreakdown: ScoreBreakdown
  trend: TrendChart
  inventory: MedicationStock[]
  consistencyHeatmap: string[][]
}

export interface ScheduleItem {
  id: number
  title: string
  frequency: string
  timeStr: string
  medicationName: string
  active: boolean
}

export interface CareCircleItem {
  id: number
  name: string
  relationship: string
  status: string
  email?: string
  phone?: string
}

export interface DoseHistoryItem {
  id: number
  medicationName: string
  scheduledTime: string
  doseDate: string
  status: string
  notes: string
  loggedAt: string
}

export interface InsightData {
  bestDay: string
  bestDayStat: string
  needsAttention: string
  needsAttentionStat: string
  strongestMed: string
  strongestMedStat: string
  rankings: { name: string; adherencePercentage: number }[]
  insightTitle: string
  insightDescription: string
  suggestedAction: string
}

const TOKEN_KEY = 'elowen_jwt_token'
const USER_KEY = 'elowen_current_user'

// Base URL: prefers Vite proxy /api or falls back to direct http://localhost:8080/api
const API_BASE = '/api'
const DIRECT_API_BASE = 'http://localhost:8080/api'

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setStoredAuth(token: string, user: User) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function getStoredUser(): User | null {
  const data = localStorage.getItem(USER_KEY)
  if (!data) return null
  try {
    return JSON.parse(data)
  } catch {
    return null
  }
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    })
  } catch (err) {
    // If proxy failed, attempt direct backend call
    try {
      response = await fetch(`${DIRECT_API_BASE}${endpoint}`, {
        ...options,
        headers,
      })
    } catch {
      throw new Error('Unable to connect to Elowen backend server. Ensure Spring Boot is running on port 8080.')
    }
  }

  if (!response.ok) {
    let errorMsg = `Request failed: ${response.status} ${response.statusText}`
    try {
      const errJson = await response.json()
      if (errJson.error) errorMsg = errJson.error
      if (errJson.message) errorMsg = errJson.message
    } catch {}
    throw new Error(errorMsg)
  }

  return response.json()
}

export const api = {
  auth: {
    async login(email: string, password: string): Promise<AuthResponse> {
      const res = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setStoredAuth(res.token, res.user)
      return res
    },

    async register(email: string, password: string, name?: string): Promise<AuthResponse> {
      const res = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name }),
      })
      setStoredAuth(res.token, res.user)
      return res
    },

    async loginGoogle(): Promise<AuthResponse> {
      const res = await apiRequest<AuthResponse>('/auth/google', {
        method: 'POST',
      })
      setStoredAuth(res.token, res.user)
      return res
    },

    async getMe(): Promise<User> {
      const user = await apiRequest<User>('/auth/me')
      localStorage.setItem(USER_KEY, JSON.stringify(user))
      return user
    },

    logout() {
      clearStoredAuth()
    },
  },

  dashboard: {
    getOverview(): Promise<DashboardOverview> {
      return apiRequest<DashboardOverview>('/dashboard/overview')
    },
  },

  medications: {
    list(): Promise<Medication[]> {
      return apiRequest<Medication[]>('/medications')
    },
    create(data: { name: string; dosage?: string; detail?: string; pillCount?: number; totalCapacity?: number; color?: string; icon?: string; scheduleTime?: string; refillDate?: string }): Promise<Medication> {
      return apiRequest<Medication>('/medications', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    update(id: number, data: Partial<Medication>): Promise<Medication> {
      return apiRequest<Medication>(`/medications/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    delete(id: number): Promise<{ message: string }> {
      return apiRequest<{ message: string }>(`/medications/${id}`, {
        method: 'DELETE',
      })
    },
  },

  doses: {
    action(medicationId?: number, medicationName?: string, status: string = 'TAKEN', notes?: string): Promise<any> {
      return apiRequest('/doses/action', {
        method: 'POST',
        body: JSON.stringify({ medicationId, medicationName, status, notes }),
      })
    },
    getHistory(): Promise<DoseHistoryItem[]> {
      return apiRequest<DoseHistoryItem[]>('/doses/history')
    },
  },

  schedules: {
    list(): Promise<ScheduleItem[]> {
      return apiRequest<ScheduleItem[]>('/schedules')
    },
    create(data: { title: string; frequency?: string; timeStr?: string; medicationName?: string }): Promise<ScheduleItem> {
      return apiRequest<ScheduleItem>('/schedules', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    delete(id: number): Promise<{ message: string }> {
      return apiRequest<{ message: string }>(`/schedules/${id}`, {
        method: 'DELETE',
      })
    },
    createNaturalLanguage(prompt: string): Promise<ScheduleItem> {
      return apiRequest<ScheduleItem>('/schedules/natural-language', {
        method: 'POST',
        body: JSON.stringify({ prompt }),
      })
    },
  },

  careCircle: {
    list(): Promise<CareCircleItem[]> {
      return apiRequest<CareCircleItem[]>('/care-circle')
    },
    create(data: { name: string; relationship?: string; status?: string; email?: string; phone?: string }): Promise<CareCircleItem> {
      return apiRequest<CareCircleItem>('/care-circle', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    },
    delete(id: number): Promise<{ message: string }> {
      return apiRequest<{ message: string }>(`/care-circle/${id}`, {
        method: 'DELETE',
      })
    },
  },

  insights: {
    get(): Promise<InsightData> {
      return apiRequest<InsightData>('/insights')
    },
    refresh(): Promise<InsightData> {
      return apiRequest<InsightData>('/insights/refresh', {
        method: 'POST',
      })
    },
  },

  user: {
    getProfile(): Promise<User> {
      return apiRequest<User>('/user/profile')
    },
    updateProfile(data: { name?: string; email?: string; timezone?: string }): Promise<User> {
      return apiRequest<User>('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
    updateNotifications(data: { pushNotifications?: boolean; emailReports?: boolean; caregiverAlerts?: boolean }): Promise<User> {
      return apiRequest<User>('/user/notifications', {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    },
  },
}
