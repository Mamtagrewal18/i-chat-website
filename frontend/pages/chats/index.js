import React, { useEffect } from "react";
import { Stack, HStack, VStack, Flex } from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "@/context/chatProvider";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import MyChats from "../../components/MyChats";
import ChatBox from "@/components/chatBox";
import { Box } from "@chakra-ui/react";
import { useState } from "react";
const chats = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();
  // console.log(user);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer fetchAgain={fetchAgain} />}
      <Box d="flex" justifyContent="space-between" w="100%" h="91.5vh" p="10px">
        <Flex justify={"space-between"}>
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Flex>
      </Box>
    </div>
    // <Box width="100%">
    //   {user && <SideDrawer />}
    //   {user && <MyChat />}
    //   {user && <chatBox />}
    // </Box>
  );
};

export default chats;
