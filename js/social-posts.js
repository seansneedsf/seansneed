/**
 * Social Posts Manager
 * Manages social media posts for the social feed page
 */

class SocialPostsManager {
    constructor() {
        this.posts = [];
        this.container = null;
        this.expandedPosts = new Set();
        
        // Sample social media posts data
        this.samplePosts = [
            {
                id: 'post-music-apple',
                platform: 'apple_music',
                platformName: 'Apple Music',
                platformIcon: '/images/icons/apple_icon.svg',
                platformColor: 'bg-gradient-to-r from-pink-500 to-rose-500',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: 'Currently Playing',
                timestamp: '15m ago',
                content: 'This track has been on repeat while working on some late-night design concepts. The ambient soundscapes really help me focus and get into that creative flow state. 🎵',
                songTitle: 'Weightless',
                artist: 'Marconi Union',
                album: 'Ambient Works',
                albumArt: '/images/seansneed.jpeg', // placeholder - you can add actual album art
                duration: '8:08',
                likes: 23,
                type: 'music'
            },
            {
                id: 'post-journal-plain',
                platform: 'journal',
                platformName: 'Journal Entry',
                platformIcon: '/images/icons/book_open_icon.svg',
                platformColor: 'bg-white',
                platformTextColor: 'text-neutral-900',
                author: 'Sean Sneed',
                handle: 'Personal Reflection',
                timestamp: '45m ago',
                content: 'Been reflecting on the evolution of design tools lately. Remember when we had to slice up PSDs and hand-code every interaction? Now we have tools that generate code from designs. The craft is evolving, but the fundamental principles of good design remain constant. It\'s not about the tools—it\'s about solving problems and creating meaningful experiences.',
                readTime: '2 min read',
                tags: ['Design', 'Reflection', 'Tools'],
                likes: 0, // Journal entries don't need social metrics
                type: 'journal'
            },
            {
                id: 'post-music-spotify',
                platform: 'spotify',
                platformName: 'Spotify',
                platformIcon: '/images/icons/spotify_icon.svg',
                platformColor: 'bg-gradient-to-r from-green-500 to-green-600',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: 'Recently Played',
                timestamp: '1h ago',
                content: 'Perfect coding soundtrack! This playlist keeps me in the zone during those marathon design sessions. The lo-fi beats create just the right atmosphere for deep work.',
                songTitle: 'Lofi Hip Hop Radio',
                artist: 'ChilledCow',
                album: 'Study Beats',
                albumArt: '/images/post_1.jpg', // placeholder
                duration: '∞ Live',
                likes: 45,
                type: 'music'
            },
            {
                id: 'post-new-example',
                platform: 'bluesky',
                platformName: 'Bluesky',
                platformIcon: '/images/icons/w_twitter_icon.svg',
                platformColor: 'bg-[rgb(0,133,255)]',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: '@seansneed.bsky.social',
                timestamp: '30m ago',
                content: 'Just discovered this amazing new social feed system I built! Adding new posts is as easy as editing a JavaScript array. Sometimes the simplest solutions are the most elegant. 🎨✨ #WebDesign #SocialMedia',
                likes: 67,
                reposts: 12,
                replies: 15,
                image: null,
                type: 'text'
            },
            {
                id: 'post-1',
                platform: 'bluesky',
                platformName: 'Bluesky',
                platformIcon: '/images/icons/w_twitter_icon.svg',
                platformColor: 'bg-[rgb(0,133,255)]',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: '@seansneed.bsky.social',
                timestamp: '2h ago',
                content: 'Just finished designing a new component library for a fintech startup. The challenge was creating something that felt both trustworthy and approachable. Sometimes the best designs are the ones that feel effortless to use. 🎨✨',
                likes: 42,
                reposts: 8,
                replies: 12,
                image: null,
                type: 'text'
            },
            {
                id: 'post-2',
                platform: 'instagram',
                platformName: 'Instagram',
                platformIcon: '/images/icons/w_instagram_icon.svg',
                platformColor: 'bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: '@theseansneed',
                timestamp: '6h ago',
                content: 'Behind the scenes of today\'s design session. Working on brand identity for a new sustainability-focused startup. Love how the natural textures are coming together! 🌱',
                likes: 127,
                comments: 23,
                image: '/images/post_1.jpg',
                type: 'image'
            },
            {
                id: 'post-3',
                platform: 'linkedin',
                platformName: 'LinkedIn',
                platformIcon: '/images/icons/w_linkedin_icon.svg',
                platformColor: 'bg-[rgb(10,102,194)]',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: 'Sean Sneed',
                timestamp: '1d ago',
                content: 'Reflecting on 8 years in design: The biggest lesson I\'ve learned is that great design isn\'t about following trends—it\'s about solving real problems for real people. Every project teaches you something new about human behavior and business needs.',
                likes: 89,
                comments: 15,
                shares: 7,
                image: null,
                type: 'text'
            },
            {
                id: 'post-4',
                platform: 'bluesky',
                platformName: 'Bluesky',
                platformIcon: '/images/icons/w_twitter_icon.svg',
                platformColor: 'bg-[rgb(0,133,255)]',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: '@seansneed.bsky.social',
                timestamp: '2d ago',
                content: 'Hot take: The best design systems are the ones that feel invisible. If your team is constantly fighting with your components, you\'re not building tools—you\'re building obstacles.',
                likes: 156,
                reposts: 34,
                replies: 28,
                image: null,
                type: 'text'
            },
            {
                id: 'post-5',
                platform: 'instagram',
                platformName: 'Instagram',
                platformIcon: '/images/icons/w_instagram_icon.svg',
                platformColor: 'bg-gradient-to-r from-orange-500 via-purple-500 to-pink-500',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: '@theseansneed',
                timestamp: '3d ago',
                content: 'San Francisco vibes today. Sometimes the best design inspiration comes from just walking around the city and observing how people interact with spaces. 🌉',
                likes: 203,
                comments: 31,
                image: '/images/seansneed.jpeg',
                type: 'image'
            },
            {
                id: 'post-6',
                platform: 'linkedin',
                platformName: 'LinkedIn',
                platformIcon: '/images/icons/w_linkedin_icon.svg',
                platformColor: 'bg-[rgb(10,102,194)]',
                platformTextColor: 'text-white',
                author: 'Sean Sneed',
                handle: 'Sean Sneed',
                timestamp: '4d ago',
                content: 'Just wrapped up a design sprint with an amazing team. Key takeaway: The best solutions often come from the constraints, not despite them. When you have limitations, creativity finds a way to flourish.',
                likes: 67,
                comments: 9,
                shares: 12,
                image: null,
                type: 'text'
            }
        ];
    }

