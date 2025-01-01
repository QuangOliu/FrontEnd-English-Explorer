import { useTheme } from '@emotion/react'
import HomeIcon from '@mui/icons-material/Home'
import MailIcon from '@mui/icons-material/Mail'
import { Grid } from '@mui/material'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import classroomApi from 'api/classroomApi'
import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import MemberList from '../Members/MemberList'
import Bulletin from './Bulletin'
import ExamList from './ExamList'

function ClassroomCheckout(props) {
    const { window } = props
    const [classroom, setclassroom] = useState({})
    const [typeContent, setTypeContent] = useState(1)
    const { classroomId } = useParams()

    useEffect(() => {
        classroomApi
            .getById(classroomId)
            .then((result) => {
                setclassroom(result)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [classroomId])

    const handleClickSideBar = (id) => {
        setTypeContent(id)
    }

    const navigate = useNavigate()
    const theme = useTheme()
    const { palette } = useTheme()
    const container =
        window !== undefined ? () => window().document.body : undefined

    return (
        <Grid container sx={{ display: 'flex' }} spacing={2}>
        </Grid>
    )
}

ClassroomCheckout.propTypes = {
    window: PropTypes.func,
}

export default ClassroomCheckout
