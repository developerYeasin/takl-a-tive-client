import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { AiFillEyeInvisible, AiFillEye } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

const SignUp = () => {
  const [passwordShow, setPasswordShow] = useState(false);
  const [passwordShowCureect, setPasswordShowCureect] = useState(false);
  const [pic, setPic] = useState(null);
  const [loading, setLoading] = useState(false);
  const [matchPassword, setMatchPassword] = useState(true);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const postImg = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      console.log("image is undefined");
    }
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "developeryeasin");

      fetch("https://api.cloudinary.com/v1_1/developeryeasin/image/upload", {
        method: "POST",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    }
  };

  const toast = useToast();

  const onSubmit = async (data) => {
    if (data.password !== data.currectPassword) {
      setMatchPassword(false);
    } else {
      setMatchPassword(true);

      if (pic) {
        setLoading(true);
        const newData = await { ...data, pic: pic };

        // fetch("https://mern-takl-a-tive.herokuapp.com/users", {
        fetch("http://localhost:5000/users", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(newData),
        })
          .then((res) => res.json())
          .then((resData) => {
            if (resData.message) {
              toast({
                title: resData.message,
                description: "Failed to load the Chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "top",
              });
              setLoading(false);
            } else {
              localStorage.setItem("userInfo", JSON.stringify(resData));
              navigate("/chat");
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err);
            toast({
              title: "Error occured",
              description: "Failed to load the Chats",
              status: "error",
              duration: 5000,
              isClosable: true,
              position: "bottom-left",
            });
            setLoading(false);
          });
      }
    }
  };

  return (
    <Container>
      <SignUpCard>
        <SignUpTitle>Sign up</SignUpTitle>
        <SignUpFrom onSubmit={handleSubmit(onSubmit)}>
          <input
            id="name"
            placeholder="Type your name"
            type="text"
            {...register("name", { required: true })}
          />
          {errors.name && <span>Name is required</span>}
          <input
            id="email"
            placeholder="Type your email"
            type="email"
            {...register("email", { required: true })}
          />
          {errors.email && <span>Name is required</span>}
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
          <FormInput>
            <input
              type={passwordShowCureect ? "text" : "password"}
              placeholder="Currect Password"
              {...register("currectPassword", { required: true })}
            />

            <IPB onClick={() => setPasswordShowCureect(!passwordShowCureect)}>
              {passwordShowCureect ? <AiFillEyeInvisible /> : <AiFillEye />}
            </IPB>
            {errors.currectPassword && <span>Name is required</span>}
            {matchPassword === false && <span>Password not match</span>}
          </FormInput>
          <input type="file" onChange={(e) => postImg(e.target.files[0])} />
          <SignUpBtn type="submit">
            {loading ? "Wait..." : "Sign Up"}
          </SignUpBtn>{" "}
          <br />
          <HaveAccount>
            <Link to="/login">I have allready account</Link>
          </HaveAccount>
        </SignUpFrom>
      </SignUpCard>
    </Container>
  );
};

const Container = styled.div`
  height: 100vh;
  background-image: url("/images/sign-up-bg.jpg");
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
  background: linear-gradient(45deg, #ffffff12, #ffffff59);
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
  display: inline-block;
  border: none;
  background: linear-gradient(90deg, #32cb61 10%, #10b5f5 100%);
  padding: 12px 26px;
  border-radius: 5px;
  color: #fafafa;
  cursor: pointer;
`;
const SignUpTitle = styled.h2`
  text-align: center;
`;
const HaveAccount = styled.p`
  text-align: left;
`;

export default SignUp;
