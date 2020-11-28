export function TIMESTAMPToJsDate(TIMESTAMP: string) {
  const DATES = TIMESTAMP.split("T")[0];
  const TIMES = TIMESTAMP.split("T")[1];
  const dates = DATES.split("-");
  const times = TIMES.split(":");
  return new Date(
    Number(dates[0]),
    Number(dates[1]) - 1,
    Number(dates[2]),
    Number(times[0]),
    Number(times[1])
  );
}
