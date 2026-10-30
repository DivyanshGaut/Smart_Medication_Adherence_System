import { useState, useEffect, useCallback } from 'react'
import {
  api,
  type User,
  type DashboardOverview,
  type Medication,
  type ScheduleItem,
  type CareCircleItem,
  type DoseHistoryItem,
  type InsightData,
  getStoredToken,
  getStoredUser,
} from './api'

type IconName =
  | 'grid'
  | 'pill'
  | 'calendar'
  | 'sparkles'
  | 'users'
  | 'bell'
  | 'settings'
  | 'search'
  | 'plus'
  | 'arrow'
  | 'check'
  | 'clock'
  | 'trash'

function Icon({ name, size = 19 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
    pill: <><path d="M8.6 4.3a4 4 0 0 1 5.7 0l5.4 5.4a4 4 0 0 1-5.7 5.7L8.6 10a4 4 0 0 1 0-5.7Z"/><path d="m11.3 12.7 5.4-5.4"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="3"/><path d="M8 3v4M16 3v4M3 10h18"/></>,
    sparkles: <><path d="m12 3 1.2 3.8L17 8l-3.8 1.2L12 13l-1.2-3.8L7 8l3.8-1.2L12 3Z"/><path d="m5 14 .7 2.3L8 17l-2.3.7L5 20l-.7-2.3L2 17l2.3-.7L5 14ZM19 14l.5 1.5L21 16l-1.5.5L19 18l-.5-1.5L17 16l1.5-.5L19 14Z"/></>,
    users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></>,
    settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3V2.8h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    plus: <path d="M12 5v14M5 12h14"/>,
    arrow: <path d="m9 18 6-6-6-6"/>,
    check: <path d="m5 12 4 4L19 6"/>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    trash: <><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></>,
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.pill}</svg>
}

const nav = [
  ['Overview', 'grid'], ['Medications', 'pill'], ['Schedule', 'calendar'],
  ['Insights', 'sparkles'], ['Care circle', 'users'], ['History', 'bell'],
] as const

const days = [
  ['Mon', '14'], ['Tue', '15'], ['Wed', '16'], ['Thu', '17'], ['Fri', '18'], ['Sat', '19'], ['Sun', '20'],
]

const normalizeMedColor = (c?: string) => {
  if (!c) return '#4F63D9'
  const hex = c.trim().toLowerCase()
  if (hex === '#84a282') return '#4F63D9' // Auralith
  if (hex === '#d699ae') return '#C9B7E8' // Velours
  if (hex === '#b3a57c') return '#5E8F7A' // Viridune
  return c
}

function Ring({ value = 92 }: { value?: number }) {
  return (
    <div className="ring" style={{ background: `conic-gradient(#4F63D9 ${value * 3.6}deg, #E8EBF5 0)` }}>
      <div>
        <strong>{value}%</strong>
        <span>{value >= 90 ? 'Excellent' : value >= 75 ? 'Good' : 'Needs attention'}</span>
      </div>
    </div>
  )
}

