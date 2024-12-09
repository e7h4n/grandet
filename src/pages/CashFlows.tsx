import CashFlows from '../components/CashFlows';
import NavBar from '../components/NavBar';
import { Container, Box } from '@mui/material';

export default function CashFlowsPage() {
  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 2 }}>
          <CashFlows />
        </Box>
      </Container>
    </>
  );
}
