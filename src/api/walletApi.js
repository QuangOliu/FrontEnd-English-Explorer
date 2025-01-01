// walletApi.js
import axiosClient from './axiosClient'; // Import axiosClient để gọi API

const walletApi = {
    // API để lấy ví của người dùng
    getMyWallet() {
        const url = '/wallets/my-wallet'; // URL của API
        return axiosClient.get(url);  // Gọi API với axiosClient
    },
}

export default walletApi;
