import { Bookmark, Favorite, Share } from '@mui/icons-material'
import { Button, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import productApi from 'api/productApi'
import QuestionDetail from 'components/QuestionDetail'
import { useEffect, useState } from 'react'
import { shades } from '../../theme'

const ShoppingList = () => {
    const [value, setValue] = useState('all')
    const [items, setItems] = useState([])
    const [indexQuestion, setIndexQuestion] = useState(0)
    const [loading, setLoading] = useState(true)
    const breakPoint = useMediaQuery('(min-width: 1000px)')

    useEffect(() => {
        productApi
            .getAllProduct()
            .then((result) => {
                setItems(result)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    const handleNextQuestion = () => {
        setIndexQuestion((prevIndex) => (prevIndex + 1) % items.length)
    }

    const handlePreviousQuestion = () => {
        setIndexQuestion((prevIndex) => 
            prevIndex === 0 ? items.length - 1 : prevIndex - 1
        )
    }

    return (
        <Box margin="80px auto">
            <Typography variant="h3" textAlign="center">
                Our Featured <b>Products</b>
            </Typography>

            <Tabs
                textColor="primary"
                indicatorColor="primary"
                value={value}
                onChange={handleChange}
                centered
                TabIndicatorProps={{
                    sx: { display: breakPoint ? 'block' : 'none' },
                }}
                sx={{
                    m: '25px',
                    '& .MuiTabs-flexContainer': {
                        flexWrap: 'wrap',
                    },
                }}
            >
                <Tab label="ALL" value="all" />
                <Tab label="NEW ARRIVALS" value="newArrivals" />
                <Tab label="Fall" value="bestSellers" />
                <Tab label="Spring" value="topRated" />
            </Tabs>

            {!loading && (
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="1fr auto"
                    gap="20px"
                >
                    {/* Question Detail */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <QuestionDetail questionProp={items[indexQuestion]} />
                        <Box display="flex" justifyContent="space-between" width="100%" mt={2}>
                            <Button variant="contained" onClick={handlePreviousQuestion}>
                                Previous
                            </Button>
                            <Button variant="contained" onClick={handleNextQuestion}>
                                Next
                            </Button>
                        </Box>
                    </Box>

                    {/* Action Buttons */}
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <IconButton color="primary">
                            <Favorite />
                        </IconButton>
                        <IconButton color="primary">
                            <Bookmark />
                        </IconButton>
                        <IconButton color="primary">
                            <Share />
                        </IconButton>
                    </Box>
                </Box>
            )}

            {loading && (
                <Typography color={shades.primary[300]}>Loading...</Typography>
            )}
        </Box>
    )
}

export default ShoppingList
