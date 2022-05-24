import { useContext, useState } from "react";
import { Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import { Employee } from "../../shared/interfaces/employee.interface";
import AuthContext from "../../store/AuthContext";
import ChangeEmployeeForm from "./ChangeEmployeeForm";

const DataTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  fontFamily: "inherit",
  lineHeight: "2.5rem",
  fontWeight: "normal",
}));

const DataBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  padding: "2rem",
}));

const TitleDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

interface EmployeeDataProps {
  employeeData: Employee;
  deleteEmployee: (id: string) => void;
  updateEmployee: (employee: Partial<Employee>) => void;
}

const EmployeeData = (props: EmployeeDataProps) => {
  const [openError, setOpenError] = useState(false);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const auth = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}employee`,
        data: { id: props.employeeData.id },
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

      props.deleteEmployee(props.employeeData.id);
    } catch (err) {
      const error = err as Error;
      setOpenError(true);
      console.log(error);
    }
  };

  return (
    <DataBox>
      <TitleDiv>
        <DataTitle>Selected employee</DataTitle>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete employee
        </Button>
      </TitleDiv>
      <ChangeEmployeeForm
        initialValues={props.employeeData}
        updateEmployee={props.updateEmployee}
      />
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
          Employee deletion failed!
        </Alert>
      </Snackbar>
    </DataBox>
  );
};

export default EmployeeData;
