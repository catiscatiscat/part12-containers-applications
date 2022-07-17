import React from 'react';

import Todo from './Todo';

const TodoList = ({ todos, deleteTodo, completeTodo }) => {
  return (
    <>
      {todos
        .map(todo => {
          return (
            <Todo
              todo={todo}
              deleteTodo={deleteTodo}
              completeTodo={completeTodo}
              key={todo._id}
            />
          );
        })
        .reduce((acc, cur, curinx) => [...acc, <hr key={curinx} />, cur], [])}
    </>
  );
};

export default TodoList;
