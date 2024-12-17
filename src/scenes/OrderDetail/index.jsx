import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Typography, useMediaQuery } from "@mui/material";
import orderApi from "api/orderApi";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import TableListItem from "./TableListItem";
// import TableListItem from "./TableListItem";
import OppositeContentTimeline from "components/Timeline";
import { useTheme } from "@emotion/react";
import { useSelector } from "react-redux";
import authApi from "api/authApi";

const arrStatus = ["Order", "Approved", "Shipping", "Success"];

function OrderDetail() {
  const [data, setData] = useState({});
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({})

  useEffect(() => {
      authApi.getCurrent().then((result) => {
          setUser(result)
      }).catch((err) => {
          console.log(err);
      });
  }, [])
  const isAdmin = user?.role === "admin";

  const { orderId } = useParams();

  const isNonMobile = useMediaQuery("(min-width:600px)");
  const { palette } = useTheme();

  useEffect(() => {
    orderApi
      .getOrderById(orderId)
      .then((result) => {
        setItems(result.data.items);
        setData(result.data);
        console.log(result.data)
      })
      .catch((err) => {});
  }, [orderId]);

  const submitDone = async (selected) => {
    const formData = {
      selected: selected,
    };

    await Promise.all([orderApi.updataStatus(formData)])
      .then(async ([result1]) => {
        console.log(result1);
        const result2 = await orderApi.getOrderById(orderId);
        setData(result2.data);
      })
      .catch((err) => {});
  };

  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Box>
      <Typography variant='h2' textAlign='left' sx={{ mb: "15px" }}>
        <b>Order Detail</b>
      </Typography>

      <Box
        display='grid'
        gap='30px'
        gridTemplateColumns='repeat(4, minmax(0, 1fr))'
        sx={{
          "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
        }}
      >
        <Box sx={{ gridColumn: "span 2" }}>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>Order ID:</strong> <span id='order-id'>{data._id}</span>
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>User ID:</strong> <Link to={`/user/${data.userId}`}>{data.userId}</Link>
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>User Name:</strong> <span id='name'>{data.name}</span>
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>Phone Number:</strong> <span id='phone-number'>{data.phoneNumber}</span>
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>Address:</strong> <span id='address'>{data.address}</span>
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>Total Amount:</strong>
            {items.reduce((total, item) => {
              return total + item.count * item.price;
            }, 0)}{" "}
            VND
          </Typography>
          <Typography sx={{ lineHeight: "1.5", gridColumn: "span 2", textAlign: "left", mb: "20px" }}>
            <strong style={{ minWidth: "150px", display: "block" }}>Status:</strong> <span id='status'>{arrStatus[data.status - 1]}</span>
          </Typography>
        </Box>

        <Box sx={{ gridColumn: "span 2" }}>
          {isAdmin && (
            <Button
              fullWidth
              disabled={data.status === 4}
              sx={{
                m: "1rem 0 0 0",
                p: "1rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              onClick={() => {
                if (data?.status !== 4) setOpen(true);
              }}
            >
              Duyệt
            </Button>
          )}
          <OppositeContentTimeline data={data.statusHistory} />
        </Box>
      </Box>
      <Typography variant='h3' textAlign='left' sx={{ mb: "15px" }}>
        Items:
      </Typography>
      <TableListItem arrIdOfItem={items} />

      <Dialog open={open} onClose={handleClose} aria-labelledby='alert-dialog-title' aria-describedby='alert-dialog-description'>
        <DialogTitle id='alert-dialog-title'>Xác nhận duyệt</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            Bạn có chắc chắn muốn duyệt sản phẩm <strong>{orderId}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label='Hủy'
            onClick={(e) => {
              handleClose();
            }}
            sx={{
              p: "1rem",
            }}
          >
            Hủy
          </Button>
          <Button
            aria-label='delete'
            size='large'
            onClick={() => {
              submitDone([orderId]);
              handleClose();
            }}
            autoFocus
            sx={{
              p: "1rem",
              backgroundColor: palette.primary.main,
              color: "white",
              "&:hover": { color: palette.primary.main },
            }}
          >
            Duyệt
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default OrderDetail;
