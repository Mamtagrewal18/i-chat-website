import React, { useState } from "react";
import SearchChat from "./SearchChat";
import { ChevronDownIcon, SearchIcon, BellIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Input,
  Spinner,
  Text,
  Toast,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Tooltip } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
} from "@chakra-ui/react";
import { Avatar, AvatarBadge, AvatarGroup } from "@chakra-ui/react";
import { ChatState } from "@/context/chatProvider";
import ProfileModal from "./ProfileModal";

import { useRouter } from "next/router";
import axios from "axios";
import ChatLoading from "../ChatLoading";
const SideDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, chats, setChats, selectedChat, setSelectedChat } = ChatState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const router = useRouter();
  const toast = useToast();
  //functions

  const searchHandler = async () => {
    if (!search) {
      toast({
        title: "Enter something in Search",
        status: "warning",
        duration: "1000",
        isClosable: "true",
      });
      return;
    }

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
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Failed to load the chats",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      console.log(userId);
      setLoadingChat(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/chats",
        { userId },
        config
      );
      console.log("data");
      console.log(data);
      setSelectedChat(data);
      if (!chats || !chats?.find((c) => c._id === data._id))
        setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
      console.log(chats);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    router.replace("/");
  };

  return (
    <>
      <Box
        d="flex"
        justifyContent={"space-between"}
        alignItems={"center"}
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"5px"}
      >
        <Flex justify={"space-between"}>
          <Tooltip label="search" hasArrow placement="bottom-end">
            <Button variant={"ghost"} onClick={onOpen}>
              <SearchIcon />
              <Text d={{ base: "none", md: "flex" }} px={4}>
                Search User
              </Text>
            </Button>
          </Tooltip>

          <Text fontSize={"2xl"}>I-Chat </Text>
          <Box>
            <Menu>
              <MenuButton p={1}>
                <BellIcon fontSize={"2xl"} m={1} />
              </MenuButton>
            </Menu>
            <Menu>
              <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                <Avatar size="sm" name={user.name} src={user.picture} />
              </MenuButton>

              <MenuList>
                <ProfileModal>Profile</ProfileModal>
                <MenuItem onClick={logoutHandler}>Log out</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Flex>
      </Box>
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Search Users</DrawerHeader>

          <DrawerBody>
            <Box>
              <Flex justifyContent={"space-between"}>
                <Input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  m={"5px"}
                  w={"80%"}
                  placeholder="Search by email or name..."
                />
                <Button
                  m={"5px"}
                  colorScheme={"messenger"}
                  onClick={searchHandler}
                >
                  GO
                </Button>
              </Flex>
            </Box>

            <Box>
              {loading ? (
                <ChatLoading />
              ) : searchResult.length > 0 ? (
                searchResult.map((user_) => {
                  return (
                    <SearchChat
                      user={user_}
                      key={user_._id}
                      handleFunction={() => accessChat(user_._id)}
                    />
                  );
                })
              ) : (
                <p>OOP NO SEARCH RESULT</p>
              )}
            </Box>
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancel
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
