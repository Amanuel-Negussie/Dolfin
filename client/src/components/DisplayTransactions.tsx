import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Avatar } from '@mui/material';
import { DataGrid, GridToolbar, GridColDef } from '@mui/x-data-grid';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { deepOrange, deepPurple } from '@mui/material/colors';
import capitalizeAndRemoveUnderscores from '../utils/capitalizeAndRemoveUnderscores';

const DisplayTransactions = ({ publicTokens }: { publicTokens: string[] }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [spendingByCategory, setSpendingByCategory] = useState<{ name: string, y: number }[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const allTransactions: any[] = [];

        for (const publicToken of publicTokens) {
          const accessTokenResponse = await axios.post("/exchange_public_token", { public_token: publicToken });
          const accessToken = accessTokenResponse.data.accessToken;
          const transactionsResponse = await axios.post("/transactions/sync", { access_token: accessToken });
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
    const categoryMap = new Map<string, number>();
    transactions.forEach(transaction => {
      const category = transaction.personal_finance_category?.primary || "Other";
      const amount = parseFloat(transaction.amount);
      categoryMap.set(category, (categoryMap.get(category) || 0) + amount);
    });

    const spendingData = Array.from(categoryMap.entries())
      .filter(([name, y]) => y > 0)
      .map(([name, y]) => ({ name: capitalizeAndRemoveUnderscores(name), y }));

    setSpendingByCategory(spendingData);
  }, [transactions]);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
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
    chart: { type: 'pie' },
    title: { text: `Total Spending by Category` },
    subtitle: { text: `Total Spent: $${totalSpent.toFixed(2)}` },
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
