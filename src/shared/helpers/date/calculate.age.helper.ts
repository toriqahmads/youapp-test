export function calculateAge(birthday: Date, date_compare?: Date): number {
  const dateCompare = date_compare || new Date();
  const diff = dateCompare.getTime() - birthday.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
}