    /**
     * Initialize the manager and load posts
     */
    async init() {
        this.container = document.getElementById('social-posts-container');
        if (!this.container) {
            console.error('Social posts container not found');
            return;
        }

        try {
            await this.loadPosts();
            this.renderPosts();
        } catch (error) {
            console.error('Failed to initialize social posts:', error);
            this.renderError();
        }
    }

    /**
     * Load posts from localStorage and sample data
     */
    async loadPosts() {
        // Load posts from localStorage (from admin panel)
        const savedPosts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
        
        // Combine saved posts with sample posts
        this.posts = [...savedPosts, ...this.samplePosts];
        
        console.log('Loaded social posts:', this.posts.length);
    }

    /**
     * Render all posts to the container
     */
    renderPosts() {
        if (!this.container || this.posts.length === 0) {
            this.renderEmpty();
            return;
        }

        this.container.innerHTML = '';

        this.posts.forEach((post) => {
            const postElement = this.createPostElement(post);
            this.container.appendChild(postElement);
        });
    }

    /**
     * Create HTML element for a single social post
     */
    createPostElement(post) {
        const article = document.createElement('article');
        article.className = `social-post relative rounded-lg ${post.platformColor} border shadow-lg shadow-black/50 p-6 transition-all duration-300 hover:shadow-xl`;
        article.id = post.id;

        const isExpanded = this.expandedPosts.has(post.id);
        
        article.innerHTML = this.createPostView(post, isExpanded);

        // Add click handlers for interactions
        article.addEventListener('click', (e) => {
            if (e.target.closest('.social-action')) return;
            if (post.content.length > 200) {
                this.togglePost(post.id);
            }
        });

        return article;
    }

    /**
     * Create post view HTML
     */
    createPostView(post, isExpanded = false) {
        const shouldTruncate = post.content.length > 200 && !isExpanded;
        const displayContent = shouldTruncate ? post.content.substring(0, 200) + '...' : post.content;
        
        // Handle different post types
        if (post.type === 'music') {
            return this.createMusicPostView(post, isExpanded);
        }
        
        if (post.type === 'journal') {
            return this.createJournalPostView(post, isExpanded);
        }
        
        // Default social media post view
        return `
            <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0">
                    <img src="/images/seansneed.jpeg" alt="${post.author}" class="w-12 h-12 rounded-full object-cover border-2 border-white/20">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <img src="${post.platformIcon}" alt="${post.platformName}" class="w-5 h-5">
                        <h4 class="font-semibold ${post.platformTextColor} font-inter text-sm">${post.author}</h4>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.handle}</span>
                        <span class="text-xs opacity-60 ${post.platformTextColor} font-inter">•</span>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.timestamp}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">Posted on</span>
                        <span class="text-xs font-medium ${post.platformTextColor} font-inter">${post.platformName}</span>
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <p class="${post.platformTextColor} text-sm leading-relaxed font-inter">${displayContent}</p>
                ${shouldTruncate ? `<button class="text-xs opacity-75 ${post.platformTextColor} hover:opacity-100 transition-opacity mt-2 font-inter">Read more</button>` : ''}
            </div>

            ${post.image ? `
                <div class="mb-4 rounded-lg overflow-hidden">
                    <img src="${post.image}" alt="Post image" class="w-full h-48 sm:h-64 object-cover hover:scale-105 transition-transform duration-300">
                </div>
            ` : ''}

            <div class="flex items-center justify-between pt-4 border-t border-white/20">
                <div class="flex items-center gap-6">
                    ${this.createEngagementStats(post)}
                </div>
                <div class="flex items-center gap-3">
                    ${this.createActionButtons(post)}
                </div>
            </div>
        `;
    }

