import { useTheme } from '@emotion/react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableContainer,
  TextField,
  Typography,
} from '@mui/material';
import authApi from 'api/authApi';
import classmemnerApi from 'api/classmember';
import examApi from 'api/examApi';
import StyledTableCell from 'components/StyledTableCell';
import StyledTableRow from 'components/StyledTableRow';
import { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isAdmin, isAdminOrOwn } from 'utils/utils';

const head = [
  {
    numeric: true,
    disablePadding: false,
    lable: 'Product ID',
    id: '_id',
  },
];

function MemberList({ classroomId }) {
  const [classmembers, setClassmembers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectUser, setSelectUser] = useState({});
  const [openPopUp, setOpenPopUp] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { palette } = useTheme();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    accessType: 'PRIVATE', // Default value
  });

  useEffect(() => {
    loadData(classroomId);
  }, [classroomId]);

  const loadData = (cId) => {
    classmemnerApi
      .getByClassroom(cId)
      .then((result) => {
        setClassmembers(result);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleClickOpenPopUp = (user) => {
    setSelectUser(user);
    setOpenPopUp(true);
  };

  const handleClose = () => {
    setSelectUser({});
    setOpen(false);
    setOpenPopUp(false);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      accessType: 'PRIVATE',
    });
  };
  const handleDelete = () => {
    classmemnerApi
      .kick(selectUser?.id, classroomId)
      .then((result) => {
        toast.success('Successfully kicked the user');
        loadData(classroomId);
      })
      .catch((err) => {
        toast.error('Failed to kick the user');
      });
    setOpenPopUp(false);
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const classroomIdAsNumber = Number(classroomId);

    examApi
      .save({ ...formData, classroom: { id: classroomIdAsNumber } })
      .then(() => {
        toast.success('Exam created successfully!');
        return examApi.getExamsByClassroom(classroomIdAsNumber);
      })
      .then((result) => {
        classmembers(result);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  // Function to navigate to exam detail page
  const handleEditClick = (id) => {
    navigate(`/user/${id}`);
  };

  return (
    <div>
      <h2 style={{ margin: 0 }}>Members for Classroom-{classroomId}</h2>

      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          {/* Body of table */}
          {classmembers ? (
            <TableBody>
              {classmembers.map((row) => {
                return (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell align="left">
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar
                            alt={`${row.user.fullname}`}
                            src={`/static/images/avatar/${row + 1}.jpg`}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          id={row.id}
                          primary={`${row.user.fullname}`}
                        />
                      </ListItemButton>
                    </StyledTableCell>
                    {isAdminOrOwn(user, row) && (
                      <StyledTableCell align="left">
                        <IconButton
                          aria-label="delete"
                          size="large"
                          onClick={(e) => {
                            handleClickOpenPopUp(row.user);
                          }}
                          sx={{
                            backgroundColor: palette.background.error,
                            color: 'white',
                            '&:hover': {
                              color: palette.background.error,
                            },
                          }}
                        >
                          <DeleteIcon fontSize="inherit" />
                        </IconButton>
                      </StyledTableCell>
                    )}
                    <StyledTableCell align="left"></StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          ) : (
            <Box>
              <Box
                width={'100%'}
                pt={'15px'}
                m="15px auto"
                backgroundColor={theme.palette.background.alt}
              >
                <Typography
                  display={'block'}
                  fontWeight="500"
                  variant="h5"
                  textAlign={'center'}
                  sx={{ mb: '1.5rem' }}
                >
                  Dữ liệu trống
                </Typography>
              </Box>
            </Box>
          )}
        </Table>
      </TableContainer>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
        }}
      >
        <DialogTitle>Add Exam</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To create a new exam, please fill in the details below.
          </DialogContentText>
          <TextField
            autoFocus
            required
            margin="dense"
            name="title"
            label="Exam Title"
            value={formData.title}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="startDate"
            label="Start Date"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="dense"
            name="endDate"
            label="End Date"
            type="date"
            value={formData.endDate}
            onChange={handleChange}
            fullWidth
            variant="standard"
            InputLabelProps={{ shrink: true }}
          />
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="access-type-label">Access Type</InputLabel>
            <Select
              labelId="access-type-label"
              name="accessType"
              value={formData.accessType}
              onChange={handleChange}
            >
              <MenuItem value="PUBLIC">Public</MenuItem>
              <MenuItem value="PRIVATE">Private</MenuItem>
              <MenuItem value="PROTECTED">Protected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit">Add Exam</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openPopUp}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Use Google's location service?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to kick of user
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleDelete} autoFocus>
            Kick
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster />
    </div>
  );
}

export default MemberList;
