import axiosClient from './axiosClient'

const progressApi = {
    created(obj) {
        const url = '/progress/mark-as-completed'
        return axiosClient.post(url, obj)
    },
}

export default progressApi
