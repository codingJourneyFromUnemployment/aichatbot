import { Menu, X } from "lucide-react";

interface ToggleButtonProps {
  isOpen: boolean;
  toggle: () => void;
}


const ToggleButton: React.FC<ToggleButtonProps> = ({ isOpen, toggle }) => {
  return (
    <button
      onClick={toggle}
      className="fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md lg:hidden"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  );
};

export default ToggleButton;
