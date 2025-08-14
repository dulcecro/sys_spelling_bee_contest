import api from './axiosSetup'

export const getRoundsByGroupId = (idGroup) => api.get('/round/1/16')
export const saveScore = () => api.get('/round/1/16')
export const getGroups = () => api.get('/grade')