import React, { useState, useEffect, useRef } from "react";
import {  FaEye } from "react-icons/fa";
import { FcPrint } from "react-icons/fc";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { MdKeyboardArrowDown } from "react-icons/md";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Button, Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import {
  get_branch_orders,
  get_order,
} from "../../store/reducers/orderReducer";

const Orders = () => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const { totalOrders, orders, myOrder } = useSelector((state) => state.order);
  const { userInfo } = useSelector((state) => state?.auth);
  const [show, setShow] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(true);
  useEffect(() => {
    dispatch(
      get_branch_orders({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [parPage, currentPage, searchValue]);
  const orderView = (orderId) => {
    dispatch(get_order(orderId));
    setView(false);
  };

  const orderPrint = (orderId) => {
    dispatch(get_order(orderId));
    setShowModal(true);
  };

  const cancelHandler = () => {
    setShowModal(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <>
      {view ? (
        <div className="px-2 lg:px-7 pt-5">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <div className="flex justify-between items-center">
              <select
                onChange={(e) => setParPage(parseInt(e.target.value))}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              >
                <option value="5">5</option>
                <option value="5">15</option>
                <option value="5">25</option>
              </select>
              <input
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                type="text"
                placeholder="Search"
              />
            </div>
            <div className="relative mt-5 overflow-x-auto">
              <div className="w-full text-sm text-left [#d0d2d6]">
                <div className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="py-3 w-[5%]">Date</div>
                    <div className="py-3 w-[20%]">Quantity</div>
                    <div className="py-3 w-[20%]">Price</div>
                    <div className="py-3 w-[20%]">Make By</div>
                    <div className="py-3 w-[20%]">Action</div>
                    <div className="py-3 w-[5%]">
                      <MdKeyboardArrowDown />
                    </div>
                  </div>
                </div>
                {orders.map((o, i) => (
                  <div className="text-[#d0d2d6]">
                    <div className="flex justify-between items-start border-b border-slate-700">
                      <div className="py-4 w-[10%] font-medium whitespace-nowrap">
                        {moment(o.date).format("ll")}
                      </div>
                      <div className="py-4 w-[20%]">{o.totalQuantity}</div>
                      <div className="py-4 w-[20%]">Tk {o.totalAmount}</div>
                      <div className="py-4 w-[20%]">{o.generatedBy}</div>
                      <div className="py-4 w-[20%] flex justify-start items-center gap-4">
                        <Link
                          onClick={(e) => orderView(o._id)}
                          className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          onClick={(e) => orderPrint(o._id)}
                          className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                          placeholder="Print"
                        >
                          <FcPrint />
                        </Link>
                      </div>
                      <div
                        onClick={(e) => setShow(o._id)}
                        className="py-4 cursor-pointer w-[5%]"
                      >
                        <MdKeyboardArrowDown />
                      </div>
                    </div>
                    <div
                      className={
                        show === o._id
                          ? "block border-b border-slate-700 bg-slate-800"
                          : "hidden"
                      }
                    >
                      {o.cartItems.map((so, i) => (
                        <div className="flex justify-start items-start border-b border-slate-700">
                          <div className="py-4 w-[10%] font-medium whitespace-nowrap pl-3">
                            {i + 1}
                          </div>
                          <div className="py-4 w-[30%]">
                            Name : {so.name.slice(0, 32)}
                          </div>
                          <div className="py-4 w-[18%]">
                            {" "}
                            Quantity: {so.quantity}{" "}
                          </div>
                          <div className="py-4 w-[18%]">
                            Price: Tk {so.price}
                          </div>
                          <div className="py-4 w-[18%]">
                            Total: Tk {so.totalPrice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {totalOrders <= parPage ? (
              ""
            ) : (
              <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalOrders}
                  parPage={parPage}
                  showItem={4}
                />
              </div>
            )}
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
                          <b> {moment(myOrder?.date).format("ll")}</b>
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
                          {myOrder?.cartItems?.map((item) => (
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
                              <p className="tax-value">
                                BDT {myOrder?.totalAmount}
                              </p>
                            </td>
                          </tr>
                          <tr className="tabletitle">
                            <td />
                            <td />
                            <td className="Rate table-header">
                              <p className="tax-label">Discount</p>
                            </td>
                            <td className="payment">
                              <p className="tax-value">
                                BDT {myOrder?.discount}
                              </p>
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
                                <b>
                                  BDT {myOrder?.totalAmount - myOrder?.discount}
                                </b>
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
                                <b>{myOrder?.payment}</b>
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
      ) : (
        <>
          <Modal
            width="full"
            pagination={false}
            title="Invoice Details"
            visible={!view}
            onCancel={() => {
              setView(true);
            }}
            footer={false}
          >
            {/* ============ invoice modal start ==============  */}
            {/* ============ invoice modal start ==============  */}
            <div class="flex-shrink max-w-full px-4 w-full mb-6">
              <div
                class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                ref={componentRef}
              >
                <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
                  <div class="flex flex-col">
                    <div className="flex justify-start items-center">
                      <div
                        className="logo"
                        style={{
                          backgroundImage: `url(${userInfo.companyId.image})`,
                        }}
                      ></div>
                      <div class="text-3xl font-bold mb-1 dark:text-gray-300">
                        {userInfo.companyId.name}
                      </div>
                    </div>
                    <p class="text-sm dark:text-gray-300">
                      {userInfo.companyId.address} <br />{" "}
                      {userInfo.companyId.mobile} <br />
                      {userInfo.companyId.email}
                    </p>
                  </div>
                  <div class="text-4xl uppercase font-bold dark:text-gray-300">Invoice</div>
                </div>
                <div class="flex flex-row justify-between py-3 dark:text-gray-300">
                  <div class="flex-1">
                    <strong>Bill to:</strong>
                    <br />
                    Cash
                    {/* <br />
        James Doe Andreas street, <br /> Mountain View San Francisco,
        <br /> CA 9321, US <br />
        Andreas-Doe@domain.com <br /> +123 456 7890 */}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 dark:text-gray-300 font-semibold">Invoice ID#:</div>
                      <div class="flex-1 dark:text-gray-300 ltr:text-right rtl:text-left">
                        FA-{myOrder.orderNo}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 dark:text-gray-300 font-semibold">Invoice date:</div>
                      <div class="flex-1 dark:text-gray-300 ltr:text-right rtl:text-left">
                        {moment(myOrder.date).format("ll")}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 dark:text-gray-300 font-semibold">Generated By:</div>
                      <div class="flex-1 dark:text-gray-300 ltr:text-right rtl:text-left">
                        {myOrder.generatedBy}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 dark:text-gray-300 font-semibold">Status #:</div>
                      <div class="flex-1 dark:text-gray-300 ltr:text-right rtl:text-left">
                        Paid
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 dark:text-gray-300 font-semibold">Payment #:</div>
                      <div class="flex-1 dark:text-gray-300 ltr:text-right rtl:text-left">
                        {myOrder.payment}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="py-4">
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                        <th>Products</th>
                        <th class="text-center dark:text-gray-300">Qty</th>
                        <th class="text-center dark:text-gray-300">Unit price</th>
                        <th class="text-center dark:text-gray-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myOrder?.cartItems?.length > 0 &&
                        myOrder.cartItems.map((i, j) => (
                          <tr key={j}>
                            <td>
                            <div class="flex flex-wrap flex-row items-center">
                                <div class="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                  {i.name}
                                  <br />
                                  {i.serial.join(",")}
                                </div>
                              </div>
                            </td>
                            <td class="text-center dark:text-gray-300">{i.quantity}</td>
                            <td class="text-center dark:text-gray-300">TK {i.price}</td>
                            <td class="text-center dark:text-gray-300">TK {i.totalPrice}</td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center dark:text-gray-300">
                          <b>Sub-Total</b>
                        </td>
                        <td class="text-center dark:text-gray-300">
                          Tk {myOrder.totalAmount + myOrder.discount}
                        </td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center dark:text-gray-300">
                          <b>Discount</b>
                        </td>
                        <td class="text-center dark:text-gray-300">Tk {myOrder.discount}</td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center dark:text-gray-300">
                          <b>Total</b>
                        </td>
                        <td class="text-center dark:text-gray-300 font-bold">
                          Tk {myOrder.totalAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your order!</strong> Come again.
                    <b> Developed by AleeZaInnovation </b>
                  </p>
                </div>
              </div>
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
        </>
      )}
    </>
  );
};

export default Orders;
