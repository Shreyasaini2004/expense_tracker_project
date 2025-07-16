import React from 'react';

const DeleteAlert = ({ content,onDelete }) => {
  return (
    <div>
      <p className='text-sm'>{content}</p>
      <div className='flex justify-end mt-6'>
        <button 
        onClick={onDelete}
        type='button'
        className='add-btn add-btn-fill'>
        Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAlert;
