import React from "react";
import { TransactionItem } from "./TransactionItem";

export function TransactionList({
  transactions = [],
  totalMonthTransactions = 0,
  searchQuery = "",
  typeFilter = "ALL",
  onNewTransaction,
  onEditTransaction,
  onDeleteTransaction
}) {
  return (
    <div
      className="transaction-list-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1.5px solid var(--border-subtle)",
          paddingBottom: "4px"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)"
          }}
        >
          TRANSACTIONS
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "13px",
            color: "var(--text-secondary)"
          }}
        >
          {transactions.length} Shown
        </span>
      </div>

      {/* Transaction Cards List */}
      <div
        className="transactions-scroll-view"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          maxHeight: "320px",
          overflowY: "auto",
          paddingRight: "2px"
        }}
      >
        {transactions.length === 0 ? (
          <div
            className="pixel-box"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px 10px",
              backgroundColor: "var(--surface-dark)",
              border: "1.5px dashed var(--border-subtle)",
              textAlign: "center",
              gap: "6px"
            }}
          >
            {totalMonthTransactions === 0 && !searchQuery ? (
              <>
                <span style={{ fontSize: "28px" }} role="img" aria-label="Money bag">
                  💰
                </span>
                <p
                  style={{
                    fontFamily: "var(--font-pixel)",
                    fontSize: "8.5px",
                    color: "var(--text-primary)",
                    margin: 0
                  }}
                >
                  No transactions yet.
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-retro)",
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    margin: 0
                  }}
                >
                  Start tracking where your money goes.
                </p>
                <button
                  type="button"
                  onClick={onNewTransaction}
                  className="pixel-button pixel-button-sm pixel-button-teal"
                  style={{ marginTop: "4px", fontSize: "7.5px", padding: "4px 8px" }}
                >
                  + ADD TRANSACTION
                </button>
              </>
            ) : searchQuery ? (
              <>
                <span style={{ fontSize: "20px" }}>🔍</span>
                <p
                  style={{
                    fontFamily: "var(--font-retro)",
                    fontSize: "15px",
                    color: "var(--text-secondary)",
                    margin: 0
                  }}
                >
                  No matching transactions found.
                </p>
              </>
            ) : typeFilter === "EXPENSES" ? (
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  margin: 0
                }}
              >
                No expenses recorded for this month.
              </p>
            ) : typeFilter === "INCOME" ? (
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  margin: 0
                }}
              >
                No income recorded for this month.
              </p>
            ) : (
              <p
                style={{
                  fontFamily: "var(--font-retro)",
                  fontSize: "15px",
                  color: "var(--text-secondary)",
                  margin: 0
                }}
              >
                No transactions found for this filter.
              </p>
            )}
          </div>
        ) : (
          transactions.map((tx) => (
            <TransactionItem
              key={tx.id}
              transaction={tx}
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
            />
          ))
        )}
      </div>
    </div>
  );
}
