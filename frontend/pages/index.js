import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import Login from "@/components/authentication/Login.js";
import Signup from "@/components/authentication/Signup";
import styles from "@/styles/Home.module.css";
import {
  Box,
  Button,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        w={"100%"}
        bg={"white"}
        m={"400px 0 15px 0"}
        borderRadius="1g"
        borderWidth={"1px"}
      >
        <Text fontSize={"4xl"} color="black">
          Talk-A-Tive
        </Text>
        <Box
          color="black"
          textColor={"black"}
          bg="white"
          w="100%"
          p={4}
          borderRadius="1g"
          borderWidth={"1px"}
        >
          <Tabs variant="soft-rounded">
            <TabList mb="1em">
              <Tab width="50%">Login</Tab>
              <Tab width="50%">Signup</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login></Login>
              </TabPanel>
              <TabPanel>
                <Signup></Signup>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
}
