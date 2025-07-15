export const prefixURL = (url?: string) => {
  return url && url.startsWith("//") ? `https:${url}` : url;
};
