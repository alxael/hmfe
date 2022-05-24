import { useContext, useState } from "react";
import { TextField, Button, Grid, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import * as Yup from "yup";
import axios from "axios";

import {
  Customer,
  customerFactory,
} from "../../shared/interfaces/customer.interface";
import AuthContext from "../../store/AuthContext";
import { useFormik } from "formik";

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
  fontWeight: "500",
  color: theme.palette.primary.contrastText,
}));

interface ChangeCustomerFormProps {
  initialValues: Customer;
  updateCustomer: (room: Partial<Customer>) => void;
}

const ChangeCustomerForm = (props: ChangeCustomerFormProps) => {
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.initialValues,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Customer first name is required."),
      lastName: Yup.string().required("Customer last name is required."),
      address: Yup.string().required("Customer address is required."),
      phoneNumber: Yup.string().required("Customer phone number is required."),
      email: Yup.string().required("Customer email is required."),
    }),
    onSubmit: async (formData: Partial<Customer>) => {
      try {
        const response = await axios({
          method: "PUT",
          url: `${process.env.REACT_APP_API_URL}customer`,
          data: { ...formData, id: props.initialValues.id },
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

        props.updateCustomer(
          customerFactory({
            id: props.initialValues.id,
            ...formData,
          })
        );
      } catch (err) {
        const error = err as Error;
        setOpenError(true);
        console.log(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <FormField
            fullWidth
            color="primary"
            id="firstName"
            name="firstName"
            label="First name"
            variant="outlined"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>

        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={4}>
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
        </Grid>
        <Grid item xs={2}>
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
            helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
          />
        </Grid>
        <Grid item xs={6}>
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
        </Grid>
        <Grid item xs={12}>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Update customer
          </SubmitButton>
        </Grid>

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
            Customer update failed!
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
};

export default ChangeCustomerForm;
