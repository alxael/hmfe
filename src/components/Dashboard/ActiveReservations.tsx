import { useEffect, useState, useCallback, useContext } from "react";
import {
  DataGrid,
  GridColDef,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { styled } from "@mui/material";
import axios from "axios";

import { Reservation } from "../../shared/interfaces/reservation.interface";
import AuthContext from "../../store/AuthContext";

const TableDiv = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
}));

export const ActiveReservations = () => {
  const [activeReservations, setActiveReservations] = useState<
    Partial<Reservation>[]
  >([]);

  const auth = useContext(AuthContext);

  const getActiveReservations = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}reservation/active`,
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

      const activeReservationsData: Partial<Reservation>[] = (response.data as any).map(
        (data: any, index: number) => ({
          id: index,
          roomName: data.roomName,
          customerName: data.customerName,
          checkIn: new Date(data.checkIn),
          checkOut: new Date(data.checkOut),
          status: data.status,
        })
      );
      /// Actual logic here

      setActiveReservations(activeReservationsData);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getActiveReservations();
  }, [getActiveReservations]);

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
      flex: 0.75,
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
      flex: 2,
    },
    {
      field: "customerName",
      headerName: "Customer name",
      align: "center",
      headerAlign: "center",
      flex: 2,
    },
  ];

  return (
    <TableDiv>
      <DataGrid
        rows={activeReservations}
        columns={columns}
        pageSize={5}
        autoHeight
        rowsPerPageOptions={[5]}
        disableSelectionOnClick={true}
      />
    </TableDiv>
  );
};
