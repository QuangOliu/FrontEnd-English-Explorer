import axiosClient from './axiosClient'

const chapterApi = {
    getByCourseId(id) {
        const url = '/chapter/get-by-course/' + id
        return axiosClient.get(url)
    },
    save(obj) {
        const url = '/chapter'
        return axiosClient.post(url, obj)
    },
}

export default chapterApi
