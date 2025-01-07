import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PaymentFailure = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/payment'); // Chuyển hướng về trang thanh toán
  };

  const handleBackToHome = () => {
    navigate('/'); // Chuyển hướng về trang chủ
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        textAlign: 'center',
      }}
    >
      <Card sx={{ width: '100%', padding: 2 }}>
        <CardContent>
          <Box sx={{ mb: 2 }}>
            <ErrorOutlineIcon
              color="error"
              sx={{ fontSize: 80, marginBottom: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Payment Failed
            </Typography>
            <Typography variant="body1">
              Unfortunately, your payment could not be processed. Please try
              again later or contact support for assistance.
            </Typography>
          </Box>
        </CardContent>
        <CardActions sx={{ justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleRetryPayment}
            sx={{ marginRight: 1 }}
          >
            Retry Payment
          </Button>
          <Button
            variant="outlined"
            color="secondary"
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

export default PaymentFailure;
