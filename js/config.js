// Centralized Configuration for Sean Sneed Website
// This file contains all configuration settings to avoid duplication

// Supabase Configuration
const CONFIG = {
    // Supabase Settings
    SUPABASE_URL: 'https://oujxbqzbgdsavuavkrep.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
    
    // Admin Settings
    ADMIN_PASSWORD: 'seansneed2025', // Change this to your actual admin password
    
    // API Endpoints
    JOURNAL_ENDPOINT: '/rest/v1/journal_entries',
    SOCIAL_POSTS_ENDPOINT: '/rest/v1/social_posts',
    
    // Storage Buckets
    IMAGES_BUCKET: 'images',
    ALBUM_ART_BUCKET: 'album-art',
    
    // Environment Detection
    IS_PRODUCTION: window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1'
};

// Helper function to get full Supabase URL with endpoint
CONFIG.getSupabaseUrl = function(endpoint) {
    return this.SUPABASE_URL + endpoint;
};

// Helper function to get storage URL
CONFIG.getStorageUrl = function(bucket, path) {
    return `${this.SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
};

// Make config available globally
window.CONFIG = CONFIG;

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} 