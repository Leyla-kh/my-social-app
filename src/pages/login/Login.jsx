import { useContext, useReducer, useRef } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../Contex/AuthContext.js";
import { CircularProgress } from "@mui/material";
import { Link } from "react-router-dom";

export default function Login() {
  const email = useRef();
  const password = useRef();

  const { user, isFetching, error, dispatch } = useContext(AuthContext);
  const handleClick = (e) => {
    e.preventDefault();
    loginCall(
      { email: email.current.value, password: password.current.value },
      dispatch
    );
  };

  return (
    <div className="register">
      <div className="registerContainer">
        <div className="registerLeft">
          <h3 className="registerLogo">aoao Social Media</h3>
          <span className="registerDesc">
            enjoy of connect with friends easily
          </span>
        </div>
        <div className="registerRight">
          <form className="formBox" onSubmit={handleClick}>
            <input
              placeholder="Email"
              type="email"
              required
              className="loginInput"
              ref={email}
            />
            <input
              placeholder="Password"
              type="password"
              required
              minLength="6"
              className="loginInput"
              ref={password}
            />
            <button type="submit" className="registerBtn">
              {isFetching ? <CircularProgress size="25px" colo /> : "Login"}
            </button>
            <span className="forgotPass">Forgot Password?</span>
            <Link to="/register">
              <button className="newAccountBtn">Great a New Account</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
