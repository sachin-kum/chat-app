import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  VStack,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { BaseUrl } from "../BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirm_password: "",
    pic: null,
  });
  const [picLoading, setpicLoading] = useState();
  const [Loading, setLoading] = useState(false);

  const [showPass, setShowPass] = useState(false);
  const [showConPass, setShowConPass] = useState(false);

  const handleClickPass = () => {
    setShowPass(!showPass);
  };

  const handleClickCon = () => {
    setShowConPass(!showConPass);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    setLoading(true);
    if (
      !userData.name ||
      !userData.email ||
      !userData.password ||
      !userData.confirm_password
    ) {
      toast.error("Plese Fill the All Fields");
      setLoading(false);
    } else if (userData.password !== userData.confirm_password) {
      toast.error("Password and Confirm password does not match");
      setLoading(false);
    } else {
      const formdata = new FormData();
      formdata.append("name", userData.name);
      formdata.append("email", userData.email);

      formdata.append("password", userData.password);

      formdata.append("pic", userData.pic);
      axios
        .post(`${BaseUrl}/api/user/register`, formdata)
        .then((res) => {
          if (res?.data?.email == false && res?.data?.status_code == 409) {
            toast.error("Email Alredy exist");
            setLoading(false);
          } else if (res?.data?.success == true) {
            toast.success("Signup Successfully ");
            setLoading(false);
            navigate("/chats");
            localStorage.setItem("userInfo", JSON.stringify(res?.data));
          }
        })
        .catch((err) => {
          setLoading(false);
        });
    }
  };
  return (
    <>
      <VStack spacing="5px">
        <FormControl id="first-name" isRequired>
          <FormLabel>Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            value={userData.email}
            onChange={(e) => {
              setUserData({ ...userData, email: e.target.value });
            }}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Enter Password"
              value={userData.password}
              onChange={(e) =>
                setUserData({ ...userData, password: e.target.value })
              }
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClickPass}>
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <InputGroup size="md">
            <Input
              type={showConPass ? "text" : "password"}
              placeholder="Confirm password"
              value={userData.confirm_password}
              onChange={(e) =>
                setUserData({ ...userData, confirm_password: e.target.value })
              }
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClickCon}>
                {showConPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="pic">
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            onChange={(e) =>
              setUserData({ ...userData, pic: e.target.files[0] })
            }
          />
        </FormControl>
        {Loading ? (
          <Button colorScheme="blue" width="100%" style={{ marginTop: 15 }}>
            <Spinner />
          </Button>
        ) : (
          <Button
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
            // isLoading={picLoading}
          >
            Sign Up
          </Button>
        )}
      </VStack>
      <ToastContainer />
    </>
  );
};

export default Signup;
