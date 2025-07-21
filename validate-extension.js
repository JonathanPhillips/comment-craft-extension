#!/usr/bin/env node

// Node.js script to validate extension structure and manifest
const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Comment Craft Extension...\n');

const checks = {
  passed: 0,
  failed: 0,
  warnings: 0
};

function pass(message) {
  console.log(`✅ ${message}`);
  checks.passed++;
}

function fail(message) {
  console.log(`❌ ${message}`);
  checks.failed++;
}

function warn(message) {
  console.log(`⚠️  ${message}`);
  checks.warnings++;
}

// Check if file exists
function fileExists(filePath) {
  return fs.existsSync(filePath);
}

// Validate manifest.json
console.log('📋 Checking manifest.json...');
if (fileExists('manifest.json')) {
  pass('manifest.json exists');
  
  try {
    const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
    
    // Check required fields
    if (manifest.manifest_version === 2) {
      pass('Manifest version 2 (Firefox compatible)');
    } else {
      fail('Invalid manifest version');
    }
    
    if (manifest.name && manifest.version && manifest.description) {
      pass('Basic metadata present');
    } else {
      fail('Missing required metadata fields');
    }
    
    // Check permissions
    if (manifest.permissions && manifest.permissions.includes('storage')) {
      pass('Storage permission included');
    } else {
      fail('Missing storage permission');
    }
    
    // Check content scripts
    if (manifest.content_scripts && manifest.content_scripts.length > 0) {
      pass('Content scripts configured');
      
      const contentScript = manifest.content_scripts[0];
      const requiredSites = ['youtube.com', 'reddit.com', 'tiktok.com'];
      const hasRequiredSites = requiredSites.every(site => 
        contentScript.matches.some(match => match.includes(site))
      );
      
      if (hasRequiredSites) {
        pass('All required sites included in matches');
      } else {
        fail('Missing required sites in content script matches');
      }
    } else {
      fail('No content scripts configured');
    }
    
    // Check background script
    if (manifest.background && manifest.background.scripts) {
      pass('Background script configured');
    } else {
      fail('No background script configured');
    }
    
    // Check browser action (popup)
    if (manifest.browser_action) {
      pass('Browser action (popup) configured');
    } else {
      warn('No browser action configured');
    }
    
  } catch (error) {
    fail(`Failed to parse manifest.json: ${error.message}`);
  }
} else {
  fail('manifest.json not found');
}

// Check core files
console.log('\n📁 Checking core files...');
const coreFiles = [
  'content.js',
  'background.js',
  'popup.html',
  'popup.js',
  'popup.css',
  'options.html',
  'options.js',
  'options.css',
  'content.css'
];

coreFiles.forEach(file => {
  if (fileExists(file)) {
    pass(`${file} exists`);
  } else {
    fail(`${file} missing`);
  }
});

// Check JavaScript syntax (basic)
console.log('\n🔧 Checking JavaScript files...');
const jsFiles = ['content.js', 'background.js', 'popup.js', 'options.js'];

jsFiles.forEach(file => {
  if (fileExists(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Basic syntax checks
      if (content.includes('console.log')) {
        warn(`${file} contains console.log statements (remove for production)`);
      }
      
      if (content.length === 0) {
        fail(`${file} is empty`);
      } else {
        pass(`${file} has content`);
      }
      
      // Check for required patterns
      if (file === 'content.js') {
        if (content.includes('CommentCraft') || content.includes('comment-craft')) {
          pass('content.js contains Comment Craft code');
        } else {
          fail('content.js missing expected code patterns');
        }
      }
      
      if (file === 'background.js') {
        if (content.includes('chrome.runtime.onMessage') || content.includes('browser.runtime.onMessage')) {
          pass('background.js has message listener');
        } else {
          fail('background.js missing message listener');
        }
      }
      
    } catch (error) {
      fail(`Error reading ${file}: ${error.message}`);
    }
  }
});

// Check HTML files
console.log('\n🌐 Checking HTML files...');
const htmlFiles = ['popup.html', 'options.html'];

htmlFiles.forEach(file => {
  if (fileExists(file)) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.includes('<!DOCTYPE html>')) {
        pass(`${file} has proper DOCTYPE`);
      } else {
        warn(`${file} missing DOCTYPE declaration`);
      }
      
      if (content.includes('<script')) {
        pass(`${file} includes JavaScript`);
      } else {
        warn(`${file} has no JavaScript includes`);
      }
      
    } catch (error) {
      fail(`Error reading ${file}: ${error.message}`);
    }
  }
});

// Check icons directory
console.log('\n🎨 Checking assets...');
if (fs.existsSync('icons')) {
  pass('Icons directory exists');
  
  const iconFiles = fs.readdirSync('icons');
  if (iconFiles.length > 0) {
    pass(`Found ${iconFiles.length} icon files`);
  } else {
    warn('Icons directory is empty');
  }
} else {
  warn('Icons directory missing (extension will work but no icon)');
}

// Check for git repository
console.log('\n📦 Checking project setup...');
if (fs.existsSync('.git')) {
  pass('Git repository initialized');
} else {
  warn('Not a git repository');
}

if (fileExists('.gitignore')) {
  pass('.gitignore exists');
} else {
  warn('.gitignore missing');
}

if (fileExists('README.md')) {
  pass('README.md exists');
} else {
  warn('README.md missing');
}

// Summary
console.log('\n📊 VALIDATION SUMMARY');
console.log('====================');
console.log(`✅ Passed: ${checks.passed}`);
console.log(`❌ Failed: ${checks.failed}`);
console.log(`⚠️  Warnings: ${checks.warnings}`);

if (checks.failed === 0) {
  console.log('\n🎉 Extension validation passed! Ready for testing.');
  console.log('\nNext steps:');
  console.log('1. Load extension in Firefox (about:debugging)');
  console.log('2. Test on YouTube, Reddit, and TikTok');
  console.log('3. Configure API keys and test response generation');
} else {
  console.log('\n🔧 Fix the failed checks before testing the extension.');
}

process.exit(checks.failed > 0 ? 1 : 0);