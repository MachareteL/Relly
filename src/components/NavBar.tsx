import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { ProfileImage } from "./ProfileImage";
import Link from "next/link";

const navigation = [
  { name: "Posts", href: "#", current: true },
  { name: "Publicar", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
  const pathname = usePathname();
  const session = useSession();
  console.log(session);
  if (pathname == "/signup") {
    return <></>;
  }
  return (
    <div>
      <Disclosure as="nav" className="mb-2 backdrop-blur-sm">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 items-center justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button*/}
                  <Disclosure.Button
                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 
                hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    <Link href={"/"}>
                      <svg
                        className="h-10 w-10 cursor-pointer"
                        viewBox="0 0 32 32"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                      >
                        <defs>
                          <radialGradient
                            cx="50%"
                            cy="89.845%"
                            fx="50%"
                            fy="89.845%"
                            r="108.567%"
                            gradientTransform="matrix(-.00915 -.82755 .99996 -.00757 -.394 1.319)"
                            id="logo1-b"
                          >
                            <stop
                              stopColor="#3B82F6"
                              stopOpacity=".64"
                              offset="0%"
                            ></stop>
                            <stop
                              stopColor="#F472B6"
                              stopOpacity=".876"
                              offset="100%"
                            ></stop>
                          </radialGradient>
                          <radialGradient
                            cx="50%"
                            cy="89.845%"
                            fx="50%"
                            fy="89.845%"
                            r="108.567%"
                            gradientTransform="matrix(-.00915 -.82755 .99996 -.00757 -.394 1.319)"
                            id="logo1-d"
                          >
                            <stop
                              stopColor="#3B82F6"
                              stopOpacity=".64"
                              offset="0%"
                            ></stop>
                            <stop
                              stopColor="#D375C2"
                              stopOpacity=".833"
                              offset="50.358%"
                            ></stop>
                            <stop
                              stopColor="#FBCFE8"
                              stopOpacity=".876"
                              offset="100%"
                            ></stop>
                          </radialGradient>
                          <path
                            d="M12 32c8-6.915 12-12.582 12-17 0-6.627-5.373-12-12-12S0 8.373 0 15c0 4.418 4 10.085 12 17Z"
                            id="logo1-a"
                          ></path>
                          <path
                            d="M20 29c8-6.915 12-12.582 12-17 0-6.627-5.373-12-12-12S8 5.373 8 12c0 4.418 4 10.085 12 17Z"
                            id="logo1-c"
                          ></path>
                        </defs>
                        <g fill="none" fillRule="evenodd">
                          <use
                            fill="url(#logo1-b)"
                            opacity=".64"
                            transform="matrix(1 0 0 -1 0 35)"
                            xlinkHref="#logo1-a"
                          ></use>
                          <use
                            fill="url(#logo1-d)"
                            opacity=".961"
                            xlinkHref="#logo1-c"
                          ></use>
                        </g>
                      </svg>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:block">
                    <div className="flex space-x-4">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-900 text-white"
                              : "text-gray-300 hover:bg-gray-700 hover:text-white",
                            "rounded-md px-3 py-2 text-sm font-medium"
                          )}
                          aria-current={item.current ? "page" : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {/* Profile dropdown */}
                  <Menu as="div" className="relative ml-3 ">
                    <div>
                      <Menu.Button className="flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <ProfileImage src={session.data?.user?.image} />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="absolute right-0 z-20 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Your Profile
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Settings
                            </a>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={() => signOut()}
                              className={classNames(
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm text-gray-700"
                              )}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Disclosure.Button
                    key={item.name}
                    as="a"
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-900 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white",
                      "block rounded-md px-3 py-2 text-base font-medium"
                    )}
                    aria-current={item.current ? "page" : undefined}
                  >
                    {item.name}
                  </Disclosure.Button>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
