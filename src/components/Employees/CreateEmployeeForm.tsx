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
  MenuItem,
  Alert,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { styled } from "@mui/system";

import {
  Employee,
  employeeFactory,
} from "../../shared/interfaces/employee.interface";
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

interface EmployeeFormData {
  firstName: string;
  lastName: string;
  jobType: number;
}

interface CreateEmployeeFormProps {
  createEmployee: (room: Partial<Employee>) => void;
}

const CreateEmployeeForm = (props: CreateEmployeeFormProps) => {
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
      jobType: 0,
    },
    validationSchema: Yup.object().shape({
      firstName: Yup.string().required("Employee first name is required."),
      lastName: Yup.string().required("Employee last name is required."),
      jobType: Yup.number().required("Employee job type is required."),
    }),
    onSubmit: async (formData: EmployeeFormData) => {
      try {
        const response = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}employee`,
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

        props.createEmployee(
          employeeFactory({
            ...formData,
            id: response.data,
          }) as Partial<Employee>
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
        New employee
      </Button>
      <Dialog open={open}>
        <DialogTitleStyled>
          <FormTitle>New employee</FormTitle>
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
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Create new employee
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
                Employee creation failed!
              </Alert>
            </Snackbar>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateEmployeeForm;
