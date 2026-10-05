// PixelDesk Finance & Expense Tracker Data and Helpers

export const EXPENSE_CATEGORIES = [
  { id: "Food", label: "Food", icon: "🍔", color: "var(--color-coral)" },
  { id: "Transport", label: "Transport", icon: "🚌", color: "var(--color-yellow-dark)" },
  { id: "Shopping", label: "Shopping", icon: "🛍️", color: "var(--color-lavender)" },
  { id: "Education", label: "Education", icon: "📚", color: "var(--color-teal)" },
  { id: "Entertainment", label: "Entertainment", icon: "🎮", color: "var(--color-lavender-dark)" },
  { id: "Bills", label: "Bills", icon: "⚡", color: "var(--color-coral)" },
  { id: "Health", label: "Health", icon: "💊", color: "var(--color-teal)" },
  { id: "Other", label: "Other", icon: "📌", color: "var(--color-navy)" }
];

export const INCOME_CATEGORIES = [
  { id: "Salary", label: "Salary", icon: "💼", color: "var(--color-teal)" },
  { id: "Freelance", label: "Freelance", icon: "💻", color: "var(--color-teal)" },
  { id: "Gift", label: "Gift", icon: "🎁", color: "var(--color-yellow-dark)" },
  { id: "Other", label: "Other", icon: "🪙", color: "var(--color-navy)" }
];

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

// Helper to format currency in Indian Rupees (₹)
export function formatRupee(amount) {
  const num = Number(amount) || 0;
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2
  }).format(num);
  return `₹${formatted}`;
}

// Get local date YYYY-MM-DD
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Human relative date format
export function formatTransactionDate(dateStr) {
  if (!dateStr) return "";
  const todayStr = getLocalDateString();
  if (dateStr === todayStr) return "Today";

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (dateStr === getLocalDateString(yesterday)) return "Yesterday";

  const [y, m, d] = dateStr.split("-");
  const monthName = MONTH_NAMES[parseInt(m, 10) - 1]?.slice(0, 3) || m;
  return `${monthName} ${parseInt(d, 10)}, ${y}`;
}

// Starter demo transactions around current date
export function getStarterTransactions(baseDate = new Date()) {
  const y = baseDate.getFullYear();
  const m = String(baseDate.getMonth() + 1).padStart(2, "0");

  const todayStr = getLocalDateString(baseDate);

  const prevDay1 = new Date(baseDate);
  prevDay1.setDate(prevDay1.getDate() - 1);
  const prevDay1Str = getLocalDateString(prevDay1);

  const prevDay3 = new Date(baseDate);
  prevDay3.setDate(prevDay3.getDate() - 3);
  const prevDay3Str = getLocalDateString(prevDay3);

  const day1Str = `${y}-${m}-01`;

  return [
    {
      id: "tx_starter_1",
      type: "income",
      amount: 40000,
      category: "Salary",
      date: day1Str,
      description: "Monthly Software Engineering Stipend",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_2",
      type: "income",
      amount: 8500,
      category: "Freelance",
      date: prevDay3Str,
      description: "PixelDesk UI Consultation & Design",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_3",
      type: "expense",
      amount: 1450,
      category: "Food",
      date: todayStr,
      description: "Grocery run & Team lunch",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_4",
      type: "expense",
      amount: 650,
      category: "Transport",
      date: todayStr,
      description: "Metro card recharge",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_5",
      type: "expense",
      amount: 2200,
      category: "Bills",
      date: prevDay1Str,
      description: "High-speed broadband internet",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_6",
      type: "expense",
      amount: 3500,
      category: "Education",
      date: prevDay3Str,
      description: "Algorithm books & cloud subscription",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: "tx_starter_7",
      type: "expense",
      amount: 1800,
      category: "Shopping",
      date: prevDay3Str,
      description: "Mechanical keyboard keycaps",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];
}
