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
    TextField,
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
import classroomApi from 'api/classroomApi'
import StyledTableCell from 'components/StyledTableCell'
import StyledTableRow from 'components/StyledTableRow'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
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

function TableClassroom({ data, setData, submitDelete }) {
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const [openDelete, setOpenDelete] = useState(false)

    const [selectedOne, setSelectedOne] = useState()
    const [actionAllIn, setActionAllIn] = useState(false)

    const theme = useTheme()
    const [formValues, setFormValues] = useState({
        id: '',
        accessType: '',
        name: '',
        description: '',
    })
    const user = useSelector((state) => state.user)
    const isAdmin = user?.role === 'admin'
    // Bên ngoài hàm TableClassroom
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
        loadData()
    }

    const loadData = () => {
        classroomApi
            .getClassroomsPage()
            .then((result) => {
                setData(result.content)
            })
            .catch((err) => {
                toast.error('Lỗi tải dữ liệu')
            })
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

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormValues((prev) => {
            const updatedValues = { ...prev, [name]: value }
            return updatedValues
        })
    }

    const handleClose = () => {
        setOpen(false)
    }
    const handleCloseDelete = () => {
        setOpenDelete(false)
    }

    const handleConfirmDelete = () => {
        classroomApi.deleteById(formValues?.id).then((result) => {
            toast.success("Xóa thành công")
        }).then(data => {
            loadData();
        }).catch((err) => {
            toast.error("Xóa thất bại")
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log(formValues)
        const newForm = {
            id: formValues?.id,
            name: formValues?.name,
            description: formValues?.description,
            accessType: formValues?.accessType,
        };
        classroomApi
            .create(newForm)
            .then((result) => {
                setFormValues((prevValues) => ({
                    ...prevValues,
                    id: formValues?.id,
                }))

                toast.success('Successfully Create Classtoom!')
                setOpen(false)
            })
            .then((data) => {
                loadData()
            })
            .catch((err) => {
                toast.error('Lỗi tạo classroom')
            })
    }

    const handleClickEdit = (event, entity) => {
        event.preventDefault()
        event.stopPropagation()
        setFormValues(entity)
        setOpen(true)
    }

    const handleClickDelete = (event, entity) => {
        event.preventDefault()
        event.stopPropagation()

        setFormValues(entity)
        setOpenDelete(true)
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
                                    {/* {submitDelete && (
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
                                    )} */}
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
                                            {/* {submitDelete && (
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
                                            )} */}

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
                                                    onClick={(e) => {
                                                        handleClickEdit(e, row)
                                                    }}
                                                    size="large"
                                                    sx={{
                                                        backgroundColor:
                                                            palette.primary
                                                                .main,
                                                        color: 'white',
                                                        marginRight:"8px",
                                                        '&:hover': {
                                                            color: palette
                                                                .primary.main,
                                                        },
                                                    }}
                                                >
                                                    <EditIcon fontSize="inherit" />
                                                </IconButton>

                                                <IconButton
                                                    onClick={(e) => {
                                                        handleClickDelete(
                                                            e,
                                                            row
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
                                                    <DeleteIcon fontSize="inherit" />
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
                <Box width={'100%'} display={'flex'} justifyContent={'end'}>
                    <Button
                        sx={{
                            backgroundColor: palette.primary.main,
                            color: palette.background.alt,
                            '&:hover': { color: palette.primary.main },
                        }}
                        onClick={() => {
                            setFormValues(null);
                            setOpen(true)
                        }}
                    >
                        Thêm classroom mới
                    </Button>
                </Box>
                <Dialog
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        component: 'form',
                        onSubmit: handleSubmit,
                    }}
                >
                    <DialogTitle>{formValues?.id ? "Add " :"Edit "}Classroom</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            To create a new classroom, please fill in the
                            details below.
                        </DialogContentText>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            name="name"
                            label="Classroom Name"
                            value={formValues?.name}
                            onChange={handleChange}
                            fullWidth
                            variant="standard"
                        />
                        <TextField
                            margin="dense"
                            name="description"
                            label="Description"
                            value={formValues?.description}
                            onChange={handleChange}
                            fullWidth
                            variant="standard"
                        />
                        <FormControl
                            fullWidth
                            variant="standard"
                            margin="dense"
                        >
                            <InputLabel id="access-type-label">
                                Access Type
                            </InputLabel>
                            <Select
                                labelId="access-type-label"
                                name="accessType"
                                value={formValues?.accessType}
                                onChange={handleChange}
                            >
                                <MenuItem value="PUBLIC">Public</MenuItem>
                                <MenuItem value="PRIVATE">Private</MenuItem>
                                <MenuItem value="PROTECTED">Protected</MenuItem>
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button type="submit">{formValues?.id ? "Edit " :"Add "} Classroom</Button>
                    </DialogActions>
                </Dialog>
            </Box>

            <Dialog
                open={openDelete}
                onClose={handleCloseDelete}
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
                            handleCloseDelete()
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
                            handleConfirmDelete()
                            handleCloseDelete()
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
