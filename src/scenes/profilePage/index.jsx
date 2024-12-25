import { Tab, Tabs, Typography, Box } from '@mui/material'
import questionApi from 'api/questionApi'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

import BookmarkIcon from '@mui/icons-material/Bookmark'
import FavoriteIcon from '@mui/icons-material/Favorite'
import PersonPinIcon from '@mui/icons-material/PersonPin'
import { useTheme } from '@mui/material/styles'
import Favorites from 'scenes/Favorites'
import Bookmarks from 'scenes/Bookmarks'
import ProfileInfo from './ProfileInfo'

const TabPanel = (props) => {
    const { children, value, index, ...other } = props

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
            style={{padding: 0}}
        >
            {value === index && (
                <Box sx={{ py: 2 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    )
}

const ProfilePage = () => {
    const [data, setData] = useState([])
    const [value, setValue] = useState(0)

    const theme = useTheme()
    const alt = theme.palette.background.alt

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    useEffect(() => {
        questionApi
            .getByAction('LOVE')
            .then((result) => {
                if (Array.isArray(result)) {
                    setData(result)
                } else {
                    toast.error('Invalid data format received from API')
                }
            })
            .catch(() => {
                toast.error('Error loading loved questions')
            })
    }, [])

    return (
        <div>
            <Typography variant="h3" textAlign="left" sx={{ mb: '15px' }}>
                <b>My Page</b>
            </Typography>

            <Box
                sx={{
                    backgroundColor: alt,
                    borderRadius: '8px',
                    px: 2,
                    py: 1,
                }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="inherit"
                    indicatorColor="primary"
                    aria-label="Favorites Tabs"
                    sx={{
                        '& .MuiTab-root': {
                            color: theme.palette.text.secondary,
                            '&.Mui-selected': {
                                color: theme.palette.primary.main,
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: theme.palette.primary.main,
                        },
                    }}
                >
                    <Tab icon={<FavoriteIcon />} aria-label="Loved Questions" />
                    <Tab
                        icon={<BookmarkIcon />}
                        aria-label="Bookmarked Questions"
                    />
                    <Tab
                        icon={<PersonPinIcon />}
                        aria-label="Personalized Content"
                    />
                </Tabs>
            </Box>

            <TabPanel value={value} index={0} dir={theme.direction}>
                <Favorites />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
                <Bookmarks />
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
                <ProfileInfo />
            </TabPanel>
        </div>
    )
}

export default ProfilePage
