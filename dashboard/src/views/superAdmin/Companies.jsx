import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { BsImage } from "react-icons/bs";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import {
  companyAdd,
  company_branch,
  get_company,
  messageClear,
  set_status,
} from "../../store/reducers/companyReducer";
const Companies = () => {
  const dispatch = useDispatch();
  const {
    loader,
    successMessage,
    errorMessage,
    companies,
    totalCompany,
    companyBranch,
    totalCompanyBranch,
  } = useSelector((state) => state.company);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [aStatus, setAStatus] = useState("");
  const [show, setShow] = useState(false);
  const [imageShow, setImage] = useState("");
  const [state, setState] = useState({
    name: "",
    email: "",
    address: "",
    mobile: "",
    description: "",
    image: "",
  });

  const imageHandle = (e) => {
    let files = e.target.files;
    if (files.length > 0) {
      setImage(URL.createObjectURL(files[0]));
      setState({
        ...state,
        image: files[0],
      });
    }
  };
  const add_company = (e) => {
    e.preventDefault();
    dispatch(companyAdd(state));
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
        image: "",
      });
      setImage("");
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      status: aStatus,
    };
    dispatch(get_company(obj));
  }, [searchValue, currentPage, parPage, aStatus]);

  const branch = (companyId) => {
    dispatch(company_branch(companyId));
    setShowModal(true);
  };
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">Company</h1>
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
          <p>Companies</p>
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
              <table className="w-full text-sm text-center  text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      No
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Image
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Name
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
                  {companies.map((d, i) => (
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
                        <img
                          className="w-[45px] h-[45px]"
                          src={d.image}
                          alt=""
                        />
                      </td>
                      <td
                        scope="row"
                        className=" bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md text-center mb-3 py-2  px-4 font-medium"
                      >
                        <Link onClick={(e) => branch(d._id)}>{d.name}</Link>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <select
                          onChange={(e) =>
                            dispatch(
                              set_status({
                                status: e.target.value,
                                companyId: d._id,
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
                            to={`/super-admin/dashboard/company/details/${d._id}`}
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
                totalItem={totalCompany}
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
                  Add Company
                </h1>
                <div
                  onClick={() => setShow(false)}
                  className="block lg:hidden cursor-pointer"
                >
                  <GrClose className="text-[#d0d2d6]" />
                </div>
              </div>
              <form onSubmit={add_company}>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="name">Company Name</label>
                  <input
                    value={state.name}
                    onChange={(e) =>
                      setState({ ...state, name: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="name"
                    name="company_name"
                    placeholder="Company Name"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="email">Company Email</label>
                  <input
                    value={state.email}
                    onChange={(e) =>
                      setState({ ...state, email: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="email"
                    id="email"
                    name="company_email"
                    placeholder="Company email"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="address">Company Address</label>
                  <input
                    value={state.address}
                    onChange={(e) =>
                      setState({ ...state, address: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="address"
                    name="company_address"
                    placeholder="Company Address"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="mobile">Company Mobile</label>
                  <input
                    value={state.mobile}
                    onChange={(e) =>
                      setState({ ...state, mobile: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="mobile"
                    name="company_mobile"
                    placeholder="Company Mobile"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-3">
                  <label htmlFor="description">Company Description</label>
                  <textarea
                    value={state.description}
                    onChange={(e) =>
                      setState({ ...state, description: e.target.value })
                    }
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="text"
                    id="description"
                    name="company_description"
                    placeholder="Company Description"
                    required
                    cols="5"
                    rows="2"
                  ></textarea>
                </div>
                <div>
                  <label
                    className="flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]"
                    htmlFor="image"
                  >
                    {imageShow ? (
                      <img className="w-full h-full" src={imageShow} />
                    ) : (
                      <>
                        <span>
                          <BsImage />
                        </span>
                        <span>Select Image</span>
                      </>
                    )}
                  </label>
                </div>
                <input
                  onChange={imageHandle}
                  className="hidden"
                  type="file"
                  name="image"
                  id="image"
                  required
                />
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
                      "Add Company"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div>
        {showModal ? (
          <>
            <div className="justify-center items-center flex overflow-x-auto overflow-y-auto absolute inset-0 z-50 outline-none focus:outline-none">
              <div className="relative w-auto my-6 mx-auto max-w-3xl">
                <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">
                      {companyBranch[0]?.companyId?.name}
                    </h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>
                  <div className="text-xl flex justify-center items-center">
                    <p>Total Branch :</p>
                    <span>{totalCompanyBranch}</span>
                  </div>
                  <div className="relative p-6 flex">
                    <table className="w-full text-sm text-center  text-[#070707]">
                      <thead className="text-sm text-[#090a0a] uppercase border-b border-slate-700">
                        <tr>
                          <th scope="col" className="py-3 px-4">
                            No
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Branch Name
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Address
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Mobile
                          </th>
                          <th scope="col" className="py-3 px-4">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {companyBranch.map((d, i) => (
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
                              <p>{d.name}</p>
                            </td>
                            <td
                              scope="row"
                              className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                              <p>{d.address}</p>
                            </td>
                            <td
                              scope="row"
                              className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                              <p>{d.mobile}</p>
                            </td>
                            <td
                              scope="row"
                              className="py-1 px-4 font-medium whitespace-nowrap"
                            >
                              <p>{d.status}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Companies;
