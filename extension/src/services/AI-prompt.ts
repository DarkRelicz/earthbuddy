import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const [inputValue, setInputValue] = useState('');
const [promptResponses, setpromptResponses] = useState([]);
const [loading, setLoading] = useState(false);
const genAI = new GoogleGenerativeAI(
    "AIzaSyClL2FB10FwOfTWzSqQgVWZVdyok7jKZhw"
// add your api key here
  );

export const getResponseForGivenPrompt = async () => {
    // try {
    //   setLoading(true)
    //   const model = genAI.getGenerativeModel({ model: "gemini-2" });
    //   const result = await model.generateContent(inputValue);
    //   setInputValue('')
    //   const response = result.response;
    //   const text = response.text();
    //   console.log(text)
    //   setpromptResponses([...promptResponses]);
  
    //   setLoading(false);
    //   console.log(response)
    //   // return response
    // }
    // catch (error) {
    //   console.log(error)
    //   console.log("Something Went Wrong");
    //   setLoading(false)
    // }
}

