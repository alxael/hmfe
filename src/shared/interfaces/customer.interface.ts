import { Reservation } from "./reservation.interface";

export interface CustomerEvent {
  id: string;
  type: number;
  observations: string;
  dateCreated: Date;
  reservation: Partial<Reservation>;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  address: string;
  phoneNumber: string;
  email: string;
  customerEvents: CustomerEvent[];
}

export interface CustomerSummary {
  id: string;
  name: string;
}

export const customerFactory = (data?: any) => {
  let newCustomer: Customer = {
    id: "",
    firstName: "",
    lastName: "",
    address: "",
    phoneNumber: "",
    email: "",
    customerEvents: []
  };

  if (typeof data != "undefined") {
    for (const [key, value] of Object.entries(data)) {
      if (typeof (newCustomer as any)[key] != "undefined") {
        (newCustomer as any)[key] = value;
      }
    }
  }

  return newCustomer;
}