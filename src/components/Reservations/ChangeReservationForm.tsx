import { useContext, useEffect, useState, useCallback } from "react";
import {
  TextField,
  Button,
  Grid,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import * as Yup from "yup";
import axios from "axios";
import DatePicker from "@mui/lab/DatePicker";

import { Reservation } from "../../shared/interfaces/reservation.interface";
import { RoomSummary } from "../../shared/interfaces/room.interface";
import AuthContext from "../../store/AuthContext";
import { useFormik } from "formik";

const FormField = styled(TextField)(({ theme }) => ({
  marginTop: "1rem",
  borderRadius: "0.6rem",
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: "1rem",
  textAlign: "center",
  display: "inline-block",
  boxSizing: "border-box",
  borderRadius: "0.625rem",
  fontSize: "1rem",
  fontFamily: "inherit",
  lineHeight: "1.5rem",
  fontWeight: "500",
  color: theme.palette.primary.contrastText,
}));

interface ChangeReservationFormProps {
  initialValues: Reservation;
  updateReservation: (room: Partial<Reservation>) => void;
}

const ChangeReservationForm = (props: ChangeReservationFormProps) => {
  const [roomSelection, setRoomSelection] = useState<RoomSummary[]>([]);
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.initialValues,
    validationSchema: Yup.object().shape({
      checkIn: Yup.date().required("Reservation check-in date is required."),
      checkOut: Yup.date().required("Reservation check-out date is required."),
      roomId: Yup.string().required("Reservation room is required."),
      observations: Yup.string(),
      status: Yup.number().required("Reservation status is required."),
      guestCount: Yup.number().required("Reservation guest count is required."),
    }),
    onSubmit: async (formData: Partial<Reservation>) => {
      try {
        const response = await axios({
          method: "PUT",
          url: `${process.env.REACT_APP_API_URL}reservation`,
          data: formData,
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

        props.updateReservation({
          id: props.initialValues.id,
          ...formData,
        } as Reservation);
      } catch (err) {
        const error = err as Error;
        setOpenError(true);
        console.log(error);
      }
    },
  });

  const getRoomSelection = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}room/summary`,
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

      setRoomSelection(response.data);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getRoomSelection();
  }, [getRoomSelection]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <DatePicker
            label="Check-in"
            value={formik.values.checkIn}
            onChange={(val) => {
              formik.setFieldValue("checkIn", val);
            }}
            renderInput={(params) => (
              <FormField
                {...params}
                fullWidth
                error={formik.touched.checkIn && Boolean(formik.errors.checkIn)}
                name="checkIn"
                color="primary"
                id="checkIn"
                variant="outlined"
                helperText={formik.touched.checkIn && formik.errors.checkIn}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <DatePicker
            label="Check-out"
            value={formik.values.checkOut}
            onChange={(val) => {
              formik.setFieldValue("checkOut", val);
            }}
            renderInput={(params) => (
              <FormField
                {...params}
                fullWidth
                error={
                  formik.touched.checkOut && Boolean(formik.errors.checkOut)
                }
                name="checkOut"
                color="primary"
                id="checkOut"
                variant="outlined"
                helperText={formik.touched.checkOut && formik.errors.checkOut}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={6}>
          <FormField
            fullWidth
            color="primary"
            id="observations"
            name="observations"
            label="Observations"
            variant="outlined"
            value={formik.values.observations}
            onChange={formik.handleChange}
            error={
              formik.touched.observations && Boolean(formik.errors.observations)
            }
            helperText={
              formik.touched.observations && formik.errors.observations
            }
          />
        </Grid>

        <Grid item xs={6}>
          <FormField
            fullWidth
            color="primary"
            id="guestCount"
            name="guestCount"
            type="number"
            label="Guest count"
            variant="outlined"
            value={formik.values.guestCount}
            onChange={formik.handleChange}
            error={
              formik.touched.guestCount && Boolean(formik.errors.guestCount)
            }
            helperText={formik.touched.guestCount && formik.errors.guestCount}
          />
        </Grid>

        <Grid item xs={6}>
          <FormField
            fullWidth
            select
            color="primary"
            id="status"
            name="status"
            label="Room status"
            variant="outlined"
            value={formik.values.status}
            onChange={formik.handleChange}
            error={formik.touched.status && Boolean(formik.errors.status)}
            helperText={formik.touched.status && formik.errors.status}
          >
            <MenuItem value={0}>Upcoming</MenuItem>
            <MenuItem value={1}>Ended</MenuItem>
            <MenuItem value={2}>Active</MenuItem>
            <MenuItem value={3}>Cancelled</MenuItem>
          </FormField>
        </Grid>

        <Grid item xs={6}>
          <FormField
            fullWidth
            select
            color="primary"
            id="id"
            name="roomId"
            label="Room"
            variant="outlined"
            value={formik.values.roomId}
            onChange={formik.handleChange}
            error={formik.touched.roomId && Boolean(formik.errors.roomId)}
            helperText={formik.touched.roomId && formik.errors.roomId}
          >
            {roomSelection.map((item, index) => (
              <MenuItem key={index} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </FormField>
        </Grid>
        <Grid item xs={12}>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Update reservation
          </SubmitButton>
        </Grid>

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
            Reservation update failed!
          </Alert>
        </Snackbar>
      </Grid>
    </form>
  );
};

export default ChangeReservationForm;
