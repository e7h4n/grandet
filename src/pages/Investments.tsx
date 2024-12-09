import { Box, Container } from '@mui/material';
import NavBar from '../components/NavBar';
import Investments from '../components/Investments';

export const InvestmentsPage = () => {
  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 2 }}>
          <Investments />
        </Box>
      </Container>
    </>
  );
};
