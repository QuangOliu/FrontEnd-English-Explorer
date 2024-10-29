import { Box, Typography } from "@mui/material";
import orderApi from "api/orderApi";
import MyBarChart from "components/MyBarChart";
import { useEffect, useState } from "react";
// import productApi from '../'

function ManageDashboad() {
  const [data, setData] = useState([]);

  useEffect(() => {
    orderApi
      .thongkedoanhso()
      .then((result) => {
        const formattedResult = [];

        for (let i = 1; i <= 12; i++) {
          const monthName = `Tháng ${i}`;
          const sales = result[monthName];

          formattedResult.push({ name: monthName, ds: sales });
        }

        setData(formattedResult);
      })
      .catch((err) => {});
  }, []);

  return (
    <Box>
      <Typography variant='h3' textAlign='left' sx={{ m: "50px 0" }}>
        <b>Thống kê doanh số của cửa hàng</b>
      </Typography>
      <Box sx={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <MyBarChart data={data} />
      </Box>
    </Box>
  );
}

export default ManageDashboad;
