import React, { useEffect, useRef, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "antd";
import Categories from "../components/Categories";
import { useDispatch, useSelector } from "react-redux";
import { get_product, get_products } from "../../store/reducers/productReducer";
import { get_categories } from "../../store/reducers/categoryReducer";
import toast from "react-hot-toast";
import Cart from "../components/Cart";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import { make_draft, messageClear } from "../../store/reducers/draftReducer";
import { place_order } from "../../store/reducers/orderReducer";
import {
  get_draft_party,
  get_payment_parties,
  partyNewAdd,
} from "../../store/reducers/partyReducer";
import { cartActions } from "../../store/reducers/cartReducer";
import { GrClose } from "react-icons/gr";
import { overrideStyle } from "../../utils/utils";
import { PropagateLoader } from "react-spinners";
import { company_branch } from "../../store/reducers/companyReducer";
import moment from "moment";
const MakeOrder = () => {
  const componentRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, product, totalProduct } = useSelector(
    (state) => state?.product
  );
  const { userInfo } = useSelector((state) => state?.auth);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const { successMessage, errorMessage } = useSelector((state) => state.draft);
  const { myOrder } = useSelector((state) => state.order);
  const cartItems = useSelector((state) => state?.cart.cartItems);
  const totalAmount = useSelector((state) => state?.cart.totalAmount);
  const totalProfit = useSelector((state) => state?.cart.totalProfit);
  const totalQuantity = useSelector((state) => state?.cart.totalQuantity);
  const partyDraft = useSelector((state) => state?.cart.party);
  const date = useSelector((state) => state?.cart.date);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);
  const [due, setDue] = useState(totalAmount - discount);
  const [payment, setPayment] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(25);
  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
    const obj2 = {
      parPage: 25,
      page: 1,
      searchValue: "",
    };
    dispatch(get_categories(obj2));
    dispatch(get_draft_party(partyDraft));
  }, [searchValue, currentPage, parPage]);

  const draftHandler = (e) => {
    e.preventDefault();
    if (!party || !payment) {
      toast.error("Please select party and payment");
    } else {
      dispatch(
        make_draft({
          cartItems,
          totalAmount,
          totalQuantity,
          discount,
          payment,
          party,
          value,
          paid,
          due,
          branch,
        })
      );
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("totalProfit");
      localStorage.removeItem("totalQuantity");
      localStorage.removeItem("party");
      localStorage.removeItem("date");
    }
    // dispatch(cartActions.deleteCard())
  };

  const orderHandler = (e) => {
    e.preventDefault();
    if (!payment || !party || !branch) {
      toast.error("Please select party or payment or branch");
    } else {
      dispatch(
        place_order({
          cartItems,
          totalAmount,
          totalQuantity,
          discount,
          payment,
          party,
          value,
          paid,
          due,
          branch,
          description,
        })
      );
      setShowModal(true);
      localStorage.removeItem("cartItems");
      localStorage.removeItem("totalAmount");
      localStorage.removeItem("totalProfit");
      localStorage.removeItem("totalQuantity");
      localStorage.removeItem("party");
      localStorage.removeItem("date");
      // dispatch(cartActions.deleteCard())
    }
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const cancelHandler = () => {
    setShowModal(false);
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
      navigate("/admin/dashboard/drafts");
      window.location.reload();
    }
  }, [successMessage, errorMessage]);
  const {
    loader,
    parties,
    newParty,
    totalParty,
    draftParty,
    errorNewMessage,
    successNewMessage,
  } = useSelector((state) => state.party);
  const [description, setDescription] = useState(
    "Thanks for shopping from us!"
  );
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
  }, [parties]);
  useEffect(() => {
    const obj = {
      searchValue: partySearchValue,
      parPage: "",
      page: "",
    };
    dispatch(get_payment_parties(obj));
  }, []);

  const [value, setValue] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });
  const handleValueChange = (newValue) => {
    console.log("newValue:", newValue);
    setValue(newValue);
  };
  const [invShow, setInvShow] = useState(false);
  const [invent, setInventory] = useState("");
  const [invId, setInvId] = useState("");
  const [allInventory, setAllInventory] = useState([]);
  const [searchProductValue, setSearchProductValue] = useState("");
  const inventorySearch = (e) => {
    const value = e.target.value;
    setSearchProductValue(value);
    if (value) {
      let srcValue = allInventory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllInventory(srcValue);
    } else {
      setAllInventory(products);
    }
  };

  useEffect(() => {
    setAllInventory(products);
    setParty(partyDraft?._id);
    setPartyName(partyDraft?.name);
    setValue(date);
    dispatch(company_branch(_id));
  }, [products, partyDraft, date]);

  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState();
  const [amount, setAmount] = useState("");
  // const myArray = [{ serial: "" }];
  const [sn, setSn] = useState([]);
  const [serial, setSerial] = useState([]);
  useEffect(() => {
    setPrice(product?.price);
    const available = [];
    for (let j = 0; j < product?.serial?.length; j++) {
      const element = product.serial[j];
      available.push(element);
    }
    setSerial(available);
  }, [product]);

  const serialHandler = (e) => {
    const value = e.target.value;
    if (value === "") {
      toast.error("Please select serial");
    } else {
      setSn([...sn, value]);
      setSerial(serial.filter((item) => item !== value));
      setQuantity(sn.length + 1);
    }
  };
  // Submit form function

  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount((price * quantity).toFixed(2));
    };

    calculateAmount(amount);
  }, [amount, price, quantity, setAmount]);
  const cardHandler = (obj) => {
    if (!obj.name || !quantity || !obj.price) {
      toast.error("Please fill in all inputs");
    } else {
      dispatch(
        cartActions.addItem({
          id: obj.id,
          name: obj.name,
          price: obj.price,
          pp: obj?.pp,
          serial: obj.serial,
          unit: obj.unit,
          quantity: obj.quantity,
          amount: obj.amount,
          party: party,
          date: value.startDate,
        })
      );
      setSn([]);
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
      dispatch(get_payment_parties(obj));
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
  useEffect(() => {
    setDue(totalAmount - discount - paid);
  }, [setDue, totalAmount, discount, paid]);

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
  }, [companyBranch]);
  return (
    <div className="px-2 lg:px-7 ">
      <div className="w-full p-4  bg-[rgb(40,48,70)] rounded-md">
        <section className="w-full p-4  bg-[#8a5ef1] rounded-md mb-4">
          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#0f0f0f]">
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="price">Sale Date</label>
              <Datepicker
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
              />
            </div>
            <div className="flex flex-col w-full gap-1 relative">
              <label htmlFor="description">Sales Note</label>
              <textarea
                rows={1}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Sales Note "
                name="description"
                id="description"
              ></textarea>
            </div>
            <div className="flex flex-col w-full  gap-1 relative">
              <div className="flex justify-between gap-1 relative">
                <label htmlFor="party">Sales To</label>

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
        </section>
        <section className="bg-[rgb(40,48,70)]">
          <div className="my-4 mb-2">{/* <Categories /> */}</div>
          <div id="all_products" className="w-[85%] lg:w-[90%] mx-auto py-16">
            <p className="py-3 mb-3 text-white">Total Items {totalProduct}</p>
            <section className="w-full p-4  bg-[#eeeeee] rounded-md">
              <>
                <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#0f0f0f]">
                  <div className="flex flex-col w-full gap-1 relative">
                    <label htmlFor="inventory">Product</label>
                    <input
                      readOnly
                      onClick={() => setInvShow(!invShow)}
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      onChange={(e) => setInventory(e.target.value)}
                      value={invent}
                      type="text"
                      placeholder="--Select Product--"
                      id="product"
                    />
                    <div
                      className={`absolute top-[101%] bg-slate-800 w-full transition-all ${
                        invShow ? "scale-100" : "scale-0"
                      }`}
                    >
                      <div className="w-full px-4 py-2 fixed">
                        <input
                          value={searchProductValue}
                          onChange={inventorySearch}
                          className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                          type="text"
                          placeholder="Search"
                        />
                      </div>
                      <div className="pt-14"></div>
                      <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                        {allInventory.map((c, i) => (
                          <span
                            className={`px-4 py-2 text-[#d0d2d6] hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                              product === c.name && "bg-indigo-500"
                            }`}
                            onClick={() => {
                              setInvShow(false);
                              setInventory(c.name);
                              setInvId(c._id);
                              setSearchProductValue("");
                              setAllInventory(products);
                              dispatch(get_product(c._id));
                            }}
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col lg:w-[15%] gap-1">
                    <label htmlFor="price">Price</label>
                    <input
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="number"
                      placeholder="Price"
                      name="price"
                      id="price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col lg:w-[15%] gap-1">
                    <label htmlFor="quantity">Quantity</label>
                    <input
                      min="0"
                      className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      type="number"
                      placeholder="Quantity"
                      name="quantity"
                      id="quantity"
                    />
                  </div>

                  <div className="flex flex-col  gap-1">
                    <label htmlFor="amount">Unit</label>
                    <h5 className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]">
                      {product?.unit}
                    </h5>
                  </div>
                  <div className="flex flex-col  gap-1">
                    <label htmlFor="amount">Total</label>
                    <h5 className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]">
                      {amount}
                    </h5>
                  </div>
                  <button
                    onClick={(e) =>
                      cardHandler({
                        id: invId,
                        name: invent,
                        price: price,
                        pp: product?.purchase_price,
                        serial: sn,
                        unit: product?.unit,
                        quantity: Number(quantity),
                        amount: Number(amount),
                      })
                    }
                    className="bg-blue-500  flex justify-center items-center  text-white font-bold py-2 px-8 mt-7 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col  gap-1">
                    <label htmlFor="category">Serial Number</label>
                    <select
                      name=""
                      className="px-4 py-2 w-[200px] focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                      id=""
                      onChange={(e) => serialHandler(e)}
                    >
                      <option value="">Select Serial</option>
                      {serial?.map((i) => (
                        <option value={i}>{i}</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-[200px]">
                    <div className="flex flex-col w-full gap-1 relative">
                      <label htmlFor="category">Branch</label>
                      <input
                        readOnly
                        onClick={() => setBranchShow(!branchShow)}
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        value={branchName}
                        type="text"
                        placeholder="--Select Branch--"
                        id="branch"
                        name="branch"
                      />
                      <div
                        className={`absolute top-[101%] bg-slate-800 w-[210px] transition-all ${
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
                              className={`px-4 py-2 text-[#d0d2d6] hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${
                                product === c.name && "bg-indigo-500"
                              }`}
                              onClick={() => {
                                setBranchShow(false);
                                setBranch(c._id);
                                setBranchName(c.name);
                                setSearchValue("");
                                setAllBranch(companyBranch);
                              }}
                            >
                              {c.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {sn?.map((i) => (
                  <p>{i}</p>
                ))}
                {/* Table items */}
              </>
            </section>
          </div>
        </section>
        <section className="bg-[#eeeeee]">
          <div className="w-[85%] lg:w-[90%] mx-auto py-16">
            <div className="flex flex-wrap">
              <div className="lg:w-[67%] w-full">
                <div className="lg:pr-3 pr-0">
                  <div className="flex flex-col gap-3">
                    <div className="bg-white p-4">
                      <h2 className="text-md text-green-500 font-semibold">
                        Billing Items {cartItems.length}
                      </h2>
                    </div>
                    {cartItems.map((pt, i) => (
                      <Cart pt={pt} key={i} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:w-[33%] w-full">
                <div className="lg:pl-3 pl-0 mt-5">
                  <div className="bg-white p-3 text-slate-600 flex flex-col gap-3">
                    <h2 className="text-xl font-bold">Order Summary</h2>
                    <div className="flex justify-between items-center">
                      <span>Total Order : {totalQuantity} </span>
                      <span>Tk {totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-white p-2 bg-slate-500">
                      <span>Total Profit : </span>
                      <span>Tk {totalProfit.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Discount </span>
                      <span>
                        <input
                          onChange={(e) => setDiscount(e.target.value)}
                          value={discount}
                          className="px-3 py-2 h-15 w-[150px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                          type="number"
                          name="discount"
                          placeholder="Discount"
                          id="discount"
                          required
                        />
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Grand Total</span>
                      <span className="text-lg text-orange-500">
                        Tk {(totalAmount - discount).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Paid </span>
                      <span>
                        <input
                          onChange={(e) => setPaid(e.target.value)}
                          value={paid}
                          className="px-3 py-2 h-15 w-[150px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                          type="number"
                          name="paid"
                          placeholder="Paid"
                          id="paid"
                          required
                        />
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Due </span>
                      <span className="text-lg text-red-500">
                        Tk {due.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Payment Method</span>
                      <span className="text-lg text-orange-500">
                        <select
                          onChange={(e) => setPayment(e.target.value)}
                          value={payment}
                          className="px-3 py-2 h-15 w-[150px] outline-none border border-slate-700 bg-transparent rounded-md text-[#0b0b0b] text-right focus:border-indigo-500 overflow-hidden"
                          required
                        >
                          <option value="">Select Method</option>
                          <option value="Cash">Cash</option>
                          <option value="Mobile_Banking">Mobile Banking</option>
                          <option value="Card">Card</option>
                          <option value="Due">Due</option>
                        </select>
                      </span>
                    </div>
                    <div className="flex justify-between items-start">
                      <button
                        onClick={(e) => orderHandler(e)}
                        className="px-5 py-[6px] rounded-sm hover:shadow-green-500/20 hover:shadow-lg bg-green-500 text-sm text-white uppercase"
                      >
                        Confirm Order
                      </button>
                      <button
                        onClick={(e) => draftHandler(e)}
                        className="px-5 py-[6px] rounded-sm hover:shadow-orange-500/20 hover:shadow-lg bg-orange-500 text-sm text-white uppercase"
                      >
                        Draft
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <>
        {showModal && (
          <Modal
            width={400}
            pagination={false}
            title="Invoice Details"
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
                      <b> {moment(myOrder?.date).format("ll")}</b>
                    </span>
                    <span>
                      {" "}
                      Sale to: <b>{myOrder?.party?.name}</b>{" "}
                    </span>
                  </p>
                  <p className="flex justify-between items-center mt-2">
                    <span>
                      {" "}
                      <b>{myOrder?.orderNo}</b>
                    </span>
                    <span>
                      {" "}
                      Generated: <b>{myOrder?.generatedBy}</b>{" "}
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
                            <b>Item</b>
                          </p>
                        </td>
                        <td className="Hours table-header">
                          <p>
                            <b>Quantity</b>
                          </p>
                        </td>
                        <td className="Rate table-header">
                          <p>
                            <b>Price</b>
                          </p>
                        </td>
                        <td className="Rate table-header">
                          <p>
                            <b>Total</b>
                          </p>
                        </td>
                      </tr>
                      {myOrder?.cartItems?.map((item) => (
                        <tr className="service" key={item._id}>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.name.slice(0, 16)}..
                              <br />
                            </p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.quantity}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">{item.price}</p>
                          </td>
                          <td className="tableitem">
                            <p className="itemtext">
                              {item.quantity * item.price}
                            </p>
                          </td>
                        </tr>
                      ))}
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="tax-label">Total Amount</p>
                        </td>
                        <td className="payment">
                          <p className="tax-value">
                            BDT {myOrder?.totalAmount}
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="tax-label">Discount</p>
                        </td>
                        <td className="payment">
                          <p className="tax-value">BDT {myOrder?.discount}</p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Grand Total</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>
                              BDT {myOrder?.totalAmount - myOrder?.discount}
                            </b>
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Paid</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>BDT {myOrder?.paid}</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Due</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>BDT {myOrder?.due}</b>
                          </p>
                        </td>
                      </tr>
                      <tr className="tabletitle">
                        <td />
                        <td />
                        <td className="Rate table-header">
                          <p className="grand-total-label">
                            <b>Payment Method</b>
                          </p>
                        </td>
                        <td className="payment">
                          <p className="grand-total-value">
                            <b>{myOrder?.payment}</b>
                          </p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/*End Table*/}
                <div id="legalcopy">
                  <p className="legal">
                    <strong>Thank you for your order!</strong> Come again.
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
      </>
    </div>
  );
};

export default MakeOrder;
