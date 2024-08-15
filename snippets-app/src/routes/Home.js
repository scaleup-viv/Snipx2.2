import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  // Calling useNavigate hook and storing the returned navigate function
  const navigate = useNavigate();
  // redirect user from "/" to "/login" to check user's auth status on component mount
  useEffect(() => {
    return navigate("/login");
  }, [navigate]);

  return <h1>Home</h1>;
};

export default Home;