import { ChatState } from "@/context/chatProvider";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import SearchChat from "./SearchChat";
import UserBadgeList from "./UserBadgeList";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chatName, setName] = useState("");
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const toast = useToast();
  const { user, chats, setChats, setSelectedChat } = ChatState();
  const [loading, setLoading] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const addUser = (u) => {
    if (selectedUsers.length >= 4) {
      toast({
        title: "maximum 4 members allowed",
        duration: "500",
      });
      return;
    }
    if (selectedUsers.find((u1) => u1._id === u._id)) {
      toast({
        title: "User Already Exist",
        duration: "500",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, u]);
  };
  const deleteUser = (id) => {
    const a = String(id);
    console.log(id);
    const arr = selectedUsers.filter((u) => {
      return u._id !== a;
    });
    console.log(selectedUsers, arr);
    setSelectedUsers([...arr]);
  };
  const handleSearch = async (e) => {
    setSearch(e.target.value);
    if (!search) return;
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      const result = data.filter((user_) => {
        return user_._id != user._id;
      });
      setSearchResult(result);
      //   console.log(searchResult);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Network Error",
        status: "warning",
        duration: 1000,
      });
      setLoading(false);
    }
  };
  const submitHandler = async () => {
    if (selectedUsers.length < 2) {
      toast({
        title: "minimum 3 members required",
        duration: 500,
        status: "warning",
      });
      return;
    }
    try {
      const url = "http://localhost:5000/api/chats/group";
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const data1 = {
        name: chatName,
        users: JSON.stringify(selectedUsers.map((u) => u._id)),
      };
      const { data } = await axios.post(url, data1, config);
      console.log(data);
      setSelectedUsers([]);
      setSearch("");
      setName("");
      onClose();
      console.log(data);
      setChats([data, ...chats]);
      console.log(chats);
      setSelectedChat(data);
    } catch (error) {
      toast({
        title: "failed to create group chat",
        duration: 2000,
        isClosable: true,
        status: "error",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal overflowX={"hidden"} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <Flex>
            <ModalBody>
              <FormControl>
                <Input
                  value={chatName}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="chatName..."
                />
              </FormControl>
              <FormControl mt={"10px"}>
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Add Users..."
                />
              </FormControl>
              <Box>
                <HStack>
                  {selectedUsers?.map((u) => {
                    return (
                      <UserBadgeList
                        key={u._id}
                        user={u}
                        handleFunction={() => deleteUser(u._id)}
                      />
                    );
                  })}
                </HStack>
              </Box>
              <Box mt={2} maxH={"200px"} overflowY={"scroll"}>
                {loading ? (
                  <Text>Loading...</Text>
                ) : (
                  searchResult?.map((user_) => {
                    return (
                      <SearchChat
                        key={user_._id}
                        user={user_}
                        handleFunction={() => addUser(user_)}
                      />
                    );
                  })
                )}
              </Box>
            </ModalBody>
          </Flex>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={submitHandler}>
              Create
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
