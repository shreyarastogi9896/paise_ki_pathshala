import React, { useState } from 'react';
import axios from 'axios';

const DocumentUpload = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/api/ocr-analyze', formData);
      setResult(res.data);
    } catch (err) {
      alert('Error analyzing document');
    }
  };

  return (
    <div className="p-4">
      <h2>Upload Document for Clause Explanation</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Analyze</button>

      {result && (
        <div className="mt-4">
          <h4>Important Clauses:</h4>
          <p>{result.clauses}</p>
          <h5>Raw Extracted Text:</h5>
          <pre>{result.text}</pre>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
