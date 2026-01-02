#!/usr/bin/env node

// Simple fallback start script with proxy error handling
const { spawn } = require('child_process');
const http = require('http');

console.log('🚀 Starting development server...\n');

// Check if backend is running
function checkBackend() {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:5000/api/health', (res) => {
      resolve(true);
    });
    req.on('error', () => {
      resolve(false);
    });
    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startServer() {
  const backendRunning = await checkBackend();
  
  if (!backendRunning) {
    console.log('⚠️  Backend not detected on port 5000');
    console.log('💡 Make sure to start the backend first: npm run start:backend');
    console.log('🔄 Starting frontend anyway...\n');
  } else {
    console.log('✅ Backend detected on port 5000\n');
  }

  // Set basic environment variables
  const env = {
    ...process.env,
    GENERATE_SOURCEMAP: 'false',
    BROWSER: 'none',
    TSC_COMPILE_ON_ERROR: 'true',
    DANGEROUSLY_DISABLE_HOST_CHECK: 'true',
    // Suppress webpack dev server deprecation warnings
    NODE_OPTIONS: '--no-deprecation',
  };

  // Start react-scripts with deprecation warnings suppressed
  const child = spawn('npx', ['react-scripts', 'start'], {
    env,
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (error) => {
    console.error('❌ Failed to start:', error.message);
    console.log('\n💡 Try running: npm run start:no-proxy');
    process.exit(1);
  });

  child.on('exit', (code) => {
    process.exit(code);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    child.kill('SIGINT');
  });
}

startServer();