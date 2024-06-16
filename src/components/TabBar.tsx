import { VscChromeClose } from "react-icons/vsc";
import CrateNewFileDialog from "./CreateNewFileDialog";
export interface Tab {
  id: string;
  name: string;
  language: string;
  order: number;
  content: string;
  active: boolean;
}

interface TabsProps {
  tabs: Tab[];
  onTabPress: (id: string) => void;
  onClosePress: (id: string) => void;
  onAddFile: (fileName: string) => void;
}

export default function TabBar(props: TabsProps) {
  return (
    <div className="bg-zinc-800 border-t border-t-zinc-700 text-white flex">
      {props.tabs.map((tab) => (
        <div
          key={tab.id}
          className={`py-2 ${
            tab.active
              ? "bg-[rgb(30,30,30)] border-t-blue-800"
              : "bg-zinc-800 border-t-stone-700 hover:bg-[rgb(30,30,30)]"
          } border-t border-r border-r-stone-700 cursor-pointer grid grid-cols-3 gap-4 pl-3 text-center`}
        >
          <div onClick={() => props.onTabPress(tab.id)} className="col-span-2">
            {tab.name}
          </div>
          <div
            className="col-span-1 flex items-center"
            onClick={() => props.onClosePress(tab.id)}
          >
            <VscChromeClose />
          </div>
        </div>
      ))}
      <div className="flex items-center pl-5 hover:scale-105">
        <CrateNewFileDialog onCreate={props.onAddFile} />
      </div>
    </div>
  );
}
