"use client";

import Tesseract from "tesseract.js";
import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI('AIzaSyAHNSEMKs5tvrvUK2ExaHeDb-1Cfr2BHhc');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

 

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Home() {
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const[response, setResponse] = useState("Loading")
const [showText, setShowText] = useState(false); // State to control text visibility
const [predicted, setpredicted]= useState("Loading")
const API_KEY = 'b6778e4b19a87c7521df76ed24c525f6';

async function PredictaiRun() {
  const prompt = `I am farmer Suggest me 3 best crop in JSON format like {} of Key Value Format on these Parameter Now currently, here is parameter ${selectedCity} according to these 
  parameter:
  * **Salinity:**  
  * **Sodicity:**  
  * **pH:**  
  * **Temperature Range:**  
  * **Sea level:**  
  * **Ground Level:**  
  * **Humidity:**  
  * **Soil Drainage:**
  Suggest me 3 best crop to grow in JSON format like {} of Key Value Format , key should be crop name and value should be why to producse
  `;
  const result = await model.generateContent(prompt);
  const response= await result.response;
  const text = response.text();
  console.log("Response of pridict:", text)
  setpredicted(text)
}


useEffect(() => { 
  PredictaiRun();
}, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractText(file);
    }
  };

  const extractText = (file) => {
    setLoading(true);
    Tesseract.recognize(
      file,
      "eng",
      {
        logger: (m) => console.log(m),
      }
    )
    .then(({ data: { text } }) => {
      setText(text);
      setLoading(false);
    })
    .catch((error) => {
      console.error(error);
      setLoading(false);
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
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
     <div>
     {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="mt-4">
          {image && <img src={image} alt="Uploaded" className="mb-4" />}
          {text && <p className="text-center text-gray-700">{text}</p>}
        </div>
      )}
     </div>


      
    </main>
  );
}
