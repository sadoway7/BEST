import React from 'react';

interface AddItemButtonProps {
  onClick: () => void;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-terracotta-main hover:bg-terracotta-light text-white font-bold py-2 px-4 rounded"
    >
      Add Item
    </button>
  );
};

export default AddItemButton;
