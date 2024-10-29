import { ManageAccountsOutlined, WorkOutlineOutlined } from "@mui/icons-material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import EmailIcon from "@mui/icons-material/Email";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import SendIcon from "@mui/icons-material/Send";
import { Badge, Box, Divider, IconButton, List, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Tooltip, Typography, useTheme } from "@mui/material";
import userApi from "api/userApi";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UserWidget = ({ userId, picturePath, selectedIndex, setSelectedIndex, orders, setPageType, pageType }) => {
  const [user, setUser] = useState(null);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const { palette } = useTheme();
  const navigate = useNavigate();

  const dark = palette.neutral.dark;
  const main = palette.neutral.main;

  useEffect(() => {
    userApi
      .getUserById(userId)
      .then((result) => {
        setUser(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [userId]);

  useEffect(() => {
    const x = {};
    for (const order of orders) {
      const status = order.status;
      if (!x[status]) {
        x[status] = [];
      }
      x[status].push(order);
    }

    setOrdersByStatus(x);
  }, [orders]);

  if (!user) {
    return null;
  }

  const handleListItemClick = (event, index) => {
    setPageType("order");
    setSelectedIndex(index);
  };

  const { firstName, lastName } = user;

  return (
    <Box sx={{ bgcolor: "background.paper" }}>
      {/* FIRST ROW */}
      <FlexBetween gap='0.5rem' p='1rem' onClick={() => navigate(`/user/${userId}`)}>
        <FlexBetween gap='1rem'>
          <UserImage image={picturePath} />
          <Box>
            <Typography
              variant='h4'
              color={dark}
              fontWeight='500'
              sx={{
                "&:hover": {
                  color: palette.primary.light,
                },
              }}
            >
              {firstName} {lastName}
            </Typography>
          </Box>
        </FlexBetween>
        <Tooltip title={"Edit Account"}>
          <IconButton
            onClick={() => {
              if (pageType === "edit") {
                setPageType("order");
              } else setPageType("edit");
            }}
          >
            <ManageAccountsOutlined />
          </IconButton>
        </Tooltip>
      </FlexBetween>

      <Divider />

      {/* SECOND ROW */}
      <Box p='1rem'>
        <Box display='flex' alignItems='center' gap='1rem'>
          <WorkOutlineOutlined fontSize='large' sx={{ color: main }} />
          {user.role}
        </Box>
        <Box display='flex' alignItems='center' gap='1rem'>
          <EmailIcon fontSize='large' sx={{ color: main }} />
          {user.email}
        </Box>
      </Box>

      <Divider />

      {/* THIRD ROW */}
      <Box p='1rem 0'>
        <List
          sx={{ width: "100%", maxWidth: 360 }}
          component='nav'
          aria-labelledby='nested-list-subheader'
          subheader={
            <ListSubheader component='div' id='nested-list-subheader'>
              Your Order
            </ListSubheader>
          }
        >
          <ListItemButton selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
            <ListItemIcon>
              <Badge badgeContent={ordersByStatus[1]?.length} color='primary' invisible={ordersByStatus[1]?.length === 0}>
                <SendIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary='Order' />
          </ListItemButton>

          <ListItemButton selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
            <ListItemIcon>
              <Badge badgeContent={ordersByStatus[2]?.length} color='primary' invisible={ordersByStatus[2]?.length === 0}>
                <InboxIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary='Approved' />
          </ListItemButton>

          <ListItemButton selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
            <ListItemIcon>
              <Badge badgeContent={ordersByStatus[3]?.length} color='primary' invisible={ordersByStatus[3]?.length === 0}>
                <LocalShippingIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary='Shipping' />
          </ListItemButton>

          <ListItemButton selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
            <ListItemIcon>
              <Badge badgeContent={ordersByStatus[4]?.length} color='primary' invisible={ordersByStatus[4]?.length === 0}>
                <CheckCircleOutlineIcon />
              </Badge>
            </ListItemIcon>
            <ListItemText primary='Success' />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );
};

export default UserWidget;
