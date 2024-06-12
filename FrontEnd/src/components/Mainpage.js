import React, { useState } from "react";
import "../App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Mainpage({ toast, signIn, user }) {
  //ReactSession.setStoreType("localStorage");
  const navigate = useNavigate();
  console.log("loggedin: " + window.sessionStorage.getItem("loggedIn"));
  //if(ReactSession.get("loggedInd") === "yes"){
  if(window.sessionStorage.getItem("loggedIn") === "yes"){
    navigate("/Home");
  }
  const [users, setUsers] = useState({ userName: "", email: "", password: "" });
  const [userLogin, setUserLogin] = useState({ email: "", password: "" });
  

  const openForgotPass = () => {
    navigate("/forgotpass");
  };

  function handleOnchange(e) {
    setUsers({
      ...users,
      [e.target.name]: e.target.value,
    });
  }

  function handleUserLogin(e) {
    setUserLogin({
      ...userLogin,
      [e.target.name]: e.target.value,
    });
  }
  axios.defaults.withCredentials = true;
  const handleLogin = (e) => {
    e.preventDefault();
    if (userLogin.email === "" || userLogin.password === "") {
      toast.error("Enter the details");
      return;
    }
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/login`, userLogin)
      .then((result) => {
        console.log(result);
        if (result.data.status === 'success') {
          toast.success("Login successfully");
          user = false;
          window.sessionStorage.setItem("loggedIn", "yes");
          window.sessionStorage.setItem("username", result.data.user.username);
          setUserLogin({ email: "", password: "" });
          navigate("/Home");
        } else {
          toast.error("Enter the correct details");
        }
      })
      .catch((err) => {
        //console.log(err);
        //toast.error(err);
        toast.error("Invalid username/password");
      });
    
  };

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/register`, users)
      .then((result) => {
        console.log(result);
        if (result.data !== "Already Registerd") {
          toast.success("Registered Successfully..");
          setUsers({ userName: "", email: "", password: "" });
          signIn();
        } else {
          toast.error(result.data);
          setUsers({ userName: "", email: "", password: "" });
          signIn();
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="form-container sign-up">
        <form method="POST" action="/" onSubmit={(e) => handleRegister(e)}>
          <h1>Create Account</h1>
          
          <input
            type="text"
            placeholder="Username"
            id="userName"
            name="userName"
            value={users.userName}
            onChange={(e) => handleOnchange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            id="email"
            name="email"
            value={users.email}
            onChange={(e) => handleOnchange(e)}
          />
          <input
            type="password"
            placeholder="Password"
            id="password"
            name="password"
            value={users.password}
            onChange={(e) => handleOnchange(e)}
          />
          <button className="bt" type="submit">
            Sign Up
          </button>
        </form>
      </div>

      <div className="form-container sign-in">
        <form method="POST" action="/" onSubmit={(e) => handleLogin(e)}>
          <h1>Sign In</h1>
          <input
            type="email"
            name="email"
            value={userLogin.email}
            onChange={(e) => handleUserLogin(e)}
            placeholder="Email"
          />
          <input
            type="password"
            name="password"
            value={userLogin.password}
            onChange={(e) => handleUserLogin(e)}
            placeholder="Password"
          />
          <a onClick={openForgotPass} href="/forgotpass">
            Forget your password?
          </a>
          <button className="bt" type="submit">
            Sign In
          </button>
        </form>
      </div>
    </>
  );
}
