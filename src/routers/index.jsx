import React from "react";
import { Route, Routes } from "react-router-dom";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/alumno' element={<PageAlumno />} />
            <Route path='/jurado' element={<PageJurado />} />
            <Route path='/presentador' element={<PagePresentador />} />
            <Route path='*' element={<p>Not found</p>} />
        </Routes >

    )
}
export default AppRoutes;