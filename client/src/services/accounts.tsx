import React, {
  createContext,
  useContext,
  useMemo,
  useReducer,
  useCallback,
  Dispatch,
  ReactNode,
  useState,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';
import { AccountType } from '../components/types';
import {
  getAccountsByItem as apiGetAccountsByItem,
  getAccountsByUser as apiGetAccountsByUser,
  addIncomeBills as apiAddIncomeBills,
  getIncomeBillsByUser as apiGetIncomeBillsByUser,
  updateIncomeBills as apiUpdateIncomeBills,
} from './api';

interface AccountsState {
  [accountId: number]: AccountType;
}

const initialState: AccountsState = {};
type AccountsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: AccountType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number }
  | { type: 'SUCCESSFUL_GET_INCOME_BILLS'; payload: { income: number; bills: number } };

interface AccountsContextShape extends AccountsState {
  dispatch: Dispatch<AccountsAction>;
  accountsByItem: { [itemId: number]: AccountType[] };
  deleteAccountsByItemId: (itemId: number) => void;
  getAccountsByUser: (userId: number) => void;
  accountsByUser: { [user_id: number]: AccountType[] };
  deleteAccountsByUserId: (userId: number) => void;
  addIncomeBills: (userId: number, income: number, bills: number) => void;
  getIncomeBillsByUser: (userId: number) => void;
  updateIncomeBills: (userId: number, income: number, bills: number) => void;
  incomeBills: { income: number; bills: number } | null;
}
const AccountsContext = createContext<AccountsContextShape>(
  initialState as AccountsContextShape
);

export const AccountsProvider: React.FC<{ children: ReactNode }> = (props: any) => {
  const [accountsById, dispatch] = useReducer(reducer, initialState);
  const [incomeBills, setIncomeBills] = useState<{ income: number; bills: number } | null>(null);

  const getAccountsByItem = useCallback(async (itemId: number) => {
    const { data: payload } = await apiGetAccountsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  const getAccountsByUser = useCallback(async (userId: number) => {
    const { data: payload } = await apiGetAccountsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  const deleteAccountsByItemId = useCallback((itemId: number) => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  const deleteAccountsByUserId = useCallback((userId: number) => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  const addIncomeBills = useCallback(async (userId: number, income: number, bills: number) => {
    const { data: payload } = await apiAddIncomeBills(userId, income, bills);
    setIncomeBills(payload);
  }, []);

  const getIncomeBillsByUser = useCallback(async (userId: number) => {
    const { data: payload } = await apiGetIncomeBillsByUser(userId);
    setIncomeBills(payload);
  }, []);

  const updateIncomeBills = useCallback(async (userId: number, income: number, bills: number) => {
    const { data: payload } = await apiUpdateIncomeBills(userId, income, bills);
    setIncomeBills(payload);
  }, []);

  const value = useMemo(() => {
    const allAccounts = Object.values(accountsById);

    return {
      allAccounts,
      accountsById,
      accountsByItem: groupBy(allAccounts, 'item_id'),
      accountsByUser: groupBy(allAccounts, 'user_id'),
      getAccountsByItem,
      getAccountsByUser,
      deleteAccountsByItemId,
      deleteAccountsByUserId,
      addIncomeBills,
      getIncomeBillsByUser,
      updateIncomeBills,
      incomeBills,
    };
  }, [
    accountsById,
    getAccountsByItem,
    getAccountsByUser,
    deleteAccountsByItemId,
    deleteAccountsByUserId,
    addIncomeBills,
    getIncomeBillsByUser,
    updateIncomeBills,
    incomeBills,
  ]);

  return <AccountsContext.Provider value={value} {...props} />;
};

function reducer(state: AccountsState, action: AccountsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'DELETE_BY_ITEM':
      return omitBy(state, transaction => transaction.item_id === action.payload);
    case 'DELETE_BY_USER':
      return omitBy(state, transaction => transaction.user_id === action.payload);
    case 'SUCCESSFUL_GET_INCOME_BILLS':
      return {
        ...state,
        incomeBills: action.payload,
      };
    default:
      console.warn('unknown action');
      return state;
  }
}

export default function useAccounts() {
  const context = useContext(AccountsContext);

  if (!context) {
    throw new Error(`useAccounts must be used within an AccountsProvider`);
  }

  return context;
}
