// scanner.js
import * as THREE from 'three';
import { ProductAPI } from './api';

export class ProductScanner {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.setupScanner();
        this.setupThreeJS();
    }

    setupScanner() {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: this.container,
                constraints: {
                    facingMode: "environment"
                }
            },
            decoder: {
                readers: ["ean_reader", "ean_8_reader"]
            }
        }, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            console.log("Scanner initialized successfully");
        });

        Quagga.onDetected(this.handleScan.bind(this));
    }

    setupThreeJS() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ alpha: true });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        // Add maple leaf model
        const geometry = new THREE.PlaneGeometry(1, 1);
        const material = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.5
        });
        
        this.leaf = new THREE.Mesh(geometry, material);
        this.scene.add(this.leaf);

        this.camera.position.z = 5;
        this.animate();
    }

    animate() {
        requestAnimationFrame(this.animate.bind(this));
        
        this.leaf.rotation.x += 0.01;
        this.leaf.rotation.y += 0.01;
        
        this.renderer.render(this.scene, this.camera);
    }

    async handleScan(result) {
        const barcode = result.codeResult.code;
        
        if (await ProductAPI.validateBarcode(barcode)) {
            try {
                const productData = await ProductAPI.getProductByBarcode(barcode);
                this.displayResult(productData);
            } catch (error) {
                this.displayError("Could not find product information");
            }
        }
    }

    displayResult(productData) {
        const resultDiv = document.createElement('div');
        resultDiv.className = 'scan-result';
        
        resultDiv.innerHTML = `
            <h3>${productData.name}</h3>
            <p>Made in: ${productData.country}</p>
            ${productData.country === 'Canada' 
                ? '<div class="canadian-product">🇨🇦 Proudly Canadian!</div>'
                : '<div class="foreign-product">Consider a Canadian Alternative</div>'
            }
        `;

        this.container.appendChild(resultDiv);
    }

    displayError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'scan-error';
        errorDiv.textContent = message;
        this.container.appendChild(errorDiv);
    }

    start() {
        Quagga.start();
    }

    stop() {
        Quagga.stop();
    }
}