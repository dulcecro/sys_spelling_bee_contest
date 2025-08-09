import React, { useState } from "react";
import { FaPlay } from "react-icons/fa"; // Icono de react-icons

export const PageAlumno = () => {
    const [step, setStep] = useState(1);

    const nextStep = () => {
        setStep((prev) => (prev < 3 ? prev + 1 : 1)); // Cicla entre 1 → 2 → 3 → 1
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 gap-6">
            {/* Texto principal */}
            {step === 1 && (
                <h1 className="text-3xl font-bold text-gray-800">The word is …</h1>
            )}
            {step === 2 && (
                <h1 className="text-3xl font-bold text-blue-600">Are you ready?</h1>
            )}
            {step === 3 && (
                <button
                    onClick={nextStep}
                    className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white text-lg rounded-lg shadow-md hover:bg-green-600 transition-all"
                >
                    <FaPlay />
                    Press the button
                </button>
            )}

            {/* Botón para cambiar el estado (solo visible en los pasos 1 y 2) */}
            {step !== 3 && (
                <button
                    onClick={nextStep}
                    className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
                >
                    Next
                </button>
            )}
        </div>
    );
};
