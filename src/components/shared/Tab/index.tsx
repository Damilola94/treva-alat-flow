'use client';
import React, { type FC, type ReactElement, useMemo } from 'react';
import {
  Tab as TabTrigger,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from '@headlessui/react';

interface ITab {
  trigger: string | ReactElement
  value: string
  content: ReactElement
  badgeCount?: number
  hide?: boolean
}

const Tab: FC<{
  tabs: ITab[]
  active?: string
  value?: number
  onValueChange?: (value: number) => void
  variant?: 'pill' | 'square' | 'flat' | 'vertical' | 'underline'
  showBadge?: boolean
  listClassName?: string
  hideTrigger?: boolean
}> = ({
  tabs = [],
  active,
  value,
  onValueChange,
  variant = 'pill',
  showBadge = false,
  listClassName,
  hideTrigger = false,
}) => {
  const className = useMemo(() => {
    let classes =
      'flex items-center gap-2 px-4 cursor-pointer data-[selected]:bg-[--app-primary-500] data-[selected]:focus:bg-[--app-primary-500] whitespace-nowrap flex-1 justify-center text-sm leading-none select-none text-[--app-black-400] hover:bg-gray-500 hover:text-[--app-black-400] data-[selected]:text-[--app-white] data-[selected]:shadow-current data-[selected]:focus:relative data-[selected]:focus:shadow-[none] outline-none';

    if (variant === 'pill') {
      classes =
        'px-[16px] py-[9px] border rounded-full text-[#0000001A] border-[#0000001A] data-[selected]:text-[#262626] data-[selected]:border-[#262626] data-[selected]:focus:border-[#262626] outline-none ring-0 focus:outline-none focus:ring-0';
    }
    return classes;
  }, [variant]);

  return (
    <TabGroup selectedIndex={value} onChange={onValueChange}>
      {!hideTrigger && (
        <TabList
          className={`${
            variant !== 'underline' && 'bg-grey-100'
          } flex max-w-[564px] overflow-x-auto no-scrollbar ${
            variant === 'pill'
              ? 'gap-3 rounded-full p-1'
              : variant === 'flat'
              ? 'bg-[--app-grey-100] h-10 rounded-[10px] w-full p-1 flex'
              : variant === 'vertical'
              ? 'lg:flex-col items-center lg:items-start lg:sticky lg:top-0'
              : variant === 'underline'
              ? 'gap-5'
              : ''
          } ${listClassName}`}
          aria-label=""
        >
          {tabs
            .filter((tab) => tab.hide !== true)
            .map((t, i) => (
              <TabTrigger
                key={i}
                className={`${className} ${
                  variant !== 'flat' &&
                  (variant === 'square'
                    ? i === tabs.length - 1
                      ? 'rounded-r-lg'
                      : i === 0
                      ? 'rounded-l-lg'
                      : ''
                    : '')
                }`}
                value={t.value}
              >
                {t.trigger}{' '}
                {showBadge && (
                  <span
                    className={`bg-white w-5 h-5 rounded-full !text-xs  shadow flex items-center justify-center ${
                      t.value === active
                        ? 'text-[--app-primary-500]'
                        : 'text-[--app-black-400]'
                    }`}
                  >
                    {t.badgeCount ?? 0}
                  </span>
                )}
              </TabTrigger>
            ))}
        </TabList>
      )}
      <TabPanels className={`${!hideTrigger && 'mt-3'}`}>
        {tabs
          .filter((tab) => tab.hide !== true)
          .map((t, i) => (
            <TabPanel
              key={i}
              className={`flex-grow ${variant !== 'vertical' ? 'mt-5' : ''}`}
            >
              {t.content}
            </TabPanel>
          ))}
      </TabPanels>
    </TabGroup>
  );
};

export default Tab;