    /**
     * Create music post view HTML
     */
    createMusicPostView(post, isExpanded = false) {
        const shouldTruncate = post.content.length > 200 && !isExpanded;
        const displayContent = shouldTruncate ? post.content.substring(0, 200) + '...' : post.content;
        
        return `
            <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0">
                    <img src="/images/seansneed.jpeg" alt="${post.author}" class="w-12 h-12 rounded-full object-cover border-2 border-white/20">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <img src="${post.platformIcon}" alt="${post.platformName}" class="w-5 h-5">
                        <h4 class="font-semibold ${post.platformTextColor} font-inter text-sm">${post.author}</h4>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.handle}</span>
                        <span class="text-xs opacity-60 ${post.platformTextColor} font-inter">•</span>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.timestamp}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">Listening on</span>
                        <span class="text-xs font-medium ${post.platformTextColor} font-inter">${post.platformName}</span>
                    </div>
                </div>
            </div>

            <!-- Music Player Card -->
            <div class="mb-4 p-4 rounded-lg bg-black/20 border border-white/10">
                <div class="flex items-center gap-4">
                    <div class="flex-shrink-0">
                        <img src="${post.albumArt}" alt="${post.album}" class="w-16 h-16 rounded-lg object-cover">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h5 class="font-semibold ${post.platformTextColor} font-inter text-sm truncate">${post.songTitle}</h5>
                        <p class="text-xs opacity-75 ${post.platformTextColor} font-inter truncate">${post.artist}</p>
                        <p class="text-xs opacity-60 ${post.platformTextColor} font-inter truncate">${post.album}</p>
                    </div>
                    <div class="flex-shrink-0">
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.duration}</span>
                    </div>
                </div>
                
                <!-- Fake Progress Bar -->
                <div class="mt-3 w-full bg-white/20 rounded-full h-1">
                    <div class="bg-white h-1 rounded-full" style="width: 65%"></div>
                </div>
            </div>

            <div class="mb-4">
                <p class="${post.platformTextColor} text-sm leading-relaxed font-inter">${displayContent}</p>
                ${shouldTruncate ? `<button class="text-xs opacity-75 ${post.platformTextColor} hover:opacity-100 transition-opacity mt-2 font-inter">Read more</button>` : ''}
            </div>

            <div class="flex items-center justify-between pt-4 border-t border-white/20">
                <div class="flex items-center gap-6">
                    ${this.createEngagementStats(post)}
                </div>
                <div class="flex items-center gap-3">
                    ${this.createActionButtons(post)}
                </div>
            </div>
        `;
    }

