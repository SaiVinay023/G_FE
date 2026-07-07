import { TextField, TextFieldProps } from '@mui/material';
import { get } from 'lodash';
import { Controller, useFormContext } from 'react-hook-form-mui';

interface FormTextFieldProps extends Omit<TextFieldProps, 'name'> {
  name: string;
  rules?: Record<string, any>;
}

export const FormTextField = ({ name, rules, ...props }: FormTextFieldProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const errorMessage = get(errors, name)?.message as string | undefined;

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField {...field} {...props} value={field.value ?? ''} error={!!errorMessage} helperText={errorMessage} />
      )}
    />
  );
};
