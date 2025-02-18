import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import { get_staff_request } from "../../store/reducers/staffReducer";
const StaffRequest = () => {
  const { staffs, totalStaffs } = useSelector((state) => state.staff);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);

  useEffect(() => {
    dispatch(
      get_staff_request({
        parPage,
        searchValue,
        page: currentPage,
      })
    );
  }, [parPage, searchValue, currentPage]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4  bg-[#283046] rounded-md">
      <div className="w-full flex justify-end mt-4 bottom-4 right-4 mb-3">
        <Link className="p-[6px] bg-blue-500 rounded hover:shadow-lg hover:shadow-blue-500/50" to='/super-admin/dashboard/staffs'>All staffs</Link>
      </div>
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          searchValue={searchValue}
        />
        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left text-[#d0d2d6]">
            <thead className="text-xs text-[#d0d2d6] uppercase border-b border-slate-700">
              <tr>
                <th scope="col" className="py-3 px-4">
                  No
                </th>
                <th scope="col" className="py-3 px-4">
                  Name
                </th>
                <th scope="col" className="py-3 px-4">
                  Email
                </th>
                <th scope="col" className="py-3 px-4">
                  Requested Company
                </th>
                <th scope="col" className="py-3 px-4">
                  Status
                </th>
                <th scope="col" className="py-3 px-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="text-sm font-normal">
              {staffs.map((d, i) => (
                <tr className="border-b border-slate-700" key={i}>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    {i + 1}
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d.name}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d.email}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d.note}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d.status}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <div className="flex justify-start items-center gap-4">
                      <Link
                        to={`/super-admin/dashboard/staff/details/${d._id}`}
                        className="p-[6px] bg-green-500 rounded hover:shadow-lg hover:shadow-green-500/50"
                      >
                        <FaEye />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalStaffs <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalStaffs}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffRequest;
