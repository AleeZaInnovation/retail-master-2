import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import collect from "collect.js";
import { Button, Modal } from "antd";
import { useReactToPrint } from "react-to-print";
import "../../styles/InvoiceStyles.css";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import {
  inventoryAdd,
  inventoryUpdate,
  get_inventories,
  get_inventory,
  messageClear,
} from "../../store/reducers/categoryReducer";
const Inventory = () => {
  const dispatch = useDispatch();
  const {
    loader,
    successMessage,
    errorMessage,
    inventories,
    inventory,
    totalInventory,
  } = useSelector((state) => state?.category);
  const { userInfo } = useSelector((state) => state?.auth);
  const componentRef = useRef();
  const [view, setView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(500);
  const [show, setShow] = useState(false);

  const [state, setState] = useState({
    name: "",
    unit: "",
    inventoryId: "",
  });

  useEffect(() => {
    setState({
      name: inventory?.name,
      unit: inventory?.unit,
      inventoryId: inventory?._id,
    });
  }, [inventory]);
  const add_inventory = (e) => {
    e.preventDefault();
    dispatch(inventoryAdd(state));
  };
  const update_inventory = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("unit", state.unit);
    formData.append("inventoryId", inventory._id);
    dispatch(inventoryUpdate(formData));
  };

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setState({
        name: "",
        unit: "",
      });
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_inventories(obj));
  }, [searchValue, currentPage, parPage]);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const Qty = inventories.map((item) => item.quantity);
  const totalQty = collect(Qty).sum();

  const Amount = inventories.map((item) => item.total);
  const totalAmount = collect(Amount).sum();
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="flex lg:hidden justify-between items-center mb-5 p-4 bg-[#283046] rounded-md">
        <h1 className="text-[#d0d2d6] font-semibold text-lg">inventories</h1>
        <button
          onClick={() => setShow(true)}
          className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-4 py-2 cursor-pointer text-white rounded-sm text-sm"
        >
          {inventory ? "Update" : "Add"}
        </button>
      </div>
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-7/12">
          <div className="px-4 py-2 flex justify-between bg-sky-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#eff0f3]">
            <p>Inventories</p>
            <Link
              to="/admin/dashboard/out-inventories"
              className="px-4 py-2 text-sm bg-red-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#f3f4f6]"
            >
              {" "}
              Out of Stock
            </Link>
            <Link
              onClick={() => setView(!view)}
              className="px-4 py-2 text-sm bg-green-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#f3f4f6]"
            >
              {" "}
              Inventory List
            </Link>
            <Link
              to="/admin/dashboard/inventory-purchase"
              className="px-4 py-2 text-sm bg-orange-300 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#070b13]"
            >
              {" "}
              Purchase Inventory
            </Link>
          </div>
          <div className="w-full p-4  bg-[#283046] rounded-md">
            <Search
              setParPage={setParPage}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-[#d0d2d6]">
                <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
                  <tr>
                    <th scope="col" className="py-3 px-4">
                      Name
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Price
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Quantity
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Total Price
                    </th>
                    <th scope="col" className="py-3 px-4">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventories?.map((d, i) => (
                    <tr key={i}>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>{d.name}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>{d.price.toFixed(2)}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>
                          {d.quantity} {d.unit}
                        </span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <span>{d.total}</span>
                      </td>
                      <td
                        scope="row"
                        className="py-1 px-4 font-medium whitespace-nowrap"
                      >
                        <div className="flex justify-start items-center gap-4">
                          <Link
                            onClick={(e) => dispatch(get_inventory(d._id))}
                            className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                          >
                            <FaEdit />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-full flex justify-end mt-4 bottom-4 right-4">
              <Pagination
                pageNumber={currentPage}
                setPageNumber={setCurrentPage}
                totalItem={totalInventory}
                parPage={parPage}
                showItem={4}
              />
            </div>
          </div>
        </div>
        {view === false ? (
          <div
            className={`w-[320px] lg:w-5/12 translate-x-100 lg:relative lg:right-0 fixed ${
              show ? "right-0" : "-right-[340px]"
            } z-[9999] top-0 transition-all duration-500`}
          >
            <div className="w-full pl-5">
              {inventory ? (
                <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[#d0d2d6] font-semibold text-xl">
                      Update Inventory
                    </h1>
                    <div
                      onClick={() => setShow(false)}
                      className="block lg:hidden cursor-pointer"
                    >
                      <GrClose className="text-[#d0d2d6]" />
                    </div>
                  </div>
                  <form onSubmit={update_inventory}>
                    <div className="flex flex-col w-full gap-1 mb-3">
                      <label htmlFor="name">Inventory name</label>
                      <input
                        value={state.name}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        type="text"
                        id="name"
                        name="inventory_name"
                        placeholder={inventory?.name}
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1 mb-3">
                      <label htmlFor="name">Inventory Unit</label>
                      <input
                        value={state.unit}
                        onChange={(e) =>
                          setState({ ...state, unit: e.target.value })
                        }
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        type="text"
                        id="unit"
                        name="inventory_unit"
                        placeholder={inventory?.unit}
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
                          "Update Inventory"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-[#283046] h-screen lg:h-auto px-3 py-2 lg:rounded-md text-[#d0d2d6]">
                  <div className="flex justify-between items-center mb-4">
                    <h1 className="text-[#d0d2d6] font-semibold text-xl">
                      Add Inventory
                    </h1>
                    <div
                      onClick={() => setShow(false)}
                      className="block lg:hidden cursor-pointer"
                    >
                      <GrClose className="text-[#d0d2d6]" />
                    </div>
                  </div>
                  <form onSubmit={add_inventory}>
                    <div className="flex flex-col w-full gap-1 mb-3">
                      <label htmlFor="name">Inventory Name</label>
                      <input
                        value={state.name}
                        onChange={(e) =>
                          setState({ ...state, name: e.target.value })
                        }
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        type="text"
                        id="name"
                        name="inventory_name"
                        placeholder="Inventory Name"
                        required
                      />
                    </div>
                    <div className="flex flex-col w-full gap-1 mb-3">
                      <label htmlFor="name">Inventory Unit</label>
                      <input
                        value={state.unit}
                        onChange={(e) =>
                          setState({ ...state, unit: e.target.value })
                        }
                        className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                        type="text"
                        id="unit"
                        name="inventory_unit"
                        placeholder="Inventory Unit"
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
                          "Add Inventory"
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      {view && (
        <Modal
          width="full"
          pagination={false}
          title="Document for Inventories List"
          visible={view}
          onCancel={() => {
            setView(false);
          }}
          footer={false}
        >
          <div class="flex-shrink max-w-full px-4 w-full mb-6">
            <div
              class="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
              ref={componentRef}
            >
              <div class="flex justify-between items-center pb-4 border-b border-gray-200 dark:border-gray-700 mb-3">
                <div class="flex flex-col">
                  <div className="flex justify-start items-center">
                    <div
                      className="logo"
                      style={{
                        backgroundImage: `url(${userInfo.companyId.image})`,
                      }}
                    ></div>
                    <div class="text-3xl font-bold mb-1 dark:text-gray-300">
                      {userInfo.companyId.name}
                    </div>
                  </div>
                  <p class="text-sm dark:text-gray-300">
                    {userInfo.companyId.address} <br />{" "}
                    {userInfo.companyId.mobile} <br />
                    {userInfo.companyId.email}
                  </p>
                </div>
                <div class="text-4xl uppercase font-bold dark:text-gray-300">Inventories List</div>
              </div>
              <div class="py-4">
                <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                  <thead class="border-b dark:border-gray-700">
                    <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                      <th>SL No</th>
                      <th class="text-center dark:text-gray-300">Name</th>
                      <th class="text-center dark:text-gray-300">Rate (Tk)</th>
                      <th class="text-center dark:text-gray-300">Quantity</th>
                      <th class="text-center dark:text-gray-300">Total (Tk)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventories?.length > 0 &&
                      inventories.map((i, j) => (
                        <tr key={j}>
                          <td>
                            <div class="flex flex-wrap flex-row items-center">
                              <div class="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                {j + 1}
                              </div>
                            </div>
                          </td>
                          <td class="text-left dark:text-gray-300">{i.name.slice(0, 32)}</td>
                          <td class="text-right dark:text-gray-300">
                            {" "}
                            {(i.total / i.quantity).toLocaleString("en")}
                          </td>
                          <td class="text-center dark:text-gray-300">
                            {i.quantity} {i.unit}
                          </td>
                          <td class="text-right dark:text-gray-300">
                            {" "}
                            {i.total.toLocaleString("en")}
                          </td>
                        </tr>
                      ))}
                    <tr>
                      <td></td>
                    </tr>
                    <tr>
                      <td colspan="2"></td>
                      <td class="text-center"></td>
                      <td class="text-center dark:text-gray-300">{totalQty}</td>
                      <td class="text-right font-bold dark:text-gray-300">
                        Tk {totalAmount.toLocaleString("en")}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div id="legalcopy">
                <p className="legal">
                  <b> Developed by AleeZaInnovation </b>
                </p>
              </div>
            </div>
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
    </div>
  );
};

export default Inventory;
