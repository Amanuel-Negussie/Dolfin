import React, { ReactElement, useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { MainNav } from "@/components/MainNav";
import { AccountMenu } from "@/components/AccountMenu";
import { setAccessToken } from "@/services/api";

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

      <div className="hidden md:flex flex-col items-center">
        <div className="border-b w-full">
          <div className="flex h-16 items-center px-4 max-w-[1920px] w-full mx-auto">
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <AccountMenu name={user?.nickname} email={user?.email} picture={user?.picture} logout={logout} />
            </div>
          </div>
        </div>

        <div className="flex-grow flex justify-center w-full">
          <div className="max-w-[1920px] w-full px-4">
            {element}
          </div>
        </div>

        <div className="border-t mt-auto w-full">
          <div className="max-w-[1920px] w-full mx-auto">
            {/* Footer content here */}
          </div>
        </div>
      </div>
    </div>
  )
};