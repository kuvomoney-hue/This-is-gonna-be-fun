// ============================================================
// MOCK DATA — structured for easy swap with real API/DB later
// ============================================================

// ----- BOT / TRADING -----
export const botStatus = {
  name: "Scout",
  status: "online" as "online" | "offline",
  btcPrice: 68400,
  accountBalance: 483.99,
  todayPnl: -5.39,
  winRate: 33,
  isRunning: true,
};

export const tradingSummary = {
  lastSignal: {
    direction: "LONG" as "LONG" | "SHORT",
    price: 68362,
    score: 20,
    decision: "REJECTED" as "APPROVED" | "REJECTED",
    maxScore: 100,
  },
  lastApprovedTrade: {
    direction: "LONG" as "LONG" | "SHORT",
    price: 67850,
    pnl: +1.24,
    closedAt: "2026-02-15 14:32",
  },
  signalsToday: 2,
  signalsRejected: 2,
  signalsApproved: 0,
};

export const tradingStats = {
  totalTrades: 6,
  winRate: 33.3,
  avgWin: 2.79,
  avgLoss: -0.35,
  totalFees: 22,
};

export const accountHistory = [
  { date: "Jan 20", value: 499 },
  { date: "Jan 25", value: 501 },
  { date: "Jan 30", value: 497 },
  { date: "Feb 3",  value: 503 },
  { date: "Feb 7",  value: 489 },
  { date: "Feb 10", value: 495 },
  { date: "Feb 14", value: 484 },
  { date: "Feb 17", value: 483.99 },
];

export interface Signal {
  id: string;
  time: string;
  direction: "LONG" | "SHORT";
  price: number;
  score: number;
  decision: "APPROVED" | "REJECTED";
  reasons: string[];
}

export const signals: Signal[] = [
  {
    id: "s1",
    time: "2026-02-17 00:42",
    direction: "LONG",
    price: 68362,
    score: 20,
    decision: "REJECTED",
    reasons: ["Choppy regime", "ATR low", "No volume confirmation"],
  },
  {
    id: "s2",
    time: "2026-02-16 18:15",
    direction: "LONG",
    price: 67990,
    score: 35,
    decision: "REJECTED",
    reasons: ["4H trend bearish", "Score below threshold (50)"],
  },
  {
    id: "s3",
    time: "2026-02-15 14:22",
    direction: "LONG",
    price: 67850,
    score: 72,
    decision: "APPROVED",
    reasons: ["Strong momentum", "Volume spike", "1H trend aligned"],
  },
  {
    id: "s4",
    time: "2026-02-14 09:05",
    direction: "SHORT",
    price: 68100,
    score: 28,
    decision: "REJECTED",
    reasons: ["Uptrend intact on 4H", "Choppy", "RSI neutral"],
  },
  {
    id: "s5",
    time: "2026-02-13 21:30",
    direction: "LONG",
    price: 66780,
    score: 61,
    decision: "APPROVED",
    reasons: ["Breakout confirmed", "Volume above avg"],
  },
  {
    id: "s6",
    time: "2026-02-12 11:44",
    direction: "SHORT",
    price: 67200,
    score: 18,
    decision: "REJECTED",
    reasons: ["Score too low", "Sideways regime"],
  },
];

export const contextFilter = {
  regime: "CHOPPY" as "CHOPPY" | "TRENDING" | "VOLATILE",
  atr: "0.42%",
  volume: "Below Average",
  trend15m: "NEUTRAL" as "BULLISH" | "BEARISH" | "NEUTRAL",
  trend1h: "BEARISH" as "BULLISH" | "BEARISH" | "NEUTRAL",
  trend4h: "BEARISH" as "BULLISH" | "BEARISH" | "NEUTRAL",
};

export const activePosition = null; // null = no open position

// ----- SCHEDULE -----
export interface ScheduleItem {
  id: string;
  time: string;
  label: string;
  emoji: string;
}

