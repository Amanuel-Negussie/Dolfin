import React, {
  createContext,
  useContext,
  useMemo,
  useRef,
  useReducer,
  useCallback,
  Dispatch,
} from 'react';
import keyBy from 'lodash/keyBy';
import omit from 'lodash/omit';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

import { UserType } from '../components/types';
import { useAccounts, useItems, useTransactions } from '.';
import {
  getUsers as apiGetUsers,
  getUserById as apiGetUserById,
  addNewUser as apiAddNewUser,
  deleteUserById as apiDeleteUserById,
  getTransactionAssetsByUser as apiGetTransactionAssetsByUser,
  getTransactionLiabilitiesByUser as apiGetTransactionLiabilitiesByUser,
} from './api';

interface UsersState {
  [key: string]: UserType | any;
}

const initialState = {};
type UsersAction =
  | { type: 'SUCCESSFUL_GET'; payload: UserType; }
  | { type: 'SUCCESSFUL_DELETE'; payload: number; };

interface UsersContextShape extends UsersState {
  dispatch: Dispatch<UsersAction>;
}
const UsersContext = createContext<UsersContextShape>(
  initialState as UsersContextShape
);

export function UsersProvider(props: any) {
  const [usersById, dispatch] = useReducer(reducer, {});
  const { deleteAccountsByUserId } = useAccounts();
  const { deleteItemsByUserId } = useItems();
  const { deleteTransactionsByUserId } = useTransactions();

  const hasRequested = useRef<{
    all: Boolean;
    byId: { [id: number]: boolean };
  }>({
    all: false,
    byId: {},
  });

  const addNewUser = useCallback(async (userInfo: { username: string, auth0Id: string }) => {
    try {
      const { data: payload } = await apiAddNewUser(userInfo);
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response && error.response.status === 409) {
        toast.error(`Username ${userInfo.username} already exists`);
      } else {
        toast.error('Error adding new user');
      }
    }
  }, []);

  const getUsers = useCallback(async (refresh: boolean) => {
    if (!hasRequested.current.all || refresh) {
      hasRequested.current.all = true;
      const { data: payload } = await apiGetUsers();
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    }
  }, []);

  const getUserById = useCallback(async (id: number, refresh: boolean) => {
    if (!hasRequested.current.byId[id] || refresh) {
      hasRequested.current.byId[id] = true;
      const { data: payload } = await apiGetUserById(id);
      dispatch({ type: 'SUCCESSFUL_GET', payload: payload });
    }
  }, []);

  const deleteUserById = useCallback(
    async (id: number) => {
      await apiDeleteUserById(id); // this will delete all items associated with user
      deleteItemsByUserId(id);
      deleteAccountsByUserId(id);
      deleteTransactionsByUserId(id);
      dispatch({ type: 'SUCCESSFUL_DELETE', payload: id });
      delete hasRequested.current.byId[id];
    },
    [deleteItemsByUserId, deleteAccountsByUserId, deleteTransactionsByUserId]
  );

  // New functions for getting transaction assets and liabilities
  const getTransactionAssetsByUser = useCallback(async (userId: number) => {
    const { data } = await apiGetTransactionAssetsByUser(userId);
    return data;
  }, []);

  const getTransactionLiabilitiesByUser = useCallback(async (userId: number) => {
    const { data } = await apiGetTransactionLiabilitiesByUser(userId);
    return data;
  }, []);

  const value = useMemo(() => {
    const allUsers = Object.values(usersById);
    return {
      allUsers,
      usersById,
      getUsers,
      getUserById,
      getUsersById: getUserById,
      addNewUser,
      deleteUserById,
      getTransactionAssetsByUser,
      getTransactionLiabilitiesByUser,
    };
  }, [usersById, getUsers, getUserById, addNewUser, deleteUserById, getTransactionAssetsByUser, getTransactionLiabilitiesByUser]);

  return <UsersContext.Provider value={value} {...props} />;
}

function reducer(state: UsersState, action: UsersAction | any) {
  switch (action.type) {
    case 'SUCCESSFUL_GET':
      if (!action.payload.length) {
        return state;
      }
      return {
        ...state,
        ...keyBy(action.payload, 'id'),
      };
    case 'SUCCESSFUL_DELETE':
      return omit(state, [action.payload]);
    default:
      console.warn('unknown action: ', action.type, action.payload);
      return state;
  }
}

export default function useUsers() {
  const context = useContext(UsersContext);

  if (!context) {
    throw new Error(`useUsers must be used within a UsersProvider`);
  }

  return context;
}
