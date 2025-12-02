import { createBrowserRouter, Navigate } from "react-router-dom";
import React from 'react';
import RootLayout from "../layouts/RootLayout";
import Home from "../pages/Home/Home/Home";
import AuthLayout from "../layouts/AuthLayout";
import Login from "../pages/Authentication/Login/Login";
import Register from "../pages/Authentication/Register/Register";
import Courses from "../pages/Courses/Courses";
import CourseDetails from "../pages/Courses/CourseDetails";
import StudentDashboard from "../pages/Student/StudentDashboard";
import CoursePlayer from "../pages/Courses/CoursePlayer";
import AdminDashboard from "../pages/Admin/AdminDashboard";
import AdminCourses from "../pages/Admin/AdminCourses";
import AdminCourseForm from "../pages/Admin/AdminCourseForm";
import AdminBatches from "../pages/Admin/AdminBatches";
import AdminEnrollments from "../pages/Admin/AdminEnrollments";
import AdminAssignments from "../pages/Admin/AdminAssignments";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
        {
            index: true,
            Component: Home
        },
        {
          path: "courses",
          Component: Courses
        }
        ,
        {
          path: "courses/:id",
          Component: CourseDetails
        }
    ]
  },
  {
    path: "/student",
    Component: () => {
      const role = localStorage.getItem('userRole') || null;
      if (!localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
      // if admin accidentally navigates to /student, send to admin dashboard
      if (role === 'admin') return <Navigate to="/admin" replace />;
      return <StudentDashboard />;
    }
  },
  {
    path: "/admin",
    Component: () => {
      const role = localStorage.getItem('userRole') || null;
      if (!localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
      if (role !== 'admin') return <Navigate to="/student" replace />;
      return <AdminDashboard />;
    }
  },
  {
    path: "/admin/courses",
    Component: AdminCourses
  },
  {
    path: "/admin/courses/new",
    Component: AdminCourseForm
  },
  {
    path: "/admin/courses/:id",
    Component: AdminCourseForm
  },
  {
    path: "/admin/courses/:courseId/batches",
    Component: AdminBatches
  },
  {
    path: "/admin/courses/:courseId/enrollments",
    Component: AdminEnrollments
  },
  {
    path: "/admin/courses/:courseId/assignments",
    Component: AdminAssignments
  },
  {
    path: "/courses/:id/player",
    Component: CoursePlayer
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login
      },
      {
        path: "register",
        Component: Register
      }
    ]
  }
]);