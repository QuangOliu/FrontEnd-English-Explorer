import { Add, Delete, Edit } from '@mui/icons-material'
import { Button, Grid, Icon, IconButton } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import { useFormikContext } from 'formik'
import { useState } from 'react'
import QuestionPopup from './QuestionPopup'

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

export default function ListQuestionExam() {
    const { values, setFieldValue } = useFormikContext()
    const [openEditQuestion, setOpenEditQuestion] = useState(null)

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
                            if (method === 0)
                                handleEditQuestion(
                                    rowData,
                                    values.questions.indexOf(rowData?.row)
                                )
                            else if (method === 1)
                                handleDelete(values.questions.indexOf(rowData))
                        }}
                    />
                )
            },
        },
    ]

    const handleEditQuestion = (question, rowIndex) => {
        let listCUrrentQuestions = values?.questions || []
        const formData = { ...question?.row, rowIndex }
        if (!formData?.questionIndex) {
            formData.questionIndex = listCUrrentQuestions?.length + 1
        }
        console.log(formData);
        setOpenEditQuestion({
            open: true,
            formData,
            handleClose: () => setOpenEditQuestion(null),
            handleSubmit: (questionvalues) => {
                console.log({questionvalues})
                if (rowIndex === undefined) {
                    setFieldValue('questions', [
                        ...listCUrrentQuestions,
                        questionvalues,
                    ])
                } else {
                    const newList = listCUrrentQuestions?.reduce(
                        (acc, item, index) => {
                            if (index === rowIndex) {
                                return [...acc, questionvalues]
                            }
                            return [...acc, item]
                        },
                        []
                    )
                    setFieldValue('questions', newList)
                }
                // đóng popup
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
                onClick={() => handleEditQuestion(null)}
            >
                Thêm mới câu hỏi
            </Button>
            <Grid item md={12}>
                <DataGrid rows={values?.questions || []} columns={columns} />
            </Grid>
            {openEditQuestion?.open && <QuestionPopup {...openEditQuestion} />}
        </>
    )
}
