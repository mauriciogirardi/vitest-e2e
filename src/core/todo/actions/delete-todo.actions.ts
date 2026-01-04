import { revalidatePath } from 'next/cache';
import { deleteTodoUseCase } from '../usecases/delete-todo.usecase';

export async function deleteTodoAction(idTodo: string) {
  const result = await deleteTodoUseCase(idTodo);

  if (result.success) {
    revalidatePath('/');
  }

  return result;
}
