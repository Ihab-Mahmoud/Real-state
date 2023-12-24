import React from 'react'

const Input = ({
  type,
  name,
  placeholder,
  defaultValue = "",
  minLength = "",
  
}) => {
  return (
    <input
      required
      type={type}
      name={name}
      className="p-3 border rounded-lg focus:outline-none"
      placeholder={placeholder ? placeholder : name}
      minLength={minLength && minLength}
      defaultValue={defaultValue}
    ></input>
  );
};

export default Input