import { useCallback, useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { styled } from "@mui/material";

import { Reservation } from "../shared/interfaces/reservation.interface";
import AuthContext from "../store/AuthContext";
import ReservationsTable from "../components/Reservations/ReservationsTable";
import CreateReservationForm from "../components/Reservations/CreateReservationForm";
import ReservationData from "../components/Reservations/ReservationData";

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

const Reservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [currentReservation, setCurrentReservation] = useState<Reservation>({
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

  const auth = useContext(AuthContext);

  const createReservation = (reservation: Partial<Reservation>) => {
    setReservations([...reservations, reservation as Reservation]);
  };

  const deleteReservation = (id: string) => {
    setReservations(reservations.filter((item) => item.id !== id));
  };

  const updateReservation = (reservation: Partial<Reservation>) => {
    setReservations(
      reservations.map((item) =>
        item.id === reservation.id ? ({ ...reservation } as Reservation) : item
      )
    );
  };

  const getReservations = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}reservation`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        responseType: "json",
        withCredentials: false,
      });

      const reservationData: Reservation[] = response.data.map((data: any) => ({
        id: data.id,
        status: data.status,
        roomName: data.roomName,
        roomId: data.roomId,
        guestCount: data.guestCount,
        customerName: data.customerName,
        checkIn: new Date(data.checkIn),
        checkOut: new Date(data.checkOut),
      }));

      setReservations(reservationData);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getReservations();
  }, [getReservations]);

  return (
    <Main>
      <TitleDiv>
        <Title>Reservations</Title>
        <CreateReservationForm createReservation={createReservation} />
      </TitleDiv>
      <ReservationsTable
        reservations={reservations}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        setCurrentReservation={setCurrentReservation}
      />
      <ReservationData
        reservationData={currentReservation}
        deleteReservation={deleteReservation}
        updateReservation={updateReservation}
      />
    </Main>
  );
};

export default Reservations;
