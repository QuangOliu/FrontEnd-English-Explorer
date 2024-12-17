import { useTheme } from "@emotion/react";
import { Box, Button, CircularProgress, Divider, MenuItem, Select, Step, StepLabel, Stepper, TextField, Typography } from "@mui/material";
import orderApi from "api/orderApi";
import FlexBetween from "components/FlexBetween";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Aleart from "scenes/global/Aleart";
import { setCheckOut } from "state";
import * as yup from "yup";
import { shades } from "../../theme";
import productApi from "api/productApi";
import authApi from "api/authApi";

const Checkout = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [loadding, setLoadding] = useState(false);

  const { palette } = useTheme();

  const navigate = useNavigate();

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (cart.length) {
      values["items"] = cart;
      values["userId"] = user._id;

      try {
        const formData = JSON.stringify(values);
        const formData2 = {
          cart: cart
        }
        const [orderResponse, productResponse] = await Promise.all([orderApi.addOrder(formData), productApi.updateQuantityProduct(JSON.stringify(formData2))]);

        setOpen(true);
        setLoadding(true);
        onSubmitProps.resetForm();
        setTimeout(() => {
          setLoadding(false);
          dispatch(setCheckOut());
          navigate("/");
        }, 750);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Bạn chưa thêm sản phẩm nào");
    }
  };

  const totalPrice = cart.reduce((total, item) => {
    return total + item.count * item.price;
  }, 0);

  const initialValues = {
    items: [],
    userId: "",
    name: "",
    address: "",
    phoneNumber: "",
    shipment:''
  };

  const checkoutSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    address: yup.string().required("Address is required"),
    phoneNumber: yup.string().required("Phone Number is required"),
  });

  return (
    <Box>
      <Aleart title={"Success"} messsage={"You have successfully made an Order — Congrats on Making your Purchase"} open={open} setOpen={setOpen} />
      {loadding === false ? (
        cart.length > 0 ? (
          <Box m='100px auto'>
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
                        </FlexBetween>
                        <Typography>{item.shortDescription}</Typography>
                        <FlexBetween m='15px 0'>
                          <Box display='flex' alignItems='center'>
                            <Typography>Quantity: {item.count}</Typography>
                          </Box>
                          <Typography fontWeight='bold'>${item.price}</Typography>
                        </FlexBetween>
                      </Box>
                    </FlexBetween>
                    <Divider />
                  </Box>
                );
              })}

              <FlexBetween m='20px 0'>
                <Typography fontWeight='bold'>SUBTOTAL</Typography>
                <Typography fontWeight='bold'>{totalPrice} VND</Typography>
              </FlexBetween>
            </Box>
            <Stepper activeStep={1} sx={{ m: "20px 0" }}>
              <Step>
                <StepLabel>Billing</StepLabel>
              </Step>
              <Step>
                <StepLabel>Payment</StepLabel>
              </Step>
            </Stepper>
            <Box>
              <Formik onSubmit={handleFormSubmit} initialValues={initialValues} validationSchema={checkoutSchema}>
                {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue }) => (
                  <form onSubmit={handleSubmit}>
                    <Box m='30px 0'>
                      {/* CONTACT INFO */}
                      <Box>
                        <Typography sx={{ mb: "15px" }} fontSize='18px'></Typography>
                        <TextField
                          fullWidth
                          type='text'
                          label='Phone Number'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.phoneNumber}
                          name='phoneNumber'
                          error={!!touched.phoneNumber && !!errors.phoneNumber}
                          helperText={touched.phoneNumber && errors.phoneNumber}
                          sx={{ gridColumn: "span 4", mb: "10px" }}
                        />
                        <TextField
                          fullWidth
                          type='text'
                          label='Name'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.name}
                          name='name'
                          error={!!touched.name && !!errors.name}
                          helperText={touched.name && errors.name}
                          sx={{ gridColumn: "span 4", mb: "10px" }}
                        />
                        <TextField
                          fullWidth
                          type='text'
                          label='Address'
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.address}
                          name='address'
                          error={!!touched.address && !!errors.address}
                          helperText={touched.address && errors.address}
                          sx={{ gridColumn: "span 4", mb: "10px" }}
                        />
                      </Box>
                    </Box>
                    Shipment
                    <br></br>
                    <Select name='shipment' value={values.shipment} onChange={handleChange} label='Select an option' className="w-200">
                      <MenuItem value="nhanh">
                        Nhanh
                      </MenuItem>
                      <MenuItem value="cod">
                        Tiết kiệm
                      </MenuItem>
                    </Select>
                    <Box display='flex' justifyContent='space-between' gap='50px'>
                      <Button
                        fullWidth
                        type='submit'
                        color='primary'
                        variant='contained'
                        sx={{
                          backgroundColor: shades.primary[400],
                          boxShadow: "none",
                          color: "white",
                          borderRadius: 0,
                          padding: "15px 40px",
                        }}
                      >
                        Place Order
                      </Button>
                    </Box>
                  </form>
                )}
              </Formik>
            </Box>
          </Box>
        ) : (
          <Box m='100px auto'>
            <Typography fontWeight='500' variant='h5' sx={{ mb: "1.5rem" }}>
              Bạn chưa có sản phẩm nào trong cửa hàng <br />
              Hãy cùng trải nghiệm những sản phẩm của chúng tôi
            </Typography>
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
              }}
            >
              Thêm sản phẩm ngay
            </Button>
          </Box>
        )
      ) : (
        <Box m='100px auto' sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CircularProgress color='inherit' />
        </Box>
      )}
    </Box>
  );
};

export default Checkout;
