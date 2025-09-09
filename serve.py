#!/usr/bin/env python3
"""
Simple HTTP server with CORS support for local development
Optimized for static websites and modern web development
"""

from http.server import HTTPServer, SimpleHTTPRequestHandler
import sys
import os
import mimetypes
from urllib.parse import unquote
import gzip
import time

class EnhancedHTTPRequestHandler(SimpleHTTPRequestHandler):
    """Enhanced HTTP request handler with CORS, caching, and security headers"""
    
    def __init__(self, *args, **kwargs):
        # Add modern MIME types
        mimetypes.add_type('application/javascript', '.mjs')
        mimetypes.add_type('text/css', '.css')
        mimetypes.add_type('application/json', '.json')
        mimetypes.add_type('image/webp', '.webp')
        mimetypes.add_type('image/avif', '.avif')
        mimetypes.add_type('font/woff2', '.woff2')
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        """Add security and performance headers"""
        # CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        
        # Security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.send_header('X-XSS-Protection', '1; mode=block')
        self.send_header('Referrer-Policy', 'strict-origin-when-cross-origin')
        
        # Cache headers for static assets
        if self.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 year
        elif self.path.endswith('.html') or self.path == '/':
            self.send_header('Cache-Control', 'no-cache, must-revalidate')
        
        super().end_headers()
    
    def do_OPTIONS(self):
        """Handle preflight requests"""
        self.send_response(200)
        self.end_headers()
    
    def do_GET(self):
        """Enhanced GET handler with SPA support"""
        # Handle SPA routing - serve index.html for non-file requests
        if not os.path.exists(self.translate_path(self.path)) and not self.path.startswith('/assets/'):
            if not '.' in os.path.basename(self.path):
                self.path = '/index.html'
        
        return super().do_GET()
    
    def log_message(self, format, *args):
        """Enhanced logging with timestamps and colors"""
        timestamp = time.strftime('%Y-%m-%d %H:%M:%S')
        method = args[0].split()[0] if args else 'GET'
        status = args[0].split()[1] if len(args[0].split()) > 1 else '200'
        
        # Matrix-style green color coding
        if status.startswith('2'):
            color = '\033[92m'  # Bright green (success)
        elif status.startswith('3'):
            color = '\033[32m'  # Dark green (redirect)
        elif status.startswith('4'):
            color = '\033[91m'  # Red (client error)
        elif status.startswith('5'):
            color = '\033[31m'  # Dark red (server error)
        else:
            color = '\033[32m'  # Default green
        
        reset = '\033[0m'
        
        sys.stderr.write(f"[{timestamp}] {color}{method} {status}{reset} - {format % args}\n")

def run_server(port=8000, bind='127.0.0.1'):
    """Run the HTTP server with enhanced configuration"""
    server_address = (bind, port)
    
    try:
        httpd = HTTPServer(server_address, EnhancedHTTPRequestHandler)
        
        print(f"\033[32mStarting server on http://{bind}:{port}\033[0m")
        print(f"\033[32mServing directory: {os.getcwd()}\033[0m")
        print(f"\033[92mOpen in browser: http://localhost:{port}\033[0m")
        print("\033[32mServer logs:\033[0m")
        print("\033[32m" + "-" * 50 + "\033[0m")
        
        httpd.serve_forever()
        
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"ERROR: Port {port} is already in use. Try a different port.")
            sys.exit(1)
        else:
            print(f"ERROR: Starting server: {e}")
            sys.exit(1)
    except KeyboardInterrupt:
        print(f"\n\033[32mShutting down server...\033[0m")
        httpd.server_close()
        print("\033[92mServer stopped successfully\033[0m")
        sys.exit(0)

def main():
    """Main entry point with argument parsing"""
    port = 8000
    bind = '127.0.0.1'
    
    # Simple argument parsing
    for i, arg in enumerate(sys.argv[1:], 1):
        if arg.isdigit():
            port = int(arg)
        elif arg in ['-h', '--help']:
            print("Usage: python serve.py [port] [--bind address]")
            print("  port: Port number (default: 8000)")
            print("  --bind: Bind address (default: 127.0.0.1)")
            print("Examples:")
            print("  python serve.py 8080")
            print("  python serve.py 3000 --bind 0.0.0.0")
            sys.exit(0)
        elif arg == '--bind' and i + 1 < len(sys.argv):
            bind = sys.argv[i + 1]
        elif not arg.startswith('--'):
            try:
                port = int(arg)
            except ValueError:
                print(f"ERROR: Invalid port number: {arg}")
                sys.exit(1)
    
    # Validate port range
    if not (1 <= port <= 65535):
        print(f"ERROR: Port must be between 1 and 65535, got: {port}")
        sys.exit(1)
    
    run_server(port, bind)

if __name__ == '__main__':
    main()
