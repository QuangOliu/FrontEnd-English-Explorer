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
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios'
import { useTheme } from '@emotion/react'
import questionApi from 'api/questionApi'
import fileApi from 'api/fileApi'
import { useParams } from 'react-router-dom'

// Danh sách các giá trị SkillType và LevelType
const skillTypes = ['READING', 'WRITING', 'LISTENING', 'SPEAKING']
const levelTypes = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

const QuestionForm = ({question, onChange}) => {
    const [imageUrl, setImageUrl] = useState('')
    const [audioUrl, setAudioUrl] = useState('')
    const [pageType, setPageType] = useState('add')
    const [formValues, setFormValues] = useState({
        id: '',
        question: '',
        explanation: '',
        skill: '',
        level: '',
        image: '',
        audio: '',
        choises: [],
    })
    const [errors, setErrors] = useState({})
    const { palette } = useTheme()

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => ({ ...prev, [name]: value }))
    }

    const handleChoiceChange = (index, e) => {
        const { name, value, type, checked } = e.target
        const newChoises = [...formValues.choises]

        if (type === 'checkbox') {
            if (checked) {
                newChoises.forEach((choice, i) => {
                    choice.correct = i === index // Chỉ giữ lại lựa chọn được chọn là đúng
                })
            }
            newChoises[index][name] = checked
        } else {
            newChoises[index][name] = value
        }

        setFormValues((prev) => ({ ...prev, choises: newChoises }))
    }

    const handleAddChoice = () => {
        if (formValues.choises.length < 4) {
            setFormValues((prev) => ({
                ...prev,
                choises: [...prev.choises, { answer: '', correct: false }],
            }))
        } else {
            toast.error('You can only add up to 4 choices.');
        }
    }

    const handleRemoveChoice = (index) => {
        debugger
        const newChoises = formValues.choises.filter((_, i) => i !== index)
        setFormValues((prev) => ({ ...prev, choises: newChoises }))
    }

    const handleFileUpload = async (file, fieldName) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            // Wait for the upload to complete
            const response = await fileApi.uploadFile(formData)
            console.log(response)
            // Access the message property from the response
            const fileUrl = `${process.env.REACT_APP_BASE_URL}files/${response.message}`

            console.log(fileUrl)
            // Update form values
            setFormValues((prev) => ({
                ...prev,
                [fieldName]: response.message,
            }))

            // Update specific URLs based on field name
            if (fieldName === 'image') {
                setImageUrl(fileUrl)
            } else if (fieldName === 'audio') {
                setAudioUrl(fileUrl)
            }
        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    const validate = () => {
        const newErrors = {}
        if (!formValues.question) newErrors.question = 'Question is required'
        if (!formValues.skill) newErrors.skill = 'Skill is required'
        if (!formValues.level) newErrors.level = 'Level is required'

        if (formValues.skill === 'LISTENING') {
            if (!formValues.image)
                newErrors.image = 'Image is required for Listening'
            if (!formValues.audio)
                newErrors.audio = 'Audio is required for Listening'
        }

        if (formValues.choises.length === 0) {
            newErrors.choises = 'At least one choice is required'
        } else {
            let hasTrueAnswer = false;
            formValues.choises.forEach((choice, index) => {
                if (!choice.answer) {
                    newErrors[`choice${index}`] = 'Answer is required'
                }
                if(choice.correct === true) {
                    hasTrueAnswer = true;
                }
            })
            if (!hasTrueAnswer) {
                newErrors['choice1'] = 'The question has a true answer.'
                toast.error("The question has a true answer.");
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0 // Trả về true nếu không có lỗi
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            questionApi.create(formValues).then((result) => {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    id: questionId,
                }))
                
                toast.success('Successfully Create Question!')
            })
        }
    }

    const handleRemoveFile = async (fileUrl, fileType) => {
        const fileName = fileUrl.split('/').pop() // Lấy tên file từ URL
        try {
            const response = await fileApi.deleteFile(fileName) // Gọi API xóa file
            
            toast.success(`${fileType} đã được gỡ bỏ.`)
            setFormValues((prev) => ({ ...prev, [fileType]: '' })) // Reset giá trị của file
        } catch (error) {
            toast.success('Lỗi khi gỡ file')
        }
    }

    const { questionId } = useParams()

    useEffect(() => {
        if (questionId) {
            setPageType('edit')
            questionApi
                .getById(questionId)
                .then((result) => {
                    setFormValues((prevValues) => ({
                        ...prevValues,
                        id: questionId,
                        question: result.question,
                        explanation: result.explanation,
                        skill: result.skill,
                        level: result.level,
                        image: result.image,
                        audio: result.audio,
                        choises: result.choises.map((choise, index) => ({
                            answer: choise.answer,
                            correct: choise.correct,
                        })),
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
                {/* Phần upload tệp */}
                <Grid item xs={6}>
                    <Box
                        sx={{
                            p: 2,
                            border: '1px solid #ccc',
                            borderRadius: '4px',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Upload Files
                        </Typography>
                        {formValues.skill === 'LISTENING' && (
                            <Box>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileUpload(
                                            e.target.files[0],
                                            'image'
                                        )
                                    }
                                />
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        handleFileUpload(
                                            e.target.files[0],
                                            'audio'
                                        )
                                    }
                                />
                            </Box>
                        )}

                        {formValues.image ? (
                            <>
                                <img
                                    src={`http://localhost:8080/api/v1/files/${formValues.image}`}
                                    alt="Uploaded"
                                    style={{ maxWidth: '100%' }}
                                />
                                <button
                                    onClick={() =>
                                        handleRemoveFile(
                                            formValues.image,
                                            'image'
                                        )
                                    }
                                >
                                    Gỡ ảnh
                                </button>
                            </>
                        ) : null}
                        {formValues.audio ? (
                            <>
                                <audio controls>
                                    <source
                                        src={`http://localhost:8080/api/v1/files/${formValues.audio}`}
                                        type="audio/mpeg"
                                    />
                                    Your browser does not support the audio
                                    element.
                                </audio>
                                <button
                                    onClick={() =>
                                        handleRemoveFile(
                                            formValues.audio,
                                            'audio'
                                        )
                                    }
                                >
                                    Gỡ audio
                                </button>
                            </>
                        ) : null}
                    </Box>
                </Grid>

                {/* Phần form */}
                <Grid item xs={6}>
                    <form onSubmit={handleSubmit}>
                        <FormControl fullWidth>
                            <InputLabel id="skill-label">Skill</InputLabel>
                            <Select
                                labelId="skill-label"
                                name="skill"
                                value={formValues.skill}
                                onChange={handleChange}
                            >
                                {skillTypes.map((skill) => (
                                    <MenuItem key={skill} value={skill}>
                                        {skill}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            sx={{ mt: 2 }}
                            label="Question"
                            name="question"
                            value={formValues.question}
                            onChange={handleChange}
                            error={!!errors.question}
                            helperText={errors.question}
                            fullWidth
                        />

                        {/* Choices section */}
                        <Box sx={{ mt: 2 }}>
                            {formValues.choises.map((choice, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Grid
                                        container
                                        spacing={2}
                                        alignItems="center"
                                    >
                                        <Grid item xs={7}>
                                            <TextField
                                                label="Answer"
                                                name="answer"
                                                value={choice.answer}
                                                onChange={(e) =>
                                                    handleChoiceChange(index, e)
                                                }
                                                fullWidth
                                            />
                                        </Grid>

                                        <Grid
                                            item
                                            xs={3}
                                            container
                                            alignItems="center"
                                        >
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={choice.correct}
                                                        onChange={(e) =>
                                                            handleChoiceChange(
                                                                index,
                                                                e
                                                            )
                                                        }
                                                        name="correct"
                                                    />
                                                }
                                                label="Correct"
                                            />
                                            <Button
                                                onClick={() =>
                                                    handleRemoveChoice(index)
                                                }
                                            >
                                                Remove
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Box>
                            ))}
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={7}></Grid>
                                <Grid item xs={3} container alignItems="center">
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAddChoice}
                                    >
                                        Add Choice
                                    </Button>
                                </Grid>
                            </Grid>
                        </Box>

                        <TextField
                            sx={{ mt: 2 }}
                            label="Explanation"
                            name="explanation"
                            value={formValues.explanation}
                            onChange={handleChange}
                            fullWidth
                        />

                        <FormControl sx={{ mt: 2 }} fullWidth>
                            <InputLabel id="level-label">Level</InputLabel>
                            <Select
                                labelId="level-label"
                                name="level"
                                value={formValues.level}
                                onChange={handleChange}
                            >
                                {levelTypes.map((level) => (
                                    <MenuItem key={level} value={level}>
                                        {level}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

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

export default QuestionForm
