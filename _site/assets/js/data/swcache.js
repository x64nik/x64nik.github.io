const resource = [
    /* --- CSS --- */
    '/assets/css/style.css',

    /* --- PWA --- */
    '/app.js',
    '/sw.js',

    /* --- HTML --- */
    '/index.html',
    '/404.html',

    
        '/tabs/categories.html',
    
        '/tabs/tags.html',
    
        '/tabs/archives.html',
    
        '/tabs/about.html',
    

    /* --- Favicons & compressed JS --- */
    
    
];

/* The request url with below domain will be cached */
const allowedDomains = [
    

    '0.0.0.0:4000',

    
        'x64nik.github.io',
    

    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net',
    'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
    
];

