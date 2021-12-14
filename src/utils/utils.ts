export const generateKey = (arg: any): string => {
  return `${arg}_${new Date().getTime()}`;
};
