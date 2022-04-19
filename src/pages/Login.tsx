import { Flex, Grid, GridItem, Image, useBreakpointValue } from '@chakra-ui/react';
import { FC } from 'react';
import corperImage from '../assets/images/corpers.png';
import { LoginForm } from '../components/LoginForm';
export const Login: FC = () => {
    const isMobile = useBreakpointValue({base: true, md: false, lg: false});
    return (
    <Flex width="100vw" height="100vh" >
       <Grid width="100%" templateColumns={{base: 'repeat(1 ,1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(2, 1fr)'}} gap={5}>
           { !isMobile ? <GridItem  width="100%" display="flex" height="100%" justifyContent="center" alignItems="center" >
               <Image src = {corperImage} maxHeight="600"   />
           </GridItem> : null}
           <GridItem width="100%" display="flex" height="100%" justifyContent={{base: 'center', md: 'flex-start' }} alignItems="center">
               <LoginForm />
           </GridItem>
       </Grid>

    </Flex>);
};
