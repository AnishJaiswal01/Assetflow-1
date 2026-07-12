import { api } from "./api";

export const getAllocations = async () => {
    const response = await api.get("/allocations/");
    return response.data;
};