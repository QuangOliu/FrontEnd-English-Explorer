import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import productApi from 'api/productApi'
import { useEffect, useState } from 'react'
import { shades } from '../../theme'
import Question from '../../components/Question'
import { useDispatch } from 'react-redux'
import { setProducts } from 'state'
import questionApi from 'api/questionApi'

const ShoppingList = () => {
    const [value, setValue] = useState('all')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const breakPoint = useMediaQuery('(min-width: 1000px)')
    const dispatch = useDispatch()

    useEffect(() => {
        questionApi
            .getQuestions()
            .then((result) => {
                setItems(result)
                dispatch(setProducts(result))
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    // const dispatch = useDispatch();

    const handleChange = (event, newValue) => {
        setValue(newValue)
        questionApi
            .getQuestionsByType(newValue)
            .then((result) => {
                setItems(result)
                dispatch(setProducts(result))
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
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
                <Tab label="Explorer" value="all" />
                <Tab label="READING" value="READING" />
                <Tab label="WRITING" value="WRITING" />
                <Tab label="LISTENING" value="LISTENING" />
            </Tabs>
            {!loading && (
                <Box
                    margin="0 auto"
                    display="grid"
                    gridTemplateColumns="repeat(auto-fill, 300px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {items.map((item) => (
                        <Question item={item} key={`${item?.name}-${item?.id}`} />
                    ))}
                </Box>
            )}
            {loading && (
                <Typography color={shades.primary[300]}>Loading...</Typography>
            )}
        </Box>
    )
}

export default ShoppingList
