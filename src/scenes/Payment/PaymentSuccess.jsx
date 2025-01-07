import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
  Grid,
  Paper,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import transactionApi from 'api/transactionApi';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState({});
  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('transactionId');

  useEffect(() => {
    transactionApi
      .getById(transactionId)
      .then((result) => {
        setTransaction(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [location, navigate]);

  const handleBackToHome = () => {
    navigate('/'); // Redirect to homepage
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100%',
        textAlign: 'center',
      }}
    >
      <Card sx={{ width: '100%', padding: 2 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <CheckCircleOutlineIcon
              color="success"
              sx={{ fontSize: 80, marginBottom: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Payment Successful!
            </Typography>
            <Typography variant="body1" paragraph>
              Thank you for your payment. Your transaction has been completed
              successfully.
            </Typography>
          </Box>

          {transactionId && (
            <>
              <Paper sx={{ padding: 2, mb: 2, backgroundColor: '#f5f5f5' }}>
                <Typography variant="h6" gutterBottom>
                  Transaction Details
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Transaction ID:
                    </Typography>
                    <Typography variant="body1">
                      <strong>{transactionId}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Amount:
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {transaction.amount} {transaction.wallet?.currency}
                      </strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Status:
                    </Typography>
                    <Typography variant="body1">
                      <strong>{transaction.status}</strong>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="textSecondary">
                      Wallet Balance:
                    </Typography>
                    <Typography variant="body1">
                      <strong>
                        {transaction.wallet?.balance}{' '}
                        {transaction.wallet?.currency}
                      </strong>
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </>
          )}
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleBackToHome}
          >
            Back to Home
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
};

export default PaymentSuccess;
