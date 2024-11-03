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
    IconButton,
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
import StyledTableCell from 'components/StyledTableCell'
import StyledTableRow from 'components/StyledTableRow'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const head = [
    {
        numeric: true,
        disablePadding: false,
        lable: 'ID',
        id: 'id',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'Name',
        id: 'name',
    },
    {
        numeric: true,
        disablePadding: false,
        lable: 'Access Type',
        id: 'accessType',
    },
]

function TableClassroom({ data, btn, submitDelete }) {
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const [selectedOne, setSelectedOne] = useState()
    const [actionAllIn, setActionAllIn] = useState(false)

    const user = useSelector((state) => state.user)
    const isAdmin = user?.role === 'admin'
    // Bên ngoài hàm TableClassroom

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

    const navigate = useNavigate()

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

    const handleClickRow = (id) => {
        navigate(`/classrooms/${id}`)
    }

    const handleClose = () => {
        setOpen(false)
        setTimeout(() => {
            setActionAllIn(false)
            setSelectedOne()
        }, 250)
    }

    return (
        <Box>
            <Box m="0 auto">
                {submitDelete && (
                    <Toolbar
                        sx={{
                            pl: { sm: 2 },
                            pr: { xs: 1, sm: 1 },
                            ...(selected.length > 0 && {
                                bgcolor: (theme) =>
                                    alpha(
                                        theme.palette.primary.main,
                                        theme.palette.action.activatedOpacity
                                    ),
                            }),
                        }}
                    >
                        {selected.length > 0 ? (
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                color="inherit"
                                variant="subtitle1"
                                component="div"
                            >
                                {selected.length} selected
                            </Typography>
                        ) : (
                            <Typography
                                sx={{ flex: '1 1 100%' }}
                                variant="h6"
                                id="tableTitle"
                                component="div"
                            >
                                Nutrition
                            </Typography>
                        )}

                        {selected.length > 0 ? (
                            <Tooltip title="Delete">
                                <IconButton
                                    onClick={() => {
                                        setActionAllIn(true)
                                        handleClickOpen()
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        ) : (
                            <Tooltip title="Filter list">
                                <IconButton>
                                    <FilterListIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Toolbar>
                )}

                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        {/* Head table */}
                        {head && (
                            <TableHead>
                                <TableRow>
                                    {submitDelete && (
                                        <StyledTableCell align="left">
                                            <Checkbox
                                                color="primary"
                                                sx={{
                                                    backgroundColor: 'white',
                                                }}
                                                indeterminate={
                                                    selected.length > 0 &&
                                                    selected.length <
                                                        data.length
                                                }
                                                checked={
                                                    selected.length > 0 &&
                                                    selected.length ===
                                                        data.length
                                                }
                                                onChange={handleSelectAllClick}
                                                inputProps={{
                                                    'aria-label':
                                                        'select all desserts',
                                                }}
                                            />
                                        </StyledTableCell>
                                    )}
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
                                        <StyledTableRow
                                            key={row.id}
                                            onClick={() => {
                                                handleClickRow(row.id)
                                            }}
                                        >
                                            {submitDelete && (
                                                <StyledTableCell
                                                    align="left"
                                                    onClick={(event) => {
                                                        if (
                                                            row.role !== 'admin'
                                                        )
                                                            handleClickRow(
                                                                event,
                                                                row.id
                                                            )
                                                    }}
                                                >
                                                    <Checkbox
                                                        color="primary"
                                                        sx={{
                                                            backgroundColor:
                                                                'white',
                                                        }}
                                                        checked={isItemSelected}
                                                        disabled={
                                                            row.role === 'admin'
                                                        }
                                                    />
                                                </StyledTableCell>
                                            )}

                                            {head.map((column) => (
                                                <StyledTableCell
                                                    key={column.id}
                                                    align="left"
                                                >
                                                    {row[column.id]}{' '}
                                                    {/* Dynamically access the row data */}
                                                </StyledTableCell>
                                            ))}

                                            <StyledTableCell align="center">
                                                <IconButton
                                                    onClick={() => {
                                                        navigate(
                                                            `/classrooms/edit/${row.id}`
                                                        )
                                                    }}
                                                    size="large"
                                                    sx={{
                                                        m: '2rem 0',
                                                        p: '1rem',
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
                                m: '2rem 0',
                                p: '1rem',
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

export default TableClassroom
