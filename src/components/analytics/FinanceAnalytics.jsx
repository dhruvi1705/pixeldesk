import React from "react";
import { formatCurrency } from "../../hooks/useAnalytics";
import { AnalyticsDonut } from "./AnalyticsDonut";
import { AnalyticsEmptyState } from "./AnalyticsEmptyState";

export function FinanceAnalytics({
  finance,
  onOpenFinance
}) {
  const {
    income = 0,
    expenses = 0,
    netBalance = 0,
    avgExpense = 0,
    largestExpense = 0,
    categories = [],
    topCategory = null,
    hasData = false
  } = finance || {};

  if (!hasData) {
    return (
      <AnalyticsEmptyState
        icon="💰"
        title="NO FINANCIAL DATA"
        message="Log income and expenses in Finance to see spending patterns, averages, and budget breakdown."
        actionLabel="OPEN FINANCE"
        onAction={onOpenFinance}
      />
    );
  }

  const donutItems = categories.map((cat) => ({
    label: cat.name,
    value: cat.amount,
    percentage: cat.percentage,
    display: formatCurrency(cat.amount)
  }));

  return (
    <div
      className="finance-analytics-card pixel-box"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        padding: "10px 12px",
        backgroundColor: "var(--surface)",
        border: "var(--pixel-border)",
        boxShadow: "var(--pixel-shadow-sm)",
        height: "100%"
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h3
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "8.5px",
            color: "var(--text-primary)",
            margin: 0
          }}
        >
          FINANCE & EXPENSES
        </h3>
        <span
          style={{
            fontFamily: "var(--font-retro)",
            fontSize: "14px",
            fontWeight: 700,
            color: netBalance >= 0 ? "var(--color-teal)" : "var(--color-coral)"
          }}
        >
          Net: {netBalance < 0 ? `-${formatCurrency(Math.abs(netBalance))}` : formatCurrency(netBalance)}
        </span>
      </div>

      {/* Income / Expense / Net Row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px"
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "4px 8px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--color-teal)"
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            INCOME
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700, color: "var(--color-teal)" }}>
            +{formatCurrency(income)}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "4px 8px",
            backgroundColor: "#ffffff",
            border: "1px solid var(--border)",
            borderLeft: "3px solid var(--color-coral)"
          }}
        >
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)" }}>
            EXPENSES
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "16px", fontWeight: 700, color: "var(--color-coral)" }}>
            -{formatCurrency(expenses)}
          </span>
        </div>
      </div>

      {/* Top Spending Callout & Stat Badges */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "6px 8px",
          backgroundColor: "var(--surface-dark)",
          border: "1px solid var(--border-subtle)",
          fontSize: "12px",
          fontFamily: "var(--font-body)"
        }}
      >
        <div>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)", display: "block" }}>
            TOP SPENDING
          </span>
          <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>
            {topCategory ? `${topCategory.name} (${topCategory.percentage}%)` : "None"}
          </span>
        </div>
        <div style={{ textAlign: "right" }}>
          <span style={{ fontFamily: "var(--font-pixel)", fontSize: "6.5px", color: "var(--text-secondary)", display: "block" }}>
            AVG / LARGEST EXPENSE
          </span>
          <span style={{ fontFamily: "var(--font-retro)", fontSize: "14px", fontWeight: 700 }}>
            {formatCurrency(avgExpense)} / {formatCurrency(largestExpense)}
          </span>
        </div>
      </div>

      {/* Donut Category Chart */}
      <div style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "6px" }}>
        <span
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "7px",
            color: "var(--text-secondary)",
            display: "block",
            marginBottom: "4px"
          }}
        >
          SPENDING CATEGORIES
        </span>
        <AnalyticsDonut items={donutItems} size={90} emptyMessage="No expense categories" />
      </div>
    </div>
  );
}
