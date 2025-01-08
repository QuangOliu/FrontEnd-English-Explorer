import { ChatBubbleOutline } from '@mui/icons-material';
import { Box, Button, IconButton, Slide, Tab, Tabs } from '@mui/material';

import InsertCommentIcon from '@mui/icons-material/InsertComment';
import { useState } from 'react';
import Chatbot from './ChatBot';
import Comments from './Comments';
const CommentBox = ({ questionProp }) => {
  const [showComments, setShowComments] = useState(false); // Quản lý trạng thái hiển thị sidebar
  const [activeTab, setActiveTab] = useState(0); // Quản lý tab hiện tại (0: Comments, 1: Chatbot)

  return (
    <>
      {/* Sidebar với Tabs */}
      <Slide direction="left" in={showComments} mountOnEnter unmountOnExit>
        <Box
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100%',
            width: '600px',
            backgroundColor: '#f5f5f5',
            boxShadow: '-3px 0 5px rgba(0,0,0,0.2)',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Tabs */}
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            centered
          >
            <Tab label="Comments" />
            <Tab label="Chatbot" />
          </Tabs>

          {/* Nội dung theo Tab */}
          <Box flex="1" padding="20px" overflow="auto">
            {activeTab === 0 ? (
              <Comments questionProp={questionProp} />
            ) : (
              <Chatbot />
            )}
          </Box>
        </Box>
      </Slide>

      {/* Nút Comment */}
      <Button
        onClick={() => setShowComments(!showComments)}
        variant="contained"
        color="primary"
        style={{
          position: 'fixed',
          top: '50%',
          right: showComments ? '600px' : '0px', // Đồng bộ vị trí nút với thanh
          transform: 'translateY(calc(-50%))',
          color: 'white',
          zIndex: 1000,
          transition: 'right 0.3s ease', // Hiệu ứng mượt
        }}
      >
        <InsertCommentIcon />
      </Button>
    </>
  );
};

export default CommentBox;
