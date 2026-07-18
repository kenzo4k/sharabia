/**
 * Generates a unique order number in the format: SHR-YYMMDD-XXXXX
 * Where YYMMDD represents year, month, day, and XXXXX is a random 5-character alphanumeric string.
 */
export default function generateOrderNumber() {
  const date = new Date();
  
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  
  const dateStr = `${yy}${mm}${dd}`;
  
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let randomStr = '';
  for (let i = 0; i < 5; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return `SHR-${dateStr}-${randomStr}`;
}
