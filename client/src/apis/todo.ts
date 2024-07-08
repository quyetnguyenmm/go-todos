import { API } from "../constants";
import { CreateTodoBody, Todo } from "../models";
import { axiosClient } from "./axios-client";

export const todoApi = {
  getTodoList: async (): Promise<Todo[] | undefined> => {
    try {
      const url = API.TODO;
      const response: Todo[] = await axiosClient.get(url);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  createTodo: async (data: CreateTodoBody) => {
    try {
      const url = API.TODO;
      const response = await axiosClient.post(url, data);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  updateTodo: async (id: string) => {
    try {
      const url = API.TODO + `/${id}`;
      const response = await axiosClient.patch(url);
      return response;
    } catch (error) {
      console.log(error);
    }
  },

  deleteTodo: async (id: string) => {
    try {
      const url = API.TODO + `/${id}`;
      const response = await axiosClient.delete(url);
      return response;
    } catch (error) {
      console.log(error);
    }
  },
};
