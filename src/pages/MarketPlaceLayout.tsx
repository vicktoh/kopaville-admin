import { Flex } from '@chakra-ui/react';
import React, {FC} from 'react';
import { Outlet } from 'react-router-dom';
import { MarketTopNav } from '../components/MarketTopNav';






export const MarketPlaceLayout: FC = ()=> {


   return (
      <Flex direction="column" width="100%" position="relative">
         <MarketTopNav />
         <Outlet />
      </Flex>
      
   )
}