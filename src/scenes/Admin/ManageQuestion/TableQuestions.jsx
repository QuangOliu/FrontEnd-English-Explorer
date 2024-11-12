import { useTheme } from '@emotion/react'
import EditIcon from '@mui/icons-material/Edit'
import { Box, Checkbox, IconButton, Pagination } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import questionApi from 'api/questionApi'
import StyledTableCell from 'components/StyledTableCell'
import StyledTableRow from 'components/StyledTableRow'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const head = [
    { numeric: true, disablePadding: false, label: 'ID', id: 'id' },
    { numeric: true, disablePadding: false, label: 'Question', id: 'question' },
    { numeric: true, disablePadding: false, label: 'Skill', id: 'skill' },
    { numeric: true, disablePadding: false, label: 'Level', id: 'level' },
]

function TableQuestions({ btn, submitDelete }) {
    const [data, setData] = useState([])
    const [selected, setSelected] = useState([])
    const [open, setOpen] = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [pageSize] = useState(10)

    const navigate = useNavigate()
    const theme = useTheme()
    const { palette } = useTheme()

    // Fetch data when component mounts or currentPage changes
    useEffect(() => {
        questionApi
            .getQuestionsPage(currentPage, pageSize)
            .then((result) => {
                setData(result.content)
                setTotalPages(result.totalPages) // Set total pages from response
            })
            .catch((err) => {
                console.log(err)
            })
    }, [currentPage, pageSize])

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n.id)
            setSelected(newSelected)
        } else {
            setSelected([])
        }
    }

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id)
        let newSelected = []

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id)
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

    const handlePageChange = (event, value) => {
        setCurrentPage(value)
    }

    return (
        <Box>
            <TableContainer>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">
                                <Checkbox
                                    color="primary"
                                    checked={
                                        selected.length > 0 &&
                                        selected.length === data.length
                                    }
                                    onChange={handleSelectAllClick}
                                />
                            </StyledTableCell>
                            {head.map((item) => (
                                <StyledTableCell key={item.id} align="left">
                                    {item.label}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell align="center" colSpan={2}>
                                Action
                            </StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell align="left">
                                    <Checkbox
                                        color="primary"
                                        checked={selected.includes(row.id)}
                                        onChange={(event) =>
                                            handleClick(event, row.id)
                                        }
                                    />
                                </StyledTableCell>
                                {head.map((column) => (
                                    <StyledTableCell key={column.id}>
                                        {row[column.id]}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell align="left">
                                    <IconButton
                                        onClick={() => {
                                            navigate(
                                                `/questions/edit/${row.id}`
                                            )
                                        }}
                                        size="large"
                                        sx={{
                                            m: '2rem 0',
                                            p: '1rem',
                                            backgroundColor:
                                                palette.primary.main,
                                            color: 'white',
                                            '&:hover': {
                                                color: palette.primary.main,
                                            },
                                        }}
                                    >
                                        <EditIcon fontSize="inherit" />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>

                {/* Pagination Component */}
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    variant="outlined"
                    sx={{ m: 2 }}
                />
            </TableContainer>
        </Box>
    )
}

export default TableQuestions
