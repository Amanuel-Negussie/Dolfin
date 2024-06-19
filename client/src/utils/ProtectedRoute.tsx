import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";
import GradientCircularProgress from "../components/GradientCircularProgress";

interface ProtectedRouteProps {
  component: ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component,
}) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
        <GradientCircularProgress />
    ),
  });

  return <Component />;
};