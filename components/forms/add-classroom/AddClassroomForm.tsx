import { MuiChipsInput } from 'mui-chips-input';
import { Controller, UseFormReturn } from 'react-hook-form';

export interface IAddClassroomForm {
  formContext: UseFormReturn<
    {
      classrooms: string[];
    },
    any
  >;
  currentClassrooms?: string[];
}

const AddClassroomForm: React.FC<IAddClassroomForm> = ({
  formContext,
  currentClassrooms,
}) => {
  const {
    control,
    formState: { errors },
  } = formContext;

  const isNotContainDuplicateSections = (arr: string[]) => {
    const found = currentClassrooms
      ? arr.some((r) => currentClassrooms.indexOf(r) >= 0)
      : false;
    if (found) {
      return false;
    }

    return new Set(arr).size === arr.length;
  };

  return (
    <form>
      <Controller
        name="classrooms"
        control={control}
        rules={{
          validate: {
            duplicate: (value) => isNotContainDuplicateSections(value),
          },
        }}
        render={({ field, fieldState }) => (
          <MuiChipsInput
            {...field}
            fullWidth
            helperText={
              errors?.classrooms?.type === 'duplicate'
                ? 'ไม่สามารถใส่ชื่อกลุ่มการเรียนที่ซ้ำกันได้'
                : 'หากต้องการแก้ไข ให้ดับเบิลคลิกที่ชื่อกลุ่มการเรียน'
            }
            placeholder="พิมพ์ชื่อกลุ่มการเรียน แล้วกด Enter"
            clearInputOnBlur
            error={fieldState.error ? true : false}
          />
        )}
      />
    </form>
  );
};

export default AddClassroomForm;
