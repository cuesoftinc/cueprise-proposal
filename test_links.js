const fs = require('fs');
const path = require('path');

// ANSI escape codes for terminal coloring
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m'
};

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Recursively find all HTML files in the directory
function findHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    // Ignore node_modules, .git, and .cursor folders
    if (file === 'node_modules' || file === '.git' || file === '.cursor') {
      continue;
    }
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      findHtmlFiles(filePath, fileList);
    } else if (filePath.endsWith('.html')) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Get the line number of a character index in a file's content
function getLineNumber(content, charIndex) {
  return content.substring(0, charIndex).split('\n').length;
}

// Extract links from an HTML file
function extractLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const links = [];

  // 1. Match href="..." or href='...'
  const hrefRegex = /href=["']([^"']*)["']/gi;
  let match;
  while ((match = hrefRegex.exec(content)) !== null) {
    const value = match[1].trim();
    if (value) {
      links.push({
        type: 'href',
        value,
        line: getLineNumber(content, match.index)
      });
    }
  }

  // 2. Match src="..." or src='...'
  const srcRegex = /src=["']([^"']*)["']/gi;
  while ((match = srcRegex.exec(content)) !== null) {
    const value = match[1].trim();
    if (value) {
      links.push({
        type: 'src',
        value,
        line: getLineNumber(content, match.index)
      });
    }
  }

  return links;
}

// Test an external HTTP/HTTPS link with a timeout
async function testExternalLink(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        // Standard User-Agent to prevent bot-blocking
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    clearTimeout(timeoutId);
    return {
      ok: response.ok,
      status: response.status,
      error: response.ok ? null : `HTTP Status ${response.status}`
    };
  } catch (err) {
    clearTimeout(timeoutId);
    return {
      ok: false,
      error: err.name === 'AbortError' ? 'Request Timeout' : err.message
    };
  }
}

