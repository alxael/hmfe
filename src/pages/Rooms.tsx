import { useState, useCallback, useContext, useEffect } from "react";
import { Typography } from "@mui/material";
import { styled } from "@mui/system";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { Room } from "../shared/interfaces/room.interface";

import { CreateRoomForm } from "../components/Rooms/CreateRoomForm";
import RoomsTable from "../components/Rooms/RoomsTable";
import AuthContext from "../store/AuthContext";
import RoomData from "../components/Rooms/RoomData";

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

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [currentRoom, setCurrentRoom] = useState<Room>({
    id: "",
    name: "",
    number: 0,
    guestCount: 0,
    status: 0,
    roomEvents: [],
  });

  const auth = useContext(AuthContext);

  const createRoom = (room: Partial<Room>) => {
    setRooms([
      ...rooms,
      room as Room,
    ]);
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter((item) => item.id !== id));
  };

  const updateRoom = (room: Partial<Room>) => {
    setRooms(
      rooms.map((item) =>
        item.id === room.id
          ? room as Room
          : item
      )
    );
  };

  const getRooms = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}room`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        responseType: "json",
        withCredentials: false,
      });

      const roomData: Room[] = response.data.map((data: any) => ({
        id: data.id,
        name: data.name,
        number: data.number,
        guestCount: data.guestCount,
        status: data.status,
        roomEvents: data.roomEvents.map((item: any) => ({
          type: item.type,
          observations: item.observations,
          dateCreated: new Date(item.dateCreated),
          employeeName: item.employeeName,
          reservation: {
            roomName: item.reservation.roomName,
            customerName: item.reservation.customerName,
            checkIn: new Date(item.reservation.checkIn),
            checkOut: new Date(item.reservation.checkOut),
            status: item.reservation.status,
          },
        })),
      }));

      setRooms(roomData);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getRooms();
  }, [getRooms]);

  return (
    <Main>
      <TitleDiv>
        <Title>Rooms</Title>
        <CreateRoomForm createRoom={createRoom} />
      </TitleDiv>
      <RoomsTable
        rooms={rooms}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        setCurrentRoom={setCurrentRoom}
      />
      <RoomData
        roomData={currentRoom}
        deleteRoom={deleteRoom}
        updateRoom={updateRoom}
      />
    </Main>
  );
};

export default Rooms;
