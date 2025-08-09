import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";

const inicializarDatos = () => [
    {
        nombre: "4 años",
        rondas: [
            {
                nombre: "Ronda 1",
                alumnos: [
                    { alumno: "Juan Pérez", palabra: "Apple", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "María López", palabra: "Orange", criterios: [5, 5, 5, 5, 5] },
                ],
            },
            {
                nombre: "Ronda 2",
                alumnos: [
                    { alumno: "Juan Pérez", palabra: "Banana", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "María López", palabra: "Grapes", criterios: [5, 5, 5, 5, 5] },
                ],
            },
        ],
    },
    {
        nombre: "5 años",
        rondas: [
            {
                nombre: "Ronda 1",
                alumnos: [
                    { alumno: "Pedro Díaz", palabra: "Table", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Lucía Gómez", palabra: "Chair", criterios: [5, 5, 5, 5, 5] },
                ],
            },
        ],
    },
];

export const PageJurado = () => {
    const [grupos, setGrupos] = useState(inicializarDatos());
    const [expandedGroups, setExpandedGroups] = useState({});
    const [expandedRounds, setExpandedRounds] = useState({});

    const sumaCriterios = (criterios) => criterios.reduce((a, b) => a + b, 0);

    const cambiarCriterio = (gIndex, rIndex, aIndex, cIndex, delta) => {
        setGrupos((prev) => {
            const nuevos = [...prev];
            const valorActual = nuevos[gIndex].rondas[rIndex].alumnos[aIndex].criterios[cIndex];
            const nuevoValor = Math.min(5, Math.max(0, valorActual + delta));
            nuevos[gIndex].rondas[rIndex].alumnos[aIndex].criterios[cIndex] = nuevoValor;
            return nuevos;
        });
    };

    const calcularPuestos = (alumnos) => {
        const conTotales = alumnos.map((a) => ({
            ...a,
            total: sumaCriterios(a.criterios),
        }));
        conTotales.sort((a, b) => b.total - a.total);
        return conTotales.map((a, index) => ({
            ...a,
            puesto: index + 1,
        }));
    };

    const toggleGroup = (gIndex) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [gIndex]: !prev[gIndex],
        }));
    };

    const toggleRound = (gIndex, rIndex) => {
        const key = `${gIndex}-${rIndex}`;
        setExpandedRounds((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const getBorderColor = (puesto) => {
        if (puesto === 1) return "border-yellow-500 shadow-yellow-300 shadow-lg";
        if (puesto === 2) return "border-gray-400 shadow-gray-300 shadow-lg";
        if (puesto === 3) return "border-amber-700 shadow-amber-300 shadow-lg";
        return "border-gray-200";
    };

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Competencias</h1>
            {grupos.map((grupo, gIndex) => (
                <div key={gIndex} className="mb-4 border rounded-lg shadow bg-white">
                    {/* Header Grupo */}
                    <div
                        onClick={() => toggleGroup(gIndex)}
                        className="flex items-center justify-between p-4 bg-blue-200 cursor-pointer hover:bg-blue-300"
                    >
                        <span className="font-semibold text-lg">{grupo.nombre}</span>
                        {expandedGroups[gIndex] ? <FaChevronDown /> : <FaChevronRight />}
                    </div>

                    {/* Rondas */}
                    {expandedGroups[gIndex] &&
                        grupo.rondas.map((ronda, rIndex) => {
                            const alumnosConPuesto = calcularPuestos(ronda.alumnos);

                            return (
                                <div key={rIndex} className="border-t">
                                    <div
                                        onClick={() => toggleRound(gIndex, rIndex)}
                                        className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer hover:bg-gray-200"
                                    >
                                        <span>{ronda.nombre}</span>
                                        {expandedRounds[`${gIndex}-${rIndex}`] ? (
                                            <FaChevronDown />
                                        ) : (
                                            <FaChevronRight />
                                        )}
                                    </div>

                                    {expandedRounds[`${gIndex}-${rIndex}`] && (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                                            {alumnosConPuesto.map((al, aIndex) => (
                                                <div
                                                    key={aIndex}
                                                    className={`p-4 border-2 rounded-lg bg-white flex flex-col gap-2 ${getBorderColor(
                                                        al.puesto
                                                    )}`}
                                                >
                                                    <div className="flex justify-between">
                                                        <h2 className="font-bold">{al.alumno}</h2>
                                                        <span className="text-sm bg-gray-200 px-2 rounded">
                                                            Puesto {al.puesto}
                                                        </span>
                                                    </div>
                                                    <p className="italic text-gray-600">Palabra: {al.palabra}</p>

                                                    {/* Criterios */}
                                                    {al.criterios.map((c, cIndex) => (
                                                        <div key={cIndex} className="flex items-center gap-2">
                                                            <span className="text-sm w-20">Criterio {cIndex + 1}</span>
                                                            <button
                                                                onClick={() =>
                                                                    cambiarCriterio(gIndex, rIndex, aIndex, cIndex, -1)
                                                                }
                                                                className="p-1 bg-red-200 rounded hover:bg-red-300"
                                                            >
                                                                <FaMinus />
                                                            </button>
                                                            <span>{c}</span>
                                                            <button
                                                                onClick={() =>
                                                                    cambiarCriterio(gIndex, rIndex, aIndex, cIndex, 1)
                                                                }
                                                                className="p-1 bg-green-200 rounded hover:bg-green-300"
                                                            >
                                                                <FaPlus />
                                                            </button>
                                                            <div className="flex-1 bg-gray-200 rounded h-2">
                                                                <div
                                                                    className="bg-green-500 h-2 rounded"
                                                                    style={{ width: `${(c / 5) * 100}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                    {/* Total */}
                                                    <div className="mt-2 text-right font-bold">
                                                        Total: {al.total}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                </div>
            ))}
        </div>
    );
};
