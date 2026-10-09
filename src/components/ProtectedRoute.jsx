import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../utils/authService";

export function ProtectedRoute({ children }) {
  const location = useLocation();
  const [authState, setAuthState] = useState({
    status: "checking", // "checking" | "authenticated" | "unauthenticated" | "error"
    user: null,
    errorMessage: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function verifySession() {
      const token = authService.getToken();
      if (!token) {
        if (isMounted) {
          setAuthState({ status: "unauthenticated", user: null, errorMessage: null });
        }
        return;
      }

      try {
        const user = await authService.getCurrentUser();
        if (!isMounted) return;

        if (user && user.id) {
          setAuthState({ status: "authenticated", user, errorMessage: null });
        } else {
          // Token is invalid or expired
          authService.logout();
          setAuthState({ status: "unauthenticated", user: null, errorMessage: null });
        }
      } catch (err) {
        if (!isMounted) return;
        setAuthState({
          status: "error",
          user: null,
          errorMessage: "Failed to verify authenticated session with the backend server.",
        });
      }
    }

    verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState.status === "checking") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-navy-dark, #161F2E)",
          color: "var(--color-cream, #EDE5D3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-pixel, monospace)",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "32px", marginBottom: "16px" }}>🔒</div>
        <div style={{ fontSize: "14px", letterSpacing: "1px", color: "var(--color-teal, #4E9F9A)", marginBottom: "8px" }}>
          PIXELDESK // AUTHENTICATING
        </div>
        <div style={{ fontSize: "11px", color: "var(--text-secondary, #A4B3C6)" }}>
          Verifying secure user session...
        </div>
      </div>
    );
  }

  if (authState.status === "error") {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "var(--color-navy-dark, #161F2E)",
          color: "var(--color-cream, #EDE5D3)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-retro, sans-serif)",
          padding: "20px",
          textAlign: "center"
        }}
      >
        <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</div>
        <h2 style={{ fontFamily: "var(--font-pixel)", fontSize: "12px", color: "var(--color-coral)", marginBottom: "8px" }}>
          BACKEND CONNECTION ERROR
        </h2>
        <p style={{ maxWidth: "380px", fontSize: "14px", color: "var(--text-secondary)", marginBottom: "20px" }}>
          {authState.errorMessage}
        </p>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="pixel-button pixel-button-teal"
          >
            [ RETRY ]
          </button>
          <button
            type="button"
            onClick={() => {
              authService.logout();
              window.location.href = "/login";
            }}
            className="pixel-button pixel-button-primary"
          >
            [ BACK TO LOGIN ]
          </button>
        </div>
      </div>
    );
  }

  if (authState.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Key the children by authenticated user ID so switching users completely flushes in-memory state
  return (
    <React.Fragment key={authState.user?.id || "auth-workspace"}>
      {React.cloneElement(children, { currentUser: authState.user })}
    </React.Fragment>
  );
}
