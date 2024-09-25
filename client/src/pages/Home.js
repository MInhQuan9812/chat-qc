import React from "react";
import { logout, setOnlineUser, setSocketConnection, setUser } from "../redux/userSlice";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import  io  from "socket.io-client";
import axios from 'axios'
import Sidebar from "../components/Sidebar";

const Home = () => {
  const user=useSelector(state=>state.user)
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();


  console.log(user)
  const fetchUserDetails = async () => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-detail`;
      const response = await axios({
        url: URL,
        withCredentials: true,
      });

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/email");
      }
    } catch (error) {
      console.log("error",error)
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const socketConnection = io(process.env.REACT_APP_BACKEND_URL,{
      auth : {
        token : localStorage.getItem('token')
      }});

    socketConnection.on('onlineUser', (data) => {
      console.log(data);
      dispatch(setOnlineUser(data));
    });

    // dispatch(setSocketConnection(socketConnection))
    // socketConnection.on('connect', () => {
    //   console.log('Socket connected:', socketConnection.id);
    // });

    // socketConnection.on('connect_error', (error) => {
    //   console.error('Socket connection error:', error);
    // });
    return()=>{
      socketConnection.disconnect()
    }
  },[]);


  const basePath = location.pathname === '/'

  return (
    <div className="grid lg:grid-cols-[300px,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <Sidebar />

      </section>

      {/**message component**/}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>

      <div
        className={`justify-center items-center flex-col gap-2 hidden ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div>
          <img src="" width={250} alt="logo" />
        </div>
        <p className="text-lg mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
