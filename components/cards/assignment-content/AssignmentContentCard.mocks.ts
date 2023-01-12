import { IAssignmentContentCard } from './AssignmentContentCard';

const base: IAssignmentContentCard = {
  assignment: {
    id: 1,
    classroomId: 1,
    title: 'Lab 1: A+B Problem',
    startDate: new Date(),
    endDate: new Date(),
    type: 'java-src',
    content: `### Table of contents

### คำสั่ง
ให้นักศึกษาเขียนโปรแกรมภาษาจาวาในการคำนวณผลบวกของตัวเลขสองตัว โดยรับอินพุตจากทางหน้าจอ

โดยรับ \`input\` เป็นตัวเลขจํานวนเต็ม \`a\` และ \`b\` จากนั้นให้ \`output\` ผลรวมของตัวเลขทั้ง 2 จํานวนออกทางหน้าจอ

### ข้อมูลนําเข้า

บรรทัดแรก จํานวนเต็ม \`a\` โดยที่ \`0 ≤ a ≤ 109\`

บรรทัดที่สอง จํานวนเต็ม \`b\` โดยที่ \`0 ≤ b ≤ 109\`

### ข้อมูลส่งออก

ผลรวม แสดงเป็นตัวเลข เพียงบรรทัดเดียว

### ตัวอย่างข้อมูลนำเข้า

\`\`\`
4
5
\`\`\`

### ตัวอย่างข้อมูลส่งออก

\`\`\`
9
\`\`\`

\`\`\`java
import java.io.*;
import java.util.*;

class Main {
    private static FastInput in = new FastInput(System.in);
    private static PrintWriter out = new PrintWriter(new BufferedOutputStream(System.out));

    public static void main(String[] args) {
        int a = in.nextInt();
        int b = in.nextInt();

        out.println(a + b);
        out.flush();
    }

    static class FastInput {
        BufferedReader br;
        StringTokenizer tok;

        public FastInput(InputStream in) {
            br = new BufferedReader(new InputStreamReader(System.in));
            tok = new StringTokenizer("");
        }

        public String next() {
            while (!tok.hasMoreTokens()) {
                try {
                    tok = new StringTokenizer(br.readLine());
                } catch (IOException e) {
                }
            }
            return tok.nextToken();
        }

        public int nextInt() {
            return Integer.parseInt(next());
        }

        public long nextLong() {
            return Long.parseLong(next());
        }

        public double nextDouble() {
            return Double.parseDouble(next());
        }
    }
}
\`\`\``,
    point: 100,
    createdAt: new Date(),
    createdBy: {
      id: 1234,
      firstName: 'John',
      lastName: 'Doe',
      username: 'johndoe69',
      profileImage: {
        id: 1234,
        url: 'https://i.pravatar.cc/?u=john',
      },
    },
    updatedAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    updatedBy: {
      id: 1235,
      firstName: 'Jane',
      lastName: 'Doe',
      username: 'janedoe69',
      profileImage: {
        id: 1235,
        url: 'https://i.pravatar.cc/?u=jane',
      },
    },
  },
};

export const mockAssignmentContentCardProps = {
  base,
};
