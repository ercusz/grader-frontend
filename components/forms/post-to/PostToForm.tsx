import { useCourseSlug } from '@/hooks/courses/useCourses';
import { PostTo } from '@/types/types';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from '@mui/material';
import { PrimitiveAtom, useAtom } from 'jotai';

export interface IPostToForm {
  postToAtom: PrimitiveAtom<PostTo[]>;
  courseSlug: string;
  classroomSlug: string;
}

const PostToForm: React.FC<IPostToForm> = ({
  postToAtom,
  courseSlug,
  classroomSlug,
}) => {
  const [postTo, setPostTo] = useAtom(postToAtom);
  const { data: course } = useCourseSlug({ slug: courseSlug });

  return (
    <FormControl
      required
      error={postTo.length === 0}
      component="fieldset"
      variant="standard"
    >
      <FormLabel component="legend">คลาสเรียน</FormLabel>
      <FormGroup>
        {course?.classrooms.map((classroom) => (
          <FormControlLabel
            key={classroom.id}
            control={
              <Checkbox
                checked={postTo.some(
                  ({ classroom: c }) => c.id === classroom.id
                )}
                onChange={(e) => {
                  if (e.target.checked) {
                    setPostTo([
                      ...postTo,
                      {
                        classroom,
                        topic: null,
                      },
                    ]);
                  } else {
                    setPostTo(
                      postTo.filter(({ classroom: c }) => c.id !== classroom.id)
                    );
                  }
                }}
              />
            }
            label={
              classroom.slug === classroomSlug
                ? `${classroom.name} (คลาสเรียนปัจจุบัน)`
                : classroom.name
            }
          />
        ))}
      </FormGroup>

      {postTo.length === 0 && (
        <FormHelperText>โปรดเลือกคลาสเรียนที่ต้องการโพสต์</FormHelperText>
      )}
    </FormControl>
  );
};

export default PostToForm;
