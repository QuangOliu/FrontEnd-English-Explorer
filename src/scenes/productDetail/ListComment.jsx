import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";
import userApi from "api/userApi";
import { Box } from "@mui/material";

export default function ListComment({ comments }) {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const uniqueUserIds = comments.reduce((uniqueIds, comment) => {
      if (!uniqueIds.includes(comment.userId)) {
        uniqueIds.push(comment.userId);
      }
      return uniqueIds;
    }, []);
    userApi
      .getListUsers(uniqueUserIds)
      .then((result) => {
        setUsers(result.data);
      })
      .catch((err) => {});
  }, [comments]);

  const selectUserById = (id) => {
    return users.find((i) => {
      return i._id === id;
    });
  };
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        maxHeight: "750px",
        minHeight: comments.length > 0 ? "auto" : "100px",
        overflow: "scroll",
        overrides: {
          // Ẩn scrollbar cho phần tử HTML
          "::-webkit-scrollbar": {
            display: "none",
          },
          "::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0)",
          },
        },
      }}
    >
      {comments.length > 0
        ? comments?.map((i, index) => {
            const thisUser = selectUserById(i.userId);
            return (
              <Box key={index}>
                <ListItem alignItems='flex-start'>
                  <ListItemAvatar>
                    <Avatar alt={thisUser?.firstName || "User"} src={`${process.env.REACT_APP_BASE_URL}assets/${thisUser?.picturePath}`} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={thisUser ? `${thisUser?.firstName} ${thisUser?.lastName}` : "User"}
                    secondary={
                      <>
                        <Typography sx={{ display: "inline" }} component='span' variant='body2' color='text.primary'>
                          {i.comment}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <Divider variant='inset' component='li' />
              </Box>
            );
          })
        : "Chưa có comments nào"}
    </List>
  );
}
