import { useLoadable } from 'rippling';
import { authedAtom, userAtom } from './atoms/auth';
import { AuthPage } from './components/AuthPage';
import Dashboard from './components/Dashboard';
import NavBar from './components/NavBar';
import { Container, Box } from '@mui/material';

export default function App() {
  const _user = useLoadable(userAtom);
  const _authed = useLoadable(authedAtom);

  if (_authed.state !== 'hasData' || _user.state !== 'hasData') {
    return <div>Loading...</div>;
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
