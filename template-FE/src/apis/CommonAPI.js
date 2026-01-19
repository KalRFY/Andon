import axios from 'axios'

process.env.VUE_APP_STANDALONE_SINGLE_SPA == 'true' ? 
            localStorage.setItem('id_token', process.env.VUE_APP_TKN)
            : console.log('STANDALONE_SINGLE_SPA FALSE')

export default {
    async getCommon(url, params, callback) {
        const token = localStorage.getItem('token')
        const request = await axios
            .get(process.env.VUE_APP_API_URL + `/api/common${url}${params}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                if (callback) {
                    return callback(response, null)
                }
                return response
            })
            .catch((error) => {
                if (callback) {
                    return callback(error.response, error)
                }
                return error
            })
        return request
    },

    async get(url, params, callback) {
        // process.env.VUE_APP_STANDALONE_SINGLE_SPA == 'true' ?
        //     localStorage.setItem('id_token', process.env.VUE_APP_TKN)
        //     : console.log('STANDALONE_SINGLE_SPA FALSE')
        // const token = localStorage.getItem('id_token')
        const token = localStorage.getItem('token')
        let config = {
            headers: {
                Authorization: 'Bearer ' + token,
            },
        }

        let detailUrl = process.env.VUE_APP_API_URL + url

        // If params is provided and is an object, add as query parameters
        if (params && typeof params === 'object' && Object.keys(params).length > 0) {
            const queryParams = new URLSearchParams()
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                    queryParams.append(key, params[key])
                }
            })
            const queryString = queryParams.toString()
            if (queryString) {
                detailUrl += '?' + queryString
            }
        }

        const request = axios
            .get(detailUrl, config)
            .then((response) => {
                if (callback) {
                    return callback(response, null)
                }
                return response
            })
            .catch((error) => {
                if (callback) {
                    return callback(error.response, error)
                }
                return error
            })
        return request
    },

    async post(url, params, callback) {
        const token = localStorage.getItem('token')
        const request = await axios
            .post(process.env.VUE_APP_API_URL + `${url}`, params, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                if (callback) {
                    return callback(response, null)
                }
                return response
            })
            .catch((error) => {
                if (callback) {
                    return callback(error.response, error)
                }
                return error
            })
        return request
    },

    async put(url, id, params, callback) {
        const token = localStorage.getItem('token')
        let detailUrl;
        if (id) {
            detailUrl = `${url}/${id}`;
        } else {
            detailUrl = url;
        }
        const request = await axios
            .put(process.env.VUE_APP_API_URL + `${detailUrl}`, params, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                if (callback) {
                    return callback(response, null)
                }
                return response
            })
            .catch((error) => {
                if (callback) {
                    return callback(error.response, error)
                }
                return error
            })
        return request
    },
    
    async delete(url, id, callback) {
        const token = localStorage.getItem('token')
        const request = await axios
            .delete(process.env.VUE_APP_API_URL + `${url}/delete/${id}`, {
                headers: {
                    Authorization: 'Bearer ' + token,
                },
            })
            .then((response) => {
                if (callback) {
                    return callback(response, null)
                }
                return response
            })
            .catch((error) => {
                if (callback) {
                    return callback(error.response, error)
                }
                return error
            })
        return request
    },
    
}