import { useTheme } from "@emotion/react";
import { Box, Divider, Typography } from "@mui/material";
import productApi from "api/productApi";
import FlexBetween from "components/FlexBetween";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TableListItem({ arrIdOfItem }) {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  const theme = useTheme();
  const neutralLight = theme.palette.neutral.light;
  useEffect(() => {
    const listId = arrIdOfItem?.map((i) => i._id);
    productApi
      .getListItem(listId)
      .then((result) => {
        setItems(result.data);
      })
      .catch((err) => {});
  }, [arrIdOfItem]);

  const getItemById = (productId) => {
    return arrIdOfItem.find((item) => item._id === productId);
  };

  return (
    <div>
      {items.map((item) => {
        return (
          <Box sx={{ cursor: "pointer", "&:hover": { backgroundColor: neutralLight } }} key={`${item._id}`} onClick={() => navigate(`/products/${item._id}`)}>
            <FlexBetween p='15px 0'>
              <Box mr={"30px"}>
                <img alt={item?.name} width='123px' height='164px' src={`${process.env.REACT_APP_BASE_URL}assets/${item.images[0]}`} />
              </Box>
              <Box flex='1 1 60%'>
                <FlexBetween mb='5px'>
                  <Typography fontWeight='bold'>{item.name}</Typography>
                </FlexBetween>
                <Typography>{item.shortDescription}</Typography>
                <Box m='15px 0'>
                  <Box display='flex' alignItems='center'>
                    <Typography>Quantity: {getItemById(item._id).count}</Typography>
                  </Box>
                  <Typography fontWeight='bold'>${getItemById(item._id).price}</Typography>
                </Box>
              </Box>
            </FlexBetween>
            <Divider />
          </Box>
        );
      })}
    </div>
  );
}

export default TableListItem;
