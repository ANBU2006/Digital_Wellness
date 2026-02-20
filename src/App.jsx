import React, { useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import AnalyticsPage from "./pages/AnalyticsPage";
import DashboardPage from "./pages/DashboardPage";
import GoalsPage from "./pages/GoalsPage";
import HistoryPage from "./pages/HistoryPage";

const initialLogs = [
  { date: "2026-02-20", study: 7, screen: 3.5, sleep: 8, exercise: 35 },
  { date: "2026-02-19", study: 6, screen: 4, sleep: 7.5, exercise: 30 },
  { date: "2026-02-18", study: 5.5, screen: 4.5, sleep: 7, exercise: 25 },
  { date: "2026-02-17", study: 6.2, screen: 3.9, sleep: 8.1, exercise: 40 },
  { date: "2026-02-16", study: 4.8, screen: 5, sleep: 6.8, exercise: 20 },
  { date: "2026-02-15", study: 5, screen: 4.8, sleep: 7.2, exercise: 25 },
  { date: "2026-02-14", study: 6.8, screen: 3.2, sleep: 8.4, exercise: 45 },
  { date: "2026-02-13", study: 6.4, screen: 3.8, sleep: 7.9, exercise: 35 },
];

const initialGoals = {
  studyTarget: 6,
  screenMax: 4,
  sleepTarget: 8,
  exerciseMin: 30,
};

const toDate = (value) => new Date(`${value}T00:00:00`);
const daysBetween = (a, b) =>
  Math.round((toDate(a).getTime() - toDate(b).getTime()) / (1000 * 60 * 60 * 24));

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [goals, setGoals] = useState(initialGoals);
  const [logs, setLogs] = useState(initialLogs);
  const [historyPage, setHistoryPage] = useState(1);
  const [historyDateFilter, setHistoryDateFilter] = useState("");
  const [historySort, setHistorySort] = useState("newest");

  const latestLog = useMemo(() => {
    return [...logs].sort((a, b) => toDate(b.date) - toDate(a.date))[0];
  }, [logs]);

  const streak = useMemo(() => {
    const sorted = [...logs].sort((a, b) => toDate(b.date) - toDate(a.date));
    let value = 0;
    for (let i = 0; i < sorted.length; i += 1) {
      if (i === 0) {
        value = 1;
        continue;
      }
      if (daysBetween(sorted[i - 1].date, sorted[i].date) === 1) value += 1;
      else break;
    }
    return value;
  }, [logs]);

  const recommendation = useMemo(() => {
    if (latestLog.sleep < goals.sleepTarget) {
      return "Prioritize sleep tonight to improve focus tomorrow.";
    }
    if (latestLog.screen > goals.screenMax) {
      return "Consider a short digital detox break to reduce screen fatigue.";
    }
    if (latestLog.exercise < goals.exerciseMin) {
      return "Add a 15-minute walk to hit your wellness activity target.";
    }
    return "Great work. Your routine looks balanced today.";
  }, [goals, latestLog]);

  const goalChecks = useMemo(() => {
    return [
      {
        label: "Study target",
        ok: latestLog.study >= goals.studyTarget,
        value: `${latestLog.study}h / ${goals.studyTarget}h`,
      },
      {
        label: "Screen max",
        ok: latestLog.screen <= goals.screenMax,
        value: `${latestLog.screen}h / ${goals.screenMax}h`,
      },
      {
        label: "Sleep target",
        ok: latestLog.sleep >= goals.sleepTarget,
        value: `${latestLog.sleep}h / ${goals.sleepTarget}h`,
      },
      {
        label: "Exercise target",
        ok: latestLog.exercise >= goals.exerciseMin,
        value: `${latestLog.exercise}m / ${goals.exerciseMin}m`,
      },
    ];
  }, [goals, latestLog]);

  const trendData = useMemo(() => {
    return [...logs].sort((a, b) => toDate(a.date) - toDate(b.date)).slice(-7);
  }, [logs]);

  const filteredHistory = useMemo(() => {
    const rows = logs
      .filter((entry) =>
        historyDateFilter ? entry.date === historyDateFilter : true
      )
      .sort((a, b) => {
        if (historySort === "oldest") return toDate(a.date) - toDate(b.date);
        return toDate(b.date) - toDate(a.date);
      });
    return rows;
  }, [historyDateFilter, historySort, logs]);

  const pageSize = 5;
  const totalPages = Math.max(1, Math.ceil(filteredHistory.length / pageSize));
  const pagedHistory = filteredHistory.slice(
    (historyPage - 1) * pageSize,
    historyPage * pageSize
  );

  const onSaveEntry = (entry) => {
    setLogs((prev) => {
      const withoutSameDate = prev.filter((item) => item.date !== entry.date);
      return [entry, ...withoutSameDate];
    });
    setHistoryPage(1);
  };

  const onSaveGoals = (nextGoals) => {
    setGoals(nextGoals);
  };

  const onDateFilterChange = (value) => {
    setHistoryDateFilter(value);
    setHistoryPage(1);
  };

  const onSortChange = (value) => {
    setHistorySort(value);
    setHistoryPage(1);
  };

  const onPrevPage = () => setHistoryPage((prev) => Math.max(1, prev - 1));
  const onNextPage = () =>
    setHistoryPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <div className="app-shell">
      <Sidebar activePage={activePage} onChangePage={setActivePage} />
      <main className="main-content">
        <Header />
        {activePage === "dashboard" && (
          <DashboardPage
            streak={streak}
            totalDays={logs.length}
            recommendation={recommendation}
            goalChecks={goalChecks}
            onSaveEntry={onSaveEntry}
          />
        )}
        {activePage === "analytics" && <AnalyticsPage trendData={trendData} />}
        {activePage === "history" && (
          <HistoryPage
            rows={pagedHistory}
            dateFilter={historyDateFilter}
            sortBy={historySort}
            onDateFilterChange={onDateFilterChange}
            onSortChange={onSortChange}
            page={historyPage}
            totalPages={totalPages}
            onPrevPage={onPrevPage}
            onNextPage={onNextPage}
          />
        )}
        {activePage === "goals" && (
          <GoalsPage goals={goals} onSaveGoals={onSaveGoals} />
        )}
      </main>
    </div>
  );
}
