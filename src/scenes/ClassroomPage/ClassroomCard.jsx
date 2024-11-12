import { useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import CardActionArea from '@mui/material/CardActionArea'
import CardActions from '@mui/material/CardActions'
import { useNavigate } from 'react-router-dom'

export default function ClassroomCard({ classroom }) {
    const { id, name, description } = classroom
    const [displayImage, setDisplayImage] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        setDisplayImage('https://picsum.photos/seed/picsum/200/300')
    }, [])

    const handleClick = () => {
        navigate(`/classrooms/${id}`)
    }
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="140"
                    image={displayImage}
                    alt={name}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {name}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary' }}
                    >
                        {description}
                    </Typography>
                </CardContent>
            </CardActionArea>
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                        handleClick()
                    }}
                >
                    Tham gia
                </Button>
            </CardActions>
        </Card>
    )
}
