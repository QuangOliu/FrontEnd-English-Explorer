import { Block, Save } from '@mui/icons-material'
import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from '@mui/material'
import fileApi from 'api/fileApi'
import PopupForm from 'common/PopupForm'
import toast from 'react-hot-toast'

const skillTypes = ['READING', 'WRITING', 'LISTENING', 'SPEAKING']
const levelTypes = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function QuestionPopup({
    open,
    formData,
    handleClose,
    handleSubmit,
}) {
    const handleChoiceChange = (values, setFieldValue, index, e) => {
        const { name, value, checked } = e.target
        const updatedChoices = [...values.choises]
        console.log(e.target)
        if (name === 'answer') {
            // Update the 'answer' field of the choice
            updatedChoices[index].answer = value
        } else if (name === 'correct') {
            // Update the 'correct' field of the choice (checkbox)
            updatedChoices[index].correct = checked
        }

        // Update the Formik state for 'choises'
        setFieldValue('choises', updatedChoices)
    }

    const handleAddChoice = (values, setFieldValue) => {
        console.log(values)
        if (values.choises === null) {
            setFieldValue('choises', [])
        }
        if (values?.choises.length < 4) {
            // Add a new choice (empty answer and incorrect by default)
            setFieldValue('choises', [
                ...values.choises,
                { answer: '', correct: false },
            ])
        } else {
            toast.error('You can only add up to 4 choices.')
        }

        console.log(values)
    }
    const handleRemoveChoice = (values, setFieldValue, index) => {
        const currentChoices = values?.choises

        // Remove the choice at the specified index
        const newListChoice = currentChoices.filter((_, i) => i !== index)

        // Update the form state with the new list of choices
        setFieldValue('choises', newListChoice)
    }

    const handleFileUpload = async (file, fieldName, setFieldValue) => {
        if (!file) return // Không làm gì nếu không có file

        const formData = new FormData()
        formData.append('file', file)

        try {
            // Gọi API để upload file
            const response = await fileApi.uploadFile(formData)

            // Lấy URL file từ response
            const fileUrl = `${process.env.REACT_APP_BASE_URL}files/${response.message}`

            // Cập nhật giá trị của formData
            setFieldValue(fieldName, response.message)

            // Nếu cần, cập nhật URL cụ thể để hiển thị trực tiếp
            if (fieldName === 'image') {
                setFieldValue('image', response.message)
            } else if (fieldName === 'audio') {
                setFieldValue('audio', response.message)
            }

            toast.success(`${fieldName} uploaded successfully!`)
        } catch (error) {
            console.error('Error uploading file:', error)
            toast.error('Failed to upload file. Please try again.')
        }
    }

    const validate = () => {
        const newErrors = {}
    }

    const handleRemoveFile = async (fileUrl, fileType, setFieldValue) => {
        try {
            const fileName = fileUrl.split('/').pop() // Lấy tên file từ URL
            await fileApi.deleteFile(fileName) // Gọi API xóa file

            if (fileType === 'image') {
                setFieldValue('image', '')
            } else if (fileType === 'audio') {
                setFieldValue('audio', '')
            }

            toast.success(`${fileType} removed successfully.`)
        } catch (error) {
            console.error(`Error removing ${fileType}:`, error)
            toast.error(`Failed to remove ${fileType}. Please try again.`)
        }
    }

    return (
        <PopupForm
            size="lg"
            open={open}
            handleClose={handleClose}
            title={'Cập nhật trường thông tin'}
            formik={{
                enableReinitialize: true,
                // validationSchema: validationSchema,
                initialValues: formData,
                onSubmit: (values) => handleSubmit(values),
            }}
            action={({ isSubmitting, submitForm }) => (
                <>
                    <Button
                        startIcon={<Block />}
                        className="btn btn-secondary d-inline-flex"
                        onClick={() => handleClose()}
                    >
                        Huỷ
                    </Button>
                    <Button
                        startIcon={<Save />}
                        className="btn btn-primary d-inline-flex"
                        type="submit"
                    >
                        Lưu
                    </Button>
                </>
            )}
        >
            {({ values, setFieldValue }) => {
                return (
                    <Grid container spacing={2}>
                        {/* File upload section */}
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
                                <Box>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) =>
                                            handleFileUpload(
                                                e.target.files[0],
                                                'image',
                                                setFieldValue
                                            )
                                        }
                                    />
                                    {values.skill === 'LISTENING' && (
                                        <input
                                            type="file"
                                            accept="audio/*"
                                            onChange={(e) =>
                                                handleFileUpload(
                                                    e.target.files[0],
                                                    'audio',
                                                    setFieldValue
                                                )
                                            }
                                        />
                                    )}
                                </Box>
                                {values.image && (
                                    <>
                                        <img
                                            src={`http://localhost:8080/api/v1/files/${values.image}`}
                                            alt="Uploaded"
                                            style={{ maxWidth: '100%' }}
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveFile(
                                                    values.image,
                                                    'image',
                                                    setFieldValue
                                                )
                                            }
                                        >
                                            Remove Image
                                        </button>
                                    </>
                                )}
                                {values.audio && (
                                    <>
                                        <audio controls>
                                            <source
                                                src={`http://localhost:8080/api/v1/files/${values.audio}`}
                                                type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                        </audio>
                                        <button
                                            onClick={() =>
                                                handleRemoveFile(
                                                    values.audio,
                                                    'audio',
                                                    setFieldValue
                                                )
                                            }
                                        >
                                            Remove Audio
                                        </button>
                                    </>
                                )}
                            </Box>
                        </Grid>

                        {/* Form section */}
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="skill-label">Skill</InputLabel>
                                <Select
                                    labelId="skill-label"
                                    name="skill"
                                    value={values.skill}
                                    onChange={(e) =>
                                        setFieldValue('skill', e.target.value)
                                    }
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
                                value={values.question}
                                onChange={(e) =>
                                    setFieldValue('question', e.target.value)
                                }
                                fullWidth
                            />

                            {/* choises section */}
                            <Box sx={{ mt: 2 }}>
                                {values?.choises?.map((choice, index) => (
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
                                                        handleChoiceChange(
                                                            values,
                                                            setFieldValue,
                                                            index,
                                                            e
                                                        )
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
                                                            checked={
                                                                choice.correct
                                                            }
                                                            onChange={(e) =>
                                                                handleChoiceChange(
                                                                    values,
                                                                    setFieldValue,
                                                                    index,
                                                                    e
                                                                )
                                                            }
                                                            name="correct"
                                                        />
                                                    }
                                                    label="Correct"
                                                />
                                            </Grid>

                                            <Grid item xs={2}>
                                                <Button
                                                    variant="outlined"
                                                    color="error"
                                                    onClick={() =>
                                                        handleRemoveChoice(
                                                            values,
                                                            setFieldValue,
                                                            index
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ))}
                            </Box>

                            <Button
                                variant="outlined"
                                onClick={() =>
                                    handleAddChoice(values, setFieldValue)
                                }
                                sx={{ mt: 2 }}
                            >
                                Add Choice
                            </Button>

                            <FormControl fullWidth sx={{ mt: 2 }}>
                                <InputLabel id="level-label">Level</InputLabel>
                                <Select
                                    labelId="level-label"
                                    name="level"
                                    value={values.level}
                                    onChange={(e) =>
                                        setFieldValue('level', e.target.value)
                                    }
                                >
                                    {levelTypes.map((level) => (
                                        <MenuItem key={level} value={level}>
                                            {level}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <TextField
                                sx={{ mt: 2 }}
                                label="Explanation"
                                name="explanation"
                                value={values.explanation}
                                onChange={(e) =>
                                    setFieldValue('explanation', e.target.value)
                                }
                                multiline
                                rows={4}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                )
            }}
        </PopupForm>
    )
}
