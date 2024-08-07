import axios, { AxiosError } from 'axios';
import { toast } from 'react-toastify';
import { PlaidLinkOnSuccessMetadata } from 'react-plaid-link';

import { DuplicateItemToastMessage } from '../components';

const baseURL = '/';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: 0,
  },
});

export default api;

// currentUser
export const getLoginUser = (auth0Id: string) =>
  api.post('/sessions', { auth0Id });

// assets
export const addAsset = (userId: number, description: string, value: number) =>
  api.post('/assets', { userId, description, value });
export const getAssetsByUser = (userId: number) => api.get(`/assets/${userId}`);
export const deleteAssetByAssetId = (assetId: number) =>
  api.delete(`/assets/${assetId}`);

// transaction assets
export const getTransactionAssetsByUser = (userId: number) =>
  api.get(`/users/${userId}/transaction-assets`);

// transaction liabilities
export const getTransactionLiabilitiesByUser = (userId: number) =>
  api.get(`/users/${userId}/transaction-liabilities`);

// users
export const getUsers = () => api.get('/users');
export const getUserById = (userId: number) => api.get(`/users/${userId}`);
export const addNewUser = (userInfo: { username: string, auth0Id: string }) =>
  api.post('/users', userInfo);
export const deleteUserById = (userId: number) =>
  api.delete(`/users/${userId}`);

// items
export const getItemById = (id: number) => api.get(`/items/${id}`);
export const getItemsByUser = (userId: number) =>
  api.get(`/users/${userId}/items`);
export const deleteItemById = (id: number) => api.delete(`/items/${id}`);
export const setItemState = (itemId: number, status: string) =>
  api.put(`items/${itemId}`, { status });
// This endpoint is only available in the sandbox environment
export const setItemToBadState = (itemId: number) =>
  api.post('/items/sandbox/item/reset_login', { itemId });

export const getLinkToken = (userId: number, itemId: number) =>
  api.post(`/link-token`, {
    userId,
    itemId,
  });

// accounts
export const getAccountsByItem = (itemId: number) =>
  api.get(`/items/${itemId}/accounts`);
export const getAccountsByUser = (userId: number) =>
  api.get(`/users/${userId}/accounts`);

// transactions
export const getTransactionsByAccount = (accountId: number) =>
  api.get(`/accounts/${accountId}/transactions`);
export const getTransactionsByItem = (itemId: number) =>
  api.get(`/items/${itemId}/transactions`);
export const getTransactionsByUser = (userId: number) =>
  api.get(`/users/${userId}/transactions`);
export const getRecurringTransactionsByUser = (userId: number) =>
  api.get(`/users/${userId}/recurring-transactions`);

// institutions
export const getInstitutionById = (instId: string) =>
  api.get(`/institutions/${instId}`);

// misc
export const postLinkEvent = (event: any) => api.post(`/link-event`, event);

export const exchangeToken = async (
  publicToken: string,
  institution: any,
  accounts: PlaidLinkOnSuccessMetadata['accounts'],
  userId: number
) => {
  try {
    const { data } = await api.post('/items', {
      publicToken,
      institutionId: institution.institution_id,
      userId,
      accounts,
    });
    return data;
  } catch (err) {
    const error = err as AxiosError;
    if (error.response && error.response.status === 409) {
      toast.error(
        <DuplicateItemToastMessage institutionName={institution.name} />
      );
    } else {
      toast.error(`Error linking ${institution.name}`);
    }
  }
};

// Income Bills API
export const getIncomeBillsByUser = (userId: number) =>
  api.get(`/users/${userId}/income-bills`);

export const addIncomeBills = (userId: number, income: number, bills: number) =>
  api.post(`/users/${userId}/income-bills`, { income, bills });

export const updateIncomeBills = (userId: number, income: number, bills: number) =>
  api.put(`/users/${userId}/income-bills`, { income, bills });

// Budget Categories API
export const getBudgetCategoriesByUser = (userId: number) =>
  api.get(`/users/${userId}/budget-categories`);

export const addBudgetCategory = (
  userId: number,
  category: string,
  budgetedValue: number,
  actualValue: number
) =>
  api.post(`/users/${userId}/budget-categories`, {
    category,
    budgetedValue,
    actualValue,
  });

export const updateBudgetCategory = (
  userId: number,
  category: string,
  budgetedValue: number,
  actualValue: number
) =>
  api.put(`/users/${userId}/budget-categories/${category}`, {
    budgetedValue,
    actualValue,
  });
