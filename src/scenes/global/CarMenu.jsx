import { useTheme } from "@emotion/react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Divider, IconButton, Typography } from "@mui/material";
import FlexBetween from "components/FlexBetween";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { decreaseCount, increaseCount, removeFromCart, setIsCartOpen } from "../../state";
import { shades } from "../../theme";

const CartMenu = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const isCartOpen = useSelector((state) => state.isCartOpen);

  const theme = useTheme();
  const { palette } = useTheme();
  const dark = theme.palette.neutral.dark;
  const alt = theme.palette.background.alt;

  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.price;
  }, 0);

  return (
    <Box display={isCartOpen ? "block" : "none"} backgroundColor='rgba(0, 0, 0, 0.4)' position='fixed' zIndex={12} width='100%' height='100%' left='0' top='0' overflow='auto'>
      <Box position='fixed' right='0' bottom='0' width='max(400px, 30%)' height='100%' backgroundColor={alt}>
        <Box padding='30px' overflow='auto' height='100%'>
          {/* HEADER */}
          <FlexBetween mb='15px'>
            <Typography fontWeight='bold' fontSize='clamp(1rem, 2rem, 2.25rem)' color='primary'>
              SHOPPING BAG ({cart.length})
            </Typography>

            <IconButton onClick={() => dispatch(setIsCartOpen({}))}>
              <CloseIcon sx={{ color: dark, fontSize: "25px" }} />
            </IconButton>
          </FlexBetween>

          {/* CART LIST */}
          <Box>
            {cart.map((item) => {
              return (
                <Box key={`${item._id}`}>
                  <FlexBetween p='15px 0'>
                    <Box flex='1 1 40%'>
                      <img alt={item?.name} width='123px' height='164px' src={`${process.env.REACT_APP_BASE_URL}assets/${item.images[0]}`} />
                    </Box>
                    <Box flex='1 1 60%'>
                      <FlexBetween mb='5px'>
                        <Typography fontWeight='bold'>{item.name}</Typography>
                        <IconButton onClick={() => dispatch(removeFromCart({ _id: item._id }))}>
                          <CloseIcon />
                        </IconButton>
                      </FlexBetween>
                      <Typography>{item.shortDescription}</Typography>
                      <FlexBetween m='15px 0'>
                        <Box display='flex' alignItems='center' border={`1.5px solid ${shades.neutral[500]}`}>
                          <IconButton
                            onClick={() => {
                              dispatch(decreaseCount({ _id: item._id }));
                            }}
                          >
                            <RemoveIcon />
                          </IconButton>
                          <Typography>{item.count}</Typography>
                          <IconButton
                            onClick={() => {
                              if (item.count <= item.quantity) {
                                dispatch(increaseCount({ _id: item._id }));
                              }
                            }}
                          >
                            <AddIcon />
                          </IconButton>
                        </Box>
                        <Typography fontWeight='bold'>${item.price}</Typography>
                      </FlexBetween>
                    </Box>
                  </FlexBetween>
                  <Divider />
                </Box>
              );
            })}
          </Box>

          {/* ACTIONS */}
          {cart.length ? (
            <Box m='20px 0'>
              <FlexBetween m='20px 0'>
                <Typography fontWeight='bold'>SUBTOTAL</Typography>
                <Typography fontWeight='bold'>{totalPrice} VND</Typography>
              </FlexBetween>
              <Button
                fullWidth
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
                onClick={() => {
                  navigate("/checkout");
                  dispatch(setIsCartOpen({}));
                }}
              >
                CHECKOUT
              </Button>
            </Box>
          ) : (
            <Box>
              <Box width={"100%"} pt={"15px"} m='15px auto' borderTop={`1px solid ${palette.primary.main}`} backgroundColor={theme.palette.background.alt}>
                <Typography fontWeight='500' textAlign={"center"} variant='h5' sx={{ mb: "1.5rem" }}>
                  Giỏ hàng của bạn trống
                </Typography>
              </Box>
              <Button
                fullWidth
                sx={{
                  m: "2rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
                onClick={() => {
                  navigate("/");
                  dispatch(setIsCartOpen({}));
                }}
              >
                Thêm sản phẩm ngay
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CartMenu;
