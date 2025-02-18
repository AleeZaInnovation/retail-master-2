import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import {
  get_owner,
  owner_status_update,
  messageClear,
  owner_company,
} from "../../store/reducers/ownerReducer";
import seller from "../../assets/images/seller.png";
import {
  company_branch,
  get_branch,
  get_company,
} from "../../store/reducers/companyReducer";

const StaffDetails = () => {
  const { companies, branches } = useSelector((state) => state.company);
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

  const { owner, successMessage, errorMessage } = useSelector(
    (state) => state?.owner
  );
  const dispatch = useDispatch();
  const { ownerId } = useParams();
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
    dispatch(get_owner(ownerId));
    dispatch(get_company(obj));
  }, [ownerId]);
  const [status, setStatus] = useState("");

  const statusHandler = (e) => {
      dispatch(owner_status_update({
        status: e.target.value,
        ownerId: ownerId,
      }))
      window.location.reload()
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
            <div className="w-3/12 flex justify-center items-center py-3">
              <div>
                {owner?.image ? (
                  <img className="w-full h-[230px]" src={owner.image} alt="" />
                ) : (
                  <span>Image not uploaded</span>
                )}
              </div>
            </div>
            <div className="w-4/12">
              <div className="px-0 md:px-5 py-2">
                <div className="py-2 text-lg">
                  <h2>Basic Info</h2>
                </div>
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                  <div className="flex gap-2">
                    <span>Name : </span>
                    <span>{owner?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Email : </span>
                    <span>{owner?.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Role : </span>
                    <span>{owner?.role}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-4/12">
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
                          className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                          
                          value={
                             owner?.companyId?.name ? owner?.companyId?.name: ''
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
                                    owner_company({
                                      companyId: c._id,
                                      ownerId: ownerId,
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
                    <select
                      onChange={statusHandler}
                      className="p-1 border outline-0 text-slate-600 font-semibold"
                      name=""
                      id=""
                    >
                      <option
                        className="capitalize"
                        value={owner.status ? owner.status : ""}
                      >
                        {owner.status}
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
      {owner?.companyId?._id ? (
        <div className="px-2 lg:px-7 pt-5">
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <div className="w-full flex flex-wrap text-[#d0d2d6]">
              <div className="w-3/12 flex justify-center items-center py-3">
                <div>
                  {owner?.companyId.image ? (
                    <img
                      className="w-full h-[230px]"
                      src={owner?.companyId.image}
                      alt=""
                    />
                  ) : (
                    <span>Image not uploaded</span>
                  )}
                </div>
              </div>
              <div className="w-4/12">
                <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>Company Info</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Name : </span>
                      <span>{owner?.companyId.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Email : </span>
                      <span>{owner?.companyId.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Mobile : </span>
                      <span>{owner?.companyId.mobile}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-4/12">
                <div className="px-0 md:px-5 py-2">
                  <div className="py-2 text-lg">
                    <h2>More Details</h2>
                  </div>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md">
                    <div className="flex gap-2">
                      <span>Address : </span>
                      <span>{owner?.companyId.address}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Description : </span>
                      <span>{owner?.companyId.description}</span>
                    </div>
                    <div className="flex gap-2">
                      <span>Status : </span>
                      <span>{owner?.companyId.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full py-10 flex flex-wrap text-[#d0d2d6] justify-center items-center align-center">
          <p>Please assigned a company</p>
        </div>
      )}
    </div>
  );
};

export default StaffDetails;
