import api from './axiosSetup'

export const getGroups = () => api.get('/grade')
export const getRoundsByGroupId = (idGrade) => api.get('/round/' + idGrade)
export const getStudentsByRoundId = (idRound) => api.get('/round_student/' + idRound)
export const getCategories = () => api.get('/category')
export const saveScore = (idStudentEventRound, payload) => api.patch(`/round_student/${idStudentEventRound}`, payload);
export const createRound = (idGrade, idCategory) => api.post('/round_student',
    {
        idGroup: 1,
        idCategory: 3,
    }
)