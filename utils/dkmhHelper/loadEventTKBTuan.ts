import { TTkbtuanusertheohockyPayload } from "@/types/dkmh";
import { checkDateIsBetween } from "../dateHelper/checkDateIsBetween";

const loadEventTKBTuan = (data?: TTkbtuanusertheohockyPayload) => {
  if (!data) return [];

  console.log("DATA TKB TUAN", data);
  const ds_tkb_tuan = data.ds_tuan_tkb.find((tkbTuan) => {
    const curDate = new Date();

    return checkDateIsBetween(
      `${curDate.getDate()}/${curDate.getMonth() + 1}/${curDate.getFullYear()}`,
      tkbTuan.ngay_bat_dau,
      tkbTuan.ngay_ket_thuc
    );
  });

  return ds_tkb_tuan?.ds_thoi_khoa_bieu ?? [];
};

export default loadEventTKBTuan;
