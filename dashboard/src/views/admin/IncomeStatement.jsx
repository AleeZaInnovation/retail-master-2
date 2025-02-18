import React, { useRef, useState } from "react";
import moment from "moment";
import { Button } from "antd";
import { useSelector, useDispatch } from "react-redux";

import "../../styles/InvoiceStyles.css";

import { useReactToPrint } from "react-to-print";

const IncomeStatement = () => {
  const {
    incomeParty,
    expenseParty,
    totalSales,
    totalDiscount,
    totalPurchase,
    ExpensePart,
    IncomePart,
    totalExpense,
    totalIncome,
    startDate,
    endDate,
  } = useSelector((state) => state?.transaction);
  const { userInfo } = useSelector((state) => state?.auth);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <section>
        <div className="flex-shrink max-w-full px-4 w-full mb-6">
          <div className="p-6 bg-gray dark:bg-white-800 ">
            <div className="flex justify-end mt-3">
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
                <div className="text-4xl uppercase dark:text-gray-300 font-bold">
                  Income Statement
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
                    <th className="w-[70%]">Particular</th>
                    <th className="text-center">Amount Tk</th>
                    <th className="text-center">Amount Tk</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Sales Revenue
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                    <td className="text-right dark:text-gray-300">
                      {totalSales.toLocaleString("en").toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Cost of Goods Sold
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                    {totalPurchase > 0 ? (
                      <td className="text-right dark:text-gray-300">
                        -{totalPurchase.toLocaleString("en").toFixed(2)}
                      </td>
                    ) : (
                      <td className="text-right dark:text-gray-300">
                        +{(-1 * totalPurchase).toLocaleString("en")}
                      </td>
                    )}
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Gross Profit
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1">
                      {(totalSales - totalPurchase).toLocaleString("en")}
                    </td>
                  </tr>
                  {incomeParty?.length > 0 ? (
                    <tr>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            Others Income
                          </div>
                        </div>
                      </td>
                      <td className="text-right dark:text-gray-300"></td>
                      <td className="text-right dark:text-gray-300"></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {IncomePart?.length > 0
                    ? IncomePart?.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.amount.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {incomeParty?.length > 0 ? (
                    <tr>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="leading-5 items-center text-xl font-bold dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            Total Income
                          </div>
                        </div>
                      </td>
                      <td className="text-right dark:text-gray-300"></td>
                      <td className="text-right dark:text-gray-300 text-xl font-bold">
                        +{totalIncome.toLocaleString("en")}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {expenseParty.length > 0 ? (
                    <tr>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="leading-5 items-center text-xl font-bold  dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            Expenses
                          </div>
                        </div>
                      </td>
                      <td className="text-right dark:text-gray-300"></td>
                      <td className="text-right dark:text-gray-300"></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {ExpensePart?.length > 0
                    ? ExpensePart?.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.amount.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {totalDiscount > 0 ? (
                    <tr>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            Discount
                          </div>
                        </div>
                      </td>
                      <td className="text-right dark:text-gray-300">
                        {totalDiscount.toLocaleString("en")}
                      </td>
                      <td className="text-right dark:text-gray-300"></td>
                    </tr>
                  ) : (
                    ""
                  )}
                  {expenseParty.length > 0 ? (
                    <tr>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="leading-5 items-center text-xl font-bold dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            Total Expenses
                          </div>
                        </div>
                      </td>
                      <td className="text-right dark:text-gray-300"></td>
                      <td className="text-right dark:text-gray-300 text-xl font-bold">
                        -{(totalExpense + totalDiscount).toLocaleString("en")}
                      </td>
                    </tr>
                  ) : (
                    ""
                  )}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1"></div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                    <td className="text-right dark:text-gray-300"></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 ">
                          Net Profit
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1">
                      {(
                        totalSales -
                        totalPurchase +
                        totalIncome -
                        totalExpense -
                        totalDiscount
                      ).toLocaleString("en")}
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

export default IncomeStatement;
