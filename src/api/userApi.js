import axiosClient from "./axiosClient";

const userApi = {
  getUserById(id) {
    const url = `/users/${id}`;
    return axiosClient.get(url);
  },
  getListUsers(uniqueUserIds) {
    const url = "/user/list-user";
    return axiosClient.post(url, { uniqueUserIds });
  },
  getAllUser() {
    const url = "/users/page";
    return axiosClient.get(url);
  },

  deleteUsers(data) {
    const url = "/user/deletemany";
    return axiosClient.delete(url, { data });
  },
  updateAccount(userId, data) {
    const url = `/user/${userId}/update`;
    return axiosClient.patch(url, data);
  },
  updateRole(userId, data) {
    // /:userId/changerole
    const url = `/user/${userId}/changerole`;
    return axiosClient.patch(url, data);
  },
};

export default userApi;
