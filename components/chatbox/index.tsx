import Card from "./dialogcard";
import DialogForm from "./inputform";
import DialogTitle from "./dialogtitle";

export default function ChatBox() {
  return (
    <div className="z-10 flex flex-col justify-between items-center grow">
      <DialogTitle />
      <Card />
      <DialogForm />
    </div>
  );
}
