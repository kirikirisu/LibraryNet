export const omitString = (t: string) => {
  const max = 150;

  if (t.length > max) {
    return t.substr(0, max) + '...';
  }

  return t;
};
