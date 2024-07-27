import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./utils/ProtectedRoute";
import { PageLayout } from "./pages/PageLayout";
import { Dashboard } from "./pages/Dashboard";
import { Transactions } from "./pages/Transactions";
import { AccountPage } from "./pages/AccountsPage";
import { NetworthPage } from "./pages/NetworthPage.tsx";
import { AuthHandler } from "./pages/AuthHandler";
import HomePage from "./pages/HomePage";
import useCurrentUser from "./services/currentUser";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './styles.css';


const LandingPage = React.lazy(() => import("./pages/LandingPage"));

const routes = [
  { path: "/home", element: <Dashboard /> },
  { path: "/transactions", element: <Transactions /> },
  { path: "/accounts/*", element: <AccountPage /> },
  { path: "/networth/", element: <NetworthPage/>},
  { path: "/old", element: <HomePage /> },
  
  //{ path: "/example", element: <ExamplePage />},
];

export const App: React.FC = () => {
  const { isLoading } = useAuth0();
  const { setNewUser } = useCurrentUser();

  // Set the user to Guest if the user is not logged in
  useEffect(() => {
    setNewUser("Guest");
  }, []);

  if (isLoading) {
    return <div>Loading... 1</div>;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<AuthHandler />} />

        {routes.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute
                component={() => <PageLayout element={element} />}
              />
            }
          />
        ))}

        {/* Redirect to the root path if the route doesn't exist */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};
