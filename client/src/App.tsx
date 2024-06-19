import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import GradientCircularProgress from "./components/GradientCircularProgress";

export const App: React.FC = () => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <GradientCircularProgress />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/home"
        element={<ProtectedRoute component={HomePage} />}
      />
    </Routes>
  );
};