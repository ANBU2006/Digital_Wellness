import { useEffect, useMemo, useState } from 'react'
import api from '../services/api'

const PAGE_SIZE = 6

const History = () => {
  const [entries, setEntries] = useState([])
  const [filterDate, setFilterDate] = useState('')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEntries = async () => {
    try {
      setError('')
      setLoading(true)
      const { data } = await api.get('/api/wellness')
      setEntries(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEntries()
  }, [])

  const filtered = useMemo(() => {
    const list = filterDate
      ? entries.filter((entry) => entry.date === filterDate)
      : entries
    const sorted = [...list].sort((a, b) =>
      sortDir === 'desc' ? b.date.localeCompare(a.date) : a.date.localeCompare(b.date)
    )
    return sorted
  }, [entries, filterDate, sortDir])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const startEdit = (entry) => {
    setEditing({ ...entry })
  }

  const saveEdit = async () => {
    try {
      setError('')
      await api.put(`/api/wellness/${editing._id}`, editing)
      setEditing(null)
      await loadEntries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update entry.')
    }
  }

  const removeEntry = (entry) => {
    setConfirm(entry)
  }

  const confirmDelete = async () => {
    try {
      setError('')
      await api.delete(`/api/wellness/${confirm._id}`)
      setConfirm(null)
      await loadEntries()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete entry.')
    }
  }

  return (
    <div className="grid" style={{ gap: 18 }}>
      {error && <div className="badge poor">{error}</div>}
      <div className="card" style={{ display: 'flex', gap: 12 }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label>Filter by date</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value)
              setPage(1)
            }}
          />
        </div>
        <div className="form-group">
          <label>Sort by date</label>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value)}>
            <option value="desc">Newest first</option>
            <option value="asc">Oldest first</option>
          </select>
        </div>
      </div>
      <div className="card">
        {loading ? (
          <p>Loading history...</p>
        ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Study</th>
              <th>Screen</th>
              <th>Sleep</th>
              <th>Exercise</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.date}</td>
                <td>{entry.studyHours}</td>
                <td>{entry.screenTime}</td>
                <td>{entry.sleepHours}</td>
                <td>{entry.exerciseMinutes}</td>
                <td>
                  <button className="btn ghost" onClick={() => startEdit(entry)}>
                    Edit
                  </button>
                  <button
                    className="btn secondary"
                    onClick={() => removeEntry(entry)}
                    style={{ marginLeft: 6 }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paged.length === 0 && (
              <tr>
                <td colSpan="6">No entries found.</td>
              </tr>
            )}
          </tbody>
        </table>
        )}
        <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
          <button
            className="btn ghost"
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Prev
          </button>
          <div className="pill">
            Page {page} / {totalPages}
          </div>
          <button
            className="btn ghost"
            disabled={page === totalPages}
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          >
            Next
          </button>
        </div>
      </div>

      {editing && (
        <div className="card">
          <h3>Edit Entry ({editing.date})</h3>
          <div className="grid grid-4">
            <div className="form-group">
              <label>Study</label>
              <input
                type="number"
                value={editing.studyHours}
                onChange={(e) =>
                  setEditing({ ...editing, studyHours: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Screen</label>
              <input
                type="number"
                value={editing.screenTime}
                onChange={(e) =>
                  setEditing({ ...editing, screenTime: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Sleep</label>
              <input
                type="number"
                value={editing.sleepHours}
                onChange={(e) =>
                  setEditing({ ...editing, sleepHours: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Exercise</label>
              <input
                type="number"
                value={editing.exerciseMinutes}
                onChange={(e) =>
                  setEditing({ ...editing, exerciseMinutes: e.target.value })
                }
              />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button className="btn" onClick={saveEdit}>
              Save changes
            </button>
            <button className="btn ghost" onClick={() => setEditing(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {confirm && (
        <div className="modal-backdrop">
          <div className="modal">
            <h3>Delete entry?</h3>
            <p>
              This will remove the entry for <strong>{confirm.date}</strong>. This
              action cannot be undone.
            </p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
              <button className="btn secondary" onClick={confirmDelete}>
                Yes, delete
              </button>
              <button className="btn ghost" onClick={() => setConfirm(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default History
