import { useEffect, useState } from "react";
import "./styles.css";

const synth = window.speechSynthesis;
const rateMin = 0.1;
const rateHigh = 10;
const rateStep = 0.1;
const pitchMin = 0;
const pitchHigh = 2;
const pitchStep = 0.1;

/**
 * App component.
 */
export default function App() {
  const [phrase, setPhrase] = useState();
  const [voice, setVoice] = useState();
  const [voiceOptions, setVoiceOptions] = useState();
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [language, setLanguage] = useState("en-US");
  const [languageOptions, setLanguageOptions] = useState([]);

  useEffect(() => {
    if (typeof "speechSynthesis" !== undefined) {
      const voices = speechSynthesis.getVoices();
      // Set voice options.
      setVoiceOptions(voices);
      // Set language options.
      const langs = voices.map((v) => v.lang);
      const uniqueLangs = new Set(langs);
      setLanguageOptions(Array.from(uniqueLangs.values()));
    }
  }, []);

  const handlePhraseChange = (event) => {
    setPhrase(event.target.value);
  };

  const handleVoiceChange = (event) => {
    const selectedVoiceURI = event.target.value;

    for (let i = 0; i < voiceOptions.length; i++) {
      const voiceOpt = voiceOptions[i];

      if (voiceOpt.voiceURI === selectedVoiceURI) {
        setVoice(voiceOpt);
        break;
      }
    }
  };

  const handleRateChange = (event) => {
    setRate(event.target.value);
  };

  const handlePitchChange = (event) => {
    setPitch(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleClick = (event) => {
    event.preventDefault();

    const utterThis = new SpeechSynthesisUtterance(phrase);

    utterThis.voice = voice;
    utterThis.lang = language;
    utterThis.rate = rate;

    if (pitch > 0) {
      utterThis.pitch = pitch;
    }

    synth.speak(utterThis);
  };

  const handlePause = (event) => {
    synth.pause();
  };

  const handleResume = (event) => {
    synth.resume();
  };

  return (
    <div className="App no-scroll">
      <div className="main w-100 h-100">
        <div className="form-container h-100 space-even no-scroll column">
          <h2>Synthetic Speech</h2>

          <div className="form-input column">
            <label htmlFor="lang">Choose langage: {language}</label>
            <select
              id="lang"
              name="lang"
              value={language}
              onChange={handleLanguageChange}
            >
              {languageOptions &&
                languageOptions.map((langOpt, index) => (
                  <option key={index} id={index} value={langOpt}>
                    {langOpt}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-input column">
            <label htmlFor="voice">Choose a voice:</label>
            <select
              id="voice"
              name="voice"
              value={voice?.voiceURI}
              onChange={handleVoiceChange}
            >
              {voiceOptions &&
                voiceOptions.map((opt, index) => (
                  <option key={index} id={index} value={opt.voiceURI}>
                    {opt.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="form-input column">
            <label htmlFor="pitch">Pitch: {pitch}</label>
            <input
              type="range"
              id="pitch"
              name="pitch"
              min={pitchMin}
              max={pitchHigh}
              value={pitch}
              step={pitchStep}
              onChange={handlePitchChange}
            />
          </div>

          <div className="form-input column">
            <label htmlFor="speech-rate">Speech rate: {rate}</label>
            <input
              type="range"
              id="speech-rate"
              name="speech-rate"
              min={rateMin}
              max={rateHigh}
              value={rate}
              step={rateStep}
              onChange={handleRateChange}
            />
          </div>

          <div className="form-input column">
            <label htmlFor="phrase">Enter phrase:</label>
            <textarea
              name="phrase"
              id="phrase"
              cols="60"
              rows="10"
              value={phrase}
              onChange={handlePhraseChange}
            ></textarea>
          </div>

          <div className="form-input space-even row">
            <input type="button" onClick={handleClick} value="Speak" />
            <input type="button" onClick={handlePause} value="Pause" />
            <input type="button" onClick={handleResume} value="Resume" />
          </div>
        </div>
      </div>
    </div>
  );
}
