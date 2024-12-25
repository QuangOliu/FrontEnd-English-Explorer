import { Block, Save } from '@mui/icons-material'
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material'
import examApi from 'api/examApi'
import { Form, Formik } from 'formik'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'
import ListQuestionExam from './ListQuestionExam'

const ExamiEdit = () => {
    // const [formValues, setFormValues] = useState({
    //     title: '',
    //     description: '',
    //     startDate: '',
    //     endDate: '',
    //     accessType: 'PRIVATE', // Default value
    //     questions: [], // Each question will have the updated structure
    // })
    const [selectedExam, setSelectedExam] = useState({
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
                    setSelectedExam(result)
                    // setFormValues({
                    //     title: result.title || '',
                    //     description: result.description || '',
                    //     startDate: result.startDate || '',
                    //     endDate: result.endDate || '',
                    //     accessType: result.accessType || 'PRIVATE',
                    //     questions:
                    //         result.questions.map((q) => ({
                    //             id: q.id || '', // Ensure id is populated if available
                    //             question: q.question || '',
                    //             explanation: q.explanation || '',
                    //             skill: q.skill || '',
                    //             level: q.level || '',
                    //             image: q.image || '',
                    //             audio: q.audio || '',
                    //             choises: q.choises || [],
                    //         })) || [],
                    // })
                })
                .catch((err) => {
                    console.error('Failed to fetch exam data:', err)
                    toast.error('Error loading exam details')
                })
        }
    }, [examId])
    const navigate = useNavigate() // Initialize the useNavigate hook

    const handleAddQuestion = () => {
        // setFormValues((prev) => ({
        //     ...prev,
        //     questions: [
        //         ...prev.questions,
        //         {
        //             // Add a new question with the updated structure
        //             id: '',
        //             question: '',
        //             explanation: '',
        //             skill: '',
        //             level: '',
        //             image: '',
        //             audio: '',
        //             choises: [],
        //         },
        //     ],
        // }))
    }

    const handleRemoveQuestion = (index) => {
        // setFormValues((prev) => {
        //     const updatedQuestions = [...prev.questions]
        //     updatedQuestions.splice(index, 1)
        //     return { ...prev, questions: updatedQuestions }
        // })
        if (expandedQuestionIndex === index) {
            setExpandedQuestionIndex(null)
        }
    }

    const handleQuestionChange = (index, updatedQuestion) => {
        // const updatedQuestions = [...formValues.questions]
        // updatedQuestions[index] = updatedQuestion // Update with the entire question object
        // // console.log({updatedQuestions});
        // setFormValues((prev) => ({ ...prev, questions: updatedQuestions }))
    }

    const handleToggleQuestion = (index) => {
        setExpandedQuestionIndex((prevIndex) =>
            prevIndex === index ? null : index
        )
    }

    const handleSubmit = async (values) => {
        try {
            examApi
                .save(values)
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
        <Box sx={{ mx: 'auto' }}>
            <Formik
                initialValues={selectedExam}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue, handleChange }) => (
                    <Form>
                        <section className="cards-container">
                            <Typography variant="h2" gutterBottom>
                                {examId ? 'Edit Exam' : 'Create Exam'}
                            </Typography>
                            <div className="cards-body">
                                <Grid container spacing={2}>
                                    <Grid item md={12} xl={12}>
                                        <TextField
                                            label={'Title'}
                                            name={'title'}
                                            value={values.title}  // Bind value to Formik's state
                                            onChange={handleChange} 
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={12}>
                                        <TextField
                                            label={'Description'}
                                            name={'description'}
                                            value={values.description}  // Bind value to Formik's state
                                            onChange={handleChange} 
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            label="Start Date"
                                            name="startDate"
                                            type="date"
                                            value={values.startDate}  // Bind value to Formik's state
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={4}>
                                        <TextField
                                            label="End Date"
                                            name="endDate"
                                            type="date"
                                            value={values.endDate} 
                                            onChange={handleChange}
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid item md={4}>
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
                                                
                                            value={values.accessType} 
                                                onChange={handleChange}
                                            >
                                                <MenuItem value="PUBLIC">
                                                    Public
                                                </MenuItem>
                                                <MenuItem value="PRIVATE">
                                                    Private
                                                </MenuItem>
                                                <MenuItem value="PROTECTED">
                                                    Protected
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    {/* QUESTION LIST */}
                                    <Grid item xl={12}>
                                        <Typography variant="h3" gutterBottom>
                                            Questions
                                        </Typography>
                                    </Grid>

                                    <Grid item xl={12}>
                                        <ListQuestionExam />
                                    </Grid>
                                    {/* BUTTON */}
                                    <Grid
                                        item
                                        md={12}
                                        className="flex"
                                        style={{ justifyContent: 'center' }}
                                    >
                                        <Button
                                            className="btn btn-primary d-inline-flex mr-6"
                                            startIcon={<Save />}
                                            variant="outlined"
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                        <Button
                                            className="btn btn-secondary d-inline-flex mr-6"
                                            variant="outlined"
                                            startIcon={<Block />}
                                            onClick={() => navigate(-1)}
                                        >
                                            Back
                                        </Button>
                                    </Grid>
                                </Grid>
                            </div>
                        </section>
                    </Form>
                )}
            </Formik>
        </Box>
    )
}

