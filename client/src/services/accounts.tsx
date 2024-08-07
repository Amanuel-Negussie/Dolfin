import React, {
    createContext,
    useContext,
    useMemo,
    useReducer,
    useCallback,
    Dispatch,
    ReactNode,
  } from 'react';
  import groupBy from 'lodash/groupBy';
  import keyBy from 'lodash/keyBy';
  import omitBy from 'lodash/omitBy';
  import { AccountType } from '../components/types';
  
  import {
    getAccountsByItem as apiGetAccountsByItem,
    getAccountsByUser as apiGetAccountsByUser,
  } from './api';
  
  interface AccountsState {
    [accountId: number]: AccountType;
  }
  
  interface FetchingState {
    isComplete: boolean;
  }
  
  type State = AccountsState & FetchingState;
  
  const initialState: State = {
    isComplete: false
  };
  
  type AccountsAction =
    | { type: 'SUCCESSFUL_GET'; payload: AccountType[] }
    | { type: 'FETCH_START' }
    | { type: 'FETCH_COMPLETE' }
    | { type: 'DELETE_BY_ITEM'; payload: number }
    | { type: 'DELETE_BY_USER'; payload: number };
  
  interface AccountsContextShape extends State {
    dispatch: Dispatch<AccountsAction>;
    accountsByItem: { [itemId: number]: AccountType[] };
    deleteAccountsByItemId: (itemId: number) => void;
    getAccountsByUser: (userId: number) => void;
    accountsByUser: { [user_id: number]: AccountType[] };
    deleteAccountsByUserId: (userId: number) => void;
  }
  
  const AccountsContext = createContext<AccountsContextShape>(
    initialState as AccountsContextShape
  );
  
  export const AccountsProvider: React.FC<{ children: ReactNode }> = (props: any) => {
    const [state, dispatch] = useReducer(reducer, initialState);
  
    const getAccountsByItem = useCallback(async (itemId: number) => {
      dispatch({ type: 'FETCH_START' });
      const { data: payload } = await apiGetAccountsByItem(itemId);
      dispatch({ type: 'SUCCESSFUL_GET', payload });
      dispatch({ type: 'FETCH_COMPLETE' });
    }, []);
  
    const getAccountsByUser = useCallback(async (userId: number) => {
      dispatch({ type: 'FETCH_START' });
      const { data: payload } = await apiGetAccountsByUser(userId);
      dispatch({ type: 'SUCCESSFUL_GET', payload });
      dispatch({ type: 'FETCH_COMPLETE' });
    }, []);
  
    const deleteAccountsByItemId = useCallback((itemId: number) => {
      dispatch({ type: 'DELETE_BY_ITEM', payload: itemId });
    }, []);
  
    const deleteAccountsByUserId = useCallback((userId: number) => {
      dispatch({ type: 'DELETE_BY_USER', payload: userId });
    }, []);
  
    const value = useMemo(() => {
      const allAccounts = Object.values(state).filter(account => typeof account === 'object');
  
      return {
        dispatch,
        allAccounts,
        accountsById: state,
        isComplete: state.isComplete,
        accountsByItem: groupBy(allAccounts, 'item_id'),
        accountsByUser: groupBy(allAccounts, 'user_id'),
        getAccountsByItem,
        getAccountsByUser,
        deleteAccountsByItemId,
        deleteAccountsByUserId,
      };
    }, [
      state,
      getAccountsByItem,
      getAccountsByUser,
      deleteAccountsByItemId,
      deleteAccountsByUserId,
    ]);
  
    return <AccountsContext.Provider value={value} {...props} />;
  };
  
  function reducer(state: State, action: AccountsAction): State {
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
          ...omitBy(state, account => account.item_id === action.payload),
          isComplete: state.isComplete,
        };
      case 'DELETE_BY_USER':
        return {
          ...omitBy(state, account => account.user_id === action.payload),
          isComplete: state.isComplete,
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