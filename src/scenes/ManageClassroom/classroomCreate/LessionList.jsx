import React, { useState, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import {
    Card,
    CardContent,
    CardActions,
    Button,
    Typography,
    Box,
    LinearProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
} from '@mui/material'
import courseApi from 'api/courseApi'
import toast from 'react-hot-toast'
import classroomApi from 'api/classroomApi'
import { useNavigate } from 'react-router-dom'

// Custom BorderLinearProgress styled component
const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    height: 10,
    borderRadius: 5,
    backgroundColor: theme.palette.grey[200],
    '& .MuiLinearProgress-bar': {
        borderRadius: 5,
        backgroundColor: theme.palette.primary.main,
    },
}))

function LessonList({ classroomId }) {
    const [courses, setCourses] = useState([]) // state to hold courses
    const [classroom, setClassroom] = useState({})
    const [openCourseDialog, setOpenCourseDialog] = useState(false)
    const [formValues, setFormValues] = useState({ name: '', description: '' })

    const fetchCourses = async () => {
        try {
            const response = await courseApi.getAll(classroomId)
            setCourses(response)
        } catch (error) {
            toast.error('Failed to fetch courses')
        }
    }

    const navigate = useNavigate()

    useEffect(() => {
        // Fetch the list of courses from the backend
        fetchCourses()
    }, []) // Empty dependency array means this effect runs once when the component mounts

    // useEffect(() => {
    //     // Fetch the list of courses from the backend
    //     classroomApi.getById(classroomId).then((result) => {
    //         setClassroom(result)
    //     })
    // }, [classroomId])

    const handleOpenCourseDialog = () => {
        setOpenCourseDialog(true)
    }

    const handleCloseCourseDialog = () => {
        setOpenCourseDialog(false)
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormValues({ ...formValues, [name]: value })
    }

    const handleCreateCourse = () => {
        const saveForm = {
            ...formValues,
            classroom: {
                id: classroomId,
            },
        }

        courseApi
            .save(saveForm) // Assuming save method sends course data to the backend
            .then(() => {
                toast.success('Course created successfully!')

                handleCloseCourseDialog()
                // Optionally, re-fetch the courses to display the newly created one
                return courseApi.getAll(classroomId)
            })
            .then((response) => {
                setCourses(response) // Update course list after creation
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleCickCourse = (courseId) => {
        navigate(`/course/${courseId}`)
    }

    return (
        <Box>
            {/* Display List of Courses as Cards */}
            <Grid container spacing={2}>
                {courses?.map((course) => (
                    <Grid item xs={12} key={course.id}>
                        <Card sx={{ margin: '0 auto', textAlign: 'start' }}>
                            <CardContent>
                                <Typography
                                    variant="h5"
                                    component="div"
                                    gutterBottom
                                >
                                    {course.name}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mb: 1 }}
                                >
                                    Total Lessons: {course.totalLessons || 0}{' '}
                                    {/* Adjust if total lessons exist in the course */}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    Progress: {course.progress || 0}%
                                </Typography>
                                <BorderLinearProgress
                                    variant="determinate"
                                    value={course.progress || 0}
                                />
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handleCickCourse(course.id)}
                                >
                                    Start Learning
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}

                {/* Add New Course Button */}
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleOpenCourseDialog}
                    >
                        Add New Course
                    </Button>
                </Grid>
            </Grid>

            {/* Course Creation Dialog */}
            <Dialog open={openCourseDialog} onClose={handleCloseCourseDialog}>
                <DialogTitle>Create New Course</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Course Name"
                        fullWidth
                        variant="standard"
                        value={formValues.name}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Course Description"
                        fullWidth
                        variant="standard"
                        value={formValues.description}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCourseDialog} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleCreateCourse} color="primary">
                        Create Course
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default LessonList
