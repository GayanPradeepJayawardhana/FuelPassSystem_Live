import API from "./axios";

// Users
export const getAllUsers = () => API.get("/admin/users");

// Vehicles
export const getAllVehicles = () => API.get("/admin/vehicles");
export const searchVehicle = (vehicleNumber) => API.get("/admin/search-vehicle", { params: { vehicleNumber } });
export const updateFuelQuota = (vehicleId, amount) =>
  API.put(`/admin/fuel/${vehicleId}`, { fuelAmount: amount });