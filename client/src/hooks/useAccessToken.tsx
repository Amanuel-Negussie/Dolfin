import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const useAccessToken = () => {
  const { getAccessTokenSilently } = useAuth0();
  const [accessToken, setAccessToken] = useState('');

  useEffect(() => {
    async function fetchLinkToken() {
      try {
        const response = await getAccessTokenSilently();
        setAccessToken(response);
        console.log(response);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    }
    fetchLinkToken();
  }, [getAccessTokenSilently]);

  return accessToken;
};

export default useAccessToken;