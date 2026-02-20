import React from "react";

const seriesMeta = [
  { key: "study", color: "#2f7c57" },
  { key: "screen", color: "#db8b2c" },
  { key: "sleep", color: "#4c87d9" },
];

export default function AnalyticsPage({ trendData }) {
  return (
    <section id="analytics-page" className="page active">
      <article className="card">
        <h2>Study / Screen / Sleep Trend</h2>
        <div className="chart-area">
          <div className="chart-y-labels">
            <span>10h</span>
            <span>8h</span>
            <span>6h</span>
            <span>4h</span>
            <span>2h</span>
            <span>0h</span>
          </div>
          <div className="chart-canvas">
            {seriesMeta.map(({ key, color }) => {
              const points = trendData
                .map((entry, index) => {
                  const x = (index / (trendData.length - 1 || 1)) * 100;
                  const y = 100 - (Math.min(entry[key], 10) / 10) * 100;
                  return `${x},${y}`;
                })
                .join(" ");

              return (
                <svg
                  key={key}
                  className="chart-line"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="1.5"
                  />
                </svg>
              );
            })}
          </div>
        </div>
      </article>
    </section>
  );
}
