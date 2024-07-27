import React, { useEffect, useState } from 'react';
import sortBy from 'lodash/sortBy';
import { Button } from '@/components/ui/button';
import Asset from '@/components/Asset';
import NetWorth from '@/components/NetWorth';
import { NetworthSummaryCard } from '@/components/NetworthSummaryCard';
import SpendingInsights from '@/components/SpendingInsights';
import useLogin from '@/hooks/useLogin';
import { ItemType, AccountType, AssetType } from '../components/types';
import { useItems, useAccounts, useTransactions, useUsers, useAssets, useLink } from '../services';
import LaunchLink from '@/components/LaunchLink';

// Provides view of user's net worth, spending by category, and allows them to explore
// account and transactions details for linked items
export const NetworthPage: React.FC = () => {
    const userId = Number(useLogin());

    const [items, setItems] = useState<ItemType[]>([]);
    const [token, setToken] = useState('');
    const [numOfItems, setNumOfItems] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [assets, setAssets] = useState<AssetType[]>([]);

    const { getTransactionsByUser, transactionsByUser } = useTransactions();
    const { getAccountsByUser, accountsByUser } = useAccounts();
    const { assetsByUser, getAssetsByUser } = useAssets();
    const { usersById, getUserById } = useUsers();
    const { itemsByUser, getItemsByUser } = useItems();
    const { generateLinkToken, linkTokens } = useLink();

    const [user, setUser] = useState({
        id: 0,
        username: '',
        created_at: '',
        updated_at: '',
    });

    // Update data store with user
    useEffect(() => {
        if (userId) {
            getUserById(userId, false);
        }
    }, [getUserById, userId]);

    // Set state user from data store
    useEffect(() => {
        setUser(usersById[userId] || {});
    }, [usersById, userId]);

    // Update transactions from the database
    useEffect(() => {
        if (userId) {
            getTransactionsByUser(userId);
        }
    }, [getTransactionsByUser, userId]);

    // Set transactions from data store
    useEffect(() => {
        setTransactions(transactionsByUser[userId] || []);
    }, [transactionsByUser, userId]);

    // Update assets from the data store
    useEffect(() => {
        if (userId) {
            getAssetsByUser(userId);
        }
    }, [getAssetsByUser, userId]);

    // Set assets from data store
    useEffect(() => {
        if (assetsByUser) {
            setAssets(assetsByUser.assets || []);
        }
    }, [assetsByUser, userId]);

    // Update items from the data store
    useEffect(() => {
        if (userId) {
            getItemsByUser(userId, true);
        }
    }, [getItemsByUser, userId]);

    // Set ordered items
    useEffect(() => {
        const newItems: Array<ItemType> = itemsByUser[userId] || [];
        const orderedItems = sortBy(newItems, item => new Date(item.updated_at)).reverse();
        setItems(orderedItems);
    }, [itemsByUser, userId]);

    // Update number of items
    useEffect(() => {
        if (itemsByUser[userId]) {
            setNumOfItems(itemsByUser[userId].length);
        } else {
            setNumOfItems(0);
        }
    }, [itemsByUser, userId]);

    // Update accounts from the data store
    useEffect(() => {
        if (userId) {
            getAccountsByUser(userId);
        }
    }, [getAccountsByUser, userId]);

    // Set accounts from data store
    useEffect(() => {
        setAccounts(accountsByUser[userId] || []);
    }, [accountsByUser, userId]);

    // Set token
    useEffect(() => {
        setToken(linkTokens.byUser[userId]);
    }, [linkTokens, userId, numOfItems]);

    // Initiate link process
    const initiateLink = async () => {
        await generateLinkToken(userId, null);
    };


    return (


        <div className="hidden flex-col md:flex">
            <div className="flex-1 space-y-4 p-20 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Networth</h2>
                <div>
                    <NetworthSummaryCard userId={userId} assets={assets} accounts={accounts} />
                </div>

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
    );
};
