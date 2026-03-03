import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setExtractedData(null);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Calling our Python backend!
      const response = await fetch('http://localhost:8000/api/v1/extract-kyc', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to extract data. Is your Python backend running?');
      }

      const result = await response.json();
      const parsedData = JSON.parse(result.data);
      setExtractedData(parsedData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Aadhar e-KYC Extractor</h1>
      
      <div style={{ border: '2px dashed #ccc', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      {preview && (
        <div style={{ display: 'flex', gap: '20px', marginTop: '20px', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 300px' }}>
            <h3>Document Preview</h3>
            <img src={preview} alt="Aadhar Preview" style={{ width: '100%', borderRadius: '8px', border: '1px solid #eee' }} />
            <button 
              onClick={handleUpload} 
              disabled={loading}
              style={{ marginTop: '10px', padding: '10px 20px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '100%' }}
            >
              {loading ? 'Processing Document...' : 'Run Extraction'}
            </button>
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <h3>Extracted Data</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            {extractedData ? (
              <div style={{ background: '#f8f9fa', padding: '15px', borderRadius: '8px', border: '1px solid #ddd' }}>
                <p><strong>Name:</strong> {extractedData.name}</p>
                <p><strong>Aadhar Number:</strong> {extractedData.aadhar_number}</p>
                <p><strong>DOB:</strong> {extractedData.dob}</p>
                <p><strong>Gender:</strong> {extractedData.gender}</p>
                <p><strong>Address:</strong> {extractedData.address}</p>
              </div>
            ) : (
              <p style={{ color: '#666' }}>Upload an image and run extraction to see results here.</p>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

export default App;