
# 🪷 DilSeRakhi

### Har dhaage mein ek kahani. ❤️

**DilSeRakhi** is a personalized digital Raksha Bandhan experience designed to celebrate the bond between a brother and sister through an interactive, emotional, and playful online ceremony.

This project was created as a personal gesture for my sister on the occasion of **Raksha Bandhan**.

---

## 💝 The Story Behind DilSeRakhi

I am originally from **Gurgaon**, and my sister is currently in Gurgaon as well, while I am here in **Vijayawada**.

Being away from home during Raksha Bandhan made me want to create something more personal than simply sending a message or a traditional greeting.

So, I built **DilSeRakhi** as a small token of appreciation and affection for my sister — a way to recreate some of the warmth, traditions, memories, and emotions of Raksha Bandhan even when we are physically apart.

The idea was simple:

> **Distance should not make the celebration feel distant.**

Instead of sending just a Rakhi or a message, I wanted to create an experience she could interact with and remember.

---

## ✨ What is DilSeRakhi?

DilSeRakhi turns Raksha Bandhan into an interactive digital journey.

The experience allows a sister to:

- Enter the names of the brother and sister
- Choose a Rakhi from multiple designs
- Write a personalized message
- Preview the Rakhi
- Generate a personalized sharing link
- Send the Rakhi experience directly through WhatsApp

When the brother opens the shared link, he enters a separate interactive experience that includes:

- Aarti
- Tilak ceremony
- Mithai
- Aashirwaad
- Digital Rakhi tying
- Rakhi acceptance
- Sibling rules
- Shagun selection
- A personalized sibling agreement

The goal is to make the digital experience feel less like a webpage and more like a **small virtual Raksha Bandhan ceremony**.

---

## 🎀 Rakhi Collection

DilSeRakhi currently includes multiple Rakhi styles, each designed for a different personality and aesthetic.

Current designs include:

- 🕉️ Traditional Rakhi
- ❤️ Love & Bond Rakhi
- 💎 Diamond Heart Rakhi
- 🦚 Krishna–Radha Rakhi
- 🧸 Cute Teddy Rakhi
- 🌸 Shubh Swastik Rakhi
- ❄️ Silver Rakhi
- 🚀 Little Explorer Rakhi

The collection combines traditional, spiritual, elegant, playful, and children's designs.

---

## 🪔 Interactive Ceremony

One of the main ideas behind the project is to preserve the feeling of a traditional Raksha Bandhan ceremony in a digital format.

The brother-side experience includes an interactive sequence:

```text
Aarti
   ↓
Tilak
   ↓
Mithai
   ↓
Aashirwaad
   ↓
Rakhi
   ↓
Rakhi Tying Animation
   ↓
Acceptance
   ↓
Sibling Rules
   ↓
Shagun
   ↓
Sibling Agreement
````

Each stage uses animations and interactive elements to make the experience feel engaging rather than static.

---

## 💌 Personalized Sharing

The experience generates personalized URLs containing the brother's name, sister's name, selected Rakhi, and message.

This allows the sister to create a unique Rakhi experience and send it directly to her brother.

The website also supports:

* WhatsApp sharing
* Copyable Rakhi links
* Personalized sibling agreement links
* Agreement image generation

---

## 🎁 Shagun & Sibling Agreement

The experience adds a playful element after the Rakhi ceremony.

The brother can select a digital **Shagun**, followed by a personalized message.

The website then generates a digital **Sibling Agreement** containing:

* Brother's name
* Sister's name
* Rakhi acceptance
* Shagun
* Brother's message
* Lifetime validity

The agreement acts as a fun digital keepsake representing the bond between the siblings.

---

## 🛠️ Tech Stack

DilSeRakhi is built using modern web technologies:

* **Next.js**
* **React**
* **TypeScript**
* **Tailwind CSS**
* **Framer Motion**
* **html2canvas**

### Key technologies and their roles

**Next.js**
Used as the core framework for building and deploying the website.

**React**
Used to build the interactive user interface and manage application state.

**TypeScript**
Used for type safety and more maintainable code.

**Tailwind CSS**
Used for responsive styling and the visual design system.

**Framer Motion**
Used for interactive transitions, ceremony animations, floating elements, and UI interactions.

**html2canvas**
Used to generate a downloadable image of the final Sibling Agreement.

---

## 🎵 Audio Experience

The website includes optional Raksha Bandhan-themed background music during the interactive ceremony.

Audio assets are stored inside:

```text
public/audio/
```

Current audio files include:

```text
bhaiya_mere.mp3
dil_ki_dori_raksha_ban.mp3
```

Music playback is intentionally triggered through user interaction to work reliably with modern browser autoplay restrictions.

---

## 🖼️ Assets

Rakhi images are stored inside:

```text
public/rakhi/
```

The project currently uses assets such as:

```text
diamond-rakhi.jpg
love-rakhi.jpg
om-rakhi.jpg
radha-rakhi.jpg
silver-rakhi.jpg
swastik-rakhi.jpg
teddy-rakhi.jpg
kids-space-rakhi.jpg
```

---

## 📁 Project Structure

A simplified structure of the project looks like:

```text
DilSeRakhi/
│
├── app/
│   └── page.tsx
│
├── public/
│   ├── audio/
│   │   ├── bhaiya_mere.mp3
│   │   └── dil_ki_dori_raksha_ban.mp3
│   │
│   └── rakhi/
│       ├── diamond-rakhi.jpg
│       ├── love-rakhi.jpg
│       ├── om-rakhi.jpg
│       ├── radha-rakhi.jpg
│       ├── silver-rakhi.jpg
│       ├── swastik-rakhi.jpg
│       ├── teddy-rakhi.jpg
│       └── kids-space-rakhi.jpg
│
├── package.json
├── README.md
└── ...
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/DilSeRakhi.git
```

### 2. Move into the project

```bash
cd DilSeRakhi
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

