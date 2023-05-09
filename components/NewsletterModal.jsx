import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import { useRouter } from "next/router";
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline'

export function NewsletterModal() {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const router = useRouter();

  function handleSignUpForNewsletterClick() {
    setOpen(false);
    router.push("https://digital.umusic.com/frostchildren-signup")
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-400 sm:bg-neutral-100-500 opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end sm:items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="border-white border-2 relative transform overflow-hidden rounded-lg bg-neutral-900 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-20">
                <div className="bg-neutral-900 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-center sm:flex-col sm:justify-center">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-neutral-100 sm:mx-0 sm:h-10 sm:w-10">
                      {/* abrys logo */}
                      <Image src={"/img/abrys.webp"} width={50} height={50} />
                    </div>
                    <div className="mt-3 text-center sm:ml-4 sm:mt-0">
                      <Dialog.Title
                        as="h3"
                        className="text-base sm:text-4xl font-semibold leading-6 text-neutral-100"
                      >
                        Join our newsletter
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm sm:text-xl text-gray-500 font-light">
                          Sign Up To Get All Our Latest Updates, Music And More!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-neutral-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 sm:justify-center">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-neutral-200 px-3 py-2 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50 sm:ml-3 sm:w-auto"
                    onClick={handleSignUpForNewsletterClick}
                  >
                    Sign Up
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md  px-3 py-2 text-sm text-neutral-300 shadow-sm ring-1 ring-inset ring-neutral-300 hover:bg-neutral-600 hover:text-neutral-200 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    No thanks
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
