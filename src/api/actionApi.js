import axiosClient from "./axiosClient";

const actionApi = {
  actions(data) {
    const url = "actions";
    return axiosClient.post(url, data);
  },
  toggleAction(data) {
    const url = "actions/toggle";
    return axiosClient.post(url, data);
  },
  getActionState(id) {
    const url = `actions/check-question/${id}`;
    return axiosClient.get(url);
  }
};

export default actionApi;
