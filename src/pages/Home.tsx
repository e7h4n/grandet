import Dashboard from '../components/Dashboard';
import NavBar from '../components/NavBar';
import { Container, Box } from '@mui/material';

export default function HomePage() {
  return (
    <>
      <NavBar />
      <Container>
        <Box sx={{ mt: 2 }}>
          <Dashboard />
        </Box>
      </Container>
    </>
  );
}
