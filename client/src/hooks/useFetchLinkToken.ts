import { useState, useEffect } from 'react';
import  axiosConfigs, { setAccessToken } from './axiosConfigs';

const useFetchLinkToken = (accessToken : string) => {
  const [linkToken, setLinkToken] = useState("");

  useEffect(() => {
    async function fetchLinkToken() {
      try {
        setAccessToken(accessToken);
        const response = await axiosConfigs.post("/create_link_token");
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    }
    fetchLinkToken();
  }, []);

  return linkToken;
};

export default useFetchLinkToken;
