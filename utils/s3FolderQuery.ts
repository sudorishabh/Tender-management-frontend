const PDF_FOLDER = "pdf";
const IMAGE_FOLDER = "images";

export const getPdfFileQuery = (fileName: string) => {
  return {
    fileName: `${PDF_FOLDER}/${fileName}`,
    fileType: "application/pdf",
  };
};

export const getImageFileQuery = (fileName: string) => {
  return {
    fileName: `${IMAGE_FOLDER}/${fileName}`,
    fileType: "image/jpeg",
  };
};
