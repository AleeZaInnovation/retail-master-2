import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import seller from "../../assets/images/seller.png";
import { BsImage } from "react-icons/bs";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import {
  companyUpdate,
  get_a_company,
  get_company,
  messageClear,
  set_status,
} from "../../store/reducers/companyReducer.js";
const CompanyDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { company, successMessage, loader, errorMessage } = useSelector(
    (state) => state?.company
  );
  const [state, setState] = useState({
    name: company.name || "",
    email: company.email || "",
    address: company.address || "",
    mobile: company.mobile || "",
    description: company.description || "",
    id: company._id || "",
    image: company.image || "",
  });
  const { companyId } = useParams();
  const [imageShow, setImage] = useState(state?.image);

  useEffect(() => {
    dispatch(get_a_company(companyId));
  }, [companyId]);
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
  const update_company = (e) => {
    e.preventDefault();
    dispatch(companyUpdate(state));
    setTimeout(() => {
      navigate("/super-admin/dashboard/companies");
      dispatch(get_company())
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
      dispatch(get_a_company(companyId));
    }
  }, [successMessage, errorMessage]);
  return (
    <div>
      <div className="px-2 lg:px-7 pt-5">
        <div className="w-full p-4  bg-[#283046] rounded-md">
          <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
            <form onSubmit={update_company}>
              <div className="flex flex-col w-full gap-1 mb-3">
                <label htmlFor="name">Company Name</label>
                <input
                  value={state.name}
                  onChange={(e) => setState({ ...state, name: e.target.value })}
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
                  {company.image ? (
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
              />
              <div className="mt-4 w-4/12">
                <button
                  disabled={loader ? true : false}
                  className="bg-blue-500 w-full hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                >
                  {loader ? (
                    <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                  ) : (
                    "Update Company"
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
                      companyId: companyId,
                    })
                  )
                }
                name=""
                required
                id=""
              >
                <option value="">{company?.status}</option>
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

export default CompanyDetails;
