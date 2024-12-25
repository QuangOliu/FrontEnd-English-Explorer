import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    useTheme,
} from '@mui/material'
import classroomApi from 'api/classroomApi'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { removeManyFromCart, setItems } from 'state'
import TableClassroom from './TableClassrooms'
import toast from 'react-hot-toast'

const btn = {
    title: 'Thêm classroom mới',
    linkTo: '/classrooms/create',
}
function ManageClassroom() {
    const [data, setData] = useState([])
    const [open, setOpen] = useState(false)

    const { palette } = useTheme()
    const dispatch = useDispatch()

    useEffect(() => {
        classroomApi
            .getClassroomsPage()
            .then((result) => {
                setData(result.content)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const submitDelete = async (selected) => {
        const formData = {
            selected: selected,
        }
        classroomApi
            .deleteUsers(formData)
            .then((result) => {
                const newData = data.filter((item) => {
                    return !selected.includes(item._id)
                })
                setData(newData)
                dispatch(setItems(newData))
                dispatch(removeManyFromCart(selected))
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>Classroom Management</b>
            </Typography>
            <TableClassroom data={data} setData={setData} submitDelete={submitDelete} />
        </div>
    )
}

export default ManageClassroom
