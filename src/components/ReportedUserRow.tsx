import React, { FC } from "react";
import {
  Avatar,
  HStack,
  IconButton,
  Td,
  Text,
  Tooltip,
  Tr,
} from "@chakra-ui/react";
import { BsEye } from "react-icons/bs";
import { MdBlock, MdCancel } from "react-icons/md";
import { ReportedUser } from "../types/Report";
type ReportedUserRowProps = {
  report: ReportedUser;
  onViewUser: () => void;
  onBlockUser: () => void;
  onDismissReport: () => void;
};
export const ReportedUserRow: FC<ReportedUserRowProps> = ({
  report,
  onViewUser,
  onBlockUser,
  onDismissReport,
}) => {
  const { user, reporter, date, reason } = report;
  return (
    <Tr>
      <Td>
        <HStack>
          <Avatar
            src={user.profileUrl || ""}
            name={user?.loginInfo?.username || "Unknown user"}
          />
          <Text>{user?.loginInfo.username || "Unknown user"}</Text>
        </HStack>
      </Td>
      <Td>{reason}</Td>
      <Td>
        <HStack>
          <Avatar
            src={reporter.photoUrl}
            name={reporter.userName || reporter.displayName || "Unknown User"}
          />
          <Text>
            {reporter.userName || reporter.userName || "Unknown User"}
          </Text>
        </HStack>
      </Td>
      <Td>{new Date(date as number).toLocaleDateString()}</Td>
      <Td>
        <HStack>
          <Tooltip label="View User">
            <IconButton
              onClick={onViewUser}
              aria-label="view user"
              icon={<BsEye />}
            />
          </Tooltip>
          <Tooltip label="blockUser">
            <IconButton
              onClick={onBlockUser}
              aria-label="block user"
              icon={<MdBlock />}
            />
          </Tooltip>
          <Tooltip label="Dismiss Report">
            <IconButton
              onClick={onDismissReport}
              aria-label="dismiss Report"
              icon={<MdCancel color="orange" />}
            />
          </Tooltip>
        </HStack>
      </Td>
    </Tr>
  );
};
