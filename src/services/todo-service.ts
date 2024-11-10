import { Priority, Prisma, Todo } from '@prisma/client';

import prismaClient from '../cores/db';
import { ErrorType, StandardError } from '../errors/standard-error';
import {
  createTodoSchema,
  deleteTodoSchema,
  editTodoSchema,
  getTodoByIdSchema,
  searchTodoOwnedSchema,
} from '../validation/todo-validation';
import { validate } from '../validation/validation';

const createTodo = async (
  data: Prisma.TodoUncheckedCreateInput,
  userId: number,
): Promise<Todo> => {
  validate(createTodoSchema, { ...data, userId: userId })

  if (data.categoryId) {
    const category = await prismaClient.category.findUnique({
      where: {
        id: data.categoryId,
      },
    });

    if (!category) {
      throw new StandardError(ErrorType.CATEGORY_NOT_FOUND);
    }

    if (category.userId !== userId) {
      throw new StandardError(ErrorType.CATEGORY_NOT_OWNED);
    }
  }

  return prismaClient.todo.create({
    data: {
      userId: userId,
      title: data.title,
      ...(data.dueDate && { dueDate: data.dueDate }),
      ...(data.priority && { priority: data.priority }),
      ...(data.completed && { completed: data.completed }),
      ...(data.categoryId && { categoryId: data.categoryId }),
    },
  });
};

const getTodoById = async (
  todoId: number,
): Promise<Todo> => {
  validate(getTodoByIdSchema, { todoId: todoId })

  const todo = await prismaClient.todo.findUnique({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    throw new StandardError(ErrorType.TODO_NOT_FOUND);
  }

  return todo;
};

const searchTodoOwned = async (
  userId: number,
  reqQuery: {
    category: string | undefined;
    priority: string | undefined;
    completed: string | undefined;
    dueDateOrder: string | undefined;
    size: number | undefined;
    page: number | undefined;
  }) => {
  validate(searchTodoOwnedSchema, { ...reqQuery, userId: userId })

  const category = reqQuery.category;
  let categoryIds: number[] = [];
  if (category) {
    let categories: string[] = [];
    if (category.includes(',')) {
      categories = category.split(',');
    } else {
      categories.push(category);
    }

    const categoryData = await prismaClient.category.findMany({
      where: {
        userId: userId,
        name: {
          in: categories,
        },
      },
      select: {
        id: true,
      },
    });

    categoryIds = categoryData.map((data) => data.id);
  }

  const priority = reqQuery.priority;
  let priorities: Priority[] = [];
  if (priority) {
    if (!Object.values(Priority).includes(priority.toUpperCase() as Priority)) {
      throw new StandardError(ErrorType.INVALID_PRIORITY);
    }
    if (priority.includes(',')) {
      priorities = priority.toUpperCase().split(',') as Priority[];
    } else {
      priorities.push(priority.toUpperCase() as Priority);
    }
  }

  const completed = reqQuery.completed ? (reqQuery.completed === 'true' ? true : false) : undefined;

  const dueDateOrder = reqQuery.dueDateOrder ? (reqQuery.dueDateOrder === 'asc' ? 'asc' : 'desc') : undefined;

  const page: number = reqQuery.page ?? 1;
  const size: number = reqQuery.size ?? 10;
  const skip: number = (page - 1) * size;

  const todos = await prismaClient.todo.findMany({
    where: {
      userId: userId,
      ...(categoryIds.length > 0 && { categoryId: { in: categoryIds } }),
      ...(priorities.length > 0 && { priority: { in: priorities } }),
      ...(completed !== undefined && { completed: completed }),
    },
    include: {
      Category: true,
    },
    orderBy: [
      {
        ...(dueDateOrder && { dueDate: dueDateOrder })
      },
      {
        createdAt: Prisma.SortOrder.desc
      },
    ],
    take: size,
    skip: skip,
  });

  const totalTodo = await prismaClient.todo.count({
    where: {
      userId: userId,
      ...(categoryIds.length > 0 && {
        categoryId: {
          in: categoryIds
        }
      }),
      ...(priorities.length > 0 && {
        priority: {
          in: priorities
        }
      }),
      ...(completed !== undefined && {
        completed: completed
      }),
    },
  });

  return {
    data: todos,
    paging: {
      page: page,
      totalTodo: totalTodo,
      totalPage: Math.ceil(totalTodo / size),
    },
  };
};


const editTodo = async (
  inputData: Prisma.TodoUncheckedUpdateInput,
  todoId: number,
  userId: number,
): Promise<Todo> => {
  validate(editTodoSchema, { todoId: todoId, ...inputData })

  const id = await prismaClient.todo.findUnique({
    where: {
      id: todoId,
    },
  });

  if (!id) {
    throw new StandardError(ErrorType.TODO_NOT_FOUND);
  }

  if (id.userId !== userId) {
    throw new StandardError(ErrorType.TODO_NOT_OWNED);
  }

  let categoryId = inputData.categoryId;
  if (typeof categoryId === 'number') {
    const category = await prismaClient.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new StandardError(ErrorType.CATEGORY_NOT_FOUND);
    }

    if (category.userId !== userId) {
      throw new StandardError(ErrorType.CATEGORY_NOT_OWNED);
    }
  }

  return prismaClient.todo.update({
    where: {
      id: todoId,
    },
    data: {
      title: inputData.title,
      ...(inputData.priority && { priority: inputData.priority }),
      ...(inputData.completed && { completed: inputData.completed }),
      ...(inputData.dueDate && { dueDate: inputData.dueDate }),
      ...(categoryId && { categoryId: categoryId }),
      updatedAt: new Date(),
    },
  });
};

const deleteTodo = async (
  todoId: number,
  userId: number,
): Promise<Todo> => {
  validate(deleteTodoSchema, { todoId: todoId })

  const todo = await prismaClient.todo.findUnique({
    where: {
      id: todoId,
    },
  });

  if (!todo) {
    throw new StandardError(ErrorType.TODO_NOT_FOUND);
  }

  if (todo.userId !== userId) {
    throw new StandardError(ErrorType.TODO_NOT_OWNED);
  }

  return prismaClient.todo.delete({
    where: {
      id: todoId,
    },
  });
};

export {
  createTodo,
  getTodoById,
  searchTodoOwned,
  editTodo,
  deleteTodo,
};
