import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route, Navigate } from 'react-router-dom';

import './App.css'
import ViewProfile from './pages/profile/viewProfile';
import Template from './utils/template';
import EditProfile from './pages/profile/editProfile';
import JobRole from './pages/profile/jobRole';
import SkillAnalysis from './pages/profile/skillAnalysis';
import JobDetails from './pages/profile/jobDetails';
import Resources from './pages/profile/resources';
import ResumeBuilder from './pages/profile/resume';


import { ToastContainer } from 'react-toastify';
import Login from './pages/auth/login';
import Signup from './pages/auth/signup';
import HeroPage from './pages/profile/hero';

const router = createBrowserRouter(createRoutesFromElements(
  <>
    <Route path='auth'>
      <Route path='login' element={<Login />} />
      <Route path='signup' element={<Signup />} />
    </Route>
    <Route path='/' element={<HeroPage />} />
    <Route element={<Template />}>
      <Route path='profile'>
        <Route index element={<ViewProfile />} />
        <Route path='editProfile' element={<EditProfile />} />
      </Route>
      <Route path='dashboard' />
      <Route path='jobs'>
        <Route path='matchResults' element={<JobRole />} />
        <Route path='jobDetails' element={<JobDetails />} />
      </Route>
      <Route path='learning'>
        <Route path='skillGaps' element={<SkillAnalysis />} />
        <Route path='resources' element={<Resources />} />
      </Route>
      <Route path='resume'>
        <Route path='builder' element={<ResumeBuilder />} />
      </Route>
    </Route>
  </>
))

function App() {

  return (
    <>
      <RouterProvider router={router} />

      {/* Toast Container */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default App
