import { Add } from '@mui/icons-material';
import { Box, Button, CircularProgress, TextField } from '@mui/material';
import lessonApi from 'api/lessonApi';
import { useState } from 'react';

const FormLesson = ({
  creatingLessonForChapter,
  setCreatingLessonForChapter,
  chapter,
  handleAfterSubmit,
}) => {
  const [lessonTitle, setLessonTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLessonTitleChange = (e) => {
    setLessonTitle(e.target.value);
  };

  const handleCreateLesson = () => {
    if (lessonTitle.trim() === '') return;
    setLoading(true);
    // Call the API to create a new lesson
    lessonApi
      .save({
        title: lessonTitle,
        chapter: {
          id: chapter.id,
        },
      })
      .then(() => {
        setLoading(false);
        setCreatingLessonForChapter(null);
        setLessonTitle(''); // Reset lesson title after successful creation
        handleAfterSubmit(); // Call the 'handleAfterSubmit' function to update the list of lessons
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelCreateLesson = () => {
    setCreatingLessonForChapter(null);
    setLessonTitle(''); // Clear lesson title when canceling
  };

  return (
    <Box
      sx={{
        marginLeft: 2,
        marginBottom: 1,
      }}
    >
      {creatingLessonForChapter === chapter.id ? (
        <>
          <TextField
            fullWidth
            label="Enter Lesson Title"
            variant="outlined"
            value={lessonTitle}
            onChange={handleLessonTitleChange}
            sx={{
              marginBottom: 2,
            }}
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
              onClick={handleCreateLesson}
              sx={{
                marginRight: 2,
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="secondary" />
              ) : (
                'Create Lesson'
              )}
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelCreateLesson}
            >
              Cancel
            </Button>
          </Box>
        </>
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={() => setCreatingLessonForChapter(chapter.id)}
          startIcon={<Add />}
        >
          Lesson
        </Button>
      )}
    </Box>
  );
};

export default FormLesson;
