import { Class, Dashboard, Home, QuestionAnswer } from '@mui/icons-material'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import GroupIcon from '@mui/icons-material/Group'
import PersonIcon from '@mui/icons-material/Person'
import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import {
    Badge,
    Box,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Divider,
    Collapse,
    ListItem,
} from '@mui/material'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import WalletIcon from '@mui/icons-material/Wallet';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const menuItems = [
    {
        name: 'My Dashboard', // New group for manage items
        icon: <Dashboard />,
        role: 'ALL',
        subItems: [
            {
                name: 'Home',
                path: '/',
                icon: <Home />,
                role: 'ALL',
            },
            {
                name: 'Profile',
                path: '/profile',
                icon: <PersonIcon />,
                role: 'USER',
            },
        ],
    },
    {
        name: 'Manage', // New group for manage items
        path: '/manage',
        icon: <LeaderboardIcon />,
        role: 'ADMIN',
        subItems: [
            {
                name: 'Manage Questions',
                path: '/manage/questions',
                icon: <QuestionAnswer />,
                role: 'ADMIN',
            },
            {
                name: 'Manage Classroom',
                path: '/manage/classrooms',
                icon: <Class />,
                role: 'ADMIN',
            },
            {
                name: 'Manage Users',
                path: '/manage/users',
                icon: <GroupIcon />,
                role: 'ADMIN',
            },
        ],
    },
    {
        name: 'Classroom',
        path: '/classrooms',
        icon: <CardMembershipIcon />,
        role: 'ALL',
    },
    {
        name: 'My Wallet',
        path: '/wallet',
        icon: <WalletIcon />,
        role: 'ALL',
    }
]

const Sidebar = () => {
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [openSubItems, setOpenSubItems] = useState({}) // Track the state of subitems
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()

    const user = useSelector((state) => state.user)
    const userRoles = user?.roles?.map((role) => role.name) || [] // Get user roles from Redux store
    const alt = theme.palette.background.alt

    const handleListItemClick = (event, index, path) => {
        setSelectedIndex(index)
        navigate(path)
    }

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') {
            return true
        }

        // For other paths that should match their subpaths
        return location.pathname.startsWith(path)
    }

    const handleSubItemClick = (path) => {
        setOpenSubItems((prevState) => ({
            ...prevState,
            [path]: !prevState[path], // Toggle the open/close state for subitems
        }))
    }

    // Filter menuItems based on user roles
    const filteredMenuItems = menuItems.filter((item) => {
        if (item.role === 'ALL') return true // Show if role is 'ALL'
        return userRoles.includes(item.role) // Show if user has the required role
    })

    return (
        <Box backgroundColor={alt} height={'100%'}>
            <List
                sx={{ width: '100%' }}
                component="nav"
                aria-labelledby="nested-list-subheader"
            >
                {filteredMenuItems.map((item, index) => {
                    const isItemActive = isActive(item.path)

                    // If the item has subItems (i.e., Manage group)
                    if (item?.subItems?.length > 0) {
                        return (
                            <div key={index}>
                                {/* Main item for "Manage" with icon and expand/collapse arrow */}
                                <ListItemButton
                                    onClick={() =>
                                        handleSubItemClick(item.path)
                                    }
                                    selected={isItemActive}
                                >
                                    <ListItemIcon>
                                        <Badge>{item.icon}</Badge>
                                    </ListItemIcon>
                                    <ListItemText primary={item.name} />
                                    {openSubItems[item.path] ? (
                                        <ExpandLessIcon />
                                    ) : (
                                        <ExpandMoreIcon />
                                    )}
                                </ListItemButton>

                                {/* Collapse section for the subItems */}
                                <Collapse
                                    in={openSubItems[item.path]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {item.subItems.map(
                                            (subItem, subIndex) => (
                                                <ListItemButton
                                                    key={subIndex}
                                                    selected={isActive(
                                                        subItem.path
                                                    )}
                                                    onClick={(event) =>
                                                        handleListItemClick(
                                                            event,
                                                            subIndex,
                                                            subItem.path
                                                        )
                                                    }
                                                    sx={{ pl: 4 }} // Indent the subitems
                                                >
                                                    <ListItemIcon>
                                                        <Badge>
                                                            {subItem.icon}
                                                        </Badge>
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={subItem.name}
                                                    />
                                                </ListItemButton>
                                            )
                                        )}
                                    </List>
                                </Collapse>
                            </div>
                        )
                    }

                    // Display the items without subItems
                    return (
                        <ListItemButton
                            key={index}
                            selected={isItemActive}
                            onClick={(event) =>
                                handleListItemClick(event, index, item.path)
                            }
                        >
                            <ListItemIcon>
                                <Badge>{item.icon}</Badge>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    )
                })}
            </List>

            {/* Divider for separating sections */}
            <Divider sx={{ marginY: 1 }} />
        </Box>
    )
}

export default Sidebar
