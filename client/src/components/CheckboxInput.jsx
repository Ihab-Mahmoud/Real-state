import React from "react";

const CheckboxInput = ({
  defaultChecked = false,
  name,
  refType = null,
  handleSellOrRent = null,
  text,
  handleOffer = null,
}) => {
  return (
    <label className="flex gap-2 items-center text-sm ">
      <input
        defaultChecked={defaultChecked}
        type="checkbox"
        className="w-4 h-4 "
        name={name}
        ref={refType && refType}
        onClick={handleSellOrRent && handleSellOrRent}
        onChange={handleOffer && handleOffer}
      />
      {text}
    </label>
  );
};

export default CheckboxInput;
