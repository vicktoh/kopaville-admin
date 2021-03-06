import React, { FC } from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";

import { Outlet } from "react-router-dom";
import { SideNav } from "../components/SideNav";

export const Layout: FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false, lg: false });

  return (
    <Flex
      maxWidth="90rem"
      margin="0 auto"
      overflowX="hidden"
      borderWidth={1}
      position="relative"
    >
      {isMobile ? null : <SideNav />}

      <Flex ml={isMobile ? 0 : "16rem"} width="100%">
        {/* {isMobile ? <MobileNav/> : null} */}
        <Outlet />
      </Flex>
    </Flex>
  );
};
