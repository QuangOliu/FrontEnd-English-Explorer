import axiosClient from './axiosClient';

const chatbotApi = {
  getResponse(message) {
    const url = 'chatbot/message';
    return axiosClient.post(url, { message }); 
  },
};

export default chatbotApi;
