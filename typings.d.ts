import { Models } from "appwrite";

interface Board {
  columns: Map<TypedColumns, Column>;
}

type TypedColumns = "todo" | "inprogress" | "done";

interface Column {
  id: TypedColumns;
  todos: Todo[];
}

interface Todo {
  $id: string;
  $createdAt: string;
  title: string;
  status: TypedColumns;
  image?: Image;
}

interface Image {
  bucketId: string;
  fileId: string;
}
