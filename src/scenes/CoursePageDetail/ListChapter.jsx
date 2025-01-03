import { useTheme } from '@emotion/react';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import {
  Box,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import chapterApi from 'api/chapterApi';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import FormChapter from './FormChapter';
import FormLesson from './FormLesson'; // Import FormLesson component

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ListChapter = ({ setListLesson }) => {
  const [chapters, setChapters] = useState([]);
  const [openChapters, setOpenChapters] = useState({});
  const [creatingLessonForChapter, setCreatingLessonForChapter] =
    useState(null);
  const { courseId } = useParams();
  let query = useQuery();
  let lessonId = query.get('lessonId');
  const navigate = useNavigate(); // Khai báo hàm navigate

  const theme = useTheme();
  const alt = theme.palette.background.alt;

  const fetchChapter = () => {
    chapterApi
      .getByCourseId(courseId)
      .then((result) => {
        setChapters(result);
        // Lấy tất cả bài học từ các chương
        const allLessons = result.reduce((lessons, chapter) => {
          return [...lessons, ...chapter.lessons];
        }, []);
        setListLesson(allLessons); // Cập nhật danh sách bài học
      })
      .catch((err) => {
        console.log('Error fetching chapters:', err);
        // Có thể hiển thị thông báo lỗi cho người dùng tại đây nếu cần
      });
  };

  useEffect(() => {
    fetchChapter();
  }, [courseId]);

  const toggleChapter = (chapterId) => {
    setOpenChapters((prevState) => ({
      ...prevState,
      [chapterId]: !prevState[chapterId],
    }));
  };

  const handleLessonClick = (x) => {
    navigate(`/course/${courseId}?lessonId=${x}`);
  };

  const isActive = (itemId) => {
    return parseInt(lessonId, 10) === itemId;
  };

  useEffect(() => {
    if (lessonId && chapters.length > 0) {
      const chapterWithActiveLesson = chapters.find((chapter) =>
        chapter.lessons.some((lesson) => lesson.id.toString() === lessonId)
      );

      if (chapterWithActiveLesson) {
        setOpenChapters((prevState) => ({
          ...prevState,
          [chapterWithActiveLesson.id]: true,
        }));
      }
    }
  }, [lessonId, chapters]);

  const isChapterActive = (chapterId) => {
    return chapters.some(
      (chapter) =>
        chapter.id === chapterId &&
        chapter.lessons.some((lesson) => lesson.id.toString() === lessonId)
    );
  };

  return (
    <Box
      sx={{
        width: '100%',
        overflowY: 'auto',
        display: 'flex',
        height: '100%',
      }}
      backgroundColor={alt}
    >
      <List component="nav" sx={{ width: '100%' }}>
        {chapters.map((chapter) => (
          <div key={chapter.id}>
            <ListItemButton
              onClick={() => toggleChapter(chapter.id)}
              selected={isChapterActive(chapter.id)} // Kiểm tra trạng thái active
            >
              <ListItemText primary={chapter.title} />
              {openChapters[chapter.id] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>

            <Collapse
              in={openChapters[chapter.id]}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {chapter.lessons.map((lesson) => (
                  <ListItemButton
                    key={lesson.id}
                    selected={isActive(lesson.id)} // Kiểm tra trạng thái active của lesson
                    sx={{ pl: 4 }}
                    onClick={() => handleLessonClick(lesson.id)}
                  >
                    <ListItemText primary={lesson.title} />
                  </ListItemButton>
                ))}
              </List>

              {/* Sử dụng FormLesson tại đây */}
              <FormLesson
                creatingLessonForChapter={creatingLessonForChapter}
                setCreatingLessonForChapter={setCreatingLessonForChapter}
                chapter={chapter}
                handleAfterSubmit={fetchChapter}
              />
            </Collapse>
          </div>
        ))}

        <FormChapter handleAfterSubmit={fetchChapter} />
      </List>
    </Box>
  );
};

export default ListChapter;
