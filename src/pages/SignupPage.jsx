import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthWindow } from "../components/AuthWindow";
import { PixelInput } from "../components/PixelInput";
import { authService } from "../utils/authService";

const COMMON_WEAK_PASSWORDS = new Set([
  "password",
  "password1",
  "password123",
  "password123!",
  "12345678",
  "123456789",
  "1234567890",
  "87654321",
  "qwertyui",
  "qwerty123",
  "admin123",
  "admin123!",
  "administrator",
  "letmein123",
  "letmein123!",
  "pixeldesk",
  "pixeldesk123",
  "pixeldesk123!",
  "welcome1",
  "welcome123",
  "welcome123!",
  "iloveyou",
  "iloveyou123!",
  "sunshine1",
  "princess1",
  "football1",
  "monkey123",
  "changeme",
  "changeme123",
  "passphrase",
  "master123",
  "p@ssw0rd123!"
]);

function validatePasswordCriteria(pwd) {
  if (!pwd) {
    return "Password is required.";
  }
  if (!pwd.trim()) {
    return "Password cannot consist solely of whitespace.";
  }
  if (pwd.length < 8) {
    return "Password must be at least 8 characters.";
  }
  if (pwd.length > 128) {
    return "Password cannot exceed 128 characters.";
  }
  try {
    const encoder = new TextEncoder();
    if (encoder.encode(pwd).length > 72) {
      return "Password exceeds the maximum 72-byte limit for secure hashing.";
    }
  } catch {}
  if (!/[A-Z]/.test(pwd)) {
    return "Password must contain at least one uppercase letter (A–Z).";
  }
  if (!/[a-z]/.test(pwd)) {
    return "Password must contain at least one lowercase letter (a–z).";
  }
  if (!/[0-9]/.test(pwd)) {
    return "Password must contain at least one number (0–9).";
  }
  if (!/[^A-Za-z0-9\s]/.test(pwd)) {
    return "Password must contain at least one special character (e.g. @, #, $, %, !, &).";
  }
  if (COMMON_WEAK_PASSWORDS.has(pwd.toLowerCase())) {
    return "Password is too common or easily guessed. Please choose a stronger password.";
  }
  if (new Set(pwd).size === 1) {
    return "Password cannot consist of a single repeated character.";
  }
  return null;
}

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

    const passwordError = validatePasswordCriteria(password);
    if (passwordError) {
      newErrors.password = passwordError;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authService.signup({ username, email, password });
      if (result.success) {
        const from = location.state?.from?.pathname || location.state?.from || "/desktop";
        navigate(from, { replace: true });
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("An unexpected error occurred during signup. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthWindow title="PIXELDESK // SIGN UP" icon="📝" backTo="/login">
      <div style={{ textAlign: "center", marginBottom: "14px" }}>
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

      {/* Server Error / Notice Banner */}
      {serverError && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            backgroundColor: "var(--color-coral-light, #ffe8e4)",
            border: "2px solid var(--color-coral, #e76f51)",
            padding: "10px 12px",
            marginBottom: "14px",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
            boxShadow: "1px 1px 0 var(--shadow)"
          }}
        >
          <span style={{ fontSize: "16px" }}>⚠️</span>
          <div style={{ fontSize: "12px", color: "var(--color-navy)", lineHeight: 1.4 }}>
            <strong>Registration Notice:</strong> {serverError}
          </div>
        </div>
      )}

      {/* Sign Up Form */}
      <form onSubmit={handleSignupSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <PixelInput
          id="signup-username"
          label="Username / Display Name"
          type="text"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            if (errors.username) setErrors((prev) => ({ ...prev, username: null }));
            if (serverError) setServerError(null);
          }}
          placeholder="pixel_user"
          error={errors.username}
          required
          autoComplete="username"
          disabled={isLoading}
        />

        <PixelInput
          id="signup-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
            if (serverError) setServerError(null);
          }}
          placeholder="student@pixeldesk.dev"
          error={errors.email}
          required
          autoComplete="email"
          disabled={isLoading}
        />

        <div>
          <PixelInput
            id="signup-password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
              if (serverError) setServerError(null);
            }}
            placeholder="Min 8 chars (e.g. Secret123!)"
            error={errors.password}
            required
            autoComplete="new-password"
            disabled={isLoading}
          />

          {/* Password Policy Helper Box */}
          <div
            style={{
              marginTop: "4px",
              padding: "6px 8px",
              backgroundColor: "var(--surface-dark, #161F2E)",
              border: "1px solid var(--border-subtle, #2C3E55)",
              fontSize: "11px",
              fontFamily: "var(--font-retro, sans-serif)",
              color: "var(--text-secondary, #A4B3C6)",
              lineHeight: 1.35
            }}
          >
            <div style={{ fontFamily: "var(--font-pixel)", fontSize: "8px", color: "var(--color-teal)", marginBottom: "3px" }}>
              PASSWORD REQUIREMENTS:
            </div>
            <ul style={{ margin: 0, paddingLeft: "14px" }}>
              <li>8 to 128 characters (max 72 bytes)</li>
              <li>At least one uppercase letter (A–Z)</li>
              <li>At least one lowercase letter (a–z)</li>
              <li>At least one number (0–9)</li>
              <li>At least one special character (e.g. @, #, $, %, !, &)</li>
              <li>Avoid common or easily guessed passwords</li>
            </ul>
          </div>
        </div>

        <PixelInput
          id="signup-confirm-password"
          label="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: null }));
            if (serverError) setServerError(null);
          }}
          placeholder="Re-enter password"
          error={errors.confirmPassword}
          required
          autoComplete="new-password"
          disabled={isLoading}
        />

        {/* Submit Button (Coral #E76F51) */}
        <button
          type="submit"
          className="pixel-button pixel-button-primary"
          disabled={isLoading}
          style={{ width: "100%", padding: "10px", marginTop: "4px" }}
        >
          {isLoading ? "[ CREATING ACCOUNT... ]" : "[ CREATE ACCOUNT ]"}
        </button>
      </form>

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
