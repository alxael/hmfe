import { useEffect, useState, useCallback, useContext } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import axios from "axios";
import { styled } from "@mui/material";

import { Employee } from "../../shared/interfaces/employee.interface";
import AuthContext from "../../store/AuthContext";

const TableDiv = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
}));

const AvailableEmployees = () => {
  const [availableEmployees, setAvailableEmployees] = useState<
    Partial<Employee>[]
  >([]);

  const auth = useContext(AuthContext);

  const getAvailableEmployees = useCallback(async () => {
    try {
      const availableEmployeesData = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}employee/available`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        responseType: "json",
        withCredentials: false,
      });

      const availableEmployeesDataProcessed: Partial<Employee>[] =
        (availableEmployeesData.data as any).map((availableEmployee: any, index: number) => ({
          id: index,
          employeeName: availableEmployee.employeeName,
          startDate: new Date(availableEmployee.startDate),
          endDate: new Date(availableEmployee.endDate),
          jobType: availableEmployee.jobType,
          observations: availableEmployee.observations,
        }));

      setAvailableEmployees(availableEmployeesDataProcessed);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getAvailableEmployees();
  }, [getAvailableEmployees]);

  const columns: GridColDef[] = [
    {
      field: "employeeName",
      headerName: "Employee Name",
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "startDate",
      headerName: "Start Date",
      type: "date",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        (params.value as Date).toLocaleDateString("en-GB"),
    },
    {
      field: "endDate",
      headerName: "End Date",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        (params.value as Date).toLocaleDateString("en-GB"),
    },
    {
      field: "jobType",
      headerName: "Job",
      type: "number",
      align: "center",
      headerAlign: "center",
      flex: 0.75,
      valueFormatter: (params: GridValueFormatterParams) => {
        const statusMessages = [
          "Concierge",
          "Receptionist",
          "Cleaning",
          "Cooking",
        ];
        return statusMessages[params.value as number];
      },
    },
    {
      field: "observations",
      headerName: "Observations",
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
  ];

  return (
    <TableDiv>
      <DataGrid
        rows={availableEmployees}
        columns={columns}
        pageSize={5}
        autoHeight
        rowsPerPageOptions={[5]}
        disableSelectionOnClick={true}
      />
    </TableDiv>
  );
};

export default AvailableEmployees;
