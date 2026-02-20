import React from "react";

export default function DashboardPage({
  streak,
  totalDays,
  recommendation,
  goalChecks,
  onSaveEntry,
}) {
  const onSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const entry = {
      study: Number(formData.get("study")),
      screen: Number(formData.get("screen")),
      sleep: Number(formData.get("sleep")),
      exercise: Number(formData.get("exercise")),
      date: String(formData.get("date")),
    };
    onSaveEntry(entry);
    event.currentTarget.reset();
  };

  return (
    <section id="dashboard-page" className="page active">
      <div className="dashboard-grid">
        <article className="card">
          <h2>Log Today</h2>
          <form className="form-grid" onSubmit={onSubmit}>
            <label>
              Study Hours
              <input name="study" type="number" min="0" step="0.5" required />
            </label>
            <label>
              Screen Time (hrs)
              <input name="screen" type="number" min="0" step="0.5" required />
            </label>
            <label>
              Sleep Hours
              <input name="sleep" type="number" min="0" step="0.5" required />
            </label>
            <label>
              Exercise (mins)
              <input name="exercise" type="number" min="0" step="5" required />
            </label>
            <label>
              Date
              <input name="date" type="date" required />
            </label>
            <button className="primary-btn" type="submit">
              Save Entry
            </button>
          </form>
        </article>

        <article className="card">
          <h2>Streak</h2>
          <div className="stat-wrap">
            <p className="big-stat">{streak} days</p>
            <p className="subtle">Current streak</p>
            <hr />
            <p className="big-stat">{totalDays} entries</p>
            <p className="subtle">Total days logged</p>
          </div>
        </article>

        <article className="card">
          <h2>Recommendations</h2>
          <div className="alert success">{recommendation}</div>
        </article>

        <article className="card">
          <h2>Goal Match</h2>
          <ul className="goal-list">
            {goalChecks.map((item) => (
              <li key={item.label}>
                <strong>{item.label}:</strong> {item.value}{" "}
                <span className="chip">{item.ok ? "On Track" : "Needs Focus"}</span>
              </li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}
