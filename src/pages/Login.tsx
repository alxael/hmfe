import { styled } from "@mui/system";
import LoginForm from "../components/Auth/LoginForm";

const Main = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  height: "100vh",
  minHeight: "30rem",
  minWidth: "16rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  margin: "0rem"
}));

const Login = () => {
  return (
    <Main>
      <LoginForm />
    </Main>
  );
};

export default Login;
