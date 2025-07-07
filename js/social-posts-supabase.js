/**
 * Social Posts Manager with Supabase Integration
 * Manages social media posts with real-time database storage
 */

class SocialPostsManagerSupabase {
    constructor() {
        this.posts = [];
        this.container = null;
        this.expandedPosts = new Set();
        this.supabase = null;
        
        // Initialize Supabase client
        this.initSupabase();
    }

    /**
     * Initialize Supabase client
     */
    initSupabase() {
        // Use the same Supabase project as your journal entries
        const SUPABASE_URL = 'https://oujxbqzbgdsavuavkrep.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM';
        
        if (typeof supabase !== 'undefined') {
            this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
        } else {
            console.warn('Supabase not loaded, falling back to localStorage');
        }
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
            this.setupRealTimeSubscription();
        } catch (error) {
            console.error('Failed to initialize social posts:', error);
            this.renderError();
        }
    }

    /**
     * Load posts from Supabase or localStorage fallback
     */
    async loadPosts() {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from('social_posts')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                
                // Transform Supabase data to match our format
                this.posts = data.map(post => this.transformSupabasePost(post));
                
                console.log('Loaded social posts from Supabase:', this.posts.length);
                return;
            } catch (error) {
                console.error('Error loading from Supabase:', error);
            }
        }
        
        // Fallback to localStorage
        const savedPosts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
        this.posts = [...savedPosts, ...this.getSamplePosts()];
        
        console.log('Loaded social posts from localStorage:', this.posts.length);
    }

    /**
     * Transform Supabase post to our format
     */
    transformSupabasePost(dbPost) {
        return {
            id: `post-${dbPost.id}`,
            platform: dbPost.platform,
            platformName: dbPost.platform_name,
            platformIcon: dbPost.platform_icon,
            platformColor: dbPost.platform_color,
            platformTextColor: dbPost.platform_text_color,
            author: dbPost.author,
            handle: dbPost.handle,
            timestamp: this.formatTimestamp(dbPost.created_at),
            content: dbPost.content,
            type: dbPost.post_type,
            likes: dbPost.likes || 0,
            reposts: dbPost.reposts || 0,
            replies: dbPost.replies || 0,
            comments: dbPost.comments || 0,
            shares: dbPost.shares || 0,
            image: dbPost.image,
            albumArt: dbPost.album_art,
            songTitle: dbPost.song_title,
            artist: dbPost.artist,
            album: dbPost.album,
            duration: dbPost.duration,
            tags: dbPost.tags || [],
            readTime: dbPost.read_time
        };
    }

    /**
     * Format timestamp for display
     */
    formatTimestamp(timestamp) {
        const now = new Date();
        const postDate = new Date(timestamp);
        const diffMs = now - postDate;
        const diffMins = Math.floor(diffMs / (1000 * 60));
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return postDate.toLocaleDateString();
    }

    /**
     * Setup real-time subscription for new posts
     */
    setupRealTimeSubscription() {
        if (!this.supabase) return;

        this.supabase
            .channel('social_posts')
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: 'social_posts' },
                (payload) => {
                    console.log('Real-time update:', payload);
                    this.handleRealTimeUpdate(payload);
                }
            )
            .subscribe();
    }

    /**
     * Handle real-time updates
     */
    async handleRealTimeUpdate(payload) {
        switch (payload.eventType) {
            case 'INSERT':
                const newPost = this.transformSupabasePost(payload.new);
                this.posts.unshift(newPost);
                this.renderPosts();
                break;
            case 'UPDATE':
                const updatedPost = this.transformSupabasePost(payload.new);
                const updateIndex = this.posts.findIndex(p => p.id === `post-${payload.new.id}`);
                if (updateIndex !== -1) {
                    this.posts[updateIndex] = updatedPost;
                    this.renderPosts();
                }
                break;
            case 'DELETE':
                this.posts = this.posts.filter(p => p.id !== `post-${payload.old.id}`);
                this.renderPosts();
                break;
        }
    }

    /**
     * Save a new post to Supabase
     */
    async savePost(postData) {
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from('social_posts')
                    .insert([{
                        platform: postData.platform,
                        platform_name: postData.platformName,
                        platform_icon: postData.platformIcon,
                        platform_color: postData.platformColor,
                        platform_text_color: postData.platformTextColor,
                        author: postData.author,
                        handle: postData.handle,
                        content: postData.content,
                        post_type: postData.type,
                        likes: postData.likes || 0,
                        reposts: postData.reposts || 0,
                        replies: postData.replies || 0,
                        comments: postData.comments || 0,
                        shares: postData.shares || 0,
                        image: postData.image,
                        album_art: postData.albumArt,
                        song_title: postData.songTitle,
                        artist: postData.artist,
                        album: postData.album,
                        duration: postData.duration,
                        tags: postData.tags || [],
                        read_time: postData.readTime
                    }])
                    .select();

                if (error) throw error;
                
                console.log('Post saved to Supabase:', data);
                return data[0];
            } catch (error) {
                console.error('Error saving to Supabase:', error);
                throw error;
            }
        } else {
            // Fallback to localStorage
            const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
            posts.unshift(postData);
            localStorage.setItem('socialPosts', JSON.stringify(posts));
            return postData;
        }
    }

    /**
     * Delete a post from Supabase
     */
    async deletePost(postId) {
        const dbId = postId.replace('post-', '');
        
        if (this.supabase) {
            try {
                const { error } = await this.supabase
                    .from('social_posts')
                    .delete()
                    .eq('id', dbId);

                if (error) throw error;
                
                console.log('Post deleted from Supabase');
            } catch (error) {
                console.error('Error deleting from Supabase:', error);
                throw error;
            }
        } else {
            // Fallback to localStorage
            const posts = JSON.parse(localStorage.getItem('socialPosts') || '[]');
            const filtered = posts.filter(post => post.id !== postId);
            localStorage.setItem('socialPosts', JSON.stringify(filtered));
        }
    }

    /**
     * Get sample posts for fallback
     */
    getSamplePosts() {
        return [
            {
                id: 'sample-1',
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
                type: 'text'
            }
            // Add more sample posts as needed
        ];
    }

    /**
     * Refresh posts from storage
     */
    async refreshPosts() {
        await this.loadPosts();
        this.renderPosts();
    }

    // All the rendering methods remain the same as the original class
    // (renderPosts, createPostElement, createPostView, etc.)
    
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
     * Create enhanced music post view with dynamic elements
     */
    createMusicPostView(post, isExpanded = false) {
        const shouldTruncate = post.content.length > 200 && !isExpanded;
        const displayContent = shouldTruncate ? post.content.substring(0, 200) + '...' : post.content;
        
        // Calculate random progress for demo (in real app, this would come from API)
        const progressPercent = Math.floor(Math.random() * 80) + 10;
        const currentTime = this.formatMusicTime(progressPercent, post.duration);
        
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
                        <span class="text-xs opacity-75 ${post.platformTextColor} font-inter">Now Playing on</span>
                        <span class="text-xs font-medium ${post.platformTextColor} font-inter">${post.platformName}</span>
                    </div>
                </div>
            </div>

            <!-- Music Player Card -->
            <div class="bg-black/20 backdrop-blur-sm rounded-xl p-4 mb-4 border border-white/10">
                <div class="flex items-center gap-4 mb-3">
                    <div class="flex-shrink-0">
                        <img src="${post.albumArt || '/images/seansneed.jpeg'}" alt="${post.album}" class="w-16 h-16 rounded-lg object-cover shadow-lg">
                    </div>
                    <div class="flex-1 min-w-0">
                        <h3 class="font-semibold ${post.platformTextColor} text-base font-inter truncate">${post.songTitle}</h3>
                        <p class="text-sm opacity-80 ${post.platformTextColor} font-inter truncate">${post.artist}</p>
                        <p class="text-xs opacity-60 ${post.platformTextColor} font-inter truncate">${post.album}</p>
                    </div>
                    <div class="flex-shrink-0">
                        <button class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                            <svg class="w-5 h-5 ${post.platformTextColor}" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </div>
                </div>
                
                <!-- Progress Bar -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between text-xs opacity-75 ${post.platformTextColor} font-inter">
                        <span>${currentTime}</span>
                        <span>${post.duration}</span>
                    </div>
                    <div class="w-full bg-white/20 rounded-full h-1">
                        <div class="bg-white h-1 rounded-full transition-all duration-300" style="width: ${progressPercent}%"></div>
                    </div>
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
     * Create journal post view
     */
    createJournalPostView(post, isExpanded = false) {
        const shouldTruncate = post.content.length > 200 && !isExpanded;
        const displayContent = shouldTruncate ? post.content.substring(0, 200) + '...' : post.content;
        
        return `
            <div class="flex items-start gap-4 mb-4">
                <div class="flex-shrink-0">
                    <img src="/images/seansneed.jpeg" alt="${post.author}" class="w-12 h-12 rounded-full object-cover border-2 border-neutral-200">
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <img src="${post.platformIcon}" alt="${post.platformName}" class="w-5 h-5">
                        <h4 class="font-semibold ${post.platformTextColor} font-inter text-sm">${post.author}</h4>
                        <span class="text-xs text-neutral-500 font-inter">${post.handle}</span>
                        <span class="text-xs text-neutral-400 font-inter">•</span>
                        <span class="text-xs text-neutral-500 font-inter">${post.timestamp}</span>
                    </div>
                    <div class="flex items-center gap-2 mb-3">
                        <span class="text-xs text-neutral-500 font-inter">Personal</span>
                        <span class="text-xs font-medium text-neutral-700 font-inter">${post.platformName}</span>
                        ${post.readTime ? `<span class="text-xs text-neutral-500 font-inter">• ${post.readTime}</span>` : ''}
                    </div>
                </div>
            </div>

            <div class="mb-4">
                <p class="${post.platformTextColor} text-sm leading-relaxed font-inter">${displayContent}</p>
                ${shouldTruncate ? `<button class="text-xs text-neutral-600 hover:text-neutral-800 transition-colors mt-2 font-inter">Read more</button>` : ''}
            </div>

            ${post.tags && post.tags.length > 0 ? `
                <div class="mb-4">
                    <div class="flex flex-wrap gap-2">
                        ${post.tags.map(tag => `
                            <span class="px-2 py-1 bg-neutral-100 text-neutral-700 text-xs rounded-md font-inter">${tag}</span>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <div class="flex items-center justify-between pt-4 border-t border-neutral-200">
                <div class="flex items-center gap-6">
                    <span class="text-xs text-neutral-500 font-inter">Journal Entry</span>
                </div>
                <div class="flex items-center gap-3">
                    <button class="text-neutral-500 hover:text-neutral-700 transition-colors">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create engagement statistics
     */
    createEngagementStats(post) {
        const stats = [];
        
        if (post.likes > 0) {
            stats.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${post.platformTextColor} opacity-75" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z"/>
                    </svg>
                    <span class="text-xs ${post.platformTextColor} opacity-75 font-inter">${post.likes}</span>
                </div>
            `);
        }
        
        if (post.reposts > 0) {
            stats.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${post.platformTextColor} opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                    <span class="text-xs ${post.platformTextColor} opacity-75 font-inter">${post.reposts}</span>
                </div>
            `);
        }
        
        if (post.replies > 0) {
            stats.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${post.platformTextColor} opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span class="text-xs ${post.platformTextColor} opacity-75 font-inter">${post.replies}</span>
                </div>
            `);
        }
        
        if (post.comments > 0) {
            stats.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${post.platformTextColor} opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                    </svg>
                    <span class="text-xs ${post.platformTextColor} opacity-75 font-inter">${post.comments}</span>
                </div>
            `);
        }
        
        if (post.shares > 0) {
            stats.push(`
                <div class="flex items-center gap-1">
                    <svg class="w-4 h-4 ${post.platformTextColor} opacity-75" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                    </svg>
                    <span class="text-xs ${post.platformTextColor} opacity-75 font-inter">${post.shares}</span>
                </div>
            `);
        }
        
        return stats.join('');
    }

    /**
     * Create action buttons
     */
    createActionButtons(post) {
        return `
            <button class="social-action ${post.platformTextColor} opacity-75 hover:opacity-100 transition-opacity" onclick="window.socialManager.toggleLike('${post.id}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                </svg>
            </button>
            <button class="social-action ${post.platformTextColor} opacity-75 hover:opacity-100 transition-opacity" onclick="window.socialManager.sharePost('${post.id}')">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                </svg>
            </button>
        `;
    }

    /**
     * Format music time for progress display
     */
    formatMusicTime(progressPercent, duration) {
        if (!duration || duration === '∞ Live') return '0:00';
        
        // Parse duration (e.g., "3:45" or "8:08")
        const parts = duration.split(':');
        if (parts.length !== 2) return '0:00';
        
        const totalSeconds = parseInt(parts[0]) * 60 + parseInt(parts[1]);
        const currentSeconds = Math.floor((progressPercent / 100) * totalSeconds);
        
        const minutes = Math.floor(currentSeconds / 60);
        const seconds = currentSeconds % 60;
        
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
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

    /**
     * Toggle like on a post
     */
    async toggleLike(postId) {
        try {
            // Find the post
            const post = this.posts.find(p => p.id === postId);
            if (!post) return;

            // Get current like status from localStorage
            const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
            const isLiked = likedPosts.includes(postId);
            
            // Toggle like count
            const newLikeCount = isLiked ? post.likes - 1 : post.likes + 1;
            
            // Update in database
            if (this.supabase) {
                const { error } = await this.supabase
                    .from('social_posts')
                    .update({ likes: newLikeCount })
                    .eq('id', postId.replace('post-', ''));

                if (error) throw error;
            }

            // Update local state
            post.likes = newLikeCount;
            
            // Update localStorage
            if (isLiked) {
                const index = likedPosts.indexOf(postId);
                if (index > -1) likedPosts.splice(index, 1);
            } else {
                likedPosts.push(postId);
            }
            localStorage.setItem('likedPosts', JSON.stringify(likedPosts));

            // Show feedback
            this.showToast(isLiked ? 'Like removed' : 'Post liked!');
            
            // Re-render posts to show updated count
            this.renderPosts();
            
        } catch (error) {
            console.error('Error toggling like:', error);
            this.showToast('Failed to update like');
        }
    }

    /**
     * Share a post
     */
    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const shareText = `Check out this post by ${post.author}: "${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}"`;
        const shareUrl = window.location.href;

        if (navigator.share) {
            navigator.share({
                title: `Post by ${post.author}`,
                text: shareText,
                url: shareUrl
            });
        } else {
            // Fallback to copying link
            navigator.clipboard.writeText(shareUrl).then(() => {
                this.showToast('Link copied to clipboard!');
            }).catch(() => {
                this.showToast('Failed to copy link');
            });
        }
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-neutral-900 text-white px-4 py-2 rounded-lg text-sm font-inter z-50 transition-opacity duration-300';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SocialPostsManagerSupabase;
} 