import axios from 'axios';

// const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_BOT_TOKEN = '7840814435:AAFPY_yWc0aQ_p71dbP8Dc4FOp9ADkTrwPM';

export const getTelegramAvatar = async (userId: number): Promise<string | null> => {
  try {
    // Get user profile photos
    const photosResponse = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getUserProfilePhotos`,
      {
        params: {
          user_id: userId,
          limit: 1
        }
      }
    );

    const photos = photosResponse.data.result?.photos;
    if (!photos || photos.length === 0) {
      return null;
    }

    // Get the largest available photo
    const fileId = photos[0][photos[0].length - 1].file_id;

    // Get file path
    const fileResponse = await axios.get(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile`,
      {
        params: {
          file_id: fileId
        }
      }
    );

    const filePath = fileResponse.data.result?.file_path;
    if (!filePath) {
      return null;
    }

    // Construct full URL
    return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
  } catch (error) {
    console.error('Error fetching Telegram avatar:', error);
    return null;
  }
};