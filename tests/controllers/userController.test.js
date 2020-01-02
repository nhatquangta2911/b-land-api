const request = require('supertest');
const { User } = require('../../startup/db');
const { Op } = require('sequelize');

let server;

describe('/api/users', () => {
  beforeEach(() => {
    server = require('../../index');
  });
  afterEach(async () => {
    server.close();
    await User.destroy({
      where: {
        id: {
          [Op.in]: [1, 2, 3]
        }
      }
    });
  });

  describe('GET /', () => {
    it('should return all users', async () => {
      await User.create({
        email: 'user1@gmail.com',
        phone: '0368080534',
        password: '123456',
        status: 1
      });
      await User.create({
        email: 'user2@gmail.com',
        phone: '0776402587',
        password: '123456',
        status: 1
      });
      const response = await request(server).get('/api/users');
      expect(response.body.length).toBe(2);
      expect(
        response.body.some(c => c.email === 'user1@gmail.com')
      ).toBeTruthy();
      expect(
        response.body.some(c => c.email === 'user2@gmail.com')
      ).toBeTruthy();
    });
  });
});
