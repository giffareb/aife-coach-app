
import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.error("API_KEY is not configured in environment variables. Aife Coach will not be able to connect.");
}

const modelName = 'gemini-2.5-flash-preview-04-17';
const systemInstruction = `คุณคือ "Aife Coach" เป็น AI life coach ที่มีความเห็นอกเห็นใจ เข้าใจง่าย และให้กำลังใจอย่างอบอุ่น คุณจะตอบเป็นภาษาไทยเสมอ เป้าหมายของคุณคือการช่วยให้ผู้ใช้รู้สึกดีขึ้น มีพลังบวก และมองเห็นทางออกของปัญหาด้วยคำแนะนำที่สร้างสรรค์และไม่ซ้ำซากจำเจ หลีกเลี่ยงการตอบแบบหุ่นยนต์ ให้ตอบเหมือนคุยกับเพื่อนที่ปรึกษาที่ไว้ใจได้`;

export const sendMessageToAife = async (
  userInput: string,
  existingChat: Chat | null
): Promise<{ responseText: string; chat: Chat }> => {
  if (!ai) {
    throw new Error("Aife Coach ไม่สามารถเริ่มการสนทนาได้ กรุณาตรวจสอบการตั้งค่า API Key");
  }

  let currentChat = existingChat;

  try {
    if (!currentChat) {
      // Start a new chat session
      currentChat = ai.chats.create({
        model: modelName,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.75, // Slightly increased for more varied, empathetic responses
          topP: 0.95,
          topK: 40,
        },
        // history: [] // Optionally, you can initialize with history if needed
      });
    }

    const response: GenerateContentResponse = await currentChat.sendMessage({ message: userInput });
    
    const text = response.text;
    if (!text) {
        // This case should ideally be rare with successful API calls
        throw new Error("Aife Coach ไม่ได้ส่งข้อความตอบกลับ ลองใหม่อีกครั้งนะคะ");
    }
    return { responseText: text, chat: currentChat };

  } catch (error) {
    console.error("Error communicating with Aife Coach (Gemini API):", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("API Key ที่ใช้สำหรับ Aife Coach ไม่ถูกต้อง กรุณาตรวจสอบการตั้งค่า");
        }
        // It's good to rethrow specific, actionable errors or a generic one if unsure.
        throw new Error(`เกิดข้อผิดพลาดในการสื่อสารกับ Aife Coach: ${error.message}`);
    }
    // Fallback for non-Error objects
    throw new Error("เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุในการสื่อสารกับ Aife Coach");
  }
};
