import axiosClient from './axiosClient'

const classroomApi = {
    getClassrooms() {
        const url = 'classrooms'
        return axiosClient.get(url)
    },
    create(data) {
        const url = `classrooms`
        return axiosClient.post(url, data)
    },
    getClassroomsPage(page = 1, size = 10) {
        // Truyền page-1 để phù hợp với Pageable trong Spring (Spring Boot page index starts at 0)
        const url = `classrooms/page?page=${page - 1}&size=${size}`
        return axiosClient.get(url)
    },
    getClassroomsByType(Type) {
        const url = `classrooms?type=${Type}`
        return axiosClient.get(url)
    },
    getById(id){
        const url = `classrooms/${id}`
        return axiosClient.get(url)
    }
}

export default classroomApi;
