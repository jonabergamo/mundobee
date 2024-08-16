"use client";
import { Toaster, ToastIcon, toast, resolveValue } from "react-hot-toast";
import { IoIosClose } from "react-icons/io";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function CustomToaster() {
  return (
    <Toaster
      toastOptions={{
        duration: 5000,
      }}
    >
      {t => (
        <div className="transform px-4 py-1 flex justify-center items-center gap-2 bg-background rounded-xl shadow-sm shadow-muted-foreground">
          <ToastIcon toast={t} />
          <Label className="text-foreground">
            {resolveValue(t.message, t)}
          </Label>
          {t.type !== "loading" && (
            <Button
              variant="ghost"
              type="button"
              onClick={() => toast.remove(t.id)}
              size="icon"
              className="rounded-full aspect-square"
            >
              <IoIosClose className="text-foreground text-xl" />
            </Button>
          )}
        </div>
      )}
    </Toaster>
  );
}
