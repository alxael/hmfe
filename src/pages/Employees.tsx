import { useCallback, useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { styled } from "@mui/material";

import {
  Employee,
  employeeFactory,
} from "../shared/interfaces/employee.interface";
import AuthContext from "../store/AuthContext";
import EmployeesTable from "../components/Employees/EmployeesTable";
import CreateEmployeeForm from "../components/Employees/CreateEmployeeForm";
import EmployeeData from "../components/Employees/EmployeeData";

const TitleDiv = styled("div")({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

const Title = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2.25rem",
  fontFamily: "inherit",
  lineHeight: "4rem",
  fontWeight: "normal",
}));

const Main = styled("main")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  padding: "3rem 3rem 6rem 3rem",
  marginLeft: "14rem",
  minHeight: "100vh",
  overflow: "auto",
}));

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [currentEmployee, setCurrentEmployee] = useState<Employee>(
    employeeFactory()
  );

  const auth = useContext(AuthContext);

  const createEmployee = (employee: Partial<Employee>) => {
    setEmployees([...employees, employee as Employee]);
  };

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter((item) => item.id !== id));
  };

  const updateEmployee = (employee: Partial<Employee>) => {
    setEmployees(
      employees.map((item) =>
        item.id === employee.id ? employeeFactory(employee) : item
      )
    );
  };

  const getEmployees = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}employee`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        responseType: "json",
        withCredentials: false,
      });

      const employeeData: Employee[] = response.data.map((data: any) =>
        employeeFactory(data)
      );

      setEmployees(employeeData);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getEmployees();
  }, [getEmployees]);

  return (
    <Main>
      <TitleDiv>
        <Title>Employees</Title>
        <CreateEmployeeForm createEmployee={createEmployee} />
      </TitleDiv>
      <EmployeesTable
        employees={employees}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        setCurrentEmployee={setCurrentEmployee}
      />
      <EmployeeData
        employeeData={currentEmployee}
        deleteEmployee={deleteEmployee}
        updateEmployee={updateEmployee}
      />
    </Main>
  );
};

export default Employees;
