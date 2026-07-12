import { api } from "./api";

export const getMaintenanceRequests = async () => {
    const response = await api.get("/maintenance/");
    return response.data;
};