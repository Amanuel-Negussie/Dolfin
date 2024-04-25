// app.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

// Defining the base url for our database 
axios.defaults.baseURL = "http://localhost:8000";

function DisplayTransactions({ publicTokens }: { publicTokens: string[] }) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allTransactions: any[] = [];

        for (const publicToken of publicTokens) {

          const accessTokenResponse = await axios.post("/exchange_public_token", {
            public_token: publicToken,
          });
          const accessToken = accessTokenResponse.data.accessToken;
          const transactionsResponse = await axios.post("/transactions/sync", {
            access_token: accessToken,
          });
          allTransactions.push(...transactionsResponse.data.transactions);
         
        }
        setTransactions(allTransactions);
      
        
        console.log(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchData();
  }, [publicTokens]);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => params.row.date || '',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 150,
      valueGetter: (params) => params.row.amount || '',
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 150,
      valueGetter: (params) => params.row.name || '',
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (params) => params.row.category || '',
    },
  ];

  const rows = transactions.map((transaction: any, index: number) => ({
    id: index + 1,
    date: transaction.date,
    amount: transaction.amount,
    name: transaction.name,
    category: transaction.personal_finance_category?.primary || "", 
  }));
  ;

  return (
    <div>
      <h2>Transactions</h2>
      <Box sx={{ height: 800, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[20]}
        checkboxSelection
        disableRowSelectionOnClick
      />
    </Box>

    </div>
  );
}




function App() {
  const [linkToken, setLinkToken] = useState("");
  const [publicTokens, setPublicTokens] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null); // State to store user data

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

  const { open, ready } = usePlaidLink({
    token: linkToken,
    onSuccess: (public_token: string) => {
      setPublicTokens((prevTokens) => [...prevTokens, public_token]);
    },
  });

  const fetchUserData = async (accessToken: string) => {
    try {
      const userDataResponse = await axios.post("/user/data", {
        access_token: accessToken,
      });
      setUserData(userDataResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    // Log the JSON data to the console when it updates
    console.log('JSON Data for UserData:', userData);
  }, [userData]); // This useEffect will run whenever jsonData changes

  useEffect(() => {
    if (publicTokens.length > 0) {
      const lastPublicToken = publicTokens[publicTokens.length - 1];
      axios
        .post("/exchange_public_token", {
          public_token: lastPublicToken,
        })
        .then((response) => {
          const accessToken = response.data.accessToken;
          fetchUserData(accessToken); // Call fetchUserData function with access token
        })
        .catch((error) => {
          console.error("Error exchanging public token:", error);
        });
    }
  }, [publicTokens]);

  

  return (
    <div>
      <Button onClick={() => open()} variant = "contained" disabled={!ready}>
        Connect a bank account
      </Button>
      {userData && (
        <Box>
          <h2>User Information</h2>
          <p>AccountID: {userData.accounts[0].account_id}</p>
          <p>Name: {userData.accounts[0].official_name}</p>
          <p>persistent_account_id: {userData.accounts[0].persistent_account_id}</p>
          {/* Add more user information as needed */}
         

        </Box>
      )}
      {publicTokens.length > 0 && <DisplayTransactions publicTokens={publicTokens} />}
    </div>
  );
}

export default App;
