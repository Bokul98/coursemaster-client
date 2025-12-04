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
import StudentWatch from "../pages/Student/StudentWatch";
import StudentAssignment from "../pages/Student/StudentAssignment";
import StudentQuiz from "../pages/Student/StudentQuiz";
import CoursePlayer from "../pages/Courses/CoursePlayer";
import Assignment from "../pages/Courses/Assignment";
import Quiz from "../pages/Courses/Quiz";
import AdminLayout from "../layouts/AdminLayout";
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
    path: "/student/course/:id/watch",
    Component: StudentWatch
  },
  {
    path: "/student/course/:id/assignment",
    Component: StudentAssignment
  },
  {
    path: "/student/course/:id/quiz",
    Component: StudentQuiz
  },
  {
    path: "/admin",
    Component: () => {
      const role = localStorage.getItem('userRole') || null;
      if (!localStorage.getItem('accessToken')) return <Navigate to="/login" replace />;
      if (role !== 'admin') return <Navigate to="/student" replace />;
      return <AdminLayout />;
    },
    children: [
      { index: true, Component: AdminDashboard },
      { path: "courses", Component: AdminCourses },
      { path: "courses/new", Component: AdminCourseForm },
      { path: "courses/:id", Component: AdminCourseForm },
      { path: "courses/:courseId/batches", Component: AdminBatches },
      { path: "courses/:courseId/enrollments", Component: AdminEnrollments },
      { path: "courses/:courseId/assignments", Component: AdminAssignments }
    ]
  },
  {
    path: "/courses/:id/player",
    Component: CoursePlayer
  },
  {
    path: "/courses/:id/player/assignment/:lessonIndex",
    Component: Assignment
  },
  {
    path: "/courses/:id/player/quiz/:lessonIndex",
    Component: Quiz
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