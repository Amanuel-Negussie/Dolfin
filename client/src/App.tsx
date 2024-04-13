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
]

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
          setTransactions(allTransactions);
        }
        
        console.log(allTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    }
    fetchData();
  }, [publicTokens]);

  return (
    <div>
      <h2>Transactions</h2>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell align="right">Name</TableCell>
            <TableCell align="right">Category</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map((transaction: any, index: number) => (
            <TableRow
              key={index}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {transaction.date}
              </TableCell>
              <TableCell align="right">{transaction.amount}</TableCell>
              <TableCell align="right">{transaction.name}</TableCell>
              <TableCell align="right">{transaction.personal_finance_category.primary}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  );
}




function App() {
  const [linkToken, setLinkToken] = useState("");
  const [publicTokens, setPublicTokens] = useState<string[]>([]);

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
  

  return (
    <div>
      <Button onClick={() => open()} variant = "contained" disabled={!ready}>
        Connect a bank account
      </Button>
      {publicTokens.length > 0 && <DisplayTransactions publicTokens={publicTokens} />}
    </div>
  );
}

export default App;
