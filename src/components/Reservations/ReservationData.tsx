import { useContext, useState } from "react";
import { Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import { Reservation } from "../../shared/interfaces/reservation.interface";
import AuthContext from "../../store/AuthContext";
import ChangeReservationForm from "./ChangeReservationForm";

const DataTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "1.5rem",
  fontFamily: "inherit",
  lineHeight: "2.5rem",
  fontWeight: "normal",
}));

const DataBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: "0.75rem",
  padding: "2rem",
}));

const TitleDiv = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

interface ReservationDataProps {
  reservationData: Reservation;
  deleteReservation: (id: string) => void;
  updateReservation: (reservation: Partial<Reservation>) => void;
}

const ReservationData = (props: ReservationDataProps) => {
  const [openError, setOpenError] = useState(false);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const auth = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}reservation`,
        data: { id: props.reservationData.id },
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

      props.deleteReservation(props.reservationData.id);
    } catch (err) {
      const error = err as Error;
      setOpenError(true);
      console.log(error);
    }
  };

  return (
    <DataBox>
      <TitleDiv>
        <DataTitle>Selected reservation</DataTitle>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete reservation
        </Button>
      </TitleDiv>
      <ChangeReservationForm
        initialValues={props.reservationData}
        updateReservation={props.updateReservation}
      />
      <Snackbar
        open={openError}
        autoHideDuration={6000}
        onClose={handleErrorClose}
      >
        <Alert
          severity="error"
          elevation={6}
          variant="filled"
          sx={{ width: "100%" }}
        >
          Reservation deletion failed!
        </Alert>
      </Snackbar>
    </DataBox>
  );
};

export default ReservationData;
