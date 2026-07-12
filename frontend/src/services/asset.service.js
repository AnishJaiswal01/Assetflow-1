import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

export const getAssets = async () => {
  const response = await axios.get(`${API_URL}/assets/`);
  return response.data;
};

export const getAsset = async (id) => {
  const response = await axios.get(`${API_URL}/assets/${id}`);
  return response.data;
};