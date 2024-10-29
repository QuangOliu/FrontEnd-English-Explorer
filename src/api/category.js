import axiosClient from "./axiosClient";

const categoryApi = {
  getAllCategory() {
    const url = "/category";
    return axiosClient.get(url);
  },
};

export default categoryApi;
