import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import "../../styles/InvoiceStyles.css";

import { useReactToPrint } from "react-to-print";

const DayBook = () => {
  const { transactions, startDate, endDate } = useSelector(
    (state) => state?.transaction
  );
  const [impTransactions, setImpTransactions] = useState(transactions);
  const { userInfo } = useSelector((state) => state?.auth);
  const [balance, setBalance] = useState("");
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  useEffect(() => {
    let amount = 0;

    for (let i = 0; i < transactions?.length; i++) {
      amount += transactions[i]?.balance;
    }
    setBalance(amount);
    setTimeout(() => {
      setImpTransactions(transactions);
    }, 500);
  }, [transactions]);
  const handleZero = () => {
    const nTransactions = [];
    transactions.forEach((party) => {
      if (party.balance !== 0) {
        nTransactions.push(party);
      }
    });
    setImpTransactions(nTransactions);
  };

  return (
    <div>
      <section>
        <div className="flex-shrink max-w-full px-4 w-full mb-6">
          <div className="p-6 bg-gray dark:bg-white-800 ">
            <div className="flex justify-between mt-3">
              <Button
                className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                onClick={handleZero}
              >
                Without Zero
              </Button>
              <Button
                className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
          </div>
          <div
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
            ref={componentRef}
          >
            <div className="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
              <div className="flex flex-col">
                <div className="flex justify-start items-center">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${userInfo.companyId.image})`,
                    }}
                  ></div>
                  <div className="text-3xl dark:text-gray-300 font-bold mb-1">
                    {userInfo.companyId.name}
                  </div>
                </div>
                <p className="text-sm dark:text-gray-300">
                  {userInfo.companyId.address} <br />{" "}
                  {userInfo.companyId.mobile} <br />
                  {userInfo.companyId.email}
                </p>
              </div>
              <div className="flex flex-col">
                <div className="text-4xl text-right dark:text-gray-300 uppercase font-bold">
                  Day Book
                </div>
                <div className="text-2xl  text-right dark:text-gray-300">
                  From {}
                  {moment(startDate).format("ll")} To {}
                  {moment(endDate).subtract(1, "days").format("ll")}
                </div>
              </div>
            </div>
            <div className="py-4">
              <table className="table-bordered w-full ltr:text-left rtl:text-right dark:text-gray-300 text-gray-600">
                <thead className="border-b dark:border-gray-700">
                  <tr className="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                    <th className="text-center">Date</th>
                    <th className="text-center">Particular</th>
                    <th className="text-center">Debit Party</th>
                    <th className="text-center">Credit Party</th>
                    <th className="text-center">Amount Tk</th>
                  </tr>
                </thead>
                <tbody>
                  {impTransactions?.length > 0
                    ? impTransactions.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {moment(i.date).format("ll")}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.transactionType}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i?.debit?.name}
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i?.credit?.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td colspan="3"></td>
                    <td class="dark:text-gray-300">
                      <b>Balance</b>
                    </td>
                    <td class="dark:text-gray-300 text-right font-bold">
                      Tk {balance?.toLocaleString("en")}
                    </td>
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
      </section>
    </div>
  );
};

export default DayBook;
