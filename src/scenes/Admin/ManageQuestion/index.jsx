import { Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeManyFromCart, setItems } from 'state'
import questionApi from 'api/questionApi'
import TableQuestions from './TableQuestions'

const btn = {
    title: 'Thêm câu hỏi mới',
    linkTo: '/questions/create',
}
function ManageQuestion({ listData }) {

    const dispatch = useDispatch()

    

    const submitDelete = async (selected) => {
        const formData = {
            selected: selected,
        }
    }

    return (
        <div>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>Question Management</b>
            </Typography>
            <TableQuestions btn={btn} submitDelete={submitDelete} />
        </div>
    )
}

export default ManageQuestion
