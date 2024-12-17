import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import NotFound from 'components/NotFound'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    BrowserRouter,
    matchPath,
    Route,
    Routes,
    useLocation
} from 'react-router-dom'
import ManageDashboad from 'scenes/Admin'
import ManageQuestion from 'scenes/Admin/ManageQuestion'
import ManageUser from 'scenes/Admin/ManageUser'
import ClassroomPage from 'scenes/ClassroomPage/ClassroomPgae'
import EditProfile from 'scenes/EditProfile'
import CartMenu from 'scenes/global/CarMenu'
import Navbar from 'scenes/global/Navbar'
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
import ExamInfo from 'scenes/ExamPage/ExamInfo'
import ExamPage from 'scenes/ExamPage/ExamPage'

function App() {
    const mode = useSelector((state) => state.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
    // const [user, setUser] = useState({})

    // useEffect(() => {
    //     handleGetCurrentUser(setUser);
    // }, [])
    const ScrollToTop = () => {
        const location = useLocation()

        // Define routes where the Navbar should be hidden
        const hideNavbarRoutes = [
            '/classrooms/:questionId',
            '/question/:questionId',
            '/exam/doing/:examId'
        ]

        // Check if the current path matches any route pattern in hideNavbarRoutes
        const hideNavbar = hideNavbarRoutes.some((pattern) =>
            matchPath(pattern, location.pathname)
        )

        useEffect(() => {
            window.scrollTo(0, 0)
        }, [location.pathname])

        return <>{!hideNavbar && <Navbar />}</>
    }

    return (
        <div className="app">
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <ScrollToTop/>
                <Box>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        
                        <Route path="/" element={<AuthRoute element={<HomePage />} />} />

                        {/* Classrooms */}
                        <Route path="/classrooms" element={<AuthRoute element={<ClassroomPage />} />} />
                        <Route path="/classrooms/:classroomId" element={<AuthRoute element={<ClassroomDetail />} />} />

                        {/* User Profile and Edit */}
                        <Route path="/user/:userId" element={<AuthRoute element={<ProfilePage />} />} />
                        <Route path="/user/:userId/edit" element={<AuthRoute element={<EditProfile />} />} />

                        {/* Questions */}
                        <Route path="/questions" element={<AuthRoute element={<ManageQuestion />} />} />
                        <Route path="/questions/create" element={<AuthRoute element={<QuestionCreate />} />} />
                        <Route path="/questions/edit/:questionId" element={<AuthRoute element={<QuestionCreate />} />} />

                        {/* Exams */}
                        <Route path="/exam" element={<AuthRoute element={<ExamForm />} />} />
                        <Route path="/exam/edit/:examId" element={<AuthRoute element={<ExamiEdit />} />} />
                        <Route path="/exam/detail/:examId" element={<AuthRoute element={<ExamInfo />} />} />
                        <Route path="/exam/user/:examId" element={<AdminRoute element={<ExamUser />} />} />
                        <Route path="/exam/doing/:examId" element={<AuthRoute element={<ExamPage />} />} />
                        <Route path="/exam/:examId" element={<AuthRoute element={<ExamForm />} />} />

                        {/* Admin Routes */}
                        <Route path="/manage" element={<AdminRoute element={<ManageDashboad />} />} />
                            
                        <Route path="/manage/classrooms/create" element={<ClassroomCreate />} />
                        <Route path="/manage/classrooms/edit/:classroomId" element={<ClassroomCreate />} />
                        <Route path="/manage/classrooms" element={<ManageClassroom />} />

                        <Route path="/manage/users/create" element={<RegisterForm />}/>
                        <Route  path="/manage/users" element={<ManageUser  />} />

                        {/* Catch-All Route for 404 */}
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Box>
                <CartMenu />
            </ThemeProvider>
        </BrowserRouter>
    </div>
    )
}

export default App
