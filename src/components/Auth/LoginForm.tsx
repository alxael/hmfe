import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { styled } from "@mui/system";
import {
  Typography,
  Button,
  Box,
  Alert,
  TextField,
  Snackbar,
} from "@mui/material";
import axios from "axios";

import AuthContext from "../../store/AuthContext";

const FormBox = styled(Box)(({ theme }) => ({
  minWidth: "10rem",
  maxWidth: "35rem",
  width: "25%",
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  padding: "1rem 2rem 2rem 2rem",
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2.25rem",
  fontFamily: "inherit",
  lineHeight: "4rem",
  fontWeight: "normal",
}));

const FormField = styled(TextField)(({ theme }) => ({
  marginTop: "1rem",
  borderRadius: "0.6rem",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: "1rem",
  textAlign: "center",
  display: "inline-block",
  boxSizing: "border-box",
  borderRadius: "0.625rem",
  fontSize: "1rem",
  fontFamily: "inherit",
  lineHeight: "1.5rem",
  fontWeight: "normal",
  color: theme.palette.primary.contrastText,
}));

interface LoginData {
  username: string;
  password: string;
}

const LoginForm = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const auth = useContext(AuthContext);

  const handleClose = () => {
    setOpen(false);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("Username is required."),
      password: Yup.string().required("Password is required."),
    }),
    onSubmit: async (loginData: LoginData) => {
      try {
        const response = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}auth/login`,
          data: loginData,
          headers: {
            "Content-Type": "application/json",
          },
          responseType: "json",
          withCredentials: false,
        });

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }
        
        const expirationTime = new Date();
        expirationTime.setHours(expirationTime.getHours() + 2);
        auth.login(response.data.token as string, expirationTime.toISOString());
        navigate("/dashboard");
      } catch (err) {
        const error = err as Error;
        setOpen(true);
        console.log(error);
      }
    },
  });

  return (
    <FormBox>
      <FormTitle>Login</FormTitle>
      <form onSubmit={formik.handleSubmit}>
        <FormField
          fullWidth
          color="primary"
          id="username"
          name="username"
          label="Username"
          variant="outlined"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <FormField
          fullWidth
          color="primary"
          type="password"
          id="password"
          name="password"
          label="Password"
          variant="outlined"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <SubmitButton
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Login
        </SubmitButton>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            severity="error"
            elevation={6}
            variant="filled"
            sx={{ width: "100%" }}
          >
            Login failed!
          </Alert>
        </Snackbar>
      </form>
    </FormBox>
  );
};

export default LoginForm;
