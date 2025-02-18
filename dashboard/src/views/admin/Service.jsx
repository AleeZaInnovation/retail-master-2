import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import { get_parties, partyNewAdd } from "../../store/reducers/partyReducer";
import { GrClose } from "react-icons/gr";
import { overrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import moment from "moment";
import {
  get_company_service,
  get_company_services,
  make_service,
  messageClear,
  update_service,
} from "../../store/reducers/serviceReducer";
import Pagination from "../Pagination";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FcPrint } from "react-icons/fc";
import { GrUpdate } from "react-icons/gr";
import { company_branch } from "../../store/reducers/companyReducer";
const Service = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state?.auth);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const { successMessage, errorMessage, myService, totalServices, services } =
    useSelector((state) => state.service);
  const [branchServices, setBranchServices] = useState(services);
  const { loader, parties, newParty, errorNewMessage, successNewMessage } =
    useSelector((state) => state.party);
  const [showModal, setShowModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [status, setStatus] = useState("");
  const [station, setStation] = useState("");
  const [show, setShow] = useState(false);
  const [serviceShow, setServiceShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  useEffect(() => {
    dispatch(
      get_company_services({
        parPage: parseInt(parPage),
        page: parseInt(currentPage),
        searchValue,
      })
    );
  }, [parPage, currentPage, searchValue]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const cancelHandler = () => {
    setShowModal(false);
    setUpdateModal(false);
  };
  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setDescription("");
      setServiceProduct("");
      setPartyName("");
      setUpdateModal(false);
      setShowModal(true);
      dispatch(
        get_company_services({
          parPage: parseInt(parPage),
          page: parseInt(currentPage),
          searchValue,
        })
      );
    }
  }, [successMessage, errorMessage]);

  const [description, setDescription] = useState("");
  const [serviceProduct, setServiceProduct] = useState("");
  const [partyShow, setPartyShow] = useState(false);
  const [party, setParty] = useState("");
  const [partyName, setPartyName] = useState("");
  const [allParty, setAllParties] = useState([]);
  const [partySearchValue, setPartySearchValue] = useState("");
  const partySearch = (e) => {
    const value = e.target.value;
    setPartySearchValue(value);
    if (value) {
      let srcValue = allParty.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllParties(srcValue);
    } else {
      setAllParties(parties);
    }
  };
  useEffect(() => {
    setAllParties(parties);
    dispatch(company_branch(_id));
  }, [parties]);
  useEffect(() => {
    const obj = {
      searchValue: partySearchValue,
      parPage: "",
      page: "",
    };
    dispatch(get_parties(obj));
    setStatus(myService.status);
    setStation(myService.station);
  }, [myService]);

  // Submit form function

  const serviceHandler = ({ serviceProduct, description, party, branch }) => {
    if (!serviceProduct || !description || !party || !branch) {
      toast.error("Please fill in all inputs");
    } else {
      dispatch(make_service({ serviceProduct, description, party, branch }));
    }
  };

  const [state, setState] = useState({
    name: "",
    address: "",
    mobile: "",
    description: "",
    accountType: "",
  });
  const add_party = (e) => {
    e.preventDefault();
    dispatch(partyNewAdd(state));
    setShow(false);
  };

  useEffect(() => {
    if (errorNewMessage) {
      toast.error(errorNewMessage);
      dispatch(messageClear());
    }
    if (successNewMessage) {
      toast.success(successNewMessage);
      dispatch(messageClear());
      setParty(newParty._id);
      setPartyName(newParty.name);
      const obj = {
        searchValue: partySearchValue,
        parPage: "",
        page: "",
      };
      dispatch(get_parties(obj));
      setState({
        name: "",
        address: "",
        mobile: "",
        description: "",
        accountType: "",
      });
      setShow(false);
    }
  }, [successNewMessage, errorNewMessage]);

  const servicePrint = (serviceId) => {
    dispatch(get_company_service(serviceId));
    setShowModal(true);
  };

  const updateService = (serviceId) => {
    dispatch(get_company_service(serviceId));
    setUpdateModal(true);
  };
  const updateHandler = ({ serviceId, status, station }) => {
    if (!status || !station) {
      toast.error("Please select status and station");
    } else {
      dispatch(
        update_service({
          serviceId,
          status,
          station,
        })
      );
    }
  };

  const [branchShow, setBranchShow] = useState(false);
  const [branch, setBranch] = useState("");
  const [branchName, setBranchName] = useState("");
  const [allBranch, setAllBranch] = useState([]);
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
    setAllBranch(companyBranch);
    setBranchServices(services);
  }, [companyBranch, services]);

  const handleBranchChange = (value) => {
    const nservices = [];
    services.forEach((service) => {
      if (service.branchId === value) {
        nservices.push(service);
      }
    });
    setBranchServices(nservices);
  };
  return (
    <div className="px-2 lg:px-7 ">
      <div className="w-full p-4  bg-[rgb(40,48,70)] rounded-md">
        <section className="w-full p-4  bg-[#8a5ef1] rounded-md mb-4">
          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#0f0f0f]">
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="serviceProduct">Products Details</label>
              <textarea
                rows={1}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                onChange={(e) => setServiceProduct(e.target.value)}
                value={serviceProduct}
                placeholder="Products Details "
                name="serviceProduct"
                id="serviceProduct"
              ></textarea>
            </div>
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="description">Problem Explain</label>
              <textarea
                rows={1}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Problem Explain "
                name="description"
                id="description"
              ></textarea>
            </div>
            <div className="flex flex-col w-full  gap-1 relative">
              <div className="flex justify-between gap-1 relative">
                <label htmlFor="party">Service For</label>

                <button
                  onClick={(e) => setShow(!show)}
                  className="px-5 py-[3px] bg-red-500 text-white"
                >
                  New Party?
                </button>
              </div>
              <input
                readOnly
                onClick={() => setPartyShow(!partyShow)}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                value={partyName}
                type="text"
                placeholder="--Select Party--"
                id="party"
                name="party"
                required
              />
              <div
                className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                  partyShow ? "scale-100" : "scale-0"
                }`}
              >
                <div className="w-full px-4 py-2 fixed">
                  <input
                    value={partySearchValue}
                    onChange={partySearch}
                    className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                    type="text"
                    placeholder="Search Party"
                    required
                  />
                </div>
                <div className="pt-14"></div>
                <div className="flex justify-start text-[#f8f8f9] items-start flex-col h-[200px] overflow-x-scroll">
                  {allParty.map((c, i) => (
                    <span
                      className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                        party === c.name && "bg-indigo-500"
                      }`}
                      onClick={() => {
                        setPartyShow(false);
                        setParty(c._id);
                        setPartyName(c.name);
                        setPartySearchValue("");
                        setAllParties(parties);
                      }}
                    >
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-end items-end  gap-4 w-full text-[#0f0f0f]">
            <button
              onClick={(e) =>
                serviceHandler({
                  serviceProduct,
                  description,
                  party,
                  branch,
                })
              }
              className="bg-green-500  flex justify-center items-center  text-white font-bold py-2 px-8  rounded hover:bg-green-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-green-400"
            >
              Submit
            </button>
          </div>
        </section>
        <section className="w-full p-4  bg-[rgb(40,48,70)] rounded-md mb-4">
          <div className="flex justify-between items-center">
            <select
              onChange={(e) => setParPage(parseInt(e.target.value))}
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
            >
              <option value="5">5</option>
              <option value="5">15</option>
              <option value="5">25</option>
            </select>
            <input
              className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
              type="text"
              placeholder="Search"
            />
          </div>
          <div className="relative mt-5 overflow-x-auto">
            <div className="flex flex-col w-full gap-1 relative">
              <h3 className="text-[#d0d2d6] text-xl font-semibold">Branch</h3>
              <div className="h-10 w-[200px]">
                <input
                  readOnly
                  onClick={() => setBranchShow(!branchShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f7f7f9] border border-slate-700 rounded-md text-[#131415]"
                  value={branchName}
                  type="text"
                  placeholder="--Select Branch--"
                  id="branch"
                  name="branch"
                />
                <div
                  className={`absolute top-[101%] bg-slate-200 w-[210px] transition-all ${
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
                          handleBranchChange(c._id);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full text-sm text-left [#d0d2d6]">
              <div className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                <div className="flex justify-between items-start">
                  <div className="py-3 w-[15%]">Date</div>
                  <div className="py-3 w-[40%]">Service For</div>
                  <div className="py-3 w-[35%]">Status</div>
                  <div className="py-3 w-[10%]">
                    <MdKeyboardArrowDown />
                  </div>
                </div>
              </div>
              {branchServices.map((o, i) => (
                <div className="text-[#d0d2d6]">
                  <div className="flex justify-between items-start border-b border-slate-700">
                    <div className="py-4 w-[15%] font-medium whitespace-nowrap">
                      {moment(o.date).format("ll")}
                    </div>
                    <div className="py-4 flex  w-[40%]">{o.party?.name}</div>
                    <div className="py-4 flex  w-[35%]">{o.status}</div>

                    <div className="py-4 w-[10%] flex justify-start items-center gap-4">
                      <Link
                        onClick={(e) => updateService(o._id)}
                        className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <GrUpdate />
                      </Link>
                      <Link
                        onClick={(e) => servicePrint(o._id)}
                        className="p-[6px] bg-red-500 rounded hover:shadow-lg hover:shadow-red-500/50"
                        placeholder="Print"
                      >
                        <FcPrint />
                      </Link>
                    </div>
                    <div
                      onClick={(e) => setServiceShow(o._id)}
                      className="py-4 cursor-pointer w-[5%]"
                    >
                      <MdKeyboardArrowDown />
                    </div>
                  </div>
                  <div
                    className={
                      serviceShow === o._id
                        ? "block border-b border-slate-700 bg-slate-800"
                        : "hidden"
                    }
                  >
                    <div className="flex justify-start items-start border-b border-slate-700">
                      <div className="py-4 w-[18%]">
                        {" "}
                        Service No: {o.serviceNo}{" "}
                      </div>
                      <div className="py-4 w-[30%]">
                        Product : {o.product.slice(0, 32)}
                      </div>
                      <div className="py-4 w-[30%]">
                        Problem : {o.problem.slice(0, 32)}
                      </div>
                      <div className="py-4 w-[18%]"> Station: {o.station} </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {totalServices <= parPage ? (
            ""
          ) : (
            <div className="w-full flex justify-end mt-4 bottom-4 right-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalServices}
                parPage={parPage}
                showItem={4}
              />
            </div>
          )}
        </section>
      </div>
      <>
        {showModal && (
          <Modal
            width={400}
            pagination={false}
            title="Service Details"
            visible={showModal}
            onCancel={() => {
              cancelHandler();
            }}
            footer={false}
          >
            {/* ============ invoice modal start ==============  */}
            {/* ============ invoice modal start ==============  */}
            <div id="invoice-POS" ref={componentRef}>
              <center id="top">
                <div className="info">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${userInfo.companyId.image})`,
                    }}
                  ></div>
                  <h2>{userInfo.companyId.name}</h2>
                  <p>
                    {" "}
                    Address : {userInfo.companyId.address} <br /> Mobile :
                    {userInfo.companyId.mobile} <br /> Email :
                    {userInfo.companyId.email}{" "}
                  </p>
                </div>
                {/*End Info*/}
              </center>
              {/*End InvoiceTop*/}
              <div id="mid">
                <div className="mt-2">
                  <p className="flex justify-between items-center">
                    <span>
                      {" "}
                      <b> {moment(myService?.date).format("ll")}</b>
                    </span>
                    <span>
                      {" "}
                      Service For: <b>{myService?.party?.name}</b>{" "}
                    </span>
                  </p>
                  <p className="flex justify-between items-center mt-2">
                    <span>
                      {" "}
                      <b>{myService?.serviceNo}</b>
                    </span>
                    <span>
                      {" "}
                      Generated: <b>{myService?.generatedBy}</b>{" "}
                    </span>
                  </p>
                  <hr style={{ margin: "5px" }} />
                </div>
              </div>
              {/*End Invoice Mid*/}
              <div id="bot">
                <div id="table">
                  <table>
                    <tbody>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Products Details</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.product}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Problem Explain</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.problem}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Present Situation</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.station}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Service Status</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.status}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Update Date</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.updateDate}
                            <br />
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*End Table*/}
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your patience!</strong> Come again.
                    <b> Developed by AleeZaInnovation </b>
                  </p>
                </div>
              </div>
              {/*End InvoiceBot*/}
            </div>
            {/*End Invoice*/}
            <div className="flex justify-end mt-3">
              <Button
                className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
            {/* ============ invoice modal ends ==============  */}
          </Modal>
        )}
        {show && (
          <Modal
            width={400}
            pagination={false}
            title="Add Party"
            visible={show}
            onCancel={() => setShow(false)}
            footer={false}
          >
            {/* ============ invoice modal start ==============  */}
            {/* ============ invoice modal start ==============  */}
            <div>
              {/*End InvoiceTop*/}

              {/*End Invoice Mid*/}
              <div id="bot">
                {/*End Table*/}
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
                        required
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      >
                        <option value="">Select Account Type</option>
                        <option value="Account_Receivable">
                          Account Receivable
                        </option>
                        <option value="Account_Payable">Account Payable</option>
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
                        <option value="Purchase_Account">
                          Purchase Account
                        </option>
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
              </div>
              {/*End InvoiceBot*/}
            </div>
            {/*End Invoice*/}
            {/* ============ invoice modal ends ==============  */}
          </Modal>
        )}
        {updateModal && (
          <Modal
            width={400}
            pagination={false}
            title="Service Details"
            visible={updateModal}
            onCancel={() => {
              cancelHandler();
            }}
            footer={false}
          >
            {/* ============ invoice modal start ==============  */}
            {/* ============ invoice modal start ==============  */}
            <div id="invoice-POS" ref={componentRef}>
              <center id="top">
                <div className="info">
                  <div
                    className="logo"
                    style={{
                      backgroundImage: `url(${userInfo.companyId.image})`,
                    }}
                  ></div>
                  <h2>{userInfo.companyId.name}</h2>
                  <p>
                    {" "}
                    Address : {userInfo.companyId.address} <br /> Mobile :
                    {userInfo.companyId.mobile} <br /> Email :
                    {userInfo.companyId.email}{" "}
                  </p>
                </div>
                {/*End Info*/}
              </center>
              {/*End InvoiceTop*/}
              <div id="mid">
                <div className="mt-2">
                  <p className="flex justify-between items-center">
                    <span>
                      {" "}
                      <b> {moment(myService?.date).format("ll")}</b>
                    </span>
                    <span>
                      {" "}
                      Service For: <b>{myService?.party?.name}</b>{" "}
                    </span>
                  </p>
                  <p className="flex justify-between items-center mt-2">
                    <span>
                      {" "}
                      <b>{myService?.serviceNo}</b>
                    </span>
                    <span>
                      {" "}
                      Generated: <b>{myService?.generatedBy}</b>{" "}
                    </span>
                  </p>
                  <hr style={{ margin: "5px" }} />
                </div>
              </div>
              {/*End Invoice Mid*/}
              <div id="bot">
                <div id="table">
                  <table>
                    <tbody>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Products Details</b>
                          </p>
                        </td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.product}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Problem Explain</b>
                          </p>
                        </td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem">
                          <p className="itemtext">
                            {myService?.problem}
                            <br />
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Present Situation</b>
                          </p>
                        </td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem">
                          <input
                            className="text-center"
                            type="text"
                            value={station}
                            onChange={(e) => setStation(e.target.value)}
                          />
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <p>
                            <b>Service Status</b>
                          </p>
                        </td>
                      </tr>

                      <tr className="service">
                        <td className="tableitem">
                          <select
                            name=""
                            id=""
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="Company House">Company House</option>
                            <option value="Work go on">Work go on</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td className="item table-header">
                          <button
                            className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                            onClick={(e) =>
                              updateHandler({
                                serviceId: myService._id,
                                status: status,
                                station: station,
                              })
                            }
                          >
                            Updated
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*End Table*/}
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your patience!</strong> Come again.
                    <b> Developed by AleeZaInnovation </b>
                  </p>
                </div>
              </div>
              {/*End InvoiceBot*/}
            </div>
            {/*End Invoice*/}
            <div className="flex justify-end mt-3">
              <Button
                className="px-5 py-[6px] rounded-sm hover:shadow-blue-500/20 hover:shadow-lg bg-blue-500 text-sm text-white uppercase"
                onClick={handlePrint}
              >
                Print
              </Button>
            </div>
            {/* ============ invoice modal ends ==============  */}
          </Modal>
        )}
      </>
    </div>
  );
};

export default Service;
