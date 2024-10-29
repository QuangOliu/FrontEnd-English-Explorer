import React, { useEffect, useState } from 'react'
import {
    Button,
    TextField,
    Box,
    FormControl,
    FormControlLabel,
    Checkbox,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Typography,
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from '@emotion/react'
import { useParams } from 'react-router-dom'
import classroomApi from 'api/classroomApi'

// Danh sách các giá trị SkillType và LevelType
const accessTypes = ['PUBLIC', 'PRIVATE', 'PROTECTED']

const ClassroomCreate = () => {
    const [imageUrl, setImageUrl] = useState('')
    const [audioUrl, setAudioUrl] = useState('')
    const [pageType, setPageType] = useState('add')
    const [formValues, setFormValues] = useState({
        id: '',
        accessType: '',
        name: '',
        courses: [],
        exams: [],
        classMembers: [],
        user: {},
    })
    const [errors, setErrors] = useState({})
    const { palette } = useTheme()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            classroomApi.create(formValues).then((result) => {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    id: questionId,
                }))

                toast.success('Successfully Create Question!')
            })
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const validate = () => {
        const newErrors = {}

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // Trả về true nếu không có lỗi
    }
    const { questionId } = useParams()

    useEffect(() => {
        if (questionId) {
            setPageType('edit')
            classroomApi
                .getById(questionId)
                .then((result) => {
                    console.log(result)
                    return result
                })
                .then((result) => {
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        id: questionId,
                        user: result.user,
                        accessType: result.accessType,
                        name: result.name,
                        courses: result.courses.map((choise, index) => ({
                            ...choise,
                        })),
                        exams: result.exams.map((choise, index) => ({
                            ...choise,
                        })),
                        classMembers: result.classMembers.map(
                            (choise, index) => ({
                                ...choise,
                            })
                        ),
                    }))
                })
                .catch((err) => console.error('Error fetching user:', err))
        } else {
            setPageType('add')
        }
    }, [questionId])

    return (
        <Box sx={{ mx: 'auto', p: 2 }}>
            <Grid container spacing={2}>
                {/* Phần form */}
                <Grid item xs={6}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <InputLabel id="skill-label">Skill</InputLabel>
                            <Select
                                labelId="skill-label"
                                name="accessType"
                                value={formValues.accessType}
                                onChange={handleChange}
                            >
                                {accessTypes.map((accessType) => (
                                    <MenuItem
                                        key={accessType}
                                        value={accessType}
                                    >
                                        {accessType}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            sx={{ mt: 2 }}
                            label="Name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            fullWidth
                        />
                        <Button
                            sx={{ mt: 2 }}
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Submit
                        </Button>
                    </form>
                </Grid>
            </Grid>
            <Toaster />
        </Box>
    )
}

export default ClassroomCreate
