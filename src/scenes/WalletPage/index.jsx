import {
    Grid
} from '@mui/material'
import MyWallet from './MyWallet'
import TransactionsHistory from './TransactionsHistory'

const WalletPage = () => {
    return (
        <Grid container spacing={2} sx={{ height: '100%' }}>
            {/* Phần bên trái */}
            <MyWallet />
            {/* Phần bên phải */}
            <TransactionsHistory />
        </Grid>
    )
}

export default WalletPage
