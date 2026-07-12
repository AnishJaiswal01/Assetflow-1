import { api } from "./api";

export const getBookings = async () => {
    const response = await api.get("/bookings/");
    return response.data;
};

export const createBooking = async (bookingData) => {
    const response = await api.post("/bookings/", bookingData);
    return response.data;
};