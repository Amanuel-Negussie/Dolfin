import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
  useState,
} from 'react';
import groupBy from 'lodash/groupBy';
import keyBy from 'lodash/keyBy';
import omitBy from 'lodash/omitBy';

import { TransactionType } from '../components/types';

import {
  getTransactionsByAccount as apiGetTransactionsByAccount,
  getTransactionsByItem as apiGetTransactionsByItem,
  getTransactionsByUser as apiGetTransactionsByUser,
  getRecurringTransactions as apiGetRecurringTransactions,
} from './api';
import { Dictionary } from 'lodash';

interface TransactionsState {
  [transactionId: number]: TransactionType;
}

const initialState = {};
type TransactionsAction =
  | {
      type: 'SUCCESSFUL_GET';
      payload: TransactionType[];
    }
  | {
      type: 'SUCCESSFUL_GET_RECURRING';
      payload: TransactionType[];
    }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface TransactionsContextShape extends TransactionsState {
  dispatch: Dispatch<TransactionsAction>;
  transactionsByAccount: Dictionary<any>;
  getTransactionsByAccount: (accountId: number, refresh?: boolean) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  deleteTransactionsByUserId: (userId: number) => void;
  transactionsByUser: Dictionary<any>;
  getTransactionsByUser: (userId: number) => void;
  transactionsByItem: Dictionary<any>;
  getRecurringTransactions: (accountId: number) => void;
  recurringTransactions: TransactionType[];
}
const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

export function TransactionsProvider(props: any) {
  const [transactionsById, dispatch] = useReducer(reducer, initialState);
  const [recurringTransactions, setRecurringTransactions] = useState<TransactionType[]>([]);

  const hasRequested = useRef<{
    byAccount: { [accountId: number]: boolean };
  }>({
    byAccount: {},
  });

  const getTransactionsByAccount = useCallback(
    async (accountId: number, refresh?: boolean) => {
      if (!hasRequested.current.byAccount[accountId] || refresh) {
        hasRequested.current.byAccount[accountId] = true;
        const { data: payload } = await apiGetTransactionsByAccount(accountId);
        dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
      }
    },
    []
  );

  const getRecurringTransactions = useCallback(async (accountId: number) => {
    const { data: payload } = await apiGetRecurringTransactions(accountId);
    dispatch({ type: 'SUCCESSFUL_GET_RECURRING', payload: payload });
    setRecurringTransactions(payload);
  }, []);

  const getTransactionsByItem = useCallback(async (itemId: number) => {
    const { data: payload } = await apiGetTransactionsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  const getTransactionsByUser = useCallback(async (userId: number) => {
    const { data: payload } = await apiGetTransactionsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
  }, []);

  const deleteTransactionsByItemId = useCallback((itemId: number) => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  const deleteTransactionsByUserId = useCallback((userId: number) => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  const value = useMemo(() => {
    const allTransactions = Object.values(transactionsById);

    return {
      dispatch,
      allTransactions,
      transactionsById,
      transactionsByAccount: groupBy(allTransactions, 'account_id'),
      transactionsByItem: groupBy(allTransactions, 'item_id'),
      transactionsByUser: groupBy(allTransactions, 'user_id'),
      getTransactionsByAccount,
      getTransactionsByItem,
      getTransactionsByUser,
      getRecurringTransactions,
      deleteTransactionsByItemId,
      deleteTransactionsByUserId,
      recurringTransactions,
    };
  }, [
    dispatch,
    transactionsById,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
    getRecurringTransactions,
    deleteTransactionsByItemId,
    deleteTransactionsByUserId,
    recurringTransactions,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}

function reducer(state: TransactionsState, action: TransactionsAction) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'SUCCESSFUL_GET_RECURRING':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        recurringTransactions: action.payload,
      };
    case 'DELETE_BY_ITEM':
      return omitBy(
        state,
        transaction => transaction.item_id === action.payload
      );
    case 'DELETE_BY_USER':
      return omitBy(
        state,
        transaction => transaction.user_id === action.payload
      );
    default:
      console.warn('unknown action: ', action);
      return state;
  }
}

export default function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(
      `useTransactions must be used within a TransactionsProvider`
    );
  }

  return context;
}
