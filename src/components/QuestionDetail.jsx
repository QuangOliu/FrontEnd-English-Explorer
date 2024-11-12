import { Box, Grid, Typography } from '@mui/material'
import fileApi from 'api/fileApi'
import { useEffect, useState } from 'react'

const QuestionDetail = ({
    questionProp,
    selectedChoice,
    isCorrect,
    onChoiceSelect,
}) => {
    // Declare state variables for question data
    const [question, setQuestion] = useState('')
    const [choices, setChoices] = useState([])
    const [explanation, setExplanation] = useState('')
    const [image, setImage] = useState('')
    const [audio, setAudio] = useState('')
    const [audioUrl, setAudioUrl] = useState('') // State to hold audio URL

    // UseEffect to set the state when questionProp changes
    useEffect(() => {

        if (questionProp) {
            console.log(questionProp)
            setQuestion(questionProp.question)
            setChoices(questionProp.choises)
            setExplanation(questionProp.explanation)
            setImage(questionProp.image)
            setAudio(questionProp.audio)
        }
    }, [questionProp])

    // Call fetchAudio once the component mounts or when audio changes
    // useEffect(() => {
    //     fetchAudio()
    // }, [audio])

    return (
        <Grid container padding={'20px'}>
            <>
                <Grid item xs={6}>
                    {image && (
                        <img
                            src={`http://localhost:8080/api/v1/files/${image}`}
                            alt="Question"
                            style={{ width: '100%' }}
                        />
                    )}
                    {audioUrl && (
                        <audio controls>
                            <source
                                src={`http://localhost:8080/api/v1/files/${audio}`} // Use the fetched audio URL
                                type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                        </audio>
                    )}
                </Grid>
                <Grid item xs={image || audioUrl ? 6 : 12}>
                    <Grid xs={12} padding={'0 20px'}>
                        <Typography variant="h2">{question}</Typography>
                        <Grid item xs={12}>
                            {choices?.map((choice, index) => (
                                <Typography
                                    key={index}
                                    variant="h4"
                                    onClick={() =>
                                        onChoiceSelect(choice, choice.correct)
                                    }
                                    style={{
                                        cursor: 'pointer',
                                        padding: '8px',
                                        borderRadius: '5px',
                                        backgroundColor:
                                            selectedChoice === choice
                                                ? isCorrect
                                                    ? 'green'
                                                    : 'red'
                                                : 'transparent',
                                        // color:
                                        //     selectedChoice === choice
                                        //         ? 'white'
                                        //         : 'black',
                                        transition: 'background-color 0.3s', // Smooth transition for background color
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.backgroundColor =
                                            selectedChoice !== choice
                                                ? '#ccc'
                                                : undefined
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.backgroundColor =
                                            selectedChoice !== choice
                                                ? 'transparent'
                                                : selectedChoice === choice &&
                                                    isCorrect
                                                ? 'green'
                                                : selectedChoice === choice &&
                                                    !isCorrect
                                                ? 'red'
                                                : 'transparent'
                                    }}
                                >
                                    {choice.answer}
                                </Typography>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </>

            {explanation && selectedChoice && (
                <Grid item xs={12}>
                    <Typography variant="body2">
                        Explanation: {explanation}
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}

export default QuestionDetail
