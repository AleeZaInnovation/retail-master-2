import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PropagateLoader } from "react-spinners";
import toast from "react-hot-toast";
import {
  get_categories,
} from "../../store/reducers/categoryReducer";
import {
  get_product,
  messageClear,
  update_product,
} from "../../store/reducers/productReducer";
import { BsImage } from "react-icons/bs";
import { overrideStyle } from "../../utils/utils";
const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categories } = useSelector(
    (state) => state.category
  );
  const { product, loader, errorMessage, successMessage } = useSelector(
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
  }, []);
  const [state, setState] = useState({
    name: "",
    description: "",
    discount: "",
    price: "",
    brand: "",
    stock: "",
    unit: "",
  });
  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };
  useEffect(() => {
    setState({
      name: product?.name,
      description: product?.description,
      discount: product?.discount,
      price: product?.price,
      brand: product?.brand,
      stock: product?.stock,
      unit: product?.unit,
    });
  }, [product]);
  useEffect(() => {
    dispatch(get_product(productId));
  }, [productId]);

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
  const [imageShow, setImage] = useState(product?.image);
  useEffect(() => {
    setCategory(product?.category);
  }, [product]);

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
    if (categories.length > 0) {
      setAllCategory(categories);
    }
  }, [categories]);

  useEffect(() => {
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
      setTimeout(() => {
        navigate("/admin/dashboard/products");
        window.location.reload();
      }, 3000);
    }
  }, [successMessage, errorMessage]);


  const update = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", state.name);
    formData.append("description", state.description);
    formData.append("price", state.price);
    formData.append("stock", state.stock);
    formData.append("unit", state.unit);
    formData.append("category", category);
    formData.append("discount", state.discount);
    formData.append("image", state.image);
    formData.append("productId", productId);
    dispatch(update_product(formData));
  };
  return (
    <div className="px-2 lg:px-7 pt-5 ">
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <div className="flex justify-between items-center pb-4">
          <h1 className="text-[#d0d2d6] text-xl font-semibold">Edit Product</h1>
          <Link
            className="bg-blue-500 hover:shadow-blue-500/50 hover:shadow-lg text-white rounded-sm px-7 py-2 my-2 "
            to="/admin/dashboard/products"
          >
            Products
          </Link>
        </div>
        <div>
          <form onSubmit={update}>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="name">Product name</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.name}
                  type="text"
                  placeholder="Product name"
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
                  value={category ? category : product?.category}
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
                  <div className="flex justify-start items-start flex-col h-[200px] overflow-x-scrool">
                    {allCategory.length > 0 &&
                      allCategory.map((c, i) => (
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
            </div>
            <div className="flex flex-col mb-3 md:flex-row gap-4 w-full text-[#d0d2d6]">
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="stock">Stock</label>
                <input
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  onChange={inputHandle}
                  value={state.stock}
                  type="number"
                  min="0"
                  placeholder="Product Stock"
                  name="stock"
                  id="stock"
                  readOnly
                />
              </div>
              <div className="flex flex-col w-full gap-1">
                <label htmlFor="unit">Unit</label>
                <select
                  className="px-4 py-2 focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#d0d2d6]"
                  name="unit"
                  id="unit"
                  onChange={inputHandle}
                  value={state.unit}>
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
                {product?.image ? (
                  <img
                    className="w-full h-full"
                    src={imageShow ? imageShow : product?.image}
                  />
                ) : (
                  <>
                    <span>
                      <BsImage />
                    </span>
                    <span>Select Image</span>
                  </>
                )}
              </label>
            </div>
            <input
              onChange={imageHandle}
              className="hidden"
              type="file"
              name="image"
              id="image"
            />
            <div className="flex justify-between items-center">
              <button
                disabled={loader ? true : false}
                className="bg-blue-500 w-[190px] hover:shadow-blue-500/20 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
              >
                {loader ? (
                  <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                ) : (
                  "Update product"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;
