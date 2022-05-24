import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import {
  Dialog,
  Button,
  Typography,
  TextField,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { styled } from "@mui/system";

import {
  Customer,
  customerFactory,
} from "../../shared/interfaces/customer.interface";
import AuthContext from "../../store/AuthContext";

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

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

interface CustomerFormData {
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
}

interface CreateCustomerFormProps {
  createCustomer: (room: Partial<Customer>) => void;
}

const CreateCustomerForm = (props: CreateCustomerFormProps) => {
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      address: "",
      phoneNumber: "",
      email: "",
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Customer first name is required."),
      lastName: Yup.string().required("Customer last name is required."),
      address: Yup.string().required("Customer address is required."),
      phoneNumber: Yup.string().required("Customer phone number is required."),
      email: Yup.string().required("Customer email is required."),
    }),
    onSubmit: async (formData: CustomerFormData) => {
      try {
        const response = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}customer`,
          data: formData,
          headers: {
            "Content-Type": "application/json",
            Authorization: auth.token,
          },
          responseType: "json",
          withCredentials: false,
        });

        if (response.status !== 200) {
          throw new Error(response.statusText);
        }

        props.createCustomer(
          customerFactory({
            ...formData,
            id: response.data,
          }) as Partial<Customer>
        );

        setOpen(false);
      } catch (err) {
        const error = err as Error;
        setOpenError(true);
        console.log(error);
      }
    },
  });

  return (
    <>
      <Button onClick={handleToggle} color="primary" variant="contained">
        New customer
      </Button>
      <Dialog open={open}>
        <DialogTitleStyled>
          <FormTitle>New customer</FormTitle>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </DialogTitleStyled>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <FormField
              fullWidth
              color="primary"
              id="firstName"
              name="firstName"
              label="First name"
              variant="outlined"
              value={formik.values.firstName}
              onChange={formik.handleChange}
              error={
                formik.touched.firstName && Boolean(formik.errors.firstName)
              }
              helperText={formik.touched.firstName && formik.errors.firstName}
            />
            <FormField
              fullWidth
              color="primary"
              id="lastName"
              name="lastName"
              label="Last name"
              variant="outlined"
              value={formik.values.lastName}
              onChange={formik.handleChange}
              error={formik.touched.lastName && Boolean(formik.errors.lastName)}
              helperText={formik.touched.lastName && formik.errors.lastName}
            />
            <FormField
              fullWidth
              color="primary"
              id="address"
              name="address"
              label="Address"
              variant="outlined"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
            <FormField
              fullWidth
              color="primary"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone number"
              variant="outlined"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                formik.touched.phoneNumber && formik.errors.phoneNumber
              }
            />
            <FormField
              fullWidth
              color="primary"
              id="email"
              name="email"
              label="Email"
              variant="outlined"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Create new customer
            </SubmitButton>
            <Snackbar
              open={openError}
              autoHideDuration={6000}
              onClose={handleErrorClose}
            >
              <Alert
                severity="error"
                elevation={6}
                variant="filled"
                sx={{ width: "100%" }}
              >
                Customer creation failed!
              </Alert>
            </Snackbar>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateCustomerForm;
