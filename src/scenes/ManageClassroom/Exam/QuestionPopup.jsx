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

const skillTypes = ['READING', 'LISTENING']
const levelTypes = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED']

export default function QuestionPopup({ open, formData, handleClose, handleSubmit }) {
    const handleChoiceChange = (values, setFieldValue, index, event) => {
        const { name, value, checked } = event.target
        const updatedChoices = [...values.choises]

        if (name === 'answer') {
            updatedChoices[index].answer = value
        } else if (name === 'correct') {
            updatedChoices[index].correct = checked
        }

        setFieldValue('choises', updatedChoices)
    }

    const handleAddChoice = (values, setFieldValue) => {
        if (!values.choises) {
            setFieldValue('choises', [])
        }

        if (values?.choises?.length < 4) {
            setFieldValue('choises', [
                ...values.choises,
                { answer: '', correct: false },
            ])
        } else {
            toast.error('You can only add up to 4 choices.')
        }
    }

    const handleRemoveChoice = (values, setFieldValue, index) => {
        const updatedChoices = values?.choises?.filter((_, i) => i !== index)
        setFieldValue('choises', updatedChoices)
    }

    const handleFileUpload = async (file, fieldName, setFieldValue) => {
        if (!file) return

        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fileApi.uploadFile(formData)
            const fileUrl = `${process.env.REACT_APP_BASE_URL}files/${response.message}`

            setFieldValue(fieldName, response.message)
            toast.success(`${fieldName} uploaded successfully!`)
        } catch (error) {
            console.error(`Error uploading ${fieldName}:`, error)
            toast.error(`Failed to upload ${fieldName}. Please try again.`)
        }
    }

    const handleRemoveFile = async (fileUrl, fileType, setFieldValue) => {
        try {
            const fileName = fileUrl.split('/').pop()
            await fileApi.deleteFile(fileName)

            setFieldValue(fileType, '')
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
            title="Cập nhật trường thông tin"
            formik={{
                enableReinitialize: true,
                initialValues: formData,
                onSubmit: (values) => handleSubmit(values),
            }}
            action={({ submitForm }) => (
                <>
                    <Button
                        startIcon={<Block />}
                        className="btn btn-secondary"
                        onClick={handleClose}
                    >
                        Huỷ
                    </Button>
                    <Button
                        startIcon={<Save />}
                        className="btn btn-primary"
                        onClick={submitForm}
                    >
                        Lưu
                    </Button>
                </>
            )}
        >
            {({ values, setFieldValue }) => (
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 4 }}>
                            <Typography variant="h6">Upload Files</Typography>
                            <Box>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileUpload(e.target.files[0], 'image', setFieldValue)
                                    }
                                />
                                {values.skill === 'LISTENING' && (
                                    <input
                                        type="file"
                                        accept="audio/*"
                                        onChange={(e) =>
                                            handleFileUpload(e.target.files[0], 'audio', setFieldValue)
                                        }
                                    />
                                )}
                            </Box>
                            {values.image && (
                                <Box>
                                    <img
                                        src={`${process.env.REACT_APP_BASE_URL}files/${values.image}`}
                                        alt="Uploaded"
                                        style={{ maxWidth: '100%' }}
                                    />
                                    <Button
                                        onClick={() =>
                                            handleRemoveFile(values.image, 'image', setFieldValue)
                                        }
                                    >
                                        Remove Image
                                    </Button>
                                </Box>
                            )}
                            {values.audio && (
                                <Box>
                                    <audio controls>
                                        <source
                                            src={`${process.env.REACT_APP_BASE_URL}files/${values.audio}`}
                                            type="audio/mpeg"
                                        />
                                    </audio>
                                    <Button
                                        onClick={() =>
                                            handleRemoveFile(values.audio, 'audio', setFieldValue)
                                        }
                                    >
                                        Remove Audio
                                    </Button>
                                </Box>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel id="skill-label">Skill</InputLabel>
                            <Select
                                labelId="skill-label"
                                name="skill"
                                value={values.skill}
                                onChange={(e) => setFieldValue('skill', e.target.value)}
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
                            onChange={(e) => setFieldValue('question', e.target.value)}
                            required
                            fullWidth
                        />

                        <Box sx={{ mt: 2 }}>
                            {values.choises?.map((choice, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={7}>
                                            <TextField
                                                label="Answer"
                                                name="answer"
                                                value={choice.answer}
                                                onChange={(e) =>
                                                    handleChoiceChange(values, setFieldValue, index, e)
                                                }
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={choice.correct}
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
                                                    handleRemoveChoice(values, setFieldValue, index)
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
                            onClick={() => handleAddChoice(values, setFieldValue)}
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
                                onChange={(e) => setFieldValue('level', e.target.value)}
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
                            onChange={(e) => setFieldValue('explanation', e.target.value)}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            )}
        </PopupForm>
    )
}
