export default function themeColor(index, opacity?) {
  const colors = [
    "235, 97, 56",
    "241, 142, 29",
    "125, 147, 186",
    "52, 99, 168",
    "132, 138, 183",
    "64, 75, 115",
    "205, 223, 239",
    "249, 234, 210",
    "162, 195, 231",
  ];
  if (!opacity) opacity = 1;
  return `rgba(${colors[index - 1]}, ${opacity})`;
}
