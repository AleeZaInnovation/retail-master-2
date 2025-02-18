import React, { useEffect, useState } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import seller from "../../assets/images/seller.png";
import { get_products } from "../../store/reducers/productReducer";
const Categories = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state?.category);

  const categorySearch = (category) => {
    const obj = {
      parPage: 50,
      page: 1,
      searchValue: category,
    };
    dispatch(get_products(obj));
  };

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 6,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 6,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 4,
    },
    mdtablet: {
      breakpoint: { max: 991, min: 464 },
      items: 4,
    },
    mobile: {
      breakpoint: { max: 768, min: 0 },
      items: 3,
    },
    smmobile: {
      breakpoint: { max: 640, min: 0 },
      items: 3,
    },
    xsmobile: {
      breakpoint: { max: 440, min: 0 },
      items: 3,
    },
  };
  return (
    <div className="w-[87%] mx-auto relative">
      <Carousel
        autoPlay={true}
        infinite={true}
        arrows={true}
        responsive={responsive}
        transitionDuration={500}
      >
        {categories.map((c, i) => (
          <Link
            onClick={(e) => categorySearch(c.name)}
            // className="h-[185px] border block"
            className="border block"
            key={i}
            to="#"
          >
            <div className="w-full h-full relative p-3">
              {/* <img
                src={c.image}
                alt="image"
                className="sm:w-full w-full h-[100px]"
              /> */}
              <div className=" w-full mx-auto font-bold left-0 flex justify-center items-center">
                <span className="py-[2px] px-6 bg-[#3330305d] text-white">
                  {c.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </Carousel>
    </div>
  );
};

export default Categories;
