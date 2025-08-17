import api from './axiosSetup'

export const getGroups = () => api.get('/grade')
export const getRoundsByGroupId = (idGrade) => api.get('/round/' + idGrade)
export const getStudentsByRoundId = (idRound) => api.get('/round_student/' + idRound)
export const saveScore = () => api.get('/round/1/16')
