export default function ISOConvertor(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < 60 * 1000) {
    // less than 1 minute ago
    return 'just now';
  } else if (diff < 60 * 60 * 1000) {
    // less than 1 hour ago
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} min${minutes !== 1 ? '' : ''}`;
  } else if (diff < 24 * 60 * 60 * 1000) {
    // less than 1 day ago
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} hr${hours !== 1 ? '' : ''}`;
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    // less than 1 week ago
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} d${days !== 1 ? '' : ''}`;
  } else {
    // more than 1 week ago
    const weeks = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    return `${weeks} week${weeks !== 1 ? '' : ''} ago`;
  }
}
