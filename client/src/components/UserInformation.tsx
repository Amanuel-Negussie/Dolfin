import React from 'react';
import Box from '@mui/material/Box';

const UserInformation = ({ userData, identityData }: { userData: any, identityData: any }) => {
  return (
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
  );
};

export default UserInformation;
