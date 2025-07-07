/**
 * Journal Entries Manager
 * Handles loading and rendering of expandable journal entries from JSON data
 */

class JournalEntriesManager {
    constructor() {
        this.entries = [];
        this.container = null;
        this.expandedEntries = new Set();
    }

    /**
     * Initialize the manager and load entries
     */
    async init() {
        this.container = document.getElementById('journal-entries-container');
        if (!this.container) {
            console.error('Journal entries container not found');
            return;
        }

        try {
            await this.loadEntries();
            this.renderEntries();
        } catch (error) {
            console.error('Failed to initialize journal entries:', error);
            this.renderError();
        }
    }

    /**
     * Load entries from JSON file
     */
    async loadEntries() {
        try {
            // First try to load from cloud storage (GitHub Gist)
            const cloudEntries = await this.loadFromCloud();
            if (cloudEntries) {
                console.log('Loaded entries from cloud storage:', this.entries.length, this.entries);
                return;
            }
            
            // Then try to load from JSON file
            const response = await fetch('./journal-entries.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.entries = data.entries || [];
            console.log('Loaded entries from JSON file:', this.entries.length, this.entries);
            
            // If we have localStorage data and it's different from the JSON file,
            // it means we're in admin preview mode
            const savedEntries = localStorage.getItem('journalEntries');
            if (savedEntries) {
                const localStorageEntries = JSON.parse(savedEntries);
                if (JSON.stringify(localStorageEntries) !== JSON.stringify(this.entries)) {
                    console.log('Admin preview mode detected - using localStorage entries');
                    this.entries = localStorageEntries;
                }
            }
        } catch (error) {
            console.error('Error loading journal entries:', error);
            
            // Fallback to localStorage if JSON file fails
            const savedEntries = localStorage.getItem('journalEntries');
            if (savedEntries) {
                this.entries = JSON.parse(savedEntries);
                console.log('Fallback: Loaded entries from localStorage:', this.entries.length);
            } else {
                throw error;
            }
        }
    }

    /**
     * Load entries from cloud storage (GitHub Gist)
     */
    async loadFromCloud() {
        const githubToken = localStorage.getItem('githubToken');
        let gistId = localStorage.getItem('gistId');
        
        if (!githubToken) {
            return false;
        }
        
        // If no gist ID in localStorage, try to find the most recent gist
        if (!gistId) {
            console.log('No Gist ID in localStorage, searching for recent gists...');
            try {
                const response = await fetch('https://api.github.com/gists', {
                    headers: {
                        'Authorization': `token ${githubToken}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (response.ok) {
                    const gists = await response.json();
                    // Find the most recent gist with journal-entries.json
                    const journalGist = gists.find(gist => 
                        gist.files['journal-entries.json'] && 
                        gist.description === 'Sean Sneed Journal Entries'
                    );
                    
                    if (journalGist) {
                        gistId = journalGist.id;
                        localStorage.setItem('gistId', gistId);
                        console.log('Found existing gist:', gistId);
                    } else {
                        console.log('No existing journal gist found');
                        return false;
                    }
                }
            } catch (error) {
                console.error('Failed to search for gists:', error);
                return false;
            }
        }
        
        try {
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `token ${githubToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (response.ok) {
                const gist = await response.json();
                const file = gist.files['journal-entries.json'];
                if (file) {
                    const data = JSON.parse(file.content);
                    this.entries = data.entries || [];
                    console.log('Successfully loaded from cloud storage:', this.entries.length, 'entries');
                    return true;
                }
            } else {
                console.error('Failed to load gist:', response.status, response.statusText);
            }
        } catch (error) {
            console.error('Failed to load from cloud:', error);
        }
        
        return false;
    }

    /**
     * Render all entries to the container
     */
    renderEntries() {
        console.log('Rendering entries:', this.entries.length); // Debug log
        
        if (!this.container || this.entries.length === 0) {
            console.log('No container or no entries, showing empty state'); // Debug log
            this.renderEmpty();
            return;
        }

        // Clear existing content
        this.container.innerHTML = '';

        // Render each entry
        this.entries.forEach((entry, index) => {
            console.log('Rendering entry:', index, entry.title); // Debug log
            const entryElement = this.createEntryElement(entry);
            this.container.appendChild(entryElement);
        });
    }

    /**
     * Create HTML element for a single journal entry
     */
    createEntryElement(entry) {
        const article = document.createElement('article');
        article.className = `journal-entry relative rounded-lg ${entry.styling.backgroundColor} ${entry.styling.borderColor} shadow-lg shadow-black/50 transition-all duration-300 cursor-pointer hover:shadow-xl overflow-hidden`;
        article.id = entry.id;
        article.setAttribute('data-entry-id', entry.id);

        // Create the collapsed view
        const collapsedView = this.createCollapsedView(entry);
        article.appendChild(collapsedView);

        // Create the expanded view (initially hidden)
        const expandedView = this.createExpandedView(entry);
        expandedView.style.display = 'none';
        article.appendChild(expandedView);

        // Add click handler for expansion
        article.addEventListener('click', (e) => {
            // Don't expand if clicking on social buttons
            if (e.target.closest('.social-button')) return;
            this.toggleEntry(entry.id);
        });

        return article;
    }

    /**
     * Create the collapsed (preview) view of an entry
     */
    createCollapsedView(entry) {
        const div = document.createElement('div');
        div.className = 'collapsed-view p-5';

        // Header with title, date, and read time
        const header = document.createElement('div');
        header.className = 'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3';

        const titleContainer = document.createElement('div');
        titleContainer.className = 'flex items-center gap-2';

        const title = document.createElement('h4');
        title.className = `font-geist font-light tracking-tight text-lg ${entry.styling.titleColor}`;

        if (entry.icon) {
            const icon = document.createElement('img');
            icon.src = entry.icon;
            icon.alt = entry.iconAlt || '';
            icon.className = 'w-[24px] h-[24px] inline-block mr-2 mb-1';
            title.appendChild(icon);
        }

        title.appendChild(document.createTextNode(entry.title));
        titleContainer.appendChild(title);

        const metaInfo = document.createElement('div');
        metaInfo.className = 'flex items-center gap-3';

        if (entry.readTime) {
            const readTime = document.createElement('span');
            readTime.className = `text-xs font-medium font-inter ${entry.styling.dateColor}`;
            readTime.textContent = entry.readTime;
            metaInfo.appendChild(readTime);
        }

        const dateSpan = document.createElement('span');
        dateSpan.className = `text-xs font-medium font-inter ${entry.styling.dateColor}`;
        dateSpan.textContent = entry.date;
        metaInfo.appendChild(dateSpan);

        header.appendChild(titleContainer);
        header.appendChild(metaInfo);

        // Company name
        const company = document.createElement('p');
        company.className = `font-medium mb-2 font-inter text-sm ${entry.styling.companyColor}`;
        company.textContent = entry.company;

        // Description (preview)
        const description = document.createElement('p');
        description.className = `text-xs leading-relaxed font-inter mb-4 ${entry.styling.descriptionColor}`;
        description.textContent = entry.description;

        // Tags
        if (entry.tags && entry.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex flex-wrap gap-2 mb-3';
            
            entry.tags.slice(0, 3).forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = `px-2 py-1 rounded-md text-xs font-medium ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'bg-neutral-800 border border-neutral-700 text-neutral-300' : 'bg-neutral-100 border border-neutral-200 text-neutral-600'}`;
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });

            div.appendChild(header);
            div.appendChild(company);
            div.appendChild(description);
            div.appendChild(tagsContainer);
        } else {
            div.appendChild(header);
            div.appendChild(company);
            div.appendChild(description);
        }

        // Read more indicator
        const readMore = document.createElement('div');
        readMore.className = `flex items-center gap-2 text-xs font-medium ${entry.styling.titleColor} mt-2`;
        readMore.innerHTML = `
            <span>Read full entry</span>
            <svg class="w-3 h-3 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
        `;
        div.appendChild(readMore);

        return div;
    }

    /**
     * Create the expanded (full) view of an entry
     */
    createExpandedView(entry) {
        const div = document.createElement('div');
        div.className = 'expanded-view p-5 border-t border-opacity-20';
        div.style.borderColor = entry.styling.borderColor.replace('border-', '');

        // Full content
        if (entry.fullContent && entry.fullContent.length > 0) {
            const contentContainer = document.createElement('div');
            contentContainer.className = 'space-y-4 mb-6';

            entry.fullContent.forEach(paragraph => {
                if (paragraph.trim()) {
                    const p = document.createElement('p');
                    p.className = `text-sm leading-relaxed font-inter ${entry.styling.descriptionColor}`;
                    p.textContent = paragraph;
                    contentContainer.appendChild(p);
                }
            });

            div.appendChild(contentContainer);
        }

        // Full image if present
        if (entry.image) {
            const imageContainer = document.createElement('div');
            imageContainer.className = 'mb-6 rounded-lg overflow-hidden shadow-lg shadow-neutral-900/50';

            const image = document.createElement('img');
            image.src = entry.image;
            image.alt = `${entry.title} at ${entry.company}`;
            image.className = 'w-full h-96 object-cover hover:scale-105 transition-transform duration-300';

            imageContainer.appendChild(image);
            div.appendChild(imageContainer);
        }

        // All tags
        if (entry.tags && entry.tags.length > 0) {
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'flex flex-wrap gap-2 mb-6';
            
            entry.tags.forEach(tag => {
                const tagSpan = document.createElement('span');
                tagSpan.className = `px-3 py-1.5 rounded-md text-xs font-medium ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'bg-neutral-800 border border-neutral-700 text-neutral-300' : 'bg-neutral-100 border border-neutral-200 text-neutral-600'}`;
                tagSpan.textContent = tag;
                tagsContainer.appendChild(tagSpan);
            });

            div.appendChild(tagsContainer);
        }

        // Social sharing buttons
        const socialContainer = document.createElement('div');
        socialContainer.className = 'flex items-center justify-between pt-4 border-t border-opacity-20';
        socialContainer.style.borderColor = entry.styling.borderColor.replace('border-', '');

        const socialButtons = document.createElement('div');
        socialButtons.className = 'flex items-center gap-3';

        // Like button
        const likeBtn = this.createSocialButton('like', entry);
        socialButtons.appendChild(likeBtn);

        // Share button
        const shareBtn = this.createSocialButton('share', entry);
        socialButtons.appendChild(shareBtn);

        // Bookmark button
        const bookmarkBtn = this.createSocialButton('bookmark', entry);
        socialButtons.appendChild(bookmarkBtn);

        // Collapse button
        const collapseBtn = document.createElement('button');
        collapseBtn.className = `social-button flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'text-neutral-300 hover:bg-neutral-800' : 'text-neutral-600 hover:bg-neutral-100'}`;
        collapseBtn.innerHTML = `
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
            </svg>
            <span>Collapse</span>
        `;
        collapseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleEntry(entry.id);
        });

        socialContainer.appendChild(socialButtons);
        socialContainer.appendChild(collapseBtn);
        div.appendChild(socialContainer);

        return div;
    }

    /**
     * Create social sharing buttons
     */
    createSocialButton(type, entry) {
        const button = document.createElement('button');
        button.className = `social-button p-2 rounded-lg transition-all duration-200 ${entry.styling.backgroundColor === 'bg-neutral-900' ? 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100'}`;
        
        let icon, action;
        
        switch(type) {
            case 'like':
                icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                </svg>`;
                action = () => this.handleLike(entry);
                break;
            case 'share':
                icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"></path>
                </svg>`;
                action = () => this.handleShare(entry);
                break;
            case 'bookmark':
                icon = `<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>
                </svg>`;
                action = () => this.handleBookmark(entry);
                break;
        }
        
        button.innerHTML = icon;
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            action();
        });
        
        return button;
    }

