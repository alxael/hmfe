import { RoomEvent } from "./room.interface";

export interface EmployeeShift {
  id: string;
  startDate: Date;
  endDate: Date;
  observations: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  jobType: number;
  roomEvents: RoomEvent[];
  employeeShifts: EmployeeShift[];
}

export interface EmployeeSummary {
  id: string;
  description: string;
}

export const employeeFactory = (data?: any) => {
  let newCustomer: Employee = {
    id: "",
    firstName: "",
    lastName: "",
    jobType: 0,
    roomEvents: [],
    employeeShifts: []
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