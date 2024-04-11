// app.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";

axios.defaults.baseURL = "http://localhost:8000";

function PlaidAuth({ publicTokens }: { publicTokens: string[] }) {
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

  return (
    <div>
      <h2>Transactions</h2>
      <ul>
        {transactions.map((transaction: any, index: number) => (
          <li key={index}>
            <p>Date: {transaction.date}</p>
            <p>Amount: {transaction.amount}</p>
            <p>Name: {transaction.name}</p>
            <p>Category: {transaction.personal_finance_category.primary}</p>
          </li>
        ))}
      </ul>
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
      <button onClick={() => open()} disabled={!ready}>
        Connect a bank account
      </button>
      {publicTokens.length > 0 && <PlaidAuth publicTokens={publicTokens} />}
    </div>
  );
}

export default App;
