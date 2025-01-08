import axiosClient from './axiosClient';

const roleApi = {
  getRoles() {
    const url = 'roles';
    return axiosClient.get(url);
  },
};

export default roleApi;
