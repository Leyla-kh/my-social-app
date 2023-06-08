import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { axiosInstance } from "../../config";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const passwordAgain = useRef();
  const history = useNavigate();
  const handleClick = async (e) => {
    e.preventDefault();
    if (password.current.value !== passwordAgain.current.value) {
      passwordAgain.current.setCustomValidity("Password don't match!");
    } else {
      const user = {
        username: username.current.value,
        email: email.current.value,
        password: password.current.value,
      };
      try {
        await axiosInstance.post("/auth/register", user);
        history("/login");
      } catch (error) {
        console.log(error);
      }
    }
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
          <form className="registerBox" onSubmit={handleClick}>
            <input
              ref={email}
              type="email"
              placeholder="Email"
              className="registerInput"
            />
            <input
              ref={username}
              placeholder="User Name"
              className="registerInput"
            />
            <input
              ref={password}
              type="password"
              placeholder="Password"
              className="registerInput"
              minLength="6"
            />
            <input
              ref={passwordAgain}
              type="password"
              placeholder="PasswordAgain"
              className="registerInput"
            />
            <button className="registerBtn" type="submit">
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
