import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import Search from "../components/Search";
import Categories from "../components/Categories";
import { useDispatch, useSelector } from "react-redux";
import { get_products } from "../../store/reducers/productReducer";
import { get_categories } from "../../store/reducers/categoryReducer";
import toast from "react-hot-toast";
import Products from "../components/Products";
import Cart from "../components/Cart";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import { make_draft, messageClear } from "../../store/reducers/draftReducer";
import { place_order } from "../../store/reducers/orderReducer";
const MakeOrder = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const { products, totalProduct } = useSelector((state) => state?.product);
  const { userInfo } = useSelector((state) => state?.auth);
  const { successMessage, errorMessage } = useSelector((state) => state.draft);
  const cartItems = useSelector((state) => state?.cart.cartItems);
  const totalAmount = useSelector((state) => state?.cart.totalAmount);
  const totalQuantity = useSelector((state) => state?.cart.totalQuantity);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState("Cash");
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(25);
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
    const obj2 = {
      parPage: 25,
      page: 1,
      searchValue: "",
    };
    dispatch(get_categories(obj2));
  }, [searchValue, currentPage, parPage]);

  const draftHandler = (e) => {
    e.preventDefault();
    dispatch(
      make_draft({
        cartItems,
        totalAmount,
        totalQuantity,
        discount,
        payment,
      })
    );
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalAmount");
    localStorage.removeItem("totalQuantity");
    // dispatch(cartActions.deleteCard())
  };

  const orderHandler = (e) => {
    e.preventDefault();
    dispatch(
      place_order({
        cartItems,
        totalAmount,
        totalQuantity,
        discount,
        payment,
      })
    );
    setShowModal(true);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalAmount");
    localStorage.removeItem("totalQuantity");
    // dispatch(cartActions.deleteCard())
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const cancelHandler = () => {
    setShowModal(false);
    window.location.reload();
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/staff/dashboard/drafts");
      window.location.reload();
    }
  }, [successMessage, errorMessage]);

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[rgb(40,48,70)] rounded-md">
        <div className="flex  justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
          <h1 className="text-[#d0d2d6] font-semibold text-lg">Orders</h1>
          <button
            onClick={() => setShow(!show)}
            className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
          >
            Cart
          </button>
        </div>
        <div className={`${show ? "visible" : "hidden"} `}>
          <section className="bg-[#eeeeee]">
            <div className="w-[85%] lg:w-[90%] mx-auto py-16">
              {cartItems.length > 0 ? (
                <div className="flex flex-wrap">
                  <div className="lg:w-[67%] w-full">
                    <div className="lg:pr-3 pr-0">
                      <div className="flex flex-col gap-3">
                        <div className="bg-white p-4">
                          <h2 className="text-md text-green-500 font-semibold">
                            Billing Items {cartItems.length}
                          </h2>
                        </div>
                        {cartItems.map((pt, i) => (
                          <Cart pt={pt} key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="lg:w-[33%] w-full">
                    <div className="lg:pl-3 pl-0 mt-5">
                      {cartItems.length > 0 && (
                        <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                          <h2 className="text-xl font-bold">Order Summary</h2>
                          <div className="flex justify-between items-center">
                            <span>Total Order : {totalQuantity} </span>
                            <span>Tk {totalAmount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Discount </span>
                            <span>
                              <input
                                onChange={(e) => setDiscount(e.target.value)}
                                value={discount}
                                className="px-3 py-2 h-15 w-[150px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                                type="number"
                                name="discount"
                                placeholder="Discount"
                                id="discount"
                                required
                              />
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span>Grand Total</span>
                            <span className="text-lg text-orange-500">
                              Tk {totalAmount - discount}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Payment Method</span>
                            <span className="text-lg text-orange-500">
                              <select
                                onChange={(e) => setPayment(e.target.value)}
                                value={payment}
                                className="px-3 py-2 h-15 w-[150px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                              >
                                <option value="Cash">Cash</option>
                                <option value="Mobile_Banking">
                                  Mobile Banking
                                </option>
                                <option value="Card">Card</option>
                              </select>
                            </span>
                          </div>
                          <div className="flex justify-between items-start">
                            <button
                              onClick={(e) => orderHandler(e)}
                              className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm text-white uppercase"
                            >
                              Confirm Order
                            </button>
                            <button
                              onClick={(e) => draftHandler(e)}
                              className="px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm text-white uppercase"
                            >
                              Draft
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <a
                    href="#all_products"
                    className="px-4 py-1 bg-indigo-500 text-white"
                  >
                    Make Order Now
                  </a>
                </div>
              )}
            </div>
          </section>
        </div>
        <section className="bg-[rgb(40,48,70)]">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
          </div>
          <div className="my-4 mb-2">
            <Categories />
          </div>
          <div id="all_products" className="w-[85%] lg:w-[90%] mx-auto py-16">
            <p className="py-3 mb-3 text-white">Total Items {totalProduct}</p>
            <div className="w-full grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-4 gap-6">
              {products.map((p, i) => (
                <Products p={p} key={i} />
              ))}
            </div>
          </div>
        </section>
      </div>
      <>
        {showModal && (
          <Modal
            width={400}
            pagination={false}
            title="Invoice Details"
            visible={showModal}
            onCancel={() => {
              cancelHandler();
            }}
            footer={false}
          >
            {/* ============ invoice modal start ==============  */}
            {/* ============ invoice modal start ==============  */}
            <div id="invoice-POS" ref={componentRef}>
              <center id="top">
                <div className="info">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${userInfo.companyId.image})`,
                    }}
                  ></div>
                  <h2>{userInfo.companyId.name}</h2>
                  <p>
                    {" "}
                    Address : {userInfo.companyId.address} <br /> Mobile :
                    {userInfo.companyId.mobile} <br /> Email :
                    {userInfo.companyId.email}{" "}
                  </p>
                </div>
                {/*End Info*/}
              </center>
              {/*End InvoiceTop*/}
              <div id="mid">
                <div className="mt-2">
                  <p className="flex justify-between items-center">
                    <span>
                      {" "}
                      <b> {new Date().toLocaleDateString("en-GB")}</b>
                    </span>
                    <span>
                      {" "}
                      Generated by : <b>{userInfo?.name}</b>{" "}
                    </span>
                  </p>
                  <hr style={{ margin: "5px" }} />
                </div>
              </div>
              {/*End Invoice Mid*/}
              <div id="bot">
                <div id="table">
                  <table>
                    <tbody>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Item</b>
                          </p>
                        </td>
                        <td className="Hours table-header">
                          <p>
                            <b>Quantity</b>
                          </p>
                        </td>
                        <td className="Rate table-header">
                          <p>
                            <b>Price</b>
                          </p>
                        </td>
                        <td className="Rate table-header">
                          <p>
                            <b>Total</b>
                          </p>
                        </td>
                      </tr>
                      {cartItems.map((item) => (
                        <tr className="service" key={item._id}>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.name.slice(0, 16)}..
                            </p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      ))}
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="tax-label">Total Amount</p>
                        </td>
                        <td className="payment">
                          <p className="tax-value">BDT {totalAmount}</p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="tax-label">Discount</p>
                        </td>
                        <td className="payment">
                          <p className="tax-value">BDT {discount}</p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Grand Total</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>BDT {totalAmount - discount}</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Payment Method</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>{payment}</b>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*End Table*/}
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your order!</strong> Come again.
                    <b> Developed by AleeZaInnovation </b>
                  </p>
                </div>
              </div>
              {/*End InvoiceBot*/}
            </div>
            {/*End Invoice*/}
            <div className="flex justify-end mt-3">
              <Button
                className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
            {/* ============ invoice modal ends ==============  */}
          </Modal>
        )}
      </>
    </div>
  );
};

export default MakeOrder;
