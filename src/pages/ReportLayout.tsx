import React, { FC } from "react";
import { Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { ReportTopNav } from "../components/ReportTopNav";

export const ReportLayout: FC = () => {
  return (
    <Flex direction="column" width="100%" position="relative">
      <ReportTopNav />
      <Outlet />
    </Flex>
  );
};
