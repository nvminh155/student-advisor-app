
type ScheduleItem = {
  tiet: number;
  gio_bat_dau: string;
  so_phut: number;
  nhhk: number;
};

type WeekSchedule = {
  tuan_hoc_ky: number;
  tuan_tuyet_doi: number;
  thong_tin_tuan: string;
  ngay_bat_dau: string;
  ngay_ket_thuc: string;
  ds_thoi_khoa_bieu: Array<{
    is_hk_lien_truoc: number;
    thu_kieu_so: number;
    tiet_bat_dau: number;
    so_tiet: number;
    ma_mon: string;
    ten_mon: string;
    so_tin_chi: string;
    id_to_hoc: string;
    id_tkb: string;
    id_to_hop: string;
    ma_nhom: string;
    ma_to_th: string;
    ma_to_hop: string;
    ma_giang_vien: string;
    ten_giang_vien: string;
    ma_lop: string;
    ten_lop: string;
    ma_phong: string;
    ma_co_so: string;
    is_day_bu: boolean;
    ngay_hoc: string;
    tiet_bat_dau_kttc: string;
    id_tu_tao: string;
    is_file_bai_giang: boolean;
    id_sinh_hoat: string;
    is_dang_duyet_nghi_day: boolean;
    is_nghi_day: boolean;
  }>;
  ds_id_thoi_khoa_bieu_trung: Array<any>;
};

export type TTkbtuanusertheohockyPayload = {
  total_items: number;
  total_pages: number;
  ds_tiet_trong_ngay: ScheduleItem[];
  ds_tuan_tkb: WeekSchedule[];
  ds_lich_hoan_thi: Array<any>;
  title_lich_hoan_thi: string;
  is_duoc_diem_danh: boolean;
  is_duoc_dk_nghi_day: boolean;
  is_quan_ly_hoc_lieu: boolean;
  is_show_tiet: boolean;
  is_show_gio_ket_thuc: boolean;
  is_show_link_hoc_online: boolean;
  thong_bao: string;
};



