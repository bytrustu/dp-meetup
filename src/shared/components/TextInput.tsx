import { ChangeEvent } from 'react';

type TextInputProps = {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
};

const TextInput = ({ value, onChange, placeholder }: TextInputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    className="w-full p-3 text-lg rounded-lg border-2 border-gray-300 text-center"
  />
);

export default TextInput;
