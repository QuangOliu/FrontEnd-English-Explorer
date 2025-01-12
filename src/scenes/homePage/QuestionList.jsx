import {
  Typography,
  Button,
  IconButton,
  CircularProgress,
} from '@mui/material';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import QuestionDetail from 'components/QuestionDetail';
import {
  Favorite,
  Bookmark,
  Share,
  ChatBubbleOutline,
} from '@mui/icons-material';
import questionApi from 'api/questionApi';
import actionApi from 'api/actionApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@emotion/react';
import { isAdmin } from 'utils/utils';
import CommentIcon from '@mui/icons-material/Comment';
// Thêm Material UI Slide
import Slide from '@mui/material/Slide';
import CommentBox from './CommentBox';

const QuestionList = () => {
  const [items, setItems] = useState([]);
  const [indexQuestion, setIndexQuestion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCorrect, setIsCorrect] = useState(null);
  const [actionState, setActionState] = useState({
    love: false,
    share: false,
    bookMark: false,
  });

  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const theme = useTheme();
  const alt = theme.palette.background.alt;
  const dark = theme.palette.neutral.dark;

  useEffect(() => {
    questionApi
      .getQuestionsByType()
      .then((result) => {
        setItems(result);
        setLoading(false);
        fetchActionState(result[0].id);
      })
      .catch((err) => console.log(err));
  }, []);

  const fetchActionState = (questionId) => {
    actionApi
      .getActionState(questionId)
      .then((result) => {
        setActionState(result);
      })
      .catch((err) => console.log(err));
  };

  const handleNextQuestion = () => {
    const nextIndex = (indexQuestion + 1) % items.length;
    setIndexQuestion(nextIndex);
    setIsCorrect(null);
    fetchActionState(items[nextIndex].id);
  };

  const handlePreviousQuestion = () => {
    const prevIndex =
      indexQuestion === 0 ? items.length - 1 : indexQuestion - 1;
    setIndexQuestion(prevIndex);
    setIsCorrect(null);
    fetchActionState(items[prevIndex].id);
  };

  const handleToggleAction = (actionType) => {
    const questionId = items[indexQuestion].id;
    const data = { actionType, question: { id: questionId } };

    actionApi
      .toggleAction(data)
      .then((updatedState) => {
        setActionState(updatedState);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Box
      style={{
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'space-between',
        display: 'flex',
      }}
    >
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="100%"
        >
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box flex="1" display="grid">
            <Box display="flex" flexDirection="column" alignItems="center">
              <QuestionDetail
                questionProp={items[indexQuestion]}
                isCorrect={isCorrect}
              />
            </Box>
          </Box>

          <CommentBox questionProp={items[indexQuestion]}/>

          <Box
            display="flex"
            justifyContent="space-between"
            width="100%"
            backgroundColor={alt}
            padding={'10px 20px'}
          >
            <Box display="flex">
              <IconButton
                color={actionState.love ? 'primary' : dark}
                onClick={() => handleToggleAction('LOVE')}
              >
                <Favorite />
              </IconButton>
              <IconButton
                color={actionState.bookMark ? 'primary' : dark}
                onClick={() => handleToggleAction('BOOKMARK')}
              >
                <Bookmark />
              </IconButton>
            </Box>

            <Box display="flex">
              {isAdmin(user) && (
                <Button
                  variant="contained"
                  onClick={() => {
                    navigate(`/questions/edit/${items[indexQuestion].id}`);
                  }}
                >
                  Edit
                </Button>
              )}
              <Box margin={'0 10px'}></Box>
              <Button variant="contained" onClick={handlePreviousQuestion}>
                Previous
              </Button>
              <Box margin={'0 10px'}></Box>
              <Button variant="contained" onClick={handleNextQuestion}>
                Next
              </Button>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default QuestionList;
