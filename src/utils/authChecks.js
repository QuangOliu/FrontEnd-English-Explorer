import { Navigate, useNavigate } from 'react-router-dom'
import { isAdmin, isAuth, isTeacher } from './utils'
import authApi from 'api/authApi'
import { useEffect, useState } from 'react'
import { setLogin, setUser } from 'state'
import { useDispatch } from 'react-redux'

// Redirect to login if not authenticated
export const AuthRoute = ({ element }) => {
    const [user, setuser] = useState({})
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        authApi
            .getCurrent()
            .then((result) => {
                setuser(result)
                dispatch(setUser(result))
            })
            .catch((err) => {
                if (err.response.status === 403) {
                    dispatch(setUser(null))
                    navigate('/login')
                }
            })
    }, [])

    return isAuth(user) ? element : <Navigate to="/login" />
}

export const AdminRoute = ({ element }) => {
    const [user, setUserState] = useState(null); // null để biết user chưa được tải
    const navigate = useNavigate();

    useEffect(() => {
        authApi
            .getCurrent()
            .then((result) => {
                setUserState(result); // Lưu user vào state
            })
            .catch((err) => {
                if (err.response?.status === 403) {
                    navigate("/login");
                }
            });
    }, [navigate]);

    // Trong lúc tải user, hiển thị loader
    if (user === null) {
        return <div>Loading...</div>;
    }

    // Kiểm tra quyền admin
    return (isAdmin(user) || isTeacher(user)) ? element : <Navigate to="/" />;
};

export const handleGetCurrentUser = (setUser) => {
    authApi
        .getCurrent()
        .then((result) => {
            setUser(result)
        })
        .catch((err) => {
            if (err.response.status === 403) {
                setUser(null)
                // navigate('/login')
                // ;
            }
        })
}
