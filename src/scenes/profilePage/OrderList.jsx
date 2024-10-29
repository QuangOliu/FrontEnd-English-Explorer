import { useTheme } from "@emotion/react";
import { Box, Divider, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useNavigate } from "react-router-dom";

function OrderList({ ordersByStatus }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;

  return (
    <div>
      <Box>
        {ordersByStatus &&
          ordersByStatus.map((item) => {
            const totalPrice = item.items.reduce((total, item) => {
              return total + item.count * item.price;
            }, 0);
            return (
              <Box
                key={`${item._id}`}
                onClick={() => {
                  navigate(`/orders/${item._id}`);
                }}
                sx={{
                  "&:hover": {
                    cursor: "pointer",
                    backgroundColor: neutralLight,
                  },
                }}
              >
                <FlexBetween p='15px 0'>
                  <Box flex='1 1 40%'></Box>
                  <Box flex='1 1 60%'>
                    <FlexBetween>
                      <Typography fontWeight='bold'>{item?.name}</Typography>
                    </FlexBetween>
                    <FlexBetween>
                      <Box display='flex' alignItems='center'>
                        <Typography>
                          Address: <b>{item?.address}</b>
                        </Typography>
                      </Box>
                    </FlexBetween>
                    <Box display='flex' alignItems='center'>
                      <Typography>
                        Phone Number: <b>{item?.phoneNumber}</b>
                      </Typography>
                    </Box>
                    <Box display='flex' alignItems='center'>
                      <FlexBetween>
                        <Typography>
                          SUBTOTAL: <b>{totalPrice} VND</b>
                        </Typography>
                      </FlexBetween>
                    </Box>
                  </Box>
                </FlexBetween>
                <Divider />
              </Box>
            );
          })}
      </Box>
    </div>
  );
}

export default OrderList;
