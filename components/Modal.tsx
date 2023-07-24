"use client";

import { FormEvent, Fragment, useRef } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useModalStore } from "@/store/ModalStore";
import { useBoardStore } from "@/store/BoardStore";
import TaskTypeRadioGroup from "./TaskTypeRadioGroup";
import Image from "next/image";
import { PhotoIcon } from "@heroicons/react/24/solid";

const Modal = () => {
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const [isOpen, closeModal] = useModalStore((state) => [state.isOpen, state.closeModal]);
  const [addTask, newTaskType, newTaskInput, setNewTaskInput, image, setImage] = useBoardStore((state) => [
    state.addTask,
    state.newTaskType,
    state.newTaskInput,
    state.setNewTaskInput,
    state.image,
    state.setImage,
  ]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newTaskInput) return;

    addTask(newTaskInput, newTaskType, image);
    setImage(null);
    closeModal();
  };

  return (
    // Use the `Transition` component at the root level
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog className="relative z-10" as="form" onSubmit={handleSubmit} onClose={closeModal}>
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md p-6 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title className="pb-2 text-lg font-medium leading-6 text-gray-900" as="h3">
                  Add a Task
                </Dialog.Title>
                <div className="mt-2">
                  <input
                    className="w-full p-5 border border-gray-300 rounded-md outline-non"
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Enter a task here..."
                  />
                </div>

                {/* Radio Group */}
                <TaskTypeRadioGroup />

                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => imagePickerRef.current?.click()}
                    className="w-full p-5 border border-gray-300 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    <PhotoIcon className="inline-block w-6 h-6 mr-2" />
                    Upload Image
                  </button>
                  {image && (
                    <Image
                      className="object-cover w-full mt-2 transition-all duration-150 cursor-not-allowed h-44 filter hover:grayscale"
                      alt="Preview upload image"
                      width={200}
                      height={200}
                      src={URL.createObjectURL(image)}
                      onClick={() => setImage(null)}
                    />
                  )}
                  <input
                    type="file"
                    ref={imagePickerRef}
                    hidden
                    onChange={(e) => {
                      //check e is an image
                      if (!e.target.files![0].type.startsWith("image/")) return;
                      setImage(e.target.files![0]);
                    }}
                  />
                </div>
                <div className="mt-4">
                  <button
                    className="inline-flex justify-center px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed"
                    type="submit"
                    disabled={!newTaskInput}
                  >
                    Add Task
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
