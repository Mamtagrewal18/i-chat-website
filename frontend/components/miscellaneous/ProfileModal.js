import React from "react";
import ViewIcon from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  IconButton,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { ChatState } from "@/context/chatProvider";

const ProfileModal = ({ children, user }) => {
  if (!user) user = ChatState();
  // const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />}></IconButton>
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontSize={"40px"} d="flex" justifyContent={"center"}>
            <Text>{user.name}</Text>
            <Text>{user.email}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody fontSize={"40px"} d="flex" justifyContent={"center"}>
            <Image src={user.picture} alt={user.name + " pic"} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
