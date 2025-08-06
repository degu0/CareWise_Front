import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login  from "../pages/Login";
import RegisterLogin from "../pages/RegisterLogin";
import PatientList from "../pages/Patient/List";
import PatientRegister from "../pages/Patient/Register";
import Patient from "../pages/Patient";
import Dashboard from "../pages/Dashboard";
import MedicalRecords from "../pages/MedicalRecords";

export function AppRouter() {
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<RegisterLogin />} />
      <Route path="/paciente/:id" element={<Patient />} />
      <Route path="/paciente/lista" element={<PatientList />} />
      <Route path="/paciente/cadastro" element={<PatientRegister />} />
      <Route path="/prontuario/:id" element={<MedicalRecords />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  )
}