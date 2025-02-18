import { Button, Modal } from "antd";
import collect from "collect.js";
import React, { useEffect, useRef, useState } from "react";
import { FaEdit, FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { get_products } from "../../store/reducers/productReducer";
import "../../styles/InvoiceStyles.css";
import Pagination from "../Pagination";
import Search from "../components/Search";
import { company_branch } from "../../store/reducers/companyReducer";
const Products = () => {
  const dispatch = useDispatch();
  const { products, totalProduct } = useSelector((state) => state?.product);
  const [branchProducts, setBranchProducts] = useState(products);
  const { userInfo } = useSelector((state) => state?.auth);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const componentRef = useRef();
  const [view, setView] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(500);

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

  useEffect(() => {
    const obj = {
      parPage: parseInt(parPage),
      page: parseInt(currentPage),
      searchValue,
    };
    dispatch(get_products(obj));
    dispatch(company_branch(_id));
  }, [searchValue, currentPage, parPage]);

  useEffect(() => {
    setTimeout(() => {
      setBranchProducts(products);
    }, 500);
  }, [products]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const Qty = branchProducts.map((item) => item.stock);
  const totalQty = collect(Qty).sum();

  const Amount = branchProducts.map((item) => item.stock * item.purchase_price);
  const totalAmount = collect(Amount).sum();

  const handleBranchChange = (value) => {
    const nproducts = [];
    products.forEach((product) => {
      if (product.branch === value && product.stock !== 0) {
        nproducts.push(product);
      }
    });
    setBranchProducts(nproducts);
  };

  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Products</h1>
          <Link
            className="bg-red-500 hover:shadow-red-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/admin/dashboard/out-products"
          >
            Out of Stock
          </Link>
          <Link
            className="bg-green-500 hover:shadow-green-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            onClick={() => setView(!view)}
          >
            Products List
          </Link>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/admin/dashboard/add-product"
          >
            Add Product
          </Link>
        </div>
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />

        <div className="relative overflow-x-auto mt-5">
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
          <table className="w-full mt-5 text-sm text-left text-[#d0d2d6]">
            <thead className="text-sm text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Image
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Category
                </th>
                <th scope="col" className="py-3 px-4">
                  Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Buy Price
                </th>
                <th scope="col" className="py-3 px-4">
                  Stock
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {branchProducts?.map((d, i) => (
                <tr key={i}>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    {i + 1}
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <img className="w-[45px] h-[45px]" src={d.image} alt="" />
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d?.name?.slice(0, 16)}...</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d.category}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d.price}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d.purchase_price.toFixed(2)}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <span>{d.stock}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-1 px-4 font-medium whitespace-nowrap"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/admin/dashboard/edit-product/${d._id}`}
                        className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50"
                      >
                        <FaEdit />
                      </Link>
                      <Link className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50">
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalProduct <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={50}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}

        {view && (
          <Modal
            width="full"
            pagination={false}
            title="Document for Products List"
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
                  <div class="text-4xl uppercase font-bold dark:text-gray-300">
                    Products List
                  </div>
                </div>
                <div class="py-4">
                  <table class="table-bordered w-full ltr:text-left rtl:text-right text-gray-600">
                    <thead class="border-b dark:border-gray-700">
                      <tr class="bg-gray-100 dark:bg-gray-900 dark:bg-opacity-20">
                        <th>SL No</th>
                        <th class="text-center dark:text-gray-300">Name</th>
                        <th class="text-center dark:text-gray-300">MRP (Tk)</th>
                        <th class="text-center dark:text-gray-300">COG (Tk)</th>
                        <th class="text-center dark:text-gray-300">Quantity</th>
                        <th class="text-center dark:text-gray-300">
                          Total (Tk)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {branchProducts?.length > 0 &&
                        branchProducts.map((i, j) => (
                          <tr key={j}>
                            <td>
                              <div class="flex flex-wrap flex-row items-center">
                                <div class="leading-5 items-center dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                                  {j + 1}
                                </div>
                              </div>
                            </td>
                            <td class="text-left dark:text-gray-300">
                              {i.name.slice(0, 32)}
                            </td>
                            <td class="text-right dark:text-gray-300">
                              {" "}
                              {i.price.toLocaleString("en")}
                            </td>
                            <td class="text-right dark:text-gray-300">
                              {" "}
                              {i.purchase_price.toLocaleString("en")}
                            </td>
                            <td class="text-center dark:text-gray-300">
                              {i.stock}
                            </td>
                            <td class="text-right dark:text-gray-300">
                              {" "}
                              {(i.purchase_price * i.stock).toLocaleString(
                                "en"
                              )}
                            </td>
                          </tr>
                        ))}
                      <tr>
                        <td></td>
                      </tr>
                      <tr>
                        <td colspan="3"></td>
                        <td class="text-center"></td>
                        <td class="text-center dark:text-gray-300">
                          {totalQty}
                        </td>
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
    </div>
  );
};

export default Products;
