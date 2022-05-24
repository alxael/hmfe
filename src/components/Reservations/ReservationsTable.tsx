import { useState } from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";

import { Reservation } from "../../shared/interfaces/reservation.interface";

const TableBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  margin: "1rem 0rem",
  padding: "2rem",
}));

interface ReservationsTableProps {
  reservations: Reservation[];
  selectionModel: GridRowId[];
  setSelectionModel: React.Dispatch<React.SetStateAction<GridRowId[]>>;
  setCurrentReservation: React.Dispatch<React.SetStateAction<Reservation>>;
}

const ReservationsTable = (props: ReservationsTableProps) => {
  const [pageSize, setPageSize] = useState(10);

  const columns: GridColDef[] = [
    {
      field: "checkIn",
      headerName: "Check in",
      type: "date",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        (params.value as Date).toLocaleDateString("en-GB"),
    },
    {
      field: "checkOut",
      headerName: "Check out",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) =>
        (params.value as Date).toLocaleDateString("en-GB"),
    },
    {
      field: "status",
      headerName: "Status",
      type: "number",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        const statusMessages = ["Upcoming", "Active", "Ended", "Cancelled"];
        return statusMessages[params.value as number];
      },
    },
    {
      field: "roomName",
      headerName: "Room name",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "customerName",
      headerName: "Customer name",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "guestCount",
      headerName: "Guest Count",
      type: "number",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

  return (
    <TableBox>
      <DataGrid
        rows={props.reservations}
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

            props.setCurrentReservation(
              props.reservations.filter(
                (item) => item.id === result[0].toString()
              )[0]
            );
            props.setSelectionModel(result);
          } else {
            props.setCurrentReservation({
              checkIn: new Date(),
              checkOut: new Date(),
              guestCount: 0,
              status: 0,
              roomName: "",
              id: "",
              roomId: "",
              customerName: "",
              observations: "",
            });
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

export default ReservationsTable;
