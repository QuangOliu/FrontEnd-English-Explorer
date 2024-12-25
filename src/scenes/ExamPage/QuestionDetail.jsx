import { Box, Grid, Typography, Radio, FormControlLabel, FormControl, RadioGroup } from '@mui/material';

const QuestionDetail = ({ questionProp, handleSelect, handleMark }) => {
    // Handle loading or undefined props gracefully
    if (!questionProp) return <Typography>Loading...</Typography>;

    return (
        <Grid>
            {/* Media Section (Image or Audio) */}
            {(questionProp.image || questionProp.audio) && (
                <Grid item xs={6}>
                    {questionProp.image && (
                        <img
                            src={`http://localhost:8080/api/v1/files/${questionProp.image}`}
                            alt="Question"
                            style={{ width: '100%', marginBottom: '10px' }}
                        />
                    )}
                    {questionProp.audio && (
                        <audio controls>
                            <source
                                src={`http://localhost:8080/api/v1/files/${questionProp.audio}`}
                                type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </Grid>
            )}

            {/* Question Content */}
            <Grid item xs={questionProp.image || questionProp.audio ? 6 : 12} color={"black"}>
                <Box padding="0 20px">
                    <Typography variant="h5" gutterBottom fontWeight={"bold"}>
                        {questionProp.question}
                    </Typography>

                    {/* RadioGroup for choices */}
                    <FormControl component="fieldset">
                        <Grid container direction="column" spacing={1}>
                            {questionProp.choises.map((choice, index) => (
                                <Grid item key={index}>

                                    {/* Radio button option */}
                                    <FormControlLabel
                                        control={
                                            <Radio
                                                checked={questionProp?.answer?.id === choice.id}
                                                onChange={() => handleSelect(questionProp, choice)}
                                            />
                                        }
                                        label={choice.answer}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </FormControl>
                </Box>
            </Grid>
        </Grid>
    );
};

export default QuestionDetail;
