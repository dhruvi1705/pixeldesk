import React, { useState } from "react";
import {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getLocalDateString
} from "../../data/financeCategories";

export function TransactionForm({
  initialTransaction = null,
  onSave,
  onCancel
}) {
  const isEditing = !!initialTransaction;

  const [type, setType] = useState(() => initialTransaction?.type || "expense");
  const [amount, setAmount] = useState(() => (initialTransaction ? String(initialTransaction.amount) : ""));
  const [category, setCategory] = useState(() => {
    if (initialTransaction?.category) return initialTransaction.category;
    return initialTransaction?.type === "income" ? "Salary" : "Food";
  });
  const [date, setDate] = useState(() => initialTransaction?.date || getLocalDateString());
  const [description, setDescription] = useState(() => initialTransaction?.description || "");
  const [error, setError] = useState("");

  const handleTypeChange = (newType) => {
    setType(newType);
    if (!initialTransaction || initialTransaction.type !== newType) {
      setCategory(newType === "income" ? "Salary" : "Food");
    }
  };

  const categories = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e) => {
    e.preventDefault();

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Amount must be a valid number greater than 0.");
      return;
    }

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!date) {
      setError("Transaction date is required.");
      return;
    }

    setError("");
    onSave({
      type,
      amount: numAmount,
      category,
      date,
      description: description.trim()
    });
  };

  return (
    <div
      role="dialog"
      aria-label={isEditing ? "Edit Transaction" : "Add Transaction"}
      className="transaction-form-overlay animate-window-pop pixel-box"
      style={{
        border: "2px solid var(--border)",
        backgroundColor: "var(--surface)",
        boxShadow: "var(--pixel-shadow)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "6px"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "14px" }}>{isEditing ? "✏️" : "💰"}</span>
          <h3
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "9.5px",
              margin: 0,
              color: "var(--text-primary)"
            }}
          >
            {isEditing ? "EDIT TRANSACTION" : "NEW TRANSACTION"}
          </h3>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close transaction form"
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontFamily: "var(--font-pixel)",
            fontSize: "10px",
            color: "var(--text-primary)"
          }}
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {/* Error notification */}
        {error && (
          <div
            className="pixel-error-message"
            style={{
              backgroundColor: "var(--color-coral-light)",
              padding: "4px 8px",
              border: "1px solid var(--color-coral)"
            }}
          >
            ⚠️ {error}
          </div>
        )}

        {/* Transaction Type Selector: [ INCOME ] [ EXPENSE ] */}
        <div className="pixel-form-group">
          <label className="pixel-label">
            <span>TYPE *</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
            <button
              type="button"
              onClick={() => handleTypeChange("expense")}
              className={`pixel-toggle-btn ${type === "expense" ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "8.5px",
                padding: "6px 8px",
                backgroundColor: type === "expense" ? "var(--color-coral)" : "var(--surface-dark)",
                color: type === "expense" ? "#ffffff" : "var(--text-primary)",
                borderColor: type === "expense" ? "var(--border)" : "var(--border-subtle)"
              }}
            >
              − EXPENSE
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange("income")}
              className={`pixel-toggle-btn ${type === "income" ? "active" : ""}`}
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "8.5px",
                padding: "6px 8px",
                backgroundColor: type === "income" ? "var(--color-teal)" : "var(--surface-dark)",
                color: type === "income" ? "#ffffff" : "var(--text-primary)",
                borderColor: type === "income" ? "var(--border)" : "var(--border-subtle)"
              }}
            >
              + INCOME
            </button>
          </div>
        </div>

        {/* Amount & Date in 2 columns */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          {/* Amount Input */}
          <div className="pixel-form-group">
            <label htmlFor="tx-amount" className="pixel-label">
              <span>AMOUNT (₹) *</span>
            </label>
            <input
              id="tx-amount"
              type="number"
              step="any"
              min="0.01"
              placeholder="e.g. 500"
              className="pixel-input"
              value={amount}
              onChange={(e) => {
                setAmount(e.target.value);
                if (error) setError("");
              }}
              required
              autoFocus
            />
          </div>

          {/* Date Input */}
          <div className="pixel-form-group">
            <label htmlFor="tx-date" className="pixel-label">
              <span>DATE *</span>
            </label>
            <input
              id="tx-date"
              type="date"
              className="pixel-input"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                if (error) setError("");
              }}
              required
            />
          </div>
        </div>

        {/* Category Picker */}
        <div className="pixel-form-group">
          <label htmlFor="tx-category" className="pixel-label">
            <span>CATEGORY *</span>
          </label>
          <select
            id="tx-category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (error) setError("");
            }}
            className="pixel-input"
            style={{ backgroundColor: "#ffffff", padding: "6px 8px" }}
            required
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description Input */}
        <div className="pixel-form-group">
          <label htmlFor="tx-desc" className="pixel-label">
            <span>DESCRIPTION (OPTIONAL)</span>
          </label>
          <input
            id="tx-desc"
            type="text"
            className="pixel-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Team lunch, Client invoice, Metro card"
            maxLength={100}
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "6px", marginTop: "4px" }}>
          <button
            type="button"
            onClick={onCancel}
            className="pixel-button"
            style={{ fontSize: "8px", padding: "6px 12px" }}
          >
            CANCEL
          </button>
          <button
            type="submit"
            className={`pixel-button ${type === "income" ? "pixel-button-teal" : "pixel-button-primary"}`}
            style={{ fontSize: "8px", padding: "6px 14px" }}
          >
            {isEditing ? "UPDATE TRANSACTION" : "SAVE TRANSACTION"}
          </button>
        </div>
      </form>
    </div>
  );
}
