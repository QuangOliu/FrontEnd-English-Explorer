import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Aleart from "scenes/global/Aleart";
import { addToCart } from "../state";
import { shades } from "../theme";
import ModalGlobal from "./ModalGlobal";
import "./styles.css";

const Item = ({ item, width }) => {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [count, setCount] = useState(1);
  const [isHovered, setIsHovered] = useState(false);
  const isAuth = Boolean(useSelector((state) => state.token));
  const {
    palette: { neutral },
  } = useTheme();

  const { category, price, name, images, quantity } = item;
  const url = images[0];

  return (
    <Box width={width} mb={"10px"}>
      {isAuth ? (
        <Aleart title={"Appointment"} messsage={"Add To Cart Succesfully"} open={open} setOpen={setOpen} />
      ) : (
        <ModalGlobal open={open} setOpen={setOpen} title={"Vui lòng đăng nhập"} message={"Bạn cần đăng nhập để thực hiện chức năng này"} btn={{ lable: "Đăng nhập", url: "/login" }} />
      )}

      <Box position='relative' onMouseOver={() => setIsHovered(true)} onMouseOut={() => setIsHovered(false)}>
        <Box sx={{ width: "300px", height: "400px" }}>
          <img alt={item.name} width='300px' height='400px' src={`${process.env.REACT_APP_BASE_URL}assets/${url}`} onClick={() => navigate(`/products/${item._id}`)} style={{ cursor: "pointer" }} />
        </Box>
        <Box display={isHovered ? "block" : "none"} position='absolute' bottom='10%' left='0' width='100%' padding='0 5%'>
          <Box display='flex' justifyContent='space-between'>
            <Box display='flex' alignItems='center' backgroundColor={shades.neutral[100]} borderRadius='3px'>
              <IconButton disabled={item.quantity < 0 || count > item.quantity} onClick={() => setCount(Math.max(count - 1, 1))}>
                <RemoveIcon />
              </IconButton>
              <Typography color={shades.primary[300]}>{count}</Typography>
              <IconButton disabled={item.quantity < 0 || count > item.quantity} onClick={() => setCount(Math.min(count + 1, quantity))}>
                <AddIcon />
              </IconButton>
            </Box>
            <Button
              disabled={item.quantity < 0 || count > item.quantity}
              onClick={() => {
                if (item.quantity > 0 && count <= item.quantity) {
                  setOpen(true);
                  if (isAuth) {
                    dispatch(addToCart({ item: { ...item, count } }));
                  }
                }
              }}
              sx={{ backgroundColor: shades.primary[300], color: "white" }}
            >
              Add to Cart
            </Button>
          </Box>
        </Box>
      </Box>

      <Box mt='3px'>
        <Typography variant='subtitle2' color={neutral.dark}>
          {category.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
        </Typography>
        <Typography>{name}</Typography>
        <Typography fontWeight='bold'>${price}</Typography>
      </Box>
    </Box>
  );
};

export default Item;
