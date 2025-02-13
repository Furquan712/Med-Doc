"use client";

import Tesseract from "tesseract.js";
import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

const genAI = new GoogleGenerativeAI('AIzaSyAHNSEMKs5tvrvUK2ExaHeDb-1Cfr2BHhc');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export default function Home() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [analyzeClicked, setAnalyzeClicked] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractText(file);
    }
  };

  const extractText = (file) => {
    setLoading(true);
    Tesseract.recognize(file, "eng", {
      logger: (m) => console.log(m),
    })
    .then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
  };

  const aiRun = async () => {
    const prompt = `Consider you are a medical expert. Analyze this medical report like a medical expert. Provide recommendations for precautions and suggest foods that can help improve the patient's health based on the findings and give what should avoid in very easy language.
    Here is the text of the medical report:\n\n${text}
    
    And at the end suggest report how many suffering from this India give Data and Stats
    And Give Complete response first in english and and then in easy Hindi like hinglish. So Everyone can understand easily`;
    try {
      const result = await model.generateContent(prompt);
      const responseText = await result.response.text();
      setResponse(responseText);
    } catch (error) {
      console.error("AI generation error:", error);
    }
  };

  const handleAnalyzeClick = () => {
    if (!image) {
      setShowWarning(true);
      return;
    }
    setAnalyzeClicked(true);
    setShowWarning(false);
    aiRun();
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-8 md:p-12 lg:p-24">
      <div className="text-center">
        <h1 className="mb-4 text-2xl font-extrabold text-gray-900 dark:text-white md:text-3xl lg:text-4xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">Med-Doc:</span> Transform Your Health with AI-Powered Insights
        </h1>
        <p className="text-base font-normal text-gray-500 lg:text-lg dark:text-gray-400">
          HealthGuard AI is your personal health advisor, utilizing advanced artificial intelligence to analyze medical reports with precision. Receive expert recommendations on precautions and discover tailored dietary suggestions to enhance your well-being. Empower your health journey with actionable insights and personalized guidance.
        </p>
      </div>
      <div className="flex items-center justify-center w-full mt-4">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-4 pb-5">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      {showWarning && (
        <p className="mt-2 text-red-600">Please first upload your medical report</p>
      )}
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="mt-4">
            {image && <img src={image} alt="Uploaded" className="w-full max-w-xs rounded-md shadow-md" />}
          </div>
        )}
      </div>
      <button
        onClick={handleAnalyzeClick}
        className="mt-4 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition duration-200"
      >
        Analyze Report
      </button>
      {analyzeClicked && (
        <div className="mt-4 p-4 border border-gray-300 rounded-lg shadow-lg max-w-full sm:max-w-md md:max-w-lg">
          <h2 className="text-lg font-semibold mb-2">AI Analysis</h2>
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </main>
  );
}
