import React, { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import FavoriteIcon from '@mui/icons-material/Favorite'
import VisibilityIcon from '@mui/icons-material/Visibility'
import QuestionDetailPopup from './QuestionDetailPopup'
import { CHOICENAME } from 'constain/constain'

const QuestionCard = ({ questionProp, handleClickIcon, icon }) => {
    const [question, setQuestion] = useState('')
    const [image, setImage] = useState('')
    const [choices, setChoices] = useState([])
    const [selectedQuestion, setSelectedQuestion] = useState(null)
    const [open, setOpen] = useState(false)

    const handleViewDetails = () => {
        setSelectedQuestion(questionProp)
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setSelectedQuestion(null)
    }

    useEffect(() => {
        if (questionProp) {
            setQuestion(questionProp?.question || '')
            setImage(questionProp?.image || '')
            setChoices(questionProp?.choises || []) // Sửa lỗi 'choises' thành 'choices'
        }
    }, [questionProp])

    return (
        <>
            <Card
                sx={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                }}
            >
                {image ? (
                    <CardMedia
                        component="img"
                        alt="Question Image"
                        height="140"
                        image={`http://localhost:8080/api/v1/files/${image}`}
                    />
                ) : (
                    choices?.length > 0 && (
                        <div
                            style={{
                                padding: '10px',
                                backgroundColor: '#f0f0f0',
                            }}
                        >
                            <Typography variant="h6" color="textSecondary">
                                {question}
                            </Typography>
                            {choices?.map((choice, index) => (
                                <Typography
                                    key={index}
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        marginBottom: '4px',
                                    }}
                                >
                                    {CHOICENAME[index]} {choice?.answer}
                                </Typography>
                            ))}
                        </div>
                    )
                )}
                <CardActions>
                    {icon && (
                        <IconButton
                            onClick={() => handleClickIcon(questionProp)}
                            color="primary"
                        >
                            {icon}
                        </IconButton>
                    )}

                    <IconButton onClick={handleViewDetails} color="primary">
                        <VisibilityIcon />
                    </IconButton>
                </CardActions>
            </Card>

            {/* Popup hiển thị chi tiết */}
            <QuestionDetailPopup
                open={open}
                question={selectedQuestion}
                onClose={handleClose}
            />
        </>
    )
}

export default QuestionCard