---

## 🏗️ Build for Production

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

---

## 🌐 Deployment

The project is designed to work well with platforms such as **Vercel**.

Typical deployment flow:

```text
Local Development
       ↓
GitHub
       ↓
Vercel
       ↓
Production Website
```

Whenever changes are pushed to the connected GitHub repository, the deployment can be updated automatically through Vercel's Git integration.

---

## 🎯 Design Philosophy

DilSeRakhi was designed around three principles:

### 1. Emotion

The website should feel personal rather than technological.

### 2. Tradition

Important elements of Raksha Bandhan — Aarti, Tilak, Mithai, blessings, Rakhi, and Shagun — are represented digitally.

### 3. Playfulness

The brother-sister relationship naturally includes humour, memories, teasing, and affection, so the experience intentionally incorporates light-hearted interactions alongside emotional moments.

---

## ❤️ Why I Built It

At its core, DilSeRakhi is not intended to replace a real Raksha Bandhan celebration.

It was created for a much simpler reason:

**I wanted to do something meaningful for my sister.**

Being in **Vijayawada** while she is in **Gurgaon** meant that I could not celebrate the occasion with her in the usual way.

So I decided to build something myself.

What started as a simple idea — *"What if I made a digital Rakhi?"* — gradually became an interactive experience combining design, development, animation, music, personalization, and traditional elements of Raksha Bandhan.

DilSeRakhi is therefore both a **technical project and a personal keepsake**.

---

## 🌸 A Personal Note

This project was created for my sister with the intention of expressing something that can sometimes be difficult to express through an ordinary message:

**Thank you for being there, for all the memories, and for being an important part of my life.**

A physical Rakhi can travel only so far.

A little code, however, can cross the distance.

---

## 🔮 Future Ideas

Possible future improvements include:

* More Rakhi designs and collections
* Personalized Rakhi themes
* Better mobile-first animations
* Custom photos and memories
* Voice messages
* More interactive rituals
* Digital Rakhi customization
* More celebration themes
* Cloud-based sharing and persistence
* Personalized sibling profiles
* More visual effects and transitions

---

## 📜 License

This project was created as a personal and experimental project.

Unless otherwise stated, the original source code, design, and custom assets are intended for personal use and learning.

Third-party libraries and assets remain subject to their respective licenses.

---

## 👨‍💻 Author

**Agrim Garg**

Created with ❤️ in **Vijayawada**
For a very special sister in **Gurgaon**.

### DilSeRakhi

> **Har dhaage mein ek kahani. 🪷❤️**

```
