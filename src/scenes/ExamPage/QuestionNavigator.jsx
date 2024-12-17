import React from 'react'
import { Grid, Box } from '@mui/material'

const QuestionNavigator = ({
    questions,
    currentQuestion,
    setCurrentQuestion,
}) => {
    const getCircleColor = (question) => {
        if (question.marked) return 'yellow' // Marked question
        if (question.answer) return 'green' // Answered question
        return 'red' // Unanswered question
    }

    return (
        <Box sx={{ padding: '16px' }}>
            <Grid container spacing={2}>
                {questions.map((question, index) => (
                    <Grid
                        item
                        key={question.id}
                        xs={1.2} // Adjust width to fit 10 items per row
                        onClick={() => setCurrentQuestion(index)}
                        padding={'0'}

                        // sx={{
                        //     display: "flex",
                        //     justifyContent: "center",
                        //     alignItems: "center",
                        //     cursor: "pointer",
                        // }}
                    >
                        <Box
                            sx={{
                                padding: '0',
                                display: 'flex',
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: getCircleColor(question),
                                fontWeight: 'bold',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white',
                                transition: '0.3s',
                                opacity: currentQuestion === index ? 1 : 0.5,
                                border:
                                    currentQuestion === index
                                        ? '3px solid rgb(0 213 250)'
                                        : 'none',

                                '&:hover': {
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                                },
                            }}
                        >
                            {index + 1}
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default QuestionNavigator
