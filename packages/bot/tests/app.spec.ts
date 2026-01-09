import { describe, expect, it } from 'vitest';
import { Application } from '../src/app/index.js';

describe('Application', () => {
  describe('instance', () => {
    it('should be creating', () => {
      const testBotToken = 'sdsad.asdasd.dasas';
      expect(new Application(testBotToken)).toBeInstanceOf(Application);
    });

    it('throw error with empty token', () => {
      const testBotToken = '';
      expect(() => new Application(testBotToken)).toThrow(
        new Error('Invalid Token: Empty')
      );
    });

    it('throw error with invalid JWT token', () => {
      const testBotToken = 'dasdsa';
      expect(() => new Application(testBotToken)).toThrow(
        new Error('Invalid Token: Not JWT')
      );
    });
  });
});
