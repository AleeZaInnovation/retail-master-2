import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/api";
export const paymentTransaction = createAsyncThunk(
  "Transaction/payment_transaction",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/payment-transaction", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const receiveTransaction = createAsyncThunk(
  "Transaction/receive_transaction",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/receive-transaction", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const contraTransaction = createAsyncThunk(
  "Transaction/contra_transaction",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/contra-transaction", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const get_transaction = createAsyncThunk(
  "Transaction/get_transaction",
  async (productId, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/transaction-get/${productId}`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const get_transactions = createAsyncThunk(
  "Transaction/get_transactions",
  async (_, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.get(`/transactions-get`, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const party_ledger = createAsyncThunk(
  "Transaction/party_ledger",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/party-ledger", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const account_type = createAsyncThunk(
  "Transaction/account_type",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/account-type", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const day_book = createAsyncThunk(
  "Transaction/day_book",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/day-book", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const balance_sheet = createAsyncThunk(
  "Transaction/balance_sheet",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/balance-sheet", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const income_statement = createAsyncThunk(
  "Transaction/income_statement",
  async (info, { rejectWithValue, fulfillWithValue }) => {
    try {
      const { data } = await api.post("/income-statement", info, {
        withCredentials: true,
      });
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
export const transactionReducer = createSlice({
  name: "transaction",
  initialState: {
    successMessage: "",
    errorMessage: "",
    transaction: "",
    loader: false,
    transactions: [],
    ledgerParty: "",
    expenseParty: "",
    incomeParty: "",
    totalSales: "",
    totalDiscount: "",
    totalPurchase: "",
    ExpensePart: "",
    IncomePart: "",
    totalExpense: "",
    totalIncome: "",
    debitBalance: "",
    creditBalance: "",
    cashAccount: "",
    mobileAccount: "",
    cardAccount: "",
    Account_PayableAccount: "",
    Account_ReceivableAccount: "",
    present_Inventory: "",
    totalProductsValue: "",
    Loan_GivenAccount: "",
    Loan_TakenAccount: "",
    AssetAccount: "",
    LiabilityAccount: "",
    EquityAccount: "",
    totalCurrentAsset: "",
    totalFixedAsset: "",
    totalCurrentLiability: "",
    totalLiability_Long: "",
    actualEquity: "",
    netProfit: "",
    startDate: "",
    endDate: "",
  },
  reducers: {
    messageClear: (state, _) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: {
    [paymentTransaction.pending]: (state, _) => {
      state.loader = true;
    },
    [paymentTransaction.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [paymentTransaction.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.transaction = payload.transaction;
    },
    [receiveTransaction.pending]: (state, _) => {
      state.loader = true;
    },
    [receiveTransaction.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.transaction = payload.transaction;
    },
    [receiveTransaction.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [contraTransaction.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.transaction = payload.transaction;
    },
    [contraTransaction.rejected]: (state, { payload }) => {
      state.loader = false;
      state.errorMessage = payload.error;
    },
    [contraTransaction.fulfilled]: (state, { payload }) => {
      state.loader = false;
      state.successMessage = payload.message;
      state.transaction = payload.transaction;
    },
    [get_transaction.fulfilled]: (state, { payload }) => {
      state.totalTransaction = payload.totalTransaction;
      state.transaction = payload.transaction;
    },
    [get_transactions.fulfilled]: (state, { payload }) => {
      state.totalTransaction = payload.totalTransaction;
      state.transactions = payload.transactions;
    },
    [party_ledger.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.transactions = payload.transactions;
      state.ledgerParty = payload.party;
      state.debitBalance = payload.debitBalance;
      state.creditBalance = payload.creditBalance;
    },
    [income_statement.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.transactions = payload.transactions;
      state.expenseParty = payload.expenseParty;
      state.incomeParty = payload.incomeParty;
      state.totalSales = payload.totalSales;
      state.totalDiscount = payload.totalDiscount;
      state.totalPurchase = payload.totalPurchase;
      state.ExpensePart = payload.ExpensePart;
      state.IncomePart = payload.IncomePart;
      state.totalExpense = payload.totalExpense;
      state.totalIncome = payload.totalIncome;
      state.startDate = payload.startDate;
      state.endDate = payload.endDate;
    },
    [balance_sheet.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.cashAccount = payload.cashAccount;
      state.mobileAccount = payload.mobileAccount;
      state.cardAccount = payload.cardAccount;
      state.Account_PayableAccount = payload.Account_PayableAccount;
      state.Account_ReceivableAccount = payload.Account_ReceivableAccount;
      state.present_Inventory = payload.present_Inventory;
      state.totalProductsValue = payload.totalProductsValue;
      state.Loan_GivenAccount = payload.Loan_GivenAccount;
      state.Loan_TakenAccount = payload.Loan_TakenAccount;
      state.AssetAccount = payload.AssetAccount;
      state.LiabilityAccount = payload.LiabilityAccount;
      state.EquityAccount = payload.EquityAccount;
      state.totalCurrentAsset = payload.totalCurrentAsset;
      state.totalFixedAsset = payload.totalFixedAsset;
      state.totalCurrentLiability = payload.totalCurrentLiability;
      state.totalLiability_Long = payload.totalLiability_Long;
      state.actualEquity = payload.actualEquity;
      state.netProfit = payload.netProfit;
      state.startDate = payload.startDate;
      state.endDate = payload.endDate;
    },
    [account_type.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.parties = payload.parties;
      state.accountType = payload.accountType;
    },
    [day_book.fulfilled]: (state, { payload }) => {
      state.successMessage = payload.message;
      state.transactions = payload.transactions;
      state.startDate = payload.startDate;
      state.endDate = payload.endDate;
    },
  },
});
export const { messageClear } = transactionReducer.actions;
export default transactionReducer.reducer;
