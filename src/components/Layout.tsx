import { Box, Container } from '@mui/material';
import NavBar from './NavBar';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 2, mb: 2 }}>{children}</Box>
      </Container>
    </>
  );
};

export default Layout;
