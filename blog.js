// Blog posts data
const blogPosts = [
    {
        title: "Building Production-Ready REST APIs with Node.js",
        slug: "building-production-rest-apis",
        date: "2026-01-03",
        tags: ["Node.js", "Backend", "APIs"],
        description: "Best practices and patterns for building scalable, maintainable REST APIs in production environments.",
        content: `
<h2>Building Production-Ready REST APIs with Node.js</h2>

<p class="blog-meta">Published: January 3, 2026 | Tags: Node.js, Backend, APIs</p>

<p>
Building REST APIs is straightforward. Building production-ready REST APIs that scale, handle errors gracefully, and remain maintainable is a different challenge altogether. This post covers key practices I've learned building backend systems.
</p>

<h3>1. Structure Matters</h3>

<p>
Organize your codebase by feature, not by type. Instead of having all routes in one folder and all controllers in another, group related functionality together:
</p>

<pre>
src/
  ├── features/
  │   ├── auth/
  │   │   ├── auth.routes.js
  │   │   ├── auth.controller.js
  │   │   ├── auth.service.js
  │   │   └── auth.test.js
  │   └── users/
  │       ├── users.routes.js
  │       ├── users.controller.js
  │       └── users.service.js
  └── shared/
      ├── middleware/
      └── utils/
</pre>

<h3>2. Error Handling Done Right</h3>

<p>
Centralize error handling with custom error classes and a global error middleware. Never let unhandled errors crash your server.
</p>

<pre>
class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Global error middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});
</pre>

<h3>3. Validation is Non-Negotiable</h3>

<p>
Always validate incoming data. Use libraries like Joi or Zod to define schemas:
</p>

<pre>
const userSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().min(2).max(50)
});

const validateBody = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        next(new ApiError(400, error.message));
    }
};

router.post('/users', validateBody(userSchema), createUser);
</pre>

<h3>4. Security Best Practices</h3>

<ul>
    <li>Use helmet.js for setting security headers</li>
    <li>Implement rate limiting to prevent abuse</li>
    <li>Sanitize user input to prevent injection attacks</li>
    <li>Use parameterized queries for database operations</li>
    <li>Never log sensitive information (passwords, tokens, etc.)</li>
    <li>Implement proper CORS configuration</li>
</ul>

<h3>5. Database Optimization</h3>

<p>
Optimize database queries from the start:
</p>

<ul>
    <li>Add indexes on frequently queried fields</li>
    <li>Use connection pooling</li>
    <li>Implement pagination for list endpoints</li>
    <li>Use SELECT only the fields you need</li>
    <li>Consider caching for frequently accessed data</li>
</ul>

<h3>6. Testing Strategy</h3>

<p>
Write tests at multiple levels:
</p>

<ul>
    <li><b>Unit tests:</b> Test individual functions and services</li>
    <li><b>Integration tests:</b> Test API endpoints with a test database</li>
    <li><b>Load tests:</b> Verify performance under load</li>
</ul>

<h3>Conclusion</h3>

<p>
Building production-ready APIs requires attention to structure, error handling, validation, security, and performance. Start with these practices early, and your codebase will remain maintainable as it grows.
</p>

<p>
The key is consistency. Pick patterns that work for your team and stick to them across your entire API.
</p>
`
    },
    {
        title: "Understanding WebRTC: Real-Time Communication on the Web",
        slug: "understanding-webrtc",
        date: "2025-12-28",
        tags: ["WebRTC", "JavaScript", "Networking"],
        description: "A practical guide to implementing real-time peer-to-peer communication using WebRTC.",
        content: `
<h2>Understanding WebRTC: Real-Time Communication on the Web</h2>

<p class="blog-meta">Published: December 28, 2025 | Tags: WebRTC, JavaScript, Networking</p>

<p>
WebRTC (Web Real-Time Communication) enables peer-to-peer audio, video, and data sharing directly between browsers without requiring a server to relay data. I recently built a video chat application and learned the fundamentals the hard way.
</p>

<h3>Why WebRTC?</h3>

<p>
Traditional video calling requires all media to flow through a central server, which is expensive and adds latency. WebRTC establishes direct peer-to-peer connections, reducing latency and server costs significantly.
</p>

<h3>The Three Main APIs</h3>

<p>
WebRTC consists of three main JavaScript APIs:
</p>

<ul>
    <li><b>getUserMedia:</b> Captures audio/video from user's device</li>
    <li><b>RTCPeerConnection:</b> Establishes peer-to-peer connection for audio/video</li>
    <li><b>RTCDataChannel:</b> Enables generic data transfer between peers</li>
</ul>

<h3>The Signaling Dance</h3>

<p>
Before peers can communicate directly, they need to exchange connection information. This process is called signaling and requires a server (the only part that needs a server).
</p>

<pre>
// Simplified signaling flow
1. Peer A creates an offer (SDP description)
2. Peer A sends offer to signaling server
3. Signaling server forwards offer to Peer B
4. Peer B creates an answer
5. Peer B sends answer back through signaling server
6. Both peers exchange ICE candidates
7. Direct connection established!
</pre>

<h3>ICE Candidates Explained</h3>

<p>
ICE (Interactive Connectivity Establishment) candidates are potential network paths between peers. They include:
</p>

<ul>
    <li><b>Host candidates:</b> Local IP addresses</li>
    <li><b>Server reflexive candidates:</b> Public IP from STUN server</li>
    <li><b>Relay candidates:</b> TURN server address (fallback)</li>
</ul>

<h3>Basic Implementation</h3>

<pre>
// Create peer connection
const pc = new RTCPeerConnection({
    iceServers: [
        { urls: 'stun:stun.l.google.com:19302' }
    ]
});

// Add local media stream
const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
});

stream.getTracks().forEach(track => {
    pc.addTrack(track, stream);
});

// Handle incoming tracks
pc.ontrack = (event) => {
    remoteVideo.srcObject = event.streams[0];
};

// Handle ICE candidates
pc.onicecandidate = (event) => {
    if (event.candidate) {
        sendToSignalingServer({
            type: 'ice-candidate',
            candidate: event.candidate
        });
    }
};
</pre>

<h3>Common Challenges</h3>

<p>
<b>1. NAT Traversal:</b> Most devices are behind NAT/firewalls. STUN servers help discover public IPs, but sometimes you need TURN servers to relay traffic.
</p>

<p>
<b>2. Browser Compatibility:</b> While WebRTC is well-supported, there are subtle differences between browsers. Use adapter.js to normalize.
</p>

<p>
<b>3. Connection Quality:</b> Network conditions affect call quality. Implement reconnection logic and quality monitoring.
</p>

<h3>STUN vs TURN</h3>

<ul>
    <li><b>STUN (Session Traversal Utilities for NAT):</b> Free, helps discover public IP, doesn't relay data</li>
    <li><b>TURN (Traversal Using Relays around NAT):</b> Expensive, relays all data when direct connection fails</li>
</ul>

<p>
Use STUN for most cases, TURN as a fallback for restrictive networks.
</p>

<h3>Production Considerations</h3>

<ul>
    <li>Implement reconnection logic for dropped connections</li>
    <li>Handle permissions errors gracefully</li>
    <li>Provide bandwidth adaptation based on network conditions</li>
    <li>Consider using a library like SimpleWebRTC or PeerJS for complex apps</li>
    <li>Set up your own TURN server for reliability (coturn is popular)</li>
</ul>

<h3>Conclusion</h3>

<p>
WebRTC is powerful but complex. The peer-to-peer nature makes it incredibly efficient for real-time communication, but the setup requires understanding signaling, ICE, and network traversal.
</p>

<p>
Start with a simple demo, understand the signaling flow, and gradually add features. The investment pays off when you see low-latency, high-quality real-time communication running in the browser.
</p>
`
    },
    {
        title: "PostgreSQL Query Optimization: From Slow to Fast",
        slug: "postgresql-query-optimization",
        date: "2025-12-15",
        tags: ["PostgreSQL", "Database", "Performance"],
        description: "Practical techniques for optimizing slow PostgreSQL queries and improving database performance.",
        content: `
<h2>PostgreSQL Query Optimization: From Slow to Fast</h2>

<p class="blog-meta">Published: December 15, 2025 | Tags: PostgreSQL, Database, Performance</p>

<p>
A slow database query can bring your entire application to its knees. I recently optimized a query that was taking 8 seconds down to 50ms. Here's what I learned about PostgreSQL performance.
</p>

<h3>Start with EXPLAIN ANALYZE</h3>

<p>
Before optimizing, understand what PostgreSQL is doing:
</p>

<pre>
EXPLAIN ANALYZE
SELECT u.name, COUNT(p.id) as post_count
FROM users u
LEFT JOIN posts p ON u.id = p.user_id
WHERE u.created_at > '2025-01-01'
GROUP BY u.id, u.name;
</pre>

<p>
Look for:
</p>

<ul>
    <li>Sequential Scans on large tables (sign you need an index)</li>
    <li>High execution time on specific operations</li>
    <li>Large row estimates vs actual rows (outdated statistics)</li>
</ul>

<h3>Indexing Strategy</h3>

<p>
Indexes are your first line of defense against slow queries.
</p>

<pre>
-- Index for WHERE clauses
CREATE INDEX idx_users_created_at ON users(created_at);

-- Composite index for frequent JOIN + WHERE combinations
CREATE INDEX idx_posts_user_created 
ON posts(user_id, created_at);

-- Partial index for specific conditions
CREATE INDEX idx_active_users 
ON users(created_at) 
WHERE status = 'active';
</pre>

<p>
<b>Golden rule:</b> Index columns used in WHERE, JOIN, ORDER BY, and GROUP BY clauses.
</p>

<h3>Index Maintenance</h3>

<p>
Indexes aren't free. They:
</p>

<ul>
    <li>Take up disk space</li>
    <li>Slow down INSERT/UPDATE/DELETE operations</li>
    <li>Need maintenance</li>
</ul>

<p>
Periodically check for unused indexes:
</p>

<pre>
SELECT schemaname, tablename, indexname
FROM pg_stat_user_indexes
WHERE idx_scan = 0
AND indexrelname NOT LIKE '%_pkey';
</pre>

<h3>Query Patterns to Avoid</h3>

<p>
<b>1. SELECT * when you don't need all columns:</b>
</p>

<pre>
-- Bad
SELECT * FROM users;

-- Good
SELECT id, name, email FROM users;
</pre>

<p>
<b>2. N+1 queries:</b>
</p>

<pre>
-- Bad: Executes N queries
SELECT * FROM users;
-- Then for each user:
SELECT * FROM posts WHERE user_id = ?;

-- Good: Single query with JOIN
SELECT u.*, p.*
FROM users u
LEFT JOIN posts p ON u.id = p.user_id;
</pre>

<p>
<b>3. Using LIKE with leading wildcard:</b>
</p>

<pre>
-- Can't use index efficiently
WHERE email LIKE '%@gmail.com';

-- Can use index
WHERE email LIKE 'john%';
</pre>

<h3>Connection Pooling</h3>

<p>
Opening database connections is expensive. Use connection pooling:
</p>

<pre>
// Node.js with pg-pool
const pool = new Pool({
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});
</pre>

<h3>Monitoring and Maintenance</h3>

<p>
Set up regular maintenance:
</p>

<pre>
-- Update statistics for better query plans
ANALYZE;

-- Reclaim space and update statistics
VACUUM ANALYZE;
</pre>

<p>
Enable auto-vacuum in production:
</p>

<pre>
-- postgresql.conf
autovacuum = on
autovacuum_vacuum_scale_factor = 0.1
autovacuum_analyze_scale_factor = 0.05
</pre>

<h3>Caching Strategy</h3>

<p>
Not every query needs to hit the database:
</p>

<ul>
    <li>Use Redis for frequently accessed data</li>
    <li>Implement application-level caching for expensive queries</li>
    <li>Set appropriate cache TTLs based on data volatility</li>
    <li>Invalidate cache on writes</li>
</ul>

<h3>Pagination Done Right</h3>

<pre>
-- Bad: OFFSET is slow on large datasets
SELECT * FROM posts
ORDER BY created_at DESC
LIMIT 20 OFFSET 10000;

-- Good: Cursor-based pagination
SELECT * FROM posts
WHERE created_at < ?
ORDER BY created_at DESC
LIMIT 20;
</pre>

<h3>The 8-Second to 50ms Optimization</h3>

<p>
The query was joining multiple tables without indexes on foreign keys. The fix:
</p>

<ul>
    <li>Added composite index on foreign key + filter column</li>
    <li>Removed SELECT * and selected only needed columns</li>
    <li>Changed OFFSET pagination to cursor-based</li>
    <li>Added Redis caching with 5-minute TTL</li>
</ul>

<h3>Conclusion</h3>

<p>
Database optimization is an ongoing process. Start with EXPLAIN ANALYZE, add appropriate indexes, avoid common anti-patterns, and monitor query performance in production.
</p>

<p>
Remember: premature optimization is bad, but ignoring performance until it's a problem is worse. Design with performance in mind from the start.
</p>
`
    }
];

