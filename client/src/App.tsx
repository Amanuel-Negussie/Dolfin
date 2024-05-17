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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import Avatar from '@mui/material/Avatar';
import { deepOrange, deepPurple } from '@mui/material/colors';

// Defining the base URL for our database 
axios.defaults.baseURL = "http://localhost:8000";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
        },
        cell: {
          borderBottom: '1px solid #e0e0e0',
        },
        columnHeader: {
          backgroundColor: '#f5f5f5',
          color: '#333',
          fontWeight: 'bold',
        },
      },
    },
  },
});

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
  },
}));

function GradientCircularProgress() {
  return (
    <React.Fragment>
      <svg width={0} height={0}>
        <defs>
          <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#e01cd5" />
            <stop offset="100%" stopColor="#1CB5E0" />
          </linearGradient>
        </defs>
      </svg>
      <CircularProgress sx={{ 'svg circle': { stroke: 'url(#my_gradient)' } }} />
    </React.Fragment>
  );
}

function capitalizeAndRemoveUnderscores(text: string): string {
  return text
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function DisplayTransactions({ publicTokens }: { publicTokens: string[] }) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string, y: number }[]>([]);

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
        console.log("All transactions:", allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }

    fetchData();
  }, [publicTokens]);

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
      .map(([name, y]) => ({ name: capitalizeAndRemoveUnderscores(name), y }));

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
      field: 'logo',
      headerName: 'Logo',
      width: 150,
      renderCell: (params) => {
        const name = params.row.name || '';
        const logoUrl = params.row.logo_url;
        if (logoUrl) {
          return <Avatar alt={name} src={logoUrl} />;
        } else {
          const initials = name.split(' ').map((word: string) => word[0]).slice(0, 2).join('');
          const avatarColors = [deepOrange[500], deepPurple[500]];
          const color = avatarColors[Math.floor(Math.random() * avatarColors.length)];
          return <Avatar sx={{ bgcolor: color }}>{initials}</Avatar>;
        }
      }
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
    amount: transaction.amount >= 0 ? "-$" + transaction.amount : "$" + Math.abs(transaction.amount),
    name: transaction.merchant_name || transaction.name,
    category: capitalizeAndRemoveUnderscores(transaction.personal_finance_category?.primary || ""), 
    logo_url: transaction.logo_url,
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
      type: 'pie',
      name: 'Amount',
      data: spendingByCategory
    }]
  };

  return (
    <div>
      <h2>Total Spending by Category</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />

      <h2>Transactions</h2>
      <Box sx={{ height: 800, width: '100%', bgcolor: '#fafafa', p: 2, borderRadius: 2,         boxShadow: 3 }}>
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
          components={{
            Toolbar: GridToolbar,
          }}
          sx={{
            '& .MuiDataGrid-row:hover': {
              backgroundColor: '#e3f2fd',
            },
            '& .MuiDataGrid-columnHeader': {
              backgroundColor: '#e0f7fa',
              color: '#00695c',
            },
            '& .MuiDataGrid-cell': {
              padding: '8px',
              fontSize: '1rem',
            },
          }}
        />
      </Box>
    </div>
  );
}

function App() {
  const [linkToken, setLinkToken] = useState("");
  const [publicTokens, setPublicTokens] = useState<string[]>([]);
  const [userData, setUserData] = useState<any>(null); // State to store user data
  const [identityData, setIdentityData] = useState<any>(null); // state to store identity data
  const [loading, setLoading] = useState(false);

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
      setLoading(true);
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
          fetchUserData(accessToken);
          fetchUserIdentity(accessToken);
        })
        .catch((error) => {
          console.error("Error exchanging public token:", error);
        });
    }
  }, [publicTokens]);

  useEffect(() => {
    console.log('JSON Data for UserData:', userData);
  }, [userData]);

  useEffect(() => {
    console.log('JSON Data for identityData:', identityData);
  }, [identityData]);

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
            {userData && identityData && (
              <Box sx={{ mt: 4 }}>
                <h2>User Information</h2>
                <p><b>User Name:</b> {identityData.accounts[0].owners[0].names[0]}</p>
                <p><b>Street Address:</b> {identityData.accounts[0].owners[0].addresses[0].data.street}</p>
                <p><b>City:</b> {identityData.accounts[0].owners[0].addresses[0].data.city}</p>
                <p><b>Region:</b> {identityData.accounts[0].owners[0].addresses[0].data.region}</p>
                <p><b>Postal Code:</b> {identityData.accounts[0].owners[0].addresses[0].data.postal_code}</p>
                <p><b> Phone Number:</b> {identityData.accounts[0].owners[0].phone_numbers[0].type}: {identityData.accounts[0].owners[0].phone_numbers[0].data}</p>
                <h2>Account Information</h2>
                <p>AccountID: {userData.accounts[0].account_id}</p>
                <p>Name: {userData.accounts[0].official_name}</p>
                <p>persistent_account_id: {userData.accounts[0].persistent_account_id}</p>
              </Box>
            )}
            {publicTokens.length > 0 && userData && identityData && <DisplayTransactions publicTokens={publicTokens} />}
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;

