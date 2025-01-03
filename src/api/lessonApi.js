import axiosClient from './axiosClient';

const lessonApi = {
  save(obj) {
    const url = '/lessons';
    return axiosClient.post(url, obj);
  },
  getById(id) {
    const url = '/lessons/' + id;
    return axiosClient.get(url);
  },
};

export default lessonApi;
