import { useState, useEffect } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import { useNavigate } from 'react-router-dom';
import classmemnerApi from 'api/classmember';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import classroomApi from 'api/classroomApi';
import toast from 'react-hot-toast';
import { useTheme } from '@emotion/react';

export default function ClassroomCard({ classroom }) {
  const { id, name, description, cost } = classroom;
  const [displayImage, setDisplayImage] = useState('');
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openInsufficientBalance, setOpenInsufficientBalance] = useState(false);

  const theme = useTheme();

  const { palette } = useTheme();
  const [openJoinDialog, setOpenJoinDialog] = useState(false); // Dialog for join confirmation

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseInsufficientBalance = () => {
    setOpenInsufficientBalance(false);
  };

  const handleNavigateToWallet = () => {
    navigate('/wallet');
  };

  const handleJoin = () => {
    // API call to join the class
    let data = { classroom: { id } };
    classmemnerApi
      .create(data)
      .then((result) => {
        console.log(result);
        toast.success('You have successfully joined the class!');
        classroom.member = true; // Update the member status
        setOpenJoinDialog(false); // Close dialog after successful join
      })
      .catch((err) => {
        console.log(err);
        toast.error('Failed to join the class!');
        setOpenJoinDialog(false); // Close dialog even if there's an error
      });
  };

  useEffect(() => {
    setDisplayImage(`https://picsum.photos/536/354?random=${id}`);
  }, [id]);

  const handleBuy = () => {
    classroomApi
      .payment(id)
      .then((response) => {
        if (response.code === 200) {
          toast.success(response.message || 'Payment successful!');

          classroom.member = true; // Update the member status
          setOpen(false);
        } else {
          console.error('Payment failed:', response);
          toast.error(response.message || 'Payment failed!');
        }
      })
      .catch((error) => {
        if (error.response) {
          if (
            error.response.data.code === 400 &&
            error.response.data.message === 'Insufficient balance'
          ) {
            toast.error(error.response.data.message || 'Payment failed!');
            setOpenInsufficientBalance(true);
          } else {
            console.error('Error during payment:', error);
            toast.error('An error occurred during the payment process!');
          }
        } else {
          console.error('Error setting up request:', error);
          toast.error('An error occurred while setting up the request.');
        }
      });
  };

  const handleClickCard = () => {
    if (classroom?.member) {
      navigate(`/classrooms/${classroom?.id}`);
    } else {
      handleClickJoin();
      // navigate(`/classrooms/introduction/${classroom?.id}`);
    }
  };
  const handleClickJoin = () => {
    setOpenJoinDialog(true); // Show join confirmation dialog
  };

  return (
    <>
      <Card
        sx={{
          maxWidth: 345,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
        }}
      >
        <CardActionArea
          onClick={() => {
            handleClickCard();
          }}
        >
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
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              {description.length > 30
                ? `${description.substring(0, 30)}...`
                : description}
            </Typography>
            {cost === 0 ? (
              <Typography
                variant="body2"
                sx={{ color: 'green', fontWeight: 'bold' }}
              >
                Miễn phí
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ color: 'red' }}>
                Price:{' '}
                <Typography
                  variant="span"
                  sx={{ color: 'red', fontWeight: 'bold' }}
                >
                  {new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND',
                  }).format(cost)}
                </Typography>
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        <CardActions>
          {classroom?.member ? (
            <Typography variant="body2" color="text.secondary">
              Already Joined
            </Typography>
          ) : cost === 0 ? (
            <Button
              size="small"
              color="primary"
              onClick={handleClickJoin}
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
            >
              Join
            </Button>
          ) : (
            <Button
              size="small"
              color="primary"
              onClick={handleClickOpen}
              sx={{
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                '&:hover': { color: palette.primary.main },
              }}
            >
              Buy
            </Button>
          )}
        </CardActions>
      </Card>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {'Buy course: ' + name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are purchasing the course "{name}". The price is{' '}
            <strong>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
              }).format(cost)}
            </strong>
            . Please confirm to proceed with payment.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            sx={{
              backgroundColor: palette.primary.main,
              color: palette.background.alt,
              '&:hover': { color: palette.primary.main },
            }}
            onClick={handleBuy}
            autoFocus
          >
            Pay{' '}
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(cost)}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openInsufficientBalance}
        onClose={handleCloseInsufficientBalance}
        aria-labelledby="insufficient-balance-title"
        aria-describedby="insufficient-balance-description"
      >
        <DialogTitle id="insufficient-balance-title">
          {'Insufficient balance'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="insufficient-balance-description">
            You do not have enough balance in your wallet to complete this
            transaction. Would you like to go to the wallet page to top up?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseInsufficientBalance}>Cancel</Button>
          <Button onClick={handleNavigateToWallet} autoFocus>
            Go to Wallet
          </Button>
        </DialogActions>
      </Dialog>

      {/* Join Confirmation Dialog */}
      <Dialog
        open={openJoinDialog}
        onClose={() => setOpenJoinDialog(false)}
        aria-labelledby="join-confirmation-title"
        aria-describedby="join-confirmation-description"
      >
        <DialogTitle id="join-confirmation-title">
          {'Confirm to join the class: ' + name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="join-confirmation-description">
            Are you sure you want to join the class "{name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenJoinDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleJoin} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
