export const omitString = (t: string) => {
  const max = 300;

  if (t.length > max) {
    return t.substr(0, max) + '...';
  }

  return t;
};
