import React from "react";
import { formatRupee } from "../../data/financeCategories";

export function FinanceSummary({
  monthSummary
}) {
  const { balance = 0, income = 0, expenses = 0 } = monthSummary || {};

  return (
    <div
      className="finance-summary-container"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        width: "100%"
      }}
    >
      {/* Net Balance Card */}
      <div
        className="pixel-box"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "12px",
          backgroundColor: "var(--color-navy)",
          color: "var(--color-cream)",
          border: "2px solid var(--border)",
          boxShadow: "var(--pixel-shadow-sm)"
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8px",
            color: "var(--color-cream-panel)",
            letterSpacing: "0.5px"
          }}
        >
          MONTHLY BALANCE
        </span>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "36px",
            fontWeight: 700,
            lineHeight: 1.1,
            marginTop: "2px",
            color: balance >= 0 ? "var(--color-teal)" : "var(--color-coral)"
          }}
        >
          {balance < 0 ? `-${formatRupee(Math.abs(balance))}` : formatRupee(balance)}
        </span>
      </div>

      {/* Income & Expense Split Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "8px"
        }}
      >
        {/* Income Card */}
        <div
          className="pixel-box"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 10px",
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--border)",
            borderLeft: "4px solid var(--color-teal)",
            boxShadow: "var(--pixel-shadow-sm)"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)"
            }}
          >
            INCOME
          </span>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--color-teal)",
              marginTop: "2px",
              lineHeight: 1.2
            }}
          >
            +{formatRupee(income)}
          </span>
        </div>

        {/* Expenses Card */}
        <div
          className="pixel-box"
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "8px 10px",
            backgroundColor: "#ffffff",
            border: "1.5px solid var(--border)",
            borderLeft: "4px solid var(--color-coral)",
            boxShadow: "var(--pixel-shadow-sm)"
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-pixel)",
              fontSize: "7.5px",
              color: "var(--text-secondary)"
            }}
          >
            EXPENSES
          </span>
          <span
            style={{
              fontFamily: "var(--font-retro)",
              fontSize: "22px",
              fontWeight: 700,
              color: "var(--color-coral)",
              marginTop: "2px",
              lineHeight: 1.2
            }}
          >
            -{formatRupee(expenses)}
          </span>
        </div>
      </div>
    </div>
  );
}
