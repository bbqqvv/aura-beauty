export const slugify = (text) => {
  if (!text) return "";
  
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD") // Split accents from characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[đĐ]/g, "d") // Handle Vietnamese 'd'
    .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric (except spaces and dashes)
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/-+/g, "-"); // Remove double dashes
};
