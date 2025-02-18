import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import { Button } from "antd";
import { useSelector } from "react-redux";

import "../../styles/InvoiceStyles.css";

import { useReactToPrint } from "react-to-print";

const BalanceSheet = () => {
  const {
    cashAccount,
    mobileAccount,
    cardAccount,
    Account_PayableAccount,
    Account_ReceivableAccount,
    present_Inventory,
    totalProductsValue,
    Loan_GivenAccount,
    Loan_TakenAccount,
    AssetAccount,
    LiabilityAccount,
    EquityAccount,
    totalCurrentAsset,
    totalFixedAsset,
    totalCurrentLiability,
    totalLiability_Long,
    actualEquity,
    netProfit,
    startDate,
    endDate,
  } = useSelector((state) => state?.transaction);
  const { userInfo } = useSelector((state) => state?.auth);
  const [accPayable, setAccPayable] = useState(Account_PayableAccount);
  const [accReceivable, setAccReceivable] = useState(Account_ReceivableAccount);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  let adjustment =
    totalCurrentAsset +
    totalFixedAsset -
    totalCurrentLiability -
    totalLiability_Long -
    actualEquity;
  const handleZero = () => {
    setTimeout(() => {
      const accPay = [];
      const accRec = [];
      Account_PayableAccount?.forEach((party) => {
        if (party.balance !== 0 || party.balance !== -0) {
          accPay.push(party);
        }
      });
      Account_ReceivableAccount?.forEach((party) => {
        if (party.balance !== 0 || party.balance !== -0) {
          accRec.push(party);
        }
      });
      setAccReceivable(accRec);
      setAccPayable(accPay);
    }, 1000);
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
                Adjust
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
                  Balance Sheet
                </div>
                <div className="text-2xl  text-right dark:text-gray-300">
                  From {}
                  {moment(startDate)?.format("ll")} To {}
                  {moment(endDate)?.subtract(1, "days").format("ll")}
                </div>
              </div>
            </div>
            <div className="py-4">
              <table className="table-bordered w-full ltr:text-left rtl:text-right dark:text-gray-300 text-gray-600">
                <thead className="border-b dark:border-gray-700">
                  <tr className="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                    <th className="w-[65%] dark:text-gray-300">Particular</th>
                    <th className="text-center dark:text-gray-300">
                      Amount Tk
                    </th>
                    <th className="text-center dark:text-gray-300 ">
                      Amount Tk
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Assets
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1"></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Current Asset
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1"></td>
                  </tr>
                  {cashAccount?.length > 0
                    ? cashAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {mobileAccount?.length > 0
                    ? mobileAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {cardAccount?.length > 0
                    ? cardAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {accReceivable?.length > 0
                    ? accReceivable.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {/* Inventory */}

                  {/* <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Inventory
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300">
                      {present_Inventory?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                  </tr> */}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Finish Goods
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300">
                      {totalProductsValue?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                  </tr>
                  {Loan_GivenAccount?.length > 0
                    ? Loan_GivenAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Current Asset
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1">
                      {totalCurrentAsset?.toLocaleString("en")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Fixed Asset
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1"></td>
                  </tr>
                  {AssetAccount?.length > 0
                    ? AssetAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Fixed Asset
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1">
                      {totalFixedAsset?.toLocaleString("en")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Assets
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1">
                      {" "}
                      {(totalFixedAsset + totalCurrentAsset)?.toLocaleString(
                        "en"
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Equity & Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1"></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Equity
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1"></td>
                  </tr>
                  {EquityAccount?.length > 0
                    ? EquityAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance < 0
                              ? (-1 * i.balance)?.toLocaleString("en")
                              : (-1 * i.balance)?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Profit/Loss
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300">
                      {netProfit?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Adjustment
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300">
                      {adjustment?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300"></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Equity
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1">
                      {" "}
                      {(actualEquity + adjustment)?.toLocaleString("en")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1"></td>
                  </tr>
                  {accPayable?.length > 0
                    ? accPayable.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance < 0
                              ? (-1 * i.balance)?.toLocaleString("en")
                              : (-1 * i.balance)?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  {Loan_TakenAccount?.length > 0
                    ? Loan_TakenAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance < 0
                              ? (-1 * i.balance)?.toLocaleString("en")
                              : (-1 * i.balance)?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Current Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold ">
                      {" "}
                      {totalCurrentLiability?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300 mb-1"></td>
                  </tr>
                  {LiabilityAccount?.length > 0
                    ? LiabilityAccount.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div className="flex flex-wrap flex-row items-center">
                              <div className="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {i.name}
                              </div>
                            </div>
                          </td>
                          <td className="text-right dark:text-gray-300">
                            {i.balance?.toLocaleString("en")}
                          </td>
                          <td className="text-right dark:text-gray-300"></td>
                        </tr>
                      ))
                    : ""}
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Long Term Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold ">
                      {" "}
                      {totalLiability_Long?.toLocaleString("en")}
                    </td>
                    <td className="text-right dark:text-gray-300  mb-1"></td>
                  </tr>

                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-lg font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-lg font-bold mb-1">
                      {" "}
                      {(
                        totalLiability_Long + totalCurrentLiability
                      )?.toLocaleString("en")}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="leading-5 items-center text-xl font-bold mb-1 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          Total Equity & Liability
                        </div>
                      </div>
                    </td>
                    <td className="text-right dark:text-gray-300 "></td>
                    <td className="text-right dark:text-gray-300 text-xl font-bold mb-1">
                      {" "}
                      {(totalCurrentAsset + totalFixedAsset)?.toLocaleString(
                        "en"
                      )}
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

export default BalanceSheet;
