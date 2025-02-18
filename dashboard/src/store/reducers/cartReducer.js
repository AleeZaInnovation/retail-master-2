import { createSlice } from "@reduxjs/toolkit";

const items =
  localStorage.getItem("cartItems") !== null
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [];

const totalAmount =
  localStorage.getItem("totalAmount") !== null
    ? JSON.parse(localStorage.getItem("totalAmount"))
    : 0;

const totalQuantity =
  localStorage.getItem("totalQuantity") !== null
    ? JSON.parse(localStorage.getItem("totalQuantity"))
    : 0;
const totalProfit =
  localStorage.getItem("totalProfit") !== null
    ? JSON.parse(localStorage.getItem("totalProfit"))
    : 0;

const party =
  localStorage.getItem("party") !== null
    ? JSON.parse(localStorage.getItem("party"))
    : "";

const date =
  localStorage.getItem("date") !== null
    ? JSON.parse(localStorage.getItem("date"))
    : "";

const setItemFunc = (item, totalAmount, totalQuantity, totalProfit) => {
  localStorage.setItem("cartItems", JSON.stringify(item));
  localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
  localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
  localStorage.setItem("totalProfit", JSON.stringify(totalProfit));
  localStorage.setItem("party", JSON.stringify(party));
  localStorage.setItem("date", JSON.stringify(date));
};

export const cartReducer = createSlice({
  name: "cart",
  initialState: {
    cartItems: items,
    totalQuantity: totalQuantity,
    totalAmount: totalAmount,
    totalProfit: totalProfit,
    party: party,
    date: date,
  },
  reducers: {
    // =========== add item ============
    addItem(state, action) {
      const newItem = action.payload;
      const id = action.payload.id;
      const extraIngredients = action.payload.extraIngredients;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (!existingItem) {
        state.cartItems.push({
          id: newItem.id,
          name: newItem.name,
          price: newItem.price,
          pp: newItem.pp,
          serial: newItem.serial,
          unit: newItem.unit,
          quantity: newItem.quantity,
          totalPrice: newItem.amount,
          extraIngredients: newItem.extraIngredients,
        });
        state.totalQuantity = state.cartItems.reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
      } else {
        const value = JSON.parse(localStorage.getItem("cartItems"));
        let index = value.findIndex((s) => s.id === existingItem.id);
        const newValue = {
          id: existingItem.id,
          name: existingItem.name,
          price: existingItem.price,
          pp: existingItem.pp,
          quantity: existingItem.quantity,
          serial: existingItem.serial,
          unit: existingItem.unit,
          totalPrice: existingItem.quantity * existingItem.price,
          extraIngredients: extraIngredients,
        };
        state.cartItems.splice(index, 1, newValue);
        state.totalQuantity = state.cartItems.reduce(
          (total, item) => total + Number(item.quantity),
          0
        );
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );
      state.totalRevenue = state.cartItems.reduce(
        (total, item) => total + Number(item.pp) * Number(item.quantity),
        0
      );
      state.totalProfit = state.totalAmount - state.totalRevenue;

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity,
        state.totalProfit
      );
    },

    // ========= remove item ========

    removeItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);
      state.totalQuantity--;

      if (existingItem.quantity === 1) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
      } else {
        existingItem.quantity--;
        existingItem.totalPrice =
          Number(existingItem.totalPrice) - Number(existingItem.price);
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      state.totalRevenue = state.cartItems.reduce(
        (total, item) => total + Number(item.pp) * Number(item.quantity),
        0
      );

      state.totalProfit = state.totalAmount - state.totalRevenue;

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity,
        state.totalProfit
      );
    },

    //============ delete item ===========

    deleteItem(state, action) {
      const id = action.payload;
      const existingItem = state.cartItems.find((item) => item.id === id);

      if (existingItem) {
        state.cartItems = state.cartItems.filter((item) => item.id !== id);
        state.totalQuantity = state.totalQuantity - existingItem.quantity;
      }

      state.totalAmount = state.cartItems.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
      );

      state.totalRevenue = state.cartItems.reduce(
        (total, item) => total + Number(item.pp) * Number(item.quantity),
        0
      );

      state.totalProfit = state.totalAmount - state.totalRevenue;

      setItemFunc(
        state.cartItems.map((item) => item),
        state.totalAmount,
        state.totalQuantity,
        state.totalProfit
      );
    },

    //============ delete card ===========

    deleteCard(state) {
      state.cartItems = [];
      state.totalQuantity = 0;
      state.totalAmount = 0;
      state.totalProfit = 0;

      setItemFunc(state.cartItems, state.totalAmount, state.totalQuantity);
    },
  },
});
export const { messageClear } = cartReducer.actions;
export const cartActions = cartReducer.actions;
export default cartReducer.reducer;
