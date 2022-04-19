import React, {FC, ReactElement, useEffect, useState} from 'react';
import { Box, Heading, HStack, Skeleton, Text, useToast } from '@chakra-ui/react';
import { roundNumbers } from '../services/utils';
import { BsGiftFill } from 'react-icons/bs';
import { FaCodeBranch, FaMoneyBillAlt } from 'react-icons/fa';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

type StatBoxProps = {
   count: number;
   title: string;
   icon: ReactElement
}

type StatsValues = {
   productCount: number;
   categoriesCount: number;
   vendorCount: number;
   productValue: number;
}

const StatBox: FC<StatBoxProps> = ({ count, title, icon})=>{

   return(
      <Box  bg = "brand.100" borderRadius="lg" p={5}>
         <HStack alignItems="center">
            {icon}
            <Heading fontSize="lg">
               {roundNumbers(count)}
            </Heading>
         </HStack>
         <Text mt={2} fontSize="sm">{title}</Text>
      </Box>
   )
}



export const ProductStats: FC = () => {
   const [stats, setStats] = useState<StatsValues>();
   const [isLoadingStats, setLoadingStats] = useState<boolean>(false);
   const toast = useToast();
   useEffect(()=>{
      async function getStats(){

         try {
            setLoadingStats(true)
         const ref = doc(db, "systemStats", "marketPlace");
         const snapshot = await getDoc(ref);
         if(snapshot.exists()){
            setStats(snapshot.data() as StatsValues);
         
         }
         } catch (error) {
            const err: any = error;
            toast({title: "error fetching Stats", description: err?.message || "unexpected error", status: "error" });
            console.log(error)
         }
         finally{
            setLoadingStats(false);
         }  
      }
      getStats();
   }, [toast])


   return(
      isLoadingStats && !stats ? 
      <HStack spacing={8}>
         <Skeleton width = "200" height={100} bg = "brand.300" borderRadius="lg"/>
      </HStack>
      :
      <HStack spacing={8}>
         <StatBox title = "Total Product" icon = {<BsGiftFill   color = "#2A9A4A" size={32} />} count ={stats?.productCount || 0} />
         <StatBox title = "Categories" icon = {<FaCodeBranch  color = "#2A9A4A" size={32} />} count ={stats?.categoriesCount || 0} />
         <StatBox title = "Product Value" icon = {<FaMoneyBillAlt  color = "#2A9A4A" size = {32} />} count ={stats?.productValue || 0} />
      </HStack>
   )
}