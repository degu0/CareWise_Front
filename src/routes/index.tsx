import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import RegisterLogin from "../pages/RegisterLogin";
import PatientList from "../pages/Patient/List";
import PatientRegister from "../pages/Patient/Register";
import Patient from "../pages/Patient";
import Dashboard from "../pages/Dashboard";
import MedicalRecords from "../pages/MedicalRecords";
import { MainLayout } from "../layout/MainLayout";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/paciente/lista" element={<PatientList />} />
        <Route path="/paciente/cadastro" element={<PatientRegister />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<RegisterLogin />} />
      <Route path="/paciente/:id" element={<Patient />} />
      <Route path="/prontuario/:id" element={<MedicalRecords />} />
    </Routes>
  );
}
