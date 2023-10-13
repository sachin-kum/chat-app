import React, { useState } from "react";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { Button, Spinner } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/layout";
import axios from "axios";
import { BaseUrl } from "../BaseUrl";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [Loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const submitHandler = () => {
    setLoading(true);
    if (!email || !password) {
      toast.error("All Fields are Required");
      setLoading(false);
    } else {
      axios
        .post(`${BaseUrl}/api/user/login`, {
          email,
          password,
        })
        .then((res) => {
          if (res?.data?.success == true) {
            localStorage.setItem("userInfo", JSON.stringify(res?.data));
            navigate("/chats");
            setLoading(false);
          }
        })
        .catch((err) => {
          if (
            err?.response?.data?.status_code == 409 &&
            err?.response?.data?.success == false
          ) {
            toast.error("Invalid Email or Password");
            setLoading(false);
          }
          setLoading(false);
        });
    }
  };
  return (
    <>
      <VStack spacing="10px">
        <FormControl id="email" isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            value={email}
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup size="md">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={show ? "text" : "password"}
              placeholder="Enter password"
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        {Loading ? (
          <Button colorScheme="blue" width="100%">
            <Spinner />
          </Button>
        ) : (
          <Button
            type="submit"
            colorScheme="blue"
            width="100%"
            style={{ marginTop: 15 }}
            onClick={submitHandler}
          >
            Login
          </Button>
        )}
        <Button
          variant="solid"
          colorScheme="red"
          width="100%"
          onClick={() => {
            setEmail("guest@example.com");
            setPassword("123456");
          }}
        >
          Get Guest User Credentials
        </Button>
      </VStack>
      <ToastContainer />
    </>
  );
};

export default Login;
