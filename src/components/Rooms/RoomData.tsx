import { useContext, useState } from "react";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import { Room } from "../../shared/interfaces/room.interface";
import ChangeRoomForm from "./ChangeRoomForm";
import AuthContext from "../../store/AuthContext";

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
interface RoomDataProps {
  roomData: Room;
  deleteRoom: (id: string) => void;
  updateRoom: (room: Partial<Room>) => void;
}

const RoomData = (props: RoomDataProps) => {
  const [openError, setOpenError] = useState(false);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const auth = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}room`,
        data: { id: props.roomData.id },
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

      props.deleteRoom(props.roomData.id);
    } catch (err) {
      const error = err as Error;
      setOpenError(true);
      console.log(error);
    }
  };

  return (
    <DataBox>
      <TitleDiv>
        <DataTitle>Selected room</DataTitle>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete room
        </Button>
      </TitleDiv>
      <ChangeRoomForm
        initialValues={props.roomData}
        updateRoom={props.updateRoom}
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
          Room deletion failed!
        </Alert>
      </Snackbar>
    </DataBox>
  );
};

export default RoomData;
