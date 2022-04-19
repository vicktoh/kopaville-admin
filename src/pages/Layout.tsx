import { Flex, Grid, GridItem, useBreakpointValue } from '@chakra-ui/react';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from '../components/SideNav';

export const Layout: FC = () => {
    const isMobile = useBreakpointValue({ base: true, md: false, lg: false });
    const containerWidth = useBreakpointValue({
        base: '100%',
        md: '720px',
        lg: '1140px',
        xl: '1140px',
    });

    return (
        <Flex
            width={containerWidth}
            margin="0 auto"
            overflowX="hidden"
            borderWidth={1}
            position="relative"
        >
            <Grid
                width="100%"
                templateColumns={{
                    base: 'repeat(1, 1fr)',
                    md: 'repeat(6, 1fr)',
                    lg: 'repeat(6, 1fr)',
                }}
            >
                {isMobile ? null : (
                    <GridItem
                        colSpan={1}
                        width="100%"
                        position={'relative'}
                        height="100vh"
                    >
                        <SideNav />
                    </GridItem>
                )}
                <GridItem colSpan={isMobile ? 1 : 5}>
                    <Flex
                        width="100%"
                        position="relative"
                    >
                        {/* {isMobile ? <MobileNav/> : null} */}
                        <Outlet />
                    </Flex>
                </GridItem>
            </Grid>
        </Flex>
    );
};
