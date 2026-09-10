export function formatPhone(value) {
  let numbers = value.replace(/\D/g, "");
  if (value.trimStart().startsWith("+7") ||
      (numbers.length === 11 && /^[78]/.test(numbers)) || numbers === "7") {
    numbers = numbers.slice(1);
  }
  numbers = numbers.slice(0, 10);

  let formatted = "+7 ";
  formatted += numbers.slice(0, 3);
  if (numbers.length > 3) formatted += " " + numbers.slice(3, 6);
  if (numbers.length > 6) formatted += " " + numbers.slice(6, 8);
  if (numbers.length > 8) formatted += " " + numbers.slice(8, 10);
  return formatted;
}
