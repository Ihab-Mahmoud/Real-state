import React from "react";

const NumberInput = ({ sell, text, name, min = "", defaultValue = "" }) => {
  return (
    <div className="flex gap-4 mt-2">
      <label className="flex gap-2 items-center">
        <input
          defaultValue={defaultValue && defaultValue}
          min={min && min}
          name={name}
          type="number"
          className="focus:outline-none p-2 rounded-xl w-16"
        />
        <div className="flex flex-col items-center justify-center ">
          {text}
          {(sell == false && (name == "price" || name == "discountedPrice")  ) && <span className="text-xs">$ / month</span>}
        </div>
      </label>
    </div>
  );
};

export default NumberInput;