// Check an email address syntax in mailto
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Main test runner
async function runTests() {
  const workspaceRoot = process.cwd();
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}             Cueprise Link Checker v1.0            ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}\n`);

  console.log(`${colors.dim}Scanning workspace: ${workspaceRoot}${colors.reset}`);
  const htmlFiles = findHtmlFiles(workspaceRoot);
  console.log(`Found ${colors.bold}${htmlFiles.length}${colors.reset} HTML files to test.\n`);

  let totalChecked = 0;
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;

  const failureDetails = [];

  for (const file of htmlFiles) {
    const relativeFile = path.relative(workspaceRoot, file);
    console.log(`${colors.bold}${colors.blue}File: ${relativeFile}${colors.reset}`);
    console.log(`${colors.dim}${"-".repeat(relativeFile.length + 6)}${colors.reset}`);

    const links = extractLinks(file);
    if (links.length === 0) {
      console.log(`  ${colors.dim}No links found.${colors.reset}\n`);
      continue;
    }

    for (const link of links) {
      totalChecked++;
      const isSrc = link.type === 'src';
      const label = `${link.value} (${link.type})`;

      // 1. External Link Check
      if (link.value.startsWith('http://') || link.value.startsWith('https://')) {
        // Skip checking localhost/local server references as they might not be running
        if (link.value.includes('localhost') || link.value.includes('127.0.0.1')) {
          console.log(`  ${colors.yellow}[SKIP]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value} (Local Dev Server - Skipped)${colors.reset}`);
          totalWarnings++;
          continue;
        }

        const result = await testExternalLink(link.value);
        if (result.ok) {
          console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value}${colors.reset}`);
          totalPassed++;
        } else {
          console.log(`  ${colors.red}[FAIL]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.bold}${link.value}${colors.reset} -> ${colors.red}${result.error}${colors.reset}`);
          totalFailed++;
          failureDetails.push({
            file: relativeFile,
            line: link.line,
            value: link.value,
            type: link.type,
            reason: result.error
          });
        }
      } 
      // 2. Special Protocols Check
      else if (link.value.startsWith('mailto:')) {
        const email = link.value.replace('mailto:', '').split('?')[0];
        if (isValidEmail(email)) {
          console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value} (Valid Email Syntax)${colors.reset}`);
          totalPassed++;
        } else {
          console.log(`  ${colors.yellow}[WARN]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${link.value} (Invalid Email Syntax?)${colors.reset}`);
          totalWarnings++;
        }
      } else if (link.value.startsWith('tel:')) {
        console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value} (Telephone link)${colors.reset}`);
        totalPassed++;
      } else if (link.value.startsWith('javascript:')) {
        console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value} (JavaScript pseudo-protocol)${colors.reset}`);
        totalPassed++;
      } else if (link.value === '#') {
        console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}# (Top-of-page anchor)${colors.reset}`);
        totalPassed++;
      } 
      // 3. Internal/Relative Link Check
      else {
        // Separate path and anchor hash (e.g., "slides-1.html#slide-4")
        let [linkPath, hash] = link.value.split('#');
        let targetPath;

        if (linkPath === '') {
          // Link is an in-page anchor like href="#overview"
          targetPath = file;
        } else {
          // Resolve relative to the current file's directory
          targetPath = path.resolve(path.dirname(file), linkPath);
        }

        // Check if directory - if so, look for index.html inside it
        try {
          if (fs.existsSync(targetPath) && fs.statSync(targetPath).isDirectory()) {
            targetPath = path.join(targetPath, 'index.html');
          }
        } catch (e) {
          // Fall through, existsSync check below will fail
        }

        if (fs.existsSync(targetPath)) {
          // File exists! Now check anchor if present
          if (hash && targetPath.endsWith('.html')) {
            const targetContent = fs.readFileSync(targetPath, 'utf-8');
            // Regex to find id="hash" or name="hash"
            const idRegex = new RegExp(`(?:id|name)=["']${escapeRegExp(hash)}["']`, 'i');
            
            if (idRegex.test(targetContent)) {
              console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value}${colors.reset} -> target file & anchor #${hash} exist`);
              totalPassed++;
            } else {
              console.log(`  ${colors.red}[FAIL]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.bold}${link.value}${colors.reset} -> ${colors.red}File exists, but anchor #${hash} NOT found!${colors.reset}`);
              totalFailed++;
              failureDetails.push({
                file: relativeFile,
                line: link.line,
                value: link.value,
                type: link.type,
                reason: `Anchor #${hash} not found in target page`
              });
            }
          } else {
            console.log(`  ${colors.green}[ OK ]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.dim}${link.value}${colors.reset} -> ${path.relative(workspaceRoot, targetPath)} exists`);
            totalPassed++;
          }
        } else {
          console.log(`  ${colors.red}[FAIL]${colors.reset} Line ${link.line.toString().padEnd(3)}: ${colors.bold}${link.value}${colors.reset} -> ${colors.red}Broken Link (File/Directory not found)${colors.reset}`);
          totalFailed++;
          failureDetails.push({
            file: relativeFile,
            line: link.line,
            value: link.value,
            type: link.type,
            reason: 'File/Directory not found'
          });
        }
      }
    }
    console.log(); // blank line between files
  }

  // Print summary report
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}                  Test Summary Report               ${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}====================================================${colors.reset}`);
  console.log(`Total checked links:  ${colors.bold}${totalChecked}${colors.reset}`);
  console.log(`Passed links:         ${colors.green}${colors.bold}${totalPassed}${colors.reset}`);
  console.log(`Warnings/Skipped:     ${colors.yellow}${colors.bold}${totalWarnings}${colors.reset}`);
  console.log(`Failed/Broken links:  ${colors.red}${colors.bold}${totalFailed}${colors.reset}\n`);

  if (failureDetails.length > 0) {
    console.log(`${colors.bold}${colors.red}Broken Link Breakdown:${colors.reset}`);
    failureDetails.forEach((fail, idx) => {
      console.log(`${idx + 1}. [${fail.type.toUpperCase()}] ${colors.bold}${fail.file}${colors.reset} (Line ${fail.line}):`);
      console.log(`   Link:   ${colors.yellow}${fail.value}${colors.reset}`);
      console.log(`   Reason: ${colors.red}${fail.reason}${colors.reset}\n`);
    });
    console.log(`${colors.bold}${colors.red}TEST FAILED!${colors.reset} Please fix the broken links above.\n`);
    process.exit(1);
  } else {
    console.log(`${colors.bold}${colors.green}TEST PASSED! All links and assets are intact!${colors.reset}\n`);
    process.exit(0);
  }
}

runTests();
