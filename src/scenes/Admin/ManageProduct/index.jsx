import { Typography } from "@mui/material";
import productApi from "api/productApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import TableProduct from "scenes/Admin/ManageProduct/TableProduct";
import { removeManyFromCart, setItems } from "state";

const btn = {
  title: "Thêm sản phẩm mới",
  linkTo: "/manage/products/create",
};
function ManageDashboad() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    productApi
      .getAllProduct()
      .then((result) => {
        setData(result);
        setData((data) => {
          return data.map((item) => {
            item.linkTo = `/statistical/products/${item._id}`;
            return item;
          });
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitDelete = async (selected) => {
    const formData = {
      selected: selected,
    };
    productApi
      .deleteProducts(formData)
      .then((result) => {
        const newData = data.filter((item) => {
          return !selected.includes(item._id);
        });
        setData(newData);
        dispatch(setItems(newData));
        dispatch(removeManyFromCart(selected));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      <Typography variant='h3' textAlign='left' sx={{ mb: "15px" }}>
        <b>Product Management</b>
      </Typography>
      <TableProduct data={data} btn={btn} submitDelete={submitDelete} />
    </div>
  );
}

export default ManageDashboad;
