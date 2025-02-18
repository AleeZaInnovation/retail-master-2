import React, { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  messageClear,
  reset_password,
} from "../../store/reducers/authReducer";
import { toast } from "react-hot-toast";
import logo from "../../assets/images/logo.png";
import { TiArrowBack } from "react-icons/ti";
const ForgotPassword = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { loader, errorMessage, successMessage } = useSelector(
    (state) => state?.auth
  );
  const [state, setState] = useState({
    password: "",
    confirm_password: "",
    token:""
  });

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  const submit = (e) => {
    e.preventDefault();
    if (state.password !== state.confirm_password) {
      toast.error("Passwords don't match");   // alert when password doesn't match
    } else {   
    dispatch(reset_password(state));
        // alert when password  match
    }
  };

  useEffect(() => {
  setState({
    token:params.token
  })
  }, [params])

  const overrideStyle = {
    display: "flex",
    margin: "0 auto",
    height: "24px",
    justifyContent: "center",
    alignItems: "center",
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate('/')
    }
  }, [errorMessage, successMessage]);
  return (
    <div className="min-w-screen min-h-screen bg-[#161d31] flex justify-center items-center">
      <div className="w-[350px] text-[#d0d2d6] p-2">
        <div className="bg-[#283046] p-4 rounded-md">
          <div className="h-[70px] flex justify-center items-center">
            <div className="w-[180pc] h-[50px]">
              <img className="w-full h-full" src={logo} alt="logo" />
            </div>
          </div>
          <form onSubmit={submit}>
            <div className="flex flex-col w-full gap-1 mb-5">
              <label htmlFor="password">Password</label>
              <input
                onChange={inputHandle}
                value={state.password}
                className="px-3 py-2 outline-none border border-slate-700 bg-transparent rounded-md text-[#d0d2d6] focus:border-indigo-500 overflow-hidden"
                type="password"
                name="password"
                placeholder="Password"
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
            <button
              disabled={loader ? true : false}
              className="bg-blue-500 w-full hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-md px-2 py-2 mb-3"
            >
              {loader ? (
                <PropagateLoader color="#fff" cssOverride={overrideStyle} />
              ) : (
                "Password Reset"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
