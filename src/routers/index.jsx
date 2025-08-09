import React from "react";
import { Route, Routes } from "react-router-dom";
import { PageAlumno } from '../features/alumno/pages/PageAlumno'
import { PageJurado } from '../features/jurado/pages/PageJurado'
import { PagePresentador } from '../features/presentador/page/PagePresentador'

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/alumno' element={<PageAlumno />} />
            <Route path='/jurado' element={<PageJurado />} />
            <Route path='/presentador' element={<PagePresentador />} />
            <Route path='*' element={<p>Not found</p>} />
        </Routes >

    )
}
export default AppRoutes;