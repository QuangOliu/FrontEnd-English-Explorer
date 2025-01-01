import axiosClient from './axiosClient'

const transactionApi = {
    getTransactions() {
        const url = 'transactions'
        return axiosClient.get(url)
    },
    create(data) {
        const url = `transactions`
        return axiosClient.post(url, data)
    },
    getTransactionsPage(page = 1, size = 10) {
        // Truyền page-1 để phù hợp với Pageable trong Spring (Spring Boot page index starts at 0)
        const url = `transactions/page?page=${page - 1}&size=${size}`
        return axiosClient.get(url)
    },
    getById(id) {
        const url = `transactions/${id}`
        return axiosClient.get(url)
    },
    deleteById(id) {
        const url = `transactions/${id}`
        return axiosClient.delete(url)
    },
    processPayment(amount) {
        const url = `transactions/vn-pay/${amount}`
        return axiosClient.get(url)
    },
}

export default transactionApi;
