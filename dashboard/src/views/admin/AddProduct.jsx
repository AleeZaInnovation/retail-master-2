import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BsImage } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { PropagateLoader } from "react-spinners";
import { get_categories } from "../../store/reducers/categoryReducer";
import { add_product, messageClear } from "../../store/reducers/productReducer";
import { overrideStyle } from "../../utils/utils";
import { company_branch } from "../../store/reducers/companyReducer";
const AddProduct = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state?.auth);
  const { categories } = useSelector((state) => state.category);
  const { companyBranch } = useSelector((state) => state.company);
  const { _id } = userInfo?.companyId;
  const { successMessage, errorMessage, loader } = useSelector(
    (state) => state.product
  );

  useEffect(() => {
    dispatch(
      get_categories({
        searchValue: "",
        parPage: "",
        page: "",
      })
    );
    dispatch(company_branch(_id));
  }, []);
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: 0,
    price: "",
    brand: "",
    stock: 0,
    unit: "Pcs",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const [cateShow, setCateShow] = useState(false);
  const [category, setCategory] = useState("");
  const [allCategory, setAllCategory] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const categoriesearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (value) {
      let srcValue = allCategory.filter(
        (c) => c.name.toLowerCase().indexOf(value.toLowerCase()) > -1
      );
      setAllCategory(srcValue);
    } else {
      setAllCategory(categories);
    }
  };
  const [imageShow, setImage] = useState("");
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

  useEffect(() => {
    setAllCategory(categories);
  }, [categories]);

  const add = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("unit", state.unit);
    formData.append("category", category);
    formData.append("branch", branch);
    formData.append("discount", state.discount);
    formData.append("image", state.image);
    dispatch(add_product(formData));
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
        description: "",
        discount: "",
        price: "",
        brand: "",
        stock: "",
        unit: "",
      });
      setImage("");
      setCategory("");
      setBranch("");
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  }, [successMessage, errorMessage]);

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
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Add Product</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/admin/dashboard/products"
          >
            Products
          </Link>
        </div>
        <div>
          <form onSubmit={add}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product Name</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  placeholder="Product Name"
                  name="name"
                  id="name"
                />
              </div>
              <div className="flex flex-col w-full gap-1 relative">
                <label htmlFor="category">Category</label>
                <input
                  readOnly
                  onClick={() => setCateShow(!cateShow)}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={category}
                  type="text"
                  placeholder="--Select Category--"
                  id="category"
                />
                <div
                  className={`absolute top-[101%] bg-slate-800 w-full transition-all ${cateShow ? "scale-100" : "scale-0"
                    }`}
                >
                  <div className="w-full px-4 py-2 fixed">
                    <input
                      value={searchValue}
                      onChange={categoriesearch}
                      className="px-3 py-1 w-full focus:border-indigo-500 outline-none bg-transparent border border-slate-700 rounded-md text-[#d0d2d6] overflow-hidden"
                      type="text"
                      placeholder="Search"
                    />
                  </div>
                  <div className="pt-14"></div>
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scroll">
                    {allCategory.map((c, i) => (
                      <span
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${category === c.name && "bg-indigo-500"
                          }`}
                        onClick={() => {
                          setCateShow(false);
                          setCategory(c.name);
                          setSearchValue("");
                          setAllCategory(categories);
                        }}
                      >
                        {c.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

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
                  className={`absolute top-[101%] bg-slate-800 w-full transition-all ${branchShow ? "scale-100" : "scale-0"
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
                        className={`px-4 py-2 hover:bg-indigo-500 hover:text-white hover:shadow-lg w-full cursor-pointer ${branch === c.name && "bg-indigo-500"
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
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]"></div>

            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.stock}
                  type="number"
                  min={0}
                  placeholder="Product Stock"
                  name="stock"
                  id="stock"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="unit">Unit</label>
                <select
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  name="unit"
                  id="unit"
                  onChange={inputHandle}
                  value={state.unit}
                >
                  <option value="Pcs">Pcs</option>
                  <option value="Unit">Unit</option>
                  <option value="Mtr">Mtr</option>
                  <option value="Feet">Feet</option>
                  <option value="Ltr">Ltr</option>
                  <option value="Ctn">Ctn</option>
                  <option value="Pkt">Pkt</option>
                </select>
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="price">Price</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.price}
                  type="number"
                  placeholder="Price"
                  name="price"
                  id="price"
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="discount">Discount</label>
                <input
                  min={0}
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.discount}
                  type="number"
                  placeholder="%Discount%"
                  name="discount"
                  id="discount"
                />
              </div>
            </div>

            <div className="flex flex-col w-full gap-1 text-[#d0d2d6] mb-5">
              <label htmlFor="description">Description</label>
              <textarea
                rows={4}
                className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                onChange={inputHandle}
                value={state.description}
                placeholder="Description"
                name="description"
                id="description"
              ></textarea>
            </div>
            <div className="grid lg:grid-cols-4 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4 xs:gap-4 gap-3 w-full text-[#d0d2d6] mb-4">
              <label
                className="flex justify-center items-center flex-col h-[238px] cursor-pointer border border-dashed hover:border-indigo-500 w-full border-[#d0d2d6]"
                htmlFor="image"
              >
                {imageShow ? (
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
              <input
                multiple
                onChange={imageHandle}
                className="hidden"
                type="file"
                id="image"
              />
            </div>
            <div className="flex justify-between items-center">
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Add Product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;
