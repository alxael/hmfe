import { useFormik } from "formik";
import { useCallback, useContext, useEffect, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import {
  Dialog,
  Button,
  Typography,
  TextField,
  DialogTitle,
  DialogContent,
  IconButton,
  Snackbar,
  Alert,
  MenuItem,
} from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import { styled } from "@mui/system";
import DatePicker from "@mui/lab/DatePicker";

import { Reservation } from "../../shared/interfaces/reservation.interface";
import { RoomSummary } from "../../shared/interfaces/room.interface";
import { CustomerSummary } from "../../shared/interfaces/customer.interface";
import AuthContext from "../../store/AuthContext";

const FormTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.primary,
  fontSize: "2.25rem",
  fontFamily: "inherit",
  lineHeight: "4rem",
  fontWeight: "normal",
}));

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
  fontWeight: "normal",
  color: theme.palette.primary.contrastText,
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

interface ReservationFormData {
  checkIn: string;
  checkOut: string;
  roomId: string;
  customerId: string;
  observations: string;
  guestCount: number;
  status: number;
}

interface CreateReservationFormProps {
  createReservation: (room: Partial<Reservation>) => void;
}

const CreateReservationForm = (props: CreateReservationFormProps) => {
  const [roomSelection, setRoomSelection] = useState<RoomSummary[]>([]);
  const [customerSelection, setCustomerSelection] = useState<CustomerSummary[]>(
    []
  );
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleToggle = () => {
    setOpen(true);
  };

  const formik = useFormik({
    initialValues: {
      checkIn: "",
      checkOut: "",
      roomId: "",
      customerId: "",
      observations: "",
      guestCount: 0,
      status: 0,
    },
    validationSchema: Yup.object().shape({
      checkIn: Yup.date().required("Reservation check-in date is required."),
      checkOut: Yup.date().required("Reservation check-out date is required."),
      roomId: Yup.string().required("Reservation room is required."),
      customerId: Yup.string().required("Reservation customer is required."),
      observations: Yup.string(),
      status: Yup.number().required("Reservation status is required."),
      guestCount: Yup.number().required("Reservation guest count is required."),
    }),
    onSubmit: async (formData: ReservationFormData) => {
      try {
        const response = await axios({
          method: "POST",
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

        props.createReservation({
          id: response.data,
          checkIn: new Date(formData.checkIn),
          checkOut: new Date(formData.checkOut),
          roomId: formData.roomId,
          customerId: formData.customerId,
          observations: formData.observations,
          guestCount: formData.guestCount,
          status: formData.status,
        } as Partial<Reservation>);

        setOpen(false);
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

  const getCustomerSelection = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}customer/summary`,
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

      setCustomerSelection(response.data);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getRoomSelection();
    getCustomerSelection();
  }, [getCustomerSelection, getRoomSelection]);

  return (
    <>
      <Button onClick={handleToggle} color="primary" variant="contained">
        New reservation
      </Button>
      <Dialog open={open}>
        <DialogTitleStyled>
          <FormTitle>New reservation</FormTitle>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </DialogTitleStyled>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <DatePicker
              label="Check-in"
              value={formik.values.checkIn}
              onChange={val => {
                formik.setFieldValue("checkIn", val);
              }}
              renderInput={(params) => (
                <FormField
                  {...params}
                  fullWidth
                  error={
                    formik.touched.checkIn && Boolean(formik.errors.checkIn)
                  }
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
            <DatePicker
              label="Check-out"
              value={formik.values.checkOut}
              onChange={val => {
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
                formik.touched.observations &&
                Boolean(formik.errors.observations)
              }
              helperText={
                formik.touched.observations && formik.errors.observations
              }
            />
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
            <FormField
              fullWidth
              select
              color="primary"
              id="roomId"
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
            <FormField
              fullWidth
              select
              color="primary"
              id="customerId"
              name="customerId"
              label="Customer"
              variant="outlined"
              value={formik.values.customerId}
              onChange={formik.handleChange}
              error={
                formik.touched.customerId && Boolean(formik.errors.customerId)
              }
              helperText={formik.touched.customerId && formik.errors.customerId}
            >
              {customerSelection.map((item, index) => (
                <MenuItem key={index} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </FormField>
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Create new reservation
            </SubmitButton>
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
                Reservation creation failed!
              </Alert>
            </Snackbar>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateReservationForm;
