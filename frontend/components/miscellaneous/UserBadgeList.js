import React from "react";
import { Avatar, Badge } from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
const UserBadgeList = ({ user, handleFunction }) => {
  return (
    <>
      <Avatar src={user.picture} />
      <Badge ml="1" colorScheme="green">
        <CloseIcon onClick={handleFunction} />
      </Badge>
    </>
  );
};

export default UserBadgeList;