    /**
     * Toggle entry expansion
     */
    toggleEntry(entryId) {
        const article = document.getElementById(entryId);
        if (!article) return;

        const collapsedView = article.querySelector('.collapsed-view');
        const expandedView = article.querySelector('.expanded-view');
        const readMoreIcon = collapsedView.querySelector('svg');

        if (this.expandedEntries.has(entryId)) {
            // Collapse
            expandedView.style.display = 'none';
            collapsedView.style.display = 'block';
            readMoreIcon.style.transform = 'rotate(0deg)';
            this.expandedEntries.delete(entryId);
            
            // Smooth scroll to entry
            article.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            // Expand
            expandedView.style.display = 'block';
            collapsedView.style.display = 'none';
            readMoreIcon.style.transform = 'rotate(180deg)';
            this.expandedEntries.add(entryId);
        }
    }

    /**
     * Handle social actions
     */
    handleLike(entry) {
        // Simple animation feedback
        console.log(`Liked: ${entry.title}`);
        // Here you could integrate with a backend or local storage
    }

    handleShare(entry) {
        if (navigator.share) {
            navigator.share({
                title: entry.title,
                text: entry.description,
                url: window.location.href + '#' + entry.id
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${entry.title} - ${window.location.href}#${entry.id}`);
            console.log('Shared:', entry.title);
        }
    }

    handleBookmark(entry) {
        console.log(`Bookmarked: ${entry.title}`);
        // Here you could save to local storage or backend
    }

    /**
     * Render error message
     */
    renderError() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-neutral-600 text-sm font-inter">Failed to load journal entries. Please try again later.</p>
            </div>
        `;
    }

    /**
     * Render empty state
     */
    renderEmpty() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="text-center py-8">
                <p class="text-neutral-600 text-sm font-inter">No journal entries found.</p>
            </div>
        `;
    }

    /**
     * Add a new entry (for future use)
     */
    addEntry(entry) {
        this.entries.unshift(entry); // Add to beginning
        this.renderEntries();
    }

    /**
     * Filter entries by criteria (for future use)
     */
    filterEntries(filterFn) {
        const filteredEntries = this.entries.filter(filterFn);
        return filteredEntries;
    }

    /**
     * Get featured entries
     */
    getFeaturedEntries() {
        return this.filterEntries(entry => entry.featured);
    }
}

// Auto-initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const journalManager = new JournalEntriesManager();
    journalManager.init();
});

// Export for potential external use
window.JournalEntriesManager = JournalEntriesManager; 