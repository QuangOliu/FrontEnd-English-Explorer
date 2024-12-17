import {
    Avatar,
    Box,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemText,
    Typography
} from '@mui/material'
import examApi from 'api/examApi'
import userExamApi from 'api/userExamApi'
import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

const ExamUser = () => {
    ;
    const [formValues, setFormValues] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        accessType: 'PRIVATE', // Default value
        questions: [], // Each question will have the updated structure
    })

    const [userExams, setUserExams] = useState([])
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
                });
            
            userExamApi.getByExam(examId).then((result) => {
                setUserExams(result)
            }).catch((err) => {
                
            });
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
            <Typography variant="h2" gutterBottom>
                {'Exam detail: ' + formValues.title +" ("+ formValues?.startDate +" to " +formValues?.endDate + ")"}
            </Typography>
            {userExams.map((value) => {
                {/* const labelId = `checkbox-list-secondary-label-${value}` */}
                return (
                    <ListItem
                        key={value}
                        disablePadding
                    >
                        <ListItemButton>
                            <ListItemAvatar>
                                <Avatar
                                    alt={`${value.user.fullname}`}
                                    src={`/static/images/avatar/${
                                        value + 1
                                    }.jpg`}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                id={value.id}
                                primary={`${value.user.fullname}`}
                            />
                            <ListItemText
                                id={value.id}
                                primary={value.score ? `${value.score}` : "non submit"}
                            />
                        </ListItemButton>
                    </ListItem>
                )
            })}

            <Toaster />
        </Box>
    )
}

export default ExamUser
