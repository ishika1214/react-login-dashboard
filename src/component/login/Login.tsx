import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLoginData } from "./LoginSlice";
import { FormHelperText } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const dispatch = useDispatch();

  const validateEmail = (email: string) => {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)) {
      return false;
    }
    return true;
  };

  const validatePassword = (password: string) => {
    if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,16}$/.test(
        password
      )
    ) {
      return false;
    }
    return true;
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleClick = () => {
    if (
      username.trim().length === 0 ||
      password.trim().length === 0 ||
      !validateEmail(username) ||
      !validatePassword(password)
    ) {
      setHasError(true);
      return;
    } else {
      dispatch(
        setLoginData({
          username: username,
          password: password,
        })
      );
      navigate("/dashboard");
    }
  };

  return (
    <div className="loginpage">
      <h1>Login</h1>
      <div className="form">
        <div className="input-container">
          <label>Email </label>
          <input
            type="text"
            name="uname"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (!validateEmail(username) || !username) {
                setHasError(true);
              }
            }}
          />
          
        </div>
        {!username && hasError && (
          <FormHelperText>Please Enter Email</FormHelperText>
        )}
        {!validateEmail(username) && hasError && username && (
          <FormHelperText>Please Enter valid email</FormHelperText>
        )}
        
        <div className="input-container">
          <label>Password </label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            name="pass"
            onChange={(e) => {
              setPassword(e.target.value);
              if (!validatePassword(password) || !password) {
                setHasError(true);
              }
            }}
          />
          <button type="button" onClick={togglePasswordVisibility}>
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        {!password && hasError && (
          <FormHelperText>Please Enter password</FormHelperText>
        )}
        {!validatePassword(password) && hasError && password && (
          <FormHelperText>Password should conatain 1 upperCase 1 lower case a digit and a special character</FormHelperText>
        )}
        <div className="button-container">
          <button onClick={handleClick}>submit</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
