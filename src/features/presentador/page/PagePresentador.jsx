import React from 'react';
import Header from "../../../components/Header";
import { FaVolumeUp } from 'react-icons/fa';
// Nota: coloca la imagen de la abeja (bee.png) en la misma carpeta que este archivo
// Puedes renombrar el archivo generado a 'bee.png' y colocarlo en public o en src/assets

export const PagePresentador = () => {
    // Pronunciaciones (IPA) comunes: British /dɒg/  — American /dɔg/ or /dɑg/
    const word = 'Dog';
    const ipaBritish = '/dɒg/';
    const ipaAmerican = '/dɔːg/';

    return (
        <div>
            <Header />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6 mt-10">
                <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row gap-6 items-center">
                    {/* Left: Text */}
                    <div className="flex-1">
                        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">The word is</h2>
                        <div className="flex items-baseline gap-4">
                            <span className="text-6xl font-bold text-yellow-600 tracking-tight">{word}</span>
                            <button
                                aria-label="play pronunciation"
                                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded shadow hover:bg-blue-700"
                                onClick={() => {
                                    // sintetizador simple: usa SpeechSynthesis del navegador si está disponible
                                    if (typeof window !== 'undefined' && window.speechSynthesis) {
                                        const utter = new SpeechSynthesisUtterance(word);
                                        // ajustar voz y velocidad si quieres
                                        utter.rate = 0.95;
                                        window.speechSynthesis.speak(utter);
                                    }
                                }}
                            >
                                <FaVolumeUp /> Pronounce
                            </button>
                        </div>

                        <p className="mt-4 text-gray-600">Pronunciation (IPA):</p>
                        <div className="mt-1 flex gap-4">
                            <span className="px-3 py-2 bg-gray-100 rounded">British: <strong className="ml-1">{ipaBritish}</strong></span>
                            <span className="px-3 py-2 bg-gray-100 rounded">American: <strong className="ml-1">{ipaAmerican}</strong></span>
                        </div>

                        <p className="mt-4 text-sm text-gray-500">Tip: pulsa <em>Pronounce</em> para escuchar la palabra usando el sintetizador del navegador.</p>
                    </div>

                    {/* Right: Bee image */}
                    <div className="w-56 h-56 flex-shrink-0 rounded-md overflow-hidden flex items-center justify-center bg-yellow-50">
                        {/* Coloca la imagen 'bee.png' aquí (en la misma carpeta). Si la pones en public, usa '/bee.png' como src */}
                        <img
                            src={'/bee.png'}
                            alt="Spelling bee bee"
                            className="object-contain w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
