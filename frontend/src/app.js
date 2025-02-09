// app.js
import { ProductScanner } from './scanner';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize scanner
    const scanner = new ProductScanner('scanner-container');
    
    // Setup event listeners
    document.getElementById('start-scan').addEventListener('click', () => {
        scanner.start();
    });

    document.getElementById('stop-scan').addEventListener('click', () => {
        scanner.stop();
    });

    // Handle window resize for Three.js
    window.addEventListener('resize', () => {
        scanner.handleResize();
    });
});