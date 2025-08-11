import React, { useState } from "react";
import { FaChevronDown, FaChevronRight, FaPlus, FaMinus } from "react-icons/fa";

const nameCriterios = [
    "Correct pronunciation",
    "Correct spelling",
    "Correct use of fluency",
    "Confidence and poise",
    "Proper start and ending",
];

const inicializarDatos = () => [
    {
        nombre: "4 años",
        rondas: [
            {
                nombre: "Ronda 1",
                alumnos: [
                    { alumno: "Juan", palabra: "Dog", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Ana", palabra: "Cat", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Luis", palabra: "Car", criterios: [5, 5, 5, 5, 5] },
                ],
            },
            {
                nombre: "Ronda 2",
                alumnos: [
                    { alumno: "Juan", palabra: "Tree", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Ana", palabra: "Sky", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Luis", palabra: "Sun", criterios: [5, 5, 5, 5, 5] },
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
                    { alumno: "María", palabra: "Book", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Pedro", palabra: "Pen", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Sofía", palabra: "Desk", criterios: [5, 5, 5, 5, 5] },
                ],
            },
        ],
    },
    {
        nombre: "1° de Primaria",
        rondas: [
            {
                nombre: "Ronda 1",
                alumnos: [
                    { alumno: "Andrés", palabra: "Chair", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Lucía", palabra: "Table", criterios: [5, 5, 5, 5, 5] },
                    { alumno: "Carlos", palabra: "Door", criterios: [5, 5, 5, 5, 5] },
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
        setGrupos((prev) =>
            prev.map((grupo, gi) => {
                if (gi !== gIndex) return grupo;
                return {
                    ...grupo,
                    rondas: grupo.rondas.map((ronda, ri) => {
                        if (ri !== rIndex) return ronda;
                        return {
                            ...ronda,
                            alumnos: ronda.alumnos.map((alumno, ai) => {
                                if (ai !== aIndex) return alumno;
                                const nuevosCriterios = alumno.criterios.map((valor, ci) =>
                                    ci === cIndex
                                        ? Math.min(5, Math.max(0, valor + delta))
                                        : valor
                                );
                                return { ...alumno, criterios: nuevosCriterios };
                            }),
                        };
                    }),
                };
            })
        );
    };

    const calcularPuestos = (alumnos) => {
        const conTotales = alumnos.map((a, idx) => ({
            ...a,
            total: sumaCriterios(a.criterios),
            originalIndex: idx
        }));

        const ordenados = [...conTotales].sort((a, b) => b.total - a.total)

        let puestoActual = 0;
        let ultimoTotal = null;

        ordenados.forEach((a) => {
            if (a.total !== ultimoTotal) {
                puestoActual++;
                ultimoTotal = a.total;
            }
            conTotales[a.originalIndex].puesto = puestoActual;
        });

        return conTotales
    };

    const toggleGroup = (gIndex) =>
        setExpandedGroups((prev) => ({ ...prev, [gIndex]: !prev[gIndex] }));

    const toggleRound = (gIndex, rIndex) => {
        const key = `${gIndex}-${rIndex}`;
        setExpandedRounds((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="p-4">
            {grupos.map((grupo, gIndex) => (
                <div key={gIndex} className="mb-4 border rounded">
                    <div
                        className="flex items-center cursor-pointer bg-blue-100 p-2"
                        onClick={() => toggleGroup(gIndex)}
                    >
                        {expandedGroups[gIndex] ? <FaChevronDown /> : <FaChevronRight />}
                        <h2 className="ml-2 font-bold">{grupo.nombre}</h2>
                    </div>
                    {expandedGroups[gIndex] &&
                        grupo.rondas.map((ronda, rIndex) => {
                            const alumnosConPuesto = calcularPuestos(ronda.alumnos);
                            const key = `${gIndex}-${rIndex}`;
                            return (
                                <div key={rIndex} className="ml-4 border rounded mt-2">
                                    <div
                                        className="flex items-center cursor-pointer bg-green-100 p-2"
                                        onClick={() => toggleRound(gIndex, rIndex)}
                                    >
                                        {expandedRounds[key] ? <FaChevronDown /> : <FaChevronRight />}
                                        <h3 className="ml-2 font-semibold">{ronda.nombre}</h3>
                                    </div>
                                    {expandedRounds[key] && (
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full border mt-2">
                                                <thead className="bg-gray-200">
                                                    <tr>
                                                        <th className="border p-2">Alumno</th>
                                                        <th className="border p-2">Palabra</th>
                                                        {nameCriterios.map((c, idx) => (
                                                            <th key={idx} className="border p-2">
                                                                {c}
                                                            </th>
                                                        ))}
                                                        <th className="border p-2">Total</th>
                                                        <th className="border p-2">Puesto</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {alumnosConPuesto.map((al) => (
                                                        <tr key={al.originalIndex} className="text-center">
                                                            <td className="border p-2 font-bold">{al.alumno}</td>
                                                            <td className="border p-2 italic">{al.palabra}</td>
                                                            {al.criterios.map((c, cIndex) => (
                                                                <td key={cIndex} className="border p-2">
                                                                    <div className="flex items-center justify-center gap-2">
                                                                        <button
                                                                            onClick={() =>
                                                                                cambiarCriterio(
                                                                                    gIndex,
                                                                                    rIndex,
                                                                                    al.originalIndex,
                                                                                    cIndex,
                                                                                    -1
                                                                                )
                                                                            }
                                                                            disabled={c === 0}
                                                                            className="p-1 bg-red-200 rounded disabled:opacity-50"
                                                                        >
                                                                            <FaMinus />
                                                                        </button>
                                                                        <span>{c}</span>
                                                                        <button
                                                                            onClick={() =>
                                                                                cambiarCriterio(
                                                                                    gIndex,
                                                                                    rIndex,
                                                                                    al.originalIndex,
                                                                                    cIndex,
                                                                                    1
                                                                                )
                                                                            }
                                                                            disabled={c === 5}
                                                                            className="p-1 bg-green-200 rounded disabled:opacity-50"
                                                                        >
                                                                            <FaPlus />
                                                                        </button>
                                                                    </div>
                                                                    <div className="w-full h-2 bg-gray-200 rounded mt-1">
                                                                        <div
                                                                            className="h-full bg-blue-400 rounded"
                                                                            style={{ width: `${(c / 5) * 100}%` }}
                                                                        ></div>
                                                                    </div>
                                                                </td>
                                                            ))}
                                                            <td className="border p-2 font-bold">{al.total}</td>
                                                            <td className="border p-2">#{al.puesto}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
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
