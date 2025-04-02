import loadEventTKBTuan from "./loadEventTKBTuan";
import tinhThoiGianHoc from "./tinhThoiGianHoc";

export function convertDateViToEn(dateStringVN: string) {
  const [day, month, year] = dateStringVN.split("/");
  if (!day || !month || !year) {
    throw new Error("Invalid date format. Expected 'dd/mm/yyyy'.");
  }
  return `${year}-${month}-${day}`;
}

export function dateToString(
  date: Date,
  format: "yyyy-mm-dd" | "dd-mm-yyyy" = "yyyy-mm-dd"
) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return format
    .replace("yyyy", String(year))
    .replace("mm", month)
    .replace("dd", day);
}

export { loadEventTKBTuan, tinhThoiGianHoc };
