import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import commentApi from 'api/commentApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { isOwn } from 'utils/utils';

const Comments = ({ questionProp }) => {
  const [listComment, setListComment] = useState([]);
  const [newComment, setNewComment] = useState('');
  const navigate = useNavigate();
  const questionId = questionProp?.id;

  // Hàm để định dạng ngày
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString(); // Hoặc bạn có thể sử dụng thư viện như moment.js để định dạng theo yêu cầu
  };

  useEffect(() => {
    commentApi
      .getByQuestion(questionId)
      .then((result) => {
        setListComment(result);
      })
      .catch(() => {
        toast.error('Lỗi lấy comments');
      });
  }, [questionId]);

  const handleAddComment = () => {
    if (!newComment.trim()) {
      toast.error('Vui lòng nhập nội dung bình luận');
      return;
    }
    commentApi
      .addComment({ question: { id: questionId }, content: newComment })
      .then((newCommentData) => {
        setListComment((prev) => [...prev, newCommentData]);
        setNewComment('');
        toast.success('Thêm bình luận thành công');
      })
      .catch(() => {
        toast.error('Lỗi khi thêm bình luận');
      });
  };

  const user = useSelector((state) => state.user);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Danh sách comment */}
      <Box flex="1" overflow="auto">
        <Typography variant="h6" gutterBottom>
          Comments
        </Typography>
        {listComment.length > 0 ? (
          listComment.map((comment, index) => (
            <Grid
              container
              key={comment.id}
              spacing={2}
              alignItems="center"
              marginBottom={2}
              direction={isOwn(user, comment) ? 'row-reverse' : 'row'} // Condition for message alignment
            >
              <Grid item>
                <Avatar>
                  {comment?.user?.fullname
                    ? comment.user.fullname.substring(0, 1).toUpperCase()
                    : '?'}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Box
                  padding={1}
                  borderRadius="8px"
                  boxShadow="0 2px 5px rgba(0,0,0,0.1)"
                  bgcolor="#fff"
                  style={{
                    backgroundColor: comment.isBot ? '#e0f7fa' : '#fff', // Change background for bot messages
                  }}
                >
                  {/* Hiển thị tên người viết bình luận */}
                  <Typography variant="body2" color="textSecondary">
                    {comment?.user?.fullname || 'Bot'} -{' '}
                    {formatDate(comment.createDate)}
                  </Typography>
                  <Typography variant="body1">{comment.content}</Typography>
                </Box>
              </Grid>
            </Grid>
          ))
        ) : (
          <Typography>No comments available</Typography>
        )}
      </Box>

      {/* Ô nhập comment */}
      <Box
        padding={1}
        borderTop="1px solid #ddd"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Nhập bình luận..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px' }}
          onClick={handleAddComment}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Comments;
