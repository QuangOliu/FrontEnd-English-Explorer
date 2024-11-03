import axiosClient from './axiosClient'

const examApi = {
    getByExam() {
        const url = `exams`
        return axiosClient.get(url)
    },
    save(data) {
        const url = `exams`
        return axiosClient.post(url, data)
    },
    getExamsPage(page = 1, size = 10) {
        // Truyền page-1 để phù hợp với Pageable trong Spring (Spring Boot page index starts at 0)
        const url = `exams/page?page=${page - 1}&size=${size}`
        return axiosClient.get(url)
    },
    getExamsByClassroom(classroomId) {
        const url = `exams/classroom/${classroomId}`
        return axiosClient.get(url)
    },
    getById(id) {
        const url = `exams/${id}`
        return axiosClient.get(url)
    },
}

export default examApi
