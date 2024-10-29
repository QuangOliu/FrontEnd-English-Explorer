import { Box, Typography } from "@mui/material";
import orderApi from "api/orderApi";
import { useEffect, useState } from "react";
import TableOrder from "./TableOrder";

function Classroom() {
  const [data, setData] = useState([]);

  const head = [
    {
      numeric: true,
      disablePadding: false,
      lable: "Name",
      id: "name",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Type",
      id: "name",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Phone Number",
      id: "phoneNumber",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Delivery Address",
      id: "address",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Total Amount",
      id: "totalAmount",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Order At",
      id: "orderAt",
    },
    {
      numeric: true,
      disablePadding: false,
      lable: "Status",
      id: "status",
    },
  ];

  useEffect(() => {
    orderApi
      .getOrders()
      .then((result) => {
        setData(result.data);

        setData((data) => {
          return data.map((item) => {
            item.linkTo = `/orders/${item._id}`;
            return item;
          });
        });
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  }, []);

  const submitDelete = (selected) => {
    const formData = {
      selected: selected,
    };
    orderApi
      .deleteMany(formData)
      .then((result) => {
        const newData = data.filter((item) => !selected.includes(item._id));
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const submitDone = (selected) => {
    const formData = {
      selected: selected,
    };
    orderApi
      .updataStatus(formData)
      .then((result) => {
        console.log(result);
        const newData = data.map((i) => {
          if (selected.includes(i._id)) {
            return {
              ...i,
              status: i.status + 1,
            };
          }
          return i;
        });

        setData(newData);
        console.log(data);
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
      });
  };
  return (
    <Box>
      <Typography variant='h3' textAlign='left' sx={{ mb: "15px" }}>
        <b>Order Management</b>
      </Typography>
      <TableOrder head={head} data={data} submitDelete={submitDelete} submitDone={submitDone} />
    </Box>
  );
}

export default Classroom;
