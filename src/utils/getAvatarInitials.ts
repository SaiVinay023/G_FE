export const getAvatarInitials = (name?: string): string => {
  if (!name) return 'NO';

  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return (words[0][0] + words[1][0]).toUpperCase();
};

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = '#';

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

export const stringAvatar = (name?: string, imageUrl?: string) => {
  return imageUrl
    ? { src: imageUrl, alt: name }
    : {
        sx: { bgcolor: stringToColor(name || 'NO') },
        children: getAvatarInitials(name),
      };
};
