// API Configuration
export const API_BASE_URL = 'http://localhost:4000';
export const API_URL = `${API_BASE_URL}/api/v1`;

// Helper function to get full image URL
export const getImageUrl = (imagePath) => {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath}`;
};

export default {
    API_BASE_URL,
    API_URL,
    getImageUrl
};
