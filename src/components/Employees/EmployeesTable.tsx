import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid, GridColDef, GridRowId, GridValueFormatterParams } from "@mui/x-data-grid";

import {
  Employee,
  employeeFactory,
} from "../../shared/interfaces/employee.interface";

const TableBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  margin: "1rem 0rem",
  padding: "2rem",
}));

interface EmployeesTableProps {
  employees: Employee[];
  selectionModel: GridRowId[];
  setSelectionModel: React.Dispatch<React.SetStateAction<GridRowId[]>>;
  setCurrentEmployee: React.Dispatch<React.SetStateAction<Employee>>;
}

const EmployeesTable = (props: EmployeesTableProps) => {
  const [pageSize, setPageSize] = useState(10);

  const columns: GridColDef[] = [
    {
      field: "firstName",
      headerName: "First name",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last name",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "jobType",
      headerName: "Job type",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        const statusMessages = ["Concierge", "Receptionist", "Cleaning", "Cooking"];
        return statusMessages[params.value as number];
      },
    },
  ];

  return (
    <TableBox>
      <DataGrid
        rows={props.employees}
        columns={columns}
        pageSize={pageSize}
        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
        rowsPerPageOptions={[10, 25]}
        checkboxSelection
        selectionModel={props.selectionModel}
        hideFooterSelectedRowCount
        onSelectionModelChange={(selection) => {
          if (selection.length > 0) {
            const selectionSet = new Set(props.selectionModel);
            const result = selection.filter((s) => !selectionSet.has(s));

            props.setCurrentEmployee(
              props.employees.filter(
                (item) => item.id === result[0].toString()
              )[0]
            );
            props.setSelectionModel(result);
          } else {
            props.setCurrentEmployee(employeeFactory());
            props.setSelectionModel(selection);
          }
        }}
        density="compact"
        pagination
        autoHeight
      />
    </TableBox>
  );
};

export default EmployeesTable;
