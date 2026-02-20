import React from "react";

export default function HistoryPage({
  rows,
  dateFilter,
  sortBy,
  onDateFilterChange,
  onSortChange,
  page,
  totalPages,
  onPrevPage,
  onNextPage,
}) {
  return (
    <section id="history-page" className="page active">
      <article className="card">
        <div className="history-head">
          <h2>History</h2>
          <div className="history-controls">
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
            />
            <select value={sortBy} onChange={(e) => onSortChange(e.target.value)}>
              <option value="newest">Sort: Newest</option>
              <option value="oldest">Sort: Oldest</option>
            </select>
          </div>
        </div>
        <div className="table-wrap">
          <table>
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
              {rows.map((row) => (
                <tr key={row.date}>
                  <td>{row.date}</td>
                  <td>{row.study}h</td>
                  <td>{row.screen}h</td>
                  <td>{row.sleep}h</td>
                  <td>{row.exercise}m</td>
                  <td>
                    <button className="chip" type="button">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <button type="button" onClick={onPrevPage} disabled={page <= 1}>
            Previous
          </button>
          <span>{`Page ${page} of ${totalPages}`}</span>
          <button type="button" onClick={onNextPage} disabled={page >= totalPages}>
            Next
          </button>
        </div>
      </article>
    </section>
  );
}
