import axiosClient from './axiosClient';

const commentApi = {
  getByQuestion(questionId) {
    const url = `comments/question/${questionId}`;
    return axiosClient.get(url);
  },
  addComment(obj){
    const url = `comments`;
    return axiosClient.post(url, obj);
  }
};

export default commentApi;
