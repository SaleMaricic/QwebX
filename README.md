# QwebX
Izvorni kod za QwebX, brzi srpski web pretraživač baziran na Electronu.
# QwebX - Srpski Browser Nove Generacije

[![GitHub license](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/SaleMaricic/QwebX)](https://github.com/SaleMaricic/QwebX/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/SaleMaricic/QwebX)](https://github.com/SaleMaricic/QwebX/issues)

---

##  O Projektu

**QwebX** je eksperimentalni web pretraživač baziran na **Electron (Chromium) v22** jezgri, razvijen sa primarnim ciljem da pruži brze, stabilne i moderne web performanse na **zastarelim operativnim sistemima i hardveru**, posebno na starijim Mac računarima koji više ne dobijaju zvaničnu podršku za moderne verzije Chrome-a ili Firefox-a.

### Ključne Prednosti QwebX-a

* **Optimizacija za Stari Hardver:** Namerno koristi starije Chromium jezgro (Electron 22) sa **ručnim optimizacijama** u `main.js` za forsiranje **GPU akceleracije** čak i na grafičkim karticama koje su *black-list*ovane u novijim pretraživačima.
* **Mala Potrošnja Resursa:** Drastično manji RAM otisak pri hladnom startu i pri radu sa više tabova u poređenju sa današnjim pretraživačima.
* **Puna Kompatibilnost:** Uspešno testiran i funkcionalan na modernim, resursno zahtevnim servisima kao što su **Gemini, ChatGPT, Grok, Gmail** i **WordPress Editor**.

---

## 🛠️ QwebX Source & Compiler Guide (Vodič za Kompajliranje)

Ovaj vodič objašnjava proces preuzimanja izvornog koda i korak-po-korak uputstva za kompajliranje finalnih distribucija (.deb, AppImage, .zip, Portable EXE) za različite platforme.

### 1.  Preduslovi za Kompajliranje

Za uspešno kompajliranje QwebX-a neophodno je da imate instaliran sledeći softver:

| Softver | Minimalna Verzija | Svrha |
| :--- | :--- | :--- |
| **Node.js** | 16.x ili novija | Izvršavanje JavaScript okruženja. |
| **npm** | 8.x ili novija | Upravljanje projektnim zavisnostima. |
| **Git** | Najnovija stabilna | Preuzimanje izvornog koda. |
| **Python** | 3.x | Dodatna zavisnost za neke npm module. |

> **Napomena:** Za kompajliranje Mac paketa na Linuxu ili Windowsu, kao i za Windows pakete na Macu, možda ćete morati da instalirate dodatne sistemske alate i sertifikate.

### 2.  Priprema i Instalacija Zavisnosti

Preuzmite kompletan izvorni kod projekta i instalirajte zavisnosti:

```bash
# Kloniranje repozitorijuma
git clone [https://github.com/SaleMaricic/QwebX.git](https://github.com/SaleMaricic/QwebX.git)
cd QwebX

# Instalacija svih zavisnosti (package.json)
npm install
```
### 3. Kompajliranje za Specifične Platforme
QwebX koristi electron-builder za automatsko pakovanje. 
Svi potrebni skriptovi su definisani u sekciji "scripts" u package.json.
#### Testiranje u Razvojnom Modu
Za brzo testiranje aplikacije bez kompajliranja finalnog paketa:
```bash
npm run start
```

#### 📦 Kompajliranje Finalnih Paketa

| Platforma | Komanda za Izvršavanje | Izlazni Format |
| :--- | :--- | :--- |
| **Linux (Debian/Ubuntu)** | `npm run build-deb` | .deb paket |
| **Linux (Univerzalni)** | `npm run build-appimage` | AppImage |
| **Windows** | `npm run build-win` | Portable EXE (bez instalacije) |
| **macOS** | `npm run build-mac` | .zip arhiva (standardna distribucija) |

### 4. Generisanje Sistemskih Ikona
Ukoliko menjate izvornu build/icon.png, morate ponovo generisati sve formatirane ikone (.ico, .icns):
```bash
npm run icons
```
### 5. Izlazni Direktorijum
Svi finalni i kompajlirani paketi biće generisani u direktorijumu:
```bash
QwebX/dist/
```

### 🖥️ Ciljna Platforma i Kompatibilnost

QwebX je posebno optimizovan da udahne novi život starijim macOS verzijama:

| OS Verzija | Podrška | Napomena |
| :--- | :--- | :--- |
| **macOS 10.10 Yosemite** | Minimalna | Radi stabilno na veoma starom hardveru |
| **macOS 10.11 El Capitan – 10.14 Mojave** | Optimalna | Najbolje performanse i najefikasnije optimizacije |
| **Novije verzije macOS-a** | Puna | Radi, ali nativni browseri na Apple Silicon (arm64) uređajima imaju bolje performanse |

---

### 📜 Licenca

Ovaj projekat je objavljen pod **MIT licencom**.

Pogledajte fajl [LICENSE](LICENSE) za više informacija.

---

### 📬 Kontakt

* **Autor:** Aleksandar Maričić
* **Email:** qwebx@abel.rs