    /**
     * Create journal post view HTML
     */
    createJournalPostView(post, isExpanded = false) {
        const shouldTruncate = post.content.length > 300 && !isExpanded;
        const displayContent = shouldTruncate ? post.content.substring(0, 300) + '...' : post.content;
        
        return `
            <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0">
                    <img src="/images/seansneed.jpeg" alt="${post.author}" class="w-12 h-12 rounded-full object-cover border-2 border-neutral-200">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <img src="${post.platformIcon}" alt="${post.platformName}" class="w-5 h-5">
                        <h4 class="font-semibold ${post.platformTextColor} font-inter text-sm">${post.author}</h4>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.handle}</span>
                        <span class="text-xs opacity-60 ${post.platformTextColor} font-inter">•</span>
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">${post.timestamp}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">Personal</span>
                        <span class="text-xs font-medium ${post.platformTextColor} font-inter">${post.platformName}</span>
                        ${post.readTime ? `<span class="text-xs opacity-60 ${post.platformTextColor} font-inter">• ${post.readTime}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <p class="${post.platformTextColor} text-sm leading-relaxed font-inter">${displayContent}</p>
                ${shouldTruncate ? `<button class="text-xs opacity-75 ${post.platformTextColor} hover:opacity-100 transition-opacity mt-2 font-inter">Read more</button>` : ''}
            </div>

            ${post.tags && post.tags.length > 0 ? `
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${post.tags.map(tag => 
                            `<span class="px-2 py-1 rounded-md bg-neutral-100 text-neutral-700 text-xs font-medium font-inter">${tag}</span>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div class="flex items-center gap-2 text-xs text-neutral-500 font-inter">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    Personal reflection
                </div>
                <div class="flex items-center gap-3">
                    <button class="social-action flex items-center gap-1 px-3 py-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 transition-colors text-xs text-neutral-700 font-inter">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                        </svg>
                        Share
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create engagement statistics based on platform
     */
    createEngagementStats(post) {
        // Journal entries don't show engagement stats
        if (post.type === 'journal') {
            return '';
        }
        
        // Music posts show likes and play counts
        if (post.type === 'music') {
            return `
                <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    ${post.likes}
                </div>
                <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                    <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                    Playing
                </div>
            `;
        }
        
        switch (post.platform) {
            case 'bluesky':
                return `
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        ${post.likes}
                    </div>
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        ${post.reposts}
                    </div>
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6h-2l-1.27-1.27c-.4-.4-.86-.73-1.38-.73H7.65c-.52 0-.98.33-1.38.73L5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-3H9v-2h3v2zm0-4H9V8h3v4zm5 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3h-3v-2h3v2zm0-4h-3V8h3v4z"/>
                        </svg>
                        ${post.replies}
                    </div>
                `;
            case 'instagram':
                return `
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        ${post.likes}
                    </div>
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6h-2l-1.27-1.27c-.4-.4-.86-.73-1.38-.73H7.65c-.52 0-.98.33-1.38.73L5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-3H9v-2h3v2zm0-4H9V8h3v4zm5 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3h-3v-2h3v2zm0-4h-3V8h3v4z"/>
                        </svg>
                        ${post.comments}
                    </div>
                `;
            case 'linkedin':
                return `
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        ${post.likes}
                    </div>
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M21 6h-2l-1.27-1.27c-.4-.4-.86-.73-1.38-.73H7.65c-.52 0-.98.33-1.38.73L5 6H3c-.55 0-1 .45-1 1s.45 1 1 1h1v11c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8h1c.55 0 1-.45 1-1s-.45-1-1-1zM7 19c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm5-3H9v-2h3v2zm0-4H9V8h3v4zm5 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm0-3h-3v-2h3v2zm0-4h-3V8h3v4z"/>
                        </svg>
                        ${post.comments}
                    </div>
                    <div class="flex items-center gap-1 text-xs ${post.platformTextColor} opacity-75 font-inter">
                        <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/>
                        </svg>
                        ${post.shares}
                    </div>
                `;
            default:
                return '';
        }
    }

    /**
     * Create action buttons
     */
    createActionButtons(post) {
        return `
            <button class="social-action flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs ${post.platformTextColor} font-inter">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
                Share
            </button>
            <button class="social-action flex items-center gap-1 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/20 transition-colors text-xs ${post.platformTextColor} font-inter">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                View
            </button>
        `;
    }

    /**
     * Toggle post expansion
     */
    togglePost(postId) {
        if (this.expandedPosts.has(postId)) {
            this.expandedPosts.delete(postId);
        } else {
            this.expandedPosts.add(postId);
        }
        this.renderPosts();
    }

    /**
     * Refresh posts from storage
     */
    async refreshPosts() {
        await this.loadPosts();
        this.renderPosts();
    }

    /**
     * Render error state
     */
    renderError() {
        this.container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-red-500 mb-2">
                    <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </div>
                <p class="text-neutral-600 text-sm font-inter">Failed to load social posts</p>
            </div>
        `;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.container.innerHTML = `
            <div class="text-center py-8">
                <div class="text-neutral-400 mb-2">
                    <svg class="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                </div>
                <p class="text-neutral-600 text-sm font-inter">No social posts available</p>
            </div>
        `;
    }
}

// Initialize the social posts manager when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const socialManager = new SocialPostsManager();
    socialManager.init();
    
    // Listen for updates from admin panel
    let lastUpdateCheck = localStorage.getItem('socialPostsUpdated') || '0';
    
    // Check for updates every 2 seconds
    setInterval(() => {
        const currentUpdate = localStorage.getItem('socialPostsUpdated') || '0';
        if (currentUpdate !== lastUpdateCheck) {
            lastUpdateCheck = currentUpdate;
            socialManager.refreshPosts();
        }
    }, 2000);
    
    // Also listen for storage events (when admin panel is in another tab)
    window.addEventListener('storage', (e) => {
        if (e.key === 'socialPosts' || e.key === 'socialPostsUpdated') {
            socialManager.refreshPosts();
        }
    });
    
    // Make it globally available for debugging
    window.socialManager = socialManager;
}); 