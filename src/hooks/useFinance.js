import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getStarterTransactions
} from "../data/financeCategories";
import { scopedStorage } from "../utils/storage";
import { apiClient } from "../utils/apiClient";
import { authService } from "../utils/authService";

const STORAGE_KEY = "transactions";

function normalizeTransaction(tx) {
  if (!tx) return null;
  return {
    id: tx.id,
    type: tx.type === "income" ? "income" : "expense",
    amount: Number(tx.amount) || 0,
    category: tx.category || "Other",
    date: typeof tx.date === "string" ? tx.date : String(tx.date),
    description: tx.description || "",
    createdAt: tx.created_at || tx.createdAt || new Date().toISOString(),
    updatedAt: tx.updated_at || tx.updatedAt || new Date().toISOString()
  };
}

export function useFinance() {
  // 1. Transactions state
  const [transactions, setTransactions] = useState(() => {
    try {
      const stored = scopedStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = typeof stored === "string" ? JSON.parse(stored) : stored;
        if (Array.isArray(parsed)) {
          return parsed.map(normalizeTransaction).filter(Boolean);
        }
      }
    } catch (err) {
      console.warn("Failed to load transactions from scopedStorage:", err);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState(null);

  // Current system year and month
  const [currentYear] = useState(() => new Date().getFullYear());
  const [currentMonth] = useState(() => new Date().getMonth());

  // 2. Month selection state
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth); // 0-11

  const isCurrentMonth = selectedYear === currentYear && selectedMonth === currentMonth;

  // 3. Search and filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL"); // "ALL" | "INCOME" | "EXPENSES"
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Fetch transactions from authenticated API
  const fetchTransactions = useCallback(async () => {
    if (!authService.isAuthenticated()) {
      setIsLoading(false);
      return;
    }

    try {
      setIsSyncing(true);
      setError(null);
      const remoteTxs = await apiClient.finance.list();
      if (Array.isArray(remoteTxs)) {
        const normalized = remoteTxs.map(normalizeTransaction).filter(Boolean);
        setTransactions(normalized);
        try {
          scopedStorage.setItem(STORAGE_KEY, normalized);
        } catch (storageErr) {
          console.error("Failed to cache remote transactions:", storageErr);
        }
      }
    } catch (err) {
      console.warn("Backend finance fetch failed, using cached data:", err.message);
      setError(err.message);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // Persist to scopedStorage on change and notify listeners
  useEffect(() => {
    try {
      scopedStorage.setItem(STORAGE_KEY, transactions);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("pixeldesk_finance_event", {
            detail: { timestamp: new Date().toISOString() }
          })
        );
      }
    } catch (err) {
      console.error("Failed to save transactions to scopedStorage:", err);
    }
  }, [transactions]);

  // Month navigation
  const goToNextMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      if (prev === 11) {
        setSelectedYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  }, []);

  const goToPrevMonth = useCallback(() => {
    setSelectedMonth((prev) => {
      if (prev === 0) {
        setSelectedYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  }, []);

  const goToCurrentMonth = useCallback(() => {
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  }, []);

  // Format selected month prefix: "YYYY-MM"
  const selectedMonthPrefix = useMemo(() => {
    const m = String(selectedMonth + 1).padStart(2, "0");
    return `${selectedYear}-${m}`;
  }, [selectedYear, selectedMonth]);

  // Transactions belonging to selected month
  const monthTransactions = useMemo(() => {
    return transactions.filter((tx) => tx.date && tx.date.startsWith(selectedMonthPrefix));
  }, [transactions, selectedMonthPrefix]);

  // Dynamically calculate selected month totals
  const monthSummary = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const tx of monthTransactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        income += amt;
      } else if (tx.type === "expense") {
        expenses += amt;
      }
    }

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [monthTransactions]);

  // Overall all-time summary
  const overallSummary = useMemo(() => {
    let income = 0;
    let expenses = 0;

    for (const tx of transactions) {
      const amt = Number(tx.amount) || 0;
      if (tx.type === "income") {
        income += amt;
      } else if (tx.type === "expense") {
        expenses += amt;
      }
    }

    return {
      income,
      expenses,
      balance: income - expenses
    };
  }, [transactions]);

  // Category spending breakdown for selected month
  const categoryBreakdown = useMemo(() => {
    const expenseTxs = monthTransactions.filter((tx) => tx.type === "expense");
    const totalExpenses = monthSummary.expenses;

    const map = {};
    for (const tx of expenseTxs) {
      const cat = tx.category || "Other";
      const amt = Number(tx.amount) || 0;
      map[cat] = (map[cat] || 0) + amt;
    }

    return Object.entries(map)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? Math.round((amount / totalExpenses) * 100) : 0
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [monthTransactions, monthSummary.expenses]);

  // Filtered transactions for display
  const filteredTransactions = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return monthTransactions
      .filter((tx) => {
        // Type filter
        if (typeFilter === "INCOME" && tx.type !== "income") return false;
        if (typeFilter === "EXPENSES" && tx.type !== "expense") return false;

        // Category filter
        if (categoryFilter !== "ALL" && tx.category !== categoryFilter) return false;

        // Search query
        if (query) {
          const matchDesc = (tx.description || "").toLowerCase().includes(query);
          const matchCat = (tx.category || "").toLowerCase().includes(query);
          const matchType = (tx.type || "").toLowerCase().includes(query);
          return matchDesc || matchCat || matchType;
        }

        return true;
      })
      .sort((a, b) => {
        // Newest date first, then newest createdAt
        if (a.date !== b.date) {
          return (b.date || "").localeCompare(a.date || "");
        }
        return (b.createdAt || "").localeCompare(a.createdAt || "");
      });
  }, [monthTransactions, typeFilter, categoryFilter, searchQuery]);

  // Create transaction
  const createTransaction = useCallback(async (data) => {
    const numAmount = parseFloat(data.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return { success: false, error: "Please enter a valid amount greater than 0." };
    }
    if (!data.category) {
      return { success: false, error: "Please select a category." };
    }
    if (!data.date) {
      return { success: false, error: "Please choose a date." };
    }

    const tempId = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    const newTx = {
      id: tempId,
      type: data.type === "income" ? "income" : "expense",
      amount: numAmount,
      category: data.category,
      date: data.date,
      description: (data.description || "").trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Optimistic UI update
    setTransactions((prev) => [newTx, ...prev]);

    // Keep month view synced if transaction is in a different month
    const [y, m] = data.date.split("-").map(Number);
    if (!isNaN(y) && !isNaN(m)) {
      setSelectedYear(y);
      setSelectedMonth(m - 1);
    }

    // Backend sync
    if (authService.isAuthenticated()) {
      try {
        setIsSyncing(true);
        const remote = await apiClient.finance.create(newTx);
        if (remote && remote.id) {
          const synced = normalizeTransaction(remote);
          setTransactions((prev) => prev.map((t) => (t.id === tempId ? synced : t)));
          return { success: true, transaction: synced };
        }
      } catch (err) {
        console.warn("Backend finance creation failed:", err.message);
        setError(err.message);
      } finally {
        setIsSyncing(false);
      }
    }

    return { success: true, transaction: newTx };
  }, []);

  // Update transaction
  const updateTransaction = useCallback(async (id, updates) => {
    const numAmount = updates.amount !== undefined ? parseFloat(updates.amount) : undefined;
    if (numAmount !== undefined && (isNaN(numAmount) || numAmount <= 0)) {
      return { success: false, error: "Amount must be greater than 0." };
    }

    let updatedTx = null;
    setTransactions((prev) =>
      prev.map((tx) => {
        if (tx.id === id) {
          updatedTx = {
            ...tx,
            ...updates,
            ...(numAmount !== undefined ? { amount: numAmount } : {}),
            description: updates.description !== undefined ? updates.description.trim() : tx.description,
            updatedAt: new Date().toISOString()
          };
          return updatedTx;
        }
        return tx;
      })
    );

    if (updatedTx) {
      if (authService.isAuthenticated()) {
        try {
          setIsSyncing(true);
          const remote = await apiClient.finance.update(id, updates);
          if (remote) {
            const synced = normalizeTransaction(remote);
            setTransactions((prev) => prev.map((t) => (t.id === id ? synced : t)));
          }
        } catch (err) {
          console.warn("Backend finance update failed:", err.message);
          setError(err.message);
        } finally {
          setIsSyncing(false);
        }
      }

      return { success: true, transaction: updatedTx };
    }
    return { success: false, error: "Transaction not found." };
  }, []);

  // Delete transaction
  const deleteTransaction = useCallback(async (id) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));

    if (authService.isAuthenticated()) {
      try {
        setIsSyncing(true);
        await apiClient.finance.delete(id);
      } catch (err) {
        console.warn("Backend finance delete failed:", err.message);
        setError(err.message);
      } finally {
        setIsSyncing(false);
      }
    }
  }, []);

  // Reset to starter transactions
  const loadStarterTransactions = useCallback(() => {
    const starters = getStarterTransactions();
    setTransactions(starters);
    const now = new Date();
    setSelectedYear(now.getFullYear());
    setSelectedMonth(now.getMonth());
  }, []);

  return {
    transactions,
    isLoading,
    isSyncing,
    error,
    refreshTransactions: fetchTransactions,
    filteredTransactions,
    monthSummary,
    overallSummary,
    categoryBreakdown,
    selectedYear,
    selectedMonth,
    isCurrentMonth,
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    categoryFilter,
    setCategoryFilter,
    goToPrevMonth,
    goToNextMonth,
    goToCurrentMonth,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    loadStarterTransactions
  };
}
