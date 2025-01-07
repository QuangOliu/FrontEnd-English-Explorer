import { Class, Dashboard, Home, QuestionAnswer } from '@mui/icons-material';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import GroupIcon from '@mui/icons-material/Group';
import PersonIcon from '@mui/icons-material/Person';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {
  Badge,
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Collapse,
  ListItem,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import WalletIcon from '@mui/icons-material/Wallet';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';

const menuItems = [
  {
    name: 'My Dashboard',
    icon: <Dashboard />,
    role: 'ALL',
    subItems: [
      {
        name: 'Home',
        path: '/',
        icon: <Home />,
        role: 'ALL',
      },
      {
        name: 'Profile',
        path: '/profile',
        icon: <PersonIcon />,
        role: 'ALL',
      },
    ],
  },
  {
    name: 'Manage',
    path: '/manage',
    icon: <LeaderboardIcon />,
    role: ['ADMIN', 'TEACHER'],
    subItems: [
      {
        name: 'Manage Questions',
        path: '/manage/questions',
        icon: <QuestionAnswer />,
        role: ['ADMIN', 'TEACHER'],
      },
      {
        name: 'Manage Classroom',
        path: '/manage/classrooms',
        icon: <Class />,
        role: ['ADMIN', 'TEACHER'],
      },
      {
        name: 'Manage Users',
        path: '/manage/users',
        icon: <GroupIcon />,
        role: ['ADMIN'],
      },
    ],
  },
  {
    name: 'Classroom',
    path: '/classrooms',
    icon: <CardMembershipIcon />,
    role: 'ALL',
  },
  {
    name: 'My Wallet',
    path: '/wallet',
    icon: <WalletIcon />,
    role: 'ALL',
  },
];

const Sidebar = () => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [openSubItems, setOpenSubItems] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const user = useSelector((state) => state.user);
  const [userRoles, setUserRoles] = useState(user?.roles?.map((role) => role.name) || []);

  useEffect(() => {
    // Khi dữ liệu người dùng thay đổi, cập nhật lại userRoles
    setUserRoles(user?.roles?.map((role) => role.name) || []);
  }, [user]); // Chạy lại khi `user` thay đổi

  const alt = theme.palette.background.alt;

  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    navigate(path);
  };

  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  const handleSubItemClick = (path) => {
    setOpenSubItems((prevState) => ({
      ...prevState,
      [path]: !prevState[path],
    }));
  };

  // Filter subItems based on user roles
  const filterSubItems = (subItems) => {
    return subItems.filter((subItem) => {
      if (subItem.role === 'ALL') return true;
      if (Array.isArray(subItem.role)) {
        return subItem.role.some((role) => userRoles.includes(role));
      }
      return userRoles.includes(subItem.role);
    });
  };

  // Filter menuItems based on user roles
  const filteredMenuItems = menuItems
    .filter((item) => {
      if (item.role === 'ALL') return true;
      if (Array.isArray(item.role)) {
        return item.role.some((role) => userRoles.includes(role));
      }
      return userRoles.includes(item.role);
    })
    .map((item) => {
      // Apply filterSubItems for each item that has subItems
      if (item.subItems) {
        item.subItems = filterSubItems(item.subItems);
      }
      return item;
    });

  return (
    <Box backgroundColor={alt} height={'100%'}>
      <List
        sx={{ width: '100%' }}
        component="nav"
        aria-labelledby="nested-list-subheader"
      >
        {filteredMenuItems.map((item, index) => {
          const isItemActive = isActive(item.path);

          if (item?.subItems?.length > 0) {
            return (
              <div key={index}>
                <ListItemButton
                  onClick={() => handleSubItemClick(item.path)}
                  selected={isItemActive}
                >
                  <ListItemIcon>
                    <Badge>{item.icon}</Badge>
                  </ListItemIcon>
                  <ListItemText primary={item.name} />
                  {openSubItems[item.path] ? (
                    <ExpandLessIcon />
                  ) : (
                    <ExpandMoreIcon />
                  )}
                </ListItemButton>

                <Collapse
                  in={openSubItems[item.path]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem, subIndex) => (
                      <ListItemButton
                        key={subIndex}
                        selected={isActive(subItem.path)}
                        onClick={(event) =>
                          handleListItemClick(event, subIndex, subItem.path)
                        }
                        sx={{ pl: 4 }}
                      >
                        <ListItemIcon>
                          <Badge>{subItem.icon}</Badge>
                        </ListItemIcon>
                        <ListItemText primary={subItem.name} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </div>
            );
          }

          return (
            <ListItemButton
              key={index}
              selected={isItemActive}
              onClick={(event) => handleListItemClick(event, index, item.path)}
            >
              <ListItemIcon>
                <Badge>{item.icon}</Badge>
              </ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          );
        })}
      </List>

      <Divider sx={{ marginY: 1 }} />
    </Box>
  );
};

export default Sidebar;
