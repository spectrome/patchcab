export const safeName = (name: string): string => {
  return name.replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
};
