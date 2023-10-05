import React, {useState} from 'react'
import axios from 'axios'
export const Landing = () => {
  const [summary, setSummary] = useState('')
  const [articleTitle, setArticleTitle] = useState('')
  const [lang, setLang] = useState('en')
  const handleSummarize = async () =>{
    try {
      console.log(articleTitle)
      const response = await axios.get(`/api/wikimedia?articleTitle=${encodeURIComponent(articleTitle)}&lang=${lang}`)
      console.log(lang); 
      setSummary(response.data)
    } catch (err) {
      console.error(err)
    }
  };

  const darkMode = () =>{
    document.body.classList.toggle('dark')
  }
  return (
    <div className="container light">
    <button id="dark-mode-toggle" onClick={darkMode}><i className="fa-solid fa-moon fa-xl"></i> Dark Mode</button>
    <h1>WikiBrief</h1>
    <div className="input-area">
      <input type="text" id="article-link" placeholder="Enter Wikipedia Article Title" value={articleTitle} onChange={(e) => {setArticleTitle(e.target.value)}}/>
      <button id="summarize-btn" onClick={handleSummarize}>Summarize</button>
      <select id="language-select" value={lang} onChange={(e) => {setLang(e.target.value)}}>
        {console.log(lang)}
        <option value="en">English</option>
        <option value="hi">Hindi</option>
        <option value="es">Spanish</option>
        <option value="de">German</option>
      </select>
    </div>
    <div className="summary-area">
        <h2>Summary</h2>
        <textarea id="summary-result" value={summary} readOnly/>
      </div>
      <button id="download-btn"><i className="fa-solid fa-download"></i> Download</button>
  </div>
  )
}
