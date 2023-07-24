import { Todo, TypedColumns } from "@/typings";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { Draggable, Droppable } from "react-beautiful-dnd";
import TodoCard from "./TodoCard";
import { useBoardStore } from "@/store/BoardStore";
import { useModalStore } from "@/store/ModalStore";

type ColumnProps = {
  id: TypedColumns;
  todos: Todo[];
  index: number;
};

const idToColumnText: {
  [key in TypedColumns]: string;
} = {
  todo: "To Do",
  inprogress: "In Progress",
  done: "Done",
};

const Column = ({ id, todos, index }: ColumnProps) => {
  const [searchString, setNewTaskType] = useBoardStore((state) => [state.searchString, state.setNewTaskType]);
  const openModal = useModalStore((state) => state.openModal);

  const handleAddTodo = () => {
    setNewTaskType(id);
    openModal();
  };

  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef}>
          {/* render droppable todos in this column */}
          <Droppable droppableId={index.toString()} type="card">
            {(provided, snapshot) => (
              <div
                className={`p-2 rounded-2xl shadow-sm ${snapshot.isDraggingOver ? "bg-green-200" : "bg-white/50"}`}
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                <h2 className="flex justify-between p-2 text-xl font-bold">
                  {idToColumnText[id]}{" "}
                  <span className="p-2 text-sm font-normal text-gray-500 bg-gray-200 rounded-full">
                    {!searchString ? todos.length : todos.filter((todo) => todo.title.toLowerCase().includes(searchString)).length}
                  </span>
                </h2>

                <div className="space-y-2">
                  {todos.map((todo, index) => {
                    if (searchString && !todo.title.toLowerCase().includes(searchString.toLowerCase())) return null;
                    return (
                      <Draggable key={todo.$id} draggableId={todo.$id} index={index}>
                        {(provided) => (
                          <TodoCard
                            todo={todo}
                            index={index}
                            id={id}
                            innerRef={provided.innerRef}
                            draggableProps={provided.draggableProps}
                            dragHandleProps={provided.dragHandleProps}
                          />
                        )}
                      </Draggable>
                    );
                  })}

                  {provided.placeholder}
                  <div className="flex items-end justify-end p-2">
                    <button onClick={handleAddTodo} className="text-green-500 hover:text-green-600">
                      <PlusCircleIcon className="w-10 h-10" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

export default Column;
