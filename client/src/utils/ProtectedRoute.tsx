import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import React, { ComponentType } from "react";

interface ProtectedRouteProps {
  component: ComponentType;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component }) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => (
      <div>
        <LoadingSpinner />
      </div>
    ),
  });

  return <Component />;
};