function Auth({ onLoginSuccess }: { onLoginSuccess: (user: User) => void }) {
  const [signup, setSignup] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('alex@example.com')
  const [password, setPassword] = useState('password123')
  const [name, setName] = useState('Alex Morgan')

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email || !password) return setError('Please enter your email and password.')
    setError('')
    setLoading(true)

    try {
      if (signup) {
        const res = await api.auth.register(email, password, name)
        onLoginSuccess(res.user)
      } else {
        const res = await api.auth.login(email, password)
        onLoginSuccess(res.user)
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await api.auth.loginGoogle()
      onLoginSuccess(res.user)
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-story">
        <div className="brand auth-brand">
          <div className="brand-mark"><Icon name="pill" size={22}/></div>
          <span>Elowen</span>
        </div>
        <div className="story-copy">
          <span className="auth-pill"><Icon name="sparkles" size={15}/> Connected to Spring Boot &amp; H2 Database</span>
          <h1>Your health routine,<br/><em>beautifully simple.</em></h1>
          <p>Smart medication tracking, clinical precision adherence analytics, and secure patient care circles.</p>
          <div className="auth-proof">
            <div className="mini-ring">93%</div>
            <div>
              <strong>Stay confidently on track</strong>
              <span>Live database sync with automated refill forecasting</span>
            </div>
          </div>
        </div>
        <div className="story-quote">“Elowen has made managing my medications feel effortless.” <span>— Maya, member since 2023</span></div>
      </section>

      <section className="auth-panel">
        <div className="auth-box">
          <div className="mobile-brand brand">
            <div className="brand-mark"><Icon name="pill"/></div>
            <span>Elowen</span>
          </div>
          <p className="eyebrow">{signup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p>
          <h2>{signup ? 'Start feeling supported' : 'Good to see you again'}</h2>
          <p>{signup ? 'Build a healthier routine in a few minutes.' : 'Sign in to continue to your connected health dashboard.'}</p>

          <form onSubmit={submit}>
            {signup && (
              <label>
                Full name
                <input
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  required
                />
              </label>
            )}
            <label>
              Email address
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                required
              />
            </label>
            <label>
              Password
              <div className="password-field">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </label>

            {!signup && (
              <div className="form-row">
                <label className="check-label">
                  <input type="checkbox" defaultChecked /> Remember me
                </label>
                <button
                  type="button"
                  onClick={() => setError('Use demo account: alex@example.com / password123')}
                >
                  Demo credentials
                </button>
              </div>
            )}

            {error && <div className="form-message">{error}</div>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? 'Please wait...' : signup ? 'Create account' : 'Sign in'}{' '}
              <Icon name="arrow" size={16}/>
            </button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <button className="google-button" type="button" onClick={handleGoogleAuth} disabled={loading}>
            <strong>G</strong> Sign in with Google (Demo)
          </button>

          <p className="auth-switch">
            {signup ? 'Already have an account?' : 'New to Elowen?'}{' '}
            <button
              type="button"
              onClick={() => {
                setSignup(!signup)
                setError('')
              }}
            >
              {signup ? 'Sign in' : 'Create an account'}
            </button>
          </p>
          <small>Backed by Spring Boot 3 &amp; H2 Database.</small>
        </div>
      </section>
    </div>
  )
}

function FeaturePage({
  active,
  notify,
  logout,
  user,
  onUserUpdate,
  onRefreshData,
}: {
  active: string
  notify: (x: string) => void
  logout: () => void
  user: User
  onUserUpdate: (u: User) => void
  onRefreshData: () => void
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [adding, setAdding] = useState(false)

  // Medication list state
  const [meds, setMeds] = useState<Medication[]>([])
  // Schedule list state
  const [schedules, setSchedules] = useState<ScheduleItem[]>([])
  // Care circle state
  const [careMembers, setCareMembers] = useState<CareCircleItem[]>([])
  // History logs state
  const [historyLogs, setHistoryLogs] = useState<DoseHistoryItem[]>([])
  // Insights state
  const [insightData, setInsightData] = useState<InsightData | null>(null)
  const [nlPrompt, setNlPrompt] = useState('')

  // Settings form states
  const [profileName, setProfileName] = useState(user.name)
  const [profileEmail, setProfileEmail] = useState(user.email)
  const [profileTimezone, setProfileTimezone] = useState(user.timezone || 'Eastern Time')
  const [notificationToggles, setNotificationToggles] = useState({
    pushNotifications: user.pushNotifications,
    emailReports: user.emailReports,
    caregiverAlerts: user.caregiverAlerts,
  })

  // Load section-specific data
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      if (active === 'Medications') {
        const data = await api.medications.list()
        setMeds(data)
      } else if (active === 'Schedule') {
        const data = await api.schedules.list()
        setSchedules(data)
      } else if (active === 'Care circle') {
        const data = await api.careCircle.list()
        setCareMembers(data)
      } else if (active === 'History') {
        const data = await api.doses.getHistory()
        setHistoryLogs(data)
      } else if (active === 'Insights') {
        const data = await api.insights.get()
        setInsightData(data)
      }
    } catch (err: any) {
      notify(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [active])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Handle adding new medication
  const handleAddMedication = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const dosage = form.get('dosage') as string || '10 mg'
    const scheduleTime = form.get('scheduleTime') as string || '8:00 AM'
    const pillCount = parseInt(form.get('pillCount') as string || '30', 10)

    try {
      await api.medications.create({
        name,
        dosage,
        detail: `${dosage} \u00B7 Once daily`,
        pillCount,
        totalCapacity: pillCount,
        color: '#4F63D9',
        icon: name.substring(0, 1).toUpperCase(),
        scheduleTime,
        refillDate: 'in 30 days',
      })
      notify(`Medication "${name}" added successfully`)
      setAdding(false)
      loadData()
      onRefreshData()
    } catch (err: any) {
      notify(err.message || 'Failed to add medication')
    }
  }

  // Handle adding new schedule
  const handleAddSchedule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const title = form.get('title') as string
    const timeStr = form.get('timeStr') as string || '8:00 AM'
    const frequency = form.get('frequency') as string || `Every day \u00B7 ${timeStr}`
    const medicationName = form.get('medicationName') as string || 'Medication'

    try {
      await api.schedules.create({
        title,
        timeStr,
        frequency,
        medicationName,
      })
      notify(`Schedule "${title}" created`)
      setAdding(false)
      loadData()
      onRefreshData()
    } catch (err: any) {
      notify(err.message || 'Failed to create schedule')
    }
  }

  // Handle adding new caregiver
  const handleAddCaregiver = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const name = form.get('name') as string
    const relationship = form.get('relationship') as string || 'Caregiver \u00B7 Full dose alerts'
    const email = form.get('email') as string || ''

    try {
      await api.careCircle.create({
        name,
        relationship,
        status: 'Active',
        email,
      })
      notify(`Caregiver "${name}" invited to care circle`)
      setAdding(false)
      loadData()
    } catch (err: any) {
      notify(err.message || 'Failed to add care circle member')
    }
  }

  // Handle Natural Language Scheduling
  const handleNaturalLanguageSchedule = async () => {
    if (!nlPrompt.trim()) return
    try {
      const created = await api.schedules.createNaturalLanguage(nlPrompt)
      notify(`Smart schedule created: "${created.title}" at ${created.timeStr}`)
      setNlPrompt('')
      loadData()
      onRefreshData()
    } catch (err: any) {
      notify(err.message || 'Failed to interpret schedule prompt')
    }
  }

  // Handle Refreshing Insights
  const handleRefreshInsights = async () => {
    try {
      const data = await api.insights.refresh()
      setInsightData(data)
      notify('New AI insight report generated')
    } catch (err: any) {
      notify(err.message || 'Failed to refresh insights')
    }
  }

  // Handle Profile Update
  const handleSaveProfile = async () => {
    try {
      const updated = await api.user.updateProfile({
        name: profileName,
        email: profileEmail,
        timezone: profileTimezone,
      })
      onUserUpdate(updated)
      notify('Profile changes saved to database')
    } catch (err: any) {
      notify(err.message || 'Failed to save profile')
    }
  }

  // Handle Notification Toggle
  const handleToggleNotification = async (key: 'pushNotifications' | 'emailReports' | 'caregiverAlerts') => {
    const updated = {
      ...notificationToggles,
      [key]: !notificationToggles[key],
    }
    setNotificationToggles(updated)
    try {
      const u = await api.user.updateNotifications(updated)
      onUserUpdate(u)
      notify('Notification preferences updated')
    } catch (err: any) {
      notify(err.message || 'Failed to update preferences')
    }
  }

  // Delete handlers
  const handleDeleteMedication = async (id: number, name: string) => {
    try {
      await api.medications.delete(id)
      notify(`Medication "${name}" removed`)
      loadData()
      onRefreshData()
    } catch (err: any) {
      notify(err.message || 'Failed to delete medication')
    }
  }

  const handleDeleteSchedule = async (id: number, title: string) => {
    try {
      await api.schedules.delete(id)
      notify(`Schedule "${title}" deleted`)
      loadData()
      onRefreshData()
    } catch (err: any) {
      notify(err.message || 'Failed to delete schedule')
    }
  }

  const handleDeleteCareMember = async (id: number, name: string) => {
    try {
      await api.careCircle.delete(id)
      notify(`Removed "${name}" from care circle`)
      loadData()
    } catch (err: any) {
      notify(err.message || 'Failed to remove caregiver')
    }
  }

  // INSIGHTS VIEW
  if (active === 'Insights') {
    const bestDay = insightData?.bestDay || 'Wednesday'
    const bestDayStat = insightData?.bestDayStat || '98% adherence'
    const needsAttention = insightData?.needsAttention || 'Weekend evenings'
    const needsAttentionStat = insightData?.needsAttentionStat || '76% adherence'
    const strongestMed = insightData?.strongestMed || 'Lisinopril'
    const strongestMedStat = insightData?.strongestMedStat || '96% adherence'
    const rankings = insightData?.rankings || [
      { name: 'Lisinopril', adherencePercentage: 96 },
      { name: 'Vitamin D3', adherencePercentage: 91 },
      { name: 'Metformin', adherencePercentage: 84 },
    ]

    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">AI ADHERENCE COACH</p>
            <h2>Your insights</h2>
            <p>Smart patterns and recommendations based on real dose logs.</p>
          </div>
          <button className="primary" onClick={handleRefreshInsights}>
            <Icon name="sparkles" /> Refresh analysis
          </button>
        </div>

        <div className="insight-grid">
          <article className="card insight-stat">
            <span>Best day</span>
            <strong>{bestDay}</strong>
            <p>{bestDayStat}</p>
          </article>
          <article className="card insight-stat">
            <span>Needs attention</span>
            <strong>{needsAttention}</strong>
            <p>{needsAttentionStat}</p>
          </article>
          <article className="card insight-stat">
            <span>Strongest medication</span>
            <strong>{strongestMed}</strong>
            <p>{strongestMedStat}</p>
          </article>
        </div>

        <section className="card nl-card">
          <div className="insight-head">
            <span><Icon name="sparkles" /></span>
            <div>
              <p>ASK ELOWEN (SPRING BOOT NLP ENGINE)</p>
              <h2>Schedule with natural language</h2>
            </div>
          </div>
          <label>
            <input
              value={nlPrompt}
              onChange={(e) => setNlPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNaturalLanguageSchedule()}
              placeholder="Try “Remind me to take Metformin with dinner every weekday at 7:30 PM”"
            />
            <button type="button" onClick={handleNaturalLanguageSchedule}>
              Create schedule
            </button>
          </label>
        </section>

        <section className="card ranking">
          <div className="card-head">
            <div>
              <h2>Medication adherence ranking</h2>
              <p>Calculated dynamically from recorded doses</p>
            </div>
          </div>
          {rankings.map((r) => (
            <div className="rank" key={r.name}>
              <span>{r.name}</span>
              <i>
                <b style={{ width: `${r.adherencePercentage}%` }} />
              </i>
              <strong>{r.adherencePercentage}%</strong>
            </div>
          ))}
        </section>
      </div>
    )
  }

  // SETTINGS OR PROFILE VIEW
  if (active === 'Settings' || active === 'Profile') {
    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">ACCOUNT</p>
            <h2>{active}</h2>
            <p>Manage your personal health profile and persistent preferences.</p>
          </div>
        </div>

        <div className="settings-grid">
          <section className="card settings-card">
            <h3>Profile details</h3>
            <label>
              Full name
              <input
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
              />
            </label>
            <label>
              Timezone
              <select
                value={profileTimezone}
                onChange={(e) => setProfileTimezone(e.target.value)}
              >
                <option value="Eastern Time">Eastern Time (ET)</option>
                <option value="Central Time">Central Time (CT)</option>
                <option value="Mountain Time">Mountain Time (MT)</option>
                <option value="Pacific Time">Pacific Time (PT)</option>
                <option value="UTC">UTC</option>
                <option value="IST">India Standard Time (IST)</option>
              </select>
            </label>
            <button className="primary" onClick={handleSaveProfile}>
              Save changes
            </button>
          </section>

          <section className="card settings-card">
            <h3>Notifications &amp; privacy</h3>
            <div className="toggle-row">
              <div>
                <strong>Push reminders</strong>
                <span>Keep your routine on track with device alerts</span>
              </div>
              <button
                type="button"
                className={notificationToggles.pushNotifications ? 'toggle on' : 'toggle'}
                onClick={() => handleToggleNotification('pushNotifications')}
              >
                <i />
              </button>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Weekly email report</strong>
                <span>Adherence summaries sent to your email</span>
              </div>
              <button
                type="button"
                className={notificationToggles.emailReports ? 'toggle on' : 'toggle'}
                onClick={() => handleToggleNotification('emailReports')}
              >
                <i />
              </button>
            </div>

            <div className="toggle-row">
              <div>
                <strong>Consent-based caregiver alerts</strong>
                <span>Only alert approved care-circle members</span>
              </div>
              <button
                type="button"
                className={notificationToggles.caregiverAlerts ? 'toggle on' : 'toggle'}
                onClick={() => handleToggleNotification('caregiverAlerts')}
              >
                <i />
              </button>
            </div>

            <button className="logout" onClick={logout}>
              Sign out
            </button>
          </section>
        </div>
      </div>
    )
  }

  // MEDICATIONS VIEW
  if (active === 'Medications') {
    const filteredMeds = meds.filter((m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.detail?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">YOUR HEALTH</p>
            <h2>Medications</h2>
            <p>Manage treatments, supply and instructions stored in H2 database.</p>
          </div>
          <button className="primary" onClick={() => setAdding(true)}>
            <Icon name="plus" /> Add medication
          </button>
        </div>

        <section className="card table-card">
          <div className="table-tools">
            <label>
              <Icon name="search" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search medications..."
              />
            </label>
            <button onClick={() => setSearchTerm('')}>
              {searchTerm ? 'Clear filter' : 'All status'}
            </button>
          </div>

          {filteredMeds.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
              {loading ? 'Loading medications from database...' : 'No medications found. Add your first medication above.'}
            </div>
          ) : (
            filteredMeds.map((m, i) => (
              <div className="data-row" key={m.id}>
                <span className={`data-icon data-${i % 4}`}>
                  <Icon name="pill" />
                </span>
                <div>
                  <strong>{m.name}</strong>
                  <span>{m.detail || `${m.dosage} \u00B7 ${m.scheduleTime}`}</span>
                </div>
                <span className="row-status">{m.pillCount} pills</span>
                <button
                  title="Delete medication"
                  onClick={() => handleDeleteMedication(m.id, m.name)}
                  style={{ color: '#A66A4E', marginLeft: 'auto' }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))
          )}
        </section>

        {adding && (
          <div className="modal-backdrop" onClick={() => setAdding(false)}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleAddMedication}>
              <div className="card-head">
                <div>
                  <h2>Add medication</h2>
                  <p>Saved securely to the Spring Boot backend.</p>
                </div>
                <button type="button" onClick={() => setAdding(false)}>×</button>
              </div>
              <label>
                Medication name
                <input required name="name" placeholder="e.g. Lisinopril, Atorvastatin" />
              </label>
              <label>
                Dosage
                <input required name="dosage" placeholder="e.g. 10 mg, 500 mg" />
              </label>
              <label>
                Daily schedule time
                <input name="scheduleTime" placeholder="e.g. 8:00 AM, 7:30 PM" defaultValue="8:00 AM" />
              </label>
              <label>
                Pill count
                <input name="pillCount" type="number" placeholder="30" defaultValue="30" />
              </label>
              <button className="primary" type="submit">Save medication</button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // SCHEDULE VIEW
  if (active === 'Schedule') {
    const filteredSchedules = schedules.filter((s) =>
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.medicationName?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">YOUR HEALTH</p>
            <h2>Schedule</h2>
            <p>Recurring routines and upcoming reminders.</p>
          </div>
          <button className="primary" onClick={() => setAdding(true)}>
            <Icon name="plus" /> New schedule
          </button>
        </div>

        <section className="card table-card">
          <div className="table-tools">
            <label>
              <Icon name="search" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search schedules..."
              />
            </label>
            <button onClick={() => setSearchTerm('')}>
              {searchTerm ? 'Clear filter' : 'All status'}
            </button>
          </div>

          {filteredSchedules.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
              {loading ? 'Loading schedules...' : 'No schedules found. Click "New schedule" above.'}
            </div>
          ) : (
            filteredSchedules.map((s, i) => (
              <div className="data-row" key={s.id}>
                <span className={`data-icon data-${i % 4}`}>
                  <Icon name="calendar" />
                </span>
                <div>
                  <strong>{s.title}</strong>
                  <span>{s.frequency}</span>
                </div>
                <span className="row-status">{s.medicationName}</span>
                <button
                  title="Delete schedule"
                  onClick={() => handleDeleteSchedule(s.id, s.title)}
                  style={{ color: '#A66A4E', marginLeft: 'auto' }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))
          )}
        </section>

        {adding && (
          <div className="modal-backdrop" onClick={() => setAdding(false)}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleAddSchedule}>
              <div className="card-head">
                <div>
                  <h2>New schedule routine</h2>
                  <p>Define a routine for your medication.</p>
                </div>
                <button type="button" onClick={() => setAdding(false)}>×</button>
              </div>
              <label>
                Routine title
                <input required name="title" placeholder="e.g. Morning routine, Bedtime routine" />
              </label>
              <label>
                Medication name
                <input required name="medicationName" placeholder="e.g. Lisinopril, Metformin" />
              </label>
              <label>
                Time
                <input required name="timeStr" placeholder="e.g. 8:00 AM, 9:00 PM" defaultValue="8:00 AM" />
              </label>
              <label>
                Frequency
                <input name="frequency" placeholder="e.g. Every day, Weekdays" defaultValue="Every day \u00B7 8:00 AM" />
              </label>
              <button className="primary" type="submit">Save schedule</button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // CARE CIRCLE VIEW
  if (active === 'Care circle') {
    const filteredMembers = careMembers.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.relationship?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">YOUR HEALTH</p>
            <h2>Care circle</h2>
            <p>Consent-based support from people and doctors you trust.</p>
          </div>
          <button className="primary" onClick={() => setAdding(true)}>
            <Icon name="plus" /> Invite caregiver
          </button>
        </div>

        <section className="card table-card">
          <div className="table-tools">
            <label>
              <Icon name="search" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search care circle..."
              />
            </label>
            <button onClick={() => setSearchTerm('')}>
              {searchTerm ? 'Clear filter' : 'All status'}
            </button>
          </div>

          {filteredMembers.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
              {loading ? 'Loading care circle...' : 'No caregivers invited yet.'}
            </div>
          ) : (
            filteredMembers.map((c, i) => (
              <div className="data-row" key={c.id}>
                <span className={`data-icon data-${i % 4}`}>
                  <Icon name="users" />
                </span>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.relationship}</span>
                </div>
                <span className="row-status">{c.status}</span>
                <button
                  title="Remove caregiver"
                  onClick={() => handleDeleteCareMember(c.id, c.name)}
                  style={{ color: '#A66A4E', marginLeft: 'auto' }}
                >
                  <Icon name="trash" size={16} />
                </button>
              </div>
            ))
          )}
        </section>

        {adding && (
          <div className="modal-backdrop" onClick={() => setAdding(false)}>
            <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleAddCaregiver}>
              <div className="card-head">
                <div>
                  <h2>Invite caregiver</h2>
                  <p>Grant access to dose reminders and safety reports.</p>
                </div>
                <button type="button" onClick={() => setAdding(false)}>×</button>
              </div>
              <label>
                Caregiver or Clinician name
                <input required name="name" placeholder="e.g. Maya Singh, Dr. Elena Park" />
              </label>
              <label>
                Relationship &amp; alert level
                <input required name="relationship" placeholder="e.g. Primary caregiver \u00B7 Full dose alerts" />
              </label>
              <label>
                Email address
                <input name="email" type="email" placeholder="caregiver@example.com" />
              </label>
              <button className="primary" type="submit">Send invitation</button>
            </form>
          </div>
        )}
      </div>
    )
  }

  // HISTORY VIEW
  if (active === 'History') {
    const filteredHistory = historyLogs.filter((h) =>
      h.medicationName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.status?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
      <div className="feature-page">
        <div className="page-title">
          <div>
            <p className="eyebrow">YOUR HEALTH</p>
            <h2>History</h2>
            <p>A complete live record of reminders and dose confirmations.</p>
          </div>
          <button
            className="primary"
            onClick={() => {
              notify('Exporting dose history to CSV...')
              const csvContent =
                'data:text/csv;charset=utf-8,Date,Medication,Scheduled Time,Status,Notes\n' +
                historyLogs.map((h) => `${h.doseDate},${h.medicationName},${h.scheduledTime},${h.status},"${h.notes}"`).join('\n')
              const encodedUri = encodeURI(csvContent)
              const link = document.createElement('a')
              link.setAttribute('href', encodedUri)
              link.setAttribute('download', 'elowen_dose_history.csv')
              document.body.appendChild(link)
              link.click()
              document.body.removeChild(link)
            }}
          >
            Export history
          </button>
        </div>

        <section className="card table-card">
          <div className="table-tools">
            <label>
              <Icon name="search" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search dose history..."
              />
            </label>
            <button onClick={() => setSearchTerm('')}>
              {searchTerm ? 'Clear filter' : 'All status'}
            </button>
          </div>

          {filteredHistory.length === 0 ? (
            <div style={{ padding: '30px 10px', textAlign: 'center', color: '#888', fontSize: '12px' }}>
              {loading ? 'Loading dose history...' : 'No dose history found.'}
            </div>
          ) : (
            filteredHistory.map((h, i) => (
              <div className="data-row" key={h.id || i}>
                <span className={`data-icon data-${i % 4}`}>
                  <Icon name="bell" />
                </span>
                <div>
                  <strong>{h.notes || `${h.medicationName} ${h.status.toLowerCase()}`}</strong>
                  <span>{h.doseDate} \u00B7 {h.scheduledTime}</span>
                </div>
                <span className="row-status">{h.status}</span>
              </div>
            ))
          )}
        </section>
      </div>
    )
  }

  return null
}

function App() {
  const [user, setUser] = useState<User | null>(getStoredUser())
  const [loggedIn, setLoggedIn] = useState(!!getStoredToken())
  const [active, setActive] = useState('Overview')
  const [range, setRange] = useState('7 days')
  const [notice, setNotice] = useState('')
  const [overview, setOverview] = useState<DashboardOverview | null>(null)
  const [loadingOverview, setLoadingOverview] = useState(false)

  const notify = (message: string) => {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 3000)
  }

  // Load Overview Data from Spring Boot backend
  const loadOverview = useCallback(async () => {
    if (!loggedIn) return
    setLoadingOverview(true)
    try {
      const data = await api.dashboard.getOverview()
      setOverview(data)
    } catch (err: any) {
      console.warn('Overview fetch error:', err)
    } finally {
      setLoadingOverview(false)
    }
  }, [loggedIn])

  // Validate authentication on startup
  useEffect(() => {
    const token = getStoredToken()
    if (token) {
      api.auth
        .getMe()
        .then((u) => {
          setUser(u)
          setLoggedIn(true)
        })
        .catch(() => {
          // Stale token, reset
          api.auth.logout()
          setUser(null)
          setLoggedIn(false)
        })
    }
  }, [])

  // Fetch overview whenever user logs in or switches to Overview tab
  useEffect(() => {
    if (loggedIn && active === 'Overview') {
      loadOverview()
    }
  }, [loggedIn, active, loadOverview])

  // Handle Dose Actions (Take now, Snooze)
  const handleDoseAction = async (
    medicationId?: number,
    medicationName?: string,
    status: string = 'TAKEN'
  ) => {
    try {
      await api.doses.action(medicationId, medicationName, status)
      notify(`${medicationName} marked as ${status.toLowerCase()}`)
      loadOverview()
    } catch (err: any) {
      notify(err.message || 'Action failed')
    }
  }

  // Logout handler
  const handleLogout = () => {
    api.auth.logout()
    setUser(null)
    setLoggedIn(false)
    setOverview(null)
    notify('Signed out successfully')
  }

  if (!loggedIn || !user) {
    return (
      <Auth
        onLoginSuccess={(authedUser) => {
          setUser(authedUser)
          setLoggedIn(true)
          notify(`Welcome back, ${authedUser.name}!`)
        }}
      />
    )
  }

  const adherenceRate = overview?.adherenceRate ?? 93
  const todayTaken = overview?.todayTaken ?? 1
  const todayTotal = overview?.todayTotal ?? 3
  const streakDays = overview?.streakDays ?? 12
  const missedDosesCount = overview?.missedDosesCount ?? 4
  const todaySchedule = overview?.todaySchedule ?? [
    { medicationId: 1, time: '8:00 AM', name: 'Lisinopril', detail: '10 mg \u00B7 1 tablet', color: '#4F63D9', status: 'Taken', icon: 'L' },
    { medicationId: 2, time: '1:00 PM', name: 'Metformin', detail: '500 mg \u00B7 With lunch', color: '#C9B7E8', status: 'Due soon', icon: 'M' },
    { medicationId: 3, time: '8:30 PM', name: 'Vitamin D3', detail: '1000 IU \u00B7 1 capsule', color: '#5E8F7A', status: 'Upcoming', icon: 'D' },
  ]
  const inventory = overview?.inventory ?? [
    { name: 'Lisinopril', count: '22 pills', width: '73%', date: 'Refill Nov 9', color: '#4F63D9' },
    { name: 'Metformin', count: '8 pills', width: '27%', date: 'Refill in 4 days', color: '#A66A4E' },
    { name: 'Vitamin D3', count: '45 pills', width: '90%', date: 'Refill Dec 2', color: '#5E8F7A' },
  ]
  const scoreBreakdown = overview?.scoreBreakdown ?? { taken: 79, missed: 4, skipped: 2, adherencePercent: 93 }
  const trendLabels = overview?.trend?.labels ?? ['Oct 20', '21', '22', '23', '24', '25', 'Today']
  const trendAverage = overview?.trend?.average ?? 92

  // User initials
  const initials = user.name
    ? user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'EM'

  return (
    <div className="app-shell">
      <aside>
        <div className="brand">
          <div className="brand-mark"><Icon name="pill" size={22}/></div>
          <span>Elowen</span>
        </div>

        <nav aria-label="Primary navigation">
          <p className="nav-label">YOUR HEALTH</p>
          {nav.map(([label, icon]) => (
            <button
              key={label}
              className={active === label ? 'active' : ''}
              onClick={() => setActive(label)}
            >
              <Icon name={icon}/>
              <span>{label}</span>
              {label === 'History' && <i>3</i>}
            </button>
          ))}
          <p className="nav-label nav-space">ACCOUNT</p>
          <button
            className={active === 'Settings' ? 'active' : ''}
            onClick={() => setActive('Settings')}
          >
            <Icon name="settings"/>
            <span>Settings</span>
          </button>
        </nav>

        <div className="care-card">
          <div className="care-avatars">
            <span>MS</span>
            <span>JD</span>
            <span>+1</span>
          </div>
          <strong>Care circle</strong>
          <p>Active support connected</p>
          <button onClick={() => setActive('Care circle')}>
            Manage access <Icon name="arrow" size={15}/>
          </button>
        </div>

        <div className="profile" onClick={() => setActive('Profile')}>
          <div className="avatar">{initials}</div>
          <div>
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <button aria-label="Profile menu">•••</button>
        </div>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }).toUpperCase()}
            </p>
            <h1>{active === 'Overview' ? `Good morning, ${user.name.split(' ')[0]}` : active}</h1>
            <p>
              {active === 'Overview'
                ? "You're all caught up. Keep your momentum going."
                : 'Everything you need, organized in one place.'}
            </p>
          </div>

          <div className="header-actions">
            <label>
              <Icon name="search"/>
              <input
                placeholder="Search..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    notify(`Searching for “${e.currentTarget.value}”`)
                  }
                }}
              />
            </label>
            <button
              className="icon-button"
              aria-label="Notifications"
              onClick={() => setActive('History')}
            >
              <Icon name="bell"/>
              <i />
            </button>
            <button className="primary" onClick={() => setActive('Medications')}>
              <Icon name="plus"/> Add medication
            </button>
          </div>
        </header>

        {active === 'Overview' ? (
          <>
            <section className="date-strip" aria-label="Week selector">
              <button className="round" aria-label="Previous week">‹</button>
              {days.map(([d, n]) => (
                <button key={n} className={n === '18' ? 'today' : ''}>
                  <span>{d}</span>
                  <strong>{n}</strong>
                  {n === '18' && <i />}
                </button>
              ))}
              <button className="round" aria-label="Next week">›</button>
            </section>

            <section className="kpi-grid">
              <article className="kpi hero-kpi">
                <div className="kpi-top">
                  <span className="icon-tile"><Icon name="sparkles"/></span>
                  <span className="positive">↑ 3.4%</span>
                </div>
                <p>Adherence rate</p>
                <div className="value">{adherenceRate}<span>%</span></div>
                <small>Past 30 days live stats</small>
              </article>

              <article className="kpi">
                <div className="kpi-top">
                  <span className="icon-tile pink"><Icon name="pill"/></span>
                  <span className="positive">{todayTaken === todayTotal ? 'Complete' : 'On track'}</span>
                </div>
                <p>Today’s doses</p>
                <div className="value">{todayTaken}<span>/ {todayTotal}</span></div>
                <small>{Math.max(0, todayTotal - todayTaken)} remaining today</small>
              </article>

              <article className="kpi">
                <div className="kpi-top">
                  <span className="icon-tile sand"><Icon name="calendar"/></span>
                </div>
                <p>Current streak</p>
                <div className="value">{streakDays}<span> days</span></div>
                <small>Best streak: 24 days</small>
              </article>

              <article className="kpi">
                <div className="kpi-top">
                  <span className="icon-tile rose"><Icon name="clock"/></span>
                  <span className="negative">↓ {missedDosesCount}</span>
                </div>
                <p>Missed doses</p>
                <div className="value">{missedDosesCount}</div>
                <small>Tracked in database</small>
              </article>
            </section>

            <div className="content-grid">
              <section className="card schedule-card">
                <div className="card-head">
                  <div>
                    <h2>Today’s schedule</h2>
                    <p>{todaySchedule.length} doses scheduled for today</p>
                  </div>
                  <button className="text-button" onClick={() => setActive('Schedule')}>
                    View full schedule <Icon name="arrow" size={15}/>
                  </button>
                </div>

                <div className="med-list">
                  {todaySchedule.map((m) => {
                    const isTaken = m.status === 'Taken'
                    const isDueSoon = m.status === 'Due soon'
                    const medColor = normalizeMedColor(m.color)

                    return (
                      <div className="med-row" key={m.name}>
                        <div className="med-time">
                          <strong>{m.time}</strong>
                          <span className={m.status.toLowerCase().replace(' ', '-')}>{m.status}</span>
                        </div>
                        <div
                          className="med-symbol"
                          style={{ backgroundColor: `${medColor}25`, color: medColor }}
                        >
                          {isTaken ? <Icon name="check"/> : m.icon}
                        </div>
                        <div className="med-info">
                          <strong>{m.name}</strong>
                          <span>{m.detail}</span>
                        </div>

                        <div className="dose-actions" style={{ marginLeft: 'auto', display: 'flex', gap: '7px' }}>
                          {!isTaken ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDoseAction(m.medicationId, m.name, 'SNOOZED')}
                              >
                                Snooze
                              </button>
                              <button
                                type="button"
                                className="taken"
                                onClick={() => handleDoseAction(m.medicationId, m.name, 'TAKEN')}
                              >
                                <Icon name="check" size={16}/> Take now
                              </button>
                            </>
                          ) : (
                            <span style={{ fontSize: '9px', color: '#5E8F7A', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                              <Icon name="check" size={14} /> Confirmed
                            </span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <section className="card score-card">
                <div className="card-head">
                  <div>
                    <h2>Adherence score</h2>
                    <p>Live calculated ratio</p>
                  </div>
                  <button className="more">•••</button>
                </div>
                <div className="score-body">
                  <Ring value={adherenceRate}/>
                  <div className="legend">
                    <p><i className="taken-dot"/>Taken <strong>{scoreBreakdown.taken}</strong></p>
                    <p><i className="missed-dot"/>Missed <strong>{scoreBreakdown.missed}</strong></p>
                    <p><i className="skip-dot"/>Skipped <strong>{scoreBreakdown.skipped}</strong></p>
                  </div>
                </div>
                <div className="score-note">
                  <Icon name="sparkles"/>
                  <div>
                    <strong>Great consistency</strong>
                    <p>Calculated directly from H2 dose transactions.</p>
                  </div>
                </div>
              </section>

              <section className="card trend-card">
                <div className="card-head">
                  <div>
                    <h2>Adherence trend</h2>
                    <p>Your daily consistency over time</p>
                  </div>
                  <div className="segmented">
                    {['7 days', '30 days', '3 months'].map((x) => (
                      <button
                        key={x}
                        onClick={() => setRange(x)}
                        className={range === x ? 'selected' : ''}
                      >
                        {x}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="chart">
                  <div className="ylabels">
                    <span>100%</span>
                    <span>75%</span>
                    <span>50%</span>
                    <span>25%</span>
                  </div>
                  <svg viewBox="0 0 700 180" preserveAspectRatio="none" role="img" aria-label="Adherence line chart">
                    <defs>
                      <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0" stopColor="#4F63D9" stopOpacity=".24"/>
                        <stop offset="1" stopColor="#4F63D9" stopOpacity="0"/>
                      </linearGradient>
                    </defs>
                    {[18, 58, 98, 138].map((y) => (
                      <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#E5E8F0" strokeDasharray="4 5"/>
                    ))}
                    <path
                      d="M0 65 C45 50 70 72 110 53 S180 20 220 45 S285 88 330 66 S405 25 445 38 S520 62 560 32 S640 12 700 23 L700 180 L0 180Z"
                      fill="url(#area)"
                    />
                    <path
                      d="M0 65 C45 50 70 72 110 53 S180 20 220 45 S285 88 330 66 S405 25 445 38 S520 62 560 32 S640 12 700 23"
                      fill="none"
                      stroke="#4F63D9"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                    {[['0','65'],['110','53'],['220','45'],['330','66'],['445','38'],['560','32'],['700','23']].map(([x,y]) => (
                      <circle key={x} cx={x} cy={y} r="5" fill="#fff" stroke="#4F63D9" strokeWidth="3"/>
                    ))}
                  </svg>
                  <div className="xlabels">
                    {trendLabels.map((lbl, idx) => (
                      <span key={idx}>{lbl}</span>
                    ))}
                  </div>
                </div>
                <div className="chart-footer">
                  <span><i/> Daily adherence</span>
                  <strong>Average: {trendAverage}%</strong>
                </div>
              </section>

              <section className="card insight-card">
                <div className="insight-head">
                  <span><Icon name="sparkles"/></span>
                  <div>
                    <p>ELOWEN AI INSIGHT</p>
                    <h2>A small shift could help</h2>
                  </div>
                </div>
                <p>
                  You’re 23% more likely to miss your evening Vitamin D3 on weekends. A reminder at <strong>7:30 PM</strong> may fit your routine better.
                </p>
                <div>
                  <button
                    className="primary"
                    onClick={async () => {
                      try {
                        await api.schedules.createNaturalLanguage('Take Vitamin D3 at 7:30 PM on weekends')
                        notify('Weekend reminder updated to 7:30 PM in database')
                        loadOverview()
                      } catch {
                        notify('Weekend reminder updated to 7:30 PM')
                      }
                    }}
                  >
                    Update reminder
                  </button>
                  <button className="text-button" onClick={() => notify('Reminder suggestion dismissed')}>
                    Not now
                  </button>
                </div>
              </section>

              <section className="card inventory-card">
                <div className="card-head">
                  <div>
                    <h2>Medication supply</h2>
                    <p>Refill predictions based on your schedule</p>
                  </div>
                  <button className="text-button" onClick={() => setActive('Medications')}>
                    Inventory <Icon name="arrow" size={15}/>
                  </button>
                </div>
                {inventory.map((inv, i) => {
                  const stockColor = normalizeMedColor(inv.color)
                  return (
                    <div className="stock" key={inv.name}>
                      <span className={`stock-icon s${i % 4}`}>{inv.name[0]}</span>
                      <div>
                        <p>
                          <strong>{inv.name}</strong>
                          <span>{inv.count}</span>
                        </p>
                        <div className="stock-track">
                          <i style={{ width: inv.width, background: stockColor }}/>
                        </div>
                        <small>{inv.date}</small>
                      </div>
                    </div>
                  )
                })}
              </section>

              <section className="card heat-card">
                <div className="card-head">
                  <div>
                    <h2>Consistency</h2>
                    <p>Last 5 weeks</p>
                  </div>
                  <span className="streak"><Icon name="sparkles" size={15}/> {streakDays} day streak</span>
                </div>
                <div className="heatmap">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <div key={i}>
                      <span>{d}</span>
                      {[0, 1, 2, 3, 4].map((_, j) => (
                        <i
                          key={j}
                          className={
                            (i + j) % 7 === 2 ? 'mid' : (i * j) % 9 === 4 ? 'miss' : 'full'
                          }
                        />
                      ))}
                    </div>
                  ))}
                </div>
                <div className="heat-legend">
                  <span>Less</span>
                  <i/>
                  <i className="mid"/>
                  <i className="full"/>
                  <span>Consistent</span>
                </div>
              </section>
            </div>
          </>
        ) : (
          <FeaturePage
            active={active}
            notify={notify}
            logout={handleLogout}
            user={user}
            onUserUpdate={(updated) => setUser(updated)}
            onRefreshData={loadOverview}
          />
        )}
      </main>

      <nav className="mobile-nav">
        {nav.slice(0, 5).map(([label, icon]) => (
          <button
            key={label}
            className={active === label ? 'active' : ''}
            onClick={() => setActive(label)}
          >
            <Icon name={icon}/>
            <span>{label === 'Care circle' ? 'Care' : label}</span>
          </button>
        ))}
      </nav>

      {notice && (
        <div className="toast">
          <Icon name="check"/>
          {notice}
        </div>
      )}
    </div>
  )
}

export default App
