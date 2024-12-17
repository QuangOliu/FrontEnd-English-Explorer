import {
    Box,
    Button,
    Collapse,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import examApi from 'api/examApi'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import TableQuestions from 'scenes/Admin/ManageQuestion/TableQuestions'
import QuestionForm from './QuestionForm'

const ExamiEdit = () => {
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        accessType: 'PRIVATE', // Default value
        questions: [], // Each question will have the updated structure
    })
    const { examId } = useParams()
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null)

    useEffect(() => {
        if (examId) {
            examApi
                .getById(examId)
                .then((result) => {
                    setFormValues({
                        title: result.title || '',
                        description: result.description || '',
                        startDate: result.startDate || '',
                        endDate: result.endDate || '',
                        accessType: result.accessType || 'PRIVATE',
                        questions:
                            result.questions.map((q) => ({
                                id: q.id || '', // Ensure id is populated if available
                                question: q.question || '',
                                explanation: q.explanation || '',
                                skill: q.skill || '',
                                level: q.level || '',
                                image: q.image || '',
                                audio: q.audio || '',
                                choises: q.choises || [],
                            })) || [],
                    })
                })
                .catch((err) => {
                    console.error('Failed to fetch exam data:', err)
                    toast.error('Error loading exam details')
                })
        }
    }, [examId])
    const navigate = useNavigate() // Initialize the useNavigate hook

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleAddQuestion = () => {
        setFormValues((prev) => ({
            ...prev,
            questions: [
                ...prev.questions,
                {
                    // Add a new question with the updated structure
                    id: '',
                    question: '',
                    explanation: '',
                    skill: '',
                    level: '',
                    image: '',
                    audio: '',
                    choises: [],
                },
            ],
        }))
    }

    const handleRemoveQuestion = (index) => {
        setFormValues((prev) => {
            const updatedQuestions = [...prev.questions]
            updatedQuestions.splice(index, 1)
            return { ...prev, questions: updatedQuestions }
        })
        if (expandedQuestionIndex === index) {
            setExpandedQuestionIndex(null)
        }
    }

    const handleQuestionChange = (index, updatedQuestion) => {
        const updatedQuestions = [...formValues.questions]
        updatedQuestions[index] = updatedQuestion // Update with the entire question object
        // console.log({updatedQuestions});
        setFormValues((prev) => ({ ...prev, questions: updatedQuestions }))
    }

    const handleToggleQuestion = (index) => {
        setExpandedQuestionIndex((prevIndex) =>
            prevIndex === index ? null : index
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formValues)
        if (examId) {
            formValues.id = examId // You might also need to update formValues with an exam ID
        }
        try {
            examApi
                .save(formValues)
                .then((result) => {
                    toast.success('Exam saved successfully')
                    setTimeout(() => {
                        navigate(-1)
                    }, 500)
                })
                .catch((err) => {})
        } catch (error) {
            toast.error('Failed to save exam')
            console.error('Error saving exam:', error)
        }
    }

    return (
        <Box sx={{ mx: 'auto', p: 2 }}>
            <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ mt: 2 }}
            >
                Back
            </Button>
            <Typography variant="h5" gutterBottom>
                {examId ? 'Edit Exam' : 'Create Exam'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Exam Title"
                    name="title"
                    value={formValues.title}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Description"
                    name="description"
                    value={formValues.description}
                    onChange={handleChange}
                    fullWidth
                    sx={{ mb: 2 }}
                />

                {/* Wrap Start Date and End Date in a Box for flex layout */}
                <Box
                    display="flex"
                    justifyContent="space-between"
                    sx={{ mb: 2 }}
                >
                    <Box sx={{ flex: 1, mr: 1 }}>
                        <TextField
                            label="Start Date"
                            name="startDate"
                            type="date"
                            value={formValues.startDate}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ flex: 1, mx: 1 }}>
                        <TextField
                            label="End Date"
                            name="endDate"
                            type="date"
                            value={formValues.endDate}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Box>
                    <Box sx={{ flex: 1, ml: 1 }}>
                        <FormControl
                            fullWidth
                            variant="standard"
                            margin="dense"
                        >
                            <InputLabel id="access-type-label">
                                Access Type
                            </InputLabel>
                            <Select
                                labelId="access-type-label"
                                name="accessType"
                                value={formValues.accessType}
                                onChange={handleChange}
                            >
                                <MenuItem value="PUBLIC">Public</MenuItem>
                                <MenuItem value="PRIVATE">Private</MenuItem>
                                <MenuItem value="PROTECTED">Protected</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Box>

                <Typography variant="h6" sx={{ mt: 2 }}>
                    Questions
                </Typography>
                <Box sx={{ mb: 2 }}>
                    {formValues.questions.map((_, index) => (
                        <Button
                            key={index}
                            variant="outlined"
                            onClick={() => handleToggleQuestion(index)}
                            sx={{
                                mr: 1,
                                backgroundColor:
                                    expandedQuestionIndex === index
                                        ? '#1976d2'
                                        : 'transparent',
                                color:
                                    expandedQuestionIndex === index
                                        ? 'white'
                                        : 'inherit',
                                '&:hover': {
                                    backgroundColor:
                                        expandedQuestionIndex === index
                                            ? '#1565c0'
                                            : undefined,
                                },
                            }}
                        >
                            Question {index + 1}
                        </Button>
                    ))}
                    <Button variant="outlined" onClick={handleAddQuestion}>
                        Add Question
                    </Button>
                </Box>
                {formValues.questions.map((question, index) => (
                    <Box
                        key={index}
                        sx={{
                            mb: 2,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                            p: 2,
                        }}
                    >
                        <Collapse in={expandedQuestionIndex === index}>
                            <Box display="flex" alignItems="center">
                                <Typography variant="subtitle1">
                                    Question {index + 1}
                                </Typography>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleRemoveQuestion(index)}
                                    sx={{ ml: 'auto' }}
                                >
                                    Remove Question
                                </Button>
                            </Box>
                            {/* Pass the entire question object to QuestionForm */}
                            <QuestionForm
                                question={question}
                                onChange={(updatedQuestion) =>
                                    handleQuestionChange(index, updatedQuestion)
                                }
                            />
                        </Collapse>
                    </Box>
                ))}

                <Button type="submit" variant="contained" color="primary">
                    {examId ? 'Update Exam' : 'Create Exam'}
                </Button>
            </form>

            <Toaster />
        </Box>
    )
}

export default ExamiEdit
