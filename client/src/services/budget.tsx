import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  Dispatch,
  ReactNode,
} from "react";
import {
  getBudgetCategoriesByUser as apiGetBudgetCategoriesByUser,
  addBudgetCategory as apiAddBudgetCategory,
  updateBudgetCategory as apiUpdateBudgetCategory
} from "./api";

interface BudgetCategory {
  id: number;
  userId: number;
  category: string;
  budgetedValue: number;
  actualValue: number;
  remainingValue: number;
}

interface BudgetCategoriesState {
  [category: string]: BudgetCategory;
}

const initialState: BudgetCategoriesState = {};
type BudgetCategoriesAction = {
  type: "SET_BUDGET_CATEGORIES";
  payload: BudgetCategory | BudgetCategory[];
};

interface BudgetCategoriesContextShape {
  budgetCategories: BudgetCategoriesState;
  dispatch: Dispatch<BudgetCategoriesAction>;
  getBudgetCategoriesByUser: (userId: number) => void;
  addBudgetCategory: (
    userId: number,
    category: string,
    budgetedValue: number,
    actualValue: number
  ) => void;
  updateBudgetCategory: (
    userId: number,
    category: string,
    budgetedValue: number,
    actualValue: number
  ) => void;
}

const BudgetCategoriesContext = createContext<BudgetCategoriesContextShape | undefined>(undefined);

export const BudgetCategoriesProvider: React.FC<{ children: ReactNode }> = (
  props: any
) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const getBudgetCategoriesByUser = useCallback(async (userId: number) => {
    const { data } = await apiGetBudgetCategoriesByUser(userId);
    console.log("API call data:", data); // Log the data received from the API call
    dispatch({ type: "SET_BUDGET_CATEGORIES", payload: data });
  }, []);

  const addBudgetCategory = useCallback(
    async (
      userId: number,
      category: string,
      budgetedValue: number,
      actualValue: number
    ) => {
      const { data } = await apiAddBudgetCategory(
        userId,
        category,
        budgetedValue,
        actualValue
      );
      dispatch({ type: "SET_BUDGET_CATEGORIES", payload: [data] });
    },
    []
  );

  const updateBudgetCategory = useCallback(
    async (
      userId: number,
      category: string,
      budgetedValue: number,
      actualValue: number
    ) => {
      const { data } = await apiUpdateBudgetCategory(
        userId,
        category,
        budgetedValue,
        actualValue
      );
      dispatch({ type: "SET_BUDGET_CATEGORIES", payload: data });
    },
    []
  );

  const value = useMemo(
    () => ({
      budgetCategories: state,
      getBudgetCategoriesByUser,
      addBudgetCategory,
      updateBudgetCategory,
      dispatch,
    }),
    [state, getBudgetCategoriesByUser, addBudgetCategory, updateBudgetCategory]
  );

  return <BudgetCategoriesContext.Provider value={value} {...props} />;
};

function reducer(
  state: BudgetCategoriesState,
  action: BudgetCategoriesAction
): BudgetCategoriesState {
  console.log("Reducer action:", action); // Log the action received by the reducer
  switch (action.type) {
    case "SET_BUDGET_CATEGORIES":
      // Handle the case where the payload is a single object
      const categoriesArray = Array.isArray(action.payload) ? action.payload : [action.payload];
      const newState = {
        ...state,
        ...categoriesArray.reduce(
          (acc, category) => ({ ...acc, [category.category]: category }),
          {}
        ),
      };
      console.log("New state in reducer:", newState); // Log the new state
      return newState;
    default:
      return state;
  }
}

export default function useBudgetCategories() {
  const context = useContext(BudgetCategoriesContext);
  if (!context) {
    throw new Error(
      "useBudgetCategories must be used within a BudgetCategoriesProvider"
    );
  }
  return context;
}
