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
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const PaymentInvalid = () => {
  const navigate = useNavigate();

  const handleRetryPayment = () => {
    navigate('/payment'); // Quay lại trang thanh toán để thử lại
  };

  const handleBackToHome = () => {
    navigate('/'); // Quay lại trang chủ
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
            <WarningAmberIcon
              color="warning"
              sx={{ fontSize: 80, marginBottom: 2 }}
            />
            <Typography variant="h4" gutterBottom>
              Invalid Payment
            </Typography>
            <Typography variant="body1">
              There was an issue with your payment. Please check the details and
              try again.
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

export default PaymentInvalid;
