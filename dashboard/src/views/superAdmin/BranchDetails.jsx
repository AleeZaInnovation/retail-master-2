import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils.js";
import {
  branchUpdate,
  get_a_branch,
  get_branch,
  get_company,
  messageClear,
  set_status,
} from "../../store/reducers/companyReducer.js";
const BranchDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loader, successMessage, errorMessage, companies, branch } =
    useSelector((state) => state?.company);
  const { branchId } = useParams();
  const [companyShow, setCompanyShow] = useState(false);
  const [company, setCompany] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [allCompany, setAllCompany] = useState([]);
  const [searchValue, setSearchValue] = useState("");
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
  const [state, setState] = useState({
    name: branch?.name || "",
    email: branch?.email || "",
    address: branch?.address || "",
    mobile: branch?.mobile || "",
    description: branch?.description || "",
    id: branch?._id|| "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(get_a_branch(branchId));
  }, [branchId]);

  const update_branch = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("email", state.email);
    formData.append("mobile", state.mobile);
    formData.append("address", state.address);
    formData.append("description", state.description);
    formData.append("company", company);
    formData.append("id", branch._id);
    dispatch(branchUpdate(formData));
    setTimeout(() => {
      navigate("/super-admin/dashboard/branches");
      dispatch(get_branch());
    }, 5000);
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      dispatch(get_a_branch(branchId));
    }
  }, [successMessage, errorMessage]);
  return (
    <div>
      <div className="px-2 lg:px-7 pt-5">
        <div className="w-full p-4  bg-[#283046] rounded-md">
          <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
            <form onSubmit={update_branch}>
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="company">Company Name</label>
                <input
                  readOnly
                  onClick={() => setCompanyShow(!companyShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={companyName ? companyName : branch?.companyId?.name}
                  type="text"
                  placeholder="--Select Company--"
                  id=""
                  name=""
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
                    <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                  ) : (
                    "Update Branch"
                  )}
                </button>
              </div>
            </form>
          </div>
          <div>
            <div className="block gap-4 py-3">
              <label
                htmlFor=""
                className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]"
              >
                Status
              </label>
              <select
                className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 w-[170px] "
                onChange={(e) =>
                  dispatch(
                    set_status({
                      status: e.target.value,
                      branchId: branchId,
                    })
                  )
                }
                name=""
                required
                id=""
              >
                <option value="">{branch?.status}</option>
                <option value="Pending">Pending</option>
                <option value="Active">Active</option>
                <option value="Block">Block</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BranchDetails;
