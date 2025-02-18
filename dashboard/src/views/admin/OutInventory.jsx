import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { BsImage } from "react-icons/bs";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import {
  inventoryAdd,
  inventoryUpdate,
  get_inventory,
  messageClear,
  get_out_inventories,
} from "../../store/reducers/categoryReducer";
const OutInventory = () => {
  const dispatch = useDispatch();
  const { loader, successMessage, errorMessage, inventories, inventory } =
    useSelector((state) => state?.category);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
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
    dispatch(get_out_inventories(obj));
  }, [searchValue, currentPage, parPage]);
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
            <p>Out of Stock</p>
            <Link
            to="/admin/dashboard/inventory"
            className="px-4 py-2 text-sm bg-green-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#f3f4f6]">
              {" "}
              Inventories
            </Link>
            <Link
            to="/admin/dashboard/inventory-purchase"
            className="px-4 py-2 text-sm bg-orange-300 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#070b13]">
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
                        <span>{(d.price).toFixed(2)}</span>
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
                totalItem={50}
                parPage={parPage}
                showItem={4}
              />
            </div>
          </div>
        </div>
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
      </div>
    </div>
  );
};

export default OutInventory;
