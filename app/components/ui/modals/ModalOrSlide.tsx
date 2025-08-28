import { ReactNode } from "react";
import Modal from "./Modal";
import SlideOverWideEmpty from "../slideOvers/SlideOverWideEmpty";

interface Props {
  type: "modal" | "slide";
  className?: string;
  children: ReactNode;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title?: string;
  description?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "6xl" | "7xl" | "full";
  padding?: "none" | "sm";
  position?: 0 | 1 | 2 | 3 | 4 | 5;
  buttons?: ReactNode;
}
export default function ModalOrSlide({
  type,
  className,
  children,
  open,
  setOpen,
  title,
  description,
  size = "3xl",
  padding = "sm",
  position = 5,
  buttons,
}: Props) {
  if (type === "modal") {
    return (
      <Modal title={title} className={className} open={open} setOpen={setOpen} size={size} padding={padding} position={position}>
        {children}
      </Modal>
    );
  } else if (type === "slide") {
    return (
      <SlideOverWideEmpty
        title={title}
        description={description}
        className={className}
        open={open}
        onClose={() => setOpen(false)}
        size={size}
        position={position}
        buttons={buttons}
      >
        {children}
      </SlideOverWideEmpty>
    );
  }
  return null;
}
