import React, { Fragment, useState } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

function OptionType({ data, typeChoise, setTypeChoise }: any) {
  return (
    <Menu as="div" className="relative text-[1.4rem] inline-block text-left">
      <div>
        <Menu.Button className="inline-flex  focus:outline-none items-center w-full justify-center rounded-md border border-gray-300 bg-white py-3 px-10  font-medium text-gray-700 hover:bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100">
          {typeChoise?.name}
          <ChevronDownIcon className="-mr-1 ml-2 h-7 w-7" aria-hidden="true" />
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
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {data?.map(
              (option: any) =>
                option.id !== typeChoise?.id && (
                  <Menu.Item key={option.id}>
                    <div
                      onClick={() => setTypeChoise(option)}
                      className="px-5 py-4 hover:bg-[#eeeded] cursor-pointer"
                    >
                      {option.name}
                    </div>
                  </Menu.Item>
                ),
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

export default OptionType;
