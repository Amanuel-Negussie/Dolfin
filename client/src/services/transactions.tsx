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
  transactionsById: Dictionary<TransactionType>;
  recurringTransactionsById: Dictionary<TransactionType[]>;
}

const initialState: TransactionsState = {
  transactionsById: {},
  recurringTransactionsById: {},
};

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
  transactionsByAccount: Dictionary<TransactionType[]>;
  getTransactionsByAccount: (accountId: number, refresh?: boolean) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  deleteTransactionsByUserId: (userId: number) => void;
  transactionsByUser: Dictionary<TransactionType[]>;
  getTransactionsByUser: (userId: number) => void;
  transactionsByItem: Dictionary<TransactionType[]>;
  getRecurringTransactionsByUser: (userId: number) => Promise<void>;
  recurringTransactionsByUser: Dictionary<TransactionType[]>;
}

const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

export function TransactionsProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasRequested = useRef<{
    byUser: { [userId: number]: boolean };
  }>({
    byUser: {},
  });

  const getTransactionsByAccount = useCallback(
    async (accountId: number, refresh?: boolean) => {
      if (!hasRequested.current.byUser[accountId] || refresh) {
        hasRequested.current.byUser[accountId] = true;
        const { data: payload } = await apiGetTransactionsByAccount(accountId);
        dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
      }
    },
    []
  );

  const getRecurringTransactionsByUser = useCallback(async (userId: number) => {
    const { data: payload } = await apiGetRecurringTransactionsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET_RECURRING', payload: payload });
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
    const allTransactions = Object.values(state.transactionsById);
    const recurringTransactions = Object.values(state.recurringTransactionsById).flat();

    return {
      dispatch,
      allTransactions,
      recurringTransactions,
      transactionsById: state.transactionsById,
      transactionsByAccount: groupBy(allTransactions, 'account_id'),
      transactionsByItem: groupBy(allTransactions, 'item_id'),
      transactionsByUser: groupBy(allTransactions, 'user_id'),
      recurringTransactionsByUser: groupBy(recurringTransactions, 'user_id'),
      getTransactionsByAccount,
      getTransactionsByItem,
      getTransactionsByUser,
      getRecurringTransactionsByUser,
      deleteTransactionsByItemId,
      deleteTransactionsByUserId,
    };
  }, [
    dispatch,
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

function reducer(state: TransactionsState, action: TransactionsAction): TransactionsState {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      return {
        ...state,
        transactionsById: {
          ...state.transactionsById,
          ...keyBy(action.payload, 'id'),
        },
      };
    case 'SUCCESSFUL_GET_RECURRING':
      return {
        ...state,
        recurringTransactionsById: {
          ...state.recurringTransactionsById,
          ...groupBy(action.payload, 'user_id'),
        },
      };
    case 'DELETE_BY_ITEM':
      return {
        ...state,
        transactionsById: omitBy(
          state.transactionsById,
          transaction => transaction.item_id === action.payload
        ),
      };
    case 'DELETE_BY_USER':
      return {
        ...state,
        transactionsById: omitBy(
          state.transactionsById,
          transaction => transaction.user_id === action.payload
        ),
      };
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
