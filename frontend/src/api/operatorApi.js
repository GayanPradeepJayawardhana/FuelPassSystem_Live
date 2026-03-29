import API from "./axios";

export const verifyVehicle = (data) => API.post("/operator/verify", data);
export const fuelVehicle = (data) => API.post("/operator/fuel", data);