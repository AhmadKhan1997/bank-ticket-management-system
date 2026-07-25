export function generateTicketNumber(prefixCode) {
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  return prefixCode.toUpperCase() + "-" + randomNumber;
}