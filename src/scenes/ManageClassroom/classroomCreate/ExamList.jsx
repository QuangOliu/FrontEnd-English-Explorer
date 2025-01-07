import { useTheme } from '@emotion/react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import examApi from 'api/examApi';
import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isAdmin, isAdminOrOwn } from 'utils/utils';

function ExamList({ classroomId, classroom }) {
  const [exams, setExams] = useState([]);
  const [exam, setExam] = useState({});
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const user = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    accessType: 'PRIVATE', // Default value
  });

  useEffect(() => {
    examApi
      .getExamsByClassroom(classroomId)
      .then((result) => {
        setExams(result);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [classroomId]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({
      title: '',
      description: '',
      startDate: '',
      endDate: '',
      accessType: 'PRIVATE',
    });
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
        setExams(result);
        handleClose();
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const showPopupDelete = (exam) => {
    setExam(exam);
    handleClickOpenDelete();
  };

  // Function to navigate to exam detail page
  const handleEditClick = (examId) => {
    console.log(examId);
    if (isAdmin(user)) {
      navigate(`/exam/user/${examId}`);
    } else {
      navigate(`/exam/detail/${examId}`);
    }
  };

  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClickOpenDelete = (id) => {
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const handleDeleteExam = () => {
    examApi
      .deleteExam(exam.id)
      .then((result) => {})
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div>
      <h2 style={{ margin: 0 }}>Exams for Classroom-{classroomId}</h2>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam Title</TableCell>
              <TableCell>Questions</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              {isAdminOrOwn(user, classroom) && <TableCell>Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {exams?.length > 0 ? (
              exams?.map((exam) => (
                <TableRow
                  key={exam.id}
                  onClick={() => handleEditClick(exam.id)}
                  sx={{
                    '&:hover': {
                      backgroundColor: theme.palette.action.hover,
                      cursor: 'pointer',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                      {exam.title}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: 'gray' }}>
                      {exam.questions?.length} Questions
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {exam.startDate ? (
                      <span
                        style={{
                          fontWeight: 'bold',
                          color: 'green',
                        }}
                      >
                        {new Date(exam.startDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: 'gray' }}>Start Date Not Set</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {exam.endDate ? (
                      <span
                        style={{
                          fontWeight: 'bold',
                          color: 'red',
                        }}
                      >
                        {new Date(exam.endDate).toLocaleDateString()}
                      </span>
                    ) : (
                      <span style={{ color: 'gray' }}>End Date Not Set</span>
                    )}
                  </TableCell>
                  {isAdminOrOwn(user, classroom) && (
                    <TableCell
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent row click
                        navigate(`/exam/edit/${exam.id}`);
                      }}
                    >
                      <Button>Edit</Button>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : (
              <>Chưa có bài kiểm tra nào</>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {isAdminOrOwn(user, classroom) && (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          style={{ marginTop: '20px' }}
        >
          Add Exam
        </Button>
      )}
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
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Confirm Delete?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Do you want to delete this exam
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button onClick={handleDeleteExam} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster />
    </div>
  );
}

export default ExamList;
