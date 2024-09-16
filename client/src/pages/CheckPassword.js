import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";

const CheckPassword = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  // const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate("/email");
    }
  }, []);

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setData((preve) => {
      return {
        ...preve,
        [name]: value,
      };
    });
  };


  const handleSubmit= async(e) =>{
    e.preventDefault()
    e.stopPropagation()
    const URL = `${process.env.REACT_APP_BACKEND_URL}/api/password`
    try{
      const response=await axios({
        methos:'post',
        url: URL,
        data : {
          userId:location?.state?._id,
          password:data.password
        },
        withCredentials : true
      })
    }catch(error){
      toast.error(error?.response?.data?.message)
    }
  }


  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col">
          {/* <PiUserCircle
              size={80}
            /> */}
          {/* <Avatar
              width={70}
              height={70}
              name={location?.state?.name}
              imageUrl={location?.state?.profile_pic}
            /> */}
          <h2 className="font-semibold text-lg mt-1">
            {location?.state?.name}
          </h2>
        </div>

        <form className="grid gap-4 mt-3" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password :</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-primary"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-primary text-lg  px-4 py-1 hover:bg-secondary rounded mt-2 font-bold text-white leading-relaxed tracking-wide">
            Login
          </button>
        </form>

        <p className="my-3 text-center">
          <Link
            to={"/forgot-password"}
            className="hover:text-primary font-semibold"
          >
            Forgot password ?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPassword;
