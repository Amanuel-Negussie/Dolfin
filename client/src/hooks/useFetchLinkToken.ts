import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchLinkToken = () => {
  const [linkToken, setLinkToken] = useState("");

  useEffect(() => {
    async function fetchLinkToken() {
      try {
        const response = await axios.post("/create_link_token");
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
