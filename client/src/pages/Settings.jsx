import { useEffect, useState } from 'react'
import api from '../services/api'

const Settings = () => {
  const [form, setForm] = useState({
    goalStudyHours: '',
    goalScreenTimeMax: '',
    goalSleepHours: '',
    goalExerciseMinutes: '',
  })
  const [message, setMessage] = useState('')

  useEffect(() => {
    api.get('/api/auth/me').then((meRes) => {
        setForm({
          goalStudyHours: meRes.data.user.goals.study ?? '',
          goalScreenTimeMax: meRes.data.user.goals.screen ?? '',
          goalSleepHours: meRes.data.user.goals.sleep ?? '',
          goalExerciseMinutes: meRes.data.user.goals.exercise ?? '',
        })
      })
  }, [])

  const saveGoals = async (event) => {
    event.preventDefault()
    const payload = {}
    if (form.goalStudyHours !== '') payload.goalStudyHours = Number(form.goalStudyHours)
    if (form.goalScreenTimeMax !== '') payload.goalScreenTimeMax = Number(form.goalScreenTimeMax)
    if (form.goalSleepHours !== '') payload.goalSleepHours = Number(form.goalSleepHours)
    if (form.goalExerciseMinutes !== '') payload.goalExerciseMinutes = Number(form.goalExerciseMinutes)

    await api.put('/api/auth/goals', payload)
    setMessage('Goals updated successfully.')
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      <div className="card" style={{ maxWidth: 700 }}>
        <h3>Goal System</h3>
        <p className="quote">Set daily targets to keep your balance in check.</p>
        <form className="grid" onSubmit={saveGoals}>
          <div className="form-group">
            <label>Target study hours</label>
            <input
              type="number"
              value={form.goalStudyHours}
              onChange={(e) =>
                setForm({ ...form, goalStudyHours: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Maximum screen time</label>
            <input
              type="number"
              value={form.goalScreenTimeMax}
              onChange={(e) =>
                setForm({ ...form, goalScreenTimeMax: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Target sleep duration</label>
            <input
              type="number"
              value={form.goalSleepHours}
              onChange={(e) =>
                setForm({ ...form, goalSleepHours: e.target.value })
              }
            />
          </div>
          <div className="form-group">
            <label>Minimum exercise (minutes)</label>
            <input
              type="number"
              value={form.goalExerciseMinutes}
              onChange={(e) =>
                setForm({ ...form, goalExerciseMinutes: e.target.value })
              }
            />
          </div>
          {message && <div className="badge good">{message}</div>}
          <button className="btn" type="submit">
            Save goals
          </button>
        </form>
      </div>

    </div>
  )
}

export default Settings
