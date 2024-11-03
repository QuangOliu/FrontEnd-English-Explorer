import React, { useEffect, useState } from 'react';
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
} from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import fileApi from 'api/fileApi';

const skillTypes = ['READING', 'WRITING', 'LISTENING', 'SPEAKING'];
const levelTypes = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

const QuestionForm = ({ question, onChange }) => {
    const [formValues, setFormValues] = useState({
        id: '',
        question: '',
        explanation: '',
        skill: '',
        level: '',
        image: '',
        audio: '',
        choises: [],
    });
    const [errors, setErrors] = useState({});

    // Effect to set initial values from the question prop
    useEffect(() => {
        if (question && JSON.stringify(question) !== JSON.stringify(formValues)) {
            setFormValues(question); // Set initial values only if different
        }
    }, [question]); // Update effect to listen to `question`

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues((prev) => {
            const updatedValues = { ...prev, [name]: value };
            onChange(updatedValues); // Call onChange with updated values
            return updatedValues;
        });
    };

    const handleChoiceChange = (index, e) => {
        const { name, value, type, checked } = e.target;
        setFormValues((prev) => {
            const newchoises = [...prev.choises];
            if (type === 'checkbox') {
                newchoises.forEach((choice, i) => {
                    choice.correct = i === index; // Keep only the selected choice as correct
                });
                newchoises[index][name] = checked;
            } else {
                newchoises[index][name] = value;
            }
            const updatedValues = { ...prev, choises: newchoises };
            onChange(updatedValues); // Call onChange with updated choises
            return updatedValues;
        });
    };

    const handleAddChoice = () => {
        if (formValues.choises.length < 4) {
            setFormValues((prev) => {
                const updatedValues = {
                    ...prev,
                    choises: [...prev.choises, { answer: '', correct: false }],
                };
                onChange(updatedValues); // Call onChange with updated choises
                return updatedValues;
            });
        } else {
            toast.error('You can only add up to 4 choises.');
        }
    };

    const handleRemoveChoice = (index) => {
        setFormValues((prev) => {
            const newchoises = prev.choises.filter((_, i) => i !== index);
            const updatedValues = { ...prev, choises: newchoises };
            onChange(updatedValues); // Call onChange with updated choises
            return updatedValues;
        });
    };

    const handleFileUpload = async (file, fieldName) => {
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fileApi.uploadFile(formData);
            const fileUrl = `${process.env.REACT_APP_BASE_URL}files/${response.message}`;
            setFormValues((prev) => {
                const updatedValues = { ...prev, [fieldName]: response.message };
                onChange(updatedValues); // Call onChange with updated file URL
                return updatedValues;
            });
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formValues.question) newErrors.question = 'Question is required';
        if (!formValues.skill) newErrors.skill = 'Skill is required';
        if (!formValues.level) newErrors.level = 'Level is required';

        if (formValues.skill === 'LISTENING') {
            if (!formValues.image) newErrors.image = 'Image is required for Listening';
            if (!formValues.audio) newErrors.audio = 'Audio is required for Listening';
        }

        if (formValues.choises.length === 0) {
            newErrors.choises = 'At least one choice is required';
        } else {
            let hasTrueAnswer = false;
            formValues.choises.forEach((choice, index) => {
                if (!choice.answer) {
                    newErrors[`choice${index}`] = 'Answer is required';
                }
                if (choice.correct) {
                    hasTrueAnswer = true;
                }
            });
            if (!hasTrueAnswer) {
                newErrors['choice1'] = 'The question must have a correct answer.';
                toast.error('The question must have a correct answer.');
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Return true if no errors
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formValues);
            // Handle submit logic, like saving to an API
        }
    };

    const handleRemoveFile = async (fileUrl, fileType) => {
        const fileName = fileUrl.split('/').pop();
        try {
            await fileApi.deleteFile(fileName);
            toast.success(`${fileType} removed successfully.`);
            setFormValues((prev) => {
                const updatedValues = { ...prev, [fileType]: '' };
                onChange(updatedValues); // Call onChange with updated file removal
                return updatedValues;
            });
        } catch (error) {
            toast.error('Error removing file');
        }
    };

    return (
        <Box sx={{ mx: 'auto', p: 2 }}>
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
                        {formValues.skill === 'LISTENING' && (
                            <Box>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        handleFileUpload(e.target.files[0], 'image')
                                    }
                                />
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) =>
                                        handleFileUpload(e.target.files[0], 'audio')
                                    }
                                />
                            </Box>
                        )}
                        {formValues.image && (
                            <>
                                <img
                                    src={`http://localhost:8080/api/v1/files/${formValues.image}`}
                                    alt="Uploaded"
                                    style={{ maxWidth: '100%' }}
                                />
                                <button
                                    onClick={() =>
                                        handleRemoveFile(formValues.image, 'image')
                                    }
                                >
                                    Remove Image
                                </button>
                            </>
                        )}
                        {formValues.audio && (
                            <>
                                <audio controls>
                                    <source
                                        src={`http://localhost:8080/api/v1/files/${formValues.audio}`}
                                        type="audio/mpeg"
                                    />
                                    Your browser does not support the audio element.
                                </audio>
                                <button
                                    onClick={() =>
                                        handleRemoveFile(formValues.audio, 'audio')
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

                        {/* choises section */}
                        <Box sx={{ mt: 2 }}>
                            {formValues.choises.map((choice, index) => (
                                <Box key={index} sx={{ mb: 2 }}>
                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={7}>
                                            <TextField
                                                label="Answer"
                                                name="answer"
                                                value={choice.answer}
                                                onChange={(e) =>
                                                    handleChoiceChange(index, e)
                                                }
                                                fullWidth
                                                error={!!errors[`choice${index}`]}
                                                helperText={errors[`choice${index}`]}
                                            />
                                        </Grid>

                                        <Grid item xs={3} container alignItems="center">
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={choice.correct}
                                                        onChange={(e) =>
                                                            handleChoiceChange(index, e)
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
                                                onClick={() => handleRemoveChoice(index)}
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

                        <TextField
                            sx={{ mt: 2 }}
                            label="Explanation"
                            name="explanation"
                            value={formValues.explanation}
                            onChange={handleChange}
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </form>
                </Grid>
            </Grid>
            <Toaster />
        </Box>
    );
};

export default QuestionForm;
