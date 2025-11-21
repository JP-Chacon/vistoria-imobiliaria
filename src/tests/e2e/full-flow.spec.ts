import request from 'supertest';
import { beforeAll, beforeEach, afterAll, describe, expect, it } from 'vitest';

import { app } from '../../app';
import { closeDatabase, resetDatabase, runMigrations } from '../utils/database';

const TEST_USER = {
  name: 'Usuário Teste',
  email: 'fluxo@test.com',
  password: '123456',
};

const sampleImageBuffer = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==',
  'base64',
);

describe('Fluxo completo da API', () => {
  beforeAll(async () => {
    await runMigrations();
  });

  beforeEach(async () => {
    await resetDatabase();
  });

  afterAll(async () => {
    await resetDatabase();
    await closeDatabase();
  });

  it('deve registrar, autenticar e percorrer o fluxo completo de criação', async () => {
    const registerResponse = await request(app).post('/api/auth/register').send(TEST_USER).expect(201);
    expect(registerResponse.body.data.user.email).toBe(TEST_USER.email);
    expect(registerResponse.body.data.accessToken).toBeTruthy();

    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: TEST_USER.email, password: TEST_USER.password })
      .expect(200);

    const token: string = loginResponse.body.data.accessToken;
    expect(token).toBeTruthy();

    const propertyResponse = await request(app)
      .post('/api/properties')
      .set('Authorization', `Bearer ${token}`)
      .send({
        ownerName: 'João Silva',
        address: 'Rua das Laranjeiras, 123',
        type: 'house',
      })
      .expect(201);

    const propertyId: string = propertyResponse.body.data.id;
    expect(propertyId).toBeTruthy();

    const inspectionResponse = await request(app)
      .post('/api/inspections')
      .set('Authorization', `Bearer ${token}`)
      .send({
        propertyId,
        inspectorName: 'Maria Oliveira',
        scheduledFor: new Date().toISOString(),
        notes: 'Primeira visita agendada.',
      })
      .expect(201);

    const inspectionId: string = inspectionResponse.body.data.id;
    expect(inspectionId).toBeTruthy();

    const uploadResponse = await request(app)
      .post(`/api/inspections/${inspectionId}/attachments`)
      .set('Authorization', `Bearer ${token}`)
      .attach('files', sampleImageBuffer, 'foto.png')
      .expect(201);

    expect(Array.isArray(uploadResponse.body.data)).toBe(true);
    expect(uploadResponse.body.data).toHaveLength(1);

    const [attachment] = uploadResponse.body.data as Array<{
      id: string;
      inspectionId: string;
      fileName: string;
    }>;

    expect(attachment.inspectionId).toBe(inspectionId);

    const listResponse = await request(app)
      .get(`/api/inspections/${inspectionId}/attachments`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(listResponse.body.data).toHaveLength(1);

    const fileResponse = await request(app)
      .get(`/uploads/inspections/${inspectionId}/${attachment.fileName}`)
      .expect(200);

    expect(fileResponse.headers['content-type']).toContain('image');
  });
});


