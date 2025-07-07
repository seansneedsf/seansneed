# Sean Sneed - Social Posts System

A modern social media feed system with Supabase integration, featuring dynamic music posts with progress bars and real-time updates.

## Features

- **Multi-Platform Support**: Bluesky, Instagram, LinkedIn, Journal entries, Apple Music, and Spotify
- **Dynamic Music Posts**: Real-time progress bars, album artwork, and playback controls
- **Supabase Integration**: Real-time database storage and file uploads
- **Image Storage**: Efficient file handling using Supabase Storage (no localStorage quota issues)
- **Admin Interface**: Password-protected admin panel for managing posts
- **Real-time Updates**: Live updates across all connected clients

## Setup Instructions

### 1. Supabase Configuration

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to your project's SQL Editor and run the setup script from `setup-supabase.sql`
3. Create storage buckets:
   - Go to Storage in your Supabase dashboard
   - Create a bucket named `images` (for post images)
   - Create a bucket named `album-art` (for music post artwork)
   - Make both buckets public

### 2. Configure Application Settings

All configuration is now centralized in `js/config.js`. Update this single file with your settings:

**In `js/config.js`:**
```javascript
const CONFIG = {
    // Supabase Settings
    SUPABASE_URL: 'https://your-project-id.supabase.co',
    SUPABASE_ANON_KEY: 'your-anon-key-here',
    
    // Admin Settings
    ADMIN_PASSWORD: 'your-secure-password',
    
    // API Endpoints and other settings are pre-configured
};
```

**Benefits of centralized configuration:**
- Single source of truth for all settings
- Easy to update credentials across all pages
- Better security for production deployments
- Simplified maintenance

### 3. File Structure

```
seansneed/
├── social.html              # Main social feed page
├── social-admin.html        # Admin interface
├── js/
│   ├── config.js            # Centralized configuration
│   ├── social-posts-supabase.js  # Supabase-powered social manager
│   └── social-posts.js      # Legacy localStorage version
├── setup-supabase.sql       # Database setup script
└── images/                  # Static assets
```

## Usage

### Viewing the Social Feed
- Open `social.html` to view the social media feed
- Posts load automatically from Supabase
- Music posts display with dynamic progress bars and album artwork

### Adding New Posts
1. Go to `social-admin.html`
2. Enter the admin password
3. Select post type (Bluesky, Instagram, LinkedIn, Journal, Apple Music, Spotify)
4. Fill in content and platform-specific fields
5. Upload images/album art (stored in Supabase Storage)
6. Click "Publish Post"

### Music Posts Features
- **Dynamic Progress Bars**: Shows current playback position
- **Album Artwork**: Upload custom album art or use defaults
- **Song Information**: Title, artist, album, and duration
- **Play Button**: Interactive play/pause button
- **Platform Styling**: Matches Apple Music or Spotify branding

## Technical Details

### Database Schema
- `social_posts` table stores all post data
- Real-time subscriptions for live updates
- Proper data types for music-specific fields

### Storage Buckets
- `images`: General post images
- `album-art`: Music post album artwork
- All files are publicly accessible via CDN URLs

### Quota Solution
- **Problem**: localStorage has ~5-10MB limit, base64 images fill this quickly
- **Solution**: Files uploaded to Supabase Storage, only URLs stored in database
- **Result**: Unlimited file storage, faster loading times

### Music Post Rendering
- Progress bars calculated dynamically based on duration
- Album art displays from Supabase Storage URLs
- Fallback images for missing artwork
- Responsive design for all screen sizes

## Troubleshooting

### "Quota Exceeded" Error
- This was the original issue with localStorage
- Now resolved by using Supabase Storage for files
- Only metadata stored in database

### Posts Not Appearing
1. Check browser console for errors
2. Verify Supabase credentials are correct
3. Ensure database tables exist (run setup-supabase.sql)
4. Check storage bucket permissions are public

### Music Posts Missing Features
- Ensure `song_title`, `artist`, `album`, and `duration` fields are filled
- Upload album art or system will use fallback images
- Progress bars are simulated for demo (integrate with real music APIs for live data)

## Future Enhancements

- [ ] Real music API integration (Spotify Web API, Apple Music API)
- [ ] User authentication and multi-user support
- [ ] Post scheduling and drafts
- [ ] Analytics and engagement tracking
- [ ] Mobile app version
- [ ] Social sharing to actual platforms

## License

Private project for Sean Sneed's personal website. 