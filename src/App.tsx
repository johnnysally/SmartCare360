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
import ProtectedRoute from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Doctor Pages
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import Consultations from "./pages/doctor/Consultations";
import Prescriptions from "./pages/doctor/Prescriptions";
import LabResults from "./pages/doctor/LabResults";
import Schedule from "./pages/doctor/Schedule";
import MedicalNotes from "./pages/doctor/MedicalNotes";
import DoctorMedications from "./pages/doctor/Medications";

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
import MedicationAdministration from "./pages/nurse/MedicationAdministration";
import CareNotes from "./pages/nurse/CareNotes";
import TaskList from "./pages/nurse/TaskList";

// Patient Pages
import PatientDashboard from "./pages/patient/PatientDashboard";
import MyAppointments from "./pages/patient/MyAppointments";
import MyResults from "./pages/patient/MyResults";
import MyPrescriptions from "./pages/patient/MyPrescriptions";
import MyBills from "./pages/patient/MyBills";
import PatientTelemedicine from "./pages/patient/PatientTelemedicine";
import PatientProfile from "./pages/patient/PatientProfile";
import MedicationHistory from "./pages/patient/MedicationHistory";

// Management Pages
import ManagementDashboard from "./pages/management/ManagementDashboard";
import Revenue from "./pages/management/Revenue";
import Performance from "./pages/management/Performance";
import ManagementAnalytics from "./pages/management/ManagementAnalytics";
import ManagementReports from "./pages/management/ManagementReports";

// IT Pages
import ITDashboard from "./pages/it/ITDashboard";
import AuditLogs from "./pages/it/AuditLogs";
import ITSecurity from "./pages/it/ITSecurity";
import ITSystemHealth from "./pages/it/ITSystemHealth";
import ITBackups from "./pages/it/ITBackups";
import ITSettings from "./pages/it/ITSettings";

// Admin Settings
import AdminSettings from "./pages/admin/AdminSettings";

// CHW Pages
import CHWDashboard from "./pages/chw/CHWDashboard";
import FollowUps from "./pages/chw/FollowUps";
import HomeVisits from "./pages/chw/HomeVisits";
import MaternalHealth from "./pages/chw/MaternalHealth";
import CHWReports from "./pages/chw/CHWReports";

// AI Pages
import AIDashboard from "./pages/ai/AIDashboard";
import AIAlerts from "./pages/ai/AIAlerts";
import AITrends from "./pages/ai/AITrends";
import AIRiskScores from "./pages/ai/AIRiskScores";

// Pharmacy Pages
import PharmacyMedications from "./pages/pharmacy/Medications";
import AIInsights from "./pages/ai/AIInsights";

// Referral Pages
import ReferralDashboard from "./pages/referral/ReferralDashboard";
import ReferralList from "./pages/referral/ReferralList";
import Specialists from "./pages/referral/Specialists";
import Partners from "./pages/referral/Partners";
import ExternalResults from "./pages/referral/ExternalResults";

