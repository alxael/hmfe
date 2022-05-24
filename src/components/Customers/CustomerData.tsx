import { useContext, useState } from "react";
import { Typography, Box, Button, Snackbar, Alert } from "@mui/material";
import { styled } from "@mui/system";
import axios from "axios";

import { Customer } from "../../shared/interfaces/customer.interface";
import AuthContext from "../../store/AuthContext";
import ChangeCustomerForm from "./ChangeCustomerForm";

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

interface CustomerDataProps {
  customerData: Customer;
  deleteCustomer: (id: string) => void;
  updateCustomer: (customer: Partial<Customer>) => void;
}

const CustomerData = (props: CustomerDataProps) => {
  const [openError, setOpenError] = useState(false);

  const handleErrorClose = () => {
    setOpenError(false);
  };

  const auth = useContext(AuthContext);

  const handleDelete = async () => {
    try {
      const response = await axios({
        method: "DELETE",
        url: `${process.env.REACT_APP_API_URL}customer`,
        data: { id: props.customerData.id },
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

      props.deleteCustomer(props.customerData.id);
    } catch (err) {
      const error = err as Error;
      setOpenError(true);
      console.log(error);
    }
  };

  return (
    <DataBox>
      <TitleDiv>
        <DataTitle>Selected customer</DataTitle>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete customer
        </Button>
      </TitleDiv>
      <ChangeCustomerForm
        initialValues={props.customerData}
        updateCustomer={props.updateCustomer}
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
          Customer deletion failed!
        </Alert>
      </Snackbar>
    </DataBox>
  );
};

export default CustomerData;
