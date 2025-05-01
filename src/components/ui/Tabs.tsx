"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabProps {
  title: string;
  content: React.ReactNode;
}

export function Tab({
  contains,
  className,
}: {
  contains: TabProps[];
  className?: string;
}) {
  const [tab, setTab] = useState(contains[0]);

  return (
    <div
      className={cn(
        "w-[400px] h-[50dvh] bg-neutral-600/50 backdrop-blur-md p-2 rounded-md border border-neutral-300/20",
        className
      )}
    >
      <div className="border-neutral-300">
        {/* menu items */}
        <div className="flex justify-center w-full items-center space-x-4 overflow-x-auto dark:border-[0.5px] max-xsm:text-sm">
          {contains.map((item, idx) => (
            <button
              key={idx}
              className={cn("relative")}
              onClick={() => setTab(item)}
            >
              <AnimatePresence>
                {tab.title === item.title && (
                  <motion.div
                    layoutId="tab-example-pointer"
                    className={cn(
                      "absolute inset-0 bottom-0 h-full w-full bg-neutral-500/50 backdrop-blur",
                      idx === 0 && "rounded-l-sm",
                      idx === contains.length - 1 && "rounded-r-sm"
                    )}
                  />
                )}
              </AnimatePresence>
              <div
                className={cn(
                  "relative z-[1] flex items-center space-x-2 px-3 py-1 font-light uppercase"
                )}
              >
                {/* <item.icon className="h-4 w-auto" /> */}
                <span>{item.title}</span>
              </div>
            </button>
          ))}
        </div>
        {/* content */}
        <div className="px-4 py-5 dark:border-[0.5px]">
          {/* <code className="h-[30vh] w-full overflow-y-auto">{tab.content}</code> */}
          {contains.map(
            (item, idx) =>
              item.content === tab.content && (
                <AnimatePresence key={idx}>
                  <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    transition={{
                      type: "spring",
                      duration: 1,
                      delay: 0.25,
                      stiffness: 260,
                      damping: 20,
                    }}
                    className="w-full"
                  >
                    {item.content}
                  </motion.div>
                </AnimatePresence>
              )
          )}
        </div>
      </div>
    </div>
  );
}
