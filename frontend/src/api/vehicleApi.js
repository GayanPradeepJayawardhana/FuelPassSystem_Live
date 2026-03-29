import API from "./axios";

export const addVehicle = (data) => API.post("/vehicles", data);
export const getMyVehicles = () => API.get("/vehicles/my");
export const deleteVehicle = (vehicleId) => API.delete(`/vehicles/${vehicleId}`);