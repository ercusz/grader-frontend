import { IAssignmentCard } from './AssignmentCard';

const base: IAssignmentCard = {
  assignment: {
    id: 4,
    classroomId: 1,
    title: 'Lecture 1: Flow Chart',
    startDate: new Date(
      new Date().getTime() + 72 * 60 * 60 * 1000
    ).toISOString(),
    endDate: new Date(
      new Date().getTime() + 144 * 60 * 60 * 1000
    ).toISOString(),
    type: 'docs',
    content: `**คำสั่ง:** ให้นักศึกษาเขียนผังงาน Flowchart ของโจทย์ต่อไปนี้

## โจทย์
จงเขียนโปรแกรมตรวจสอบว่าตัวเลขที่รับเข้ามาเป็น[เลขคู่หรือเลขคี่](https://www.mathsisfun.com/numbers/even-odd.html)

โดยต้องเขียน Flowchart ให้ครบทุกกรณีที่เกิดขึ้นได้ และต้องเขียนเป็นภาษาอังกฤษ

### ข้อมูลนำเข้า

บรรทัดแรก จํานวนเต็ม \`a\` โดยที่ \`0 ≤ a ≤ 109\`

### ข้อมูลส่งออก

ถ้า \`a\` เป็นเลขคู่ให้แสดง \`Even\` ถ้าเป็นเลขคี่ให้แสดง \`Odd\` ทางหน้าจอ เพียงบรรทัดเดียว

เมื่อเขียนเสร็จแล้วให้ส่งไฟล์ในรูปแบบ PDF เท่านั้น`,
    point: 100,
    createdAt: new Date(
      new Date().getTime() + 72 * 60 * 60 * 1000
    ).toISOString(),
    createBy: {
      id: 1234,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe69',
      profileImage: {
        id: 1234,
        url: 'https://i.pravatar.cc/?u=john',
      },
    },
    updatedAt: new Date(
      new Date().getTime() + 72 * 60 * 60 * 1000
    ).toISOString(),
    updateBy: null,
    topic: null,
    enabledPointDeduction: false,
  },
  classroomSlug: '',
};

export const mockAssignmentCardProps = {
  base,
};
