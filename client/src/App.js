import React, { useEffect, useState } from 'react';
import './App.css';
import { VscArrowSwap } from 'react-icons/vsc';
import { countries } from './data';
import axios from 'axios'; // Import Axios
axios.defaults.baseURL = 'http://localhost:8081/';
function App() {
  const [hi, setHi] = useState(false);
  const [translations, setTranslations] = useState([]);
  const [fromLanguage, setFromLanguage] = useState('en-GB');
  const [toLanguage, setToLanguage] = useState('hi-IN');
  const handleClick = () => {
    setHi(!hi); 
  };

  useEffect (() => {

    let selectors = document.querySelectorAll('select');
    let fromText = document.querySelector ('#fromText');
    let toText = document.querySelector ('#toText');
    let temp1 = selectors[0].value;
    let temp2 = fromText.value;
    selectors[0].value = selectors[1].value;
    fromText.value = toText.value;
    selectors[1].value = temp1;
    toText.value = temp2;
}, [hi])

  useEffect(() => {
    fetchTranslations();
  }, []);

  const fetchTranslations = async () => {
    try {
      const config = {
        url:'/translations',
      }
      const response = await axios(config); 
      setTranslations(response.data);
    } catch (error) {
      console.error('Error fetching translation history:', error);
    }
  };

  const translateText = async () => {
    const fromText = document.querySelector('#fromText').value.trim();
    if (!fromText) return;

    try {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`;
      const response = await axios.get(apiUrl); 
      const translatedText = response.data.responseData.translatedText;
      document.querySelector('#toText').value = translatedText;
      saveTranslationToBackend(fromText, translatedText);
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const saveTranslationToBackend = async (originalText, translatedText) => {
    try {
      const config ={
        url:'/translations',
        method:'post',
        data:{
          originalText,
          translatedText
        }
      }
      await axios(config); 
      fetchTranslations(); 
    } catch (error) {
      console.error('Error saving translation:', error);
    }
  };

  return (
    <div className="App">
      <h1>LANGUAGE TRANSLATOR</h1>
      <div className="mainArea">
        <div className="translateArea">
          <div className="from">
            <textarea name="fromText" id="fromText" placeholder="Type here..."></textarea>
          </div>
          <div className="to">
            <textarea name="toText" id="toText" placeholder="Translation" readOnly></textarea>
          </div>
        </div>
        <div className="functionality">
          <div className="from">
            <select value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
              {Object.entries(countries).map(([countryCode, countryName]) => (
                <option key={countryCode} value={countryCode}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>
          <div className="exchangeIcon" onClick={handleClick}>
            <i>
              <VscArrowSwap />
            </i>
          </div>
          <div className="to">
            <select value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
              {Object.entries(countries).map(([countryCode, countryName]) => (
                <option key={countryCode} value={countryCode}>
                  {countryName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button id="translateBtn" onClick={translateText}>
          TRANSLATE
        </button>
      </div>
      <div className="translationHistory">
        <h2>Translation History</h2>
        <ul>
          {translations.map((translation, index) => (
            <li key={index}>
              <p>
                <strong>Original:</strong> {translation.originalText}
              </p>
              <p>
                <strong>Translated:</strong> {translation.translatedText}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
