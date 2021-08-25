import request from '@/plugins/axios'

export function login(data) {
    return request({
        url: '/api/opuser/login',
        method: 'post',
        data
    })
}

export function getInfo(token) {
    return request({
        url: '/api/opuser/info',
        method: 'get',
        params: { token }
    })
}

export function logout() {
    return request({
        url: '/api/opuser/logout',
        method: 'post'
    })
}
