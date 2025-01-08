import { useTheme } from '@emotion/react'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import FilterListIcon from '@mui/icons-material/FilterList'
import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    IconButton,
    InputLabel,
    MenuItem,
    Select,
    Toolbar,
    Tooltip,
    Typography,
    alpha,
} from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import authApi from 'api/authApi'
import userApi from 'api/userApi'
import StyledTableCell from 'components/StyledTableCell'
import StyledTableRow from 'components/StyledTableRow'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

const head = [
    {
        numeric: true,
        disablePadding: false,
        lable: 'User ID',
        id: 'id',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'Full Name',
        id: 'fullname',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'User Name',
        id: 'username',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'Email',
        id: 'email',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'CreateAt',
        id: 'createdAt',
    },
]

const roles = [
    {
        id: 1,
        name: 'admin',
        label: 'Admin',
    },
    {
        id: 2,
        name: 'user',
        label: 'User',
    },
]

function TableUsers({ data, btn, submitDelete }) {
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const [selectedRoles, setSelectedRoles] = useState({})
    const [selectedOne, setSelectedOne] = useState()
    const [actionAllIn, setActionAllIn] = useState(false)
    const user = useSelector((state) => state.user)
    const isAdmin = user?.role === 'admin'

    const navigate = useNavigate()
    // Bên ngoài hàm TableUsers

    const theme = useTheme()
    const { palette } = useTheme()

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            if (selected.length > 0) {
                return setSelected([])
            }
            const x = data.filter((n) => {
                return n.role !== 'admin'
            })
            const newSelected = x.map((n) => n.id)
            setSelected(newSelected)
        }
    }

    const handleClick = (event, name) => {
        const selectedIndex = selected.indexOf(name)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, name)
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1))
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1))
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            )
        }

        setSelected(newSelected)
    }

    const isSelected = (name) => selected.indexOf(name) !== -1

    const handleClickDeleteIcon = (selected) => {
        submitDelete(selected)
    }

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setActionAllIn(false)
            setSelectedOne()
        }, 250)
    }

    // Trong hàm TableUsers
    const handleChangeRole = (event, userId) => {
        const role = event.target.value
        setSelectedRoles((prevSelectedRoles) => ({
            ...prevSelectedRoles,
            role: role,
            userId: userId,
            [userId]: role,
        }))

        userApi
            .updateRole(userId, { userId, role })
            .then((result) => {
                console.log({ result })
            })
            .catch((err) => {})
    }

    const handleDelete = (id) => {
        userApi
            .deleteUser(id)
            .then((result) => {
                console.log({ result })
            })
            .catch((err) => {
                console.log({ err })
            })
    }

    return (
        <Box>
            <Box m="0 auto">

                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        {/* Head table */}
                        {head && (
                            <TableHead>
                                <TableRow>
                                    {head.map((item) => {
                                        return (
                                            <StyledTableCell key={item.id}>
                                                {item.lable}
                                            </StyledTableCell>
                                        )
                                    })}
                                    <StyledTableCell align="center" colSpan={2}>
                                        Action
                                    </StyledTableCell>
                                </TableRow>
                            </TableHead>
                        )}

                        {/* Body of table */}
                        {data ? (
                            <TableBody>
                                {data.map((row) => {
                                    const isItemSelected = isSelected(row.id)
                                    return (
                                        <StyledTableRow key={row.id}>
                                            <StyledTableCell align="left">
                                                <Link to={row?.linkTo}>
                                                    {row?.id}
                                                </Link>
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row?.fullname.length > 50
                                                    ? `${row?.fullname.slice(
                                                          0,
                                                          50
                                                      )}...v.v`
                                                    : row?.fullname}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row?.username.length > 50
                                                    ? `${row?.username.slice(
                                                          0,
                                                          50
                                                      )}...v.v`
                                                    : row?.username}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                {row?.email.length > 50
                                                    ? `${row?.email.slice(
                                                          0,
                                                          50
                                                      )}...v.v`
                                                    : row?.email}
                                            </StyledTableCell>

                                            <StyledTableCell align="left">
                                                {row?.createDate
                                                    ? row.createDate.slice(
                                                          0,
                                                          10
                                                      )
                                                    : '-'}
                                            </StyledTableCell>
                                            <StyledTableCell align="left">
                                                <IconButton
                                                    onClick={() => {
                                                        navigate(
                                                            `/user/${row.id}/edit`
                                                        )
                                                    }}
                                                    size="large"
                                                    sx={{
                                                        backgroundColor:
                                                            palette.primary
                                                                .main,
                                                        color: 'white',
                                                        '&:hover': {
                                                            color: palette
                                                                .primary.main,
                                                        },
                                                    }}
                                                >
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>
                                            </StyledTableCell>

                                        </StyledTableRow>
                                    )
                                })}
                            </TableBody>
                        ) : (
                            <Box>
                                <Box
                                    width={'100%'}
                                    pt={'15px'}
                                    m="15px auto"
                                    backgroundColor={
                                        theme.palette.background.alt
                                    }
                                >
                                    <Typography
                                        display={'block'}
                                        fontWeight="500"
                                        variant="h5"
                                        textAlign={'center'}
                                        sx={{ mb: '1.5rem' }}
                                    >
                                        Dữ liệu trống
                                    </Typography>
                                </Box>
                            </Box>
                        )}
                    </Table>
                </TableContainer>
                {btn && (
                    <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                        <Button
                            sx={{
                                backgroundColor: palette.primary.main,
                                color: palette.background.alt,
                                '&:hover': { color: palette.primary.main },
                            }}
                            onClick={() => {
                                navigate(`${btn.linkTo}`)
                            }}
                        >
                            {btn.title}
                        </Button>
                    </Box>
                )}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Bạn có chắc chắn muốn xóa sản phẩm{' '}
                        <strong>{selectedOne}</strong>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button
                        aria-label="Hủy"
                        onClick={(e) => {
                            handleClose()
                        }}
                        sx={{
                            p: '1rem',
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        aria-label="delete"
                        size="large"
                        onClick={() => {
                            var x
                            if (actionAllIn) x = selected
                            else {
                                x = [selectedOne]
                            }

                            handleClickDeleteIcon(x)
                            handleClose()
                        }}
                        autoFocus
                        sx={{
                            p: '1rem',
                            backgroundColor: palette.background.error,
                            color: 'white',
                            '&:hover': { color: palette.background.error },
                        }}
                    >
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}

export default TableUsers
