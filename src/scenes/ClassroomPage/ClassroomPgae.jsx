import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid'
import ClassroomCard from './ClassroomCard'
import classroomApi from 'api/classroomApi'
import { useNavigate } from 'react-router-dom'
import { Typography, CircularProgress, Box } from '@mui/material'

export default function ClassroomPage() {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [classrooms, setClassrooms] = useState([])

    useEffect(() => {
        classroomApi
            .getClassroomsDtoPage()
            .then((result) => {
                setClassrooms(result.content)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false) // Ensure loading is false even if an error occurs
            })
    }, [])

    return (
        <Grid container spacing={3}>
            {loading ? (
                // Show loading spinner while data is being fetched
                <Grid item xs={12} textAlign="center">
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <CircularProgress />
                    </Box>
                </Grid>
            ) : classrooms?.length > 0 ? (
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
