import { ChatState } from "@/context/chatProvider";
import {
  Box,
  Flex,
  FormControl,
  Input,
  InputGroup,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Center, Square, Circle } from "@chakra-ui/react";
import { ArrowBackIcon, ViewIcon } from "@chakra-ui/icons";
import ProfileModal from "./miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./UpdateGroupChatModal";
import axios from "axios";
import ScrollableChat from "../components/ScrollableChat";
const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [newMessage, setNewMessage] = useState();
  const [messages, setMessages] = useState([]);
  const toast = useToast();
  const { selectedChat, user, setSelectedChat } = ChatState();

  const sendMessage = async (e) => {
    if (!newMessage) return;
    if (e.key === "Enter" && newMessage) {
      setNewMessage("");
      try {
        const { data } = await axios.post(
          "http://localhost:5000/api/messages",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "network error",
          duration: 1000,
          isClosable: true,
          status: "error",
        });
        console.log(error);
      }
    }
  };
  const getMessages = async () => {
    if (!selectedChat) return;
    try {
      const { data } = await axios.get(
        `http://localhost:5000/api/messages/${selectedChat._id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      setMessages(data);
      console.log(data);
    } catch (error) {
      toast({
        title: "network error in fetching messages",
        duration: 1000,
        isClosable: true,
        status: "error",
      });
    }
  };
  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };

  const getSender = (loggedUser, users, chat) => {
    if (!users) {
      console.log(chat);
    }
    if (users[0]._id == loggedUser._id) return users[1].name;
    else return users[0].name;
  };
  const getSenderFull = (loggedUser, users, chat) => {
    if (!users) {
      console.log(chat);
    }
    if (users[0]._id == loggedUser._id) return users[1];
    else return users[0];
  };

  useEffect(() => {
    getMessages();
  }, [selectedChat]);

  return (
    <>
      {selectedChat ? (
        <Box>
          <Box w={"100%"} h="20%" bg="whiteAlpha.400">
            <Flex justify={"space-between"}>
              <ArrowBackIcon
                d={{ base: "flex", md: "none" }}
                onClick={() => {
                  setSelectedChat("");
                }}
              />
              <Text>
                {!selectedChat?.isGroupChat
                  ? getSender(user, selectedChat.users)
                  : selectedChat?.chatName}
              </Text>
              {!selectedChat?.isGroupChat ? (
                <ProfileModal user={getSenderFull(user, selectedChat.users)}>
                  <ViewIcon />
                </ProfileModal>
              ) : (
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              )}
            </Flex>
          </Box>

          <Box
            d="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            <Box d="flex">
              <ScrollableChat messages={messages} />
            </Box>
            <FormControl onKeyDown={sendMessage}>
              <InputGroup>
                <Input
                  variant="filled"
                  bg="#E0E0E0"
                  placeholder="Enter a message.."
                  value={newMessage}
                  onChange={typingHandler}
                />
              </InputGroup>
            </FormControl>
          </Box>
        </Box>
      ) : (
        <Center h="100vh" bg="white">
          <Text fontSize="3xl">Click on user to begin Chat!</Text>
        </Center>
      )}
    </>
  );
};

export default SingleChat;
