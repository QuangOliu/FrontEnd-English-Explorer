import { Block, Save } from '@mui/icons-material'
import { Box, Button, Checkbox, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material'
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

    const handleChoiceChange = (index, e) => {
    }

    const handleAddChoice = () => {
    }

    const handleRemoveChoice = (index) => {
    }

    const handleFileUpload = async (file, fieldName) => {
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fileApi.uploadFile(formData)
            const fileUrl = `${process.env.REACT_APP_BASE_URL}files/${response.message}`

        } catch (error) {
            console.error('Error uploading file:', error)
        }
    }

    const validate = () => {
        const newErrors = {}
    }

    const handleRemoveFile = async (fileUrl, fileType) => {
        const fileName = fileUrl.split('/').pop()
        try {
            await fileApi.deleteFile(fileName)
            toast.success(`${fileType} removed successfully.`)
        } catch (error) {
            toast.error('Error removing file')
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
                        disabled={isSubmitting}
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
                                                'image'
                                            )
                                        }
                                    />
                                    {formData.skill === 'LISTENING' && (
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
                                    )}
                                </Box>
                                {formData.image && (
                                    <>
                                        <img
                                            src={`http://localhost:8080/api/v1/files/${formData.image}`}
                                            alt="Uploaded"
                                            style={{ maxWidth: '100%' }}
                                        />
                                        <button
                                            onClick={() =>
                                                handleRemoveFile(
                                                    formData.image,
                                                    'image'
                                                )
                                            }
                                        >
                                            Remove Image
                                        </button>
                                    </>
                                )}
                                {formData.audio && (
                                    <>
                                        <audio controls>
                                            <source
                                                src={`http://localhost:8080/api/v1/files/${formData.audio}`}
                                                type="audio/mpeg"
                                            />
                                            Your browser does not support the
                                            audio element.
                                        </audio>
                                        <button
                                            onClick={() =>
                                                handleRemoveFile(
                                                    formData.audio,
                                                    'audio'
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
                            <form onSubmit={handleSubmit}>
                                <FormControl fullWidth>
                                    <InputLabel id="skill-label">
                                        Skill
                                    </InputLabel>
                                    <Select
                                        labelId="skill-label"
                                        name="skill"
                                        value={formData.skill}
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
                                    value={formData.question}
                                    fullWidth
                                />

                                {/* choises section */}
                                <Box sx={{ mt: 2 }}>
                                    {formData?.choises?.map((choice, index) => (
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
                                    onClick={handleAddChoice}
                                    sx={{ mt: 2 }}
                                >
                                    Add Choice
                                </Button>

                                <FormControl fullWidth sx={{ mt: 2 }}>
                                    <InputLabel id="level-label">
                                        Level
                                    </InputLabel>
                                    <Select
                                        labelId="level-label"
                                        name="level"
                                        value={values.level}
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
                                    multiline
                                    rows={4}
                                    fullWidth
                                />
                            </form>
                        </Grid>
                    </Grid>
                )
            }}
        </PopupForm>
    )
}
