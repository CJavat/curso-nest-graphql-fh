import { Injectable, NotFoundException } from '@nestjs/common';
import { Todo } from './entity/todo.entity';
import { CreateTodoInput, UpdateTodoInput } from './dto/inputs';
import { StatusArgs } from './dto/args/status.args';

@Injectable()
export class TodoService {
  private todos: Todo[] = [
    { id: 1, description: 'Piedra del Alma', done: false },
    { id: 2, description: 'Piedra del Espacio', done: false },
    { id: 3, description: 'Piedra del Poder', done: true },
  ];

  get totalTodos() {
    return this.todos.length;
  }

  get completedTodos() {
    const todos = this.todos.filter( todo => todo.done === true );
    return todos.length;
  }

  get pendingTodos() {
    const todos = this.todos.filter( todo => todo.done === false );
    return todos.length;
  }

  findAll( statusArgs: StatusArgs ): Todo[] {
    const { status } = statusArgs;

    if ( status !== undefined ) return this.todos.filter( todo => todo.done === status );
    
    return this.todos;
  }

  findOne( id: number ): Todo {
    const todo = this.todos.find( todo => todo.id === id );
    if( !todo ) throw new NotFoundException(`Todo with id ${id} not found`);

    return todo; 
  }

  create( createTodoInput: CreateTodoInput ): Todo {
    const todo = new Todo();
    todo.id = Math.max( ...this.todos.map( todo => todo.id ), 0 ) + 1
    todo.description = createTodoInput.description;
    
    this.todos.push( todo );
    return todo;
  }

  update( updateTodoInput: UpdateTodoInput ): Todo {
    const { id, description, done } = updateTodoInput;
    const todoToUpdate = this.findOne( id );

    if( description ) todoToUpdate.description = description;
    if( done !== undefined ) todoToUpdate.done = done;

    this.todos = this.todos.map( todo => {
      return ( todo.id === id ) ? todoToUpdate : todo;
    })

    return todoToUpdate;
  }

  delete( id: number ): boolean {
    const todo = this.findOne( id );

    this.todos = this.todos.filter( todo => todo.id !== id );

    return true;
  }
}
