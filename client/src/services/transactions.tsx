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
  getRecurringTransactionsByUser as apiGetRecurringTransactionsByUser,
} from './api';
import { Dictionary } from 'lodash';

interface TransactionsState {
  [transactionId: number]: TransactionType;
}

const initialState: TransactionsState = {};

type TransactionsAction =
  | { type: 'SUCCESSFUL_GET'; payload: TransactionType[] }
  | { type: 'SUCCESSFUL_GET_RECURRING'; payload: TransactionType[] }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface TransactionsContextShape {
  dispatch: Dispatch<TransactionsAction>;
  transactionsByAccount: Dictionary<TransactionType[]>;
  getTransactionsByAccount: (accountId: number, refresh?: boolean) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  deleteTransactionsByUserId: (userId: number) => void;
  transactionsByUser: Dictionary<TransactionType[]>;
  getTransactionsByUser: (userId: number) => void;
  transactionsByItem: Dictionary<TransactionType[]>;
  assetTrendData: { date: string; value: number }[];
  liabilityTrendData: { date: string; value: number }[];
  getRecurringTransactionsByUser: (userId: number) => void;
  recurringTransactions: TransactionType[];
  allTransactions: TransactionType[];
  transactionsById: TransactionsState;
}

const TransactionsContext = createContext<TransactionsContextShape | undefined>(undefined);

const calculateTrends = (transactions: TransactionType[]) => {
  const trends: { assets: { [date: string]: number }, liabilities: { [date: string]: number } } = {
    assets: {},
    liabilities: {},
  };

  transactions.forEach(transaction => {
    const date = new Date(transaction.date).toISOString().slice(0, 7); // YYYY-MM format
    const value = transaction.amount;

    if (transaction.type === 'asset') {
      trends.assets[date] = (trends.assets[date] || 0) + value;
    } else if (transaction.type === 'liability') {
      trends.liabilities[date] = (trends.liabilities[date] || 0) + value;
    }
  });

  return {
    assets: Object.entries(trends.assets).map(([date, value]) => ({ date, value: value as number })),
    liabilities: Object.entries(trends.liabilities).map(([date, value]) => ({ date, value: value as number })),
  };
};

export function TransactionsProvider(props: any) {
  const [transactionsById, dispatch] = useReducer(reducer, initialState);
  const [recurringTransactions, setRecurringTransactions] = useState<TransactionType[]>([]);

  const hasRequested = useRef<{ byAccount: { [accountId: number]: boolean } }>({
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

  const getRecurringTransactionsByUser = useCallback(async (userId: number) => {
    const { data: payload } = await apiGetRecurringTransactionsByUser(userId);
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

  const trends = useMemo(() => {
    return calculateTrends(Object.values(transactionsById));
  }, [transactionsById]);

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
      getRecurringTransactionsByUser,
      deleteTransactionsByItemId,
      deleteTransactionsByUserId,
      assetTrendData: trends.assets,
      liabilityTrendData: trends.liabilities,
      trends,
      recurringTransactions,
    };
  }, [
    dispatch,
    transactionsById,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
    getRecurringTransactionsByUser,
    deleteTransactionsByItemId,
    deleteTransactionsByUserId,
    recurringTransactions,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}

function reducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
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
      return omitBy(state, transaction => transaction.item_id === action.payload);
    case 'DELETE_BY_USER':
      return omitBy(state, transaction => transaction.user_id === action.payload);
    default:
      console.warn('unknown action: ', action);
      return state;
  }
}

export default function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }

  return context;
}
