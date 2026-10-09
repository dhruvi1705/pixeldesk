import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthWindow } from "../components/AuthWindow";
import { PixelInput } from "../components/PixelInput";
import { authService } from "../utils/authService";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setServerError(null);

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await authService.login({ email, password });
      if (result.success) {
        const from = location.state?.from?.pathname || location.state?.from || "/desktop";
        navigate(from, { replace: true });
      } else {
        setServerError(result.error);
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthWindow title="PIXELDESK // LOGIN" icon="🔑" backTo="/">
      <div style={{ textAlign: "center", marginBottom: "16px" }}>
        <h2
          style={{
            fontFamily: "var(--font-pixel)",
            fontSize: "13px",
            color: "var(--text-primary)",
            marginBottom: "6px"
          }}
        >
          Welcome back!
        </h2>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-secondary)",
            margin: 0
          }}
        >
          Enter your credentials to access your workspace.
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
            <strong>Authentication Notice:</strong> {serverError}
          </div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLoginSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <PixelInput
          id="login-email"
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

        <PixelInput
          id="login-password"
          label="Password"
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
            if (serverError) setServerError(null);
          }}
          placeholder="••••••••"
          error={errors.password}
          required
          autoComplete="current-password"
          disabled={isLoading}
        />

        {/* Forgot Password Link */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "-4px" }}>
          <button
            type="button"
            onClick={() => setShowForgotPasswordModal(true)}
            style={{
              background: "none",
              border: "none",
              fontFamily: "var(--font-retro)",
              fontSize: "14px",
              color: "var(--color-teal)",
              textDecoration: "underline",
              cursor: "pointer",
              padding: "2px 0"
            }}
          >
            Forgot password?
          </button>
        </div>

        {/* Submit Button (Coral #E76F51) */}
        <button
          type="submit"
          className="pixel-button pixel-button-primary"
          disabled={isLoading}
          style={{ width: "100%", padding: "10px", marginTop: "4px" }}
        >
          {isLoading ? "[ LOGGING IN... ]" : "[ LOGIN ]"}
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
        <span>New to PixelDesk? </span>
        <Link
          to="/signup"
          style={{
            color: "var(--color-coral)",
            fontWeight: 600,
            textDecoration: "none",
            borderBottom: "1px dashed var(--color-coral)"
          }}
        >
          Create an account
        </Link>
      </div>

      {/* Forgot Password Informational Modal */}
      {showForgotPasswordModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="forgot-pw-title"
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(36, 50, 74, 0.75)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "16px",
            zIndex: 100
          }}
        >
          <div
            className="pixel-window animate-window-pop"
            style={{
              width: "100%",
              maxWidth: "340px",
              backgroundColor: "var(--surface)",
              border: "2px solid var(--border)",
              boxShadow: "var(--pixel-shadow)",
              padding: "16px"
            }}
          >
            <h3
              id="forgot-pw-title"
              style={{
                fontFamily: "var(--font-pixel)",
                fontSize: "10px",
                color: "var(--text-primary)",
                marginBottom: "10px"
              }}
            >
              Password Recovery
            </h3>
            <p
              style={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                lineHeight: 1.5,
                marginBottom: "16px"
              }}
            >
              For security, password reset tokens are handled via support or admin console in this release.
            </p>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowForgotPasswordModal(false)}
                className="pixel-button pixel-button-primary pixel-button-sm"
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthWindow>
  );
}
