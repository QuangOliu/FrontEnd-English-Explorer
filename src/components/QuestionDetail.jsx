import { Grid, Typography, Button } from '@mui/material'
import { CHOICENAME } from 'constain/constain'
import { useEffect, useRef, useState } from 'react'

const QuestionDetail = ({ questionProp }) => {
    // Declare state variables for question data
    const [question, setQuestion] = useState('')
    const [choices, setChoices] = useState([])
    const [explanation, setExplanation] = useState('')
    const [image, setImage] = useState('')
    const [audio, setAudio] = useState('')
    const [isAudioPlaying, setIsAudioPlaying] = useState(false) // State to track audio playing status
    const [selectedChoice, setSelectedChoice] = useState(null) // State to track selected choice

    // Reference for the audio element
    const audioRef = useRef(null)

    // UseEffect to set the state when questionProp changes
    useEffect(() => {
        if (questionProp) {
            // Stop any previously playing audio
            if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0 // Reset audio to start
            }
            setIsAudioPlaying(false)
            // Update question data
            setQuestion(questionProp.question || '')
            setChoices(questionProp.choises || [])
            setExplanation(questionProp.explanation || '')
            setImage(questionProp.image || '')
            setAudio(questionProp.audio || '')
        } else {
            // Clear the data when questionProp is empty or null
            setQuestion('')
            setChoices([])
            setExplanation('')
            setImage('')
            setAudio('')
            setIsAudioPlaying(false)
            setSelectedChoice(null)
        }
    }, [questionProp]) // Trigger effect when questionProp changes

    // Function to handle audio play when the button is clicked
    const handleAudioPlay = () => {
        if (audioRef.current && !isAudioPlaying) {
            // Update the source for the audio element
            audioRef.current.src = `http://localhost:8080/api/v1/files/${audio}`

            // Play the audio when the button is clicked
            audioRef.current.play().catch((error) => {
                console.error('Error playing audio:', error)
            })

            setIsAudioPlaying(true) // Set state to indicate audio is playing
        }
    }

    // Function to handle choice selection
    const onChoiceSelect = (choice, correct) => {
        setSelectedChoice(choice)
        // You could handle other logic here such as checking if the answer is correct
    }

    return (
        <Grid container spacing={3}>
            {/* Left grid for media (image/audio) */}
            <Grid item xs={6}>
                {image && (
                    <img
                        src={`http://localhost:8080/api/v1/files/${image}`}
                        alt="Question"
                        style={{ width: '100%' }}
                    />
                )}
                {audio && (
                    <>
                        <audio ref={audioRef} muted={false} controls={false}>
                            {' '}
                            {/* Disable audio controls */}
                            <source
                                src={`http://localhost:8080/api/v1/files/${audio}`} // Use the fetched audio URL
                                type="audio/mpeg"
                            />
                            Your browser does not support the audio element.
                        </audio>
                        {/* Button to trigger audio play */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAudioPlay}
                            disabled={isAudioPlaying} // Disable the button once the audio starts playing
                        >
                            Play Audio
                        </Button>
                    </>
                )}
            </Grid>

            {/* Right grid for question text and choices */}
            <Grid item xs={image || audio ? 6 : 12}>
                <Grid item xs={12}>
                    {question && (
                        <Typography variant="h2">{question}</Typography>
                    )}
                    {choices?.length > 0 && (
                        <Grid item xs={12}>
                            {choices.map((choice, index) => (
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
                                        border: '1px solid #ccc',
                                        margin: '5px 0',
                                        backgroundColor:
                                            selectedChoice === choice
                                                ? choice.correct
                                                    ? 'green'
                                                    : 'red'
                                                : 'transparent',
                                        transition: 'background-color 0.3s',
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
                                                  choice.correct
                                                ? 'green'
                                                : selectedChoice === choice &&
                                                  !choice.correct
                                                ? 'red'
                                                : 'transparent'
                                    }}
                                >
                                    {CHOICENAME[index]}{choice.answer}
                                </Typography>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>

            {/* Explanation section */}
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