// Get all unique tags
function getAllTags() {
    const tags = new Set();
    blogPosts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}

// Render blog listing page
function renderBlogList(filterTag = null) {
    const blogListEl = document.getElementById('blog-list');
    const tagFilterEl = document.getElementById('tag-filter');
    
    if (!blogListEl) return;

    // Render tag filter
    if (tagFilterEl) {
        const tags = getAllTags();
        let tagHTML = '<p style="margin-bottom: 15px;"><b>Filter by tag:</b> ';
        tagHTML += '<a href="#" onclick="renderBlogList(); return false;" style="' + 
                   (filterTag === null ? 'text-decoration: underline;' : '') + '">all</a>';
        
        tags.forEach(tag => {
            tagHTML += ' | <a href="#" onclick="renderBlogList(\'' + tag + '\'); return false;" style="' +
                      (filterTag === tag ? 'text-decoration: underline;' : '') + '">' + tag + '</a>';
        });
        tagHTML += '</p>';
        tagFilterEl.innerHTML = tagHTML;
    }

    // Filter and sort posts
    let posts = blogPosts;
    if (filterTag) {
        posts = posts.filter(post => post.tags.includes(filterTag));
    }
    posts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    // Render posts
    let html = '';
    posts.forEach((post, index) => {
        html += '<div class="blog-item">';
        html += '<h3><a href="blog-post.html?post=' + post.slug + '" class="blog-title-link">' + 
                post.title + '</a></h3>';
        html += '<p class="blog-meta">' + formatDate(post.date) + ' | ' + 
                post.tags.join(', ') + '</p>';
        html += '<p class="blog-description">' + post.description + '</p>';
        html += '<p><a href="blog-post.html?post=' + post.slug + '">Read more →</a></p>';
        html += '</div>';
        
        if (index < posts.length - 1) {
            html += '<hr>';
        }
    });

    if (posts.length === 0) {
        html = '<p>No blog posts found with tag "' + filterTag + '".</p>';
    }

    blogListEl.innerHTML = html;
}

