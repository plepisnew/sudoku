import { ChangeEventHandler, useState } from "react";
import { Input } from "../ui/Input";

export const useInput = () => {
  const [value, setValue] = useState("");

  const handleChangeValue: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.currentTarget.value);
  };

  const InputNode = <Input value={value} onChange={handleChangeValue} />;

  return [value, InputNode];
};
