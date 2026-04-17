/**
 * Utility functions for handling PDF URLs, specifically for Cloudinary.
 */

/**
 * Ensures a Cloudinary URL is formatted to be opened in a browser PDF viewer
 * rather than being downloaded.
 */
export function getBrowserViewableUrl(url: string | null | undefined): string {
  if (!url) return "";

  // If it's a data URL, return as is
  if (url.startsWith("data:")) return url;

  try {
    let viewableUrl = url;

    // If it's a Cloudinary URL
    if (url.includes("cloudinary.com")) {
      // 1. Ensure it's not forced as an attachment
      viewableUrl = viewableUrl.replace("/fl_attachment", "");
      
      // 2. If it's a 'raw' resource type, browsers often fail to recognize it as a PDF
      // unless the extension is explicit. Changing to 'image' (if supported) or 
      // ensuring .pdf extension.
      if (viewableUrl.includes("/raw/upload/")) {
        // Many raw PDFs can be served via the image endpoint for better browser support
        viewableUrl = viewableUrl.replace("/raw/upload/", "/image/upload/");
      }

      // 3. Ensure it ends with .pdf if it's likely a PDF
      // We check if it doesn't already have a common extension
      const urlWithoutParams = viewableUrl.split("?")[0];
      if (!urlWithoutParams.toLowerCase().endsWith(".pdf") && 
          !urlWithoutParams.toLowerCase().endsWith(".png") && 
          !urlWithoutParams.toLowerCase().endsWith(".jpg") && 
          !urlWithoutParams.toLowerCase().endsWith(".jpeg")) {
        
        // Append .pdf extension for Cloudinary to serve with correct content-type
        if (viewableUrl.includes("?")) {
          const [base, params] = viewableUrl.split("?");
          viewableUrl = `${base}.pdf?${params}`;
        } else {
          viewableUrl = `${viewableUrl}.pdf`;
        }
      }
    }

    return viewableUrl;
  } catch (e) {
    console.error("Error formatting PDF URL:", e);
    return url;
  }
}
