import { Grid, Box } from '@mui/material'
import { useLocation, matchPath } from 'react-router-dom'
import Navbar from 'scenes/global/Navbar'
import Sidebar from 'components/layout/SideBar'
import { Toaster } from 'react-hot-toast'

const pathsWithoutNavbarSidebar = ['/login', '/register'] // Đường dẫn không có Navbar và Sidebar
const pathsWithWildcard = ["/exam/doing/*"] // Các đường dẫn có wildcard

const MainLayout = ({ children }) => {
    const location = useLocation() // Lấy đường dẫn hiện tại

    // Kiểm tra nếu đường dẫn là một trong các path không có Navbar và Sidebar
    const isNoNavbarSidebar = pathsWithoutNavbarSidebar.includes(location.pathname) || 
        pathsWithWildcard.some(path => matchPath(path, location.pathname))

    return (
        <>
            {/* Chỉ hiển thị Navbar nếu không phải các path không có Navbar */}
            {!isNoNavbarSidebar && <Navbar />}
            <Grid container style={{ flex: 1 }}>
                {/* Chỉ hiển thị Sidebar nếu không phải các path không có Sidebar */}
                {!isNoNavbarSidebar && (
                    <Grid item xs={2}>
                        <Sidebar />
                    </Grid>
                )}
                <Grid
                    item
                    xs={isNoNavbarSidebar ? 12 : 10}
                    style={{ padding: '20px' }}
                >
                    {children}
                </Grid>
            </Grid>
            <Toaster />
        </>
    )
}

export default MainLayout
