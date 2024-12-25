import { useState } from 'react'
import {
    Box,
    Button,
    TextField,
    useMediaQuery,
    Typography,
    useTheme,
    Snackbar,
    Alert,
} from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import { Formik } from 'formik'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setLogin, setUser } from 'state'
import Dropzone from 'react-dropzone'
import FlexBetween from 'components/FlexBetween'
import authApi from 'api/authApi'
import { setTokens } from 'utils/utils'

const initialValuesRegister = {
    fullname: '',
    email: '',
    username: '',
    password: '',
    // picture: "",
}

const initialValuesLogin = { email: '', password: '' }

const registerSchema = yup.object().shape({
    fullname: yup.string().trim().required('First name is required'),
    email: yup
        .string()
        .trim()
        .email('invalide email')
        .required('Last name is required'),
    username: yup.string().lowercase().trim().required('Email is required'),
    password: yup.string().trim().required('Password is required'),
    // picture: yup.string().required("require"),
})

const loginSchema = yup.object().shape({
    username: yup.string().lowercase().trim().required('Email is required'),
    password: yup.string().trim().required('Password is required'),
})

export default function Form() {
    const [pageType, setPageType] = useState('login')
    const [errorMessage, setErrorMessage] = useState('')
    const [openLog, setOpenLog] = useState(false)
    const { palette } = useTheme()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const isNonMobile = useMediaQuery('(min-width:600px)')
    const isLogin = pageType === 'login'
    const isRegister = pageType === 'register'

    const login = async (values, onSubmitProps) => {
        values['username'] = values['username'].toLowerCase().trim()
        authApi
            .login(values)
            .then((response) => {
                // Xử lý response thành công
                // 
                // dispatch(setLogin(response))
                
                setTokens(response.access_token, response.refresh_token)
                navigate('/')
            })
            .then((data) => {
                return authApi.getCurrent()
            })
            .then((data) => {
                console.log(data)
                dispatch(setUser(data))
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message)
                setOpenLog(true)
            })
    }
    const register = async (values, onSubmitProps) => {
        authApi
            .register(values)
            .then((response) => {
                // Xử lý response thành công
                
                setTokens(response.access_token, response.refresh_token)
                navigate('/')
            })
            .then((data) => {
                return authApi.getCurrent()
            })
            .then((data) => {
                console.log(data)
                dispatch(setUser(data))
            })
            .catch((error) => {
                setErrorMessage(error.response.data.message)
                setOpenLog(true)
            })
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isLogin) await login(values, onSubmitProps)
        if (isRegister) await register(values, onSubmitProps)
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpenLog(false)
    }

    return (
        <div>
            <h1>Anywhere in your app!</h1>
            <Formik
                initialValues={
                    isLogin ? initialValuesLogin : initialValuesRegister
                }
                validationSchema={isLogin ? loginSchema : registerSchema}
                onSubmit={handleFormSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    setFieldValue,
                    resetForm,
                    isSubmitting,
                    /* and other goodies */
                }) => (
                    <form onSubmit={handleSubmit}>
                        <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                '& > div': {
                                    gridColumn: isNonMobile
                                        ? undefined
                                        : 'span 4',
                                },
                            }}
                        >
                            {isRegister && (
                                <>
                                    <TextField
                                        label="Full name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.fullname}
                                        name="fullname"
                                        error={
                                            Boolean(touched.fullname) &&
                                            Boolean(errors.fullname)
                                        }
                                        helperText={
                                            touched.fullname && errors.fullname
                                        }
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                    <TextField
                                        label="Email"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        value={values.email}
                                        name="email"
                                        error={
                                            Boolean(touched.email) &&
                                            Boolean(errors.email)
                                        }
                                        helperText={
                                            touched.email && errors.email
                                        }
                                        sx={{ gridColumn: 'span 2' }}
                                    />
                                </>
                            )}

                            <TextField
                                label="Username"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.username}
                                name="username"
                                error={
                                    Boolean(touched.username) &&
                                    Boolean(errors.username)
                                }
                                helperText={touched.username && errors.username}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                label="Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.password}
                                name="password"
                                error={
                                    Boolean(touched.password) &&
                                    Boolean(errors.password)
                                }
                                helperText={touched.password && errors.password}
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        {/* BUTTONS */}
                        <Box sx={{ mt: 2 }}>
                            <Button
                                fullWidth
                                type="submit"
                                sx={{
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    '&:hover': { color: palette.primary.main },
                                }}
                            >
                                {!isSubmitting &&
                                    (isLogin ? 'LOGIN' : 'REGISTER')}
                                {isSubmitting && 'Submitting...'}
                            </Button>
                            <Typography
                                onClick={() => {
                                    setPageType(isLogin ? 'register' : 'login')
                                    resetForm()
                                }}
                                sx={{
                                    textDecoration: 'underline',
                                    color: palette.primary.main,
                                    '&:hover': {
                                        cursor: 'pointer',
                                        opacity: 0.5,
                                    },
                                }}
                            >
                                {isLogin
                                    ? "Don't have an account? Sign Up here."
                                    : 'Already have an account? Login here.'}
                            </Typography>
                        </Box>
                    </form>
                )}
            </Formik>

            <Snackbar
                open={openLog}
                autoHideDuration={6000}
                onClose={handleClose}
            >
                <Alert
                    onClose={handleClose}
                    severity="error"
                    sx={{
                        width: '100%',
                        color: 'white',
                        backgroundColor: 'red',
                        '& > svg': { color: 'white' },
                    }}
                >
                    {errorMessage}
                </Alert>
            </Snackbar>
        </div>
    )
}
