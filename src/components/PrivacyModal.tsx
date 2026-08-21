import { Link } from "@tanstack/react-router";
import { ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PrivacyModal({ label = "Read the 30-second privacy note" }: { label?: string }) {
  return (
    <Dialog>
      <DialogTrigger className="text-forest hover:text-foreground inline-flex items-center gap-2 text-sm font-semibold underline underline-offset-4">
        <ShieldCheck className="h-4 w-4" aria-hidden />
        {label}
      </DialogTrigger>
      <DialogContent className="bg-parchment paper-grain max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">Your memories belong at home</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            The short version, in plain language.
          </DialogDescription>
        </DialogHeader>
        <ul className="text-foreground/90 space-y-3 text-sm leading-relaxed">
          <li>
            <strong>Your photos stay on your device.</strong> This demo does not upload or store
            your originals.
          </li>
          <li>
            Anything you pick with the file chooser or drag in is previewed with a temporary
            in-browser link and disappears when you close the tab.
          </li>
          <li>
            There is no permanent photo storage, no public gallery, and no social sharing of your
            private photos.
          </li>
          <li>
            The waitlist form collects your name, email, and organizing preferences — nothing else.
          </li>
        </ul>
        <Link
          to="/privacy"
          className="bg-primary text-primary-foreground tactile mt-2 inline-flex justify-center rounded-md px-4 py-2 text-sm font-semibold active:translate-y-px"
        >
          Read the full privacy page
        </Link>
      </DialogContent>
    </Dialog>
  );
}
