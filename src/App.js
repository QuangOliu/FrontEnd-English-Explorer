import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import MainLayout from 'components/layout/MainLayout'
import NotFound from 'components/NotFound'
import { useMemo } from 'react'
import { Toaster } from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ManageDashboad from 'scenes/Admin'
import ManageQuestion from 'scenes/Admin/ManageQuestion'
import ManageUser from 'scenes/Admin/ManageUser'
import Bookmarks from 'scenes/Bookmarks'
import ClassroomPage from 'scenes/ClassroomPage/ClassroomPgae'
import EditProfile from 'scenes/EditProfile'
import ExamInfo from 'scenes/ExamPage/ExamInfo'
import ExamPage from 'scenes/ExamPage/ExamPage'
import Favorites from 'scenes/Favorites'
import HomePage from 'scenes/homePage'
import LoginPage from 'scenes/loginPage'
import RegisterForm from 'scenes/loginPage/RegisterForm'
import ManageClassroom from 'scenes/ManageClassroom'
import ClassroomDetail from 'scenes/ManageClassroom/classroomCreate/ClassroomDetail'
import ClassroomCreate from 'scenes/ManageClassroom/classroomCreate/FormCreate'
import ExamForm from 'scenes/ManageClassroom/Exam/ExamForm'
import ExamiEdit from 'scenes/ManageClassroom/Exam/ExamiEdit'
import ExamUser from 'scenes/ManageClassroom/Exam/ExamUser'
import ProfilePage from 'scenes/profilePage'
import QuestionCreate from 'scenes/questionCreate'
import { AdminRoute, AuthRoute } from 'utils/authChecks'
import { themeSettings } from './theme'
import ClassroomCheckout from 'scenes/ManageClassroom/classroomCreate/ClassroomCheckout'
import PaymentSuccess from 'scenes/Payment/PaymentSuccess'
import PaymentFailure from 'scenes/Payment/PaymentFailure'
import PaymentInvalid from 'scenes/Payment/PaymentInvalid'
import WalletPage from 'scenes/WalletPage'

const NAVIGATION = [
    // Public Routes
    { path: '/login', element: <LoginPage /> },

    // Authenticated Routes
    { path: '/', element: <AuthRoute element={<HomePage />} /> },

    { path: '/profile', element: <AuthRoute element={<ProfilePage />} /> },

    // Classrooms
    { path: '/classrooms', element: <AuthRoute element={<ClassroomPage />} /> },
    {
        path: '/classrooms/checkout/:classroomId',
        element: <AuthRoute element={<ClassroomCheckout />} />,
    },
    {
        path: '/classrooms/:classroomId',
        element: <AuthRoute element={<ClassroomDetail />} />,
    },

    // User Profile and Edit
    { path: '/user/:userId', element: <AuthRoute element={<ProfilePage />} /> },
    {
        path: '/user/:userId/edit',
        element: <AuthRoute element={<EditProfile />} />,
    },

    // Questions
    {
        path: 'manage/questions',
        element: <AdminRoute element={<ManageQuestion />} />,
    },
    {
        path: '/questions/create',
        element: <AuthRoute element={<QuestionCreate />} />,
    },
    {
        path: '/questions/edit/:questionId',
        element: <AuthRoute element={<QuestionCreate />} />,
    },

    // Exams
    { path: '/exam', element: <AuthRoute element={<ExamForm />} /> },
    {
        path: '/exam/edit/:examId',
        element: <AuthRoute element={<ExamiEdit />} />,
    },
    {
        path: '/exam/detail/:examId',
        element: <AuthRoute element={<ExamInfo />} />,
    },
    {
        path: '/exam/user/:examId',
        element: <AdminRoute element={<ExamUser />} />,
    },
    {
        path: '/exam/doing/:examId',
        element: <AuthRoute element={<ExamPage />} />,
    },
    { path: '/exam/:examId', element: <AuthRoute element={<ExamForm />} /> },

    // Admin Routes
    { path: '/manage', element: <AdminRoute element={<ManageDashboad />} /> },
    { path: '/manage/classrooms/create', element: <ClassroomCreate /> },
    {
        path: '/manage/classrooms/edit/:classroomId',
        element: <ClassroomCreate />,
    },
    { path: '/manage/classrooms', element: <ManageClassroom /> },
    { path: '/manage/users/create', element: <RegisterForm /> },
    { path: '/manage/users', element: <ManageUser /> },

    // Payment Routes
    { path: '/payment/success', element: <PaymentSuccess /> },
    { path: '/payment/failure', element: <PaymentFailure /> },
    { path: '/payment/invalid', element: <PaymentInvalid /> },

    // Payment Routes
    { path: '/wallet', element: <AuthRoute element={<WalletPage />} /> },

    // Catch-All Route for 404
    { path: '*', element: <NotFound /> },
]

function App() {
    const mode = useSelector((state) => state.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])

    return (
        <div className="app">
            <BrowserRouter>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Routes>
                        {NAVIGATION.map((route, index) => (
                            <Route
                                key={index}
                                path={route.path}
                                element={
                                    // Bọc các route trong MainLayout
                                    <MainLayout>{route.element}</MainLayout>
                                }
                            />
                        ))}
                    </Routes>
                    <Toaster />
                </ThemeProvider>
            </BrowserRouter>
        </div>
    )
}

export default App
