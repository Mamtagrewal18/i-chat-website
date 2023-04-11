import { ChatState } from "@/context/chatProvider";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Text, useToast } from "@chakra-ui/react";
import React from "react";
import ChatLoading from "./ChatLoading";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import GroupChatModal from "./miscellaneous/GroupChatModal";
const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const toast = useToast();
  const { user, setChats, chats, selectedChat, setSelectedChat } = ChatState();

  const getSender = (loggedUser, users, chat) => {
    if (!users) {
      console.log(chat);
    }
    if (users[0]._id == loggedUser._id) return users[1].name;
    else return users[0].name;
  };
  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        "http://localhost:5000/api/chats",
        config
      );
      setChats(data);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);
  return (
    <Box
      d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        d="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            d="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat?.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );

  // return (
  //   <Box
  //     d="flex"
  //     alignItems={"center"}
  //     p={3}
  //     bg="white"
  //     borderRadius="1g"
  //     borderWidth={"1px"}
  //     w={{ base: "100%", md: "31%" }}
  //   >
  //     <Box>
  //       <Flex justify={"space-between"}>
  //         <Text fontSize={{ base: "2xl", md: "sm" }}>My Chats</Text>
  //         <Button rightIcon={<AddIcon />}>New Group Chat</Button>
  //       </Flex>
  //     </Box>

  //     <Box
  //       d="flex"
  //       overflowY={"hidden"}
  //       p={3}
  //       bg={"#F8F8F8"}
  //       w="100%"
  //       h="100%"
  //       borderRadius={"1g"}
  //     >
  //       {chats ? (
  //         <Stack overflowY="scroll">
  //           {chats.map((chat) => {
  //             <Box>
  //               <Text>HI</Text>
  //               <Text>
  //                 {chat.isGroupChat
  //                   ? chat.chatName
  //                   : getSender(loggedUser, chat.users, chat)}
  //               </Text>
  //               <Text>
  //                 {chat.latestMessage && (
  //                   <Text fontSize="xs">
  //                     <b>{chat.latestMessage.sender.name} : </b>
  //                     {chat.latestMessage.content.length > 50
  //                       ? chat.latestMessage.content.substring(0, 51) + "..."
  //                       : chat.latestMessage.content}
  //                   </Text>
  //                 )}
  //               </Text>
  //             </Box>;
  //           })}
  //         </Stack>
  //       ) : (
  //         <ChatLoading />
  //       )}
  //     </Box>
  //   </Box>
  // );
};

export default MyChats;
