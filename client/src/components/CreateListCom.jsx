import React from 'react'

const CreateListCom = ({ index, file }) => {
  return (
    <div
      key={index}
      className="flex border border-gray-300 p-4 justify-between items-center w-full"
    >
      <img className="w-16 h-10 rounded-md" src={file} alt="real state" />
      {/* <button
        type="button"
        onClick={() => deleteImage(index)}
        className="uppercase text-red-600  "
      >
        Delete
      </button> */}
    </div>
  );
};

export default CreateListCom