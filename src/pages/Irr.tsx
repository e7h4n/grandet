import { Box, Container } from '@mui/material';
import CumulativeReturns from '../components/CumulativeReturns';
import NavBar from '../components/NavBar';

export function IrrPage() {
  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 2 }}>
          <CumulativeReturns />
        </Box>
      </Container>
    </>
  );
}
