import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { PageLayout } from "./pages/PageLayout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { AccountPage } from "./pages/AccountsPage";
import { NetworthPage } from "./pages/NetworthPage";

//import { Auth } from "./pages/Auth";
import HomePage from "./pages/HomePage";

const LandingPage = React.lazy(() => import("./pages/LandingPage"));

const routes = [
  { path: "/home", element: <Dashboard /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/accounts/*", element: <AccountPage /> },
  { path: "/old", element: <HomePage /> },
  { path: "/networth/", element: <NetworthPage/>}
  //{ path: "/example", element: <ExamplePage />},
];

export const App: React.FC = () => {
  const { isLoading, error } = useAuth0();

  if (isLoading) {
    return (
      <div>Loading... 1</div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      {/*<Route path="/auth" element={<Auth />} />*/}
      
      {routes.map(({ path, element }) => (
        <Route key={path} path={path} element={<ProtectedRoute component={() => <PageLayout element={element}/>} />} />
      ))}

      {/* Redirect to the root path if the route doesn't exist */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};