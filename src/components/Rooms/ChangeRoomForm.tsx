import {
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  Button,
  Grid,
} from "@mui/material";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import * as Yup from "yup";
import axios from "axios";
import { styled } from "@mui/system";

import { Room } from "../../shared/interfaces/room.interface";
import AuthContext from "../../store/AuthContext";

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

interface ChangeRoomFormProps {
  initialValues: Room;
  updateRoom: (room: Partial<Room>) => void;
}

const ChangeRoomForm = (props: ChangeRoomFormProps) => {
  const [openError, setOpenError] = useState(false);

  const auth = useContext(AuthContext);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: props.initialValues,
    validationSchema: Yup.object().shape({
      name: Yup.string().required("Room name is required."),
      number: Yup.number().required("Room number is required."),
      guestCount: Yup.number().required("Room guest number is required."),
      status: Yup.number().required("Room status is required."),
    }),
    onSubmit: async (formData: Partial<Room>) => {
      try {
        const response = await axios({
          method: "PUT",
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

        console.log(response);
        props.updateRoom({
          id: props.initialValues.id,
          ...formData,
        } as Room);

        
      } catch (err) {
        const error = err as Error;
        setOpenError(true);
        console.log(error);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={6}>
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
        </Grid>

        <Grid item xs={6}>
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
        </Grid>

        <Grid item xs={6}>
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
            <MenuItem value={0}>In use</MenuItem>
            <MenuItem value={1}>Maintenance</MenuItem>
          </FormField>
        </Grid>

        <Grid item xs={12}>
          <SubmitButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Update room
          </SubmitButton>
        </Grid>
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
          Room update failed!
        </Alert>
      </Snackbar>
    </form>
  );
};

export default ChangeRoomForm;
