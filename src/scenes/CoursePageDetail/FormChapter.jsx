import { Add } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import chapterApi from 'api/chapterApi'; // Thay 'lessonApi' thành 'chapterApi' để tạo chapter
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const FormChapter = ({ handleAfterSubmit }) => {
  const { courseId } = useParams(); // Lấy ID khóa học từ URL
  const [chapterTitle, setChapterTitle] = useState(''); // Đổi tên thành 'chapterTitle'
  const [isCreateChapter, setIsCreateChapter] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Trạng thái loading

  const handleChapterTitleChange = (e) => {
    setChapterTitle(e.target.value); // Cập nhật trạng thái của tiêu đề chapter
  };

  const handleCreateChapter = () => {
    if (chapterTitle.trim() === '') return; // Kiểm tra nếu tiêu đề trống
    setIsLoading(true); // Đặt trạng thái loading
    // Gọi API để tạo một chapter mới
    chapterApi
      .save({
        title: chapterTitle, // Gửi tiêu đề chapter
        course: {
          id: courseId, // Gửi ID khóa học
        },
      })
      .then(() => {
        setIsLoading(false); // Đặt trạng thái loading về false
        setIsCreateChapter(false); // Đặt lại trạng thái không tạo chapter nữa
        setChapterTitle(''); // Reset tiêu đề chapter sau khi tạo thành công
        handleAfterSubmit(); // Gọi hàm 'handleAfterSubmit' để cập nhật danh sách chapter
      })
      .catch((err) => {
        console.log(err); // Xử lý lỗi nếu có
        setIsLoading(false); // Đặt trạng thái loading về false nếu có lỗi
      });
  };

  const handleCancelCreateChapter = () => {
    setIsCreateChapter(false); // Hủy bỏ khi không muốn tạo chapter
    setChapterTitle(''); // Xóa tiêu đề chapter khi hủy
  };

  return (
    <Box
      sx={{
        marginLeft: 1,
        marginBottom: 1,
      }}
    >
      {isCreateChapter ? (
        <>
          <TextField
            fullWidth
            label="Enter Chapter Title" // Đổi tên nhãn thành 'Enter Chapter Title'
            variant="outlined"
            value={chapterTitle} // Sử dụng 'chapterTitle'
            onChange={handleChapterTitleChange}
            sx={{
              marginBottom: 2,
            }}
            disabled={isLoading} // Disable input khi đang loading
          />
          <Box
            sx={{
              display: 'flex',
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleCreateChapter} // Sử dụng hàm 'handleCreateChapter'
              sx={{
                marginRight: 2,
              }}
              disabled={isLoading} // Disable button khi đang loading
            >
              {isLoading ? (
                <CircularProgress size={24} color="secondary" />
              ) : (
                'Create Chapter'
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelCreateChapter} // Sử dụng hàm 'handleCancelCreateChapter'
              disabled={isLoading} // Disable button khi đang loading
            >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsCreateChapter(true)} // Đặt trạng thái khi tạo chapter
          startIcon={<Add />}
        >
          Chapter
        </Button>
      )}
    </Box>
  );
};

export default FormChapter;
