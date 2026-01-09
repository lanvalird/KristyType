import { describe, expect, it } from 'vitest';
import { Bot } from '../src/client/index.js';

describe('Client (Bot)', () => {
  const defaultParams = {
    intents: [],
  };

  describe('instance', () => {
    it('should be creating', () => {
      expect(new Bot(defaultParams)).toBeInstanceOf(Bot);
    });
  });

  describe('.validateToken()', () => {
    it('throw error with empty token', () => {
      const testBotToken = '';
      expect(() => Bot.validateToken(testBotToken)).toThrow(
        new Error('Invalid Token: Empty')
      );
    });

    it('throw error with invalid JWT token', () => {
      const testBotToken = 'dasdsa';
      expect(() => Bot.validateToken(testBotToken)).toThrow(
        new Error('Invalid Token: Not JWT')
      );
    });
  });
});
