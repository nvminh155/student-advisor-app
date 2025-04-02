const schedule = [
  { start: "07:00", periods: 5 }, // Buổi sáng
  { start: "12:30", periods: 5 }, // Buổi chiều
  { start: "17:30", periods: 4 }, // Buổi tối
];

const periodDuration = 50; // 50 phút mỗi tiết
const breakDuration = 20; // 20 phút nghỉ sau tiết 2

export default function tinhThoiGianHoc(
  tietBatDau: number,
  soTietPhaiHoc: number
) {
  let tietCount = 1;
  let startTime = null;
  let endTime = null;

  for (let session of schedule) {
    let [hours, minutes] = session.start.split(":").map(Number);
    const result = processSession(
      session.periods,
      tietBatDau,
      soTietPhaiHoc,
      tietCount,
      hours,
      minutes
    );
    if (result) {
      ({ startTime, endTime, tietCount } = result);
      if (endTime) return { startTime, endTime };
    }
  }

  return { startTime, endTime };
}

function processSession(
  periods: number,
  tietBatDau: number,
  soTietPhaiHoc: number,
  tietCount: number,
  hours: number,
  minutes: number
) {
  let startTime = null;
  let endTime = null;
  let hasTakenBreak = false;

  for (let i = 1; i <= periods; i++) {
    if (tietCount === tietBatDau) {
      startTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
    }

    // Cộng thêm 50 phút mỗi tiết học
    minutes += periodDuration;

    // Nếu sau tiết 2 và chưa nghỉ, cộng thêm 20 phút nghỉ
    if (i === 2 && !hasTakenBreak) {
      minutes += breakDuration;
      hasTakenBreak = true;
    }

    // Điều chỉnh giờ phút nếu quá 60 phút
    while (minutes >= 60) {
      minutes -= 60;
      hours += 1;
    }

    // Nếu đã học đủ số tiết, đây là giờ kết thúc
    if (tietCount === tietBatDau + soTietPhaiHoc - 1) {
      endTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
        2,
        "0"
      )}`;
      return { startTime, endTime, tietCount };
    }

    tietCount++;
  }

  return { startTime, endTime, tietCount };
}
