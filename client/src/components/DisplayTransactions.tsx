import { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Avatar } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import { deepOrange, deepPurple } from '@mui/material/colors';
import { useAuth0 } from "@auth0/auth0-react";
import PieChart from './PieChart';
import useTransactions from '../services/transactions';
const DisplayTransactions = ({ publicTokens }: { publicTokens: string[] }) => 
  {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string, y: number }[]>([]);
  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { user } = useAuth0();
  const userId = Number(user?.sub);

  useEffect(() => {
    // This gets transactions from the database only.
    // Note that calls to Plaid's transactions/get endpoint are only made in response
    // to receipt of a transactions webhook.
    getTransactionsByUser(userId);
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  useEffect(() => {
    const categoryMap = new Map<string, number>();
    transactions.forEach((transaction) => {
      console.log('inner loop: ' + transaction.categories);
      const category = transaction.category[0] || 'Other';
      const amount = Math.abs(transaction.amount);

      if (categoryMap.has(category)) {
        categoryMap.set(category, categoryMap.get(category)! + amount);
      } else {
        categoryMap.set(category, amount);
      }
    });

    const spendingByCategoryArray = Array.from(categoryMap, ([name, y]) => ({ name, y }));
    setSpendingByCategory(spendingByCategoryArray);
  }, [transactions]);

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueGetter: (params) => {
        const date = new Date(params.row.date);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${month}/${day}`;
      },
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
      field: 'merchant_name',
      headerName: 'Merchant Name',
      width: 150,
      valueGetter: (params) => params.row.merchant_name || '',
    },
    {
      field: 'category',
      headerName: 'Category',
      width: 150,
      valueGetter: (params) => params.row.category  || '',
    },
  ];

  const rows = transactions.map((transaction: any, index: number) => ({
    id: index + 1,
    date: transaction.date,
    amount: transaction.amount >= 0 ? "-$" + transaction.amount : "$" + Math.abs(transaction.amount),
    name: transaction.name,
    merchant_name: transaction.merchant_name,
    category: transaction.category,
    logo_url: transaction.logo_url,
  }));

  return (
    <div>
      <h2>Total Spending by Category</h2>
      <PieChart spendingByCategory={spendingByCategory} />
      <h2>Transactions</h2>
      <Box sx={{ height: 800, width: '100%', bgcolor: '#fafafa', p: 2, borderRadius: 2, boxShadow: 3 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20 },
            },
          }}
          pageSizeOptions={[20]}
          checkboxSelection
          disableRowSelectionOnClick
          components={{ Toolbar: GridToolbar }}
          sx={{
            '& .MuiDataGrid-row:hover': { backgroundColor: '#e3f2fd' },
            '& .MuiDataGrid-columnHeader': { backgroundColor: '#e0f7fa', color: '#00695c' },
            '& .MuiDataGrid-cell': { padding: '8px', fontSize: '1rem' },
          }}
        />
      </Box>
    </div>
  );
};

export default DisplayTransactions;
