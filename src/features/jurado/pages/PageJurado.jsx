import React, { useState, useEffect } from "react";
import {
    getGroups,
    getRoundsByGroupId,
    getStudentsByRoundId,
    saveScore,
} from "../../../api/RoundAPI";
import {
    FaChevronDown,
    FaChevronRight,
    FaPlus,
    FaMinus,
    FaCheck,
} from "react-icons/fa";

const nameCriterios = [
    "Correct pronunciation",
    "Correct spelling",
    "Correct use of fluency",
    "Confidence and poise",
    "Proper start and ending",
];

export const PageJurado = () => {
    const [grupos, setGrupos] = useState([]);
    const [expandedGroups, setExpandedGroups] = useState({});
    const [roundsData, setRoundsData] = useState({});
    const [studentsData, setStudentsData] = useState({});
    const [loadingRounds, setLoadingRounds] = useState({});
    const [loadingStudents, setLoadingStudents] = useState({});
    const [saving, setSaving] = useState({});

    useEffect(() => {
        getGroups()
            .then((res) => setGrupos(res.data))
            .catch((err) => console.error("Error al obtener grupos:", err));
    }, []);

    const toggleGroup = (idGrade) => {
        setExpandedGroups((prev) => ({ ...prev, [idGrade]: !prev[idGrade] }));

        if (!roundsData[idGrade]) {
            setLoadingRounds((prev) => ({ ...prev, [idGrade]: true }));
            getRoundsByGroupId(idGrade)
                .then((res) => {
                    // Se espera un arreglo de rondas [{idRound, idGrade, numberRound, ...}]
                    setRoundsData((prev) => ({ ...prev, [idGrade]: res.data || [] }));
                })
                .catch((err) => console.error("Error al obtener rondas:", err))
                .finally(() =>
                    setLoadingRounds((prev) => ({ ...prev, [idGrade]: false }))
                );
        }
    };

    const toggleRound = (idRound) => {
        setExpandedGroups((prev) => ({
            ...prev,
            [idRound]: !prev[idRound],
        }));

        if (!studentsData[idRound]) {
            setLoadingStudents((prev) => ({ ...prev, [idRound]: true }));
            getStudentsByRoundId(idRound)
                .then((res) => {
                    // Mapeamos la data del backend a lo que usa la UI
                    const alumnos = (res.data || []).map((item) => ({
                        idStudentEventRound: item.idStudentEventRound,
                        alumno: `${item.paternalSurname} ${item.maternalSurname} ${item.nameStudent}`,
                        palabra: (item.word || "").trim(),
                        criterios: [
                            item.criterionOne,
                            item.criterionTwo,
                            item.criterionThree,
                            item.criterionFour,
                            item.criterionFive,
                        ],
                        // campos adicionales necesarios para guardar/bloquear
                        idWordRound: item.idWordRound,
                        close: Boolean(item.close),
                        position: item.position, // puede venir 0, o null; se ajustará al guardar
                    }));
                    setStudentsData((prev) => ({ ...prev, [idRound]: alumnos }));
                })
                .catch((err) => console.error("Error al obtener alumnos:", err))
                .finally(() =>
                    setLoadingStudents((prev) => ({ ...prev, [idRound]: false }))
                );
        }
    };

    const cambiarCriterio = (idRound, aIndex, cIndex, delta) => {
        setStudentsData((prev) => ({
            ...prev,
            [idRound]: prev[idRound].map((alumno, ai) =>
                ai === aIndex
                    ? alumno.close
                        ? alumno // bloqueado si close: true
                        : {
                            ...alumno,
                            criterios: alumno.criterios.map((valor, ci) =>
                                ci === cIndex ? Math.min(5, Math.max(0, valor + delta)) : valor
                            ),
                        }
                    : alumno
            ),
        }));
    };

    const sumaCriterios = (criterios) => criterios.reduce((a, b) => a + b, 0);

    const calcularPuestos = (alumnos) => {
        const conTotales = alumnos.map((a, idx) => ({
            ...a,
            total: sumaCriterios(a.criterios),
            originalIndex: idx,
        }));
        const ordenados = [...conTotales].sort((a, b) => b.total - a.total);
        let puestoActual = 0;
        let ultimoTotal = null;

        ordenados.forEach((a) => {
            if (a.total !== ultimoTotal) {
                puestoActual++;
                ultimoTotal = a.total;
            }
            conTotales[a.originalIndex].puesto = puestoActual;
        });
        return conTotales;
    };

    const handleSaveScore = (alumno, idRound) => {
        setSaving((prev) => ({ ...prev, [alumno.idStudentEventRound]: true }));

        // position: prioriza el que trae el backend; si no existe, usa el puesto calculado
        const computedPosition = Number.isFinite(alumno?.position)
            ? alumno.position
            : alumno.puesto;

        const payload = {
            idWordRound: alumno.idWordRound,
            criterionOne: alumno.criterios[0],
            criterionTwo: alumno.criterios[1],
            criterionThree: alumno.criterios[2],
            criterionFour: alumno.criterios[3],
            criterionFive: alumno.criterios[4],
            position: 0,
            close: true,
        };

        // PUT /round_student/{idStudentEventRound}
        saveScore(alumno.idStudentEventRound, payload)
            .then(() => {
                // marcar como cerrado en el estado local y consolidar 'position'
                setStudentsData((prev) => ({
                    ...prev,
                    [idRound]: prev[idRound].map((a) =>
                        a.idStudentEventRound === alumno.idStudentEventRound
                            ? { ...a, close: true, position: computedPosition }
                            : a
                    ),
                }));
            })
            .catch((err) => console.error("Error al guardar puntaje:", err))
            .finally(() =>
                setSaving((prev) => ({ ...prev, [alumno.idStudentEventRound]: false }))
            );
    };

    return (
        <div className="p-4">
            {grupos.map((grupo) => (
                <div key={grupo.idGrade} className="mb-4 border rounded">
                    <div
                        className="flex items-center cursor-pointer bg-blue-100 p-2"
                        onClick={() => toggleGroup(grupo.idGrade)}
                    >
                        {expandedGroups[grupo.idGrade] ? (
                            <FaChevronDown />
                        ) : (
                            <FaChevronRight />
                        )}
                        <h2 className="ml-2 font-bold">
                            {grupo.gradeName + " " + grupo.levelName}
                        </h2>
                    </div>

                    {expandedGroups[grupo.idGrade] && (
                        <div className="p-2">
                            {loadingRounds[grupo.idGrade] && <p>Cargando rondas...</p>}

                            {!loadingRounds[grupo.idGrade] &&
                                roundsData[grupo.idGrade] &&
                                roundsData[grupo.idGrade].map((round) => (
                                    <div key={round.idRound} className="mb-2 border rounded">
                                        <div
                                            className="flex items-center cursor-pointer bg-green-100 p-2"
                                            onClick={() => toggleRound(round.idRound)}
                                        >
                                            {expandedGroups[round.idRound] ? (
                                                <FaChevronDown />
                                            ) : (
                                                <FaChevronRight />
                                            )}
                                            <h3 className="ml-2 font-bold">
                                                Ronda {round.numberRound}
                                            </h3>
                                        </div>

                                        {expandedGroups[round.idRound] && (
                                            <div className="p-2 overflow-x-auto">
                                                {loadingStudents[round.idRound] && (
                                                    <p>Cargando alumnos...</p>
                                                )}

                                                {!loadingStudents[round.idRound] &&
                                                    studentsData[round.idRound] && (
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
                                                                    <th className="border p-2">Puntaje Total</th>
                                                                    <th className="border p-2">Puesto</th>
                                                                    <th className="border p-2">Acciones</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {calcularPuestos(
                                                                    studentsData[round.idRound]
                                                                ).map((al, aIndex) => (
                                                                    <tr
                                                                        key={aIndex}
                                                                        className={`text-center ${al.close ? "opacity-60" : ""
                                                                            }`}
                                                                    >
                                                                        <td className="border p-2 font-bold">
                                                                            {al.alumno}
                                                                        </td>
                                                                        <td className="border p-2 italic">
                                                                            {al.palabra}
                                                                        </td>

                                                                        {al.criterios.map((c, cIndex) => (
                                                                            <td key={cIndex} className="border p-2">
                                                                                <div className="flex items-center justify-center gap-2">
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            cambiarCriterio(
                                                                                                round.idRound,
                                                                                                aIndex,
                                                                                                cIndex,
                                                                                                -1
                                                                                            )
                                                                                        }
                                                                                        disabled={c === 0 || al.close}
                                                                                        className="p-1 bg-red-200 rounded disabled:opacity-50"
                                                                                    >
                                                                                        <FaMinus />
                                                                                    </button>
                                                                                    <span>{c}</span>
                                                                                    <button
                                                                                        onClick={() =>
                                                                                            cambiarCriterio(
                                                                                                round.idRound,
                                                                                                aIndex,
                                                                                                cIndex,
                                                                                                1
                                                                                            )
                                                                                        }
                                                                                        disabled={c === 5 || al.close}
                                                                                        className="p-1 bg-green-200 rounded disabled:opacity-50"
                                                                                    >
                                                                                        <FaPlus />
                                                                                    </button>
                                                                                </div>
                                                                                <div className="w-full h-2 bg-gray-200 rounded mt-1">
                                                                                    <div
                                                                                        className="h-full bg-blue-400 rounded"
                                                                                        style={{
                                                                                            width: `${(c / 5) * 100}%`,
                                                                                        }}
                                                                                    ></div>
                                                                                </div>
                                                                            </td>
                                                                        ))}

                                                                        <td className="border p-2 font-bold">
                                                                            {al.total}
                                                                        </td>
                                                                        <td className="border p-2">
                                                                            #{al.puesto}
                                                                        </td>
                                                                        <td className="border p-2">
                                                                            <button
                                                                                onClick={() =>
                                                                                    handleSaveScore(al, round.idRound)
                                                                                }
                                                                                disabled={
                                                                                    saving[al.idStudentEventRound] ||
                                                                                    al.close
                                                                                }
                                                                                className="p-2 bg-blue-200 rounded hover:bg-blue-300 disabled:opacity-50"
                                                                                title={
                                                                                    al.close
                                                                                        ? "Ronda del alumno cerrada"
                                                                                        : "Guardar y cerrar"
                                                                                }
                                                                            >
                                                                                <FaCheck />
                                                                            </button>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};
