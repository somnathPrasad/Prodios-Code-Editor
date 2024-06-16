import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FileNameConflictDialogProps {
  open: boolean;
  onClose: () => void;
}

export function FileNameConflictDialog({
  open,
  onClose,
}: FileNameConflictDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>File name conflict</AlertDialogTitle>
          <AlertDialogDescription>
            File with this name is already present in the workspace. Please
            create a file with a different name.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter onClick={onClose}>
          <AlertDialogCancel>Okay</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
