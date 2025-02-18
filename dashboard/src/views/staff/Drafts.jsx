import React, { useState, useEffect, useRef } from "react";
import { FaEdit, FaShoppingCart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import Pagination from "../Pagination";
import { MdKeyboardArrowDown } from "react-icons/md";
import toast from "react-hot-toast";
import Search from "../components/Search";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import {
  draft_remove,
  get_branch_drafts,
  get_draft,
  messageClear,
} from "../../store/reducers/draftReducer";
import moment from "moment";
import { place_order } from "../../store/reducers/orderReducer";

const Drafts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();
  const { totalDrafts, drafts, myDraft, successMessage, errorMessage } =
    useSelector((state) => state.draft);
  const { userInfo } = useSelector((state) => state?.auth);
  const [show, setShow] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    dispatch(
      get_branch_drafts({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [parPage, currentPage, searchValue]);

  const draftHandler = ({
    draftId,
    cartItems,
    totalAmount,
    totalQuantity,
    e,
  }) => {
    e.preventDefault();
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("totalAmount", JSON.stringify(totalAmount));
    localStorage.setItem("totalQuantity", JSON.stringify(totalQuantity));
    dispatch(draft_remove(draftId));
    setTimeout(() => {
      navigate("/staff/dashboard/make-order");
      window.location.reload();
    }, 3000);
  };

  const draftView = (draftId) => {
    dispatch(get_draft(draftId));
    setShowModal(true);
    dispatch(
      place_order({
        cartItems: myDraft.cartItems,
        totalAmount: myDraft.totalAmount,
        totalQuantity: myDraft.totalQuantity,
        discount: myDraft.discount,
        payment: myDraft.payment,
      })
    );
    setTimeout(() => {
      dispatch(draft_remove(draftId));
      dispatch(
        get_branch_drafts({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
        })
      );
    }, 3000);
  };

  const cancelHandler = () => {
    setShowModal(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);
  return (
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
            {drafts.map((o, i) => (
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
                      onClick={(e) => draftView(o._id)}
                      className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                    >
                      <FaShoppingCart />
                    </Link>
                    <Link
                      onClick={(e) =>
                        draftHandler({
                          draftId: o._id,
                          cartItems: o.cartItems,
                          totalAmount: o.totalAmount,
                          totalQuantity: o.totalQuantity,
                          e,
                        })
                      }
                      className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                    >
                      <FaEdit />
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
                      <div className="py-4 w-[18%]">Price: Tk {so.price}</div>
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
        {totalDrafts <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalDrafts}
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
                      <b> {moment(myDraft?.date).format("ll")}</b>
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
                      {myDraft?.cartItems?.map((item) => (
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
                            BDT {myDraft?.totalAmount}
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
                          <p className="tax-value">BDT {myDraft?.discount}</p>
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
                              BDT {myDraft?.totalAmount - myDraft?.discount}
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
                            <b>{myDraft?.payment}</b>
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

export default Drafts;
