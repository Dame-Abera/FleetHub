import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import ContactDetailsPage from './pages/ContactDetailsPage';
import DashboardPage from './pages/DashboardPage';
import AddCarPage from './pages/AddCarPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AccountPage from './pages/AccountPage';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/cars" element={<CarsPage />} />
                <Route path="/cars/:id" element={<CarDetailPage />} />
                <Route path="/contact/:userId" element={<ContactDetailsPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/cars/new" element={<AddCarPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
