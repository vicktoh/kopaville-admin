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
import { BsEye, BsTrash } from "react-icons/bs";
import { MdBlock, MdCancel } from "react-icons/md";
import { Report } from "../types/Report";
type ReportRowProps = {
  report: Report;
  onViewPost: () => void;
  onBlockUser: () => void;
  onDeletePost: () => void;
  onDismissReport: () => void;
};
export const ReportRow: FC<ReportRowProps> = ({
  report,
  onViewPost,
  onBlockUser,
  onDeletePost,
  onDismissReport,
}) => {
  const { post, reporter, date, reason } = report;
  return (
    <Tr>
      <Td>
        <HStack>
          <Avatar
            src={post.avartar.photoUrl}
            name={post.avartar.username || "Unknown user"}
          />
          <Text>{post.avartar?.username || "Unknown user"}</Text>
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
          <Tooltip label="View Post">
            <IconButton
              onClick={onViewPost}
              aria-label="view post"
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
          <Tooltip label="Delete Post">
            <IconButton
              onClick={onDeletePost}
              aria-label="delete post"
              icon={<BsTrash />}
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