export const todaySchedule: ScheduleItem[] = [
  { id: "sch1", time: "4:30 AM", label: "Morning Routine", emoji: "🌅" },
  { id: "sch2", time: "9:00 AM", label: "Work", emoji: "💼" },
  { id: "sch3", time: "2:30 PM", label: "Workout", emoji: "🏋️" },
  { id: "sch4", time: "8:30 PM", label: "Evening Routine", emoji: "🌙" },
];

// ----- WEATHER -----
export const weather = {
  temp: 68,
  condition: "Partly Cloudy",
  location: "Houston, TX",
  emoji: "⛅",
  high: 72,
  low: 58,
};

// ----- TASKS -----
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  group: "today" | "week" | "someday";
}

export const initialTasks: Task[] = [
  { id: "t1", text: "Review Scout signal log", completed: false, group: "today" },
  { id: "t2", text: "Update trading journal", completed: true, group: "today" },
  { id: "t3", text: "Fix ATR filter threshold", completed: false, group: "week" },
  { id: "t4", text: "Build options scanner MVP", completed: false, group: "week" },
  { id: "t5", text: "Design dashboard V2 wireframes", completed: false, group: "week" },
  { id: "t6", text: "Set up Robinhood API integration", completed: false, group: "someday" },
  { id: "t7", text: "Write trading system documentation", completed: false, group: "someday" },
];

// ----- PROJECTS -----
export interface Project {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: string;
  emoji: string;
  color: string;
}

export const projects: Project[] = [
  {
    id: "p1",
    title: "Trading Bot MVP",
    description: "Build and validate automated trading system",
    progress: 75,
    target: "Mar 2026",
    emoji: "🤖",
    color: "#14591D",
  },
  {
    id: "p2",
    title: "Robinhood Options",
    description: "Add SPY/QQQ options trading layer",
    progress: 20,
    target: "Mar 2026",
    emoji: "📈",
    color: "#1a7a27",
  },
  {
    id: "p3",
    title: "Scale to $1k Account",
    description: "Grow trading account from $500 to $1,000",
    progress: 10,
    target: "Apr 2026",
    emoji: "💰",
    color: "#4caf50",
  },
  {
    id: "p4",
    title: "Wedding Planning",
    description: "Plan and execute the perfect wedding",
    progress: 30,
    target: "Sep 2026",
    emoji: "💍",
    color: "#81c784",
  },
];

// ----- SCOUT AGENT -----
export const scoutAgent = {
  name: "Scout",
  emoji: "🧭",
  model: "claude-sonnet-4-5",
  status: "online" as "online" | "offline",
  capabilities: ["Trading", "Market Analysis", "Signal Filtering", "Risk Management"],
};

export const scoutActivity = [
  { id: "a1", time: "00:42", text: "Signal rejected: LONG 20/100 — Market choppy, score below threshold", type: "reject" as const },
  { id: "a2", time: "Feb 16 18:15", text: "Signal rejected: LONG 35/100 — 4H bearish trend, insufficient score", type: "reject" as const },
  { id: "a3", time: "Feb 15 15:02", text: "Position closed: BTC flat exit at $67,910 (+$0.82)", type: "info" as const },
  { id: "a4", time: "Feb 15 14:22", text: "Trade approved: LONG @ $67,850 — Score 72/100, volume confirmed", type: "approve" as const },
  { id: "a5", time: "Feb 14 12:00", text: "Context filter deployed: ATR + Volume + Regime checks active", type: "info" as const },
  { id: "a6", time: "Feb 13 21:30", text: "Trade approved: LONG @ $66,780 — Breakout + volume spike", type: "approve" as const },
];

export const scoutStats = {
  signalsAnalyzed: 2,
  tradesExecuted: 1,
  capitalProtected: 4, // 2 rejected × ~$2 each
  rejectedSignals: 2,
};

// ----- QUICK STATS -----
export const quickStats = {
  tasksThisWeek: 3,
  currentStreak: 5,
  projectsActive: 4,
};
