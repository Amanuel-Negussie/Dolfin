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
} from './api';
import { Dictionary } from 'lodash';

interface TransactionsState {
  [transactionId: number]: TransactionType;
}

interface FetchingState {
  isComplete: boolean;
}

type State = TransactionsState & FetchingState;

const initialState: State = {
  isComplete: false
};

type TransactionsAction =
  | { type: 'SUCCESSFUL_GET'; payload: TransactionType[] }
  | { type: 'FETCH_START' }
  | { type: 'FETCH_COMPLETE' }
  | { type: 'DELETE_BY_ITEM'; payload: number }
  | { type: 'DELETE_BY_USER'; payload: number };

interface TransactionsContextShape extends TransactionsState {
  dispatch: Dispatch<TransactionsAction>;
  isComplete: boolean;
  transactionsByAccount: Dictionary<any>;
  getTransactionsByAccount: (accountId: number, refresh?: boolean) => void;
  deleteTransactionsByItemId: (itemId: number) => void;
  deleteTransactionsByUserId: (userId: number) => void;
  transactionsByUser: Dictionary<any>;
  getTransactionsByUser: (userId: number) => void;
  transactionsByItem: Dictionary<any>;
}

const TransactionsContext = createContext<TransactionsContextShape>(
  initialState as TransactionsContextShape
);

export function TransactionsProvider(props: any) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const hasRequested = useRef<{ byAccount: { [accountId: number]: boolean } }>({
    byAccount: {},
  });

  const getTransactionsByAccount = useCallback(async (accountId: number, refresh?: boolean) => {
    if (!hasRequested.current.byAccount[accountId] || refresh) {
      dispatch({ type: 'FETCH_START' });
      hasRequested.current.byAccount[accountId] = true;
      const { data: payload } = await apiGetTransactionsByAccount(accountId);
      dispatch({ type: 'SUCCESSFUL_GET', payload });
      dispatch({ type: 'FETCH_COMPLETE' });
    }
  }, []);

  const getTransactionsByItem = useCallback(async (itemId: number) => {
    dispatch({ type: 'FETCH_START' });
    const { data: payload } = await apiGetTransactionsByItem(itemId);
    dispatch({ type: 'SUCCESSFUL_GET', payload });
    dispatch({ type: 'FETCH_COMPLETE' });
  }, []);

  const getTransactionsByUser = useCallback(async (userId: number) => {
    dispatch({ type: 'FETCH_START' });
    const { data: payload } = await apiGetTransactionsByUser(userId);
    dispatch({ type: 'SUCCESSFUL_GET', payload });
    dispatch({ type: 'FETCH_COMPLETE' });
  }, []);

  const deleteTransactionsByItemId = useCallback((itemId: number) => {
    dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
  }, []);

  const deleteTransactionsByUserId = useCallback((userId: number) => {
    dispatch({ type: 'DELETE_BY_USER', payload: userId });
  }, []);

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
      deleteTransactionsByItemId,
      deleteTransactionsByUserId,
    };
  }, [
    dispatch,
    state,
    getTransactionsByAccount,
    getTransactionsByItem,
    getTransactionsByUser,
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
        ...keyBy(action.payload, 'id'),
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
      };
    case 'DELETE_BY_USER':
      return {
        ...omitBy(state, transaction => transaction.user_id === action.payload),
        isComplete: state.isComplete,
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
