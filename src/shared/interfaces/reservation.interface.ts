export interface Reservation {
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  status: number;
  roomName: string;
  roomId: string;
  id: string;
  customerName: string;
  observations: string;
}

export interface ReservationSummary {
  id: string;
  description: string;
}
