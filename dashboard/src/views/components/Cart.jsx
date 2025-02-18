import React, { useState } from "react";
import { cartActions } from "../../store/reducers/cartReducer";
import { useDispatch } from "react-redux";

const Cart = (props) => {
  const dispatch = useDispatch();
  const { id, name, price, quantity, unit, serial, pp } = props.pt;
  const deleteItem = (id) => {
    dispatch(cartActions.deleteItem(id));
  };


  return (
    <div className="w-full bg-white flex flex-wrap">
      <div className="flex justify-between  sm:w-full sm:mt-3">
        <div className="flex gap-2 justify-start items-center">
          <div className="pr-4 text-slate-600">
            <h2 className="text-md">{name.slice(0, 24)}</h2>
            <span className="text-lg flex text-orange-500 justify-start items-center">
              {" "}
              {quantity} {""}
              {unit} x {price}
            </span>
            <div className="mt-2">
              {serial?.map((item) => (
                <p className="">{item} ,</p>
              ))}
            </div>
          </div>
        </div>
        <div className="pl-4 sm:pl-0"></div>
        <div className="flex gap-2 mt-10 lg:mt-0 sm:mt-0 flex-col">
          <div className="flex bg-slate-200 h-[30px] justify-center items-center text-xl">
            <div className="px-3">{quantity * price}</div> ||
            <div className="px-3">{(quantity * price) - (quantity * pp)}</div>
          </div>
          <button
            onClick={(e) => deleteItem(id)}
            className="px-5 py-[3px] bg-red-500 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
