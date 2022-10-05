import { atom, useAtom } from 'jotai';

type LessonType = {
  num: number;
  name: string;
  checked: boolean;
};

const lessonsAtom = atom([
  {
    num: 1,
    name: 'บทที่ 1 Introduction',
    checked: true,
  },
  {
    num: 2,
    name: 'บทที่ 2 History',
    checked: true,
  },
]);

const rwLessonsAtom = atom(
  (get) => get(lessonsAtom),
  (get, set, lesson: LessonType) => {
    set(
      lessonsAtom,
      get(lessonsAtom).map((obj) =>
        obj.num === lesson.num
          ? Object.assign(obj, { checked: !obj.checked })
          : obj
      )
    );
  }
);

const readLessonsCheckedAtom = atom((get) =>
  get(lessonsAtom).every(({ checked }) => checked === true)
);

const readLessonsUnCheckedAtom = atom((get) =>
  get(lessonsAtom).every(({ checked }) => checked === false)
);

const writeLessonsCheckAllAtom = atom(null, (get, set) => {
  set(
    lessonsAtom,
    get(lessonsAtom).map((obj) => {
      if (get(readLessonsCheckedAtom) !== !get(readLessonsUnCheckedAtom)) {
        return Object.assign(obj, { checked: false });
      }

      return Object.assign(obj, { checked: !obj.checked });
    })
  );
});

export function useLessonFilters() {
  const [lessons, setLessons] = useAtom(rwLessonsAtom);
  const [isFilterAll] = useAtom(readLessonsCheckedAtom);
  const [isUnFilterAll] = useAtom(readLessonsUnCheckedAtom);
  const [_, setFilterAll] = useAtom(writeLessonsCheckAllAtom);

  return {
    lessons,
    setLessons,
    isFilterAll,
    isUnFilterAll,
    setFilterAll,
  } as const;
}
