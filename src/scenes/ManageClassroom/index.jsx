import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { removeManyFromCart, setItems } from "state";
import classroomApi from "api/classroomApi";
import TableQuestions from "./TableQuestions";
import TableClassroom from "./TableQuestions";

const btn = {
  title: "Thêm câu hỏi mới",
  linkTo: "/questions/create",
};
function ManageClassroom() {
  const [data, setData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    classroomApi
      .getClassroomsPage()
      .then((result) => {
        setData(result.content);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const submitDelete = async (selected) => {
    const formData = {
      selected: selected,
    };
    classroomApi
      .deleteUsers(formData)
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
        <b>Classroom Management</b>
      </Typography>
      <TableClassroom data={data} btn={btn} submitDelete={submitDelete} />
    </div>
  );
}

export default ManageClassroom;
