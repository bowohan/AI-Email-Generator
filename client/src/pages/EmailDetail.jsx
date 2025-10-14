import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EmailDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmail();
  }, [id]);

  const fetchEmail = async () => {
    try {
      setLoading(true);
      // Get emails from localStorage
      const savedEmails = JSON.parse(localStorage.getItem('generatedEmails') || '[]');
      const emailData = savedEmails.find(email => email.id === id);
      
      if (emailData) {
        setEmail(emailData);
      } else {
        setError('Email not found');
      }
    } catch (err) {
      setError('Failed to fetch email');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (email) {
      navigator.clipboard.writeText(email.content);
      alert('Email copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getToneColor = (tone) => {
    const colors = {
      professional: '#3b82f6',
      casual: '#10b981',
      friendly: '#f59e0b',
      formal: '#8b5cf6',
      persuasive: '#ef4444'
    };
    return colors[tone] || '#6b7280';
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p>Loading email...</p>
        </div>
      </div>
    );
  }

  if (error || !email) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>❌</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#111827', marginBottom: '0.5rem' }}>
            Email Not Found
          </h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
            The email you're looking for doesn't exist or has been deleted.
          </p>
          <button
            onClick={() => navigate('/emails')}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Back to Email List
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '2rem 0'
    }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <button
            onClick={() => navigate('/emails')}
            style={{
              backgroundColor: '#f3f4f6',
              color: '#374151',
              border: 'none',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            ← Back to List
          </button>
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '500'
            }}
          >
            Copy Email
          </button>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '1.5rem'
        }}>
          <h1 style={{ 
            fontSize: '1.875rem', 
            fontWeight: 'bold', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            {email.subject}
          </h1>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            <span style={{
              backgroundColor: getToneColor(email.tone) + '20',
              color: getToneColor(email.tone),
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {email.tone}
            </span>
            {email.purpose && (
              <span style={{
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '0.25rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {email.purpose}
              </span>
            )}
            <span style={{
              backgroundColor: '#dcfce7',
              color: '#166534',
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: '500',
              textTransform: 'capitalize'
            }}>
              {email.length}
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Recipient
            </h3>
            <p style={{ color: '#6b7280' }}>{email.recipient}</p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#374151', marginBottom: '0.5rem' }}>
              Generated On
            </h3>
            <p style={{ color: '#6b7280' }}>{formatDate(email.createdAt)}</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: '#111827',
            marginBottom: '1rem'
          }}>
            Email Content
          </h2>
          <div style={{
            backgroundColor: '#f9fafb',
            padding: '1.5rem',
            borderRadius: '6px',
            border: '1px solid #e5e7eb',
            whiteSpace: 'pre-wrap',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            lineHeight: '1.6',
            color: '#374151'
          }}>
            {email.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetail;
