
import { GoogleGenAI, Type } from "@google/genai";
import { Exam } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateStudyPlan = async (exams: Exam[]) => {
  const prompt = `
    Aşağıdaki sınav listesine göre 7 günlük optimize edilmiş bir çalışma planı hazırla. 
    Zor sınavlara daha fazla zaman ayır ve sınav tarihlerine göre önceliklendir. 
    Çıktı JSON formatında olmalı ve her gün için en az 3 çalışma seansı içermeli.
    
    Sınavlar: ${JSON.stringify(exams)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "Günün ismi (Pazartesi, vb.)" },
              sessions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    time: { type: Type.STRING },
                    subject: { type: Type.STRING },
                    topic: { type: Type.STRING },
                    duration: { type: Type.STRING }
                  },
                  required: ["time", "subject", "topic", "duration"]
                }
              }
            },
            required: ["day", "sessions"]
          }
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("AI Planlama Hatası:", error);
    return null;
  }
};

export const getQuickTip = async () => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Öğrenciler için sınav haftasında verimliliği artıracak 1 adet kısa ve etkili tavsiye ver. Türkçe olsun.",
  });
  return response.text;
};
