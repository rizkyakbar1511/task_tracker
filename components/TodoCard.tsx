"use client";

import Image from "next/image";
import getUrl from "@/lib/getUrl";
import { useBoardStore } from "@/store/BoardStore";
import { Todo, TypedColumns } from "@/typings";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { DraggableProvidedDragHandleProps, DraggableProvidedDraggableProps } from "react-beautiful-dnd";

type TodoCardProps = {
  todo: Todo;
  index: number;
  id: TypedColumns;
  innerRef: (element: HTMLElement | null) => void;
  draggableProps: DraggableProvidedDraggableProps;
  dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
};

const TodoCard: React.FC<TodoCardProps> = ({ todo, index, id, innerRef, draggableProps, dragHandleProps }) => {
  const deleteTask = useBoardStore((state) => state.deleteTask);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (todo.image) {
      const fetchImage = async () => {
        const url = await getUrl(todo.image!);
        if (url) {
          setImageUrl(url.toString());
        }
      };

      fetchImage();
    }
  }, [todo]);
  return (
    <div className="space-y-2 bg-white rounded-md drop-shadow-md" {...draggableProps} {...dragHandleProps} ref={innerRef}>
      <div className="flex items-center justify-between p-5">
        <p>{todo.title}</p>
        <button onClick={() => deleteTask(index, todo, id)} className="text-red-500 hover:text-red-600">
          <XCircleIcon className="w-8 h-8 ml-5" />
        </button>
      </div>

      {/* Add image URL */}
      {imageUrl && (
        <div className="relative w-full h-full rounded-b-md">
          <Image className="object-contain w-full rounded-b-md" src={imageUrl} alt="Task image" width={400} height={200} />
        </div>
      )}
    </div>
  );
};

export default TodoCard;
