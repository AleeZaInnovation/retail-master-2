import React from "react";
import { useNavigate } from "react-router-dom";
import error from "../assets/images/error.png";
const Pending = () => {
  const navigate = useNavigate();

  const redirect = () => {
    navigate("/");
  };
  return (
    <div className="w-screen h-screen flex justify-center items-center flex-col gap-4">
      <>
        <img src={error} alt="" />
        <button
          onClick={redirect}
          className="px-5 py-2 bg-green-500 rounded-sm text-white"
        >
          Contact with to Authority
        </button>
      </>
    </div>
  );
};

export default Pending;
