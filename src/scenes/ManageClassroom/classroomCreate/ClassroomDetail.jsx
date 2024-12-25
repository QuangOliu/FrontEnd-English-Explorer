import { useTheme } from '@emotion/react'
import MailIcon from '@mui/icons-material/Mail'
import HomeIcon from '@mui/icons-material/Home'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import Divider from '@mui/material/Divider'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import classroomApi from 'api/classroomApi'
import PropTypes from 'prop-types'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Bulletin from './Bulletin'
import ExamList from './ExamList'
import MemberList from '../Members/MemberList'
import { Grid } from '@mui/material'

const sidebarManu = [
    {
        text: 'Exams',
        icon: <MailIcon />,
        id: 1,
    },
    {
        text: 'Member',
        icon: <MailIcon />,
        id: 2,
    },
    {
        text: 'General',
        icon: <MailIcon />,
        id: 3,
    },
]

function ResponsiveDrawer(props) {
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
            {/* Sidebar */}
            <Grid item xs={12} sm={3} xl={3}>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/')}>
                        <ListItemIcon>
                            <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={'Home'} />
                    </ListItemButton>
                </ListItem>
                <Divider />
                <List>
                    {sidebarManu.map((item) => (
                        <ListItem
                            key={item.id}
                            disablePadding
                            selected={item.id === typeContent}
                            className={item.id === typeContent ? 'active' : ''}
                        >
                            <ListItemButton
                                onClick={() => handleClickSideBar(item.id)}
                            >
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Grid>

            {/* Content */}
            <Grid item xs={12} sm={9} xl={9}>
                {typeContent === 1 && <ExamList classroomId={classroomId} />}
                {typeContent === 2 && <MemberList classroomId={classroomId} />}
                {typeContent === 3 && <Bulletin classroom={classroom} />}
            </Grid>
        </Grid>
    )
}

ResponsiveDrawer.propTypes = {
    window: PropTypes.func,
}

export default ResponsiveDrawer
