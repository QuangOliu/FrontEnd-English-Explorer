import { useTheme } from "@emotion/react";
import { FavoriteBorderOutlined, FavoriteOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, IconButton, Typography } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import productApi from "api/productApi";
import ModalGlobal from "components/ModalGlobal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Aleart from "scenes/global/Aleart";
import Item from "../../components/Item";
import { addToCart } from "../../state";
import { shades } from "../../theme";
import Review from "./Review";
import ListComment from "./ListComment";

const ProductDetail = () => {
  const { palette } = useTheme();
  const { productId } = useParams();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("description");
  const [count, setCount] = useState(1);
  const [item, setItem] = useState();
  const [comments, setComments] = useState([]);
  const [isLiked, setIsLiked] = useState(true);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const items = useSelector((state) => state.items);
  const isAuth = Boolean(useSelector((state) => state.token));
  const userId = useSelector((state) => state.user?._id);

  const patchLike = () => {
    if (isAuth) {
      productApi
        .pathLike(productId)
        .then((result) => {
          setIsLiked(Boolean(result?.likes[userId]));
        })
        .catch((err) => {});
    }
  };

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((result) => {
        setItem(result);
        setComments(result.comments);
        setIsLiked(Boolean(result?.likes[userId]));
      })
      .catch((err) => {});
  }, [productId, userId]);

  return (
    <Box>
      <Box m='80px auto'>
        <Box display='flex' flexWrap='wrap' columnGap='40px'>
          {/* IMAGES */}
          <Box flex='1 1 40%' mb='40px'>
            <img alt={item?.name} width='100%' height='100%' src={`${process.env.REACT_APP_BASE_URL}assets/${item?.images[0]}`} style={{ objectFit: "contain" }} />
          </Box>

          {/* ACTIONS */}
          <Box flex='1 1 50%' mb='40px'>
            <Box display='flex' justifyContent='space-between'>
              <Box
                onClick={() => {
                  navigate("/");
                }}
                sx={{ "&:hover": { color: palette.primary.main, cursor: "pointer" } }}
              >
                Home/Item
              </Box>
              <Box
                onClick={() => {
                  navigate("/checkout");
                }}
                sx={{ "&:hover": { color: palette.primary.main, cursor: "pointer" } }}
              >
                Prev Next
              </Box>
            </Box>

            <Box m='65px 0 25px 0'>
              <Typography variant='h3'>{item?.name}</Typography>
              <Typography>Price: ${item?.price}</Typography>
              <Typography>Quantity: {item?.quantity}</Typography>
              <Typography>Sales: {item?.sales}</Typography>
              <Typography sx={{ mt: "20px" }}>{item?.longDescription}</Typography>
            </Box>

            <Box display='flex' alignItems='center' minHeight='50px'>
              <Box display='flex' alignItems='center' border={`1.5px solid ${shades.neutral[300]}`} mr='20px' p='2px 5px'>
                <IconButton disabled={item?.quantity < 0 || count > item?.quantity} onClick={() => setCount(Math.max(count - 1, 0))}>
                  <RemoveIcon />
                </IconButton>
                <Typography sx={{ p: "0 5px" }}>{count}</Typography>
                <IconButton disabled={item?.quantity < 0 || count > item?.quantity} onClick={() => setCount(count + 1)}>
                  <AddIcon />
                </IconButton>
              </Box>
              <Button
                fullWidth
                disabled={item?.quantity < 0 || count > item?.quantity}
                sx={{
                  m: "1rem 0",
                  p: "1rem",
                  backgroundColor: palette.primary.main,
                  color: palette.background.alt,
                  "&:hover": { color: palette.primary.main },
                }}
                onClick={() => {
                  if (item.quantity > 0 && count <= item.quantity) {
                    setOpen(true);
                    if (isAuth) {
                      dispatch(addToCart({ item: { ...item, count } }));
                    }
                  }
                }}
              >
                ADD TO CART
              </Button>
            </Box>
            <Box cursor='pointer'>
              <Box
                m='20px 0 5px 0'
                display='flex'
                alignItems={"center"}
                onClick={() => {
                  if (isAuth) {
                    patchLike();
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {" "}
                <IconButton>{isLiked ? <FavoriteOutlined sx={{ color: "red" }} /> : <FavoriteBorderOutlined />}</IconButton>
                <Typography sx={{ ml: "5px", textAlign: "center" }}>ADD TO WISHLIST</Typography>
              </Box>
              <Typography>CATEGORIES: {item?.category}</Typography>
            </Box>
          </Box>
        </Box>

        {/* INFORMATION */}
        <Box m='20px 0'>
          <Tabs value={value} onChange={handleChange}>
            <Tab label='DESCRIPTION' value='description' />
            <Tab label='COMMENTS' value='reviews' />
          </Tabs>
        </Box>
        <Box display='flex' flexWrap='wrap' gap='15px'>
          {value === "description" && <div>{item?.longDescription}</div>}
          {value === "reviews" && (
            <Box width={"100%"}>
              <ListComment comments={comments} />
              <Box height={"20px"} />
              <Review productId={productId} setComments={setComments} />
            </Box>
          )}
        </Box>

        {/* RELATED ITEMS */}
        <Box mt='50px' width='100%'>
          <Typography variant='h3' fontWeight='bold'>
            Related Products
          </Typography>
          <Box mt='20px' display='flex' flexWrap='wrap' columnGap='1.33%' justifyContent='space-between'>
            {items.slice(0, 4).map((item, i) => (
              <Item key={`${item.name}-${i}`} item={item} />
            ))}
          </Box>
        </Box>
      </Box>
      {isAuth ? (
        <Aleart title={"Success"} messsage={"Add To Cart Succesfully"} open={open} setOpen={setOpen} onClick={handleClose} />
      ) : (
        <ModalGlobal open={open} setOpen={setOpen} title={"Vui lòng đăng nhập"} message={"Bạn cần đăng nhập để thực hiện chức năng này"} btn={{ lable: "Đăng nhập", url: "/login" }} />
      )}
    </Box>
  );
};

export default ProductDetail;
