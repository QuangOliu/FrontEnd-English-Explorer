import { Box, Typography } from "@mui/material";
import orderApi from "api/orderApi";
import MyLineChart from "components/MyLineChart";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import productApi from "api/productApi";
// import productApi from '../'
import TableProduct from "scenes/Admin/ManageProduct/TableProduct";

function StatisticalProduct() {
  const [data, setData] = useState([]);
  const [product, setProduct] = useState([]);
  const { productId } = useParams();

  useEffect(() => {
    orderApi
      .thongkeProductId(productId)
      .then((result) => {
        const formattedResult = [];

        for (let i = 1; i <= 12; i++) {
          const monthName = `Tháng ${i}`;
          const sales = result[monthName];

          formattedResult.push({ name: monthName, pr: sales });
        }

        setData(formattedResult);
      })
      .catch((err) => {});
  }, [productId]);

  useEffect(() => {
    productApi
      .getProductById(productId)
      .then((result) => {
        setProduct([{ ...result }]);
        
        setProduct((data) => {
          return data.map((item) => {
            item.linkTo = `/products/${item._id}`;
            // item.linkTo = `/products/${item._id}`;
            return item;
          });
        });
      })
      .catch((err) => {});
  }, [productId]);

  return (
    <Box>
      <Box>
        <TableProduct data={product} />
      </Box>
      <Typography variant='h3' textAlign='left' sx={{ m: "50px 0" }}>
        <b>Thống kê sản phẩm bán được theo từng tháng</b>
      </Typography>
      <Box>
        <MyLineChart data={data} />
      </Box>
    </Box>
  );
}

export default StatisticalProduct;
