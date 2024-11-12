import axiosClient from "./axiosClient";

const authApi = {
  login(data) {
    const url = "auth/authenticate";
    return axiosClient.post(url, data);
  },
  register(data) {
    const url = "auth/register";
    return axiosClient.post(url, data);
  },
  getCurrent() {
    const url = "users/current";
    return axiosClient.get(url);
  }
};

export default authApi;
