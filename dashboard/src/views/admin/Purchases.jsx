import React, { useState, useEffect, useRef } from "react";
import { FaEye } from "react-icons/fa";
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
import { get_purchases, get_purchase } from "../../store/reducers/orderReducer";
import { company_branch } from "../../store/reducers/companyReducer";
const Purchases = () => {
  const dispatch = useDispatch();
  const componentRef = useRef();
  const { totalPurchases, purchases, myPurchase } = useSelector(
    (state) => state.order
  );
  const [branchPurchases, setBranchPurchases] = useState(purchases);
  const { userInfo } = useSelector((state) => state?.auth);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const [show, setShow] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState(true);
  useEffect(() => {
    dispatch(
      get_purchases({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
    dispatch(company_branch(_id));
  }, [parPage, currentPage, searchValue]);
  const purchaseView = (purchaseId) => {
    dispatch(get_purchase(purchaseId));
    setView(false);
  };

  const purchasePrint = (purchaseId) => {
    dispatch(get_purchase(purchaseId));
    setShowModal(true);
  };

  const cancelHandler = () => {
    setShowModal(false);
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const [branchShow, setBranchShow] = useState(false);
  const [branch, setBranch] = useState("");
  const [branchName, setBranchName] = useState("");
  const [allBranch, setAllBranch] = useState([]);
  const branchSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allBranch.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllBranch(srcValue);
    } else {
      setAllBranch(companyBranch);
    }
  };

  useEffect(() => {
    setAllBranch(companyBranch);
    setBranchPurchases(purchases);
  }, [companyBranch, purchases]);

  const handleBranchChange = (value) => {
    const npurchases = [];
    purchases.forEach((purchase) => {
      if (purchase.branchId === value) {
        npurchases.push(purchase);
      }
    });
    setBranchPurchases(npurchases);
  };
  return (
    <>
      {view ? (
        <div className="px-2 lg:px-7 pt-5">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <div className="px-4 py-2 flex justify-end mb-2 bg-sky-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#eff0f3]">
              <Link
                to="/admin/dashboard/inventory-purchase"
                className="px-4 py-2 text-sm bg-orange-300 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#070b13]"
              >
                {" "}
                Purchase Products
              </Link>
            </div>
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
              <div className="flex flex-col w-full gap-1 relative">
                <h3 className="text-[#d0d2d6] text-xl font-semibold">Branch</h3>
                <div className="h-10 w-[200px]">
                  <input
                    readOnly
                    onClick={() => setBranchShow(!branchShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f7f7f9] border border-slate-700 rounded-md text-[#131415]"
                    value={branchName}
                    type="text"
                    placeholder="--Select Branch--"
                    id="branch"
                    name="branch"
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-200 w-[210px] transition-all ${
                      branchShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={branchSearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Branch"
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allBranch.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            branch === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setBranchShow(false);
                            setBranch(c._id);
                            setBranchName(c.name);
                            setSearchValue("");
                            setAllBranch(companyBranch);
                            handleBranchChange(c._id);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full text-sm text-left [#d0d2d6]">
                <div className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <div className="flex justify-between items-start">
                    <div className="py-3 w-[15%]">Date</div>
                    <div className="py-3 w-[20%]">Quantity</div>
                    <div className="py-3 w-[20%]">Price</div>
                    <div className="py-3 w-[20%]">Purchase Form</div>
                    <div className="py-3 w-[20%]">Action</div>
                    <div className="py-3 w-[5%]">
                      <MdKeyboardArrowDown />
                    </div>
                  </div>
                </div>
                {branchPurchases.map((o, i) => (
                  <div className="text-[#d0d2d6]">
                    <div className="flex justify-between items-start border-b border-slate-700">
                      <div className="py-4 w-[5%] font-medium whitespace-nowrap">
                        {moment(o.date).format("ll")}
                      </div>
                      <div className="py-4 flex justify-center items-center w-[20%]">
                        {o.totalQuantity}
                      </div>
                      <div className="py-4 flex justify-center items-center w-[20%]">
                        Tk {o.totalAmount}
                      </div>
                      <div className="py-4 flex justify-center items-center w-[20%]">
                        {o?.purchaseForm?.name}
                      </div>
                      <div className="py-4 w-[20%] flex justify-start items-center gap-4">
                        <Link
                          onClick={(e) => purchaseView(o._id)}
                          className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                        >
                          <FaEye />
                        </Link>
                        <Link
                          onClick={(e) => purchasePrint(o._id)}
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
                            Name : {so.invent?.slice(0, 32)}
                          </div>
                          <div className="py-4 w-[18%]">
                            {" "}
                            Quantity: {so.quantity} {so.unit}
                          </div>
                          <div className="py-4 w-[18%]">
                            Price: Tk {so.amount}
                          </div>
                          <div className="py-4 w-[18%]">
                            Total: Tk {so.price}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {totalPurchases <= parPage ? (
              ""
            ) : (
              <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalPurchases}
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
                          <b> {moment(myPurchase?.date).format("ll")}</b>
                        </span>
                        <span>
                          {" "}
                          Purchase Form :{" "}
                          <b>{myPurchase?.purchaseForm?.name}</b>{" "}
                        </span>
                      </p>
                      <p className="flex justify-between items-center mt-2">
                        <span>
                          {" "}
                          <b> {myPurchase?.purchaseNo}</b>
                        </span>
                        <span>
                          {" "}
                          Generate By : <b>{myPurchase?.generatedBy}</b>{" "}
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
                          {myPurchase?.cartItems?.map((item) => (
                            <tr className="purchase" key={item._id}>
                              <td className="tableitem">
                                <p className="itemtext">
                                  {item.invent.slice(0, 16)}..
                                  <br />
                                </p>
                              </td>
                              <td className="tableitem">
                                <p className="itemtext">
                                  {item.quantity}
                                  {item.unit}
                                </p>
                              </td>
                              <td className="tableitem">
                                <p className="itemtext">{item.amount}</p>
                              </td>
                              <td className="tableitem">
                                <p className="itemtext">{item.price}</p>
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
                                BDT {myPurchase?.totalAmount}
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
                                <b>BDT {myPurchase?.totalAmount}</b>
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
                      <div class="text-3xl font-bold mb-1">
                        {userInfo.companyId.name}
                      </div>
                    </div>
                    <p class="text-sm">
                      {userInfo.companyId.address} <br />{" "}
                      {userInfo.companyId.mobile} <br />
                      {userInfo.companyId.email}
                    </p>
                  </div>
                  <div class="text-4xl uppercase font-bold">Invoice</div>
                </div>
                <div class="flex flex-row justify-between py-3">
                  <div class="flex-1 flex-col">
                    <strong>Purchase Form:</strong>
                    <br />
                    {myPurchase?.purchaseForm?.name}
                    <br />
                    {/* <br />
        James Doe Andreas street, <br /> Mountain View San Francisco,
        <br /> CA 9321, US <br />
        Andreas-Doe@domain.com <br /> +123 456 7890 */}
                    <strong>Previous Due :</strong>
                    <br />
                    {myPurchase?.purchaseForm?.balance}
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 font-semibold">Invoice ID#:</div>
                      <div class="flex-1 ltr:text-right rtl:text-left">
                        FA-{myPurchase.purchaseNo}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 font-semibold">Invoice date:</div>
                      <div class="flex-1 ltr:text-right rtl:text-left">
                        {moment(myPurchase.date).format("ll")}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 font-semibold">Generated By:</div>
                      <div class="flex-1 ltr:text-right rtl:text-left">
                        {myPurchase.generatedBy}
                      </div>
                    </div>
                    <div class="flex justify-between mb-2">
                      <div class="flex-1 font-semibold">Status #:</div>
                      <div class="flex-1 ltr:text-right rtl:text-left">Due</div>
                    </div>
                    {/* <div class="flex justify-between mb-2">
                      <div class="flex-1 font-semibold">Payment #:</div>
                      <div class="flex-1 ltr:text-right rtl:text-left">
                        {myPurchase.payment}
                      </div>
                    </div> */}
                  </div>
                </div>
                <div class="py-4">
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                        <th>Products</th>
                        <th class="text-center">Qty</th>
                        <th class="text-center">Unit price</th>
                        <th class="text-center">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {myPurchase?.cartItems?.length > 0 &&
                        myPurchase.cartItems.map((i, j) => (
                          <tr key={j}>
                            <td>
                              <div class="flex flex-wrap flex-row items-center">
                                <div class="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                  {i.invent}
                                  <br />
                                  {i.sn.join(",")}
                                </div>
                              </div>
                            </td>
                            <td class="text-center">
                              {i.quantity} -{i.unit}
                            </td>
                            <td class="text-center">TK {i.amount}</td>
                            <td class="text-center">TK {i.price}</td>
                          </tr>
                        ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center">
                          <b>Sub-Total</b>
                        </td>
                        <td class="text-center">Tk {myPurchase.totalAmount}</td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center">
                          <b>Discount</b>
                        </td>
                        <td class="text-center">Tk {myPurchase.discount} 0</td>
                      </tr>
                      <tr>
                        <td colspan="2"></td>
                        <td class="text-center">
                          <b>Total</b>
                        </td>
                        <td class="text-center font-bold">
                          Tk {myPurchase.totalAmount}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your support!</strong> Will purchase
                    again.
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

export default Purchases;
