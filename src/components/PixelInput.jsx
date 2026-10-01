import React, { useState } from "react";

export function PixelInput({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  autoComplete,
  disabled = false,
  hint
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="pixel-form-group">
      {label && (
        <label htmlFor={id} className="pixel-label">
          <span>
            {label} {required && <span style={{ color: "var(--color-coral)" }}>*</span>}
          </span>
          {hint && (
            <span style={{ fontSize: "8px", color: "var(--text-secondary)", fontFamily: "var(--font-retro)" }}>
              {hint}
            </span>
          )}
        </label>
      )}

      <div className="pixel-input-wrapper">
        <input
          id={id}
          name={id}
          type={actualType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`pixel-input ${error ? "error" : ""}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          style={{
            paddingRight: isPassword ? "54px" : "12px"
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="pixel-toggle-visibility-btn"
            aria-label={showPassword ? "Hide password" : "Show password"}
            title={showPassword ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {showPassword ? "HIDE" : "SHOW"}
          </button>
        )}
      </div>

      {error && (
        <p id={`${id}-error`} className="pixel-error-message" role="alert">
          ▶ {error}
        </p>
      )}
    </div>
  );
}
