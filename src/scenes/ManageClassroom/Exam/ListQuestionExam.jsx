import { Add, Delete, Edit } from '@mui/icons-material'
import {
    Button,
    Grid,
    Icon,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useFormikContext } from 'formik'
import { useEffect, useState } from 'react'
import QuestionPopup from './QuestionPopup'

export default function ListQuestionExam() {
    const { values, setFieldValue } = useFormikContext()
    const [openEditQuestion, setOpenEditQuestion] = useState(null)

    // Định nghĩa cột
    const columns = [
        { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 100 },
        { field: 'question', headerName: 'Question', flex: 2, minWidth: 200 },
        { field: 'skill', headerName: 'Skill', flex: 1, minWidth: 150 },
        { field: 'level', headerName: 'Level', flex: 1, minWidth: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 0.8,
            sortable: false,
            minWidth: 100,
            renderCell: (rowData) => {
                return (
                    <MaterialButton
                        item={rowData}
                        onSelect={(rowData, method) => {
                            if (method === 0) handleEditQuestion(rowData)
                            else if (method === 1)
                                handleDelete(
                                    values?.questions?.indexOf(rowData)
                                )
                        }}
                    />
                )
            },
        },
    ]

    const handleEditQuestion = (question) => {
        const rowIndex = values?.questions?.indexOf(question)
        const formData = { choises: [], ...question, rowIndex }

        setOpenEditQuestion({
            open: true,
            formData,
            handleClose: () => setOpenEditQuestion(null),
            handleSubmit: (questionvalues) => {
                console.log(questionvalues)
                let newList = [...values.questions]
                if (rowIndex === -1 || rowIndex === undefined) {
                    newList.push(questionvalues)
                } else {
                    newList[rowIndex] = questionvalues
                }
                setFieldValue('questions', newList)
                setOpenEditQuestion(null)
            },
        })
    }

    const handleDelete = (index) => {
        const updatedQuestions = values.questions.filter((_, i) => i !== index)
        setFieldValue('questions', updatedQuestions)
    }

    return (
        <>
            <Button
                variant="outlined"
                sx={{ marginBottom: '8px' }}
                startIcon={<Add />}
                onClick={() => handleEditQuestion(null)} // Truyền null khi thêm mới
            >
                Thêm mới câu hỏi
            </Button>
            <Grid item xl={12} md={12}>
                {/* Hiển thị bảng câu hỏi */}
                <QuestionTable
                    questions={values?.questions || []}
                    columns={columns}
                    onEdit={handleEditQuestion}
                    onDelete={handleDelete}
                />
            </Grid>
            {openEditQuestion?.open && <QuestionPopup {...openEditQuestion} />}
        </>
    )
}

function QuestionTable({ questions, columns, onEdit, onDelete }) {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    {columns?.map((col, index) => (
                        <TableCell key={index}>{col.headerName}</TableCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {questions?.map((question, index) => (
                    <TableRow key={index}>
                        {columns?.map((col) => {
                            if (col.field === 'actions') {
                                return (
                                    <TableCell key={col.field}>
                                        <IconButton
                                            size="small"
                                            onClick={() =>
                                                onEdit(question, index)
                                            }
                                        >
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => onDelete(index)}
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                )
                            }
                            return (
                                <TableCell key={col.field}>
                                    {question[col.field]}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

function MaterialButton({ item, onSelect }) {
    return (
        <div>
            <IconButton size="small" onClick={() => onSelect(item, 0)}>
                <Edit />
            </IconButton>
            <IconButton size="small" onClick={() => onSelect(item, 1)}>
                <Delete />
            </IconButton>
        </div>
    )
}
