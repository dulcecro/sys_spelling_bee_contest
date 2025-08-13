import api from './axiosSetup'

export const getRound = () => api.get('/round/1/16')