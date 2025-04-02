export function checkDateIsBetween(curDate: string, startDate: string, endDate: string) {
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day); // JS Date uses 0-based month index
  };

  const cur = parseDate(curDate);
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  return cur >= start && cur <= end; // Includes start and end dates
}