export default ExamiEdit

//     <Box sx={{ flex: 1, ml: 1 }}>
//         <FormControl
//             fullWidth
//             variant="standard"
//             margin="dense"
//         >
//             <InputLabel id="access-type-label">
//                 Access Type
//             </InputLabel>
//             <Select
//                 labelId="access-type-label"
//                 name="accessType"
//                 value={formValues.accessType}
//                 onChange={handleChange}
//             >
//                 <MenuItem value="PUBLIC">Public</MenuItem>
//                 <MenuItem value="PRIVATE">Private</MenuItem>
//                 <MenuItem value="PROTECTED">Protected</MenuItem>
//             </Select>
//         </FormControl>
//     </Box>
// </Box>

// <Typography variant="h6" sx={{ mt: 2 }}>
//     Questions
// </Typography>
// <Box sx={{ mb: 2 }}>
//     {formValues.questions.map((_, index) => (
//         <Button
//             key={index}
//             variant="outlined"
//             onClick={() => handleToggleQuestion(index)}
//             sx={{
//                 mr: 1,
//                 backgroundColor:
//                     expandedQuestionIndex === index
//                         ? '#1976d2'
//                         : 'transparent',
//                 color:
//                     expandedQuestionIndex === index
//                         ? 'white'
//                         : 'inherit',
//                 '&:hover': {
//                     backgroundColor:
//                         expandedQuestionIndex === index
//                             ? '#1565c0'
//                             : undefined,
//                 },
//             }}
//         >
//             Question {index + 1}
//         </Button>
//     ))}
//     <Button variant="outlined" onClick={handleAddQuestion}>
//         Add Question
//     </Button>
// </Box>
// {expandedQuestionIndex !== null && (
//     <Box
//         sx={{
//             mb: 2
//         }}
//     >
//         <Typography variant="subtitle1">
//             Question {expandedQuestionIndex + 1}
//         </Typography>
//         <Button
//             variant="outlined"
//             color="secondary"
//             onClick={() =>
//                 handleRemoveQuestion(expandedQuestionIndex)
//             }
//             sx={{ ml: 'auto', mb: 2 }}
//         >
//             Remove Question
//         </Button>
//         <QuestionForm
//             question={
//                 formValues.questions[expandedQuestionIndex]
//             }
//             onChange={(updatedQuestion) =>
//                 handleQuestionChange(
//                     expandedQuestionIndex,
//                     updatedQuestion
//                 )
//             }
//         />
//     </Box>
// )}

// <Button type="submit" variant="contained" color="primary">
//     {examId ? 'Update Exam' : 'Create Exam'}
// </Button>
// </form>
