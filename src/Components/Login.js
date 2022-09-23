import React, { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../App";

const Login = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [loggedInUser, setLoggedInUser] = useContext(UserContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const location = useLocation();
  const navigate = useNavigate();
  const { from } = location.state || { from: { pathname: "/" } };

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setLoggedInUser(userInfo);
      navigate(from, { replace: true });
    }
  }, []);

  const onSubmit = async (data) => {
    await fetch("https://talk-a-tive-server.herokuapp.com/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((user) => {
        if (user.message) {
          alert(user.message);
        } else {
          localStorage.setItem("userInfo", JSON.stringify(user));
          navigate("/chat", { replace: true });
        }
      })
      .catch((err) => alert(err));
  };

  return (
    <Container>
      <SignUpCard>
        <SignUpTitle>LogIn</SignUpTitle>
        <SignUpFrom onSubmit={handleSubmit(onSubmit)}>
          <input
            id="email"
            placeholder="Type your email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && <span>email is required</span>}
          <FormInput>
            <input
              type={passwordShow ? "text" : "password"}
              placeholder="Password"
              {...register("password", { required: true })}
            />
            <IPB onClick={() => setPasswordShow(!passwordShow)}>
              {passwordShow ? <AiFillEyeInvisible /> : <AiFillEye />}
            </IPB>
            {errors.password && <span>password is required</span>}
          </FormInput>
          <SignUpBtn>Login</SignUpBtn> <br />
          <HaveAccount>
            <Link to="/signup">I don't have any account</Link>
          </HaveAccount>
        </SignUpFrom>
      </SignUpCard>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  background-image: url("/images/login-bg.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center center;
  object-fit: contain;
  width: 100%;
  position: relative;
  z-index: 9;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgb(255 255 255 / 92%);
    z-index: -1;
  }
`;
const SignUpCard = styled.div`
  background: linear-gradient(45deg, #ffffff9e, #ffffff9e);
  box-shadow: 0 0 20px -5px #111;
  padding: 30px;
  border-radius: 10px;
  width: 40%;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const SignUpFrom = styled.form`
  text-align: center;
  input {
    width: 100%;
    padding: 10px 10px;
    margin: 10px 0;
    font-size: 18px;
    border: none;
    background: #87ebd84a;
    color: #fff;
    font-weight: 600;

    &:focus {
      outline: none;
    }
    &::placeholder {
      color: #fff;
    }
  }
`;
const FormInput = styled.div`
  position: relative;
`;
const IPB = styled.span`
  position: absolute;
  top: 51%;
  right: 0;
  transform: translate(-20%, -50%);
  font-size: 20px;
  color: #6f6f6fde;
`;
const SignUpBtn = styled.button`
  font-size: 20px;
  font-weight: 600;
  cursor: pointer;
  display: inline-block;
  border: none;
  background: linear-gradient(90deg, #32cb61 10%, #10b5f5 100%);
  padding: 12px 26px;
  border-radius: 5px;
  color: #fafafa;
`;
const SignUpTitle = styled.h2`
  text-align: center;
`;
const HaveAccount = styled.p`
  text-align: left;
`;

export default Login;
