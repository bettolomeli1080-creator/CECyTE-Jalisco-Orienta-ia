
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, Recommendation } from "../types";

export const getCareerRecommendation = async (profile: UserProfile): Promise<{ recommendations: Recommendation[]; sources: any[] }> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const prompt = `Actúa como un orientador vocacional experto del CECYTE Jalisco. 
  Basado en la siguiente información del usuario, recomienda exactamente las 3 mejores carreras técnicas del CECYTE Jalisco que se adapten a él. 
  
  Información del usuario:
  - Ubicación/Ciudad: ${profile.location}
  - Intereses: ${profile.interests}
  - Experiencia: ${profile.experience}
  - Habilidades: ${profile.skills.join(', ')}

  Instrucciones:
  1. Identifica las carreras técnicas oficiales ofrecidas por CECYTE Jalisco (ej. Programación, Electromecánica, Puericultura, Biotecnología, Procesos de Gestión Administrativa, Mantenimiento Automotriz, etc.).
  2. Localiza qué planteles cercanos a ${profile.location} imparten estas carreras.
  3. Proporciona una explicación detallada de por qué cada carrera encaja con su perfil.
  4. Utiliza Google Search y Google Maps para verificar la vigencia de las carreras y la ubicación exacta de los planteles.
  
  Devuelve la respuesta en un formato narrativo pero estructurado, mencionando nombres específicos de planteles del CECYTE Jalisco (ej. Plantel Tonalá, Plantel Guadalajara, Plantel Puerto Vallarta, etc.).`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      tools: [
        { googleSearch: {} },
        { googleMaps: {} }
      ],
      // No schema when using googleMaps tool
    },
  });

  const text = response.text || "No se pudo generar una recomendación.";
  const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

  // Manual parsing for better UX since we can't use responseSchema with googleMaps tool
  // We'll return the raw text and the grounded sources to the UI.
  return {
    recommendations: [
      {
        careerName: "Recomendación Basada en IA",
        description: text,
        whyFits: "Análisis personalizado basado en tus intereses y cercanía.",
        planteles: [],
        links: []
      }
    ],
    sources: chunks
  };
};
