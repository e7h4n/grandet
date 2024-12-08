import { useLoadable } from 'rippling';
import { authedAtom, userAtom } from './atoms/auth';
import { AuthPage } from './components/AuthPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { Container, Box, CircularProgress } from '@mui/material';

export default function App() {
  const _user = useLoadable(userAtom);
  const _authed = useLoadable(authedAtom);

  if (_authed.state !== 'hasData' || _user.state !== 'hasData') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          gap: 2,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!_authed.data) {
    return <AuthPage />;
  }

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
