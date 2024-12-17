import toast, { Toaster } from 'react-hot-toast'
import questionApi from 'api/questionApi'
import QuestionDetail from './QuestionDetail'
import QuestionNavigator from './QuestionNavigator'
import Timer from './Timer'
import examApi from 'api/examApi'
import Confetti from 'components/Confetti/Confetti'

const {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    Grid,
} = require('@mui/material')
const { useState, useEffect } = require('react')
const { useParams, useNavigate } = require('react-router-dom')

const ExamPage = () => {
    const [questions, setQuestions] = useState([])
    const [openDialog, setOpenDialog] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [score, setScore] = useState(null)  // To store the score after submission
    const [examFinished, setExamFinished] = useState(false)  // To check if the exam is finished

    const { examId } = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        if (examId) {
            questionApi
                .getByExam(examId)
                .then((result) => {
                    setQuestions(result)
                })
                .catch((err) => {
                    console.error('Failed to fetch exam data:', err)
                    toast.error('Error loading exam details')
                })
        }
    }, [examId])

    const handleAnswer = (question, choice) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === question.id ? { ...q, answer: { ...choice } } : q
            )
        )
    }

    const handleMark = (question) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((q) =>
                q.id === question.id
                    ? {
                          ...q,
                          marked: q.marked !== undefined ? !q.marked : true,
                      }
                    : q
            )
        )
    }

    const submitExam = () => {
        const submitData = questions.map((item) => {
            return {
                question: { id: item.id },
                answerId: item?.answer?.id ? item?.answer?.id : null ,
            }
        })

        examApi
            .submitAnser(examId, submitData)
            .then((result) => {
                // Calculate score here
                const userScore = result.score;  // Assuming the score is part of the result data
                setScore(userScore);
                setExamFinished(true);  // Set exam as finished
                toast.success('Exam submitted successfully');
            })
            .catch((err) => {
                toast.error('Error submitting exam');
                console.error('Error submitting exam:', err);
            })
    }

    const handleOpenDialog = () => {
        setOpenDialog(true)
    }

    const handleCloseDialog = () => {
        setOpenDialog(false)
    }

    const handleSubmitEarly = () => {
        handleCloseDialog()
        submitExam()
    }

    const handleNextQuestion = () => {
        setCurrentQuestion((prev) => Math.min(prev + 1, questions.length - 1))
    }

    const handlePreviousQuestion = () => {
        setCurrentQuestion((prev) => Math.max(prev - 1, 0))
    }

    const handleGoHome = () => {
        navigate('/home')  // Adjust the route to your home page
    }

    if (examFinished) {
        // Display result screen
        return (
            <Confetti score={score}/>
        )
    }

    return (
        <Grid container spacing={2} padding={'20px'}>
            <Grid item xs={4}>
                {/* Timer component */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleOpenDialog}
                >
                    Nộp bài sớm
                </Button>
                <Timer duration={30} onTimeout={submitExam} />
                <QuestionNavigator
                    questions={questions}
                    currentQuestion={currentQuestion}
                    setCurrentQuestion={setCurrentQuestion}
                />
            </Grid>

            <Grid
                item
                xs={8}
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexDirection: 'column',
                }}
                height={'calc(100vh - 40px)'}
            >
                {questions[currentQuestion] ? (
                    <QuestionDetail
                        key={questions[currentQuestion].id}
                        questionProp={questions[currentQuestion]}
                        handleSelect={handleAnswer}
                        handleMark={handleMark}
                    />
                ) : (
                    <p>Loading question...</p>
                )}
                <Grid
                    container
                    justifyContent="space-between"
                    style={{ marginBottom: '20px' }}
                >
                    <Grid xs={4}>
                        <Button
                            onClick={() => {
                                handleMark(questions[currentQuestion])
                            }}
                        >
                            {questions[currentQuestion]?.marked
                                ? 'Unmark'
                                : 'Mark'}
                        </Button>
                    </Grid>
                    <Grid xs={8} container justifyContent="space-between">
                        <Button
                            variant="outlined"
                            onClick={handlePreviousQuestion}
                            disabled={currentQuestion === 0}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outlined"
                            onClick={handleNextQuestion}
                            disabled={currentQuestion === questions.length - 1}
                        >
                            Next
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>Xác nhận nộp bài</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn nộp bài sớm? Sau khi nộp, bạn sẽ
                        không thể quay lại sửa câu trả lời.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">
                        Hủy
                    </Button>
                    <Button
                        onClick={handleSubmitEarly}
                        color="primary"
                        autoFocus
                    >
                        Nộp bài
                    </Button>
                </DialogActions>
            </Dialog>

            <Toaster />
        </Grid>
    )
}

export default ExamPage
