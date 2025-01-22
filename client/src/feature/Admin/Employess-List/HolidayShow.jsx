import toast from "react-hot-toast";
import ApiClient from "../../../axios/ApiClient";
import Icon from "../../../components/Icon/Icons";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
const HolidayShow = ({ holidayFetch, setFilterDate, time, refetch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list,setList]=useState()
const getReason = (mx) => {
 console.log(mx);
 setList(mx);
  setIsModalOpen(true);
};
const closeModal = () => {
  setIsModalOpen(false);
};
  const handleDelete = async (date) => {
    const updatedArray = holidayFetch?.map((item) => {
      if (item?.date === date) {
        return {
          ...item,
          name: "",
          user_ref: null,
        };
      }
      return item;
    });
    const res = await ApiClient.patch(
      `/setting/holiday?year=${time?.year}&month=${time?.month}`,
      updatedArray
    );
    if (res.status === 200) {
      toast.success("Successfully Delete ");
      refetch();
    }
  };
  return (
    <div
      className={` ${
        holidayFetch?.length > 6
          ? "h-[400px] overflow-y-scroll "
          : "h-fit overflow-hidden"
      } `}
    >
      <table className="min-w-full ">
        <thead className="bg-[#eee]">
          <tr>
            <th className="text-black text-base font-semibold text-center p-4">
              Date
            </th>
            <th className="text-black text-base font-semibold text-center p-4">
              Type
            </th>
            <th className="text-black text-base font-semibold text-center p-4">
              Name/Note
            </th>
            <th className="text-black text-base font-semibold text-center p-4">
              Action
            </th>
          </tr>
        </thead>
        <tbody className=" ">
          {holidayFetch?.map?.(
            (item, i) =>
              item?.name !== "" && (
                <tr key={i} className="border  text-sm">
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.date?.slice(0, 10)}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.name?.split(" - ")[0]}
                  </td>
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.name?.split(" - ")[0] === "Developer" ? (
                   <div className="flex w-full justify-center">   <p onClick={()=>getReason(item?.name?.split(" - ")[1])} className="bg-blue-500 rounded cursor-pointer w-fit  px-2  text-white py-1">View List</p></div>
                    ) : (
                      item?.name?.split(" - ")[1]
                    )}
                  </td>

                  <td className="text-black  cursor-pointer  font-normal text-center p-4 border-b ">
                    <span className="text-black text-base font-semibold flex gap-2 justify-center">
                      <button
                        className="text-blue-500"
                        onClick={() => setFilterDate(item?.date?.slice(0, 10))}
                      >
                        <Icon type="Edit" />
                      </button>
                      <button
                        className="text-red-500"
                        onClick={() => handleDelete(item?.date)}
                      >
                        <Icon type="delete" />
                      </button>
                    </span>
                  </td>
                </tr>
              )
          )}
        </tbody>
      </table>

      {isModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center w-full  bg-black bg-opacity-50">
              <div className="bg-white rounded-lg p-6   modal-slide-down relative">
                <button
                  className="absolute top-2   right-3 text-red-400"
                  onClick={closeModal}
                >
                  <RxCross2 />
                </button>
                <h1 className="pt-3 pb-4 font-bold">Assigned Employee List</h1>
                <ul  className="space-y-2 pl-5  list-disc grid grid-cols-1">{list?.split(",")?.map((item,i)=><li key={i}>{item}</li>)}</ul>
              </div>
            </div>
          )}
    </div>
  );
};

export default HolidayShow;
