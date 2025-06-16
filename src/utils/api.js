// src/utils/api.js (Centralized API Calls)
import axios from "axios";

const API_URL = "http://localhost:5000";

export const fetchDepartments = async () => {
  const response = await axios.get(`${API_URL}/get_departments`);
  return response.data.departments;
};

export const generateToken = async (patientName, deptId) => {
  await axios.post(`${API_URL}/token`, { patient_name: patientName, dept_id: deptId });
};

export const fetchInventory = async () => {
  const response = await axios.get(`${API_URL}/inventory`);
  return response.data.inventory;
};

export const updateInventory = async (drugName, quantity) => {
  await axios.post(`${API_URL}/update_stock`, { drug_name: drugName, drug_quantity: quantity });
};

export const fetchTokenPosition = async (patientName) => {
  const response = await axios.get(`${API_URL}/check_token`, { params: { patient_name: patientName } });
  return response.data.Message;
};

export const triggerEmergencyAlert = async (alertType) => {
  await axios.post(`${API_URL}/emergency_alert`, { alert_type: alertType });
};
