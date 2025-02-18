import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  get_staff,
  staff_status_update,
  messageClear,
  staff_company,
  staff_branch,
} from "../../store/reducers/staffReducer";
import seller from "../../assets/images/seller.png";
import {
  company_branch,
  get_branch,
  get_company,
} from "../../store/reducers/companyReducer";

const OwnerDetails = () => {
  const { companies, companyBranch } = useSelector((state) => state.company);
  const [companyShow, setCompanyShow] = useState(false);
  const [branchShow, setBranchShow] = useState(false);
  const [company, setCompany] = useState("");
  const [branch, setBranch] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [branchName, setBranchName] = useState("");
  const [allCompany, setAllCompany] = useState([]);
  const [allBranch, setAllBranch] = useState([]);
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
    setAllCompany(companies);
  }, [companies]);

  useEffect(() => {
    setAllBranch(companyBranch);
  }, [companyBranch]);

  const { staff, successMessage, errorMessage } = useSelector(
    (state) => state?.staff
  );
  const dispatch = useDispatch();
  const { staffId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
      status: "",
    };
    dispatch(get_staff(staffId));
    dispatch(get_company(obj));
  }, [staffId]);
  const [status, setStatus] = useState("");
  const statusHandler = (e) => {
    dispatch(
      staff_status_update({
        status: e.target.value,
        staffId: staffId,
      })
    );
    window.location.reload();
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

  return (
    <div>
      <div className="px-2 lg:px-7 pt-5">
        <div className="w-full p-4  bg-[#283046] rounded-md">
          <div className="w-full flex flex-wrap text-[#d0d2d6]">
            <div className="w-full lg:w-3/12 flex justify-center items-center py-3">
              <div>
                {staff?.image ? (
                  <img className="w-full h-[230px]" src={staff.image} alt="" />
                ) : (
                  <span>Image not uploaded</span>
                )}
              </div>
            </div>
            <div className="w-full lg:w-4/12">
              <div className="px-0 md:px-5 py-2">
                <div className="py-2 text-lg">
                  <h2>Basic Info</h2>
                </div>
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                  <div className="flex gap-2">
                    <span>Name : </span>
                    <span>{staff?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Email : </span>
                    <span>{staff?.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Role : </span>
                    <span>{staff?.role}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-4/12">
              <div className="px-0 md:px-5 py-2">
                <div className="py-2 text-lg">
                  <h2>More Details</h2>
                </div>
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                  <div className="flex gap-2">
                    <span>Assign Company</span>
                    <span>
                      <div className="flex flex-col w-full gap-1 relative">
                        <input
                          readOnly
                          onClick={() => setCompanyShow(!companyShow)}
                          className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#e9eaef] border border-slate-700 rounded-md text-[#101010]"
                          value={
                            staff?.companyId?.name ? staff?.companyId?.name : companyName ? companyName : ''
                          }
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
                                  dispatch(
                                    staff_company({
                                      companyId: c._id,
                                      staffId: staffId,
                                    })
                                  );
                                  dispatch(company_branch(c._id));
                                }}
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span>Assign Branch</span>
                    <span>
                      <div className="flex flex-col w-full gap-1 relative">
                        <input
                          readOnly
                          onClick={() => setBranchShow(!branchShow)}
                          className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#e9eaef] border border-slate-700 rounded-md text-[#101010]"
                          value={
                            staff?.branchId?.name ? staff?.branchId?.name : ""
                          }
                          type="text"
                          placeholder="--Select Branch--"
                          id="branch"
                          name="branch"
                        />
                        <div
                          className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
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
                                  dispatch(
                                    staff_branch({
                                      branchId: c._id,
                                      staffId: staffId,
                                    })
                                  );
                                  window.location.reload();
                                }}
                              >
                                {c.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </span>
                  </div>
                  <div className="flex gap-2 justify-between">
                    <span>Status : </span>
                    <div className="flex flex-col gap-1 relative">
                      <select
                        onChange={statusHandler}
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#e9eaef] border border-slate-700 rounded-md text-[#101010]"
                        name=""
                        id=""
                      >
                        <option
                          className="capitalize"
                          value={staff.status ? staff.status : ""}
                        >
                          {staff.status}
                        </option>
                        <option value="Pending">Pending</option>
                        <option value="Active">Active</option>
                        <option value="Block">Block</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {staff?.companyId?._id ? (
        <div className="px-2 lg:px-7 pt-5">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <div className="w-full flex flex-wrap text-[#d0d2d6]">
              <div className="w-full lg:w-2/12 flex justify-center items-center py-3">
                <div>
                  {staff?.companyId.image ? (
                    <img
                      className="w-full h-[230px]"
                      src={staff?.companyId.image}
                      alt=""
                    />
                  ) : (
                    <span>Image not uploaded</span>
                  )}
                </div>
              </div>
              <div className="w-full lg:w-4/12">
                <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>Company Info</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Name : </span>
                      <span>{staff?.companyId.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Email : </span>
                      <span>{staff?.companyId.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Mobile : </span>
                      <span>{staff?.companyId.mobile}</span>
                    </div>
                  </div>
                </div>
                {
                  staff?.branchId?._id ? 
                  <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>Branch Info</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Name : </span>
                      <span>{staff?.branchId.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Email : </span>
                      <span>{staff?.branchId.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Mobile : </span>
                      <span>{staff?.branchId.mobile}</span>
                    </div>
                  </div>
                </div> :''
                }
              </div>
              <div className="w-full lg:w-4/12">
                <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>More Details</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Address : </span>
                      <span>{staff?.companyId.address}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Description : </span>
                      <span>{staff?.companyId.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Status : </span>
                      <span>{staff?.companyId.status}</span>
                    </div>
                  </div>
                </div>
                {
                  staff?.branchId?._id ? 
                  <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>Branch Details</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Address : </span>
                      <span>{staff?.branchId.address}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Description : </span>
                      <span>{staff?.branchId.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Status : </span>
                      <span>{staff?.branchId.status}</span>
                    </div>
                  </div>
                </div> :''
                }
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full py-10 flex flex-wrap text-[#d0d2d6] justify-center items-center align-center">
          <p>Please assigned a branch</p>
        </div>
      )}
    </div>
  );
};

export default OwnerDetails;
