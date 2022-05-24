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
import { useContext, useState } from "react";
import { styled } from "@mui/system";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { CloseOutlined } from "@mui/icons-material";

import AuthContext from "../../store/AuthContext";
import { Room } from "../../shared/interfaces/room.interface";

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

interface RoomFormData {
  name: string;
  number: number;
  guestCount: number;
  status: number;
}
interface CreateRoomFormProps {
  createRoom: (room: Partial<Room>) => void;
}

export const CreateRoomForm = (props: CreateRoomFormProps) => {
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
      name: "",
      number: 0,
      guestCount: 0,
      status: 0,
    },
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Room name is required."),
      number: Yup.number().required("Room number is required."),
      guestCount: Yup.number().required("Room guest number is required."),
      status: Yup.number().required("Room status is required."),
    }),
    onSubmit: async (formData: RoomFormData) => {
      try {
        const response = await axios({
          method: "POST",
          url: `${process.env.REACT_APP_API_URL}room`,
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

        props.createRoom({
          id: response.data,
          ...formData,
        } as Partial<Room>);

        setOpen(false);
      } catch (err) {
        const error = err as Error;
        setOpenError(true);
        console.log(error);
      }
    },
  });

  return (
    <>
      <Button onClick={handleToggle} color="primary" variant="contained">
        New room
      </Button>
      <Dialog open={open}>
        <DialogTitleStyled>
          <FormTitle>New room</FormTitle>
          <IconButton onClick={handleClose}>
            <CloseOutlined />
          </IconButton>
        </DialogTitleStyled>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <FormField
              fullWidth
              color="primary"
              id="name"
              name="name"
              label="Room name"
              variant="outlined"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <FormField
              fullWidth
              color="primary"
              id="number"
              name="number"
              type="number"
              label="Room number"
              variant="outlined"
              value={formik.values.number}
              onChange={formik.handleChange}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={formik.touched.number && formik.errors.number}
            />
            <FormField
              fullWidth
              color="primary"
              id="guestCount"
              name="guestCount"
              type="number"
              label="Room guest count"
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
              <MenuItem value={0}>In use</MenuItem>
              <MenuItem value={1}>Maintenance</MenuItem>
            </FormField>
            <SubmitButton
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
            >
              Create new room
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
                Room creation failed!
              </Alert>
            </Snackbar>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};