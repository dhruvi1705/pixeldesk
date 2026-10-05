import React, { useState } from "react";
import { useFinance } from "../../hooks/useFinance";
import { FinanceSummary } from "./FinanceSummary";
import { FinanceMonthSelector } from "./FinanceMonthSelector";
import { FinanceCategoryBreakdown } from "./FinanceCategoryBreakdown";
import { TransactionSearch } from "./TransactionSearch";
import { TransactionFilters } from "./TransactionFilters";
import { TransactionList } from "./TransactionList";
import { TransactionForm } from "./TransactionForm";

export function FinanceWindow({ onClose: _onClose }) {
  const {
    transactions,
    filteredTransactions,
    monthSummary,
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
  } = useFinance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const handleOpenCreate = () => {
    setEditingTransaction(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTransaction(null);
  };

  const handleSaveForm = (data) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
    } else {
      createTransaction(data);
    }
    handleCloseForm();
  };

  return (
    <div
      className="finance-app-window"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        fontFamily: "var(--font-body)",
        maxWidth: "100%"
      }}
    >
      {/* Subtitle Banner Header */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "8px",
          gap: "8px",
          flexWrap: "wrap"
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "19px",
              color: "var(--text-primary)",
              margin: 0,
              lineHeight: 1.2
            }}
          >
            "Know where your pixels—and money—are going."
          </p>
          <p
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)",
              margin: "3px 0 0 0"
            }}
          >
            {transactions.length} TOTAL TRANSACTIONS LOGGED
          </p>
        </div>

        {/* Demo reset & Add button */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={loadStarterTransactions}
            className="pixel-button pixel-button-sm"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "7.5px", padding: "3px 6px" }}
            title="Reset to starter finance demo transactions"
          >
            ↺ DEMO
          </button>
          <button
            type="button"
            onClick={handleOpenCreate}
            className="pixel-button pixel-button-sm pixel-button-teal"
            style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", padding: "4px 8px" }}
          >
            + ADD
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      {isFormOpen ? (
        <TransactionForm
          key={editingTransaction ? editingTransaction.id : "new_tx"}
          initialTransaction={editingTransaction}
          onSave={handleSaveForm}
          onCancel={handleCloseForm}
        />
      ) : (
        <div
          className="finance-main-content-layout"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            width: "100%"
          }}
        >
          {/* Top: Month Selector */}
          <FinanceMonthSelector
            selectedYear={selectedYear}
            selectedMonth={selectedMonth}
            isCurrentMonth={isCurrentMonth}
            onPrevMonth={goToPrevMonth}
            onNextMonth={goToNextMonth}
            onCurrentMonth={goToCurrentMonth}
          />

          {/* Balance, Income, Expenses Summary */}
          <FinanceSummary monthSummary={monthSummary} />

          {/* Category Breakdown (horizontal pixel bars) */}
          <FinanceCategoryBreakdown breakdown={categoryBreakdown} />

          {/* Search Bar & Filters */}
          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <TransactionSearch
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />

            <TransactionFilters
              typeFilter={typeFilter}
              onTypeFilterChange={setTypeFilter}
              categoryFilter={categoryFilter}
              onCategoryFilterChange={setCategoryFilter}
            />
          </div>

          {/* Transactions List */}
          <TransactionList
            transactions={filteredTransactions}
            totalMonthTransactions={filteredTransactions.length}
            searchQuery={searchQuery}
            typeFilter={typeFilter}
            onNewTransaction={handleOpenCreate}
            onEditTransaction={handleOpenEdit}
            onDeleteTransaction={deleteTransaction}
          />
        </div>
      )}
    </div>
  );
}
