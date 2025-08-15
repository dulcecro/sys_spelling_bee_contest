import api from './axiosSetup'

export const getRoundsByGroupId = (idGrade) => api.get('/round/1/' + idGrade)
export const saveScore = () => api.get('/round/1/16')
export const getGroups = () => api.get('/grade')