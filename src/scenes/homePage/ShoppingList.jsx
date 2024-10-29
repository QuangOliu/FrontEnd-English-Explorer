import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import useMediaQuery from '@mui/material/useMediaQuery'
import productApi from 'api/productApi'
import { useEffect, useState } from 'react'
import { shades } from '../../theme'
import Item from '../../components/Item'
import { useDispatch } from 'react-redux'
import { setProducts } from 'state'

const ShoppingList = () => {
    const [value, setValue] = useState('all')
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const breakPoint = useMediaQuery('(min-width: 1000px)')
    const dispatch = useDispatch()

    useEffect(() => {
        productApi
            .getAllProduct()
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
    }
    const topRatedItems = items.filter((item) => item.category === 'spring')
    const newArrivalsItems = items.filter(
        (item) => item.category === 'newArrivals'
    )
    const bestSellersItems = items.filter((item) => item.category === 'fall')

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
                    gridTemplateColumns="repeat(auto-fill, 300px)"
                    justifyContent="space-around"
                    rowGap="20px"
                    columnGap="1.33%"
                >
                    {value === 'all' &&
                        items.map((item) => (
                            <Item
                                item={item}
                                key={`${item.name}-${item._id}`}
                            />
                        ))}
                    {value === 'newArrivals' &&
                        newArrivalsItems.map((item) => (
                            <Item item={item} key={`newArrivals-${item._id}`} />
                        ))}
                    {value === 'bestSellers' &&
                        bestSellersItems.map((item) => (
                            <Item item={item} key={`bestSellers-${item._id}`} />
                        ))}
                    {value === 'topRated' &&
                        topRatedItems.map((item) => (
                            <Item item={item} key={`topRated-${item._id}`} />
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
