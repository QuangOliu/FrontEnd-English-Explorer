import { Box, CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import axiosClient from 'api/axiosClient'
import NotFound from 'components/NotFound'
import { useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
    BrowserRouter,
    matchPath,
    Navigate,
    Route,
    Routes,
    useLocation,
} from 'react-router-dom'
import ManageDashboad from 'scenes/Admin'
import EditProduct from 'scenes/Admin/EditProduct'
import ManageOrder from 'scenes/Admin/ManageOrder'
import ManageProduct from 'scenes/Admin/ManageProduct'
import OrderDetail from 'scenes/OrderDetail'
import StatisticalProduct from 'scenes/Statistical/Product'
import Checkout from 'scenes/checkoutPage/Checkout'
import CartMenu from 'scenes/global/CarMenu'
import Navbar from 'scenes/global/Navbar'
import HomePage from 'scenes/homePage'
import LoginPage from 'scenes/loginPage'
import ProductCreate from 'scenes/productCreate'
import ProductDetail from 'scenes/productDetail'
import ProfilePage from 'scenes/profilePage'
import SearchPage from 'scenes/searchPage'
import { themeSettings } from './theme'
import ManageUser from 'scenes/Admin/ManageUser'
import EditProfile from 'scenes/EditProfile'
import RegisterForm from 'scenes/loginPage/RegisterForm'
import ManageQuestion from 'scenes/Admin/ManageQuestion'
import QuestionCreate from 'scenes/questionCreate'
import ClassroomCreate from 'scenes/ManageClassroom/classroomCreate/FormCreate'
import ManageClassroom from 'scenes/ManageClassroom'
import ClassroomDetail from 'scenes/ManageClassroom/classroomCreate/ClassroomDetail'
import ExamForm from 'scenes/ManageClassroom/Exam/ExamForm'
import ExamiDetail from 'scenes/ManageClassroom/Exam/ExamiDetail'
import { isAdmin, isAuth } from 'utils/utils'
import ClassroomPage from 'scenes/ClassroomPage/ClassroomPgae'

function App() {
    const mode = useSelector((state) => state.mode)
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
    const user = useSelector((state) => state.user)

    const ScrollToTop = () => {
        const location = useLocation()

        // Define routes where the Navbar should be hidden
        const hideNavbarRoutes = [
            '/classrooms/:questionId',
            '/question/:questionId',
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
                    <ScrollToTop />
                    {/* {hideNavbar && <Navbar />} Conditionally render Navbar */}
                    <Box>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route
                                path="/classrooms"
                                element={<ClassroomPage />}
                            >
                                <Route
                                    path=":classroomId"
                                    element={<ClassroomDetail />}
                                />
                            </Route>
                            <Route
                                path="/user/:userId"
                                element={
                                    isAuth(user) ? (
                                        <ProfilePage />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route
                                path="/user/:userId/edit"
                                element={
                                    isAuth(user) ? (
                                        <EditProfile />
                                    ) : (
                                        <Navigate to="/login" />
                                    )
                                }
                            />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/search" element={<SearchPage />} />
                            <Route
                                path="/products/:productId"
                                element=<ProductDetail />
                            />

                            <Route path="/questions">
                                <Route
                                    path="create"
                                    element={<QuestionCreate />}
                                />
                                <Route
                                    path="edit/:questionId"
                                    element={<QuestionCreate />}
                                />
                                <Route index element=<ManageQuestion /> />
                            </Route>

                            <Route path="/exam">
                                <Route path=":examId" element={<ExamForm />} />
                                <Route
                                    path="detail/:examId"
                                    element={<ExamiDetail />}
                                />
                            </Route>

                            <Route path="/orders">
                                <Route
                                    path=":orderId"
                                    element={<OrderDetail />}
                                />
                            </Route>
                            {isAdmin(user) && (
                                <Route path="/manage">
                                    <Route path="orders">
                                        <Route index element=<ManageOrder /> />
                                    </Route>

                                    <Route path="classrooms">
                                        <Route
                                            path="create"
                                            element={<ClassroomCreate />}
                                        />
                                        <Route
                                            path="edit/:classroomId"
                                            element={<ClassroomCreate />}
                                        />
                                        <Route
                                            index
                                            element=<ManageClassroom />
                                        />
                                    </Route>

                                    <Route path="users">
                                        <Route
                                            path="create"
                                            element={<RegisterForm />}
                                        />
                                        <Route index element={<ManageUser />} />
                                    </Route>

                                    <Route index element={<ManageDashboad />} />
                                </Route>
                            )}
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
