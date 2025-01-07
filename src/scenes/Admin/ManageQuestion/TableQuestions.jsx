import { useTheme } from '@emotion/react';
import { QuestionMarkSharp } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Pagination,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import questionApi from 'api/questionApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function TableQuestions() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize] = useState(10);

  const theme = useTheme();

  const { palette } = useTheme();
  const neutralLight = theme.palette.neutral.light;
  const navigate = useNavigate();
  const columns = [
    { field: 'id', headerName: 'ID', minWidth: 50, maxWidth: 100 },
    { field: 'question', headerName: 'Question', flex: 2, minWidth: 200 },
    { field: 'skill', headerName: 'Skill', flex: 1, minWidth: 150 },
    { field: 'level', headerName: 'Level', flex: 1, minWidth: 150 },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      sortable: false,
      minWidth: 100,
      renderCell: (params) => {
        return (
          <>
            <IconButton
              onClick={() => navigate(`/questions/edit/${params.row.id}`)}
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={(e) => {
                handleClickDelete(e, params.row);
              }}
              sx={{
                ml: 1,
                backgroundColor: theme.palette.primary.main,
                color: 'white',
                '&:hover': { color: theme.palette.primary.main },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </>
        );
      },
    },
  ];

  const handleConfirmDelete = () => {
    questionApi
      .deleteById(formValues?.id)
      .then((result) => {
        toast.success('Xóa thành công');
      })
      .then((data) => {
        loadData();
      })
      .catch((err) => {
        toast.error('Xóa thất bại');
      });
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };
  const [openDelete, setOpenDelete] = useState(false);
  const [formValues, setFormValues] = useState({
    id: '',
    accessType: '',
    name: '',
    description: '',
    cost: 0,
  });
  const handleClickDelete = (event, entity) => {
    event.preventDefault();
    event.stopPropagation();

    setFormValues(entity);
    setOpenDelete(true);
  };
  const loadData = () => {
    questionApi
      .getQuestionsPage(currentPage, pageSize)
      .then((result) => {
        setData(result.content);
        setTotalPages(result.totalPages);
      })
      .catch((err) => {
        console.error('Error fetching questions:', err);
      });
  };
  useEffect(() => {
    loadData();
  }, [currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage + 1); // DataGrid uses 0-based index
  };

  const handleSelectionModelChange = (newSelection) => {
    console.log(newSelection);
    setSelected(newSelection);
  };

  return (
    <Box>
      <DataGrid
        rows={data}
        columns={columns}
        rowCount={totalPages * pageSize}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={handlePageChange}
        onSelectionModelChange={(newSelection) =>
          handleSelectionModelChange(newSelection)
        }
        sx={{ border: 0, height: 400 }}
      />
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={(e, page) => setCurrentPage(page)}
        color="primary"
        sx={{ marginTop: 2, justifyContent: 'center', display: 'flex' }}
      />
      <Box width={'100%'} display={'flex'} justifyContent={'end'}>
        <Button
          sx={{
            backgroundColor: palette.primary.main,
            color: palette.background.alt,
            '&:hover': { color: palette.primary.main },
          }}
          onClick={() => {
            navigate('/questions/create');
          }}
        >
          Add New Question
        </Button>
      </Box>
      <Dialog
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa câu hỏi này không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            aria-label="Hủy"
            onClick={(e) => {
              handleCloseDelete();
            }}
            sx={{
              p: '1rem',
            }}
          >
            Hủy
          </Button>
          <Button
            aria-label="delete"
            size="large"
            onClick={() => {
              handleConfirmDelete();
              handleCloseDelete();
            }}
            autoFocus
            sx={{
              p: '1rem',
              backgroundColor: palette.background.error,
              color: 'white',
              '&:hover': { color: palette.background.error },
            }}
          >
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default TableQuestions;
