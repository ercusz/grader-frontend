import { format } from 'date-fns';
import { utils, writeFile } from 'xlsx';

export const exportSpreadsheet = async (data: any) => {
  try {
    if (!data || (data && data.length === 0)) {
      throw new Error('No data to export');
    }

    // remove assignment title identifier
    let res: any = [];
    data.forEach((item: any) => {
      let obj: any = {};
      for (const key in item) {
        let newKey = key;
        newKey = newKey.replace(/<(.+)>/i, '');

        obj[newKey] = item[key];
      }
      res.push(obj);
    });

    // create xlsx file
    const worksheet = utils.json_to_sheet(res);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Dates');
    utils.sheet_add_aoa(
      worksheet,
      [['รหัสนักศึกษา', 'ชื่อ', 'นามสกุล', 'อีเมล', 'ชื่อผู้ใช้']],
      { origin: 'A1' }
    );

    // generate date for file name using date-fns
    const date = format(new Date(), 'yyyyMMdd-HHmmss');
    writeFile(workbook, `student-scores-${date}.xlsx`, { compression: true });
  } catch (error: any) {
    throw new Error(error);
  }
};
