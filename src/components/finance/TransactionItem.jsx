import React, { useState } from "react";
import { formatRupee, formatTransactionDate, ALL_CATEGORIES } from "../../data/financeCategories";

export function TransactionItem({
  transaction,
  onEdit,
  onDelete
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const isIncome = transaction.type === "income";
  const catObj = ALL_CATEGORIES.find((c) => c.id === transaction.category) || {
    icon: isIncome ? "🪙" : "📌",
    label: transaction.category
  };

  const amountDisplay = isIncome
    ? `+${formatRupee(transaction.amount)}`
    : `−${formatRupee(transaction.amount)}`;

  return (
    <article
      className="transaction-item-card"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        padding: "8px 10px",
        backgroundColor: "#ffffff",
        border: "1.5px solid var(--border)",
        borderLeft: isIncome ? "4px solid var(--color-teal)" : "4px solid var(--color-coral)",
        boxShadow: "1px 1px 0 var(--shadow)",
        transition: "border-color 0.15s ease"
      }}
    >
      {/* Top Row: Amount & Category Badge */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "20px",
            fontWeight: 700,
            color: isIncome ? "var(--color-teal)" : "var(--color-coral)",
            lineHeight: 1
          }}
        >
          {amountDisplay}
        </span>

        <span
          className="pixel-tag"
          style={{
            fontSize: "7.5px",
            backgroundColor: isIncome ? "var(--color-teal-light)" : "var(--color-coral-light)",
            borderColor: isIncome ? "var(--color-teal)" : "var(--color-coral)",
            color: "var(--color-navy)"
          }}
        >
          <span>{catObj.icon}</span>
          <span>{transaction.category}</span>
        </span>
      </div>

      {/* Middle Row: Description */}
      {transaction.description && (
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "12.5px",
            color: "var(--text-primary)",
            margin: 0,
            lineHeight: 1.3
          }}
        >
          {transaction.description}
        </p>
      )}

      {/* Bottom Row: Date & Actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px dashed var(--border-subtle)",
          paddingTop: "4px",
          marginTop: "2px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "13px",
            color: "var(--text-muted)"
          }}
        >
          {formatTransactionDate(transaction.date)}
        </span>

        {/* Delete Confirmation or Edit/Delete controls */}
        {isConfirmingDelete ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "var(--color-coral-light)",
              padding: "1px 5px",
              border: "1px solid var(--color-coral)"
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "7px",
                color: "var(--color-coral)",
                fontWeight: 700
              }}
            >
              DELETE?
            </span>
            <button
              type="button"
              onClick={() => onDelete(transaction.id)}
              className="pixel-button pixel-button-sm pixel-button-primary"
              style={{ padding: "1px 5px", fontSize: "7px" }}
            >
              YES
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(false)}
              className="pixel-button pixel-button-sm"
              style={{ padding: "1px 5px", fontSize: "7px" }}
            >
              NO
            </button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <button
              type="button"
              onClick={() => onEdit(transaction)}
              className="pixel-button pixel-button-sm"
              style={{ padding: "2px 5px", fontSize: "7px" }}
              aria-label={`Edit transaction ${transaction.category}`}
            >
              ✏️ EDIT
            </button>
            <button
              type="button"
              onClick={() => setIsConfirmingDelete(true)}
              className="pixel-button pixel-button-sm"
              style={{ padding: "2px 5px", fontSize: "7px", color: "var(--color-coral)" }}
              aria-label={`Delete transaction ${transaction.category}`}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </article>
  );
}
