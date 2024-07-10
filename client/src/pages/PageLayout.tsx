import React, { ReactElement, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { setAccessToken } from '../hooks/axiosConfigs';
import { MainNav } from "@/components/MainNav";
import { AccountMenu } from "@/components/AccountMenu";

interface PageLayoutProps {
  element: ReactElement;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ element }) => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently, logout } = useAuth0();

  const [isFetched, setIsFetched] = useState<boolean>(false);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <div>Not authenticated</div>;
  }

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessTokenSilently();
      setAccessToken(token);
      setIsFetched(true);
    };
    fetchAccessToken();
  }, []);

  if (!isFetched) {
    return <div>Fetching access token...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="md:hidden">
        Mobile
      </div>

      <div className="hidden md:flex flex-col">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <AccountMenu name={user?.nickname} email={user?.email} picture={user?.picture} logout={logout} />
            </div>
          </div>
        </div>

        <div className="flex-grow">
          {element}
        </div>

        <div className="border-t mt-auto">
        </div>
      </div>
    </div>
  )
};