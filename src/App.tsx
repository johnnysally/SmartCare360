import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Queue from "./pages/Queue";
import Billing from "./pages/Billing";
import Pharmacy from "./pages/Pharmacy";
import Telemedicine from "./pages/Telemedicine";
import Analytics from "./pages/Analytics";
import NotFound from "./pages/NotFound";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Consultations from "./pages/doctor/Consultations";
import Prescriptions from "./pages/doctor/Prescriptions";
import LabResults from "./pages/doctor/LabResults";
import Schedule from "./pages/doctor/Schedule";
import MedicalNotes from "./pages/doctor/MedicalNotes";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserManagement from "./pages/admin/UserManagement";
import StaffManagement from "./pages/admin/StaffManagement";
import ClinicSettings from "./pages/admin/ClinicSettings";
import SystemLogs from "./pages/admin/SystemLogs";
import Reports from "./pages/admin/Reports";
import RolesPermissions from "./pages/admin/RolesPermissions";

// Lab Pages
import LabDashboard from "./pages/lab/LabDashboard";
import TestOrders from "./pages/lab/TestOrders";
import SampleTracking from "./pages/lab/SampleTracking";
import ResultsEntry from "./pages/lab/ResultsEntry";
import LabReports from "./pages/lab/LabReports";

// Nurse Pages
import NurseDashboard from "./pages/nurse/NurseDashboard";
import VitalsCapture from "./pages/nurse/VitalsCapture";
import Medications from "./pages/nurse/Medications";
import CareNotes from "./pages/nurse/CareNotes";
import TaskList from "./pages/nurse/TaskList";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import MyResults from "./pages/patient/MyResults";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyBills from "./pages/patient/MyBills";

// Management Pages
import ManagementDashboard from "./pages/management/ManagementDashboard";
import Revenue from "./pages/management/Revenue";
import Performance from "./pages/management/Performance";

// IT Pages
import ITDashboard from "./pages/it/ITDashboard";
import AuditLogs from "./pages/it/AuditLogs";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/queue" element={<Queue />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/pharmacy" element={<Pharmacy />} />
          <Route path="/telemedicine" element={<Telemedicine />} />
          <Route path="/analytics" element={<Analytics />} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/consultations" element={<Consultations />} />
          <Route path="/doctor/prescriptions" element={<Prescriptions />} />
          <Route path="/doctor/lab-results" element={<LabResults />} />
          <Route path="/doctor/schedule" element={<Schedule />} />
          <Route path="/doctor/medical-notes" element={<MedicalNotes />} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/staff" element={<StaffManagement />} />
          <Route path="/admin/clinic-settings" element={<ClinicSettings />} />
          <Route path="/admin/logs" element={<SystemLogs />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/roles" element={<RolesPermissions />} />
          
          {/* Lab Routes */}
          <Route path="/lab/dashboard" element={<LabDashboard />} />
          <Route path="/lab/orders" element={<TestOrders />} />
          <Route path="/lab/samples" element={<SampleTracking />} />
          <Route path="/lab/results" element={<ResultsEntry />} />
          <Route path="/lab/reports" element={<LabReports />} />
          
          {/* Nurse Routes */}
          <Route path="/nurse/dashboard" element={<NurseDashboard />} />
          <Route path="/nurse/vitals" element={<VitalsCapture />} />
          <Route path="/nurse/medications" element={<Medications />} />
          <Route path="/nurse/notes" element={<CareNotes />} />
          <Route path="/nurse/tasks" element={<TaskList />} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/appointments" element={<MyAppointments />} />
          <Route path="/patient/results" element={<MyResults />} />
          <Route path="/patient/prescriptions" element={<MyPrescriptions />} />
          <Route path="/patient/bills" element={<MyBills />} />
          
          {/* Management Routes */}
          <Route path="/management/dashboard" element={<ManagementDashboard />} />
          <Route path="/management/revenue" element={<Revenue />} />
          <Route path="/management/performance" element={<Performance />} />
          
          {/* IT Routes */}
          <Route path="/it/dashboard" element={<ITDashboard />} />
          <Route path="/it/logs" element={<AuditLogs />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
