import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import ClassroomCard from './ClassroomCard'
import classroomApi from 'api/classroomApi'
import { useNavigate } from 'react-router-dom'
import { Typography } from '@mui/material'

export default function ClassroomPage() {
    const navigate = useNavigate()
    const [classrooms, setClassrooms] = useState([])

    useEffect(() => {
        classroomApi
            .getClassroomsPage()
            .then((result) => {
                setClassrooms(result.content)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    return (
        <Grid container spacing={3}>
            {classrooms?.length > 0 ? (
                classrooms.map((classroom) => (
                    <Grid item xs={4} sm={3} md={3} key={classroom.id}>
                        <ClassroomCard classroom={classroom} />
                    </Grid>
                ))
            ) : (
                <Grid item xs={12}>
                    <Typography
                        variant="h3"
                        textAlign="left"
                        sx={{ mb: '15px' }}
                    >
                        <b>There are no classes.</b>
                    </Typography>
                </Grid>
            )}
        </Grid>
    )
}
