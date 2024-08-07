import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
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

interface FetchingState {
  isComplete: boolean;
}

interface RecurringTransactionsState {
  recurringTransactions: TransactionType[];
}

type State = TransactionsState & FetchingState & RecurringTransactionsState;

const initialState: State = {
  isComplete: false,
  recurringTransactions: [],
};

type TransactionsAction =
  | { type: 'SUCCESSFUL_GET'; payload: TransactionType[] }
  | { type: 'SUCCESSFUL_GET_RECURRING'; payload: TransactionType[] }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_COMPLETE' }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface TransactionsContextShape extends State {
  dispatch: Dispatch<TransactionsAction>;
  transactionsByAccount: Dictionary<any>;
  getTransactionsByAccount: (accountId: number, refresh?: boolean) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  deleteTransactionsByUserId: (userId: number) => void;
  transactionsByUser: Dictionary<any>;
  getTransactionsByUser: (userId: number) => void;
  transactionsByItem: Dictionary<any>;
  assetTrendData: any[];
  liabilityTrendData: any[];
  getRecurringTransactionsByUser: (userId: number) => void;
}

const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

const calculateTrends = (transactions: TransactionType[]) => {
  const trends: {
    assets: { [key: string]: number };
    liabilities: { [key: string]: number };
  } = {
    assets: {},
    liabilities: {},
  };

  transactions.forEach(transaction => {
    const date = new Date(transaction.date);
    if (!isNaN(date.getTime())) { // Check if date is valid
      const formattedDate = date.toISOString().slice(0, 7); // YYYY-MM format
      const value = transaction.amount;

      if (transaction.type === 'asset') {
        trends.assets[formattedDate] = (trends.assets[formattedDate] || 0) + value;
      } else if (transaction.type === 'liability') {
        trends.liabilities[formattedDate] = (trends.liabilities[formattedDate] || 0) + value;
      }
    }
  });

  return {
    assets: Object.entries(trends.assets).map(([date, value]) => ({ date, value })),
    liabilities: Object.entries(trends.liabilities).map(([date, value]) => ({ date, value })),
  };
};


export function TransactionsProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasRequested = useRef<{
    byAccount: { [accountId: number]: boolean };
  }>({
    byAccount: {},
  });

  const getTransactionsByAccount = useCallback(
    async (accountId: number, refresh?: boolean) => {
      if (!hasRequested.current.byAccount[accountId] || refresh) {
        dispatch({ type: 'FETCH_START' });
        hasRequested.current.byAccount[accountId] = true;
        const { data: payload } = await apiGetTransactionsByAccount(accountId);
        dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
        dispatch({ type: 'FETCH_COMPLETE' });
      }
    },
    []
  );

  const getRecurringTransactionsByUser = useCallback(async (userId: number) => {
    dispatch({ type: 'FETCH_START' });
    const { data: payload } = await apiGetRecurringTransactionsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET_RECURRING', payload: payload });
    dispatch({ type: 'FETCH_COMPLETE' });
  }, []);

  const getTransactionsByItem = useCallback(async (itemId: number) => {
    dispatch({ type: 'FETCH_START' });
    const { data: payload } = await apiGetTransactionsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    dispatch({ type: 'FETCH_COMPLETE' });
  }, []);

  const getTransactionsByUser = useCallback(async (userId: number) => {
    dispatch({ type: 'FETCH_START' });
    const { data: payload } = await apiGetTransactionsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    dispatch({ type: 'FETCH_COMPLETE' });
  }, []);

  const deleteTransactionsByItemId = useCallback((itemId: number) => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  const deleteTransactionsByUserId = useCallback((userId: number) => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

  const trends = useMemo(() => {
    return calculateTrends(Object.values(state).filter(transaction => typeof transaction === 'object'));
  }, [state]);

  const value = useMemo(() => {
    const allTransactions = Object.values(state).filter(transaction => typeof transaction === 'object');

    return {
      dispatch,
      allTransactions,
      transactionsById: state,
      isComplete: state.isComplete,
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
      recurringTransactions: state.recurringTransactions,
    };
  }, [
    state,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
    getRecurringTransactionsByUser,
    deleteTransactionsByItemId,
    deleteTransactionsByUserId,
  ]);

  return <TransactionsContext.Provider value={value} {...props} />;
}

function reducer(state: State, action: TransactionsAction): State {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        ...state,
        ...keyBy(action.payload, 'date'),
        isComplete: false,
      };
    case 'SUCCESSFUL_GET_RECURRING':
      return {
        ...state,
        recurringTransactions: action.payload,
        isComplete: false,
      };
    case 'FETCH_START':
      return {
        ...state,
        isComplete: false,
      };
    case 'FETCH_COMPLETE':
      return {
        ...state,
        isComplete: true,
      };
    case 'DELETE_BY_ITEM':
      return {
        ...omitBy(state, transaction => transaction.item_id === action.payload),
        isComplete: state.isComplete,
        recurringTransactions: state.recurringTransactions,
      };
    case 'DELETE_BY_USER':
      return {
        ...omitBy(state, transaction => transaction.user_id === action.payload),
        isComplete: state.isComplete,
        recurringTransactions: state.recurringTransactions,
      };
    default:
      console.warn('unknown action: ', action);
      return state;
  }
}

export default function useTransactions() {
  const context = useContext(TransactionsContext);

  if (!context) {
    throw new Error(`useTransactions must be used within a TransactionsProvider`);
  }

  return context;
}
