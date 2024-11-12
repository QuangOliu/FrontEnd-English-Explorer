import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import ClassroomCard from './ClassroomCard'
import classroomApi from 'api/classroomApi'
import { useNavigate } from 'react-router-dom'

export default function ClassroomPage() {
    const navigate = useNavigate();
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
        <Grid container spacing={3} padding={3}>
            {classrooms.map((classroom) => (
                <Grid item xs={12} sm={6} md={4} key={classroom.id}>
                    <ClassroomCard
                        classroom={classroom}
                    />
                </Grid>
            ))}
        </Grid>
    )
}
