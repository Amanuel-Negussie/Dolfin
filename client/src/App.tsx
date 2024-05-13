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
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';

// Defining the base url for our database 
axios.defaults.baseURL = "http://localhost:8000";

function DisplayTransactions({ publicTokens }: { publicTokens: string[] }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string, y: number }[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

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
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false); // Set loading to false when data fetching is complete
      }
    }

    fetchData();
  }, [publicTokens]);

  //console.log(transactions)
  useEffect(() => {
    // Aggregate spending by category
    const categoryMap = new Map<string, number>();
    transactions.forEach(transaction => {
      const category = transaction.personal_finance_category?.primary || "Other";
      const amount = parseFloat(transaction.amount);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    // Filter out categories with negative or zero spending
    const spendingData = Array.from(categoryMap.entries())
      .filter(([name, y]) => y > 0)
      .map(([name, y]) => ({ name, y }));

    setSpendingByCategory(spendingData);
  }, [transactions]);

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

  const totalSpent = spendingByCategory.reduce((total, category) => total + category.y, 0);

  const options: Highcharts.Options = {
    chart: {
      type: 'pie',
    },
    title: {
      text: `Total Spending by Category`
    },
    subtitle: {
      text: `Total Spent: $${totalSpent.toFixed(2)}`
    },
    tooltip: {
      pointFormatter: function () {
        // Add type assertions for name and y
        return `<b>${(this.name as string)}</b>: $${(this.y as number).toFixed(2)}`;
      }
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: ${point.y:.2f}',
        },
        showInLegend: true
      }
    },
    series: [{
      type: 'pie', // Specify the type of series
      name: 'Amount',
      data: spendingByCategory
    }]
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          <h2>Total Spending by Category</h2>
          <HighchartsReact highcharts={Highcharts} options={options} />
  
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
      )}
    </div>
  );
}

function App() {
  const [linkToken, setLinkToken] = useState("");
  const [publicTokens, setPublicTokens] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [identityData, setIdentityData] = useState<any>(null); // state to store identity data

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

  /*
  fetchers - functions that fetch data from backend calls

  */

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


  // fetch User Identity
  const fetchUserIdentity = async (accessToken: string) => {
    try {
      const identityDataResponse = await axios.post("/user/identity", {
        access_token: accessToken,
      });
      setIdentityData(identityDataResponse.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };



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
          fetchUserIdentity(accessToken); // Call fetchUserIdentity function with access token
        })
        .catch((error) => {
          console.error("Error exchanging public token:", error);
        });
    }
  }, [publicTokens]);



  /*
  LOGGERS - console logging functions
  
  */


  useEffect(() => {
    // Log the JSON data to the console when it updates
    console.log('JSON Data for UserData:', userData);
  }, [userData]); // This useEffect will run whenever jsonData changes


  useEffect(() => {
    // Log the JSON data to the console when it updates
    console.log('JSON Data for identityData:', identityData);
  }, [identityData]); // This useEffect will run whenever jsonData changes




  
  return (
    <div>
      <Button onClick={() => open()} variant = "contained" disabled={!ready}>
        Connect a bank account
      </Button>
      {userData && identityData && (
        <Box>
          <h2>User Information</h2>
          <p><b>User Name:</b> {identityData.accounts[0].owners[0].names[0]}</p>
          <p><b>Street Address:</b> {identityData.accounts[0].owners[0].addresses[0].data.street}</p>
          <p><b>City:</b> {identityData.accounts[0].owners[0].addresses[0].data.city}</p>
          <p><b>Region:</b> {identityData.accounts[0].owners[0].addresses[0].data.region} </p>
          <p><b>Postal Code:</b> {identityData.accounts[0].owners[0].addresses[0].data.postal_code}</p>
          <p><b> Phone Number:</b> {identityData.accounts[0].owners[0].phone_numbers[0].type}: {identityData.accounts[0].owners[0].phone_numbers[0].data}</p>
          <h2>Account Information</h2>
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
