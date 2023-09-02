export function calculateReadingTime(jsonData: any, other: string | null) {
  const wordCount = JSON.stringify(jsonData).split(' ').length;
  const total = other ? wordCount + other.length : wordCount;
  const readingTime = Math.ceil(total / 200);
  return readingTime;
}
