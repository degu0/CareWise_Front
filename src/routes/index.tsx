import { Route, Routes } from "react-router-dom";
import HomeDoctor from "../pages/Home/Doctor";
import HomeNurse from "../pages/Home/Nurse";
import Login from "../pages/Login";
import RegisterLogin from "../pages/RegisterLogin";
import PatientList from "../pages/Patient/List";
import PatientRegister from "../pages/Patient/Register";
import Patient from "../pages/Patient/Form";
import Dashboard from "../pages/Dashboard";
import MedicalRecords from "../pages/MedicalRecords";
import { MainLayout } from "../layout/MainLayout";
import SearchResult from "../pages/SearchResults";
import Chat from "../pages/Carol";
import { PrivateRoute } from "./PrivateRoute";
import { UserRole } from "../context/AuthContextProvider";
import FormPatient from "../pages/Patient/Form";

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route path="/medico" element={<HomeDoctor />} />
        <Route path="/enfermeira" element={<HomeNurse />} />
        <Route path="/paciente">
          <Route path=":id" element={<Patient />} />
          <Route path="lista" element={<PatientList />} />
          <Route
            path="cadastro"
            element={
              <PrivateRoute allowedRoles={[UserRole.NURSE]}>
                <PatientRegister />
              </PrivateRoute>
            }
          />
          <Route path="formulario" element={<FormPatient />} />
        </Route>
        <Route path="/pesquisa/:value" element={<SearchResult />} />
        <Route path="/chat" element={<Chat />} />
        <Route
          path="/prontuario/:id"
          element={
            <PrivateRoute allowedRoles={[UserRole.DOCTOR]}>
              <MedicalRecords />
            </PrivateRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<RegisterLogin />} />
    </Routes>
  );
}
