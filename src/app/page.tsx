"use client";
import CodeEditor from "@/components/CodeEditor";
import Header from "@/components/Header";
import TabBar, { Tab } from "@/components/TabBar";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { FileNameConflictDialog } from "@/components/FileNameConflictDialog";

const defaultCode = `"use client";
import CodeEditor from "@/components/CodeEditor";
import { useState } from "react";

export default function Home() {
  const [code, setCode] = useState("");
  return (
    <main className="min-h-screen flex flex-col bg-zinc-800 px-4 pb-4">
      <div className="flex-1 p-2 bg-[rgb(30,30,30)] rounded-lg">
        <CodeEditor
          value={code}
          onValueChange={(value) => setCode(value)}
          language="tsx"
          className="w-full h-full p-2 rounded-lg"
        />
      </div>
    </main>
  );
}`;

const newFileDefaultCode = `// start writing code from here

`;

export default function Home() {
  const [tabs, setTabs] = useState<Tab[]>([
    {
      id: nanoid(),
      name: "page.tsx",
      language: "tsx",
      order: 1,
      active: true,
      content: defaultCode,
    },
    {
      id: nanoid(),
      name: "Header.tsx",
      language: "tsx",
      order: 2,
      active: false,
      content: "",
    },
    {
      id: nanoid(),
      name: "Tabs.tsx",
      language: "tsx",
      order: 3,
      active: false,
      content: "",
    },
  ]);
  const [activeTabIdx, setActiveTabIdx] = useState(-1);
  const [activeTab, setActiveTab] = useState<Tab>();
  const [openFileNameConflictDialog, setOpenFileNameConflictDialog] =
    useState(false);

  useEffect(() => {
    setActiveTabIdx(tabs.findIndex((item) => item.active));
  }, []);

  useEffect(() => {
    if (tabs[activeTabIdx] && !tabs[activeTabIdx].active) {
      // if tab.active === false at activeTabIdx, then make it true
      activateTab(activeTabIdx);
    }
    setActiveTab(tabs[activeTabIdx]);
  }, [activeTabIdx]);

  useEffect(() => {
    if (!tabs.find((item) => item.active)) {
      // if their is no tab set to active then set the first one as active
      activateTab(0);
    }
  }, [tabs]);

  const activateTab = (idx: number) => {
    const updatedTabs = tabs;
    updatedTabs[activeTabIdx].active = false;
    updatedTabs[idx].active = true;
    setActiveTabIdx(idx);
    setTabs(updatedTabs);
  };

  const saveActiveTabChanges = () => {
    const updatedTabs = tabs;
    if (activeTab) {
      updatedTabs[activeTabIdx] = activeTab;
      setTabs(updatedTabs);
    }
  };

  const handleOnTabPress = (id: string) => {
    const updatedTabs = tabs;
    const pressedTabIdx = updatedTabs.findIndex((item) => item.id === id);

    if (pressedTabIdx === -1) {
      return;
    }

    saveActiveTabChanges(); // save changes from activeTab state var to tabs state var
    activateTab(pressedTabIdx);
  };

  const handleAddNewTabClick = (fileName: string) => {
    // check if this file name already exists
    const file = tabs.find((item) => item.name === fileName);
    if (file) {
      setOpenFileNameConflictDialog(true);
      return;
    }
    const newTab: Tab = {
      id: nanoid(),
      active: false,
      content: newFileDefaultCode,
      language: fileName.split(".")[1],
      name: fileName,
      order: tabs[tabs.length - 1].order + 1,
    };
    const updatedTabs = tabs;
    updatedTabs.push(newTab);
    setTabs(updatedTabs);
    activateTab(updatedTabs.length - 1);
  };

  const handleTabClose = (id: string) => {
    const updatedTabs = tabs.filter((tab, i) => {
      if (tab.id === id) {
        return;
      }
      return tab;
    });

    setTabs(updatedTabs);
  };

  return (
    <main className="min-h-screen flex flex-col bg-zinc-800">
      <Header />
      <TabBar
        onTabPress={handleOnTabPress}
        onClosePress={handleTabClose}
        tabs={tabs}
        onAddFile={handleAddNewTabClick}
      />
      <FileNameConflictDialog
        onClose={() => setOpenFileNameConflictDialog(false)}
        open={openFileNameConflictDialog}
      />
      <div className="flex-1 p-2 bg-[rgb(30,30,30)]">
        {activeTab ? (
          <CodeEditor
            value={activeTab.content}
            onValueChange={(value) =>
              setActiveTab({ ...activeTab, content: value })
            }
            language={activeTab.language}
            className="w-full h-full p-2 rounded-lg"
          />
        ) : (
          <div></div>
        )}
      </div>
    </main>
  );
}
