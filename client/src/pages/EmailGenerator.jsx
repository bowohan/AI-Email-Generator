import React, { useState } from 'react';

const EmailGenerator = () => {
  const [formData, setFormData] = useState({
    subject: '',
    tone: 'professional',
    purpose: '',
    recipient: '',
    length: 'medium'
  });
  
  const [generatedEmail, setGeneratedEmail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate email');
      }

      setGeneratedEmail(data.email);
      
      // Save email to localStorage for history
      const savedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
      const emailWithId = {
        ...data.email,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      };
      savedEmails.unshift(emailWithId); // Add to beginning of array
      localStorage.setItem('generatedEmails', JSON.stringify(savedEmails));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedEmail) {
      navigator.clipboard.writeText(generatedEmail.content);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5', padding: '32px 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>
            AI-Powered Email Generator
          </h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>
            Generate professional emails with AI assistance
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Form Section */}
          <div className="form-container">
            <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '24px' }}>
              Email Configuration
            </h2>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Subject */}
              <div className="form-group">
                <label htmlFor="subject" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Email Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  placeholder="Enter email subject..."
                />
              </div>

              {/* Tone */}
              <div className="form-group">
                <label htmlFor="tone" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Tone
                </label>
                <select
                  id="tone"
                  name="tone"
                  value={formData.tone}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="friendly">Friendly</option>
                  <option value="formal">Formal</option>
                  <option value="persuasive">Persuasive</option>
                </select>
              </div>

              {/* Purpose */}
              <div className="form-group">
                <label htmlFor="purpose" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Purpose
                </label>
                <input
                  type="text"
                  id="purpose"
                  name="purpose"
                  value={formData.purpose}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  placeholder="e.g., follow-up, introduction, marketing..."
                />
              </div>

              {/* Recipient */}
              <div className="form-group">
                <label htmlFor="recipient" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Target Recipient
                </label>
                <input
                  type="text"
                  id="recipient"
                  name="recipient"
                  value={formData.recipient}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                  placeholder="e.g., potential clients, team members..."
                />
              </div>

              {/* Length */}
              <div className="form-group">
                <label htmlFor="length" style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Length
                </label>
                <select
                  id="length"
                  name="length"
                  value={formData.length}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px' }}
                >
                  <option value="short">Short (2-3 sentences)</option>
                  <option value="medium">Medium (1-2 paragraphs)</option>
                  <option value="long">Long (3+ paragraphs)</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="btn"
                style={{ width: '100%', padding: '12px 24px', backgroundColor: loading ? '#9ca3af' : '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: loading ? 'not-allowed' : 'pointer' }}
              >
                {loading ? 'Generating...' : 'Generate Email'}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <div className="error">
                <p>{error}</p>
              </div>
            )}
          </div>

          {/* Generated Email Section */}
          <div className="email-display">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827' }}>
                Generated Email
              </h2>
              {generatedEmail && (
                <button
                  onClick={copyToClipboard}
                  style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
                >
                  Copy
                </button>
              )}
            </div>

            {generatedEmail ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>Subject:</h3>
                  <p style={{ color: '#374151', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '6px' }}>
                    {generatedEmail.subject}
                  </p>
                </div>
                
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: '500', color: '#111827', marginBottom: '8px' }}>Content:</h3>
                  <div className="email-content">
                    {generatedEmail.content}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px' }}>
                    {generatedEmail.tone}
                  </span>
                  {generatedEmail.purpose && (
                    <span style={{ backgroundColor: '#dbeafe', color: '#1e40af', padding: '4px 8px', borderRadius: '4px' }}>
                      {generatedEmail.purpose}
                    </span>
                  )}
                  <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '4px 8px', borderRadius: '4px' }}>
                    {generatedEmail.length}
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '48px 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📧</div>
                <p>Your generated email will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailGenerator;