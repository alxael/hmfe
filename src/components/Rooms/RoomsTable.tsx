import { useState } from "react";
import { styled } from "@mui/system";
import { Box } from "@mui/system";
import {
  DataGrid,
  GridColDef,
  GridRowId,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { Room } from "../../shared/interfaces/room.interface";

const TableBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  margin: "1rem 0rem",
  padding: "2rem",
}));

interface RoomsTableProps {
  rooms: Room[];
  selectionModel: GridRowId[];
  setSelectionModel: React.Dispatch<React.SetStateAction<GridRowId[]>>;
  setCurrentRoom: React.Dispatch<React.SetStateAction<Room>>;
}

const RoomsTable = (props: RoomsTableProps) => {
  const [pageSize, setPageSize] = useState(10);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
    {
      field: "number",
      headerName: "Number",
      type: "number",
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
    {
      field: "status",
      headerName: "Status",
      align: "center",
      headerAlign: "center",
      flex: 1,
      valueFormatter: (params: GridValueFormatterParams) => {
        const statusMessages = ["In Use", "Maintenance"];
        return statusMessages[params.value as number];
      },
    },
  ];

  return (
    <TableBox>
      <DataGrid
        rows={props.rooms}
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

            props.setCurrentRoom(
              props.rooms.filter((item) => item.id === result[0].toString())[0]
            );
            props.setSelectionModel(result);
          } else {
            props.setCurrentRoom({
              id: "",
              name: "",
              number: 0,
              guestCount: 0,
              status: 0,
              roomEvents: [],
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

export default RoomsTable;
