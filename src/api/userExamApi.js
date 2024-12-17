import axiosClient from './axiosClient'

const userExamApi = {
    create(data) {
        const url = 'userexams'
        return axiosClient.post(url, data)
    },
    getByExam(examId) {
        const url = `userexams/list-user/${examId}`
        return axiosClient.get(url)
    },
}

export default userExamApi
