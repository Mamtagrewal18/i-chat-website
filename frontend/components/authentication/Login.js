import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Icon,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";
import { Toast } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { createHashHistory } from "history";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const navigate = useNavigate();
  const router = useRouter();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  // const history = useHistory();
  // const history = createHashHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setshowPassword(!showPassword);
  };

  const submitHandler = async () => {
    // console.log("submit");
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/user/login",
        { email, password },
        config
      );
      // console.log(data);
      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
        status: "success",
        description: "" + data.toString(),
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      router.replace("/chats");
      // history.push("./chats");
      // navigate("/chats");
    } catch (error) {
      // console.log(error);
      toast({
        title: "Error Occured!",
        description: "e",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };
  const submitHandler2 = async (e) => {
    // console.log("email");
    e.preventDefault();
    setLoading(true);
    if (!email || !password) {
      toast({
        title: "Please Fill all the details",
        duration: 2000,
        status: "error",
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
      await axios
        .post(
          "http://localhost:5000/api/user/login",
          {
            email,
            password,
          },
          config
        )
        .then(({ data }) => {
          // console.log(data);
          toast({
            title: "login Successfull***",
            duration: 1000,
            isClosable: true,
            position: "bottom",
            status: "success",
          });
          // console.log(1);
          // console.log(history);

          localStorage.setItem("userInfo", JSON.stringify(data));

          setLoading(false);

          // history.push("/chats");
        });
    } catch (error) {
      // console.log("***");
      // console.log(error);
      toast({
        title: "Error occured***",
        description: error.response?.data?.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
    // setEmail("");
    // setPassword("");
  };
  return (
    <Flex width={"full"} justifyContent="center" align="center">
      <Box p={2} width="full" borderWidth={1} borderRadius={8} boxShadow="lg">
        <form>
          <FormControl isRequired={true}>
            <FormLabel>Email Address</FormLabel>
            <Input
              type="text"
              placeholder="Enter Your Email Address"
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
                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                  {showPassword ? "hide" : "show"}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Button
            variant={"outline"}
            mt={6}
            width={"full"}
            colorScheme="blue"
            onClick={submitHandler}
          >
            Sign In
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default Login;
