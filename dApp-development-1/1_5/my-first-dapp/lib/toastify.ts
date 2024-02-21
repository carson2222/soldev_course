import { toast } from "react-toastify";

type toastType = "default" | "info" | "success" | "warn" | "error";

function notify(type: toastType, text: string = "😻 Wow so easy!", autoClose: number = 2500) {
  if (!type || type === "default") {
    toast(text, {
      position: "bottom-right",
      autoClose: autoClose,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    return;
  }

  toast[type](text, {
    position: "bottom-right",
    autoClose: autoClose,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
  });
}
export default notify;
