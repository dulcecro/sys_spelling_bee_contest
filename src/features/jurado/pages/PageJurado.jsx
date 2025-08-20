import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import {
    getGrades,
    getRoundsByGroupId,
    getStudentsByRoundId,
    saveScore,
    getCategories,
    createRound, // <-- nuevo endpoint
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

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    useEffect(() => {
        getGrades()
            .then((res) => setGrupos(res.data))
            .catch((err) => console.error("Error al obtener grupos:", err));
    }, []);

    const toggleGroup = (idGrade) => {
        setExpandedGroups((prev) => ({ ...prev, [idGrade]: !prev[idGrade] }));

        if (!roundsData[idGrade]) {
            setLoadingRounds((prev) => ({ ...prev, [idGrade]: true }));
            getRoundsByGroupId(idGrade)
                .then((res) => {
                    if (!res.data || res.data.length === 0) {
                        // si no hay rondas, abrir modal
                        setSelectedGroup(idGrade);
                        setShowModal(true);
                        getCategories()
                            .then((r) => setCategories(r.data || []))
                            .catch((err) =>
                                console.error("Error al obtener categorías:", err)
                            );
                    }
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
                        idWordRound: item.idWordRound,
                        close: Boolean(item.close),
                        position: item.position,
                        active: item.active || false
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
                        ? alumno
                        : {
                            ...alumno,
                            criterios: alumno.criterios.map((valor, ci) =>
                                ci === cIndex
                                    ? Math.min(5, Math.max(0, valor + delta))
                                    : valor
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

        saveScore(alumno.idStudentEventRound, payload)
            .then(() => {
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

    const handleCreateRound = (id_category) => {
        if (!selectedGroup || !id_category) return;
        const idCategory = Number(id_category, 10)
        createRound({ idGrade: selectedGroup, idCategory })
            .then(() => {
                // recargar rondas del grupo
                getRoundsByGroupId(selectedGroup).then((res) => {
                    setRoundsData((prev) => ({
                        ...prev,
                        [selectedGroup]: res.data || [],
                    }));
                });
                setShowModal(false);
                setSelectedGroup(null);
                setSelectedCategory(null);
            })
            .catch((err) => console.error("Error al crear ronda:", err));
    };

    return (
        <div>
            <Header />

            <div className="p-4 mt-10">
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
                                                    Round {round.numberRound}
                                                </h3>
                                            </div>
                                            {/* Aquí iría el render de alumnos */}
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal de categorías */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                        <h2 className="text-lg font-bold mb-4">
                            Crear ronda para:{" "}
                            {grupos.find((g) => g.idGrade === selectedGroup)?.gradeName +
                                " " +
                                grupos.find((g) => g.idGrade === selectedGroup)?.levelName}
                        </h2>

                        {/* Select de categorías */}
                        <label className="block mb-2 font-medium">Selecciona categoría</label>
                        <select
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full border rounded p-2 mb-4"
                            value={selectedCategory || ""}
                        >
                            <option value="" disabled>
                                -- Selecciona --
                            </option>
                            {categories.map((cat) => (
                                <option key={cat.idCategory} value={cat.idCategory}>
                                    {cat.categoryName} (Dif: {cat.difficulty})
                                </option>
                            ))}
                        </select>

                        {/* Botones */}
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleCreateRound(selectedCategory)}
                                disabled={!selectedCategory}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                Crear Ronda
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
