import React, { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import moment from "moment";
import { Button, Modal } from "antd";
import { useSelector, useDispatch } from "react-redux";
import collect from "collect.js";
import {
  account_type_parties,
  get_payment_parties,
} from "../../store/reducers/partyReducer";
import "../../styles/InvoiceStyles.css";
import {
  balance_sheet,
  income_statement,
  messageClear,
  party_ledger,
} from "../../store/reducers/transactionReducer";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
const Reports = () => {
  const { parties } = useSelector((state) => state.party);
  const {
    successMessage,
    errorMessage,
    transactions,
    ledgerParty,
    debitBalance,
    creditBalance,

  } = useSelector((state) => state.transaction);
  const { userInfo } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const componentRef = useRef();
  const [view, setView] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(100);
  const [partyShow, setPartyShow] = useState(false);
  const [paymentView, setPaymentView] = useState(false);
  const [receiveView, setReceiveView] = useState(false);
  const [party, setParty] = useState("");
  const [partyName, setPartyName] = useState("");
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
  };
  const viewReceiveHandler = () => {
    setPaymentView(paymentView);
    setReceiveView(!receiveView);
  };

  const partyLedger = (obj) => {
    if (obj.account === "") {
      toast.error("Please select party");
    } else {
      dispatch(party_ledger(obj));
      setAccountType("");
      setPartyName("");
      setParty("");
      setTimeout(() => {
        setView(true);
      }, 1000);
    }
  };

  const incomeStatement = (obj) => {
    dispatch(income_statement(obj));
    navigate("/staff/dashboard/income-statements");
  };

  const balanceSheet = (obj) => {
    dispatch(balance_sheet(obj));
    navigate("/staff/dashboard/balance-sheet");
  };
  const accountTypeHandler = (obj) => {
    dispatch(account_type_parties(obj));
    setAccountType(obj);
  };

  const balance = debitBalance - creditBalance;

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
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
            <div className="flex flex-col text-[#d0d2d6] justify-between items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-center  w-full gap-1 mt-3 relative">
                <select
                  value={accountType}
                  onChange={(e) => accountTypeHandler(e.target.value)}
                  name=""
                  id=""
                  className="px-4 py-2 focus:border-indigo-500 text-center outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                >
                  {" "}
                  <option value="">Account Type</option>
                  <option value="Account_Payable">Account Payable</option>
                  <option value="Account_Receivable">Account Receivable</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                  <option value="Mobile_Banking">Mobile Banking</option>
                  <option value="Discount">Discount</option>
                  <option value="Inventory">Inventory</option>
                  <option value="Income">Income</option>
                  <option value="Expense">Expense</option>
                  <option value="Loan_Given">Loan Given</option>
                  <option value="Loan_Taken">Loan Taken</option>
                  <option value="Sales_Account">Sales Account</option>
                  <option value="Purchase_Account">Purchase Account</option>
                  <option value="Asset">Asset</option>
                  <option value="Liability">Liability</option>
                  <option value="Equity">Equity</option>
                </select>
              </div>
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
            <div className="flex  flex-col justify-between text-[#d0d2d6] items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-center  w-full gap-1 mt-3 relative">
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
              </div>
              <div>
                <span
                  onClick={(e) =>
                    partyLedger({
                      date: value,
                      account: party,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm cursor-pointer text-right text-white uppercase"
                >
                  Search
                </span>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <div className="flex gap-3 mt-2 ">
        {receiveView ? (
          <div className="w-full grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-7">
            <div className="flex  flex-col justify-between text-[#d0d2d6] items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-center  w-full gap-1 mt-3 relative">
                <p className="text-2xl font-bold mb-2 items-center text-[#d0d2d6]">
                  Income Statement
                </p>
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
              </div>
              <div>
                <span
                  onClick={(e) =>
                    incomeStatement({
                      date: value,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm cursor-pointer text-right text-white uppercase"
                >
                  Search
                </span>
              </div>
            </div>
            <div className="flex  flex-col justify-between text-[#d0d2d6] items-center p-5 bg-[#283046] rounded-md gap-3">
              <div className="flex flex-col justify-center  w-full gap-1 mt-3 relative">
                <p className="text-2xl font-bold mb-2 items-center text-[#d0d2d6]">
                  Balance Sheet
                </p>
                <span className="text-xl font-bold">
                  <Datepicker
                    value={value}
                    onChange={handleValueChange}
                    showShortcuts={true}
                  />
                </span>
              </div>
              <div>
                <span
                  onClick={(e) =>
                    balanceSheet({
                      date: value,
                    })
                  }
                  className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm cursor-pointer text-right text-white uppercase"
                >
                  Search
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
          Party Ledger
        </div>
        <div
          onClick={viewReceiveHandler}
          className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm cursor-pointer text-white uppercase"
        >
          {" "}
          Statement
        </div>
      </div>

      {view && (
        <Modal
          width="full"
          pagination={false}
          title="Document for Party Ledger"
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
                <div class="text-4xl uppercase font-bold dark:text-gray-300">Party Ledger</div>
              </div>
              <div class="flex flex-row justify-between py-3">
                <div class="flex-1 dark:text-gray-300">
                  <strong>Ledger for:</strong>
                  <br />
                  {ledgerParty.name}
                  <br />
                  {ledgerParty.address}
                  <br />
                  {ledgerParty.mobile}
                  <br />

                  {/* <br />
  James Doe Andreas street, <br /> Mountain View San Francisco,
  <br /> CA 9321, US <br />
  Andreas-Doe@domain.com <br /> +123 456 7890 */}
                </div>
                <div class="flex-1"></div>
                <div class="flex-1"></div>
                <div class="flex-1"></div>
                <div class="flex-1">
                  <div class="flex justify-between mb-2">
                    <div class="font-semibold dark:text-gray-300">Present Balance:</div>
                    <div class="ltr:dark:text-gray-300 rtl:text-left">
                      Tk {ledgerParty.balance}
                    </div>
                  </div>
                  <div class="flex justify-between mb-2 dark:text-gray-300">
                    <div class="font-semibold">Ledger date:</div>
                    <div class="ltr:text-right rtl:text-left">
                      {moment(value.startDate).format("ll")}
                      <br />{" "}
                      <p className=" flex justify-center  items-center">To</p>
                      {moment(value.endDate).format("ll")}
                    </div>
                  </div>
                </div>
              </div>
              <div class="py-4">
                <table class="table-bordered w-full ltr:text-left rtl:dark:text-gray-300 text-gray-600">
                  <thead class="border-b dark:border-gray-700">
                    <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                      <th>Date</th>
                      <th class="text-center dark:text-gray-300">TRA ID</th>
                      <th class="text-center dark:text-gray-300">Party</th>
                      <th class="text-center dark:text-gray-300">Note</th>
                      <th class="text-center dark:text-gray-300">Debit</th>
                      <th class="text-center dark:text-gray-300">Credit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions?.length > 0 &&
                      transactions.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div class="flex flex-wrap flex-row items-center">
                              <div class="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {moment(i.date).format("ll")}
                              </div>
                            </div>
                          </td>
                          <td class="text-center dark:text-gray-300">
                            {i.transactionNo}
                          </td>
                          <td class="text-center dark:text-gray-300">
                            {partyLedger._id === i.debit._id
                              ? i.credit.name
                              : i.debit.name}
                          </td>
                          <td class="text-center dark:text-gray-300">
                            {i.description}
                          </td>
                          <td class="text-right dark:text-gray-300">
                            {partyLedger._id === i.debit._id
                              ? "Tk" + " " + i.balance
                              : ""}
                          </td>
                          <td class="text-right">
                            {partyLedger._id === i.credit._id
                              ? "Tk" + " " + i.balance
                              : ""}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td colspan="4"></td>
                      <td class="dark:text-gray-300">Tk {debitBalance}</td>
                      <td class="dark:text-gray-300">Tk {creditBalance}</td>
                    </tr>
                    <tr>
                      <td colspan="4"></td>
                      <td class="dark:text-gray-300">
                        <b>Balance</b>
                      </td>
                      <td class="dark:text-gray-300 font-bold">Tk {balance}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div id="legalcopy">
                <p className="legal">
                  <strong>Thanks for business with us!</strong> Come again.
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

export default Reports;
