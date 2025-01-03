import axiosClient from './axiosClient'

const courseApi = {
    getAll(id) {
        const url = '/course/get-by-classroom/' + id
        return axiosClient.get(url)
    },
    getById(id) {
        const url = '/course/' + id
        return axiosClient.get(url)
    },
    save(obj) {
        const url = '/course'
        return axiosClient.post(url, obj)
    },
}

export default courseApi
