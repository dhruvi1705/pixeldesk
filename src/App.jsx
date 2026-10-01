import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LaunchPage } from "./pages/LaunchPage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { DesktopWorkspace } from "./components/DesktopWorkspace";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. Launch / Boot Screen */}
        <Route path="/" element={<LaunchPage />} />

        {/* 2. Login Page */}
        <Route path="/login" element={<LoginPage />} />

        {/* 3. Sign Up Page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* 4. Existing PixelDesk Desktop Workspace */}
        <Route path="/desktop" element={<DesktopWorkspace />} />

        {/* Fallback to Launch Screen */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
