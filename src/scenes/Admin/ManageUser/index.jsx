import { Typography } from "@mui/material";
import productApi from "api/productApi";
import userApi from "api/userApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeManyFromCart, setItems } from "state";
import TableUsers from "./TableUser";

const btn = {
  title: "Thêm người dùng mới",
  linkTo: "/manage/users/create",
};
function ManageUser() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    userApi
      .getAllUser()
      .then((result) => {
        console.log(result.content);
        setData(result.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitDelete = async (selected) => {
    
    userApi
      .deleteUsers(selected)
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
        <b>User Management</b>
      </Typography>
      <TableUsers data={data} btn={btn} submitDelete={submitDelete} />
    </div>
  );
}

export default ManageUser;
