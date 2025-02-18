import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import Pagination from "../Pagination";
import { useSelector, useDispatch } from "react-redux";
import Search from "../components/Search";
import { get_owners } from "../../store/reducers/ownerReducer";
const Owners = () => {
  const { owners, totalOwners } = useSelector((state) => state.owner);
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");
  const [parPage, setParPage] = useState(5);
  const [aStatus, setAStatus] = useState("");

  useEffect(() => {
    dispatch(
      get_owners({
        parPage,
        searchValue,
        page: currentPage,
        status: aStatus,
      })
    );
  }, [parPage, searchValue, currentPage, aStatus]);
  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="px-4 py-2 flex justify-between bg-sky-900 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#eff0f3]">
        <p>Owners</p>
        <select
          onChange={(e) => setAStatus(e.target.value)}
          className="px-4 py-2 bg-orange-300 shadow-lg focus:border-indigo-500 outline-none bg-[#283046] border border-slate-700 rounded-md text-[#070b13]"
        >
          <option value="">Status</option>
          <option value="Pending">Pending</option>
          <option value="Active">Active</option>
          <option value="Block">Block</option>
        </select>
      </div>
      <div className="w-full p-4  bg-[#283046] rounded-md">
        <Search
          setParPage={setParPage}
          setSearchValue={setSearchValue}
          setAStatus={setAStatus}
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
                  Assigned Company
                </th>
                <th scope="col" className="py-3 px-4">
                  Company Mobile
                </th>
                <th scope="col" className="py-3 px-4">
                  Company Email
                </th>
                <th scope="col" className="py-3 px-4">
                  Company Address
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
              {owners.map((d, i) => (
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
                    <span>{d?.companyId?.name}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d?.companyId?.mobile}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d?.companyId?.email}</span>
                  </td>
                  <td
                    scope="row"
                    className="py-2 px-4 font-normal whitespace-nowrap"
                  >
                    <span>{d?.companyId?.address}</span>
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
                        to={`/super-admin/dashboard/owner/details/${d._id}`}
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
        {totalOwners <= parPage ? (
          ""
        ) : (
          <div className="w-full flex justify-end mt-4 bottom-4 right-4">
            <Pagination
              pageNumber={currentPage}
              setPageNumber={setCurrentPage}
              totalItem={totalOwners}
              parPage={parPage}
              showItem={4}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Owners;
