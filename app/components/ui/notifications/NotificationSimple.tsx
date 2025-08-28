import { Fragment, useState } from "react";
import { Transition } from "@headlessui/react";
import CheckEmptyCircle from "../icons/CheckEmptyCircleIcon";
import XIcon from "../icons/XIcon";

export default function NotificationSimple() {
  const [show, setShow] = useState(true);

  return (
    <>
      {/* Global notification live region, render this permanently at the end of the document */}
      <div aria-live="assertive" className="pointer-events-none fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6">
        <div className="flex w-full flex-col items-center space-y-4 sm:items-end">
          {/* Notification panel, dynamically insert this into the live region when it needs to be displayed */}
          <Transition
            show={show}
            as={Fragment}
            enter="transform ease-out duration-300 transition"
            enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
            enterTo="translate-y-0 opacity-100 sm:translate-x-0"
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="bg-background pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="p-4">
                <div className="flex items-start">
                  <div className="shrink-0">
                    <CheckEmptyCircle className="h-6 w-6 text-green-400" aria-hidden="true" />
                  </div>
                  <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-foreground text-sm font-medium">Successfully saved!</p>
                    <p className="text-muted-foreground mt-1 text-sm">Anyone with a link can now view this file.</p>
                  </div>
                  <div className="ml-4 flex shrink-0">
                    <button
                      type="button"
                      className="hover:text-muted-foreground text-muted-foreground bg-background inline-flex rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      onClick={() => {
                        setShow(false);
                      }}
                    >
                      <span className="sr-only">Close</span>
                      <XIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </>
  );
}
