import React, { useEffect, useState } from "react";
import axios from "axios";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import GradientCircularProgress from "./GradientCircularProgress";
import DisplayTransactions from "./DisplayTransactions";
import UserInformation from "./UserInformation";
import useFetchLinkToken from "../hooks/useFetchLinkToken";
import usePlaidLinkCustom from "../hooks/usePlaidLinkCustom";
import theme from "../theme/theme";

axios.defaults.baseURL = "http://localhost:8000";

function App() {
  const [publicTokens, setPublicTokens] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [identityData, setIdentityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const linkToken = useFetchLinkToken();
  const { open, ready } = usePlaidLinkCustom(linkToken, (public_token: string) => {
    setPublicTokens((prevTokens) => [...prevTokens, public_token]);
    setLoading(true);
  });

  useEffect(() => {
    if (publicTokens.length > 0) {
      const lastPublicToken = publicTokens[publicTokens.length - 1];
      axios.post("/exchange_public_token", { public_token: lastPublicToken })
        .then(response => {
          const accessToken = response.data.accessToken;
          fetchUserData(accessToken);
          fetchUserIdentity(accessToken);
        })
        .catch(error => {
          console.error("Error exchanging public token:", error);
        });
    }
  }, [publicTokens]);

  const fetchUserData = async (accessToken: string) => {
    try {
      const userDataResponse = await axios.post("/user/data", { access_token: accessToken });
      setUserData(userDataResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchUserIdentity = async (accessToken: string) => {
    try {
      const identityDataResponse = await axios.post("/user/identity", { access_token: accessToken });
      setIdentityData(identityDataResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
        <Button onClick={() => open()} variant="contained" color="primary" disabled={!ready}>
          Connect a bank account
        </Button>
        {loading && (!userData || !identityData) ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
            <GradientCircularProgress />
          </Box>
        ) : (
          <>
            {userData && identityData && <UserInformation userData={userData} identityData={identityData} />}
            {publicTokens.length > 0 && userData && identityData && <DisplayTransactions publicTokens={publicTokens} />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
