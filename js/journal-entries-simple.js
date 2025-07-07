/**
 * Simplified Journal Entries Manager with Supabase Backend
 * No more JSON files, localStorage, or GitHub complexity!
 */

class SimpleJournalManager {
    constructor() {
        this.entries = [];
        this.container = null;
        this.expandedEntries = new Set();
        this.currentFilter = null;
        this.supabase = null;
        
        // Initialize Supabase client
        this.initSupabase();
    }

    /**
     * Initialize Supabase client
     */
    initSupabase() {
        const SUPABASE_URL = 'https://oujxbqzbgdsavuavkrep.supabase.co';
        const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM';
        
        if (typeof supabase !== 'undefined') {
            this.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            console.log('✅ Supabase client initialized');
        } else {
            console.warn('⚠️ Supabase not loaded, falling back to fetch requests');
        }
    }

    /**
     * Test Supabase connection by trying to access the journal_entries table
     */
    async testConnection() {
        console.log('🔧 Testing Supabase connection...');
        
        if (this.supabase) {
            try {
                // Test with a simple query
                const { data, error } = await this.supabase
                    .from('journal_entries')
                    .select('id')
                    .limit(1);
                
                if (error) {
                    console.error('❌ Supabase connection test failed:', error);
                    return false;
                }
                
                console.log('✅ Supabase connection test successful');
                return true;
            } catch (error) {
                console.error('❌ Supabase connection test failed:', error);
                return false;
            }
        } else {
            // Fallback to fetch request
            try {
                const response = await fetch('https://oujxbqzbgdsavuavkrep.supabase.co/rest/v1/journal_entries?limit=1', {
                    method: 'HEAD',
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM'
                    }
                });
                console.log('🔗 Fallback connection test status:', response.status);
                return response.ok;
            } catch (error) {
                console.error('❌ Fallback connection test failed:', error);
                return false;
            }
        }
    }

    /**
     * Initialize the manager and load entries
     */
    async init() {
        console.log('🚀 Initializing SimpleJournalManager...');
        
        this.container = document.getElementById('journal-entries-container');
        if (!this.container) {
            console.error('❌ Journal entries container not found');
            return;
        }

        // Show loading state
        this.container.innerHTML = `
            <div class="text-center py-8">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-600 mx-auto mb-2"></div>
                <p class="text-neutral-600 text-sm font-inter">Connecting to database...</p>
            </div>
        `;

        try {
            // Test connection first
            const isConnected = await this.testConnection();
            if (!isConnected) {
                throw new Error('Unable to connect to Supabase. Please check your configuration.');
            }
            
            console.log('📡 Attempting to load entries from Supabase...');
            await this.loadEntries();
            console.log('✅ Entries loaded successfully, count:', this.entries.length);
            this.renderEntries();
            this.updateAnalytics();
        } catch (error) {
            console.error('❌ Failed to initialize journal entries:', error);
            this.renderError(error.message);
        }
    }

    /**
     * Get default styling object for entries
     */
    getDefaultStyling() {
        return {
            backgroundColor: 'bg-white',
            borderColor: 'border-neutral-200',
            titleColor: 'text-neutral-900',
            companyColor: 'text-neutral-700',
            descriptionColor: 'text-neutral-600',
            dateColor: 'text-neutral-500'
        };
    }

    /**
     * Load entries from Supabase
     */
    async loadEntries() {
        console.log('🔗 Loading entries from Supabase...');
        
        if (this.supabase) {
            try {
                const { data, error } = await this.supabase
                    .from('journal_entries')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('❌ Supabase query error:', error);
                    throw new Error(`Database error: ${error.message}`);
                }

                console.log('📦 Raw Supabase data:', data);
                
                // Process entries to ensure proper data types
                this.entries = data.map(entry => {
                    // Ensure styling is parsed properly from JSONB
                    if (typeof entry.styling === 'string') {
                        try {
                            entry.styling = JSON.parse(entry.styling);
                        } catch (e) {
                            console.warn('Failed to parse styling for entry:', entry.id);
                            entry.styling = this.getDefaultStyling();
                        }
                    } else if (!entry.styling) {
                        entry.styling = this.getDefaultStyling();
                    }
                    
                    // Ensure images is an array
                    if (!entry.images || !Array.isArray(entry.images)) {
                        entry.images = [];
                    }
                    
                    // Ensure tags is an array
                    if (!entry.tags || !Array.isArray(entry.tags)) {
                        entry.tags = [];
                    }
                    
                    // Ensure full_content is an array
                    if (!entry.full_content || !Array.isArray(entry.full_content)) {
                        entry.full_content = [entry.description || 'No content available'];
                    }
                    
                    return entry;
                });
                
                console.log('✅ Loaded entries from Supabase:', this.entries.length);
                
                if (this.entries.length === 0) {
                    console.warn('⚠️ No entries found in database');
                    console.log('💡 Try accessing the admin panel to add some entries');
                } else {
                    console.log('📋 First entry sample:', this.entries[0]);
                    console.log('📋 Styling object:', this.entries[0].styling);
                }
                
            } catch (error) {
                console.error('💥 Error in loadEntries:', error);
                throw error;
            }
        } else {
            // Fallback to fetch request
            try {
                const response = await fetch('https://oujxbqzbgdsavuavkrep.supabase.co/rest/v1/journal_entries?select=*&order=created_at.desc', {
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
                        'Content-Type': 'application/json'
                    }
                });

                console.log('📊 Fallback response status:', response.status);

                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ HTTP error response:', errorText);
                    throw new Error(`HTTP ${response.status}: ${errorText}`);
                }

                const data = await response.json();
                console.log('📦 Raw fallback data:', data);
                
                // Process entries to ensure proper data types
                this.entries = data.map(entry => {
                    // Ensure styling is parsed properly from JSONB
                    if (typeof entry.styling === 'string') {
                        try {
                            entry.styling = JSON.parse(entry.styling);
                        } catch (e) {
                            console.warn('Failed to parse styling for entry:', entry.id);
                            entry.styling = this.getDefaultStyling();
                        }
                    } else if (!entry.styling) {
                        entry.styling = this.getDefaultStyling();
                    }
                    
                    // Ensure images is an array
                    if (!entry.images || !Array.isArray(entry.images)) {
                        entry.images = [];
                    }
                    
                    // Ensure tags is an array
                    if (!entry.tags || !Array.isArray(entry.tags)) {
                        entry.tags = [];
                    }
                    
                    // Ensure full_content is an array
                    if (!entry.full_content || !Array.isArray(entry.full_content)) {
                        entry.full_content = [entry.description || 'No content available'];
                    }
                    
                    return entry;
                });
                
                console.log('✅ Loaded entries from fallback:', this.entries.length);
                
            } catch (error) {
                console.error('💥 Error in fallback loadEntries:', error);
                // Check if it's a network error
                if (error instanceof TypeError && error.message.includes('fetch')) {
                    throw new Error('Network connection failed. Please check your internet connection.');
                }
                // Check if it's a CORS error
                if (error.message.includes('CORS')) {
                    throw new Error('CORS error. Please check Supabase configuration.');
                }
                throw error;
            }
        }
    }

    /**
     * Add a new entry (for admin use)
     */
    async addEntry(entryData) {
        try {
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('journal_entries')
                    .insert([{
                        title: entryData.title,
                        company: entryData.company,
                        description: entryData.description,
                        full_content: entryData.fullContent,
                        tags: entryData.tags,
                        read_time: entryData.readTime,
                        icon: entryData.icon,
                        styling: entryData.styling,
                        featured: entryData.featured,
                        date_text: entryData.date, // Human readable date
                        created_at: new Date().toISOString()
                    }])
                    .select();

                if (error) {
                    console.error('❌ Supabase insert error:', error);
                    throw new Error(`Database error: ${error.message}`);
                }

                console.log('✅ Entry added successfully via Supabase:', data);
                
                // Refresh the entries list
                await this.loadEntries();
                this.renderEntries();
                this.updateAnalytics(); // Update analytics after adding entry
                
                return data[0];
            } else {
                // Fallback to fetch request
                const response = await fetch('https://oujxbqzbgdsavuavkrep.supabase.co/rest/v1/journal_entries', {
                    method: 'POST',
                    headers: {
                        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
                        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im91anhicXpiZ2RzYXZ1YXZrcmVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5NTg1NzAsImV4cCI6MjA2NjUzNDU3MH0.Sc7S82P08g6aKOfsuDzn9XmDoqfKyUZmoXj7p1_4MfM',
                        'Content-Type': 'application/json',
                        'Prefer': 'return=representation'
                    },
                    body: JSON.stringify({
                        title: entryData.title,
                        company: entryData.company,
                        description: entryData.description,
                        full_content: entryData.fullContent,
                        tags: entryData.tags,
                        read_time: entryData.readTime,
                        icon: entryData.icon,
                        styling: entryData.styling,
                        featured: entryData.featured,
                        date_text: entryData.date, // Human readable date
                        created_at: new Date().toISOString()
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const newEntry = await response.json();
                console.log('✅ Entry added successfully via fallback:', newEntry);
                
                // Refresh the entries list
                await this.loadEntries();
                this.renderEntries();
                this.updateAnalytics(); // Update analytics after adding entry
                
                return newEntry;
            }
        } catch (error) {
            console.error('❌ Error adding entry:', error);
            throw error;
        }
    }

    /**
     * Render all entries to the container
     */
    renderEntries() {
        if (!this.container || this.entries.length === 0) {
            this.renderEmpty();
            return;
        }

        this.container.innerHTML = '';

        this.entries.forEach((entry) => {
            const entryElement = this.createEntryElement(entry);
            this.container.appendChild(entryElement);
        });
    }

    /**
     * Create HTML element for a single journal entry
     * relative rounded-lg bg-neutral-50 border border-neutral-200 p-5 shadow-lg shadow-black/50
     */
    createEntryElement(entry) {
        const article = document.createElement('article');
        article.className = `journal-entry relative rounded-lg ${entry.styling.backgroundColor} border ${entry.styling.borderColor} shadow-lg shadow-black/50 cursor-pointer hover:shadow-xl overflow-hidden`;
        article.id = entry.id;

        const isExpanded = this.expandedEntries.has(entry.id);
        
        if (isExpanded) {
            article.innerHTML = this.createExpandedView(entry);
        } else {
            article.innerHTML = this.createCollapsedView(entry);
        }

        article.addEventListener('click', (e) => {
            if (e.target.closest('.social-button')) return;
            this.toggleEntry(entry.id);
        });

        return article;
    }

    /**
     * Create collapsed view HTML
     */
    createCollapsedView(entry) {
        // Check if entry has images
        const hasImages = entry.images && Array.isArray(entry.images) && entry.images.length > 0;
        const firstImage = hasImages ? entry.images[0] : null;
        
        return `
            <div class="p-6 sm:p-8">
                <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                    <h4 class="text-lg font-geist font-light tracking-tight ${entry.styling.titleColor} leading-tight">
                    ${entry.icon ? `<img src="${entry.icon}" alt="${entry.title}" class="w-[24px] h-[24px] inline-block mr-2 mb-1">` : ''}
                    ${entry.title}</h4>
                    <span class="text-xs ${entry.styling.dateColor} font-medium font-inter">${entry.date_text}</span>
                </div>
                <p class="${entry.styling.companyColor} font-medium mb-2 font-inter text-sm">${entry.company}</p>
                <p class="${entry.styling.descriptionColor} text-xs leading-relaxed font-inter line-clamp-3">${entry.description}</p>
                
                ${hasImages ? `
                    <div class="mt-4 mb-4">
                        <div class="relative rounded-lg overflow-hidden">
                            <img src="${firstImage.data || firstImage.dataUrl}" alt="${firstImage.name || 'Entry image'}" class="w-full h-32 sm:h-40 object-cover">
                            ${entry.images.length > 1 ? `
                                <div class="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full">
                                    +${entry.images.length - 1} more
                                </div>
                            ` : ''}
                        </div>
                    </div>
                ` : ''}
                
                <div class="flex items-center justify-between pt-6">
                    <div class="flex flex-wrap gap-2">
                        ${entry.tags.slice(0, 3).map(tag => 
                            `<button onclick="window.journalManager.filterByTag('${tag}')" class="px-3 py-1.5 rounded-md ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'} text-xs font-medium font-inter transition-colors cursor-pointer">${tag}</button>`
                        ).join('')}
                        ${entry.tags.length > 3 ? `<span class="text-xs ${entry.styling.dateColor} font-inter">+${entry.tags.length - 3} more</span>` : ''}
                    </div>
                    <button class="flex items-center gap-1 text-xs ${entry.styling.dateColor} font-inter hover:${entry.styling.titleColor} transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                        </svg>
                        Read more
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Create expanded view HTML
     */
    createExpandedView(entry) {
        const shareUrl = encodeURIComponent(window.location.href);
        const shareText = encodeURIComponent(`"${entry.title}" by Sean Sneed - ${entry.description}`);
        const hasImages = entry.images && Array.isArray(entry.images) && entry.images.length > 0;
        
        return `
            <div class="p-6 sm:p-8">
                <div class="flex items-start gap-4 mb-6">
                    ${entry.icon ? `<img src="${entry.icon}" alt="${entry.title}" class="w-6 h-6 mt-1 flex-shrink-0">` : ''}
                    <div class="flex-1 min-w-0">
                        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                            <h3 class="text-xl font-geist font-light tracking-tight ${entry.styling.titleColor}">${entry.title}</h3>
                            <span class="text-sm ${entry.styling.dateColor} font-medium font-inter">${entry.date_text}</span>
                        </div>
                        <p class="${entry.styling.companyColor} font-medium mb-4 font-inter">${entry.company}</p>
                    </div>
                </div>

                <div class="prose prose-sm max-w-none mb-6">
                    ${entry.full_content.map(paragraph => 
                        `<p class="${entry.styling.descriptionColor} leading-relaxed font-inter mb-4">${paragraph}</p>`
                    ).join('')}
                </div>

                ${hasImages ? `
                    <div class="mb-6">
                        <div class="grid grid-cols-1 ${entry.images.length > 1 ? 'sm:grid-cols-2' : ''} ${entry.images.length > 2 ? 'lg:grid-cols-3' : ''} gap-4">
                            ${entry.images.map((image, index) => `
                                <div class="relative group rounded-lg overflow-hidden ${entry.images.length === 1 ? 'max-w-md mx-auto' : ''}">
                                    <img 
                                        src="${image.data || image.dataUrl}" 
                                        alt="${image.name || `Image ${index + 1}`}" 
                                        class="w-full ${entry.images.length === 1 ? 'h-64' : 'h-48'} object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                                        onclick="window.journalManager.openImageModal('${image.data || image.dataUrl}', '${image.name || `Image ${index + 1}`}')"
                                    >
                                    <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                                        <svg class="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"/>
                                        </svg>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                ` : ''}

                <div class="pt-4 border-t border-opacity-20 ${entry.styling.borderColor}">
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${entry.tags.map(tag => 
                            `<button onclick="window.journalManager.filterByTag('${tag}')" class="px-3 py-1.5 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'bg-neutral-800 border border-neutral-700 text-neutral-300 hover:bg-neutral-700' : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300'} text-xs rounded-md font-medium font-inter transition-colors cursor-pointer">${tag}</button>`
                        ).join('')}
                    </div>
                    
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <button onclick="window.journalManager.shareOnTwitter('${shareText}', '${shareUrl}')" class="flex items-center gap-1 px-3 py-1.5 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'} text-xs font-medium font-inter transition-colors">
                                <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                                </svg>
                                Share
                            </button>
                            <button onclick="window.journalManager.copyLink()" class="flex items-center gap-1 px-3 py-1.5 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'} text-xs font-medium font-inter transition-colors">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                                </svg>
                                Copy
                            </button>
                            <button onclick="window.journalManager.bookmarkEntry('${entry.id}')" class="flex items-center gap-1 px-3 py-1.5 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'} text-xs font-medium font-inter transition-colors">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                                </svg>
                                Save
                            </button>
                        </div>
                        
                        <button onclick="window.journalManager.toggleEntry('${entry.id}')" class="flex items-center gap-1 text-xs ${entry.styling.dateColor} font-inter hover:${entry.styling.titleColor} transition-colors">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"/>
                            </svg>
                            Show less
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Toggle entry expansion
     */
    toggleEntry(entryId) {
        if (this.expandedEntries.has(entryId)) {
            this.expandedEntries.delete(entryId);
        } else {
            this.expandedEntries.add(entryId);
        }
        
        // Re-render the specific entry
        const entryElement = document.getElementById(entryId);
        if (entryElement) {
            const entry = this.entries.find(e => e.id == entryId);
            if (entry) {
                const isExpanded = this.expandedEntries.has(entryId);
                entryElement.innerHTML = isExpanded ? 
                    this.createExpandedView(entry) : 
                    this.createCollapsedView(entry);
            }
        }
    }

    /**
     * Render error state
     */
    renderError(message) {
        this.container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-red-600 text-sm font-inter mb-2">${message}</p>
                <button onclick="location.reload()" class="text-neutral-600 hover:text-neutral-800 text-sm font-inter underline">
                    Try again
                </button>
            </div>
        `;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        this.container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-neutral-600 text-sm font-inter mb-2">No journal entries found</p>
                ${this.currentFilter ? `<button onclick="window.journalManager.clearFilter()" class="mt-2 text-xs text-neutral-500 hover:text-neutral-700 underline">Clear filter</button>` : `
                    <p class="text-neutral-500 text-xs font-inter mb-4">The database is empty. Add some entries to get started!</p>
                    <a href="admin-simple.html" class="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white text-xs font-medium rounded-lg hover:bg-neutral-800 transition-colors">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Add Entry
                    </a>
                `}
            </div>
        `;
        
        // Update analytics with zero values
        var el;
        el = document.getElementById('total-entries'); if (el) el.textContent = '0';
        el = document.getElementById('total-words'); if (el) el.textContent = '0';
        el = document.getElementById('reading-time'); if (el) el.textContent = '0m';
        el = document.getElementById('active-topics'); if (el) el.textContent = '0';
        
        // Clear featured topics
        const featuredTopicsContainer = document.getElementById('featured-topics');
        if (featuredTopicsContainer) {
            featuredTopicsContainer.innerHTML = '<span class="text-xs text-neutral-500 font-inter">No topics yet</span>';
        }
    }

    /**
     * Filter entries by tag
     */
    filterByTag(tag) {
        this.currentFilter = tag;
        const filteredEntries = this.entries.filter(entry => 
            entry.tags && entry.tags.includes(tag)
        );
        
        this.container.innerHTML = '';
        
        if (filteredEntries.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-8">
                    <p class="text-neutral-600 text-sm font-inter mb-2">No entries found for tag "${tag}"</p>
                    <button onclick="window.journalManager.clearFilter()" class="text-xs text-neutral-500 hover:text-neutral-700 underline">Show all entries</button>
                </div>
            `;
            return;
        }

        // Add filter indicator
        const filterIndicator = document.createElement('div');
        filterIndicator.className = 'flex items-center justify-between p-3 mb-4 bg-neutral-100 rounded-lg';
        filterIndicator.innerHTML = `
            <span class="text-sm text-neutral-700 font-inter">Showing entries tagged: <strong>${tag}</strong></span>
            <button onclick="window.journalManager.clearFilter()" class="text-xs text-neutral-500 hover:text-neutral-700 underline">Clear filter</button>
        `;
        this.container.appendChild(filterIndicator);

        // Render filtered entries
        filteredEntries.forEach((entry) => {
            const entryElement = this.createEntryElement(entry);
            this.container.appendChild(entryElement);
        });
    }

    /**
     * Clear tag filter
     */
    clearFilter() {
        this.currentFilter = null;
        this.renderEntries();
        this.updateAnalytics(); // Update analytics when clearing filter
    }

    /**
     * Share on Twitter
     */
    shareOnTwitter(text, url) {
        const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    }

    /**
     * Copy link to clipboard
     */
    async copyLink() {
        try {
            await navigator.clipboard.writeText(window.location.href);
            this.showToast('Link copied to clipboard!');
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = window.location.href;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Link copied to clipboard!');
        }
    }

    /**
     * Bookmark entry (save to localStorage)
     */
    bookmarkEntry(entryId) {
        let bookmarks = JSON.parse(localStorage.getItem('seansneed_bookmarks') || '[]');
        
        if (bookmarks.includes(entryId)) {
            bookmarks = bookmarks.filter(id => id !== entryId);
            this.showToast('Bookmark removed');
        } else {
            bookmarks.push(entryId);
            this.showToast('Entry bookmarked!');
        }
        
        localStorage.setItem('seansneed_bookmarks', JSON.stringify(bookmarks));
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
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }

    /**
     * Open image in modal for full-screen viewing
     */
    openImageModal(imageSrc, imageName) {
        // Create modal overlay
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4';
        modal.onclick = (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        };

        // Create modal content
        modal.innerHTML = `
            <div class="relative max-w-4xl max-h-full">
                <button onclick="document.body.removeChild(this.closest('.fixed'))" class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
                <img src="${imageSrc}" alt="${imageName}" class="max-w-full max-h-full object-contain rounded-lg">
                <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-4 rounded-b-lg">
                    <p class="text-sm font-inter">${imageName}</p>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        
        // Close on Escape key
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                document.body.removeChild(modal);
                document.removeEventListener('keydown', handleEscape);
            }
        };
        document.addEventListener('keydown', handleEscape);
    }

    /**
     * Update analytics in the left sidebar
     */
    updateAnalytics() {
        // Always try to update analytics, even with zero entries
        const totalEntries = this.entries.length;
        var el;
        el = document.getElementById('total-entries'); if (el) el.textContent = totalEntries;

        if (this.entries.length === 0) {
            // Set zero values for empty state
            el = document.getElementById('total-words'); if (el) el.textContent = '0';
            el = document.getElementById('reading-time'); if (el) el.textContent = '0m';
            el = document.getElementById('active-topics'); if (el) el.textContent = '0';
            
            const featuredTopicsContainer = document.getElementById('featured-topics');
            if (featuredTopicsContainer) {
                featuredTopicsContainer.innerHTML = '<span class="text-xs text-neutral-500 font-inter">No topics yet</span>';
            }
            return;
        }

        // Calculate estimated word count (based on content length)
        const totalWords = this.entries.reduce((total, entry) => {
            const contentText = Array.isArray(entry.full_content) ? 
                entry.full_content.join(' ') : 
                (entry.full_content || '');
            const description = entry.description || '';
            const wordCount = (contentText + ' ' + description).split(' ').length;
            return total + wordCount;
        }, 0);
        
        const formattedWords = totalWords > 1000 ? 
            `${Math.round(totalWords / 1000)}k` : 
            totalWords.toString();
        el = document.getElementById('total-words'); if (el) el.textContent = formattedWords;

        // Calculate total reading time
        const totalReadingMinutes = this.entries.reduce((total, entry) => {
            const readTime = entry.read_time || '3 min read';
            const minutes = parseInt(readTime.match(/\d+/)?.[0] || '3');
            return total + minutes;
        }, 0);
        
        const readingHours = Math.floor(totalReadingMinutes / 60);
        const readingMins = totalReadingMinutes % 60;
        const formattedReadTime = readingHours > 0 ? 
            `${readingHours}h ${readingMins}m` : 
            `${readingMins}m`;
        el = document.getElementById('reading-time'); if (el) el.textContent = formattedReadTime;

        // Calculate unique topics
        const allTags = this.entries.reduce((tags, entry) => {
            return tags.concat(entry.tags || []);
        }, []);
        const uniqueTags = [...new Set(allTags)];
        el = document.getElementById('active-topics'); if (el) el.textContent = uniqueTags.length;

        // Update featured topics (show most common tags)
        this.updateFeaturedTopics(allTags);
    }

    /**
     * Update featured topics display
     */
    updateFeaturedTopics(allTags) {
        const tagCounts = {};
        allTags.forEach(tag => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1;
        });

        // Sort by frequency and take top 5
        const topTags = Object.entries(tagCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5)
            .map(([tag]) => tag);

        const featuredTopicsContainer = document.getElementById('featured-topics');
        if (featuredTopicsContainer && topTags.length > 0) {
            featuredTopicsContainer.innerHTML = topTags.map(tag => 
                `<button onclick="window.journalManager.filterByTag('${tag}')" class="px-3 py-1.5 rounded-md bg-neutral-100 border border-neutral-200 text-neutral-700 hover:bg-neutral-200 text-xs font-medium font-inter transition-colors cursor-pointer">${tag}</button>`
            ).join('');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const manager = new SimpleJournalManager();
    manager.init();
    
    // Make manager globally available for admin functions
    window.journalManager = manager;
}); 