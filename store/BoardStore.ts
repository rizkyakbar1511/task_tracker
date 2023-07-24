import { ID, databases, storage } from "@/appwrite";
import { getTodosGroupedByColumn } from "@/lib/getTodosGroupedByColumn";
import uploadImage from "@/lib/uploadImage";
import { Board, Column, Image, Todo, TypedColumns } from "@/typings";
import { create } from "zustand";

interface BoardState {
  board: Board;
  getBoard: () => void;
  setBoardState: (board: Board) => void;
  addTask: (todo: string, columnId: TypedColumns, image?: File | null) => void;
  deleteTask: (taskIndex: number, todo: Todo, id: TypedColumns) => void;
  updateTodoInDB: (todo: Todo, columnId: TypedColumns) => void;
  newTaskInput: string;
  setNewTaskInput: (input: string) => void;
  searchString: string;
  setSearchString: (searchString: string) => void;
  newTaskType: TypedColumns;
  setNewTaskType: (columnId: TypedColumns) => void;
  image: File | null;
  setImage: (image: File | null) => void;
}

export const useBoardStore = create<BoardState>((set, get) => ({
  board: {
    columns: new Map<TypedColumns, Column>(),
  },
  searchString: "",
  newTaskInput: "",
  setNewTaskInput: (input) => set({ newTaskInput: input }),
  setSearchString: (searchString) => set({ searchString }),
  getBoard: async () => {
    const board = await getTodosGroupedByColumn();
    set({ board });
  },
  setBoardState: (board) => set({ board }),
  deleteTask: async (taskIndex, todo, id) => {
    const newColumns = new Map(get().board.columns);

    //delete todoId from newColumns
    newColumns.get(id)?.todos.splice(taskIndex, 1);
    set({ board: { columns: newColumns } });

    if (todo.image) {
      await storage.deleteFile(todo.image.bucketId, todo.image.fileId);
    }

    await databases.deleteDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, todo.$id);
  },
  updateTodoInDB: async (todo, columnId) => {
    await databases.updateDocument(process.env.NEXT_PUBLIC_DATABASE_ID!, process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!, todo.$id, {
      title: todo.title,
      status: columnId,
    });
  },
  newTaskType: "todo",
  setNewTaskType: (columnId) => set({ newTaskType: columnId }),
  image: null,
  setImage: (image) => set({ image }),
  addTask: async (todo, columnId, image) => {
    let file: Image | undefined;

    if (image) {
      const fileUploaded = await uploadImage(image);
      if (fileUploaded) {
        file = {
          bucketId: fileUploaded.bucketId,
          fileId: fileUploaded.$id,
        };
      }
    }

    const { $id } = await databases.createDocument(
      process.env.NEXT_PUBLIC_DATABASE_ID!,
      process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
      ID.unique(),
      {
        title: todo,
        status: columnId,
        ...(file && { image: JSON.stringify(file) }),
      }
    );

    set({ newTaskInput: "" });
    set((state) => {
      const newColumns = new Map(state.board.columns);

      const newTodo: Todo = {
        $id,
        $createdAt: new Date().toISOString(),
        title: todo,
        status: columnId,
        ...(file && { image: file }),
      };

      const column = newColumns.get(columnId);

      if (!column) {
        newColumns.set(columnId, {
          id: columnId,
          todos: [newTodo],
        });
      } else {
        newColumns.get(columnId)?.todos.push(newTodo);
      }

      return {
        board: {
          columns: newColumns,
        },
      };
    });
  },
}));
