import { Close, DarkMode, LightMode, Menu, Search } from '@mui/icons-material'
import CardMembershipIcon from '@mui/icons-material/CardMembership'
import GroupIcon from '@mui/icons-material/Group'
import LoginIcon from '@mui/icons-material/Login'
import PersonIcon from '@mui/icons-material/Person'
import {
    Box,
    Button,
    FormControl,
    IconButton,
    InputBase,
    MenuItem,
    Select,
    Tooltip,
    Typography,
    useMediaQuery,
    useTheme,
} from '@mui/material'
import FlexBetween from 'components/FlexBetween'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setLogout, setMode } from 'state'
import { isAdmin } from 'utils/utils'
import SearchBar from './SearchBar'

const Navbar = () => {
    const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const cart = useSelector((state) => state.cart)
    const isNonMobileScreens = useMediaQuery('(min-width: 1000px)')

    const theme = useTheme()
    const neutralLight = theme.palette.neutral.light
    const dark = theme.palette.neutral.dark
    const background = theme.palette.background.default
    const primaryLight = theme.palette.primary.light
    const alt = theme.palette.background.alt

    const user = useSelector((state) => state.user)

    const fullName = `${user?.fullname}`

    return (
        <FlexBetween padding="1rem 5%" backgroundColor={alt}>
            <FlexBetween gap="1.75rem">
                <Typography
                    fontWeight="bold"
                    fontSize="clamp(1rem, 2rem, 2.25rem)"
                    color="primary"
                    onClick={() => navigate('/')}
                    sx={{
                        '&:hover': {
                            color: primaryLight,
                            cursor: 'pointer',
                        },
                    }}
                >
                    English Explorer
                </Typography>
            </FlexBetween>
            <FlexBetween gap={'20px'}>
                <Tooltip
                    title={
                        theme.palette.mode === 'dark' ? 'Dark mode' : 'Light Mode'
                    }
                >
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <DarkMode sx={{ fontSize: '25px' }} />
                        ) : (
                            <LightMode
                                sx={{
                                    color: dark,
                                    fontSize: '25px',
                                }}
                            />
                        )}
                    </IconButton>
                </Tooltip>

                {/* SearchBar for mobile view */}
                {!isNonMobileScreens && <SearchBar />}

                {user ? (
                    <FormControl variant="standard" value={fullName}>
                        <Select
                            value={fullName}
                            sx={{
                                backgroundColor: neutralLight,
                                borderRadius: '0.25rem',
                                p: '0.25rem 1rem',
                                '& .MuiSvgIcon-root': {
                                    pr: '0.25rem',
                                    width: '3rem',
                                },
                                '& .MuiSelect-select:focus': {
                                    backgroundColor: neutralLight,
                                },
                            }}
                            input={<InputBase />}
                        >
                            <MenuItem value={fullName}>
                                <Typography>{fullName}</Typography>
                            </MenuItem>
                            <MenuItem onClick={() => dispatch(setLogout())}>
                                Log Out
                            </MenuItem>
                        </Select>
                    </FormControl>
                ) : (
                    <Button onClick={() => navigate("/login")}>Login</Button>
                )}
            </FlexBetween>
        </FlexBetween>
    )
}

export default Navbar
