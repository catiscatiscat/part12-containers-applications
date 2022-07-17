import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import Todo from './Todo';

test('renders content', () => {
  const todo = {
    text: 'Testing todo',
    done: false,
  };

  render(<Todo todo={todo} />);

  const element = screen.getByText('Testing todo');
  expect(element).toBeDefined();
});
