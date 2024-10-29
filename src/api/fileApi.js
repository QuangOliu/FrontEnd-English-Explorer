import axiosClient from './axiosClient'

const fileApi = {
    // Upload a file
    uploadFile(formData) {
        const url = 'upload' // Append the file to the form data

        return axiosClient.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set the content type for file upload
            },
        })
    },

    // Get the list of files
    getListFiles() {
        const url = 'files'
        return axiosClient.get(url)
    },

    // Get a specific file by filename
    getFile(filename) {
        const url = `files/${filename}`
        return axiosClient.get(url, {
            responseType: 'blob', // Set response type to blob for file download
        })
    },
    // Delete a file by filename
    deleteFile(filename) {
        const url = `files/${filename}` // Endpoint for deleting a specific file
        return axiosClient.delete(url)
    },
}

export default fileApi
