import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { Button } from '@/components/ui/button';
import Asset from '@/components/Asset';
import NetWorth from '@/components/NetWorth';
import { NetworthSummaryCard } from '@/components/NetworthSummaryCard';
import TransactionTrendsOverview from '@/components/TransactionTrendsOverview';
import useLogin from '@/hooks/useLogin';
import { ItemType, AccountType, AssetType } from '../components/types';
import { useItems, useAccounts, useTransactions, useUsers, useAssets, useLink } from '../services';
import LaunchLink from '@/components/LaunchLink';

export const NetworthPage: React.FC = () => {
  const userId = Number(useLogin());

  const [items, setItems] = useState<ItemType[]>([]);
  const [token, setToken] = useState('');
  const [numOfItems, setNumOfItems] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState<AccountType[]>([]);
  const [assets, setAssets] = useState<AssetType[]>([]);
  const [transactionAssets, setTransactionAssets] = useState([]);
  const [transactionLiabilities, setTransactionLiabilities] = useState([]);

  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const { getAccountsByUser, accountsByUser } = useAccounts();
  const { assetsByUser, getAssetsByUser } = useAssets();
  const { usersById, getUserById, getTransactionAssetsByUser, getTransactionLiabilitiesByUser } = useUsers();
  const { itemsByUser, getItemsByUser } = useItems();
  const { generateLinkToken, linkTokens } = useLink();

  const [user, setUser] = useState({
    id: 0,
    username: '',
    created_at: '',
    updated_at: '',
  });

  useEffect(() => {
    if (userId) {
      getUserById(userId, false);
    }
  }, [getUserById, userId]);

  useEffect(() => {
    setUser(usersById[userId] || {});
  }, [usersById, userId]);

  useEffect(() => {
    if (userId) {
      getTransactionsByUser(userId);
    }
  }, [getTransactionsByUser, userId]);

  useEffect(() => {
    setTransactions(transactionsByUser[userId] || []);
  }, [transactionsByUser, userId]);

  useEffect(() => {
    if (userId) {
      getAssetsByUser(userId);
    }
  }, [getAssetsByUser, userId]);

  useEffect(() => {
    if (assetsByUser) {
      setAssets(assetsByUser.assets || []);
    }
  }, [assetsByUser, userId]);

  useEffect(() => {
    if (userId) {
      getItemsByUser(userId, true);
    }
  }, [getItemsByUser, userId]);

  useEffect(() => {
    const newItems: Array<ItemType> = itemsByUser[userId] || [];
    const orderedItems = sortBy(newItems, item => new Date(item.updated_at)).reverse();
    setItems(orderedItems);
  }, [itemsByUser, userId]);

  useEffect(() => {
    if (itemsByUser[userId]) {
      setNumOfItems(itemsByUser[userId].length);
    } else {
      setNumOfItems(0);
    }
  }, [itemsByUser, userId]);

  useEffect(() => {
    if (userId) {
      getAccountsByUser(userId);
    }
  }, [getAccountsByUser, userId]);

  useEffect(() => {
    setAccounts(accountsByUser[userId] || []);
  }, [accountsByUser, userId]);

  useEffect(() => {
    setToken(linkTokens.byUser[userId]);
  }, [linkTokens, userId, numOfItems]);

  // Fetch transaction assets and liabilities
  useEffect(() => {
    if (userId) {
      (async () => {
        const assets = await getTransactionAssetsByUser(userId);
        setTransactionAssets(assets);

        const liabilities = await getTransactionLiabilitiesByUser(userId);
        setTransactionLiabilities(liabilities);
      })();
    }
  }, [userId, getTransactionAssetsByUser, getTransactionLiabilitiesByUser]);

  // Preprocess transaction data
  const preprocessData = (data: any[]) => {
    return data.map(item => ({
      date: new Date(item.created_at).toLocaleDateString(), // format the date if needed
      amount: item.amount
    }));
  };

  const processedTransactionAssets = preprocessData(transactionAssets);
  const processedTransactionLiabilities = preprocessData(transactionLiabilities);

  // Log processed transaction data
  useEffect(() => {
    console.log('Processed Transaction Assets:', processedTransactionAssets);
    console.log('Processed Transaction Liabilities:', processedTransactionLiabilities);
  }, [processedTransactionAssets, processedTransactionLiabilities]);

  const initiateLink = async () => {
    await generateLinkToken(userId, null);
  };

  return (
    <div>
      <div>
        <TransactionTrendsOverview
          transactionAssets={processedTransactionAssets}
          transactionLiabilities={processedTransactionLiabilities}
        />
      </div>
      <div className="hidden flex-col md:flex">
        <div>
          <NetworthSummaryCard userId={userId} assets={assets} accounts={accounts} />
        </div>

        <div className="flex-1 space-y-4 p-20 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Networth</h2>

          <div>
            {numOfItems > 0 && transactions.length > 0 && (
              <>
                <NetWorth
                  accounts={accounts}
                  numOfItems={numOfItems}
                  personalAssets={assets}
                  userId={userId}
                  assetsOnly={false}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
