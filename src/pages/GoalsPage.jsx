import React, { useState } from "react";

export default function GoalsPage({ goals, onSaveGoals }) {
  const [formState, setFormState] = useState({
    studyTarget: goals.studyTarget,
    screenMax: goals.screenMax,
    sleepTarget: goals.sleepTarget,
    exerciseMin: goals.exerciseMin,
  });

  const update = (field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    onSaveGoals({
      studyTarget: Number(formState.studyTarget),
      screenMax: Number(formState.screenMax),
      sleepTarget: Number(formState.sleepTarget),
      exerciseMin: Number(formState.exerciseMin),
    });
  };

  return (
    <section id="goals-page" className="page active">
      <article className="card goal-card">
        <h2>Set Goals</h2>
        <form className="form-grid" onSubmit={onSubmit}>
          <label>
            Target Study Hours
            <input
              name="studyTarget"
              type="number"
              min="0"
              step="0.5"
              required
              value={formState.studyTarget}
              onChange={(e) => update("studyTarget", e.target.value)}
            />
          </label>
          <label>
            Maximum Screen Time
            <input
              name="screenMax"
              type="number"
              min="0"
              step="0.5"
              required
              value={formState.screenMax}
              onChange={(e) => update("screenMax", e.target.value)}
            />
          </label>
          <label>
            Target Sleep Duration
            <input
              name="sleepTarget"
              type="number"
              min="0"
              step="0.5"
              required
              value={formState.sleepTarget}
              onChange={(e) => update("sleepTarget", e.target.value)}
            />
          </label>
          <label>
            Minimum Exercise Minutes
            <input
              name="exerciseMin"
              type="number"
              min="0"
              step="5"
              required
              value={formState.exerciseMin}
              onChange={(e) => update("exerciseMin", e.target.value)}
            />
          </label>
          <button className="primary-btn" type="submit">
            Save Goals
          </button>
        </form>
      </article>
    </section>
  );
}
