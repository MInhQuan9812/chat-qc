import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthLayouts = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if(!token){
      handleLogout()
    }else{
      verifyToken(token)
    }
  },[navigate]);

  const verifyToken = async (token) => {
    try {
      const URL = `${process.env.REACT_APP_BACKEND_URL}/verify-token`;
      const response = await axios.post({
        url: URL,
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if(!response.ok){
        handleLogout()
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout=()=>{
    localStorage.removeItem('token')
    navigate('/email')
  }

  return (
    <>
      <header>Logo</header>
      {children}
    </>
  );
};

export default AuthLayouts;
