import React, { useEffect, useState } from "react";
import { BsImages } from "react-icons/bs";
import { FaEdit } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { FadeLoader } from "react-spinners";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { overrideStyle } from "../../utils/utils";
import { BiSolidLabel } from "react-icons/bi";
import {
  profile_image_upload,
  messageClear,
  profile_info_add,
  change_password,
} from "../../store/reducers/authReducer";
const Profile = () => {
  const [view, setView] = useState(false);
  const [state, setState] = useState({
    companyName: "",
    name: "",
    mobile: "",
    address: "",
    description: "",
    email: "",
    division: "",
    district: "",
    sub_district: "",
    police_station: "",
    post_code: "",
    old_password: "",
    password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    setState({
      companyName: userInfo?.companyId?.name,
      name: userInfo?.companyId?.name,
      mobile: userInfo?.companyId?.mobile,
      address: userInfo?.companyId?.address,
      description: userInfo?.companyId?.description,
      email: userInfo?.companyId?.email,
      division: userInfo?.companyId?.division,
      district: userInfo?.companyId?.district,
      sub_district: userInfo?.companyId?.sub_district,
      police_station: userInfo?.companyId?.police_station,
      post_code: userInfo?.companyId?.post_code,
    });
  }, [userInfo]);
  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      dispatch(profile_image_upload(formData));
    }
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setTimeout(() => {
        window.location.reload()
      }, 3000);
    }
  }, [errorMessage, successMessage]);

  const add = (e) => {
    e.preventDefault();
    dispatch(profile_info_add(state));
    setView(false)
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const submit = (e) => {
    e.preventDefault();
    if (state.password !== state.confirm_password) {
      toast.error("New password doesn't match with confirm password"); // alert when password doesn't match
    } else {
      dispatch(change_password(state));
      // alert when password  match
      setState({
        old_password: "",
        password: "",
        confirm_password: "",
      });
    }
  };
  return (
    <div className="px-2 lg:px-7 py-5">
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-6/12">
          <div className="w-full p-4  bg-[#283046] rounded-md text-[#d0d2d6]">
            <div className="flex justify-center items-center py-3">
              {userInfo?.image ? (
                <label
                  htmlFor="img"
                  className="h-[210px] w-[300px] relative p-3 cursor-pointer overflow-hidden"
                >
                  <img className="w-full h-full" src={userInfo.image} alt="" />
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              ) : (
                <label
                  className="flex justify-center items-center flex-col h-[210px] w-[300px] cursor-pointer border border-dashed hover:border-indigo-500 border-[#d0d2d6] relative"
                  htmlFor="img"
                >
                  <span>
                    <BsImages />
                  </span>
                  <span>Select Image</span>
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              )}
              <input
                onChange={add_image}
                type="file"
                className="hidden"
                id="img"
              />
            </div>
            <div className="px-0 md:px-5 py-2">
              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                <span className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer">
                  <FaEdit />
                </span>
                <div className="flex gap-2">
                  <span>Name : </span>
                  <span>{userInfo.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>Email : </span>
                  <span>{userInfo.email}</span>
                </div>
                <div className="flex gap-2">
                  <span>Role : </span>
                  <span>{userInfo.role}</span>
                </div>
                <div className="flex gap-2">
                  <span>Status : </span>
                  <span>{userInfo.status}</span>
                </div>
              </div>
            </div>
            <div className="px-0 md:px-5 py-2">
              {view ? (
                <form onSubmit={add}>
                  <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                    <label htmlFor="Shop">Its Ok ?</label>
                    <span
                      onClick={(e) => setView(!view)}
                      className="p-[6px] bg-green-500 item-center rounded hover:shadow-lg hover:shadow-green-500/50 absolute right-2 top-2 cursor-pointer"
                    >
                      <BiSolidLabel />
                    </span>
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="Shop">Company Name</label>
                    <input
                      value={state.companyName}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f1f3f7] border border-slate-700 rounded-md text-[#03050a]"
                      type="text"
                      placeholder="Company name"
                      name="companyName"
                      id="companyName"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="div">Mobile</label>
                    <input
                      value={state.mobile}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f1f3f7] border border-slate-700 rounded-md text-[#03050a]"
                      type="text"
                      placeholder="mobile"
                      name="mobile"
                      id="div"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="div">Email</label>
                    <input
                      value={state.email}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f1f3f7] border border-slate-700 rounded-md text-[#03050a]"
                      type="text"
                      placeholder="email"
                      name="email"
                      id="div"
                      readOnly
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="div">Address</label>
                    <input
                      value={state.address}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="address"
                      name="address"
                      id="address"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="div">Description</label>
                    <input
                      value={state.description}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="Description"
                      name="description"
                      id="div"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1">
                    <label htmlFor="div">Division</label>
                    <input
                      value={state.division}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="Division"
                      name="division"
                      id="div"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="district">District</label>
                    <input
                      value={state.district}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="District"
                      name="district"
                      id="district"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="sub">Sub District</label>
                    <input
                      value={state.sub_district}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="Sub District"
                      name="sub_district"
                      id="sub"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="district">Police Station</label>
                    <input
                      value={state.police_station}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="Police Station"
                      name="police_station"
                      id="police_station"
                    />
                  </div>
                  <div className="flex flex-col w-full gap-1 mb-3">
                    <label htmlFor="district">Post Code</label>
                    <input
                      value={state.post_code}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      placeholder="Post Code"
                      name="post_code"
                      id="post_code"
                    />
                  </div>
                  <button
                    disabled={loader ? true : false}
                    className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                  >
                    {loader ? (
                      <PropagateLoader
                        color="#fff"
                        cssOverride={overrideStyle}
                      />
                    ) : (
                      "Update Info"
                    )}
                  </button>
                </form>
              ) : (
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                  <span
                    onClick={(e) => setView(!view)}
                    className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"
                  >
                    <FaEdit />
                  </span>
                  <div className="flex gap-2">
                    <span>Company Name : </span>
                    <span>{userInfo.companyId?.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Address : </span>
                    <span>{userInfo.companyId?.address}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Mobile : </span>
                    <span>{userInfo.companyId?.mobile}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Email : </span>
                    <span>{userInfo.companyId?.email}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Description : </span>
                    <span>{userInfo.companyId?.description}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Division : </span>
                    <span>{userInfo.companyId?.division}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>District : </span>
                    <span>{userInfo.companyId?.district}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Sub District : </span>
                    <span>{userInfo.companyId?.sub_district}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Police Station : </span>
                    <span>{userInfo.companyId?.police_station}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Post Code : </span>
                    <span>{userInfo.companyId?.post_code}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="w-full md:w-6/12">
          <div className="w-full pl-0 md:pl-7 mt-6 md:mt-0  ">
            <div className="bg-[#283046] rounded-md text-[#d0d2d6] p-4">
              <h1 className="text-[#d0d2d6] text-lg mb-3 font-semibold">
                Change Password
              </h1>
              <form onSubmit={submit}>
                <div className="flex flex-col w-full gap-1 mb-5">
                  <label htmlFor="o_password">Old Password</label>
                  <input
                    onChange={inputHandle}
                    value={state.old_password}
                    className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                    type="password"
                    placeholder="Old password"
                    name="old_password"
                    id="old_password"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-5">
                  <label htmlFor="password">New Password</label>
                  <input
                    onChange={inputHandle}
                    value={state.password}
                    className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                    type="password"
                    name="password"
                    placeholder="New Password"
                    id="password"
                    required
                  />
                </div>
                <div className="flex flex-col w-full gap-1 mb-5">
                  <label htmlFor="password">Confirm Password</label>
                  <input
                    onChange={inputHandle}
                    value={state.confirm_password}
                    className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                    type="password"
                    name="confirm_password"
                    placeholder="Confirm Password"
                    id="confirm_password"
                    required
                  />
                </div>
                <button className="bg-yellow-500 hover:shadow-yellow-500/50 hover:shadow-lg text-white rounded-md px-7 py-2 mt-5 ">
                  Changed ?
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