// Pharmacy Pages
import PharmacyDashboard from "./pages/pharmacy/PharmacyDashboard";
import Orders from "./pages/pharmacy/Orders";
import Inventory from "./pages/pharmacy/Inventory";
import PharmacyAnalytics from "./pages/pharmacy/Analytics";
import DrugReports from "./pages/pharmacy/DrugReports";

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
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
          <Route path="/queue" element={<ProtectedRoute><Queue /></ProtectedRoute>} />
          <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
          <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
          <Route path="/telemedicine" element={<ProtectedRoute><Telemedicine /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          
          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<ProtectedRoute><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/consultations" element={<ProtectedRoute><Consultations /></ProtectedRoute>} />
          <Route path="/doctor/prescriptions" element={<ProtectedRoute><Prescriptions /></ProtectedRoute>} />
          <Route path="/doctor/lab-results" element={<ProtectedRoute><LabResults /></ProtectedRoute>} />
          <Route path="/doctor/schedule" element={<ProtectedRoute><Schedule /></ProtectedRoute>} />
          <Route path="/doctor/medical-notes" element={<ProtectedRoute><MedicalNotes /></ProtectedRoute>} />
          <Route path="/doctor/medications" element={<ProtectedRoute><DoctorMedications /></ProtectedRoute>} />
          
          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
          <Route path="/admin/staff" element={<ProtectedRoute><StaffManagement /></ProtectedRoute>} />
          <Route path="/admin/clinic-settings" element={<ProtectedRoute><ClinicSettings /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute><SystemLogs /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
          <Route path="/admin/roles" element={<ProtectedRoute><RolesPermissions /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
          
          {/* Lab Routes */}
          <Route path="/lab/dashboard" element={<ProtectedRoute><LabDashboard /></ProtectedRoute>} />
          <Route path="/lab/orders" element={<ProtectedRoute><TestOrders /></ProtectedRoute>} />
          <Route path="/lab/samples" element={<ProtectedRoute><SampleTracking /></ProtectedRoute>} />
          <Route path="/lab/results" element={<ProtectedRoute><ResultsEntry /></ProtectedRoute>} />
          <Route path="/lab/reports" element={<ProtectedRoute><LabReports /></ProtectedRoute>} />
          
          {/* Nurse Routes */}
          <Route path="/nurse/dashboard" element={<ProtectedRoute><NurseDashboard /></ProtectedRoute>} />
          <Route path="/nurse/vitals" element={<ProtectedRoute><VitalsCapture /></ProtectedRoute>} />
          <Route path="/nurse/medications" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
          <Route path="/nurse/administer-meds" element={<ProtectedRoute><MedicationAdministration /></ProtectedRoute>} />
          <Route path="/nurse/notes" element={<ProtectedRoute><CareNotes /></ProtectedRoute>} />
          <Route path="/nurse/tasks" element={<ProtectedRoute><TaskList /></ProtectedRoute>} />
          
          {/* Patient Routes */}
          <Route path="/patient/dashboard" element={<ProtectedRoute><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/appointments" element={<ProtectedRoute><MyAppointments /></ProtectedRoute>} />
          <Route path="/patient/results" element={<ProtectedRoute><MyResults /></ProtectedRoute>} />
          <Route path="/patient/prescriptions" element={<ProtectedRoute><MyPrescriptions /></ProtectedRoute>} />
          <Route path="/patient/bills" element={<ProtectedRoute><MyBills /></ProtectedRoute>} />
          <Route path="/patient/telemedicine" element={<ProtectedRoute><PatientTelemedicine /></ProtectedRoute>} />
          <Route path="/patient/profile" element={<ProtectedRoute><PatientProfile /></ProtectedRoute>} />
          <Route path="/patient/medications/:patientId" element={<ProtectedRoute><MedicationHistory /></ProtectedRoute>} />
          
          {/* Management Routes */}
          <Route path="/management/dashboard" element={<ProtectedRoute><ManagementDashboard /></ProtectedRoute>} />
          <Route path="/management/revenue" element={<ProtectedRoute><Revenue /></ProtectedRoute>} />
          <Route path="/management/performance" element={<ProtectedRoute><Performance /></ProtectedRoute>} />
          <Route path="/management/analytics" element={<ProtectedRoute><ManagementAnalytics /></ProtectedRoute>} />
          <Route path="/management/reports" element={<ProtectedRoute><ManagementReports /></ProtectedRoute>} />
          
          {/* IT Routes */}
          <Route path="/it/dashboard" element={<ProtectedRoute><ITDashboard /></ProtectedRoute>} />
          <Route path="/it/logs" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
          <Route path="/it/security" element={<ProtectedRoute><ITSecurity /></ProtectedRoute>} />
          <Route path="/it/health" element={<ProtectedRoute><ITSystemHealth /></ProtectedRoute>} />
          <Route path="/it/backups" element={<ProtectedRoute><ITBackups /></ProtectedRoute>} />
          <Route path="/it/settings" element={<ProtectedRoute><ITSettings /></ProtectedRoute>} />
          
          {/* CHW Routes */}
          <Route path="/chw/dashboard" element={<ProtectedRoute><CHWDashboard /></ProtectedRoute>} />
          <Route path="/chw/followups" element={<ProtectedRoute><FollowUps /></ProtectedRoute>} />
          <Route path="/chw/visits" element={<ProtectedRoute><HomeVisits /></ProtectedRoute>} />
          <Route path="/chw/maternal" element={<ProtectedRoute><MaternalHealth /></ProtectedRoute>} />
          <Route path="/chw/reports" element={<ProtectedRoute><CHWReports /></ProtectedRoute>} />
          
          {/* AI Routes */}
          <Route path="/ai/dashboard" element={<ProtectedRoute><AIDashboard /></ProtectedRoute>} />
          <Route path="/ai/alerts" element={<ProtectedRoute><AIAlerts /></ProtectedRoute>} />
          <Route path="/ai/trends" element={<ProtectedRoute><AITrends /></ProtectedRoute>} />
          <Route path="/ai/risk" element={<ProtectedRoute><AIRiskScores /></ProtectedRoute>} />
          <Route path="/ai/insights" element={<ProtectedRoute><AIInsights /></ProtectedRoute>} />
          
          {/* Referral Routes */}
          <Route path="/referral/dashboard" element={<ProtectedRoute><ReferralDashboard /></ProtectedRoute>} />
          <Route path="/referral/list" element={<ProtectedRoute><ReferralList /></ProtectedRoute>} />
          <Route path="/referral/specialists" element={<ProtectedRoute><Specialists /></ProtectedRoute>} />
          <Route path="/referral/partners" element={<ProtectedRoute><Partners /></ProtectedRoute>} />
          <Route path="/referral/results" element={<ProtectedRoute><ExternalResults /></ProtectedRoute>} />
          
          {/* Pharmacy Routes */}
          <Route path="/pharmacy/dashboard" element={<ProtectedRoute><PharmacyDashboard /></ProtectedRoute>} />
          <Route path="/pharmacy/medications" element={<ProtectedRoute><PharmacyMedications /></ProtectedRoute>} />
          <Route path="/pharmacy/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/pharmacy/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
          <Route path="/pharmacy/drug-reports" element={<ProtectedRoute><DrugReports /></ProtectedRoute>} />
          <Route path="/pharmacy/analytics" element={<ProtectedRoute><PharmacyAnalytics /></ProtectedRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
