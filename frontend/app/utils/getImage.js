const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }
  // console.log("Constructed Image URL:", `${BACKEND_URL}/${imagePath.replace(/^\/+/, "")}`);

   return `${BACKEND_URL}/${imagePath.replace(/^\/+/, "")}`;
}