import React, { useEffect, useState } from "react";
import Datepicker from "react-tailwindcss-datepicker";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import "../../styles/InvoiceStyles.css";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import collect from "collect.js";
import { get_categories } from "../../store/reducers/categoryReducer";

import { get_products, get_product } from "../../store/reducers/productReducer";
import { get_purchase_parties } from "../../store/reducers/partyReducer";
import {
  confirm_purchase,
  messageClear,
} from "../../store/reducers/orderReducer";
import { company_branch } from "../../store/reducers/companyReducer";

const PurchaseInventory = () => {
  const { products, product, totalProduct } = useSelector(
    (state) => state?.product
  );
  const { category } = useSelector((state) => state?.category);
  const { parties } = useSelector((state) => state.party);
  const { loader, successMessage, errorMessage } = useSelector(
    (state) => state.order
  );
  const { userInfo } = useSelector((state) => state?.auth);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [width] = useState(641);
  const [isEditing, setIsEditing] = useState(false);

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

  // const myArray = [{ serial: "" }];
  const [sn, setSn] = useState([]);
  const [serial, setSerial] = useState("");
  useEffect(() => {
    if (window.innerWidth < width) {
      alert("Place your phone in landscape mode for the best experience");
    }
  }, [width]);

  // Submit form function
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!invent || !quantity || !price) {
      toast.error("Please fill in all inputs");
    } else {
      const newItems = {
        id: invId,
        invent,
        sn,
        unit: product?.unit,
        quantity: Number(quantity),
        price: Number(price),
        amount: Number(amount),
      };
      setInventory("");
      setQuantity("");
      setPrice("");
      setAmount("");
      setSn([]);
      setList([...list, newItems]);
      setIsEditing(false);
      console.log(list);
    }
  };

  // Calculate items amount function
  useEffect(() => {
    const calculateAmount = (amount) => {
      setAmount((price / quantity).toFixed(2));
    };

    calculateAmount(amount);
  }, [amount, price, quantity, setAmount]);

  const calculateTotal = () => {
    const allItems = list.map((item) => item.price);

    setTotal(collect(allItems).sum());
  };

  const calculateTotalQty = () => {
    const allItems = list.map((item) => item.quantity);

    setTotalQty(collect(allItems).sum());
  };

  useEffect(() => {
    calculateTotal();
    calculateTotalQty();
  });

  // Edit function
  const editRow = (id) => {
    const editingRow = list.find((row) => row.id === id);
    console.log(editingRow);
    setList(list.filter((row) => row.id !== id));
    setIsEditing(true);
    setSn([editingRow?.sn]);
    setInventory(editingRow?.invent);
    setQuantity(editingRow.quantity);
    setPrice(editingRow.price);
  };

  // Delete function
  const deleteRow = (id) => {
    setList(list.filter((row) => row.id !== id));
  };

  useEffect(() => {
    dispatch(
      get_products({
        searchValue,
        parPage: "",
        page: "",
      })
    );
    dispatch(company_branch(_id));
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
  const [searchValue, setSearchValue] = useState("");
  const inventorySearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
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
  }, [products]);

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
    dispatch(get_purchase_parties(obj));
  }, []);

  const purchaseHandler = () => {
    dispatch(
      confirm_purchase({
        cartItems: list,
        totalAmount: total,
        totalQuantity: totalQty,
        party,
        value,
        description,
        branch,
      })
    );
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      navigate("/admin/dashboard/products");
    }
  }, [successMessage, errorMessage]);

  const changeHandler = (id) => (event) => {
    const { name, value } = event.target;
    setSn((sn) =>
      sn.map((el) =>
        el === id
          ? {
              ...el,
              [name]: value,
            }
          : el
      )
    );
  };
  const inputHandle = (e) => {
    const value = e.target.value;
    sn?.length > 0
      ? sn?.map((i, j) =>
          i === value
            ? alert("Already Insert This Serial") && setSerial(" ")
            : setSerial(value)
        )
      : setSerial(value);
  };
  const handleSerialChange = (e) => {
    e.preventDefault();
    setSn([...sn, serial]);
    setQuantity(sn?.length + 1);
    setSerial("");
  };
  // const addClick = () => {
  //   setSn([...sn, ""]);
  // };

  // const removeClick = (i) => {
  //   let sn = [...this.state.sn];
  //   sn.splice(i, 1);
  //   this.setState({ sn });
  // };
  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[rgb(40,48,70)] rounded-md">
        <div className="flex  justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
          <h1 className="text-[#d0d2d6] font-semibold text-lg">
            Products Purchase
          </h1>
          <Link
            to="/admin/dashboard/purchases"
            className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
          >
            Purchase List
          </Link>
        </div>

        <section className="w-full p-4  bg-[#eeeeee] rounded-md">
          <>
            <form onSubmit={handleSubmit}>
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
                        value={searchValue}
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
                            setSearchValue("");
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
                  <label htmlFor="price">Total</label>
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
                  <label htmlFor="amount">Price</label>
                  <h5 className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]">
                    {amount}
                  </h5>
                </div>
                <button
                  type="submit"
                  className="bg-blue-500  flex justify-center items-center  text-white font-bold py-2 px-8 mt-7 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400"
                >
                  {isEditing ? "Edit" : "Add"}
                </button>
              </div>
            </form>
            <form onSubmit={handleSerialChange}>
              <div className="flex flex-row mb-3 md:flex-row gap-4 w-full justify-between text-[#0f0f0f]">
                <div className="flex flex-col lg:w-[25%] gap-1">
                  <label htmlFor="serial">Serial Number</label>
                  <input
                    min="0"
                    className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                    value={serial}
                    onChange={(e) => inputHandle(e)}
                    type="text"
                    placeholder="Serial No"
                    name="serial"
                    id="serial"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-blue-500  flex justify-center items-center  text-white font-bold py-2 px-8 mt-7 rounded hover:bg-blue-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400"
                >
                  {isEditing ? "Edit" : "Add"}
                </button>
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
                              branch === c.name && "bg-indigo-500"
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
            </form>

            {sn &&
              sn.map((i, j) => (
                <div className="flex flex-row justify-start items-start mt-2">
                  <p>{i}</p>
                </div>
              ))}
            {/* {sn?.map((i, l) => {
              <div key={l}>
                <input
                  placeholder="Serial Number"
                  name="serial"
                  value={i?.serial || ""}
                />
              </div>;
            })} */}
            {/* {sn &&
              sn?.map((el, i) => (
                <>
                  <div>
                    <div key={i}>
                      <input
                        placeholder="Serial Number"
                        name="serial"
                        value={el?.serial || ""}
                        onChange={(e) => handleChange(e)}
                      />
                      <button onClick={() => addClick()}>Add</button>
                      <button onClick={() => removeClick(i)}>Remove</button>
                    </div>
                  </div>
                </>
              ))} */}
            {/* Table items */}

            <table width="100%" className="mb-10 mt-10 overflow-auto">
              <thead>
                <tr className="bg-gray-100 p-1">
                  <td className="font-bold">Name</td>
                  <td className="font-bold">Qty</td>
                  <td className="font-bold">Price</td>
                  <td className="font-bold">Total</td>
                  <td className="font-bold">Action</td>
                </tr>
              </thead>
              {list.map(({ id, invent, quantity, price, amount, unit, sn }) => (
                <React.Fragment key={id}>
                  <tbody>
                    <tr className="h-10 ">
                      <td className="w-[20%]">{invent}</td>
                      <td className="w-[10%]">
                        {quantity} {unit} <br />
                        {sn &&
                          sn.map((i, j) => (
                            <div className="flex flex-row justify-start items-start mt-2">
                              <p>{i}</p>
                            </div>
                          ))}
                      </td>
                      <td className="amount">{amount}</td>
                      <td>{price}</td>
                      <td className="flex justify-center items-center">
                        <button onClick={() => editRow(id)}>
                          <AiOutlineEdit className="text-green-500 font-bold text-xl" />
                        </button>{" "}
                        ||
                        <button onClick={() => deleteRow(id)}>
                          <AiOutlineDelete className="text-red-500 font-bold text-xl" />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </React.Fragment>
              ))}
            </table>

            <div>
              <h2 className="flex items-end justify-end text-gray-800 text-4xl font-bold">
                Tk. {total.toLocaleString()}
              </h2>
            </div>
          </>
        </section>
        <section className="w-full p-4  bg-[#8a5ef1] rounded-md mt-4">
          <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#0f0f0f]">
            <div className="flex flex-col w-full gap-1 mt-3 relative">
              <label htmlFor="party">Purchase From</label>
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
            <div className="flex flex-col w-full gap-1 mt-3 relative">
              <label htmlFor="price">Purchase Date</label>
              <Datepicker
                value={value}
                onChange={handleValueChange}
                showShortcuts={true}
              />
            </div>
            <div className="flex flex-col w-full gap-1 mt-3 relative">
              <label htmlFor="description">Description</label>
              <textarea
                rows={1}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#f8f8f9] border border-slate-700 rounded-md text-[#101010]"
                onChange={(e) => setDescription(e.target.value)}
                value={description}
                placeholder="Purchase Note "
                name="description"
                id="description"
              ></textarea>
            </div>
          </div>
        </section>
        <section className="w-[340px] lg:w-[240px] p-4 cursor-pointer bg-[#eeeeee] rounded-md mt-4">
          <span
            onClick={purchaseHandler}
            className="bg-green-500  flex justify-center items-center  text-white font-bold py-2 px-4 rounded hover:bg-green-600 hover:text-white transition-all duration-150 hover:ring-4 hover:ring-blue-400"
          >
            Confirm Purchase
          </span>
        </section>
      </div>
    </div>
  );
};

export default PurchaseInventory;
