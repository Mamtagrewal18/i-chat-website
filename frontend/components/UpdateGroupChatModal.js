import { ChatState } from "@/context/chatProvider";
import axios from "axios";
import { InfoIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
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
import React, { useState } from "react";
import SearchChat from "./miscellaneous/SearchChat";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain }) => {
  const toast = useToast();
  const [name, setName] = useState();
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();

  const { selectedChat, user, setSelectedChat } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  //   console.log(selectedChat.users);
  const [loading, setLoading] = useState(false);
  const url = "http://localhost:5000/api/chats/";
  const aise_hi_func = () => {};
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
      console.log(searchResult);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Network Error",
        status: "warning",
        duration: 1000,
      });
      console.log(error);
      setLoading(false);
    }
  };

  const rename_group = async () => {
    // const url = "http://localhost:5000/api/chats/rename";
    if (!name) {
      toast({
        title: "enter name 😂",
        status: "error",
        duration: "1000",
        isClosable: true,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can rename the group ",
        duration: "1000",
        status: "info",
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const x = { chatId: selectedChat._id, chatName: selectedChat.chatName };
      const { data } = await axios.put(
        "http://localhost:5000/api/chats/rename",
        {
          chatId: selectedChat._id,
          chatName: name,
        },
        config
      );
      console.log(data);
      setFetchAgain(!fetchAgain);
      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Check your network",
        status: "error",
        duration: "1000",
        isClosable: true,
      });
      console.log("error", error);
      setLoading(false);
      return;
    }
  };
  const group_add = async (id) => {
    // console.log("grouyp Add");
    if (selectedChat.users.find((c) => c._id === id)) {
      toast({
        title: "User already in group ",
        status: "info",
        duration: "500",
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can add in group ",
        duration: "1000",
        status: "info",
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.put(
        url + "groupadd",
        {
          chatId: selectedChat._id,
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      toast({
        title: "new user added",
        duration: 1000,
        status: "info",
        isClosable: true,
      });
      setLoading(false);
      onClose();
    } catch (error) {
      toast({
        title: "failed try again",
        duration: 1000,
        status: "error",
        isClosable: true,
      });
      //   console.log(error);
      setLoading(false);
    }
  };

  const remove_grp = async (id) => {
    if (selectedChat.groupAdmin._id === id) {
      toast({
        title: "Admin can not be removed ! ",
        duration: "1000",
        status: "info",
        isClosable: true,
      });
      return;
    }
    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only admin can remove from group ",
        duration: "1000",
        status: "info",
        isClosable: true,
      });
      return;
    }

    try {
      const { data } = await axios.put(
        url + "groupremove",
        {
          chatId: selectedChat._id,
          userId: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);

      toast({
        title: "user removed",
        status: "info",
        duration: 1000,
        isClosable: true,
      });
      onClose();
      return;
    } catch (error) {
      toast({
        title: "Failed to remove from group",
        duration: "1000",
        isClosable: true,
        status: "error",
      });
      setLoading(false);
      return;
    }
  };
  return (
    <>
      <InfoIcon boxSize={5} onClick={onOpen} />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedChat?.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box d="flex" maxH={"200px"} overflowY={"scroll"}>
              {selectedChat.users.map((u) => {
                return (
                  <SearchChat
                    user={u}
                    handleFunction={() => {
                      remove_grp(u._id);
                    }}
                  />
                );
              })}
            </Box>
            <FormControl mt={2}>
              <InputGroup>
                <Input
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                  placeholder="Chat Name"
                />
                <InputRightElement width="4.5rem">
                  <Button colorScheme={"blue"} onClick={rename_group}>
                    Update
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <FormControl mt={2}>
              <InputGroup>
                <Input
                  value={search}
                  onChange={handleSearch}
                  placeholder="Search users to add"
                />
                <InputRightElement width="4.5rem">
                  <SearchIcon onClick={handleSearch} />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Box mt={2} maxH={"200px"} overflowY={"scroll"}>
              {loading ? (
                <Text>Loading...</Text>
              ) : (
                searchResult?.map((user_) => {
                  return (
                    <SearchChat
                      key={user_._id}
                      user={user_}
                      handleFunction={() => group_add(user_._id)}
                    />
                  );
                })
              )}
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
