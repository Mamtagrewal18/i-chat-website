import { Box, Flex } from "@chakra-ui/react";
import React from "react";
import axios from "axios";
const asyncHandler = require("express-async-handler");
import { useToast } from "@chakra-ui/react";

import { useHistory } from "react-router";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useRouter } from "next/router";
const Signup = () => {
  const router = useRouter();
  // const history = useHistory();
  const CLOUDINARY_API_KEY = "745612179691374";
  const CLOUDINARY_API_SECRET = "F3lqVG5iYACQL8xNPrsSUXZgK-0";
  const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dofupqnhw/image/upload";
  const UPLOAD_PRESET = "hemant";
  const CLOUD_NAME = "dofupqnhw";
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [showPassword, setshowPassword] = useState(false);
  const [showConfirmPassword, setshowConfirmPassowrd] = useState(false);
  const [pic, setPic] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const submitHandler = asyncHandler(async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!name || !password || !confirmPassword || !email) {
      toast({
        title: "Enter all Fields",
        description: "",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Password do not match",
        description: "",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
        },
        config
      );
      toast({
        title: "Registration Successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      router.replace("/chats");
      // history?.push("/api/chats");
    } catch (error) {
      console.log(error);
      toast({
        title: "oops something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      console.log(error);
      setLoading(false);
    }
  });
  const showPasswordHandler = () => {
    setshowPassword(!showPassword);
  };

  const showConfirmPasswordHandler = () => {
    setshowConfirmPassowrd(!showConfirmPassword);
  };

  async function postDetails(imageFile) {
    setLoading(true);
    if (!imageFile) {
      toast({
        title: "Select a image",
        description: "please select a image to process further",
        status: "warning",
        duration: 9000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    const data = new FormData();
    data.append("file", imageFile);
    data.append("upload_preset", String(UPLOAD_PRESET));
    data.append("api_key", String(CLOUDINARY_API_KEY));
    data.append("cloud_name", CLOUD_NAME);

    fetch(CLOUDINARY_URL, {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPic(data.url.toString());
        console.log(data.url.toString());
        setLoading(false);
        toast({
          title: "Success",
          description: "Sucess",
          status: "warning",
          duration: 9000,
          isClosable: true,
          position: "bottom",
        });
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

    // console.log(response.json());
    // console.log("successfil".red.bold);
  }

  return (
    <Flex width={"full"} justifyContent="center" align="center">
      <Box p={2} width="full" borderWidth={1} borderRadius={8} boxShadow="lg">
        <form onSubmit={submitHandler}>
          <FormControl isRequired={true}>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter Your Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </FormControl>

          <FormControl mt={6} isRequired={true}>
            <FormLabel>Email Address</FormLabel>
            <Input
              placeholder="Enter Your Email Address"
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </FormControl>

          <FormControl mt={6} isRequired={true}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter Your Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <InputRightElement width={"3rem"}>
                <Button h="1.5rem" size="sm" onClick={showPasswordHandler}>
                  {showPassword ? "hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={6} isRequired={true}>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
              <Input
                placeholder="Enter Your Password Again !."
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                }}
              />
              <InputRightElement width={"3rem"}>
                <Button
                  h="1.5rem"
                  size="sm"
                  onClick={showConfirmPasswordHandler}
                >
                  {showConfirmPassword ? "hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <FormControl mt={6} id={"pic"}>
            <FormLabel>Upload your Picture</FormLabel>
            <Input
              type="file"
              p={1.5}
              accept={"image/*"}
              onChange={(e) => postDetails(e.target.files[0])}
            />
          </FormControl>

          <Button
            variant={"outline"}
            type={"submit"}
            mt={6}
            width={"full"}
            colorScheme="blue"
            isLoading={loading}
          >
            Sign Up
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Signup;
