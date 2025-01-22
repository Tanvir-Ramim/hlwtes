import React, { useEffect, useState } from "react";
import TypeIcon from "../../../components/Icon/Icons";
import ApiClient from "../../../axios/ApiClient";
import toast from "react-hot-toast";
const AddCategories = () => {
  const [selectedOption, setSelectedOption] = useState("Role");
  const [show, setShow] = useState(false);
  const handleTog = (option, showValue) => {
    setSelectedOption(option);
    setShow(showValue);
  };

  const [name, setName] = useState("");

  const [categoriesData, setCategoriesData] = useState([]);
  //   get Categories
  const getCategories = async () => {
    try {
      const res = await ApiClient.get(
        `/setting/categories?categoryName=${selectedOption}`
      );
      setCategoriesData(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };
  //   add categories
  const handleAdd = async () => {
    console.log(name);
    if (name === "") {
      console.log("sdfsdfdsfdf");
      return toast.error("Name field Required");
    }
    const data = {
      category_Name: selectedOption,
      name: name,
    };
    try {
      const res = await ApiClient.post("/setting/categories", data);
      if (res.status === 201) {
        toast.success("Successfully Add");
        getCategories();
        setName("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   categories delete
  const handleDelete = async (id) => {
    console.log(id);
    try {
      const res = await ApiClient.delete(`/setting/categories/${id}`);
      if (res.status === 204) {
        toast.success("Successfully Delete");
        getCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, [selectedOption]);
  return (
    <div>
      <p className="text-2xl font-bold text-black pb-6 relative uppercase">
        Add Categories
      </p>
      <div className="relative flex bg-white shadow rounded-lg justify-between w-96">
        <div
          className={`absolute left-0 top-0 w-1/3 bg-green-600 rounded h-full transition-transform duration-500 ease-in-out transform ${
            selectedOption === "Role"
              ? "translate-x-0"
              : selectedOption === "Designation"
              ? "translate-x-full"
              : selectedOption === "Holiday_type"
              ? "translate-x-[200%]"
              : ""
          }`}
        ></div>

        <button
          className={`relative z-10 w-1/3 text-center py-1 px-2 font-semibold transition-colors duration-500 ease-in-out ${
            selectedOption === "Role" ? "text-white" : "text-green-600"
          }`}
          onClick={() => handleTog("Role", false)}
        >
          Role
        </button>

        <button
          className={`relative z-10 w-1/3 px-2 text-center py-1 font-semibold transition-colors duration-500 ease-in-out ${
            selectedOption === "Designation" ? "text-white" : "text-green-600"
          }`}
          onClick={() => handleTog("Designation", false)}
        >
          Designation
        </button>

        <button
          className={`relative z-10 w-1/3 text-center py-1 font-semibold transition-colors duration-500 ease-in-out ${
            selectedOption === "Holiday_type" ? "text-white" : "text-green-600"
          }`}
          onClick={() => handleTog("Holiday_type", false)}
        >
          Holiday Type
        </button>
      </div>
      {/* input filed */}
      <div className="flex justify-between  py-8 mt-6">
        <div className=" w-[45%]  bg-white shadow-lg rounded-lg p-4">
          <h2 className="text-2xl font-bold mb-4">
            Add{" "}
            {selectedOption === "Holiday_type"
              ? "Holiday Type"
              : selectedOption}
          </h2>

          <div className="mb-4">
            <label
              htmlFor="name"
              className="block pb-2 text-gray-700 font-bold"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              name="name"
              placeholder="text"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>
          <div className="flex mt-8  justify-center">
            <button
              onClick={handleAdd}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg"
            >
              Submit
            </button>
          </div>
        </div>
        <div className=" w-[45%] ">
          <table className="min-w-full ">
            <thead className="bg-[#eee]">
              <tr>
                <th className="text-black text-base font-semibold text-center p-4">
                  Type Name
                </th>
                <th className="text-black text-base font-semibold text-center p-4">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className=" ">
              {categoriesData?.map((item, i) => (
                <tr key={i} className="border  text-sm">
                  <td className="text-black  font-normal text-center p-4 border-b">
                    {item?.name}
                  </td>

                  <td className="text-black  cursor-pointer  font-normal text-center p-4 border-b ">
                    <span className="text-black text-base font-semibold flex gap-2 justify-center">
                      <button
                        className="text-red-500 text-xl"
                        onClick={() => handleDelete(item?._id)}
                      >
                        <TypeIcon type="delete" />
                      </button>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AddCategories;
