# QwebX
A fast Electron/Chromium browser specifically optimized to enable older macOS systems (Yosemite, El Capitan, Mojave) to access modern web services and functionalities..
# QwebX - The Next-Generation Serbian Browser

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/SaleMaricic/QwebX)](https://github.com/SaleMaricic/QwebX/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/SaleMaricic/QwebX)](https://github.com/SaleMaricic/QwebX/issues)

---

## About the Project

**QwebX** is an experimental web browser based on the **Electron (Chromium) v22** core. It was developed primarily to deliver fast, stable, and modern web performance on **legacy operating systems and hardware**, specifically targeting older Mac computers that no longer receive official support for modern versions of Chrome or Firefox.

### Key Advantages of QwebX

* **Optimization for Legacy Hardware:** It deliberately uses an older Chromium core (Electron 22) with **manual optimizations** in `main.js` to enforce **GPU acceleration** even on graphics cards that are *blacklisted* in newer browsers.
* **Minimal Resource Footprint:** Features a drastically smaller RAM footprint upon cold start and when handling multiple tabs compared to contemporary browsers.
* **Broad Compatibility:** Successfully tested and fully functional with modern, resource-intensive services such as **Gemini, ChatGPT, Grok, Gmail**, and **WordPress Editor**.

---

## 🛠️ QwebX Source & Compiler Guide

This guide details the process of cloning the source code and provides step-by-step instructions for compiling the final distribution packages (.deb, AppImage, .zip, Portable EXE) for various platforms.

### 1. Compilation Prerequisites

The following software is required for successful compilation of QwebX:

Software | Minimal Version | Purpose
:--- | :--- | :---
**Node.js** | 16.x or newer | Executes the JavaScript runtime environment.
**npm** | 8.x or newer | Manages project dependencies.
**Git** | Latest Stable | Retrieves the source code.
**Python** | 3.x | Supplemental dependency for certain npm modules.

> **Note:** Compiling Mac packages on Linux or Windows, and Windows packages on Mac, may require the installation of additional system tools and signing certificates.

### 2. Preparation and Dependency Installation

Clone the complete project repository and install all dependencies:

    # Clone the repository
    git clone [https://github.com/SaleMaricic/QwebX.git](https://github.com/SaleMaricic/QwebX.git)
    cd QwebX

    # Install all dependencies (package.json)
    npm install

### 3. Compiling for Specific Platforms
QwebX uses electron-builder for automated packaging.
All necessary build scripts are defined in the "scripts" section of package.json.
#### Testing in Development Mode
For quick application testing without compiling the final package:
    npm run start

#### 📦 Compiling Final Packages

Platform | Execution Command | Output Format
:--- | :--- | :---
**Linux (Debian/Ubuntu)** | `npm run build-deb` | .deb package
**Linux (Universal)** | `npm run build-appimage` | AppImage
**Windows** | `npm run build-win` | Portable EXE (no installation)
**macOS** | `npm run build-mac` | .zip archive (standard distribution)

### 4. Generating System Icons
If the source file build/icon.png is modified, you must regenerate all formatted icons (.ico, .icns):
    npm run icons

### 5. Output Directory
All final, compiled packages will be generated in the directory:
    QwebX/dist/

### 🖥️ Target Platform and Compatibility

QwebX is specifically optimized to revitalize older macOS versions:

OS Version | Support | Note
:--- | :--- | :---
**macOS 10.10 Yosemite** | Minimal | Runs stably on extremely old hardware.
**macOS 10.11 El Capitan – 10.14 Mojave** | Optimal | Offers the best performance and most effective optimizations.
**Newer macOS Versions** | Full | Fully functional, but native browsers on Apple Silicon (arm64) devices generally provide superior performance.

---

### 📜 License

This project is released under the **MIT license**.

See the [LICENSE](LICENSE) file for more information.

---

### 📬 Contact

* **Author:** Aleksandar Maričić
* **Email:** qwebx@abel.rs
