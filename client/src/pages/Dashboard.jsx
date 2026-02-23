import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import api from '../services/api'

const getDefaultLogDate = () => dayjs().subtract(1, 'day').format('YYYY-MM-DD')

const Dashboard = () => {
  const [entries, setEntries] = useState([])
  const [goals, setGoals] = useState(null)
  const [form, setForm] = useState({
    studyHours: 0,
    screenTime: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
    date: getDefaultLogDate(),
  })
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('good')
  const [loading, setLoading] = useState(false)

  const loadData = async () => {
    setMessage('')
    const [entriesRes, meRes] = await Promise.allSettled([
      api.get('/api/wellness'),
      api.get('/api/auth/me'),
    ])

    let hasError = false

    if (entriesRes.status === 'fulfilled') {
      setEntries(Array.isArray(entriesRes.value.data) ? entriesRes.value.data : [])
    } else {
      hasError = true
      setEntries([])
    }

    if (meRes.status === 'fulfilled') {
      setGoals(meRes.value.data?.user?.goals || null)
    } else {
      hasError = true
      setGoals(null)
    }

    if (hasError) {
      setMessageType('poor')
      setMessage('Some dashboard data could not be loaded. Please refresh.')
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const onSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      await api.post('/api/wellness', {
        ...form,
        studyHours: Number(form.studyHours),
        screenTime: Number(form.screenTime),
        sleepHours: Number(form.sleepHours),
        exerciseMinutes: Number(form.exerciseMinutes),
        date: dayjs(form.date).format('YYYY-MM-DD'),
      })
      setMessageType('good')
      setMessage('Entry saved successfully.')
      await loadData()
    } catch (error) {
      setMessageType('poor')
      setMessage(error.response?.data?.message || 'Failed to save entry.')
    } finally {
      setLoading(false)
    }
  }

  const snapshotDate = getDefaultLogDate()
  const snapshotEntry = entries.find((entry) => entry.date === snapshotDate)
  const loggedDates = [...new Set(entries.map((entry) => entry.date))]
  const loggedDateSet = new Set(loggedDates)
  const totalLoggedDays = loggedDates.length

  let currentStreak = 0
  let cursor = dayjs(snapshotDate)
  while (loggedDateSet.has(cursor.format('YYYY-MM-DD'))) {
    currentStreak += 1
    cursor = cursor.subtract(1, 'day')
  }
  const activeGoals = {
    study: Number(goals?.study),
    screen: Number(goals?.screen),
    sleep: Number(goals?.sleep),
    exercise: Number(goals?.exercise),
  }
  const hasConfiguredGoals = [
    activeGoals.study,
    activeGoals.screen,
    activeGoals.sleep,
    activeGoals.exercise,
  ].every((value) => Number.isFinite(value) && value > 0)
  const goalChecks = snapshotEntry && hasConfiguredGoals
    ? [
        {
          key: 'study',
          label: 'Study goal',
          passed: snapshotEntry.studyHours >= activeGoals.study,
          recommendation:
            'Structured Study Plan Recommended – Increase focused study time.',
        },
        {
          key: 'screen',
          label: 'Screen time goal',
          passed: snapshotEntry.screenTime <= activeGoals.screen,
          recommendation:
            'Digital Detox Recommended – Your screen time exceeded your daily limit.',
        },
        {
          key: 'sleep',
          label: 'Sleep goal',
          passed: snapshotEntry.sleepHours >= activeGoals.sleep,
          recommendation:
            'Sleep Improvement Plan Recommended – You are not meeting your sleep target.',
        },
        {
          key: 'exercise',
          label: 'Exercise goal',
          passed: snapshotEntry.exerciseMinutes >= activeGoals.exercise,
          recommendation:
            'Physical Activity Boost Recommended – Add at least 15 minutes of movement.',
        },
      ]
    : []
  const achievedGoalCount = goalChecks.filter((goal) => goal.passed).length
  const recommendationItems =
    goalChecks.length === 0
      ? hasConfiguredGoals
        ? ['Add your first entry to see tips.']
        : ['Set your goals in Settings to unlock recommendations.']
      : goalChecks.filter((goal) => !goal.passed).length > 0
      ? goalChecks
          .filter((goal) => !goal.passed)
          .map((goal) => goal.recommendation)
      : ['You are meeting all your wellness goals today.']

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="grid grid-2" style={{ gap: 14 }}>
        <div className="card" style={{ padding: 14 }}>
          <h3>Log Today</h3>
          <form className="grid grid-2" style={{ gap: 10 }} onSubmit={onSubmit}>
            <div className="form-group">
              <label>Study hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.studyHours}
                onChange={(e) => setForm({ ...form, studyHours: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Screen time (hrs)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.screenTime}
                onChange={(e) => setForm({ ...form, screenTime: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Sleep hours</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={form.sleepHours}
                onChange={(e) => setForm({ ...form, sleepHours: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Exercise/break (min)</label>
              <input
                type="number"
                min="0"
                step="5"
                value={form.exerciseMinutes}
                onChange={(e) =>
                  setForm({ ...form, exerciseMinutes: e.target.value })
                }
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Log date (usually yesterday)</label>
              <input
                type="date"
                value={form.date}
                max={getDefaultLogDate()}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>
            {message && (
              <div className={`badge ${messageType}`} style={{ gridColumn: '1 / -1' }}>
                {message}
              </div>
            )}
            <button
              className="btn"
              type="submit"
              disabled={loading}
              style={{ gridColumn: '1 / -1' }}
            >
              {loading ? 'Saving...' : 'Save entry'}
            </button>
          </form>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <h3>Streak</h3>
          <div className="grid" style={{ gap: 10 }}>
            <p>
              Current streak (up to {snapshotDate}):{' '}
              <strong>{currentStreak} day{currentStreak === 1 ? '' : 's'}</strong>
            </p>
            <p>
              Total days logged:{' '}
              <strong>{totalLoggedDays} day{totalLoggedDays === 1 ? '' : 's'}</strong>
            </p>
            {!snapshotEntry && (
              <p style={{ color: 'var(--text-muted)' }}>
                No entry found for {snapshotDate}. Add yesterday&apos;s log to continue your streak.
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ gap: 14 }}>
        <div className="card" style={{ padding: 14 }}>
          <h3>Recommendations</h3>
          <p style={{ marginTop: 2, color: 'var(--text-muted)', fontSize: 12 }}>
            Showing: {snapshotDate}
          </p>
          {goalChecks.length > 0 && (
            <p style={{ marginTop: 2, color: 'var(--text-muted)' }}>
              {achievedGoalCount} out of 4 goals achieved for this date
            </p>
          )}
          <div className="grid" style={{ gap: 8, marginTop: 6 }}>
            {goalChecks.map((goal) => (
              <div
                key={goal.key}
                style={{ display: 'flex', alignItems: 'center', gap: 8 }}
              >
                <span className={`badge ${goal.passed ? 'good' : 'poor'}`}>
                  {goal.passed ? 'PASS' : 'FAIL'}
                </span>
                <span style={{ color: goal.passed ? 'var(--good)' : 'var(--danger)' }}>
                  {goal.passed ? '✓' : '!'} {goal.label}
                </span>
              </div>
            ))}
          </div>
          <div className="grid" style={{ gap: 10, marginTop: 14 }}>
            {recommendationItems.map(
              (rec) => {
                const lower = rec.toLowerCase()
                const isWarn = lower.includes('recommended')
                const icon = isWarn ? '⚠' : '✅'
                return (
                  <div
                    key={rec}
                    className={`recommendation ${isWarn ? 'warn' : 'good'}`}
                  >
                    <span>{icon}</span>
                    <span>{rec}</span>
                  </div>
                )
              }
            )}
          </div>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <h3>Goal Match</h3>
          <p>Study target: {hasConfiguredGoals ? `${goals.study} hrs` : 'Not set'}</p>
          <p>Max screen: {hasConfiguredGoals ? `${goals.screen} hrs` : 'Not set'}</p>
          <p>Sleep target: {hasConfiguredGoals ? `${goals.sleep} hrs` : 'Not set'}</p>
          <p>Exercise target: {hasConfiguredGoals ? `${goals.exercise} mins` : 'Not set'}</p>
          {snapshotEntry && hasConfiguredGoals && (
            <div style={{ marginTop: 10 }}>
              <div className="pill">
                Study: {snapshotEntry.studyHours}/{goals.study} hrs
              </div>
              <div className="pill" style={{ marginTop: 8 }}>
                Screen: {snapshotEntry.screenTime}/{goals.screen} hrs
              </div>
              <div className="pill" style={{ marginTop: 8 }}>
                Sleep: {snapshotEntry.sleepHours}/{goals.sleep} hrs
              </div>
              <div className="pill" style={{ marginTop: 8 }}>
                Exercise: {snapshotEntry.exerciseMinutes}/{goals.exercise} mins
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
