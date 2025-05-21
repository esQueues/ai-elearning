import {Outlet, Route, Routes} from "react-router-dom";
import Login from "./pages/Login";
import RegisterStudent from "./pages/RegisterStudent";
import RegisterTeacher from "./pages/RegisterTeacher";
import Home from "./pages/Home";
import DashboardPage from "./pages/Dashboard";
import Course from "./pages/Course";
import Profile from "./pages/Profile";
import Lecture from "./pages/Lecture";
import QuizProfile from "./pages/QuizProfile";
import QuizTaker from "./pages/QuizTaker";
import TeacherProfile from "./pages/TeacherProfile";
import CourseList from "./pages/CourseList";
import Teachers from "./pages/Teachers";
import TeacherDashboard from "./pages/TeacherDashboard";
import CourseManage from "./pages/CourseManage";
import AddQuiz from "./pages/AddQuiz";
import AddModule from "./pages/AddModule";
import AddLecture from "./pages/AddLecture";
import EditModule  from "./pages/EditModule";
import EditLecture from "./pages/EditLecture";
import EditQuiz from "./pages/EditQuiz";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AddCourse from "./pages/AddCourse";
import AdminStudentsPage from "./pages/AdminStudentsPage";
import StudentProfilePage from "./pages/StudentProfilePage";
import AdminTeachersPage from "./pages/AdminTeachersPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminFeedbacksPage from "./pages/AdminFeedbacksPage";
import AdminCoursePage from "./pages/AdminCoursePage";
import PublicTeacherProfile from "./pages/PublicTeacherProfile";
import CompletedCourses from "./pages/CompletedCourses";
import Footer from "./components/Footer";

const AppRoutes = () => {
    return (
        <Routes>

            {/*<Route element={<ProtectedRoute />}>*/}
            <Route element={<NavbarWrapper />}>
                <Route path="/" element={<Login />} />
                <Route path="/register/student" element={<RegisterStudent />} />
                <Route path="/register/teacher" element={<RegisterTeacher />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
                <Route path="/courses/:id" element={<Course />} />
                <Route path="/courses/:id/manage" element={<CourseManage />} />
                <Route path="/modules/:id/add-quiz" element={<AddQuiz />} />
                <Route path="/modules/:id/add-lecture" element={<AddLecture />} />
                <Route path="/modules/:moduleId/edit" element={<EditModule />} />
                <Route path="/lectures/:lectureId/edit" element={<EditLecture />} />
                <Route path="/quizzes/:quizId/edit" element={<EditQuiz />} />
                <Route path="/courses/:id/add-module" element={<AddModule />} />
                <Route path="/courses/create" element={<AddCourse />} />


                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/students" element={<AdminStudentsPage />} />
                <Route path="/admin/students/:id" element={<StudentProfilePage />} />
                <Route path="/admin/teachers" element={<AdminTeachersPage />} />
                <Route path="/admin/feedbacks" element={<AdminFeedbacksPage />} />
                <Route path="/admin/courses" element={<AdminCoursePage />} />

                <Route path="/home" element={<Home />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/lectures/:id" element={<Lecture />} />
                <Route path="/quiz/:quizId/profile" element={<QuizProfile />} />
                <Route path="/quiz/:quizId" element={<QuizTaker />} />
                <Route path="/teachers/public/:teacherId" element={<PublicTeacherProfile />} />
                <Route path="/teachers/:teacherId" element={<TeacherProfile />} />
                <Route path="/courses" element={<CourseList />} />
                <Route path="/teachers" element={<Teachers />} />
                <Route path="/completed-courses" element={<CompletedCourses />} />

            </Route>
            {/*</Route>*/}
        </Routes>
    );
};

const NavbarWrapper = () => {
    return (
        <div className="d-flex flex-column min-vh-100">
            <Navbar />
            <div className="flex-grow-1">
                <Outlet />
            </div>
            <Footer />
        </div>
    );
};


export default AppRoutes;