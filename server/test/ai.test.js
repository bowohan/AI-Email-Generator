import request from 'supertest';
import app from '../index.js';

describe('AI Email Generator API', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /api/ai/generate', () => {
    it('should generate an email with valid parameters', async () => {
      const emailData = {
        subject: 'Test Email',
        tone: 'professional',
        purpose: 'Test purpose'
      };

      const response = await request(app)
        .post('/api/ai/generate')
        .send(emailData)
        .expect(200);

      expect(response.body).toHaveProperty('email');
      expect(response.body.email).toBeDefined();
      expect(typeof response.body.email).toBe('string');
    });

    it('should return 400 for missing required fields', async () => {
      const emailData = {
        subject: 'Test Email'
        // Missing tone and purpose
      };

      const response = await request(app)
        .post('/api/ai/generate')
        .send(emailData)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });

    it('should generate different tones correctly', async () => {
      const professionalData = {
        subject: 'Meeting Request',
        tone: 'professional',
        purpose: 'Schedule a meeting'
      };

      const casualData = {
        subject: 'Coffee Chat',
        tone: 'casual',
        purpose: 'Grab coffee'
      };

      const [professionalResponse, casualResponse] = await Promise.all([
        request(app).post('/api/ai/generate').send(professionalData),
        request(app).post('/api/ai/generate').send(casualData)
      ]);

      expect(professionalResponse.status).toBe(200);
      expect(casualResponse.status).toBe(200);
      
      // Different tones should produce different content
      expect(professionalResponse.body.email).not.toBe(casualResponse.body.email);
    });

    it('should handle different email lengths', async () => {
      const shortEmail = {
        subject: 'Quick Update',
        tone: 'casual',
        purpose: 'Brief update',
        length: 'short'
      };

      const longEmail = {
        subject: 'Detailed Proposal',
        tone: 'professional',
        purpose: 'Comprehensive proposal',
        length: 'long'
      };

      const [shortResponse, longResponse] = await Promise.all([
        request(app).post('/api/ai/generate').send(shortEmail),
        request(app).post('/api/ai/generate').send(longEmail)
      ]);

      expect(shortResponse.status).toBe(200);
      expect(longResponse.status).toBe(200);
      
      // Long emails should be longer than short emails
      expect(longResponse.body.email.length).toBeGreaterThan(shortResponse.body.email.length);
    });
  });

  describe('GET /api/ai/emails', () => {
    it('should return 400 for missing userId', async () => {
      const response = await request(app)
        .get('/api/ai/emails')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User ID is required');
    });

    it('should return paginated emails with userId', async () => {
      const response = await request(app)
        .get('/api/ai/emails?userId=test123')
        .expect(200);

      expect(response.body).toHaveProperty('emails');
      expect(response.body).toHaveProperty('pagination');
      expect(Array.isArray(response.body.emails)).toBe(true);
      expect(response.body.pagination).toHaveProperty('page');
      expect(response.body.pagination).toHaveProperty('limit');
      expect(response.body.pagination).toHaveProperty('total');
      expect(response.body.pagination).toHaveProperty('pages');
    });

    it('should support search query', async () => {
      const response = await request(app)
        .get('/api/ai/emails?userId=test123&q=meeting')
        .expect(200);

      expect(response.body).toHaveProperty('emails');
      expect(Array.isArray(response.body.emails)).toBe(true);
    });
  });

  describe('GET /api/ai/emails/:id', () => {
    it('should return 400 for missing userId', async () => {
      const response = await request(app)
        .get('/api/ai/emails/test123')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User ID is required');
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(app)
        .get('/api/ai/emails/nonexistent?userId=test123')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Email not found');
    });
  });

  describe('PUT /api/ai/emails/:id', () => {
    it('should return 400 for missing userId', async () => {
      const response = await request(app)
        .put('/api/ai/emails/test123')
        .send({ subject: 'Updated' })
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User ID is required');
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(app)
        .put('/api/ai/emails/nonexistent')
        .send({ userId: 'test123', subject: 'Updated' })
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Email not found or access denied');
    });
  });

  describe('DELETE /api/ai/emails/:id', () => {
    it('should return 400 for missing userId', async () => {
      const response = await request(app)
        .delete('/api/ai/emails/test123')
        .expect(400);

      expect(response.body).toHaveProperty('error', 'User ID is required');
    });

    it('should return 404 for non-existent email', async () => {
      const response = await request(app)
        .delete('/api/ai/emails/nonexistent?userId=test123')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Email not found or access denied');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/api/unknown-route')
        .expect(404);

      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});