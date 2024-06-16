import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VscAdd } from "react-icons/vsc";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { KeyboardEvent, useState } from "react";

interface CreateNewFileDialogProps {
  onCreate: (fileName: string) => void;
}

export default function CreateNewFileDialog(props: CreateNewFileDialogProps) {
  const [fileName, setFileName] = useState("");
  const [open, setOpen] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const key: string = event.key;
    if (key === "Enter" && fileName.includes(".")) {
      props.onCreate(fileName);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <VscAdd />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create new file</DialogTitle>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Input
              onKeyDown={handleKeyDown}
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="Enter file name"
            />
          </div>
        </div>
        <DialogFooter className="sm:justify-end">
          <DialogClose asChild>
            <Button
              onClick={() => props.onCreate(fileName)}
              type="button"
              variant="default"
              disabled={!fileName.includes(".")}
            >
              Create
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
