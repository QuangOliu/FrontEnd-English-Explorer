import axiosClient from './axiosClient'

const classmemberApi = {
    create(data) {
        const url = 'classmembers'
        return axiosClient.post(url, data)
    },
    getByClassroom(classroomId) {
        const url = `classmembers/classroom/${classroomId}`
        return axiosClient.get(url)
    },
    kick(userId, classroomId) {
        const url = `classmembers/kick/${userId}/${classroomId}`
        return axiosClient.delete(url)
    },
}

export default classmemberApi
