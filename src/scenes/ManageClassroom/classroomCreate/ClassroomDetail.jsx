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

const drawerWidth = 240

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
    const [mobileOpen, setMobileOpen] = useState(false)
    const [classroom, setclassroom] = useState({})
    const [isClosing, setIsClosing] = useState(false)
    const [typeContent, setTypeContent] = useState(1)
    const { classroomId } = useParams()

    const handleDrawerClose = () => {
        setIsClosing(true)
        setMobileOpen(false)
    }

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false)
    }

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
    const drawer = (
        <div>
            <Toolbar />
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
                {sidebarManu.map((item, index) => (
                    <ListItem key={item.id} disablePadding>
                        <ListItemButton
                            onClick={() => handleClickSideBar(item.id)}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </div>
    )
    // Remove this const when copying and pasting into your project.
    const container =
        window !== undefined ? () => window().document.body : undefined

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Box
                component="nav"
                sx={{
                    width: { sm: drawerWidth },
                    flexShrink: { sm: 0 },
                    paddingTop: '100px',
                }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': {
                            boxSizing: 'border-box',
                            width: drawerWidth,
                        },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                }}
            >
                <Toolbar />
                {typeContent === 1 && <ExamList classroomId={classroomId} />}
                {typeContent === 2 && <MemberList classroomId={classroomId} />}
                {typeContent === 3 && <Bulletin classroom={classroom} />}
            </Box>
        </Box>
    )
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window: PropTypes.func,
}

export default ResponsiveDrawer
