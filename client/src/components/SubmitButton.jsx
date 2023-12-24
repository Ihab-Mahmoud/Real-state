import React from 'react'

const SubmitButton = ({ type, disabled, color, text, onclick=null }) => {
  const greenC = color == "green" ? "bg-green-700" : "bg-slate-700";
  return (
    <button
      onClick={onclick && onclick}
      disabled={disabled}
      type={type}
      className={`${greenC} text-slate-100 p-3 border rounded-lg uppercase hover:opacity-80 transition-all w-full duration-300`}
    >
      {disabled ? "submitting" : text}
    </button>
  );
};  

export default SubmitButton