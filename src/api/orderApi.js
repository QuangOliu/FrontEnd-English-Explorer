import axiosClient from "./axiosClient";

const orderApi = {
  addOrder(data) {
    const url = "order";
    return axiosClient.post(url, data);
  },
  getOrders() {
    const url = "order";
    return axiosClient.get(url);
  },
  getOrderById(id) {
    const url = `/order/${id}`;
    return axiosClient.get(url);
  },
  deleteMany(data) {
    const url = "/order/deletemany";
    return axiosClient.delete(url, { data });
  },
  updataStatus(data) {
    const url = "/order/updatestatus";
    return axiosClient.patch(url, { data });
  },
  thongkeProductId(productId) {
    const url = `/order/thongke/${productId}`;
    return axiosClient.get(url);
  },
  // thongke/doanhso
  thongkedoanhso() {
    const url = `/order/thongke/doanhso`;
    return axiosClient.get(url);
  },
  getOrderByUserId(userId) {
    const url = `/order/user/${userId}`;
    return axiosClient.get(url);
  },
};

export default orderApi;
