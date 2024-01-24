import { Routes, Route } from 'react-router-dom';
import React, { useContext } from 'react';

import LoginPage from './components/Login/Login'

//import SignupPage from './pages/SignupPage';
import SignupPage from './components/SignUp/SignupPage';


import Dashboard from './components/dashboard/Dashboard';
import AdminDashboard from './components/dashboard/AdminDashboard';

import AddUser from './components/User/AddUser3';
import UserList from "./components/User/UserList3";
import EditUser from "./components/User/EditUser3";
import User from './components/User/User';


import AddPatient from './components/Student/AddStudent';
import PatientList from "./components/Student/StudentList";
import EditPatient from "./components/Student/EditStudent";
import Patient from './components/Student/Student';

import AddExpert from './components/Expert/AddExpert';
import ExpertList from "./components/Expert/ExpertList";
import EditExpert from "./components/Expert/EditExpert";
import Expert from './components/Expert/Expert';


import { UserContext } from './Context/UserContext'
import StudentDashboard from './components/dashboard/StudentDashboard';
import ExpertDashboard from './components/dashboard/ExpertDashboard';


import AdminAppointment from './components/Appointment/AdminAppointment';
import PatientAppointment from './components/Appointment/PatientAppointment';
import DoctorAppointment from './components/Appointment/DoctorAppointment';

import DoctorProfile from './components/Profile/ExpertProfile';
import PatientProfile from './components/Profile/StudentProfile';
import AdminProfile from './components/Profile/AdminProfile';

import Login from './components/Login/Login';
import ForgetPassword from './components/Login/ForgetPassword'
import OTPForm from './components/Login/Otpform'
import PatientHistory from './components/Student/StudentHistory';

const NotFound = () => <h2 style={{ margin: '70px' }}>This Path is not available</h2>

function ProtectedAdminRoute({ children }) {
    const { currentUser } = useContext(UserContext);
    if (currentUser.userType == "Admin") {
        return children;
    }
}

function ProtectedStaffRoute({ children }) {
    const { currentUser } = useContext(UserContext);
    if (currentUser.userType == "Admin" || currentUser.userType == "Doctor") {
        return children;
    }
}

export default function PageRoutes() {
    const { currentUser } = useContext(UserContext);
    return (
        <Routes>
            <Route path='/' element={<Dashboard />} >
                <Route index element={
                    currentUser.userType == "Admin" ?
                        <AdminDashboard /> :
                        currentUser.userType == "Doctor" ?
                            <ExpertDashboard /> :
                            currentUser.userType == "Patient" ?
                                <StudentDashboard /> :
                                <div />}
                />
                <Route path='users' element={<ProtectedAdminRoute>  <User /> </ProtectedAdminRoute>} >
                    <Route index element={<UserList />} />
                    <Route path='add' element={<AddUser />} />
                    <Route path="edit/:id" element={<EditUser />} />
                </Route>

                <Route path='patients' element={<ProtectedAdminRoute>  <Patient /> </ProtectedAdminRoute>} >
                    <Route index element={<PatientList />} />
                    <Route path='add' element={<AddPatient />} />
                    <Route path="edit/:id" element={<EditPatient />} />
                </Route>

                <Route path='doctors' element={<ProtectedAdminRoute>  <Expert /> </ProtectedAdminRoute>} >
                    <Route index element={<ExpertList />} />
                    <Route path='add' element={<AddExpert />} />
                    <Route path="edit/:id" element={<EditExpert />} />
                </Route>

                <Route path='patient/history/:id' element={<ProtectedStaffRoute> <PatientHistory /> </ProtectedStaffRoute>} >

                </Route>


                <Route path='appointments' element={
                    currentUser.userType == "Admin" ?
                        <AdminAppointment /> :
                        currentUser.userType == "Doctor" ?
                            <DoctorAppointment /> :
                            currentUser.userType == "Patient" ?
                                <PatientAppointment /> :
                                <div />}
                />

                <Route path='profile' element={
                    currentUser.userType == "Admin" ?
                        <AdminProfile /> :
                        currentUser.userType == "Doctor" ?
                            <DoctorProfile /> :
                            currentUser.userType == "Patient" ?
                                <PatientProfile /> :
                                <div />}
                />

                <Route path='/profile' element={<DoctorProfile />} />

            </Route>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />

            <Route path='/getotp' element={<ForgetPassword />} />
            <Route path='/Otpform' element={<OTPForm />} />


            {/* <Route path="/users" element={<UserList />} /> */}
            {/* <Route path="/users3" element={<UserList3 />} /> */}
            {/* <Route path='/adduser' element= {<AddUser />} />
            <Route path="edituser/:id" element={<EditUser />} /> */}
            <Route path='/*' element={<NotFound />} />

        </Routes>
    )
}