import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import examApi from 'api/examApi'
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material'
import toast, { Toaster } from 'react-hot-toast'
import { useTheme } from '@emotion/react'

function MemberList({ classroomId }) {
    const [exams, setExams] = useState([])
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()
    const theme = useTheme()

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        accessType: 'PRIVATE', // Default value
    })

    useEffect(() => {
        examApi
            .getExamsByClassroom(classroomId)
            .then((result) => {
                setExams(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [classroomId])

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setFormData({
            title: '',
            description: '',
            startDate: '',
            endDate: '',
            accessType: 'PRIVATE',
        })
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }))
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        const classroomIdAsNumber = Number(classroomId)

        examApi
            .save({ ...formData, classroom: { id: classroomIdAsNumber } })
            .then(() => {
                toast.success('Exam created successfully!')
                return examApi.getExamsByClassroom(classroomIdAsNumber)
            })
            .then((result) => {
                setExams(result)
                handleClose()
            })
            .catch((err) => {
                console.error(err)
            })
    }

    // Function to navigate to exam detail page
    const handleEditClick = (examId) => {
        navigate(`/exam/${examId}`)
    }

    return (
        <div>
            <h2>Exams for Classroom-{classroomId}</h2>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Exam Title</TableCell>
                            <TableCell>Questions</TableCell>
                            <TableCell>Start Date</TableCell>
                            <TableCell>End Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {exams.map((exam) => (
                            <TableRow
                                key={exam.id}
                                onClick={() => handleEditClick(exam.id)}
                                sx={{
                                    '&:hover': {
                                        backgroundColor:
                                            theme.palette.action.hover,
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <TableCell>
                                    <Typography
                                        variant="body1"
                                        sx={{ fontWeight: 'bold' }}
                                    >
                                        {exam.title}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: 'gray' }}
                                    >
                                        {exam.questions?.length} Questions
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {exam.startDate ? (
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: 'green',
                                            }}
                                        >
                                            {new Date(
                                                exam.startDate
                                            ).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'gray' }}>
                                            Start Date Not Set
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    {exam.endDate ? (
                                        <span
                                            style={{
                                                fontWeight: 'bold',
                                                color: 'red',
                                            }}
                                        >
                                            {new Date(
                                                exam.endDate
                                            ).toLocaleDateString()}
                                        </span>
                                    ) : (
                                        <span style={{ color: 'gray' }}>
                                            End Date Not Set
                                        </span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="outlined"
                onClick={handleClickOpen}
                style={{ marginTop: '20px' }}
            >
                Add Exam
            </Button>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: handleSubmit,
                }}
            >
                <DialogTitle>Add Exam</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To create a new exam, please fill in the details below.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        name="title"
                        label="Exam Title"
                        value={formData.title}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="description"
                        label="Description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                    />
                    <TextField
                        margin="dense"
                        name="startDate"
                        label="Start Date"
                        type="date"
                        value={formData.startDate}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        margin="dense"
                        name="endDate"
                        label="End Date"
                        type="date"
                        value={formData.endDate}
                        onChange={handleChange}
                        fullWidth
                        variant="standard"
                        InputLabelProps={{ shrink: true }}
                    />
                    <FormControl fullWidth variant="standard" margin="dense">
                        <InputLabel id="access-type-label">
                            Access Type
                        </InputLabel>
                        <Select
                            labelId="access-type-label"
                            name="accessType"
                            value={formData.accessType}
                            onChange={handleChange}
                        >
                            <MenuItem value="PUBLIC">Public</MenuItem>
                            <MenuItem value="PRIVATE">Private</MenuItem>
                            <MenuItem value="PROTECTED">Protected</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Add Exam</Button>
                </DialogActions>
            </Dialog>
            <Toaster />
        </div>
    )
}

export default MemberList
