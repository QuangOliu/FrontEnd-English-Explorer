import { Block, Save } from '@mui/icons-material';
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
} from '@mui/material';
import examApi from 'api/examApi';
import { Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import ListQuestionExam from './ListQuestionExam';

const ExamiEdit = () => {
    const [selectedExam, setSelectedExam] = useState({
        title: '',
        description: '',
        startDate: '',
        endDate: '',
        accessType: 'PRIVATE', // Default value
        questions: [], // Each question will have the updated structure
    });

    const { examId } = useParams();
    const [expandedQuestionIndex, setExpandedQuestionIndex] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        if (examId) {
            examApi
                .getById(examId)
                .then((result) => {
                    setSelectedExam(result);
                })
                .catch((err) => {
                    console.error('Failed to fetch exam data:', err);
                    toast.error('Error loading exam details');
                });
        }
    }, [examId]);

    const handleSubmit = async (values) => {
        try {
            await examApi.save(values);
            toast.success('Exam saved successfully');
            setTimeout(() => {
                navigate(-1);
            }, 500);
        } catch (error) {
            toast.error('Failed to save exam');
            console.error('Error saving exam:', error);
        }
    };

    return (
        <Box sx={{ mx: 'auto' }}>
            <Formik
                initialValues={selectedExam}
                enableReinitialize
                onSubmit={handleSubmit}
            >
                {({ values, handleChange }) => (
                    <Form>
                        <Typography variant="h4" gutterBottom>
                            {examId ? 'Edit Exam' : 'Create Exam'}
                        </Typography>

                        {/* General Information */}
                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom>
                                General Information
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Title"
                                        name="title"
                                        value={values.title}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        label="Description"
                                        name="description"
                                        value={values.description}
                                        onChange={handleChange}
                                        fullWidth
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="Start Date"
                                        name="startDate"
                                        type="date"
                                        value={values.startDate}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField
                                        label="End Date"
                                        name="endDate"
                                        type="date"
                                        value={values.endDate}
                                        onChange={handleChange}
                                        fullWidth
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel id="access-type-label">
                                            Access Type
                                        </InputLabel>
                                        <Select
                                            labelId="access-type-label"
                                            name="accessType"
                                            value={values.accessType}
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="PUBLIC">Public</MenuItem>
                                            <MenuItem value="PRIVATE">Private</MenuItem>
                                            <MenuItem value="PROTECTED">Protected</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>

                        {/* Questions Section */}
                        <Box mb={4}>
                            <Typography variant="h6" gutterBottom>
                                Questions
                            </Typography>
                            <ListQuestionExam />
                        </Box>

                        {/* Action Buttons */}
                        <Box textAlign="center">
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<Save />}
                                type="submit"
                                sx={{ mr: 2 }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                startIcon={<Block />}
                                onClick={() => navigate(-1)}
                            >
                                Back
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default ExamiEdit;
