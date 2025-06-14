
import React, { useState, useCallback } from 'react';
import { sendMessageToAife } from './src/services/geminiService.ts';
import { LoadingIcon } from './src/components/LoadingIcon.tsx';
import { MessageBox } from './src/components/MessageBox.tsx';
import type { Chat } from '@google/genai';

const INITIAL_COACH_MESSAGE = "สวัสดีค่ะ Aife Coach ยินดีต้อนรับค่ะ 😊พิมพ์ความรู้สึกหรือเรื่องที่อยากปรึกษาเข้ามาได้เลยนะคะ Aife พร้อมรับฟังและให้กำลังใจค่ะ";

const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('');
  const [coachMessage, setCoachMessage] = useState<string>(INITIAL_COACH_MESSAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);

  const handleSubmit = useCallback(async () => {
    if (!userInput.trim()) {
      setError("กรุณาพิมพ์ข้อความก่อนส่งนะคะ");
      return;
    }
    setIsLoading(true);
    setError(null);
    setCoachMessage("Aifeกำลังครุ่นคิด... 🤔"); 

    try {
      const { responseText, chat } = await sendMessageToAife(userInput, chatSession);
      setCoachMessage(responseText);
      setChatSession(chat);
      setUserInput(''); 
    } catch (err) {
      console.error("Error in chat:", err);
      const errorMessage = err instanceof Error ? err.message : "มีบางอย่างผิดพลาด โปรดลองอีกครั้งค่ะ";
      setError(errorMessage);
      setCoachMessage("ขออภัยค่ะ มีข้อผิดพลาดเกิดขึ้น โปรดลองอีกครั้งหรือเริ่มหัวข้อใหม่นะคะ");
    } finally {
      setIsLoading(false);
    }
  }, [userInput, chatSession]);

  const handleNewTopic = () => {
    setChatSession(null);
    setUserInput('');
    setCoachMessage(INITIAL_COACH_MESSAGE);
    setError(null);
    setIsLoading(false); 
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-teal-500 selection:text-white">
      <div className="bg-white shadow-2xl rounded-xl p-6 md:p-10 w-full max-w-2xl transform transition-all duration-500 hover:scale-105">
        <header className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-indigo-600">
            Aife Coach
          </h1>
          <p className="text-gray-600 mt-2 text-lg">เพื่อนคู่คิด AI ที่พร้อมให้กำลังใจคุณ</p>
        </header>

        <main>
          <MessageBox message={coachMessage} />

          {error && (
            <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="mt-8">
            <textarea
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="ระบายความรู้สึก หรือสิ่งที่กังวลใจได้ที่นี่เลยค่ะ..."
              className="w-full p-4 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-300 min-h-[120px] text-gray-700"
              rows={4}
              disabled={isLoading}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-center justify-center">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !userInput.trim()}
              className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingIcon className="w-5 h-5 mr-2" />
                  กำลังส่ง...
                </>
              ) : (
                "ปรึกษา Aife"
              )}
            </button>
            {chatSession && (
              <button
                onClick={handleNewTopic}
                disabled={isLoading}
                className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-semibold py-3 px-8 rounded-lg shadow-md hover:shadow-lg transform transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ปรึกษาเรื่องอื่นๆ
              </button>
            )}
          </div>
        </main>
        
        <footer className="mt-10 text-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Aife Coach. Powered by Generative AI.</p>
          <p>ข้อความนี้สร้างโดย AI และมีไว้เพื่อให้กำลังใจเบื้องต้นเท่านั้น</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
