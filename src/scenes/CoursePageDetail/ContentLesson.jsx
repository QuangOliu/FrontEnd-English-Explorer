import {
  Box,
  IconButton,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import lessonApi from 'api/lessonApi';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '@emotion/react';
import progressApi from 'api/progressApi';
import { isAdminOrOwn } from 'utils/utils';
import { useSelector } from 'react-redux';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ContentLesson = ({ listLesson }) => {
  const query = useQuery();
  const navigate = useNavigate();
  const lessonId = query.get('lessonId');
  const { courseId } = useParams();

  const [lesson, setLesson] = useState({ title: '', content: '' });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const alt = theme.palette.background.alt;

  useEffect(() => {
    if (lessonId) {
      setLoading(true);
      lessonApi
        .getById(lessonId)
        .then((res) => setLesson(res))
        .catch(() => toast.error('Failed to fetch lesson'))
        .finally(() => setLoading(false));
    }
  }, [lessonId]);

  const handleSave = () => {
    setLoading(true);
    lessonApi
      .save({ ...lesson, id: lessonId })
      .then(() => {
        toast.success('Lesson updated successfully!');
        setEditing(false);
      })
      .catch(() => toast.error('Failed to update lesson'))
      .finally(() => setLoading(false));
  };

  const handleToggleEditing = () => setEditing((prev) => !prev);

  const currentIndex = listLesson.findIndex((lesson) => lesson.id == lessonId);

  const handleMarkAsCompleted = () => {
    progressApi
      .created(lesson)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log('Error creating progress:', err);
      });
  };

  const handleLessonNavigation = (direction) => {
    const newIndex = currentIndex + direction;
    if (newIndex >= 0 && newIndex < listLesson.length) {
      setEditing(false);
      handleMarkAsCompleted();
      navigate(`/course/${courseId}?lessonId=${listLesson[newIndex].id}`);
    }
  };
  
  useEffect(() => {
    // Nếu không có lessonId, chuyển hướng đến bài đầu tiên
    if (!lessonId && listLesson.length > 0) {
      navigate(`/course/${courseId}?lessonId=${listLesson[0].id}`, { replace: true });
    } else if (lessonId) {
      setLoading(true);
      lessonApi
        .getById(lessonId)
        .then((res) => setLesson(res))
        .catch(() => toast.error('Failed to fetch lesson'))
        .finally(() => setLoading(false));
    }
  }, [lessonId, listLesson, courseId, navigate]);

  return (
    <Box sx={{ paddingTop: '20px' }}>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Box display="flex" alignItems="center" mb={3}>
            {editing ? (
              <TextField
                fullWidth
                value={lesson.title}
                onChange={(e) =>
                  setLesson((prev) => ({ ...prev, title: e.target.value }))
                }
                variant="outlined"
                size="small"
                sx={{ mr: 2 }}
              />
            ) : (
              <Typography variant="h2" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
                {lesson.title || 'Lesson Title'}
              </Typography>
            )}
            {isAdminOrOwn(user, lesson) && (
              <IconButton color="primary" onClick={handleToggleEditing}>
                <Edit />
              </IconButton>
            )}
          </Box>

          {editing ? (
            <>
              <ReactQuill
                value={lesson.content || ''}
                onChange={(content) =>
                  setLesson((prev) => ({ ...prev, content }))
                }
                style={{ marginBottom: '20px', backgroundColor: alt }}
              />
              <Box display="flex" gap={2}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSave}
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleToggleEditing}
                >
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <Box sx={{ position: 'relative', minHeight: '100%' }}>
              <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
            </Box>
          )}

          <Box display="flex" justifyContent="space-between" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLessonNavigation(-1)}
              disabled={currentIndex <= 0}
            >
              Previous
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleLessonNavigation(1)}
              disabled={currentIndex >= listLesson.length - 1}
            >
              Next
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default ContentLesson;
