import SendIcon from '@mui/icons-material/Send';
import {
  Avatar,
  Box,
  Button,
  Grid,
  TextField,
  Typography
} from '@mui/material';
import chatbotApi from 'api/chatbotApi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store conversation messages
  const [newMessage, setNewMessage] = useState(''); // User's message input

  const handleSendMessage = () => {
    if (!newMessage.trim()) {
      toast.error('Vui lòng nhập câu hỏi');
      return;
    }

    // Adding user's message to the conversation
    const userMessage = {
      content: newMessage,
      isFromBot: false, // This is the user's message
      createDate: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);

    // Clear the input field
    setNewMessage('');

    // Simulate server interaction by sending the user's question to the server
    chatbotApi
      .getResponse(newMessage) // Send message to the server (assumed chatbotApi function)
      .then((response) => {
        const botReply = response.bot_reply; // Lấy bot reply từ API
        const botMessage = {
          content: botReply, // Nội dung phản hồi từ bot
          isFromBot: true, // Tin nhắn của bot
        };
        setMessages((prev) => [...prev, botMessage]);
      })
      .catch(() => {
        toast.error('Lỗi khi nhận câu trả lời từ chatbot');
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { // Nếu nhấn Enter mà không nhấn Shift
      e.preventDefault();  // Ngừng hành động mặc định của Enter (ngắt dòng)
      handleSendMessage(); // Gửi tin nhắn
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      {/* Conversation history */}
      <Box flex="1" overflow="auto">
        <Typography variant="h6" gutterBottom>
          Chatbot
        </Typography>
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <Grid
              container
              key={index} // Use index as the key here for simplicity
              spacing={2}
              alignItems="center"
              marginBottom={2}
              direction={message.isFromBot ? 'row' : 'row-reverse'} // Reverse direction for user messages
            >
              <Grid item>
                <Avatar>
                  {message.isFromBot ? 'Bot' : 'U'}{' '}
                  {/* Show Bot or User initials */}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Box
                  padding={1}
                  borderRadius="8px"
                  boxShadow="0 2px 5px rgba(0,0,0,0.1)"
                  bgcolor="#fff"
                  style={{
                    backgroundColor: message.isFromBot ? '#e0f7fa' : '#fff', // Different background for bot
                  }}
                >
                  <Typography variant="body1">{message.content}</Typography>
                </Box>
              </Grid>
              <Grid item margin={'20px'}></Grid>
            </Grid>
          ))
        ) : (
          <Typography>How can I help you?</Typography>
        )}
      </Box>

      {/* Input area for new message */}
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
          placeholder="Nhập câu hỏi..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown} // Add onKeyDown event listener
          size="small"
        />
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: '10px' }}
          onClick={handleSendMessage}
          endIcon={<SendIcon />}
        >
          Send
        </Button>
      </Box>
    </Box>
  );
};

export default Chatbot;
