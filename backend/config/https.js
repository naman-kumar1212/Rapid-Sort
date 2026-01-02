/**
 * HTTPS/TLS Configuration
 * 
 * HTTPS (HTTP Secure) uses TLS (Transport Layer Security) to encrypt
 * communication between client and server.
 * 
 * Benefits:
 * - Data encryption in transit
 * - Authentication (verify server identity)
 * - Data integrity (prevent tampering)
 * - SEO benefits and browser trust indicators
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

/**
 * Create HTTPS server with TLS certificates
 * 
 * For production, use certificates from:
 * - Let's Encrypt (free, automated)
 * - Commercial CA (Digicert, GlobalSign, etc.)
 * 
 * For development, use self-signed certificates
 */
const createHTTPSServer = (app) => {
  try {
    // Load SSL/TLS certificates
    const options = {
      key: fs.readFileSync(
        process.env.SSL_KEY_PATH || path.join(__dirname, '../certs/server.key')
      ),
      cert: fs.readFileSync(
        process.env.SSL_CERT_PATH || path.join(__dirname, '../certs/server.cert')
      ),
      // Optional: Certificate Authority bundle
      ca: process.env.SSL_CA_PATH ? 
        fs.readFileSync(process.env.SSL_CA_PATH) : undefined,
      
      // TLS version configuration
      minVersion: 'TLSv1.2', // Minimum TLS 1.2 (TLS 1.0/1.1 deprecated)
      maxVersion: 'TLSv1.3', // Support latest TLS 1.3
      
      // Cipher suite configuration (strong ciphers only)
      ciphers: [
        'ECDHE-ECDSA-AES128-GCM-SHA256',
        'ECDHE-RSA-AES128-GCM-SHA256',
        'ECDHE-ECDSA-AES256-GCM-SHA384',
        'ECDHE-RSA-AES256-GCM-SHA384',
        'DHE-RSA-AES128-GCM-SHA256',
        'DHE-RSA-AES256-GCM-SHA384'
      ].join(':'),
      
      // Prefer server cipher order
      honorCipherOrder: true,
      
      // Enable OCSP stapling for certificate validation
      requestCert: false,
      rejectUnauthorized: true
    };

    const httpsServer = https.createServer(options, app);
    
    console.log('✅ HTTPS server configured with TLS');
    return httpsServer;
    
  } catch (error) {
    console.log('⚠️  HTTPS certificates not found');
    console.log('💡 Generate self-signed certificates for development:');
    console.log('   openssl req -x509 -newkey rsa:4096 -keyout server.key -out server.cert -days 365 -nodes');
    return null;
  }
};

/**
 * Generate self-signed certificate for development
 * (For production, use proper CA-signed certificates)
 */
const generateSelfSignedCert = () => {
  const { execSync } = require('child_process');
  const certsDir = path.join(__dirname, '../certs');
  
  try {
    // Create certs directory if it doesn't exist
    if (!fs.existsSync(certsDir)) {
      fs.mkdirSync(certsDir, { recursive: true });
    }
    
    // Generate self-signed certificate
    execSync(`openssl req -x509 -newkey rsa:4096 -keyout ${certsDir}/server.key -out ${certsDir}/server.cert -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"`, {
      stdio: 'inherit'
    });
    
    console.log('✅ Self-signed certificate generated');
    console.log('⚠️  WARNING: Self-signed certificates should only be used for development');
  } catch (error) {
    console.error('Certificate generation failed:', error.message);
    console.log('💡 Install OpenSSL: https://www.openssl.org/');
  }
};

/**
 * Security headers middleware for HTTPS
 */
const securityHeaders = (req, res, next) => {
  // Strict Transport Security (HSTS)
  // Forces browsers to use HTTPS for all future requests
  res.setHeader(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Prevent clickjacking
  res.setHeader('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
  );
  
  // Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  res.setHeader(
    'Permissions-Policy',
    'geolocation=(), microphone=(), camera=()'
  );
  
  next();
};

/**
 * Redirect HTTP to HTTPS
 */
const redirectToHTTPS = (req, res, next) => {
  if (!req.secure && req.get('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.hostname}${req.url}`);
  }
  next();
};

/**
 * TLS/SSL best practices documentation
 */
const tlsBestPractices = {
  certificates: {
    production: 'Use certificates from trusted CA (Let\'s Encrypt, DigiCert)',
    development: 'Self-signed certificates are acceptable',
    renewal: 'Automate certificate renewal (Let\'s Encrypt certbot)',
    storage: 'Store private keys securely, never commit to version control'
  },
  
  tlsVersions: {
    minimum: 'TLS 1.2 (TLS 1.0/1.1 are deprecated)',
    recommended: 'TLS 1.3 for best security and performance',
    disable: 'Disable SSLv2, SSLv3, TLS 1.0, TLS 1.1'
  },
  
  cipherSuites: {
    use: 'Strong ciphers with forward secrecy (ECDHE, DHE)',
    avoid: 'Weak ciphers (RC4, DES, 3DES, MD5)',
    order: 'Prefer server cipher order for security'
  },
  
  headers: {
    hsts: 'Enable HSTS to force HTTPS',
    csp: 'Use Content Security Policy',
    xFrameOptions: 'Prevent clickjacking'
  }
};

module.exports = {
  createHTTPSServer,
  generateSelfSignedCert,
  securityHeaders,
  redirectToHTTPS,
  tlsBestPractices
};
