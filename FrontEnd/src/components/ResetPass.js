import React, { useState } from "react";
import "./styles/forgotpass.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const ResetPass = ({ toast }) => {
  const { id, token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  function resetPass(e) {
    e.preventDefault();
    if(newPassword === confirmPassword){
    axios
      .post(`${process.env.REACT_APP_API_URL}auth/resetPassword/${id}/${token}`, {
        newPassword,
      })
      .then((res) => {
        console.log(res);
        if(res.data.status === "success"){
          toast.success(res.data.msg);
          setNewPassword("");
          setConfirmPassword("");
          setTimeout(function(){
            navigate("/");
          },500);
          
        } else {
          toast.error(res.data.msg);
        }
      }).catch((err) => {
        toast.error(err);
      });  
    } else {
      toast.error("Password and confirm password doesn't match");
    }
  }

  return (
    <div className="forgot-con">
      <h3>reset password</h3>
      <label htmlFor="new pass">Enter your new password</label>
      <input
        type="password"
        placeholder="New password"
        onChange={(e) => setNewPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm New Password"
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      <button onClick={resetPass}>submit</button>
    </div>
  );
};

export default ResetPass;
