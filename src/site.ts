// Set the real WhatsApp number in international digits, without + or spaces.
export const site = { brand: 'پیکسل', whatsappNumber: '989937825753' };

export function whatsappUrl(number: string, message: string): string | null {
  if (!/^[1-9]\d{7,14}$/.test(number)) return null;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function contactMessage(service = 'طراحی سایت') {
  if (service === 'طراحی سایت و مشاوره اولیه رایگان') return 'سلام، برای طراحی سایت کسب‌وکارم و مشاوره اولیه رایگان پیام می‌دهم.';
  return `سلام پیکسل، می‌خواهم درباره ${service} برای کسب‌وکارم صحبت کنیم.`;
}
