import React from 'react';

interface AddItemButtonProps {
  onClick: () => void;
}

const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-primary-main hover:bg-primary-light text-white font-medium py-2.5 px-4 rounded-lg 
                 shadow-md hover:shadow-lg transition-all duration-300 ease-in-out 
                 flex items-center justify-center space-x-2 
                 focus:outline-none focus:ring-2 focus:ring-primary-lighter focus:ring-offset-2"
    >
      <svg className="h-6 w-5" fill="none" stroke="currentColor" viewBox="2 2 20 21">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
      <span>Add To List</span>
    </button>
  );
};

export default AddItemButton;
