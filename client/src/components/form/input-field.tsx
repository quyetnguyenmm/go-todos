import { InputHTMLAttributes } from 'react';
import { Control, FieldValues, Path, useController } from 'react-hook-form';

export type InputFieldProps<T extends FieldValues> = InputHTMLAttributes<HTMLInputElement> & {
  name: Path<T>;
  control: Control<T>;
};
export function InputField<T extends FieldValues>({ name, control, ...props }: InputFieldProps<T>) {
  const {
    field,
    fieldState: { invalid, error },
  } = useController({ name, control });

  console.log('error:', invalid);
  return (
    <div className="w-full">
      <input {...field} className="input-field" {...props} autoComplete="off" />
      <span className="field-error inline-block mt-1 text-sm italic">{error?.message}</span>
    </div>
  );
}
