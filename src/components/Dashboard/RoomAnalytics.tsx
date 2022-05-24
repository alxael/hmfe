import { useCallback, useContext, useEffect, useState } from "react";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/material";
import {
  DataGrid,
  GridColDef,
} from "@mui/x-data-grid";
import axios from "axios";

import AuthContext from "../../store/AuthContext";

interface RoomOccupation {
  name: string;
  occupancy: number;
}

interface RoomOccupationProcessed extends RoomOccupation {
  id: number;
}

interface RoomRating {
  name: string;
  rating: number;
}

interface RoomRatingProcessed extends RoomRating {
  id: number;
}

interface RoomData {
  leastOccupiedRooms: RoomOccupation[];
  mostOccupiedRooms: RoomOccupation[];
  worstRatedRooms: RoomRating[];
  bestRatedRooms: RoomRating[];
}

interface RoomDataProcessed {
  leastOccupiedRooms: RoomOccupationProcessed[];
  mostOccupiedRooms: RoomOccupationProcessed[];
  worstRatedRooms: RoomRatingProcessed[];
  bestRatedRooms: RoomRatingProcessed[];
}

const TableDiv = styled("div")(({ theme }) => ({
  display: "flex",
  width: "100%",
}));

const GridBoxTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "1rem",
  fontFamily: "inherit",
  lineHeight: "3rem",
  fontWeight: "normal",
}));

export const RoomAnalytics = () => {
  const [data, setData] = useState<RoomDataProcessed>({
    leastOccupiedRooms: [],
    mostOccupiedRooms: [],
    worstRatedRooms: [],
    bestRatedRooms: [],
  });

  const auth = useContext(AuthContext);

  const getRoomAnalytics = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}room/analytics`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token
        },
        responseType: "json",
        withCredentials: false,
      });

      const responseProcessed: RoomDataProcessed = {
        leastOccupiedRooms: (response.data as RoomData).leastOccupiedRooms.map((item, index) => ({
          id: index,
          ...item
        } as RoomOccupationProcessed)),
        mostOccupiedRooms: (response.data as RoomData).mostOccupiedRooms.map((item, index) => ({
          id: index,
          ...item
        } as RoomOccupationProcessed)),
        worstRatedRooms: (response.data as RoomData).worstRatedRooms.map((item, index) => ({
          id: index,
          ...item
        } as RoomRatingProcessed)),
        bestRatedRooms: (response.data as RoomData).bestRatedRooms.map((item, index) => ({
          id: index,
          ...item
        } as RoomRatingProcessed)),
      }

      setData(responseProcessed);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getRoomAnalytics();
  }, [getRoomAnalytics]);

  const columnsOccupancy: GridColDef[] = [
    {
      field: "name",
      headerName: "Room name",
      align: "center",
      headerAlign: "center",
      flex: 3,
    },
    {
      field: "occupancy",
      headerName: "Occupancy",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

  const columnsRating: GridColDef[] = [
    {
      field: "name",
      headerName: "Room name",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
    {
      field: "rating",
      headerName: "Rating",
      align: "center",
      headerAlign: "center",
      flex: 1,
    },
  ];

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <GridBoxTitle>Least Occupied Rooms</GridBoxTitle>
        <TableDiv>
          <DataGrid
            rows={data.leastOccupiedRooms}
            columns={columnsOccupancy}
            pageSize={5}
            density={"compact"}
            autoHeight
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            hideFooter={true}
          />
        </TableDiv>
      </Grid>
      <Grid item xs={6}>
        <GridBoxTitle>Most Occupied Rooms</GridBoxTitle>
        <TableDiv>
          <DataGrid
            rows={data.mostOccupiedRooms}
            columns={columnsOccupancy}
            pageSize={5}
            density={"compact"}
            autoHeight
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            hideFooter={true}
          />
        </TableDiv>
      </Grid>
      <Grid item xs={6}>
        <GridBoxTitle>Worst Rated Rooms</GridBoxTitle>
        <TableDiv>
          <DataGrid
            rows={data.worstRatedRooms}
            columns={columnsRating}
            pageSize={5}
            density={"compact"}
            autoHeight
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            hideFooter={true}
          />
        </TableDiv>
      </Grid>
      <Grid item xs={6}>
        <GridBoxTitle>Best Rated Rooms</GridBoxTitle>
        <TableDiv>
          <DataGrid
            rows={data.bestRatedRooms}
            columns={columnsRating}
            pageSize={5}
            density={"compact"}
            autoHeight
            rowsPerPageOptions={[5]}
            disableSelectionOnClick={true}
            hideFooter={true}
          />
        </TableDiv>
      </Grid>
    </Grid>
  );
};
