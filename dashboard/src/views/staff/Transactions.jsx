import React, { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import { Button, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { numberToWords } from "amount-to-words";
import { get_payment_parties } from "../../store/reducers/partyReducer";
import "../../styles/InvoiceStyles.css";
import {
  contraTransaction,
  messageClear,
  paymentTransaction,
  receiveTransaction,
} from "../../store/reducers/transactionReducer";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
const Transactions = () => {
  const { parties } = useSelector((state) => state.party);
  const { transaction, successMessage, errorMessage } = useSelector(
    (state) => state.transaction
  );
  const { userInfo } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const componentRef = useRef();
  const [view, setView] = useState(false);
  const [payment, setPayment] = useState();
  const [received, setReceived] = useState();
  const [paymentDescription, setPaymentDescription] = useState();
  const [receiveDescription, setReceiveDescription] = useState();
  const [mode, setMode] = useState("Cash");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(100);
  const [partyShow, setPartyShow] = useState(false);
  const [debitPartyShow, setDebitPartyShow] = useState(false);
  const [paymentView, setPaymentView] = useState(false);
  const [contraView, setContraView] = useState(false);
  const [receiveView, setReceiveView] = useState(false);
  const [party, setParty] = useState("");
  const [partyName, setPartyName] = useState("");
  const [debitParty, setDebitParty] = useState("");
  const [debitPartyName, setDebitPartyName] = useState("");
  const [allParty, setAllParties] = useState([]);
  const partySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allParty.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllParties(srcValue);
    } else {
      setAllParties(parties);
    }
  };
  useEffect(() => {
    setAllParties(parties);
  }, [parties]);
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_payment_parties(obj));
  }, [searchValue, currentPage, parPage]);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date().setMonth(11),
  });
  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  const viewPaymentHandler = () => {
    setPaymentView(!paymentView);
    setReceiveView(receiveView);
    setContraView(contraView);
  };
  const viewReceiveHandler = () => {
    setPaymentView(paymentView);
    setReceiveView(!receiveView);
    setContraView(contraView);
  };
  const viewContraHandler = () => {
    setContraView(!contraView);
    setPaymentView(paymentView);
    setReceiveView(receiveView);
  };
  const receiveHandler = (obj) => {
    if (obj.credit === "") {
      toast.error("Please select party");
    } else {
      if (obj.amount === undefined) {
        toast.error("Please give received amount");
      } else {
        dispatch(receiveTransaction(obj));
        setPartyName("");
        setReceived("");
        setReceiveDescription("");
        setTimeout(() => {
          setView(true);
        }, 5000);
      }
    }
  };

  const contraHandler = (obj) => {
    if (obj.credit === "" || obj.debit === "") {
      toast.error("Please select party");
    } else {
      if (obj.amount === undefined) {
        toast.error("Please give transaction amount");
      } else {
        dispatch(contraTransaction(obj));
        setPartyName("");
        setDebitPartyName("");
        setReceived("");
        setReceiveDescription("");
        setTimeout(() => {
          setView(true);
        }, 5000);
      }
    }
  };

  const paymentHandler = (obj) => {
    if (obj.debit === "") {
      toast.error("Please select party");
    } else {
      if (obj.amount === undefined) {
        toast.error("Please give payment amount");
      } else {
        dispatch(paymentTransaction(obj));
        setPartyName("");
        setPayment("");
        setPaymentDescription("");
        setTimeout(() => {
          setView(true);
        }, 5000);
      }
    }
  };

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

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  return (
    <div className="px-2 md:px-7 py-2">
      <div className="flex gap-3 ">
        {paymentView ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Payment To</h2>

                <div className="flex flex-col w-full gap-1 mt-3 relative">
                  <input
                    readOnly
                    onClick={() => setPartyShow(!partyShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                    value={partyName}
                    type="text"
                    placeholder="--Select Party--"
                    id="party"
                    name="party"
                    required
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                      partyShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={partySearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Party"
                        required
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allParty.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            party === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setPartyShow(false);
                            setParty(c._id);
                            setPartyName(c.name);
                            setSearchValue("");
                            setAllParties(parties);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
                <span className="text-md font-small mt-3 bg-[#f8f8f9] border border-slate-700 rounded-md ">
                  <input
                    onChange={(e) => setPayment(e.target.value)}
                    value={payment}
                    className="px-3 py-2 h-auto w-[220px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                    type="number"
                    name="payment"
                    placeholder="Payment Amount"
                    id="payment"
                    required
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Payment Mode</h2>

                <span className="text-md font-small mt-3 bg-[#f8f8f9] border border-slate-700 rounded-md ">
                  <select
                    onChange={(e) => setMode(e.target.value)}
                    value={mode}
                    className="px-3 py-2 h-auto w-[220px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Mobile_Banking">Mobile Banking</option>
                    <option value="Card">Card</option>
                  </select>
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start">
                <span className="text-md font-small mt-3 bg-[#f8f8f9] rounded-md mb-3">
                  <textarea
                    name=""
                    id=""
                    cols="5"
                    rows="2"
                    onChange={(e) => setPaymentDescription(e.target.value)}
                    value={paymentDescription}
                    placeholder="Write Payment Note"
                    className="px-3 py-2 h-auto w-[220px] outline-none  rounded-md text-[#0b0b0b]  focus:border-indigo-500 overflow-hidden"
                  ></textarea>
                </span>
                <span
                  onClick={(e) =>
                    paymentHandler({
                      date: value,
                      debit: party,
                      credit: mode,
                      description: paymentDescription,
                      amount: payment,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm cursor-pointer text-white uppercase"
                >
                  Payment
                </span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 mt-2">
        {receiveView ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Received From</h2>

                <div className="flex flex-col w-full gap-1 mt-3 relative">
                  <input
                    readOnly
                    onClick={() => setPartyShow(!partyShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                    value={partyName}
                    type="text"
                    placeholder="--Select Party--"
                    id="party"
                    name="party"
                    required
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                      partyShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={partySearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Party"
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allParty.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            party === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setPartyShow(false);
                            setParty(c._id);
                            setPartyName(c.name);
                            setSearchValue("");
                            setAllParties(parties);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
                <span className="text-md font-small mt-3 bg-[#f8f8f9] border border-slate-700 rounded-md ">
                  <input
                    onChange={(e) => setReceived(e.target.value)}
                    value={received}
                    className="px-3 py-2 h-auto w-[220px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                    type="number"
                    name="received"
                    placeholder="Receive Amount"
                    id="received"
                    required
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Received By</h2>

                <span className="text-md font-small mt-3 bg-[#f8f8f9] border border-slate-700 rounded-md ">
                  <select
                    onChange={(e) => setMode(e.target.value)}
                    value={mode}
                    className="px-3 py-2 h-auto w-[220px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Mobile_Banking">Mobile Banking</option>
                    <option value="Card">Card</option>
                  </select>
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start">
                <span className="text-md font-small mt-3 bg-[#f8f8f9] rounded-md mb-3">
                  <textarea
                    name=""
                    id=""
                    cols="5"
                    rows="2"
                    onChange={(e) => setReceiveDescription(e.target.value)}
                    value={receiveDescription}
                    placeholder="Write Received Note"
                    className="px-3 py-2 h-auto w-[220px] outline-none  rounded-md text-[#0b0b0b]  focus:border-indigo-500 overflow-hidden"
                  ></textarea>
                </span>
                <span
                  onClick={(e) =>
                    receiveHandler({
                      date: value,
                      debit: mode,
                      credit: party,
                      description: receiveDescription,
                      amount: received,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm cursor-pointer text-white uppercase"
                >
                  Received
                </span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 mt-2">
        {contraView ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-7">
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Debit Party</h2>

                <div className="flex flex-col w-full gap-1 mt-3 relative">
                  <input
                    readOnly
                    onClick={() => setDebitPartyShow(!debitPartyShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                    value={debitPartyName}
                    type="text"
                    placeholder="--Select Party--"
                    id="party"
                    name="party"
                    required
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                      debitPartyShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={partySearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Party"
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allParty.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            party === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setDebitPartyShow(false);
                            setDebitParty(c._id);
                            setDebitPartyName(c.name);
                            setSearchValue("");
                            setAllParties(parties);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <h2 className="text-2xl font-bold mb-3">Credit Party</h2>

                <div className="flex flex-col w-full gap-1 mt-3 relative">
                  <input
                    readOnly
                    onClick={() => setPartyShow(!partyShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                    value={partyName}
                    type="text"
                    placeholder="--Select Party--"
                    id="party"
                    name="party"
                    required
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                      partyShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={partySearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Party"
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allParty.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            party === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setPartyShow(false);
                            setParty(c._id);
                            setPartyName(c.name);
                            setSearchValue("");
                            setAllParties(parties);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start text-[#d0d2d6]">
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
                <span className="text-md font-small mt-3 bg-[#f8f8f9] border border-slate-700 rounded-md ">
                  <input
                    onChange={(e) => setReceived(e.target.value)}
                    value={received}
                    className="px-3 py-2 h-auto w-[220px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                    type="number"
                    name="received"
                    placeholder="Transaction Value"
                    id="received"
                    required
                  />
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-start items-start">
                <span className="text-md font-small mt-3 bg-[#f8f8f9] rounded-md mb-3">
                  <textarea
                    name=""
                    id=""
                    cols="5"
                    rows="2"
                    onChange={(e) => setReceiveDescription(e.target.value)}
                    value={receiveDescription}
                    placeholder="Write Transaction Note"
                    className="px-3 py-2 h-auto w-[220px] outline-none  rounded-md text-[#0b0b0b]  focus:border-indigo-500 overflow-hidden"
                  ></textarea>
                </span>
                <span
                  onClick={(e) =>
                    contraHandler({
                      date: value,
                      debit: debitParty,
                      credit: party,
                      description: receiveDescription,
                      amount: received,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm cursor-pointer text-white uppercase"
                >
                  Transaction
                </span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex justify-between items-center mt-5">
        <div
          onClick={viewPaymentHandler}
          className="px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm cursor-pointer text-white uppercase"
        >
          {" "}
          Payment Transaction
        </div>
        <div
          onClick={viewReceiveHandler}
          className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm cursor-pointer text-white uppercase"
        >
          {" "}
          Received Transaction
        </div>
        <div
          onClick={viewContraHandler}
          className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm cursor-pointer text-white uppercase"
        >
          {" "}
          Contra Transaction
        </div>
      </div>
      {view && (
        <Modal
          width="full"
          pagination={false}
          title="Document for Transaction"
          visible={view}
          onCancel={() => {
            setView(false);
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
                    <div class="text-3xl dark:bg-gray-300 font-bold mb-1">
                      {userInfo.companyId.name}
                    </div>
                  </div>
                  <p class="text-sm dark:bg-gray-300">
                    {userInfo.companyId.address} <br />{" "}
                    {userInfo.companyId.mobile} <br />
                    {userInfo.companyId.email}
                  </p>
                </div>
                {transaction.transactionType === "Contra" ? (
                  <div class=" dark:bg-gray-300 text-4xl uppercase font-bold">
                    Transaction Receipt
                  </div>
                ) : (
                  <div class="text-4xl dark:bg-gray-300 uppercase font-bold">
                    Money Receipt
                  </div>
                )}
              </div>
              <div class="flex flex-row dark:bg-gray-300 justify-between py-3">
                {transaction.transactionType === "Contra" ? (
                  <div class="flex-1">
                    <strong>Debit Party:</strong>
                    <br />
                    {transaction.debit.name} ||Balance{" "}
                    {transaction.debit.balance}
                    <br />
                    <strong>Credit Party:</strong>
                    <br />
                    {transaction.credit.name} ||Balance{" "}
                    {transaction.credit.balance}
                  </div>
                ) : transaction.transactionType === "Payment" ? (
                  <div class="flex-1">
                    <strong>Payment to:</strong>
                    <br />
                    {transaction.debit.name}
                  </div>
                ) : (
                  <div class="flex-1">
                    <strong>Received from:</strong>
                    <br />
                    {transaction.credit.name}
                  </div>
                )}
                <div class="flex-1">
                  <div class="flex justify-between mb-2">
                    <div class="flex-1 dark:bg-gray-300 font-semibold">
                      Invoice ID#:
                    </div>
                    <div class="flex-1 ltr:text-right dark:bg-gray-300 rtl:text-left">
                      FA-{transaction?.transactionNo}
                    </div>
                  </div>
                  <div class="flex justify-between mb-2">
                    <div class="flex-1 dark:bg-gray-300 font-semibold">
                      Invoice date:
                    </div>
                    <div class="flex-1 dark:bg-gray-300 ltr:text-right rtl:text-left">
                      {moment(transaction?.date).format("ll")}
                    </div>
                  </div>
                  <div class="flex justify-between mb-2">
                    <div class="flex-1 dark:bg-gray-300 font-semibold">
                      Generated By:
                    </div>
                    <div class="flex-1 dark:bg-gray-300 ltr:text-right rtl:text-left">
                      {transaction?.generatedBy}
                    </div>
                  </div>
                  <div class="flex justify-between mb-2">
                    <div class="flex-1 dark:bg-gray-300 font-semibold">
                      Transaction Type #:
                    </div>
                    <div class="flex-1 dark:bg-gray-300 ltr:text-right rtl:text-left">
                      {transaction?.transactionType}
                    </div>
                  </div>
                </div>
              </div>
              <div class="py-4">
                {transaction.transactionType === "Contra" ? (
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-300 dark:bg-opacity-20">
                        <th>Debit Party </th>
                        <th class="text-center dark:bg-gray-300">
                          Credit Party
                        </th>
                        <th class="text-center dark:bg-gray-300">Purpose</th>
                        <th class="text-center dark:bg-gray-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="flex flex-wrap flex-row items-center">
                            <div class="leading-5 text-center dark:bg-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                              {transaction.debit.name}
                            </div>
                          </div>
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {transaction.credit.name}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {" "}
                          {transaction.description}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          TK {transaction.balance}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot></tfoot>
                  </table>
                ) : transaction?.transactionType === "Payment" ? (
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-300 dark:bg-opacity-20">
                        <th>Payment To </th>
                        <th class="text-center dark:bg-gray-300">
                          Payment Mode
                        </th>
                        <th class="text-center dark:bg-gray-300">Purpose</th>
                        <th class="text-center dark:bg-gray-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="flex flex-wrap flex-row items-center">
                            <div class="leading-5 text-center dark:bg-gray-300 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                              {transaction.debit.name}
                            </div>
                          </div>
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {transaction.credit.name}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {" "}
                          {transaction.description}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          TK {transaction.balance}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot></tfoot>
                  </table>
                ) : (
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-300 dark:bg-opacity-20">
                        <th>Received From </th>
                        <th class="text-center dark:bg-gray-300">
                          Received Mode
                        </th>
                        <th class="text-center dark:bg-gray-300">Purpose</th>
                        <th class="text-center dark:bg-gray-300">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="flex flex-wrap flex-row items-center">
                            <div class="leading-5 text-center dark:bg-gray-300 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                              {transaction.credit.name}
                            </div>
                          </div>
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {transaction.debit.name}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          {" "}
                          {transaction.description}
                        </td>
                        <td class="text-center dark:bg-gray-300">
                          TK {transaction.balance}
                        </td>
                      </tr>
                    </tbody>
                    <tfoot></tfoot>
                  </table>
                )}
                <div id="convert">
                  <p class="dark:bg-gray-300">
                    <strong>Amount in word: </strong>Tk{" "}
                    {numberToWords(transaction.balance)} Only
                  </p>
                </div>
              </div>

              <div id="legalcopy">
                <p className="legal">
                  <strong>Thank you for your transaction!</strong> Come again.
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
      )}
    </div>
  );
};

export default Transactions;
