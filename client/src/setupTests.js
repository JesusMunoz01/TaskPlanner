// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { setupServer } from 'msw/node';
import { handlers } from './mocks/handlers';
// Set up a Mock Service Worker server with the provided request handlers
const server = setupServer(...handlers);
// Start the server before running your tests
beforeAll(() => server.listen());
// Reset and stop the server after all tests finish
afterAll(() => server.resetHandlers(), server.close());
