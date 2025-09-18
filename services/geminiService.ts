
import * as api from './apiService.ts';

/**
 * Generates a caption for an image by calling the backend AI service.
 * @param base64Data The base64 encoded image data.
 * @param mimeType The MIME type of the image.
 * @returns A promise that resolves to the generated caption string.
 */
export const generateCaption = async (base64Data: string, mimeType: string): Promise<string> => {
  const response = await api.generateCaption(base64Data, mimeType);
  return response.caption;
};

/**
 * Generates an image for a story by calling the backend AI service.
 * @param prompt The text prompt to generate the image from.
 * @returns A promise that resolves to the base64 encoded image data.
 */
export const generateStoryImage = async (prompt: string): Promise<string> => {
  const response = await api.generateStoryImage(prompt);
  if (response.imageB64) {
    return response.imageB64;
  } else {
    throw new Error("Image generation failed, no images returned.");
  }
};

/**
 * Generates a comment suggestion by calling the backend AI service.
 * @param postCaption The caption of the post to comment on.
 * @param style The desired style of the comment (e.g., 'Witty', 'Formal').
 * @returns A promise that resolves to the generated comment string.
 */
export const generateComment = async (postCaption: string, style: string): Promise<string> => {
  const response = await api.generateComment(postCaption, style);
  return response.comment;
};


/**
 * Generates a user bio by calling the backend AI service.
 * @param username The user's username.
 * @param name The user's full name.
 * @returns A promise that resolves to the generated bio string.
 */
export const generateBio = async (username: string, name: string): Promise<string> => {
  const response = await api.generateBio(username, name);
  return response.bio;
};
