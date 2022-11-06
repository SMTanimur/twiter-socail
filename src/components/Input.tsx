import { FunctionComponent, LegacyRef } from "react";

const Input: FunctionComponent<{
  register: LegacyRef<HTMLInputElement>;
  label: string;
  error: any;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
}> = ({ register, label, error, ...rest }) => {
  return (
    <div>
      <div className="flex flex-col space-y-1">
        <span className="text-lg">{label}</span>
        <input
          type="text"
          {...rest}
          ref={register}
          className="p-1 rounded-md bg-dark-400 focus:outline-none"
        />
      </div>
      {error && <p className="m-0 text-red-600">{error?.message}</p>}
    </div>
  );
};

export default Input;
