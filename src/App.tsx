import { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider } from "@mui/system";
import DateAdapter from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

import { theme } from "./utils/styles/theme";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import Customers from "./pages/Customers";
import Employees from "./pages/Employees";
import Navbar from "./components/Navbar";
import AuthContext, { AuthContextProvider } from "./store/AuthContext";

const MainSection = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/customers" element={<Customers />}/>
        <Route path="/employees" element={<Employees />}/>
      </Routes>
    </>
  );
};

const App = () => {
  const auth = useContext(AuthContext);

  return (
    <AuthContextProvider>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={DateAdapter}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              {auth.isLoggedIn ? (
                <>
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                  <Route path="/dashboard/*" element={<MainSection />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/login" />}></Route>
              )}
            </Routes>
          </Router>
        </LocalizationProvider>
      </ThemeProvider>
    </AuthContextProvider>
  );
};

export default App;
