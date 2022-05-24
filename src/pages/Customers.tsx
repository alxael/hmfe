import { useCallback, useContext, useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { GridRowId } from "@mui/x-data-grid";
import axios from "axios";
import { styled } from "@mui/material";

import {
  Customer,
  customerFactory,
} from "../shared/interfaces/customer.interface";
import AuthContext from "../store/AuthContext";
import CustomersTable from "../components/Customers/CustomersTable";
import CreateCustomerForm from "../components/Customers/CreateCustomerForm";
import CustomerData from "../components/Customers/CustomerData";

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

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectionModel, setSelectionModel] = useState<GridRowId[]>([]);
  const [currentCustomer, setCurrentCustomer] = useState<Customer>(
    customerFactory()
  );

  const auth = useContext(AuthContext);

  const createCustomer = (customer: Partial<Customer>) => {
    setCustomers([...customers, customer as Customer]);
  };

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter((item) => item.id !== id));
  };

  const updateCustomer = (customer: Partial<Customer>) => {
    setCustomers(
      customers.map((item) =>
        item.id === customer.id ? customerFactory(customer) : item
      )
    );
  };

  const getCustomers = useCallback(async () => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.REACT_APP_API_URL}customer`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.token,
        },
        responseType: "json",
        withCredentials: false,
      });

      const customerData: Customer[] = response.data.map((data: any) =>
        customerFactory(data)
      );

      setCustomers(customerData);
    } catch (err) {
      const error = err as Error;
      console.log(error);
    }
  }, [auth.token]);

  useEffect(() => {
    getCustomers();
  }, [getCustomers]);

  return (
    <Main>
      <TitleDiv>
        <Title>Customers</Title>
        <CreateCustomerForm createCustomer={createCustomer} />
      </TitleDiv>
      <CustomersTable
        customers={customers}
        selectionModel={selectionModel}
        setSelectionModel={setSelectionModel}
        setCurrentCustomer={setCurrentCustomer}
      />
      <CustomerData
        customerData={currentCustomer}
        deleteCustomer={deleteCustomer}
        updateCustomer={updateCustomer}
      />
    </Main>
  );
};

export default Customers;
