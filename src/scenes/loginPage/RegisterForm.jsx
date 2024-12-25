import React, { useEffect, useState } from 'react'
import { Formik } from 'formik'
import * as yup from 'yup'
import { Alert, Box, Button, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTheme, useMediaQuery } from '@mui/material'
import userApi from 'api/userApi'

const registerSchema = yup.object().shape({
    active: yup.number().required('Active status is required'),
    fullname: yup.string().trim().required('Full name is required'),
    email: yup
        .string()
        .lowercase()
        .trim()
        .email('Invalid email')
        .required('Email is required'),
    password: yup.string().trim().required('Password is required'),
    retypePassword: yup
        .string()
        .trim()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
        .required('Retype password is required'),
})

export default function RegisterForm({ userId, onSuccess }) {
    const [pageType, setPageType] = useState('add')
    const [open, setOpen] = useState(false)
    const [initialValues, setInitialValues] = useState({
        fullname: '',
        email: '',
        password: '',
        username:"",
        retypePassword: '',
        active: 1,
    })
    const { palette } = useTheme()
    const isNonMobile = useMediaQuery('(min-width:600px)')
    const isEdit = pageType === 'edit'
    const isAdd = pageType === 'add'
    const navigate = useNavigate()

    const add = async (values, onSubmitProps) => {
        try {
            const savedUserResponse = await fetch(
                `${process.env.REACT_APP_BASE_URL}users`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', // Sử dụng JSON cho Content-Type
                    },
                    body: JSON.stringify(values),
                }
            )

            if (!savedUserResponse.ok) {
                throw new Error('Error creating user')
            }

            const savedUser = await savedUserResponse.json()
            console.log(savedUser)
            onSubmitProps.resetForm()
            setOpen(true)
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess()
                } else {
                    navigate('/manage/users')
                }
            }, 1000)
        } catch (error) {
            console.error('Error saving user:', error)
            // Có thể hiển thị thông báo lỗi cho người dùng
        }
    }

    const update = async (values, onSubmitProps) => {
        try {
            const updatedUserResponse = await fetch(
                `${process.env.REACT_APP_BASE_URL}users/${userId}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json', // Sử dụng JSON cho Content-Type
                    },
                    body: JSON.stringify(values),
                }
            )

            if (!updatedUserResponse.ok) {
                throw new Error('Error updating user')
            }

            const updatedUser = await updatedUserResponse.json()
            console.log(updatedUser)
            setOpen(true)
            onSubmitProps.resetForm()
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess()
                } else {
                    navigate('/manage/users')
                }
            }, 1000)
        } catch (error) {
            console.error('Error updating user:', error)
            // Có thể hiển thị thông báo lỗi cho người dùng
        }
    }

    const handleFormSubmit = async (values, onSubmitProps) => {
        if (isEdit) {
            return update(values, onSubmitProps)
        }

        if (isAdd) {
            return add(values, onSubmitProps)
        }
    }

    useEffect(() => {
        if (userId) {
            setPageType('edit')
            userApi
                .getUserById(userId)
                .then((result) => {
                    setInitialValues((prevValues) => ({
                        ...prevValues,
                        fullname: result.fullname,
                        email: result.email,
                        username: result.username,
                        id: result.id || userId
                    }))
                })
                .catch((err) => console.error('Error fetching user:', err))
        } else {
            setPageType('add')
        }
    }, [userId])

    return (
        <div>
            <h1>{isEdit ? 'Edit Account' : 'Add New User'}</h1>
            <Formik
                initialValues={initialValues}
                validationSchema={registerSchema}
                enableReinitialize={true}
                onSubmit={handleFormSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    resetForm,
                    isSubmitting,
                    dirty,
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
                            <TextField
                                label="Full Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.fullname}
                                name="fullname"
                                error={
                                    Boolean(touched.fullname) &&
                                    Boolean(errors.fullname)
                                }
                                helperText={touched.fullname && errors.fullname}
                                sx={{ gridColumn: 'span 4' }}
                            />
                            <TextField
                                label="User Name"
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
                                label="Email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.email}
                                name="email"
                                error={
                                    Boolean(touched.email) &&
                                    Boolean(errors.email)
                                }
                                helperText={touched.email && errors.email}
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
                            <TextField
                                label="Retype Password"
                                type="password"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.retypePassword}
                                name="retypePassword"
                                error={
                                    Boolean(touched.retypePassword) &&
                                    Boolean(errors.retypePassword)
                                }
                                helperText={
                                    touched.retypePassword &&
                                    errors.retypePassword
                                }
                                sx={{ gridColumn: 'span 4' }}
                            />
                        </Box>

                        <Box>
                            <Button
                                fullWidth
                                disabled={!dirty}
                                type="submit"
                                sx={{
                                    backgroundColor: palette.primary.main,
                                    color: palette.background.alt,
                                    '&:hover': { color: palette.primary.main },
                                }}
                            >
                                {!isSubmitting && (isAdd ? 'REGISTER' : 'Save')}
                                {isSubmitting && 'Submitting...'}
                            </Button>
                        </Box>
                    </form>
                )}
            </Formik>
            <Alert
                open={open}
                setOpen={setOpen}
                title={'Success'}
                message={
                    isEdit
                        ? 'Account updated successfully'
                        : 'Account created successfully'
                }
            />
        </div>
    )
}
