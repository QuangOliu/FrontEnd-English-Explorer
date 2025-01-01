import React, { useEffect, useState } from 'react'
import {
    Button,
    Grid,
    Typography,
    ToggleButton,
    ToggleButtonGroup,
    Box,
    TextField,
} from '@mui/material'
import { NumericFormat } from 'react-number-format'
import { Formik, Form, Field } from 'formik'
import toast from 'react-hot-toast'
import transactionApi from 'api/transactionApi'
import walletApi from 'api/walletApi' // Import walletApi to fetch user's wallet
import { useTheme } from '@emotion/react'

const MyWallet = () => {
    const [wallet, setWallet] = useState(null) // State to store wallet information
    const [loading, setLoading] = useState(true) // State to check wallet loading status

    const theme = useTheme(); // Hook to access theme
    const altBackground = theme.palette.background.alt; // Background color from theme
    useEffect(() => {
        // Function to fetch user's wallet information
        const fetchWallet = async () => {
            try {
                const res = await walletApi.getMyWallet() // Call API to fetch wallet
                setWallet(res) // Update wallet information
            } catch (error) {
                toast.error('Unable to fetch your wallet') // Handle error if any
            } finally {
                setLoading(false) // Change loading status after request is completed
            }
        }

        fetchWallet() // Call the function to fetch wallet when component mounts
    }, []) // Empty dependency array to only call once when the component mounts

    // Handle quick select amount
    const handleQuickSelect = (setFieldValue, value) => {
        setFieldValue('amount', value) // Update value in Formik
    }

    const handlePayment = (values) => {
        const amount = values.amount.replace(/,/g, '') // Remove commas
        if (parseInt(amount) < 10000) {
            toast.error('Deposit amount must be greater than 10,000 VND')
            return
        }

        transactionApi
            .processPayment(amount)
            .then((res) => {
                if (res) {
                    const paymentUrl = res.paymentUrl
                    console.log(paymentUrl)
                    if (paymentUrl) {
                        // Redirect the user to the payment URL
                        window.location.href = paymentUrl
                    } else {
                        toast.error('No payment URL available')
                    }
                } else {
                    toast.error('Payment failed')
                }
            })
            .catch((error) => {
                toast.error('Payment failed')
            })
    }
     // Logic to determine wallet balance color
    const getBalanceColor = (balance) => {
        if (balance < 100000) {
            return 'red' // Low balance
        } else if (balance < 1000000) {
            return 'orange' // Medium balance
        } else {
            return 'green' // High balance
        }
    }

    return (
        <Grid
            item
            xs={12}
            md={6}
            sx={{
                p: 3,
                borderRight: '1px solid #ddd',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Top Up Wallet
            </Typography>

            {loading ? (
                <Typography variant="h6" color="text.secondary">
                    Loading wallet...
                </Typography>
            ) : wallet ? (
                <Typography
                    variant="h6"
                    color={getBalanceColor(wallet.balance)}
                    gutterBottom
                >
                    Your wallet balance: {' '}
                    <span style={{ fontWeight: 'bold' }}>
                        {wallet.balance.toLocaleString()} VND
                    </span>
                </Typography>
            ) : (
                <Typography variant="h6" color="error" gutterBottom>
                    Wallet not found.
                </Typography>
            )}

            <Formik
                initialValues={{ amount: '' }}
                onSubmit={(values) => {
                    handlePayment(values)
                }}
            >
                {({ setFieldValue, values }) => (
                    <Form>
                        {/* Quick amount selection */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Select quick amount
                            </Typography>
                            <ToggleButtonGroup
                                exclusive
                                value={values.amount}
                                onChange={(e, value) =>
                                    value &&
                                    handleQuickSelect(setFieldValue, value)
                                }
                            >
                                <ToggleButton value="100000">
                                    100,000 VND
                                </ToggleButton>
                                <ToggleButton value="200000">
                                    200,000 VND
                                </ToggleButton>
                                <ToggleButton value="500000">
                                    500,000 VND
                                </ToggleButton>
                            </ToggleButtonGroup>
                        </Box>

                        {/* Enter custom amount */}
                        <Box sx={{ mb: 2, width: '100%' }} width="100%">
                            <Typography variant="h6" gutterBottom>
                                Or enter custom amount
                            </Typography>
                            <Field
                                name="amount"
                                sx={{ width: '100%' }}
                                render={({ field }) => (
                                    <NumericFormat
                                        sx={{ width: '100%' }}
                                        {...field}
                                        thousandSeparator=","
                                        decimalSeparator="."
                                        prefix=""
                                        placeholder="Enter amount (VND)"
                                        customInput={TextField}
                                        onValueChange={(values) => {
                                            setFieldValue(
                                                field.name,
                                                values.value
                                            ) // Update value when changed
                                        }}
                                        value={values.amount} // Display entered value
                                    />
                                )}
                            />
                        </Box>

                        {/* Select payment method (default is VNPay) */}
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Payment Method
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                VNPay (default)
                            </Typography>
                        </Box>

                        {/* Confirm button */}
                        <Box textAlign="center" sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={
                                    !values.amount ||
                                    parseInt(values.amount.replace(/,/g, '')) <
                                        10000
                                } // Disable if amount is less than 10,000
                                type="submit"
                            >
                                Top Up
                            </Button>
                        </Box>
                    </Form>
                )}
            </Formik>
        </Grid>
    )
}

export default MyWallet
