import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";

import {
  partyAdd,
  get_parties,
  get_party,
  partyUpdate,
  messageClear
} from "../../store/reducers/partyReducer";
const Party = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, parties, party, totalParty } =
    useSelector((state) => state?.party);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [show, setShow] = useState(false);

  const [state, setState] = useState({
    name: "",
    address: "",
    mobile: "",
    description: "",
    accountType: "",
    partyId: "",
  });

  useEffect(() => {
    setState({
      name: party?.name,
      address: party?.address,
      mobile: party?.mobile,
      description: party?.description,
      accountType: party?.accountType,
      partyId: party?._id,
    });
  }, [party]);

  const add_party = (e) => {
    e.preventDefault();
    dispatch(partyAdd(state));
  };
  const update_party = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("address", state.address);
    formData.append("mobile", state.mobile);
    formData.append("accountType", state.accountType);
    formData.append("description", state.description);
    formData.append("partyId", party._id);
    dispatch(partyUpdate(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        address: "",
        mobile: "",
        description: "",
        accountType: "",
      });
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_parties(obj));
  }, [searchValue, currentPage, parPage]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Parties</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
        >
          {party ? "Update" : "Add"}
        </button>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      No
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Balance
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {parties?.map((d, i) => (
                    <tr key={i}>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        {i + 1}
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>{d.name}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>{d.balance}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <div className="flex justify-start items-center gap-4">
                          <Link
                            onClick={(e) => dispatch(get_party(d._id))}
                            className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalParty <= parPage ? (
              ""
            ) : (
              <div className="w-full flex justify-end mt-4 bottom-4 right-4">
                <Pagination
                  pageNumber={currentPage}
                  setPageNumber={setCurrentPage}
                  totalItem={totalParty}
                  parPage={parPage}
                  showItem={4}
                />
              </div>
            )}
          </div>
        </div>
        <div
          className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
            show ? "right-0" : "-right-[340px]"
          } z-[9999] top-0 transition-all duration-500`}
        >
          <div className="w-full pl-5">
            {party ? (
              <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-[#d0d2d6] font-semibold text-xl">
                    Update Party
                  </h1>
                  <div
                    onClick={() => setShow(false)}
                    className="block lg:hidden cursor-pointer"
                  >
                    <GrClose className="text-[#d0d2d6]" />
                  </div>
                </div>
                <form onSubmit={update_party}>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="name"
                      name="name"
                      placeholder={party?.name}
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Address</label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({ ...state, address: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Party Address"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Mobile</label>
                    <input
                      value={state.mobile}
                      onChange={(e) =>
                        setState({ ...state, mobile: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="mobile"
                      name="mobile"
                      placeholder="Party Mobile"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Account Type</label>
                    <select
                      value={state.accountType}
                      onChange={(e) =>
                        setState({ ...state, accountType: e.target.value })
                      }
                      name=""
                      id=""
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    >
                      <option value="Account_Payable">Account Payable</option>
                      <option value="Account_Receivable">
                        Account Receivable
                      </option>
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
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Description</label>
                    <input
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Party Description"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      disabled={loader ? true : false}
                      className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                    >
                      {loader ? (
                        <PropagateLoader
                          color="#fff"
                          cssOverride={overrideStyle}
                        />
                      ) : (
                        "Update Party"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                <div className="flex justify-between items-center mb-4">
                  <h1 className="text-[#d0d2d6] font-semibold text-xl">
                    Add Party
                  </h1>
                  <div
                    onClick={() => setShow(false)}
                    className="block lg:hidden cursor-pointer"
                  >
                    <GrClose className="text-[#d0d2d6]" />
                  </div>
                </div>
                <form onSubmit={add_party}>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                      value={state.name}
                      onChange={(e) =>
                        setState({ ...state, name: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="name"
                      name="name"
                      placeholder="Party Name"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Address</label>
                    <input
                      value={state.address}
                      onChange={(e) =>
                        setState({ ...state, address: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="address"
                      name="address"
                      placeholder="Party Address"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Mobile</label>
                    <input
                      value={state.mobile}
                      onChange={(e) =>
                        setState({ ...state, mobile: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="mobile"
                      name="mobile"
                      placeholder="Party Mobile"
                      required
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Account Type</label>
                    <select
                      value={state.accountType}
                      onChange={(e) =>
                        setState({ ...state, accountType: e.target.value })
                      }
                      name=""
                      id=""
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    >
                      <option value="Account_Payable">Account Payable</option>
                      <option value="Account_Receivable">
                        Account Receivable
                      </option>
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
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="name">Description</label>
                    <input
                      value={state.description}
                      onChange={(e) =>
                        setState({ ...state, description: e.target.value })
                      }
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      id="description"
                      name="description"
                      placeholder="Party Description"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      disabled={loader ? true : false}
                      className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                    >
                      {loader ? (
                        <PropagateLoader
                          color="#fff"
                          cssOverride={overrideStyle}
                        />
                      ) : (
                        "Add Party"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Party;
