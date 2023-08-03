import express, { Response } from 'express';
import supertest from 'supertest';
import jwt from 'jsonwebtoken';
import { SERVER_CONFIG } from '../../config';
import tokenGenerator from '../../utils/tokenGenerator';

// Assuming you have imported SERVER_CONFIG and tokenGenerator function

describe('tokenGenerator', () => {
  it('should generate and set a JWT token cookie in the response', async () => {
    const mockUserData = { _id: 1, email: 'example@user.com' };
    const mockResponse: Partial<Response> = {
      cookie: jest.fn(),
    };

    // Mock the jwt.sign function
    jest.spyOn(jwt, 'sign').mockReturnValue('mockedToken' as any);

    // Call the tokenGenerator function with the mock response and user data
    tokenGenerator(mockResponse as Response, mockUserData);

    // Assertions
    expect(jwt.sign).toHaveBeenCalledWith(mockUserData, SERVER_CONFIG.JWT_SECRET, {
      expiresIn: '7d',
    });

    expect(mockResponse.cookie).toHaveBeenCalledWith('token', 'mockedToken', {
      httpOnly: true,
      secure: SERVER_CONFIG.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  });
});