import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer} from 'react-toastify';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard'
import PostIssues from './pages/PostIssues';
import LiveCollaboration from './pages/LiveCollaboration';
import MyIssues from './pages/MyIssues';
import MySnippets from './pages/MySnippets';
import AllIssues from './pages/AllIssues';
import AllSnippets from './pages/AllSnippets';
import Profile from './pages/Profile';
import IssueDetails from "./pages/IssueDetails";
import LiveRoomSetup from './pages/LiveRoomSetup';

const App = () => {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}></Route>
        <Route path='/login' element={<Login/>}></Route>
        <Route path='/email-verify' element={<EmailVerify/>}></Route>
        <Route path='/reset-password' element={<ResetPassword/>}></Route>
        <Route path='/admin' element={<AdminDashboard/>}></Route>
        <Route path='/userdashboard' element={<UserDashboard/>}></Route>

        <Route path="/post-issues" element={<PostIssues/>} />
        <Route path="/live" element={<LiveRoomSetup />} />
<Route path="/live/:roomId" element={<LiveCollaboration />} />
        <Route path="/my-issues" element={<MyIssues/>} />
        <Route path="/my-snippets" element={<MySnippets/>} />
        <Route path="/all-issues" element={<AllIssues/>} />
        <Route path="/issue/:id" element={<IssueDetails />} />
        <Route path="/all-snippets" element={<AllSnippets/>} />
        <Route path="/profile" element={<Profile/>} />
      </Routes>
    </div>
  )
}

export default App