// Render individual blog post
function renderBlogPost() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get('post');
    
    const post = blogPosts.find(p => p.slug === slug);
    
    if (!post) {
        document.getElementById('blog-post-content').innerHTML = 
            '<p>Blog post not found. <a href="blog.html">Return to blog</a></p>';
        return;
    }

    // Update page title
    document.title = post.title + ' - Gyan Prakash Tiwari';

    // Render post content
    document.getElementById('blog-post-content').innerHTML = post.content;

    // Render navigation
    renderPostNavigation(slug);
}

// Render previous/next navigation
function renderPostNavigation(currentSlug) {
    const navEl = document.getElementById('blog-navigation');
    if (!navEl) return;

    const sortedPosts = [...blogPosts].sort((a, b) => new Date(b.date) - new Date(a.date));
    const currentIndex = sortedPosts.findIndex(p => p.slug === currentSlug);

    let navHTML = '<p>';
    
    if (currentIndex > 0) {
        const nextPost = sortedPosts[currentIndex - 1];
        navHTML += '<a href="blog-post.html?post=' + nextPost.slug + '">← Newer: ' + 
                   nextPost.title + '</a>';
    }

    if (currentIndex < sortedPosts.length - 1) {
        if (currentIndex > 0) navHTML += ' | ';
        const prevPost = sortedPosts[currentIndex + 1];
        navHTML += '<a href="blog-post.html?post=' + prevPost.slug + '">Older: ' + 
                   prevPost.title + ' →</a>';
    }

    navHTML += '</p>';
    navEl.innerHTML = navHTML;
}

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}
