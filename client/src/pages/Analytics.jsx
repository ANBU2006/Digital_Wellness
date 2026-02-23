import { useEffect, useState } from 'react'
import api from '../services/api'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
)

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api
      .get('/api/wellness/analytics')
      .then((res) => {
        setAnalytics(res.data)
        setError('')
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Failed to load analytics.')
      })
  }, [])

  if (error) return <div className="card">{error}</div>
  if (!analytics) return <div className="card">Loading analytics...</div>

  const lineData = {
    labels: analytics.charts.dates,
    datasets: [
      {
        label: 'Study',
        data: analytics.charts.study,
        borderColor: '#0c7c66',
        backgroundColor: 'rgba(12,124,102,0.2)',
        tension: 0.35,
      },
      {
        label: 'Screen',
        data: analytics.charts.screen,
        borderColor: '#ff9f1c',
        backgroundColor: 'rgba(255,159,28,0.2)',
        tension: 0.35,
      },
      {
        label: 'Sleep',
        data: analytics.charts.sleep,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59,130,246,0.2)',
        tension: 0.35,
      },
    ],
  }

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card" style={{ maxWidth: 1280 }}>
        <h3>Study / Screen / Sleep Trend</h3>
        <div style={{ height: 500 }}>
          <Line
            data={lineData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: { duration: 800, easing: 'easeOutQuart' },
              plugins: {
                tooltip: { enabled: true },
                legend: { position: 'bottom' },
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default Analytics
