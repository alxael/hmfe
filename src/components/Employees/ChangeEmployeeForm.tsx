import { useContext, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { styled } from "@mui/system";
import * as Yup from "yup";
import axios from "axios";

import {
  Employee,
  employeeFactory,
} from "../../shared/interfaces/employee.interface";
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

interface ChangeEmployeeFormProps {
  initialValues: Employee;
  updateEmployee: (room: Partial<Employee>) => void;
}

const ChangeEmployeeForm = (props: ChangeEmployeeFormProps) => {
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.initialValues,
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Employee first name is required."),
      lastName: Yup.string().required("Employee last name is required."),
      jobType: Yup.number().required("Employee job type is required."),
    }),
    onSubmit: async (formData: Partial<Employee>) => {
      try {
        const response = await axios({
          method: "PUT",
          url: `${process.env.REACT_APP_API_URL}employee`,
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

        props.updateEmployee(
          employeeFactory({
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
        <Grid item xs={5}>
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
        <Grid item xs={5}>
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
        <Grid item xs={2}>
          <FormField
            fullWidth
            select
            color="primary"
            id="jobType"
            name="jobType"
            label="Job type"
            variant="outlined"
            value={formik.values.jobType}
            onChange={formik.handleChange}
            error={formik.touched.jobType && Boolean(formik.errors.jobType)}
            helperText={formik.touched.jobType && formik.errors.jobType}
          >
            <MenuItem value={0}>Concierge</MenuItem>
            <MenuItem value={1}>Receptionist</MenuItem>
            <MenuItem value={2}>Cleaning</MenuItem>
            <MenuItem value={3}>Cooking</MenuItem>
          </FormField>
        </Grid>

        <Grid item xs={12}>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Update employee
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
            Employee update failed!
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
};

export default ChangeEmployeeForm;
