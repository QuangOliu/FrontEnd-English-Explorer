import { Grid, Typography } from '@mui/material'
import questionApi from 'api/questionApi'
import FavoriteIcon from '@mui/icons-material/Favorite'
import QuestionCard from 'components/Question/QuestionCard'
import QuestionDetailPopup from 'components/Question/QuestionDetailPopup'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import actionApi from 'api/actionApi'

const Favorites = () => {
    const [data, setData] = useState([])

    const fetchData = () => {
        questionApi
            .getByAction('LOVE')
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
        handleToggleAction('LOVE', question)
    }

    const handleToggleAction = (actionType, question) => {
        const questionId = question?.id
        const data = { actionType, question: { id: questionId } }

        actionApi
            .toggleAction(data)
            .then((updatedState) => {
                toast.success('You have unloved this question')
                fetchData()
            })
            .catch((err) => console.log(err))
    }
    return (
        <div>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>Favorites ({data?.length})</b>
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
                                icon={<FavoriteIcon />}
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

export default Favorites
