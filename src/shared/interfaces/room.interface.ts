import { Reservation } from "./reservation.interface";

export interface RoomEvent {
  id: string;
  type: number;
  observations: string;
  dateCreated: Date;
  employeeName: string;
  reservation: Reservation;
}

export interface Room {
  id: string;
  name: string;
  number: number;
  guestCount: number;
  status: number;
  roomEvents: RoomEvent[];
}

export interface RoomSummary {
  id: string;
  name: string;
}
