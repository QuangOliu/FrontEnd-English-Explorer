import React, { useEffect, useState } from 'react';
import {
    Divider,
    Grid,
    List,
    ListItem,
    Typography,
    useTheme,
    CircularProgress,
    Chip,
} from '@mui/material';
import toast from 'react-hot-toast'; // For displaying error messages
import transactionApi from 'api/transactionApi'; // Importing the transaction API

const TransactionsHistory = () => {
    const theme = useTheme(); // Hook to access theme
    const altBackground = theme.palette.background.alt; // Background color from the theme
    const [transactions, setTransactions] = useState([]); // State to store transactions
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        // Fetch transaction history from the server
        const fetchTransactions = async () => {
            try {
                const response = await transactionApi.getTransactionsPage(1, 10); // Fetching the first page of transactions (change size if needed)
                setTransactions(response.content); // Update the state with the fetched transactions
            } catch (err) {
                setError('Failed to fetch transaction history'); // Set error state
                toast.error('Failed to fetch transaction history'); // Show error message
            } finally {
                setLoading(false); // Set loading to false after request completion
            }
        };

        fetchTransactions(); // Call the function to fetch transactions
    }, []);

    // Function to format the amount with commas
    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-US').format(amount);
    };

    if (loading) {
        return (
            <Grid
                item
                xs={12}
                md={6}
                sx={{
                    bgcolor: altBackground,
                    p: 3,
                    overflowY: 'auto',
                    textAlign: 'center',
                }}
            >
                <CircularProgress />{' '}
                {/* Display loading spinner while fetching data */}
            </Grid>
        );
    }

    return (
        <Grid
            item
            xs={12}
            md={6}
            sx={{
                bgcolor: altBackground,
                p: 3,
                overflowY: 'auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Transaction History
            </Typography>

            {error ? (
                <Typography variant="body1" color="error">
                    {error} {/* Display error message if there is any */}
                </Typography>
            ) : (
                <List>
                    {transactions.length > 0 ? (
                        transactions.map((transaction) => {
                            // Determine color based on amount
                            const amountColor = transaction.amount >= 0 ? 'green' : 'red';

                            // Format amount with commas
                            const formattedAmount = formatAmount(transaction.amount);

                            // Determine status color
                            let statusColor = 'text.secondary'; // Default to secondary color
                            if (transaction.status === 'SUCCESS') {
                                statusColor = 'green';
                            } else if (transaction.status === 'FAILED') {
                                statusColor = 'red';
                            } else if (transaction.status === 'PENDING') {
                                statusColor = 'orange';
                            }

                            return (
                                <React.Fragment key={transaction.id}>
                                    <ListItem
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <Typography variant="body1">
                                            #{transaction.id}:{' '}
                                            <Typography
                                                component="span"
                                                sx={{ color: amountColor }}
                                            >
                                                {formattedAmount} VND
                                            </Typography>
                                        </Typography>
                                        <Chip
                                            label={transaction.status} // Display status as the label
                                            sx={{
                                                color: 'white', // Set text color for the tag
                                                backgroundColor: `${statusColor}`, // Optional: Add a translucent background color
                                                ml: 2, // Space between the amount/ID and the status tag
                                                height: '24px', // Adjust tag height
                                                fontWeight: 'bold', // Optional: Make text bold
                                                borderRadius: '16px', // Optional: Rounded corners for the tag
                                            }}
                                        />
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            );
                        })
                    ) : (
                        <Typography variant="body1" color="text.secondary">
                            No transactions found.
                        </Typography>
                    )}
                </List>
            )}
        </Grid>
    );
};

export default TransactionsHistory;
