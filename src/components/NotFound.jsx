import { Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    const navigate = useNavigate()

    const handleGoHome = () => {
        navigate('/') // Chuyển hướng về trang chính
    }

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>404 - PAGE NOT FOUND</b>
            </Typography>
            <Typography variant="h6" textAlign="left" sx={{ mb: '30px' }}>
                The page you're looking for does not exist.
            </Typography>
            {/* Nút quay lại trang chính */}
            <Button variant="contained" color="primary" onClick={handleGoHome}>
                Go to Home
            </Button>
        </div>
    )
}

export default NotFound
