import React, { useState } from 'react'
import { cartActions } from "../../store/reducers/cartReducer";
import { useDispatch } from "react-redux";
const Products = (props) => {
  const dispatch = useDispatch();
  const { _id, image, discount, name, price, quantity } = props.p;
  const [newQuantity, setNewQuantity] = useState(1);
    const cardHandler = (obj) => {
        dispatch(
          cartActions.addItem({
            id: obj.id,
            name: obj.name,
            price: obj.price,
            image: obj.image,
            newQuantity: newQuantity,
          })
        );
      };
    
  return (
<div
                  className="border group transition-all duration-500 hover:shadow-md hover:-mt-3"
                >
                  <button
                    onClick={(e) =>
                      cardHandler({
                        id:_id,
                        name:name,
                        image:image,
                        price:price,
                      })
                    }
                  >
                    <div className="relative overflow-hidden">
                      {discount ? (
                        <div className="flex justify-center items-center absolute text-white w-[38px] h-[38px] rounded-full bg-red-500 font-semibold text-xs left-2 top-2">
                          {discount}%
                        </div>
                      ) : (
                        ""
                      )}
                      <img
                        className="sm:w-full w-full h-[100px]"
                        src={image}
                        alt="product image"
                      />
                    </div>
                    <div className=" text-white py-3 text-slate-600 px-2">
                      <h2> {name.slice(0, 24)} </h2>
                      <div className="flex justify-center items-center gap-3">
                        <span className="text-lg  font-bold">Tk {price}</span>
                        <div className="flex"></div>
                      </div>
                    </div>
                  </button>
                </div>
  )
}

export default Products