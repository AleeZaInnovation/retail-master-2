import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import {
  branchAdd,
  get_branch,
  get_company,
  messageClear,
  set_branch_status,
} from "../../store/reducers/companyReducer";
const Branches = () => {
  const dispatch = useDispatch();
  const {
    loader,
    successMessage,
    errorMessage,
    companies,
    totalBranch,
    branches,
  } = useSelector((state) => state.company);
  const [companyShow, setCompanyShow] = useState(false);
  const [company, setCompany] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [allCompany, setAllCompany] = useState([]);
  const companySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCompany.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCompany(srcValue);
    } else {
      setAllCompany(companies);
    }
  };

  useEffect(() => {
    setAllCompany(companies);
  }, [companies]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [aStatus, setAStatus] = useState("");
  const [show, setShow] = useState(false);
  const [state, setState] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    description: "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const add_branch = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("email", state.email);
    formData.append("mobile", state.mobile);
    formData.append("address", state.address);
    formData.append("description", state.description);
    formData.append("company", company);
    dispatch(branchAdd(formData));
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
        email: "",
        address: "",
        mobile: "",
        description: "",
      });
      setCompany("");
      window.location.reload();
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      status: aStatus,
    };
    dispatch(get_branch(obj));
  }, [searchValue, currentPage, parPage, aStatus]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      status: aStatus,
    };
    dispatch(get_company(obj));
  }, [searchValue]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Branch</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="px-4 py-2 flex justify-between bg-sky-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#eff0f3]">
            <p>Branches</p>
            <select
              onChange={(e) => setAStatus(e.target.value)}
              className="px-4 py-2 bg-orange-300 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#070b13]"
            >
              <option value="">Status</option>
              <option value="Pending">Pending</option>
              <option value="Active">Active</option>
              <option value="Block">Block</option>
            </select>
          </div>
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <Search
              setParPage={setParPage}
              setAStatus={setAStatus}
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
                      Company Name
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Status
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((d, i) => (
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
                        <span>{d.companyId.name}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <select
                          onChange={(e) =>
                            dispatch(
                              set_branch_status({
                                status: e.target.value,
                                branchId: d._id,
                              })
                            )
                          }
                          className="p-1 border outline-0 text-slate-600 font-semibold"
                          name=""
                          id=""
                        >
                          <option
                            className="capitalize"
                            value={d.status ? d.status : ""}
                          >
                            {d.status}
                          </option>
                          <option value="Pending">Pending</option>
                          <option value="Active">Active</option>
                          <option value="Block">Block</option>
                        </select>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <div className="flex justify-start items-center gap-4">
                          <Link
                            to={`/super-admin/dashboard/branch/details/${d._id}`}
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
            <div className="w-full flex justify-end mt-4 bottom-4 right-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalBranch}
                parPage={parPage}
                showItem={4}
              />
            </div>
          </div>
        </div>
        <div
          className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
            show ? "right-0" : "-right-[340px]"
          } z-[9999] top-0 transition-all duration-500`}
        >
          <div className="w-full pl-5">
            <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#d0d2d6] font-semibold text-xl">
                  Add Branch
                </h1>
                <div
                  onClick={() => setShow(false)}
                  className="block lg:hidden cursor-pointer"
                >
                  <GrClose className="text-[#d0d2d6]" />
                </div>
              </div>
              <form onSubmit={add_branch}>
                <div className="flex flex-col w-full gap-1 relative">
                  <label htmlFor="company">Company Name</label>
                  <input
                    readOnly
                    onClick={() => setCompanyShow(!companyShow)}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    onChange={inputHandle}
                    value={companyName}
                    type="text"
                    placeholder="--Select Company--"
                    id="company"
                    name="company"
                  />
                  <div
                    className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                      companyShow ? "scale-100" : "scale-0"
                    }`}
                  >
                    <div className="w-full px-4 py-2 fixed">
                      <input
                        value={searchValue}
                        onChange={companySearch}
                        className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                        type="text"
                        placeholder="Search Company"
                      />
                    </div>
                    <div className="pt-14"></div>
                    <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                      {allCompany.map((c, i) => (
                        <span
                          className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                            company === c.name && "bg-indigo-500"
                          }`}
                          onClick={() => {
                            setCompanyShow(false);
                            setCompany(c._id);
                            setCompanyName(c.name);
                            setSearchValue("");
                            setAllCompany(companies);
                          }}
                        >
                          {c.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="name">Branch Name</label>
                  <input
                    value={state.name}
                    onChange={inputHandle}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Branch Name"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="email">Branch Email</label>
                  <input
                    value={state.email}
                    onChange={inputHandle}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Branch email"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="address">Branch Address</label>
                  <input
                    value={state.address}
                    onChange={inputHandle}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Branch Address"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="mobile">Branch Mobile</label>
                  <input
                    value={state.mobile}
                    onChange={inputHandle}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="mobile"
                    name="mobile"
                    placeholder="Branch Mobile"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="description">Branch Description</label>
                  <textarea
                    value={state.description}
                    onChange={inputHandle}
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="description"
                    name="description"
                    placeholder="Branch Description"
                    required
                    cols="5"
                    rows="2"
                  ></textarea>
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
                      "Add Branch"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Branches;
