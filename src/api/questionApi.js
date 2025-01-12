import axiosClient from './axiosClient'

const questionApi = {
    getQuestions() {
        const url = 'questions'
        return axiosClient.get(url)
    },
    deleteById(id) {
        const url = `questions/${id}`
        return axiosClient.delete(url)
    },
    create(data) {
        const url = `questions`
        return axiosClient.post(url, data)
    },
    getQuestionsPage(page = 1, size = 10) {
        // Truyền page-1 để phù hợp với Pageable trong Spring (Spring Boot page index starts at 0)
        const url = `questions/page?page=${page - 1}&size=${size}`
        return axiosClient.get(url)
    },
    getQuestionsByType(Type) {
        const url = `questions?type=${Type}`
        return axiosClient.get(url)
    },
    getById(id) {
        const url = `questions/${id}`
        return axiosClient.get(url)
    },
    getByExam(id) {
        const url = `questions/get-by-exam/${id}`
        return axiosClient.get(url)
    },
    getByAction(action) {
        const url = `questions/get-by-action?action=${action}`
        return axiosClient.get(url);
    },
    getMineQuestions() {
        const url = `questions/get-mine`
        return axiosClient.get(url);
    },
}

export default questionApi
