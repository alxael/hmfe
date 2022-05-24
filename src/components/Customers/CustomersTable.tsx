import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import { DataGrid, GridColDef, GridRowId } from "@mui/x-data-grid";

import {
  Customer,
  customerFactory,
} from "../../shared/interfaces/customer.interface";

const TableBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  margin: "1rem 0rem",
  padding: "2rem",
}));

interface CustomersTableProps {
  customers: Customer[];
  selectionModel: GridRowId[];
  setSelectionModel: React.Dispatch<React.SetStateAction<GridRowId[]>>;
  setCurrentCustomer: React.Dispatch<React.SetStateAction<Customer>>;
}

const CustomersTable = (props: CustomersTableProps) => {
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
      field: "address",
      headerName: "Address",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone number",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      type: "number",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

  return (
    <TableBox>
      <DataGrid
        rows={props.customers}
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

            props.setCurrentCustomer(
              props.customers.filter(
                (item) => item.id === result[0].toString()
              )[0]
            );
            props.setSelectionModel(result);
          } else {
            props.setCurrentCustomer(customerFactory());
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

export default CustomersTable;
