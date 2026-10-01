import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthWindow } from "../components/AuthWindow";
import { PixelInput } from "../components/PixelInput";

export function SignupPage() {
  const navigate = useNavigate();

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [infoMessage, setInfoMessage] = useState(null);

  // Frontend validation only
  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    setInfoMessage(null);

    if (validateForm()) {
      // Per instructions: Do NOT create an account in a database, do NOT pretend account was created
      setInfoMessage("Account creation will be available when the PixelDesk backend is connected.");
    }
  };

  return (
    <AuthWindow title="PIXELDESK // SIGN UP" icon="📝" backTo="/login">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "13px",
            color: "var(--text-primary)",
            marginBottom: "6px"
          }}
        >
          Create your workspace
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0
          }}
        >
          Set up your profile to personalize your retro desktop.
        </p>
      </div>

      {/* Prototype Information Notice Banner */}
      {infoMessage && (
        <div
          role="status"
          aria-live="polite"
          style={{
            backgroundColor: "var(--color-yellow-light)",
            border: "2px solid var(--color-yellow-dark)",
            padding: "10px 12px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            boxShadow: "1px 1px 0 var(--shadow)"
          }}
        >
          <span style={{ fontSize: "16px" }}>ℹ️</span>
          <div style={{ fontSize: "12px", color: "var(--color-navy)", lineHeight: 1.4 }}>
            <strong>Prototype Notice:</strong> {infoMessage}
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSignupSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <PixelInput
          id="signup-username"
          label="Username"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
          }}
          placeholder="pixel_user"
          error={errors.username}
          required
          autoComplete="username"
        />

        <PixelInput
          id="signup-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
          }}
          placeholder="student@pixeldesk.dev"
          error={errors.email}
          required
          autoComplete="email"
        />

        <PixelInput
          id="signup-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
          }}
          placeholder="At least 6 characters"
          error={errors.password}
          required
          autoComplete="new-password"
        />

        <PixelInput
          id="signup-confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
          }}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
        />

        {/* Submit Button (Coral #E76F51) */}
        <button
          type="submit"
          className="pixel-button pixel-button-primary"
          style={{ width: "100%", padding: "10px", marginTop: "4px" }}
        >
          [ CREATE ACCOUNT ]
        </button>
      </form>

      {/* Divider */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          margin: "16px 0",
          color: "var(--text-secondary)",
          fontFamily: "var(--font-retro)",
          fontSize: "14px"
        }}
      >
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
        <span style={{ padding: "0 10px" }}>or</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
      </div>

      {/* Continue as Demo Action Button */}
      <button
        type="button"
        onClick={() => navigate("/desktop")}
        className="pixel-button pixel-button-teal"
        style={{ width: "100%", padding: "9px" }}
      >
        [ CONTINUE AS DEMO ]
      </button>

      {/* Footer Navigation Link */}
      <div
        style={{
          marginTop: "16px",
          textAlign: "center",
          fontSize: "12.5px",
          color: "var(--text-secondary)"
        }}
      >
        <span>Already have an account? </span>
        <Link
          to="/login"
          style={{
            color: "var(--color-coral)",
            fontWeight: 600,
            textDecoration: "none",
            borderBottom: "1px dashed var(--color-coral)"
          }}
        >
          Login
        </Link>
      </div>
    </AuthWindow>
  );
}
