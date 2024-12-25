import BookmarkIcon from '@mui/icons-material/Bookmark'
import { Grid, Typography } from '@mui/material'
import actionApi from 'api/actionApi'
import questionApi from 'api/questionApi'
import QuestionCard from 'components/Question/QuestionCard'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

const Bookmark = () => {
    const [data, setData] = useState([])

    const fetchData = () => {
        questionApi
            .getByAction('BOOKMARK')
            .then((result) => setData(result))
            .catch(() => {
                toast.error('Error loading loved questions')
            })
    }
    useEffect(() => {
        fetchData()

        return fetchData
    }, [])

    const handleClickIcon = (question) => {
        handleToggleAction('BOOKMARK', question)
        toast.success('You have unbookmark this question')
    }

    const handleToggleAction = (actionType, question) => {
        const questionId = question?.id
        const data = { actionType, question: { id: questionId } }

        actionApi
            .toggleAction(data)
            .then((updatedState) => {
                fetchData()
            })
            .catch((err) => console.log(err))
    }
    return (
        <div>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>Bookmark ({data?.length})</b>
            </Typography>

            <Grid container spacing={2}>
                {data.length > 0 ? (
                    data.map((question) => (
                        <Grid
                            item
                            xs={12} // 1 phần tử trên màn hình rất nhỏ
                            sm={6} // 2 phần tử trên màn hình nhỏ
                            md={4} // 3 phần tử trên màn hình trung bình
                            lg={3} // 4 phần tử trên màn hình lớn
                            key={question.id}
                        >
                            <QuestionCard
                                handleClickIcon={handleClickIcon}
                                icon={<BookmarkIcon />}
                                questionProp={question}
                            />
                        </Grid>
                    ))
                ) : (
                    <Grid item xl={12}>
                        No Question
                    </Grid>
                )}
            </Grid>
        </div>
    )
}

export default Bookmark
