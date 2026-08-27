"use client";

import { useEffect, useRef, useState, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas";

type Screen =
  | "welcome"
  | "names"
  | "rakhi"
  | "message"
  | "preview"
  | "send"
  | "brother"
  | "tie"
  | "rules"
  | "accepted"
  | "shagun"
  | "agreement";

function safeFilePart(value: string, fallback: string) {
  const cleaned = value
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
    .trim()
    .slice(0, 60);
  return cleaned || fallback;
}

const rakhiOptions = [
  {
    id: "traditional",
    image: "/rakhi/om-rakhi.jpg",
    name: "🕉️ Traditional Rakhi",
    emoji: "🕉️",
    color: "#770615",
  },
  {
    id: "love",
    image: "/rakhi/love-rakhi.jpg",
    name: "❤️ Love & Bond Rakhi",
    emoji: "❤️",
    color: "#C94C5A",
  },
  {
    id: "diamond-heart",
    image: "/rakhi/diamond-rakhi.jpg",
    name: "💎 Diamond Heart Rakhi",
    emoji: "💎",
    color: "#1248fb",
  },
  {
    id: "krishna-radha",
    image: "/rakhi/radha-rakhi.jpg",
    name: "🦚 Krishna–Radha Rakhi",
    emoji: "🦚",
    color: "#087c13",
  },
  {
    id: "cute-teddy",
    image: "/rakhi/teddy-rakhi.jpg",
    name: "🧸 Cute Teddy Rakhi",
    emoji: "🧸",
    color: "#ef0a3f",
  },
  {
    id: "swastik",
    image: "/rakhi/swastik-rakhi.jpg",
    name: "🌸 Shubh Swastik Rakhi",
    emoji: "🌸",
    color: "#B68A35",
  },
  {
    id: "elegant-silver",
    image: "/rakhi/silver-rakhi.jpg",
    name: "❄️ Silver Rakhi",
    emoji: "❄️",
    color: "#ea1853",
  },
  {
    id: "kids-space",
    image: "/rakhi/kids-space-rakhi.jpg",
    name: "🚀 Little Explorer Rakhi",
    emoji: "🚀",
    color: "#12a1f4",
  },
];

function makeRakhiLink(
  brother: string,
  sister: string,
  rakhiId: string,
  message: string
) {
  if (typeof window === "undefined") return "";

  const payload = btoa(
    encodeURIComponent(
      JSON.stringify({
        brother,
        sister,
        rakhiId,
        message,
      })
    )
  );

  const params = new URLSearchParams({ rakhi: payload });
  return `${window.location.origin}/?${params.toString()}`;
}

function makeAgreementLink(
  brother: string,
  sister: string,
  shagun: string,
  brotherMessage: string
) {
  if (typeof window === "undefined") return "";

  const payload = btoa(
    encodeURIComponent(
      JSON.stringify({
        brother,
        sister,
        shagun,
        brotherMessage,
      })
    )
  );

  const params = new URLSearchParams({ agreement: payload });
  return `${window.location.origin}/?${params.toString()}`;
}

function decodeRakhiLink(payload: string) {
  try {
    return JSON.parse(decodeURIComponent(atob(payload))) as {
      brother: string;
      sister: string;
      rakhiId: string;
      message: string;
    };
  } catch {
    return null;
  }
}

function decodeAgreementLink(payload: string) {
  try {
    return JSON.parse(decodeURIComponent(atob(payload))) as {
      brother: string;
      sister: string;
      shagun: string;
      brotherMessage: string;
    };
  } catch {
    return null;
  }
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [brother, setBrother] = useState("");
  const [sister, setSister] = useState("");
  const [selectedRakhi, setSelectedRakhi] = useState(rakhiOptions[0]);
  const [message, setMessage] = useState("");
  const [shagun, setShagun] = useState("");
  const [brotherMessage, setBrotherMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [music, setMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ritualStep, setRitualStep] = useState<
    "aarti" | "tilak" | "mithai" | "aashirwaad" | "rakhi" | "tying"
  >("aarti");
  const [mithaiFed, setMithaiFed] = useState(false);
  const [blessingTaken, setBlessingTaken] = useState(false);

  const [rakhiLink, setRakhiLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);
  const [agreementLink, setAgreementLink] = useState("");
  const [agreementCopied, setAgreementCopied] = useState(false);
  const agreementCardRef = useRef<HTMLDivElement | null>(null);
  const [imageGenerating, setImageGenerating] = useState(false);
  const [imageGenerated, setImageGenerated] = useState(false);

  useEffect(() => {
    if (screen === "tie") {
      setRitualStep("aarti");
      setMithaiFed(false);
      setBlessingTaken(false);
    }
  }, [screen]);

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setMusic(false);
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;

    try {
      if (audioRef.current.paused) {
        await audioRef.current.play();
        setMusic(true);
      } else {
        audioRef.current.pause();
        setMusic(false);
      }
    } catch (error) {
      console.log("Unable to play music.", error);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const agreementPayload = params.get("agreement");
    if (agreementPayload) {
      const agreement = decodeAgreementLink(agreementPayload);
      if (agreement) {
        setBrother(agreement.brother || "");
        setSister(agreement.sister || "");
        setShagun(agreement.shagun || "");
        setBrotherMessage(agreement.brotherMessage || "");
        setScreen("agreement");
        return;
      }
    }

    const rakhiPayload = params.get("rakhi");
    if (!rakhiPayload) return;

    const data = decodeRakhiLink(rakhiPayload);
    if (!data) return;

    setBrother(data.brother || "");
    setSister(data.sister || "");
    setMessage(data.message || "Happy Raksha Bandhan ❤️");

    const selected = rakhiOptions.find((item) => item.id === data.rakhiId);
    if (selected) setSelectedRakhi(selected);

    // A shared Rakhi link always opens directly on the Brother side.
    setScreen("brother");
  }, []);

  const next = (nextScreen: Screen) => {
    setScreen(nextScreen);
  };

  const createShareLink = () => {
    const link = makeRakhiLink(
      brother,
      sister,
      selectedRakhi.id,
      message || "Happy Raksha Bandhan ❤️"
    );
    setRakhiLink(link);
    return link;
  };

  const copyRakhiLink = async () => {
    const link = rakhiLink || createShareLink();

    try {
      await navigator.clipboard.writeText(link);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2200);
    } catch {
      window.prompt("Copy this Rakhi link:", link);
    }
  };

  const shareOnWhatsApp = () => {
    const link = rakhiLink || createShareLink();

    const text =
      `🪷 ${sister} ne aapke liye DilSeRakhi par ek khaas Rakhi taiyaar ki hai. 🥹✨\n\n` +
      `${brother}, isse sirf ek link mat samajhna — ismein aapke liye ek Rakhi, dil se likha message aur ek chhota sa Raksha Bandhan surprise hai. 🎁❤️\n\n` +
      `Thoda waqt nikaal kar link kholiye, ceremony poori kijiye aur dekhiye ${sister} ne aapke liye kya bheja hai. ❤️\n` +
      `${link}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const generateAgreementImage = async () => {
    if (!agreementCardRef.current) return;

    setImageGenerating(true);
    setImageGenerated(false);

    try {
      const canvas = await html2canvas(agreementCardRef.current, {
        backgroundColor: "#fff9f0",
        scale: Math.min(2, Math.max(1.5, window.devicePixelRatio || 1.5)),
        useCORS: true,
        logging: false,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.scrollHeight,
      });

      const link = document.createElement("a");
      const sisterFile = safeFilePart(sister, "Sister");
      const brotherFile = safeFilePart(brother, "Bhai");
      link.download = `Sibling-Agreement-${sisterFile}-${brotherFile}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setImageGenerated(true);
    } catch (error) {
      console.error("Agreement image generation failed:", error);
      alert("Agreement image generate nahi ho paayi. Please try again.");
    } finally {
      setImageGenerating(false);
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        preload="auto"
        onError={() => {
          console.error(
            "Rakhi music could not be loaded. Put the MP3 in public/audio/."
          );
          setMusic(false);
        }}
      >
        {/* Supports both filenames used during the project. */}
        <source src="/audio/bhaiya_mere.mp3" type="audio/mpeg" />
        <source src="/audio/dil_ki_dori_raksha_ban.mp3" type="audio/mpeg" />
      </audio>
      <main className="min-h-screen overflow-x-hidden bg-gradient-to-br from-[#f9d2c4] via-[#e7a1a2] to-[#b95f75] pb-4 text-[#332521]">
        <AnimatePresence mode="wait">

          {/* WELCOME */}
          {screen === "welcome" && (
            <motion.section
              key="welcome"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen flex-col items-center justify-center px-6 py-10 text-center"
            >
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [-2, 2, -2] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="mb-5 text-6xl"
              >
                🕉️
              </motion.div>

              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#8f4a3c]">
                A Rakhi Made With Love
              </p>

              <h1 className="max-w-3xl text-6xl font-extrabold leading-tight text-[#8f2435] md:text-8xl">
                DilSeRakhi
                <span className="ml-2">❤️</span>
              </h1>

              <p className="mt-5 text-2xl font-semibold text-[#6b3f3a] md:text-3xl">
                Har dhaage mein ek kahani.
              </p>

              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#725650] md:text-lg">
                Apne bhai ke liye ek khaas Rakhi chuniye,
                <br />
                dil ki baat likhiye aur ek yaadgaar Rakhi experience share kijiye. 🪷
              </p>

              <motion.button
                type="button"
                onClick={() => next("names")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="mt-8 rounded-full bg-[#8f2435] px-10 py-4 text-lg font-bold text-white shadow-2xl transition-shadow hover:shadow-[#8f2435]/40 focus:outline-none focus:ring-4 focus:ring-[#8f2435]/20"
              >
                🪷 Create Your Rakhi
              </motion.button>

              <p className="mt-3 text-sm font-medium text-[#6b3f3a]">
                It only takes a minute ❤️
              </p>
            </motion.section>
          )}

          {/* NAMES */}
          {screen === "names" && (
            <motion.section
              key="names"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-lg">
                <div className="mb-10 text-center">
                  <div className="mb-4 text-5xl">❤️</div>
                  <h2 className="text-4xl font-bold text-[#7a1f2b]">
                    Ek khoobsurat si shuruaat...
                  </h2>
                  <p className="mt-4 text-[#6b5b52]">
                    Har Rakhi ke peeche do dil aur do naam hote hain.
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block font-semibold">
                      Bhai ka naam
                    </label>
                    <input
                      value={brother}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setBrother(e.target.value)}
                      placeholder="Bhai ka naam..."
                      className="w-full rounded-2xl border border-[#e2cdbb] bg-white px-5 py-4 outline-none transition focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/20"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block font-semibold">
                      Rakhi bhejne wale ka naam 😊
                    </label>
                    <input
                      value={sister}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setSister(e.target.value)}
                      placeholder="Apna naam..."
                      className="w-full rounded-2xl border border-[#e2cdbb] bg-white px-5 py-4 outline-none transition focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/20"
                    />
                  </div>
                </div>

                <button
                  disabled={!brother.trim() || !sister.trim()}
                  onClick={() => next("rakhi")}
                  className="mt-8 w-full rounded-2xl bg-[#7a1f2b] px-6 py-4 font-semibold text-white transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Apna Rakhi Experience Shuru Kijiye ❤️
                </button>
              </div>
            </motion.section>
          )}

          {/* RAKHI SELECT */}
          {screen === "rakhi" && (
            <motion.section
              key="rakhi"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen px-6 py-16"
            >
              <div className="mx-auto max-w-5xl text-center">
                <p className="text-sm uppercase tracking-[0.3em] text-[#9b6b32]">
                  For {brother}
                </p>

                <h2 className="mt-3 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                  Apni Pasand Ki Rakhi Chuniye 🪷
                </h2>

                <p className="mx-auto mt-4 max-w-xl text-[#6b5b52]">
                  Jo Rakhi aapke dil ko bhaaye —
                  <br />
                  <b>“Ye mere bhai ke liye hai.”</b>
                  <br />
                  wahi chuniye. ❤️
                </p>

                <div className="mt-12 grid gap-6 md:grid-cols-3">
                  {rakhiOptions.map((rakhi) => (
                    <motion.button
                      key={rakhi.id}
                      whileHover={{ y: -8, scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedRakhi(rakhi)}
                      className={`rounded-3xl border-2 bg-white p-8 shadow-lg transition ${selectedRakhi.id === rakhi.id
                        ? "border-[#d4a84f] shadow-[#d4a84f]/30"
                        : "border-transparent"
                        }`}
                    >
                      <div
                        className="mx-auto flex h-44 w-44 items-center justify-center overflow-hidden rounded-full border-4 border-white shadow-xl"
                        style={{
                          background: `radial-gradient(circle, white 20%, ${rakhi.color} 100%)`,
                        }}
                      >
                        <span className="absolute text-6xl" aria-hidden="true">
                          {rakhi.emoji}
                        </span>
                        <img
                          src={rakhi.image}
                          alt={rakhi.name}
                          className="relative z-10 h-full w-full object-contain p-5"
                          loading="lazy"
                          onError={(event) => {
                            event.currentTarget.style.display = "none";
                          }}
                        />
                      </div>

                      <h3 className="mt-6 text-xl font-bold">
                        {rakhi.name}
                      </h3>

                      {selectedRakhi.id === rakhi.id && (
                        <p className="mt-2 text-sm text-[#9b6b32]">
                          ✓ Selected
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>

                <button
                  onClick={() => next("message")}
                  className="mt-12 rounded-full bg-[#7a1f2b] px-10 py-4 font-semibold text-white shadow-lg transition hover:scale-105"
                >
                  Ye Rakhi Mere Bhai Ke Naam ❤️
                </button>
              </div>
            </motion.section>
          )}

          {/* MESSAGE */}
          {screen === "message" && (
            <motion.section
              key="message"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-2xl">
                <div className="text-center">
                  <div className="text-6xl">💌</div>
                  <h2 className="mt-5 text-4xl font-bold text-[#7a1f2b]">
                    Bhai ke liye kuch dil se likhiye...
                  </h2>
                  <p className="mt-4 text-[#6b5b52]">
                    Jo baat kabhi saamne kehna mushkil hota hai,
                    <br />
                    shayad yahan likhna thoda aasaan ho. ❤️
                  </p>
                </div>

                <textarea
                  value={message}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                  placeholder="Bhai, dil se kuch kehna hai..."
                  className="mt-10 h-48 w-full resize-none rounded-3xl border border-[#e2cdbb] bg-white p-6 outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/20"
                />

                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {[
                    "🫶 Chahe kuch bhi ho, main hamesha aapke saath hoon",
                    "🏠 Ghar se doori ho sakti hai, dil se nahi",
                    "💖 Khushnaseeb hoon ki aap mere bhai hain",
                    "✨ Ye rishta hamesha pyaar se bana rahe",
                  ].map((text) => (
                    <button
                      key={text}
                      onClick={() => setMessage(text)}
                      className="rounded-full border border-[#e2cdbb] bg-white px-4 py-2 text-sm hover:bg-[#fff0e5]"
                    >
                      {text}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => next("preview")}
                  className="mt-8 w-full rounded-2xl bg-[#7a1f2b] px-6 py-4 font-semibold text-white"
                >
                  🪷 Message Dil Se Likh Do
                </button>
              </div>
            </motion.section>
          )}

          {/* PREVIEW */}
          {screen === "preview" && (
            <motion.section
              key="preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-md rounded-[2rem] border border-[#d4a84f]/40 bg-white p-10 text-center shadow-2xl">
                <div className="text-7xl">
                  <img
                    src={selectedRakhi.image}
                    alt={selectedRakhi.name}
                    className="mx-auto h-32 w-32 object-contain"
                    loading="lazy"
                  />
                </div>

                <p className="mt-8 text-xs uppercase tracking-[0.3em] text-[#9b6b32]">
                  A Rakhi For
                </p>

                <h2 className="mt-2 text-4xl font-bold text-[#7a1f2b]">
                  {brother}
                </h2>

                <p className="mt-3 text-sm text-[#6b5b52]">
                  From {sister} ❤️
                </p>

                <div className="my-8 h-px bg-[#eadaca]" />

                <p className="text-lg italic text-[#5e5048]">
                  “{message || "Happy Raksha Bandhan Bhai ❤️"}”
                </p>

                <button
                  onClick={() => next("send")}
                  className="mt-10 w-full rounded-2xl bg-[#7a1f2b] px-6 py-4 font-semibold text-white"
                >
                  Rakhi Bhai Tak Pyaar Se Pahunchaiye 📱
                </button>
              </div>
            </motion.section>
          )}

          {/* SEND RAKHI - SISTER SIDE ENDS HERE */}
          {screen === "send" && (
            <motion.section
              key="send"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-2xl text-center">
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="text-7xl"
                >
                  ❤️
                </motion.div>

                <p className="mt-6 text-sm uppercase tracking-[0.3em] text-[#9b6b32]">
                  DilSeRakhi ❤️
                </p>

                <h2 className="mt-3 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                  {brother} Ke Liye Rakhi Ready Hai! 🥹❤️
                </h2>

                <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-[#5e5048]">
                  {sister} ne aapke liye sirf ek Rakhi nahi banayi...
                  <br />
                  <b>ek chhota sa DilSeRakhi moment bheja hai. 🪷</b>
                  <br />
                  Ab bas ise {brother} tak pahunchana hai. 💌
                </p>

                <div className="mx-auto mt-10 max-w-xl rounded-[2rem] border border-[#d4a84f]/50 bg-white p-7 shadow-xl">
                  <div className="text-5xl">📱</div>

                  <h3 className="mt-4 text-2xl font-bold text-[#7a1f2b]">
                    Ab Ye Pyaar Bhai Tak Pyaar Se Pahunchaiye 💌
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#6b5b52]">
                    WhatsApp par seedha bhejiye ya link copy karke {brother} tak pyaar se pahunchaiye.
                    <br />
                    Phir woh Rakhi kholkar poora surprise experience dekhenge. 🪷✨
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={shareOnWhatsApp}
                      className="rounded-2xl bg-[#25D366] px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1"
                    >
                      💌 DilSeRakhi Share Kijiye
                    </button>

                    <button
                      type="button"
                      onClick={copyRakhiLink}
                      className="rounded-2xl border-2 border-[#7a1f2b] bg-white px-5 py-4 font-bold text-[#7a1f2b] transition hover:-translate-y-1"
                    >
                      {linkCopied ? "✅ Link Copied!" : "🔗 Link Copy Kijiye"}
                    </button>
                  </div>

                  {rakhiLink && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-5 rounded-2xl bg-[#fff8ef] p-4 text-left"
                    >
                      <p className="text-xs font-semibold text-[#7a1f2b]">
                        Your Rakhi Link
                      </p>
                      <p className="mt-2 break-all text-xs leading-5 text-[#6b5b52]">
                        {rakhiLink}
                      </p>
                    </motion.div>
                  )}
                </div>

                <div className="mx-auto mt-7 max-w-xl rounded-2xl bg-[#fff0e5] p-5">
                  <p className="text-sm leading-6 text-[#8f2435]">
                    ❤️ Bas, ab aapki taraf se Rakhi complete hai.
                    <br />
                    Ab {brother} ki baari hai...
                    <br />
                    <b>DilSeRakhi ka ek khaas surprise unka intezaar kar raha hai. 🥰🪷</b>
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* BROTHER WELCOME */}
          {screen === "brother" && (
            <motion.section
              key="brother"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen flex-col items-center justify-center px-6 text-center"
            >
              <div className="text-8xl">🪷</div>

              <p className="mt-8 text-sm uppercase tracking-[0.3em] text-[#9b6b32]">
                A Special Rakhi, Just For You ❤️
              </p>

              <h2 className="mt-4 text-5xl font-bold text-[#7a1f2b]">
                {brother} ❤️
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-[#6b5b52]">
                {sister} ne aapke liye ek khaas surprise bheja hai. ❤️
                <br />
                Is baar Rakhi digital hai...
                <br />
                <b>lekin ismein jazbaat bilkul dil se hain.</b>
              </p>

              <button
                onClick={() => {
                  next("tie");
                }}
                className="mt-10 rounded-full bg-[#7a1f2b] px-10 py-5 text-lg font-bold text-white shadow-xl transition hover:scale-105"
              >
                🪷 Apna Rakhi Surprise Kholiye
              </button>

              {music && (
                <p className="mt-5 text-sm text-[#9b6b32]">
                  🎵 Music On
                </p>
              )}
            </motion.section>
          )}

          {/* TIE / FULL RAKSHA BANDHAN CEREMONY */}
          {screen === "tie" && (
            <motion.section
              key="tie"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#fff1eb] via-[#f8d1d0] to-[#e8a2ae] px-5 py-10 pb-28 text-center"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {["✨", "🪔", "💫", "❤️", "🔔", "🧿", "💖", "🎀"].map((item, i) => (
                  <motion.span
                    key={i}
                    animate={{
                      y: [20, -120],
                      opacity: [0.15, 0.8, 0],
                      rotate: [0, 30, -20],
                    }}
                    transition={{
                      duration: 4 + i * 0.4,
                      repeat: Infinity,
                      delay: i * 0.5,
                    }}
                    className="absolute text-2xl"
                    style={{ left: `${8 + i * 16}%`, bottom: "-20px" }}
                  >
                    {item}
                  </motion.span>
                ))}
              </div>

              <button
                type="button"
                onClick={toggleMusic}
                className="absolute right-4 top-4 z-20 rounded-full border border-[#eadaca] bg-white/90 px-4 py-2 text-sm font-semibold text-[#7a1f2b] shadow-md backdrop-blur"
                aria-label={music ? "Pause music" : "Play music"}
              >
                {music ? "🔊 Music On" : "🔇 Music Off"}
              </button>

              <div className="relative z-10 mx-auto flex min-h-[calc(100vh-8rem)] max-w-3xl flex-col items-center justify-center">
                <p className="text-xs uppercase tracking-[0.3em] text-[#9b6b32]">
                  {sister} ❤️ {brother}
                </p>

                <AnimatePresence mode="wait">
                  {ritualStep === "aarti" && (
                    <motion.div
                      key="aarti"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#8f2435] md:text-5xl">
                        Sabse Pehle... Aarti 🪔✨
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl leading-7 text-[#68443f]">
                        Rakhi ka safar ek pyaari si Aarti se shuru karte hain. ❤️
                        <br />
                        Thoda sa aashirwaad, thoda sa pyaar... aur bahut saari yaadein. ✨
                      </p>

                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        className="relative mx-auto mt-10 flex h-64 w-64 items-center justify-center rounded-full border border-[#e6b85c]/50 bg-[#fffaf3] shadow-2xl"
                      >
                        <div className="absolute inset-5 rounded-full border-2 border-[#e7b75b]/40" />

                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.85, 1, 0.85],
                          }}
                          transition={{ duration: 1.8, repeat: Infinity }}
                          className="flex h-44 w-44 items-center justify-center rounded-full bg-gradient-to-br from-[#fff3c4] via-[#f7c76d] to-[#e9a43a] text-8xl shadow-inner"
                        >
                          🪔
                        </motion.div>

                        <span className="absolute -top-2 text-2xl">✨</span>
                        <span className="absolute right-4 top-10 text-xl">💫</span>
                        <span className="absolute bottom-8 left-5 text-xl">✨</span>
                        <span className="absolute bottom-2 right-8 text-2xl">🪷</span>
                      </motion.div>

                      <button
                        type="button"
                        onClick={() => setRitualStep("tilak")}
                        className="mt-8 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        ✨ Aarti Complete — Chalein Aage
                      </button>
                    </motion.div>
                  )}

                  {ritualStep === "tilak" && (
                    <motion.div
                      key="tilak"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#8f2435] md:text-5xl">
                        Ab Tilak Ki Pyaari Si Rasam... ❤️
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl leading-7 text-[#68443f]">
                        Ek chhota sa tilak...
                        <br />
                        aur Behen ka pyaar aur aashirwaad aapke saath rahe. ❤️✨
                      </p>
                      {/* Tilak Ceremony Animation */}
                      <div className="relative mx-auto mt-10 flex h-80 w-full max-w-md items-center justify-center overflow-hidden rounded-[3rem] border border-[#eadaca] bg-gradient-to-b from-[#fffdf9] to-[#fff1df] shadow-2xl">

                        {/* Soft festive glow */}
                        <motion.div
                          animate={{
                            scale: [1, 1.08, 1],
                            opacity: [0.25, 0.45, 0.25],
                          }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="absolute left-1/2 top-10 h-48 w-48 -translate-x-1/2 rounded-full bg-[#f5c96c] blur-3xl"
                        />

                        {/* Brother */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.8 }}
                          className="relative z-10 text-[9rem] leading-none"
                        >
                          🧑🏻

                          {/* Tilak appears after thali reaches */}
                          <motion.span
                            initial={{ opacity: 0, scaleY: 0 }}
                            animate={{ opacity: 1, scaleY: 1 }}
                            transition={{
                              delay: 2.3,
                              duration: 0.7,
                              ease: "easeOut",
                            }}
                            className="absolute left-1/2 top-[19%] h-8 w-3 -translate-x-1/2 rounded-full bg-[#b32636] shadow-lg"
                          />
                        </motion.div>

                        {/* Animated Tilak Thali */}
                        <motion.div
                          initial={{
                            x: 190,
                            y: 90,
                            rotate: 18,
                            opacity: 0,
                            scale: 0.75,
                          }}
                          animate={{
                            x: [190, 90, 35, 0],
                            y: [90, 55, 25, 0],
                            rotate: [18, 8, -4, 0],
                            opacity: [0, 1, 1, 1],
                            scale: [0.75, 0.9, 1, 1],
                          }}
                          transition={{
                            duration: 2.1,
                            ease: "easeInOut",
                          }}
                          className="absolute right-[7%] top-[28%] z-30"
                        >
                          {/* Thali */}
                          <div className="relative flex h-28 w-28 items-center justify-center rounded-full border-4 border-[#c8912f] bg-gradient-to-br from-[#fff1a8] via-[#f6c85f] to-[#d99b27] shadow-2xl">

                            {/* Decorative inner ring */}
                            <div className="absolute inset-3 rounded-full border-2 border-[#fff4c7]/80" />

                            {/* Kumkum */}
                            <div className="absolute left-5 top-5 h-5 w-5 rounded-full bg-[#b32636] shadow-md" />

                            {/* Rice */}
                            <span className="absolute right-5 top-5 text-lg">🤍</span>

                            {/* Diya */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-3xl">
                              🪔
                            </div>

                            {/* Tilak bowl */}
                            <div className="absolute bottom-5 right-5 text-xl">
                              🔴
                            </div>
                          </div>
                        </motion.div>

                        {/* Sparkles around the thali */}
                        {["✨", "💫", "✨"].map((item, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.5, 1.2, 0.7],
                              x: [0, (i - 1) * 45],
                              y: [20, -25],
                            }}
                            transition={{
                              delay: 1.3 + i * 0.25,
                              duration: 1.5,
                            }}
                            className="absolute left-[62%] top-[35%] z-40 text-2xl"
                          >
                            {item}
                          </motion.span>
                        ))}

                        {/* Completed message */}
                        <motion.p
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 2.9, duration: 0.6 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm font-semibold text-[#8f2435]"
                        >
                          ❤️ Behen ke pyaar ka Tilak lag gaya ✨
                        </motion.p>
                      </div>

                      <p className="mt-6 font-semibold text-[#7a1f2b]">
                        Tilak lag gaya! ✨
                      </p>

                      <button
                        type="button"
                        onClick={() => setRitualStep("mithai")}
                        className="mt-7 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg transition hover:scale-105"
                      >
                        ✨ Tilak Ki Pyaari Rasam Puri Hui
                      </button>
                    </motion.div>
                  )}

                  {ritualStep === "mithai" && (
                    <motion.div
                      key="mithai"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                        🍬 Ab Mithai Ka Meetha Pal ❤️
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6b5b52]">
                        Rakhi ki ceremony mein mithai toh zaroori hai. ❤️
                        <br />
                        <b>Kripya ek meethi si mithai zaroor lijiye. ❤️</b>
                      </p>

                      <div className="relative mx-auto mt-10 flex h-72 w-full max-w-lg items-center justify-center rounded-[3rem] border border-[#eadaca] bg-white shadow-2xl">
                        <motion.div
                          animate={
                            mithaiFed
                              ? { x: 100, y: -20, scale: 0.7, rotate: 15 }
                              : { y: [0, -8, 0] }
                          }
                          transition={
                            mithaiFed
                              ? { duration: 0.8 }
                              : { duration: 2, repeat: Infinity }
                          }
                          className="text-8xl"
                        >
                          🍬
                        </motion.div>
                        <div className="absolute bottom-7 text-6xl">
                          {mithaiFed ? "😋" : "👦"}
                        </div>
                      </div>

                      {!mithaiFed ? (
                        <button
                          type="button"
                          onClick={() => setMithaiFed(true)}
                          className="mt-8 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg transition hover:scale-105"
                        >
                          🍬 Mithai Zaroor Lijiye
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-7"
                        >
                          <p className="font-bold text-[#7a1f2b]">
                            Mithai bhi ho gayi... ab ek pyaari si muskaan bhi ho jaye. 😊❤️
                          </p>
                          <button
                            type="button"
                            onClick={() => setRitualStep("aashirwaad")}
                            className="mt-6 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg"
                          >
                            Mithai Ho Gayi ❤️
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {ritualStep === "aashirwaad" && (
                    <motion.div
                      key="aashirwaad"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                        😄 Ab Behen ki ek pyaari si baat bhi maan lijiye... ❤️
                      </h2>
                      <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-[#6b5b52]">
                        Mithai bhi kha li?
                        <br />
                        <b>Ab ek pyaara sa aashirwaad bhi le lijiye. ❤️</b>
                        <br />
                        Behen ka aashirwaad bhi saath le lijiye. 🙏✨
                      </p>

                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="mx-auto mt-10 flex h-64 w-full max-w-lg items-center justify-center rounded-[3rem] border border-[#eadaca] bg-white shadow-2xl"
                      >
                        <div className="text-8xl">
                          {blessingTaken ? "🙏❤️" : "😏🙏"}
                        </div>
                      </motion.div>

                      {!blessingTaken ? (
                        <button
                          type="button"
                          onClick={() => setBlessingTaken(true)}
                          className="mt-8 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg transition hover:scale-105"
                        >
                          🙏 Behen Ka Aashirwaad Lijiye
                        </button>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mx-auto mt-7 max-w-xl"
                        >
                          <p className="font-semibold leading-7 text-[#7a1f2b]">
                            Hamesha khush rahiye... ❤️
                            <br />
                            Hamesha haste rahiye, tarakki karte rahiye,
                            <br />
                            aur apni Behen ka pyaar hamesha apne dil mein rakhiye. 😊
                          </p>
                          <p className="mt-4 font-bold text-[#9b6b32]">
                            Aashirwaad hamesha dil se hai... ❤️
                            <br />
                            <span className="text-[#7a1f2b]">
                              aur Shagun ki ek pyaari si ummeed toh rahegi hi. 🎁
                            </span>
                          </p>

                          <button
                            type="button"
                            onClick={() => setRitualStep("rakhi")}
                            className="mt-7 rounded-full bg-[#7a1f2b] px-9 py-4 font-bold text-white shadow-lg transition hover:scale-105"
                          >
                            🪷 Ab Rakhi Baandhne Ka Pyaara Pal Hai ❤️
                          </button>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {ritualStep === "rakhi" && (
                    <motion.div
                      key="rakhi"
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                        🪷 Ab Rakhi Baandhne Ka Pyaara Pal Hai
                      </h2>

                      <p className="mx-auto mt-4 max-w-xl leading-7 text-[#6b5b52]">
                        Kripya apni kalai aage kijiye... 😊
                        <br />
                        <b>Ab Rakhi pyaar se baandhne ka khoobsurat pal hai. ❤️</b>
                      </p>

                      <div className="relative mx-auto mt-9 h-[25rem] w-full max-w-xl overflow-hidden rounded-[3rem] border border-[#eadaca] bg-gradient-to-b from-white to-[#fff7ee] shadow-2xl">
                        {/* soft spotlight */}
                        <motion.div
                          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
                          transition={{ duration: 2.5, repeat: Infinity }}
                          className="absolute left-1/2 top-8 h-40 w-40 -translate-x-1/2 rounded-full bg-[#f5d37c] blur-3xl"
                        />

                        {/* Brother */}
                        <div className="absolute left-1/2 top-6 -translate-x-1/2 text-7xl">
                          👦
                        </div>

                        {/* wrist / hand illustration */}
                        <div className="absolute bottom-8 left-1/2 h-32 w-[82%] -translate-x-1/2 rounded-[5rem] border-4 border-[#d8a86c] bg-gradient-to-r from-[#eeb98e] via-[#f6c9a2] to-[#e9ad80] shadow-inner">
                          <div className="absolute -right-5 top-1/2 h-24 w-20 -translate-y-1/2 rounded-r-[2.5rem] border-4 border-l-0 border-[#d8a86c] bg-[#efb98e]" />
                          <div className="absolute left-1/2 top-1/2 h-24 w-36 -translate-x-1/2 -translate-y-1/2 rounded-[2rem] border-2 border-[#e2a675]/40 bg-[#f3c29a]/50" />
                          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-7 whitespace-nowrap text-xs font-bold text-[#7a1f2b]">
                            🤲 Bhai Ki Kalai
                          </p>
                        </div>

                        {/* Rakhi resting above the wrist before animation */}
                        <motion.div
                          className="absolute left-1/2 z-20 flex h-24 w-24 -translate-x-1/2 items-center justify-center rounded-full border-4 border-[#d4a84f]/70 bg-white shadow-xl"
                          initial={{ top: "26%", scale: 0.8, opacity: 0.85 }}
                          animate={{ top: "57%", scale: 1, opacity: 1 }}
                          transition={{ duration: 0.9, ease: "easeInOut" }}
                        >
                          <img
                            src={selectedRakhi.image}
                            alt={selectedRakhi.name}
                            className="mx-auto h-32 w-32 object-contain"
                            loading="lazy"
                          />
                        </motion.div>

                        {/* Decorative thread guides */}
                        <div className="pointer-events-none absolute left-1/2 top-[58%] h-1 w-[62%] -translate-x-1/2 rounded-full bg-[#b1263a]/80" />
                        <div className="pointer-events-none absolute left-1/2 top-[58%] h-1 w-[62%] -translate-x-1/2 rotate-180 rounded-full bg-[#d4a84f]/60" />

                        <p className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-medium text-[#9b6b32]">
                          ❤️ Bas ek click... aur Rakhi pyaar se bandh jayegi
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          // IMPORTANT: play() is called directly inside the
                          // user's tap/click so mobile browsers allow audio.
                          const audio = audioRef.current;

                          if (audio) {
                            audio.currentTime = 0;
                            audio.volume = 1;

                            const playPromise = audio.play();

                            if (playPromise !== undefined) {
                              playPromise
                                .then(() => {
                                  setMusic(true);
                                })
                                .catch((error) => {
                                  console.error(
                                    "Rakhi music could not start:",
                                    error
                                  );
                                  setMusic(false);
                                });
                            }
                          }

                          setRitualStep("tying");

                          // Slow ceremony: music + animation stay together.
                          window.setTimeout(() => {
                            stopMusic();
                            next("rules");
                          }, 10500);
                        }}
                        className="mt-8 rounded-full bg-[#7a1f2b] px-10 py-4 text-base font-bold text-white shadow-xl transition hover:scale-105"
                      >
                        🪷 Rakhi Baandh Lijiye ❤️
                      </button>
                    </motion.div>
                  )}

                  {ritualStep === "tying" && (
                    <motion.div
                      key="tying"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full"
                    >
                      <h2 className="mt-4 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                        ❤️ Rakhi Baandhne Ka Pyaara Pal...
                      </h2>

                      <p className="mx-auto mt-3 max-w-xl text-[#6b5b52]">
                        Dheere se... pyaar se... ek khoobsurat yaad ki tarah. 🪷
                      </p>

                      {!music && (
                        <button
                          type="button"
                          onClick={() => {
                            const audio = audioRef.current;
                            if (!audio) return;
                            audio.currentTime = 0;
                            audio.volume = 1;
                            audio
                              .play()
                              .then(() => setMusic(true))
                              .catch((error) =>
                                console.error("Music playback failed:", error)
                              );
                          }}
                          className="mb-4 rounded-full border-2 border-[#7a1f2b] bg-white px-7 py-3 font-bold text-[#7a1f2b] shadow-md"
                        >
                          🎵 Play Rakhi Music
                        </button>
                      )}

                      <div className="relative mx-auto mt-8 h-[30rem] w-full max-w-xl overflow-hidden rounded-[3rem] border border-[#eadaca] bg-gradient-to-b from-white via-[#fff8ee] to-[#fde8d5] shadow-2xl">
                        {/* glow */}
                        <motion.div
                          initial={{ scale: 0.6, opacity: 0 }}
                          animate={{ scale: [0.8, 1.2, 0.95], opacity: [0, 0.7, 0.25] }}
                          transition={{ duration: 4.5 }}
                          className="absolute left-1/2 top-[36%] h-52 w-52 -translate-x-1/2 rounded-full bg-[#f5c96c] blur-3xl"
                        />

                        {/* smiling brother */}
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="absolute left-1/2 top-5 -translate-x-1/2 text-7xl"
                        >
                          👦
                        </motion.div>

                        {/* forearm */}
                        <div className="absolute bottom-10 left-1/2 h-36 w-[86%] -translate-x-1/2 rounded-[5rem] border-4 border-[#d8a86c] bg-gradient-to-r from-[#e9ad80] via-[#f6c9a2] to-[#eab184] shadow-inner">
                          <div className="absolute -right-5 top-1/2 h-28 w-24 -translate-y-1/2 rounded-r-[3rem] border-4 border-l-0 border-[#d8a86c] bg-[#efb98e]" />
                        </div>

                        {/* thread wrapping around wrist */}
                        <motion.div
                          initial={{ scaleX: 0, opacity: 0 }}
                          animate={{ scaleX: 1, opacity: 1 }}
                          transition={{ delay: 1.2, duration: 1.4 }}
                          className="absolute bottom-[7.2rem] left-1/2 h-5 w-[68%] -translate-x-1/2 rounded-full border-2 border-[#8e1c2d] bg-[#c52e45] shadow-md"
                        />

                        {/* second thread crossing */}
                        <motion.div
                          initial={{ width: 0, opacity: 0, rotate: -12 }}
                          animate={{ width: "62%", opacity: 1, rotate: 12 }}
                          transition={{ delay: 2.6, duration: 1.5 }}
                          className="absolute bottom-[7.4rem] left-1/2 h-3 -translate-x-1/2 rounded-full bg-[#e0ad42]"
                        />

                        {/* Rakhi moving into position */}
                        <motion.div
                          initial={{ top: "24%", scale: 0.65, rotate: -12, opacity: 0.9 }}
                          animate={{
                            top: "67%",
                            scale: [0.65, 1.05, 1],
                            rotate: [-12, 8, 0],
                            opacity: 1,
                          }}
                          transition={{
                            duration: 1.7,
                            ease: "easeInOut",
                            times: [0, 0.75, 1],
                          }}
                          className="absolute left-1/2 z-30 flex h-28 w-28 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#d4a84f] bg-white shadow-2xl"
                        >
                          <img
                            src={selectedRakhi.image}
                            alt={selectedRakhi.name}
                            className="mx-auto h-32 w-32 object-contain"
                            loading="lazy"
                          />
                        </motion.div>

                        {/* looping thread around the rakhi */}
                        <motion.div
                          initial={{ opacity: 0, rotate: -35, scale: 0.7 }}
                          animate={{
                            opacity: [0, 1, 1, 0],
                            rotate: [-35, 25, -20, 0],
                            scale: [0.7, 1.1, 1.05, 1],
                          }}
                          transition={{ delay: 3.4, duration: 2.4 }}
                          className="absolute bottom-[6.1rem] left-1/2 z-20 h-36 w-64 -translate-x-1/2 rounded-full border-8 border-[#b1263a]/80"
                        />

                        {/* knot */}
                        <motion.div
                          initial={{ opacity: 0, scale: 0, rotate: -25 }}
                          animate={{ opacity: 1, scale: [0, 1.25, 1], rotate: 0 }}
                          transition={{ delay: 5.8, duration: 1.2 }}
                          className="absolute bottom-[6rem] left-1/2 z-40 flex -translate-x-1/2 items-center justify-center"
                        >
                          <span className="text-5xl">🪢</span>
                        </motion.div>

                        {/* bow ends */}
                        <motion.div
                          initial={{ opacity: 0, scaleX: 0 }}
                          animate={{ opacity: 1, scaleX: 1 }}
                          transition={{ delay: 7.0, duration: 1.0 }}
                          className="absolute bottom-[4.7rem] left-1/2 z-30 h-12 w-52 -translate-x-1/2"
                        >
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-12 text-4xl">
                            🎀
                          </span>
                          <span className="absolute right-0 top-1/2 -translate-y-1/2 rotate-12 text-4xl">
                            🎀
                          </span>
                        </motion.div>

                        {/* celebration */}
                        {["✨", "🌸", "❤️", "✨", "🌺"].map((item, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                            animate={{
                              opacity: [0, 1, 0],
                              scale: [0.4, 1.2, 0.6],
                              x: (i - 2) * 70,
                              y: -90 - Math.abs(i - 2) * 20,
                            }}
                            transition={{ delay: 8.0 + i * 0.18, duration: 1.6 }}
                            className="absolute left-1/2 top-[58%] z-50 text-3xl"
                          >
                            {item}
                          </motion.span>
                        ))}

                        <motion.p
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 8.7, duration: 1 }}
                          className="absolute bottom-5 left-1/2 w-[88%] -translate-x-1/2 text-center text-base font-bold leading-6 text-[#7a1f2b] md:text-lg"
                        >
                          🪷 Rakhi bandh gayi... aur dil aur bhi kareeb aa gaye. ❤️
                          <br />
                          <span className="text-sm font-semibold text-[#9b6b32]">
                            Rakhi Accepted! ✨
                          </span>
                        </motion.p>
                      </div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 4.1 }}
                        className="mt-7 text-sm font-medium text-[#9b6b32]"
                      >
                        ✨ Ek rishta kalai par... aur ek hamesha ke liye dil mein. ❤️
                      </motion.div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </motion.section>
          )}

          {/* RULES */}
          {screen === "rules" && (
            <motion.section
              key="rules"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="min-h-screen px-6 py-12"
            >
              <div className="mx-auto max-w-2xl">
                <div className="text-center">
                  <div className="text-6xl">😄</div>
                  <h2 className="mt-4 text-4xl font-bold text-[#7a1f2b]">
                    Kuch Pyaare Se Vaade Hain ❤️
                  </h2>
                  <p className="mt-3 text-[#6b5b52]">
                    Rakhi bandh gayi hai...
                    <br />
                    ab kuch pyaare se vaade bhi nibhaane honge. ✨
                  </p>
                </div>

                <div className="mt-10 space-y-4">
                  {[
                    "📱 Behen ka call hamesha pyaar se uthana.",
                    "🤫 Behen ke raaz hamesha sambhal kar rakhna.",
                    "❤️ Zarurat ke waqt hamesha saath dena.",
                    "❤️ Chhoti-moti nok-jhok chalegi, par rishta hamesha bana rahega.",
                    "🍕 Khushiyan aur khaana dono baantna hai.",
                    "🎁 Rakhi ka Shagun pyaar se dena hoga.",
                    "♾️ Ye rishta hamesha ke liye hai.",
                  ].map((rule, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-[#eadaca] bg-white p-5 shadow-sm"
                    >
                      <b>Rule #{index + 1}</b>
                      <p className="mt-1 text-[#5e5048]">{rule}</p>
                    </div>
                  ))}
                </div>

                <label className="mt-8 flex cursor-pointer items-center gap-3 rounded-2xl bg-[#fff0e5] p-5">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAgreed(e.target.checked)}
                    className="h-5 w-5"
                  />
                  <span className="text-sm font-medium">
                    Maine saare vaade padh liye hain aur dil se maan liye hain. ❤️
                  </span>
                </label>

                <button
                  disabled={!agreed}
                  onClick={() => next("accepted")}
                  className="mt-6 w-full rounded-2xl bg-[#7a1f2b] px-6 py-5 text-lg font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ❤️ Rakhi Dil Se Accept Hai
                </button>
              </div>
            </motion.section>
          )}

          {/* ACCEPTED - BROTHER SIDE */}
          {screen === "accepted" && (
            <motion.section
              key="accepted"
              initial={{ opacity: 0, scale: 0.75 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex min-h-screen flex-col items-center justify-center px-6 py-16 pb-24 text-center"
            >
              <motion.div
                animate={{ scale: [1, 1.12, 1] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="text-7xl"
              >
                ✨
              </motion.div>

              <h2 className="mt-6 text-5xl font-bold text-[#7a1f2b]">
                Rakhi Pyaar Se Accepted! ❤️
              </h2>

              <p className="mt-5 max-w-xl text-lg leading-8 text-[#5e5048]">
                {sister} ki Rakhi {brother} ne khushi se accept kar li hai. 💕
                <br />
                <b>Ab Bhai ki taraf se ek pyaara sa surprise banta hai! 🎁</b>
              </p>

              <div className="mt-8 text-6xl">🪷</div>

              <p className="mt-5 max-w-lg text-[#6b5b52]">
                Rakhi pyaar se accept ho gayi...
                <br />
                ab pyaar bhare Shagun ki baari hai. ❤️
              </p>

              <button
                type="button"
                onClick={() => next("shagun")}
                className="mt-9 rounded-full bg-[#7a1f2b] px-10 py-4 font-bold text-white shadow-lg transition hover:scale-105"
              >
                Ab Meri Baari Hai 🎁
              </button>
            </motion.section>
          )}

          {/* SHAGUN */}
          {screen === "shagun" && (
            <motion.section
              key="shagun"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-xl text-center">
                <div className="text-7xl">🎁</div>

                <h2 className="mt-6 text-4xl font-bold text-[#7a1f2b] md:text-5xl">
                  Ab Pyaar Bhara Shagun Dene Ka Pal... 🎁
                </h2>

                <p className="mt-5 leading-8 text-[#6b5b52]">
                  Rakhi {sister} ne pyaar se bheji hai... ❤️
                  <br />
                  Ab Bhai ki taraf se <b>Shagun toh banta hai!</b> 🎁
                  <br />
                  Aur kuch pyaari purani yaadein bhi taza kar lete hain...
                  <br />
                  <b>Bachpan ki chhoti-chhoti shararatein aaj bhi muskaan de jaati hain. ❤️</b>
                  <br />
                  Aaj us pyaar ki ek chhoti si nishaani bhi de dijiye. 😊
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-[#7a1f2b]">
                    🥹 Pehle Kuch Pyaari Yaadein Taza Kar Lein...
                  </h3>

                  <div className="mt-5 grid gap-3 text-left sm:grid-cols-2">
                    {[
                      ["🍫", "Chocolate", "Meri chocolate ka aadha hissa hamesha aapka kaise ho jaata tha? ❤️"],
                      ["📺", "TV Remote", "TV remote ke liye ladai... aur phir dono bilkul masoom. 😄"],
                      ["🛏️", "Room Ki Ladai", "Ek room, do log aur na jaane kitni pyaari yaadein. ❤️"],
                      ["🤫", "Secrets", "Tum mere raaz jaante ho... isliye ye rishta aur bhi khaas hai. 🤍"],
                      ["👩‍👧", "Mummy Ki Daant", "Galti kisi ki bhi ho... daant aksar dono ko padti thi. 😄"],
                      ["🎒", "Bachpan", "Mera samaan aapka aur aapka samaan... yaad hain woh purane din? 😄"],
                    ].map(([emoji, title, text]) => (
                      <motion.div
                        key={title}
                        whileHover={{ y: -3 }}
                        className="rounded-2xl border border-[#eadaca] bg-white p-4 shadow-sm"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{emoji}</span>
                          <span className="font-bold text-[#7a1f2b]">{title}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-[#6b5b52]">
                          {text}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mt-10">
                  <h3 className="text-xl font-bold text-[#7a1f2b]">
                    🎁 Ab Batayein...
                  </h3>
                  <p className="mt-2 text-[#6b5b52]">
                    Itni purani yaadon ke baad{" "}
                    <b>Shagun kitna banta hai? ❤️</b>
                  </p>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
                  {[
                    ["₹501", "Pyaari si shuruaat hai ❤️"],
                    ["₹1,001", "Dil khush kar diya ❤️"],
                    ["₹2,001", "Bachpan ki yaadon ka pyaara sa Shagun 👑❤️"],
                    ["❤️ Apni Marzi", "Amount se zyada pyaar maayne rakhta hai ❤️"],
                  ].map(([amount, caption]) => (
                    <motion.button
                      key={amount}
                      whileHover={{ y: -3 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShagun(amount)}
                      className={`rounded-2xl border-2 bg-white p-5 text-center transition ${shagun === amount
                        ? "border-[#d4a84f] bg-[#fff7e6] shadow-md"
                        : "border-[#eadaca]"
                        }`}
                    >
                      <div className="font-bold">{amount}</div>
                      <div className="mt-2 text-xs leading-5 text-[#7b6a60]">
                        {caption}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {shagun && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-5 rounded-2xl bg-[#fff0e5] p-4 text-sm font-medium text-[#7a1f2b]"
                  >
                    {shagun === "₹501" &&
                      "Bahut pyaara Shagun — dil khush ho gaya. ❤️"}
                    {shagun === "₹1,001" &&
                      "Aaj phir yaad aa gaya ki mera Bhai sach mein bahut khaas hai. 😌❤️"}
                    {shagun === "₹2,001" &&
                      "Dil khush kar diya! 👑❤️"}
                    {shagun === "❤️ Apni Marzi" &&
                      "Amount se zyada pyaar maayne rakhta hai. ❤️"}
                  </motion.div>
                )}

                <div className="mt-9">
                  <h3 className="text-xl font-bold text-[#7a1f2b]">
                    💌 Ek Baat Aur...
                  </h3>
                  <p className="mt-2 text-[#6b5b52]">
                    Jo baat kabhi keh nahi paaye, <b>aaj dil se keh dijiye.</b>
                    <br />
                    Ya phir woh ek line likhiye jo sirf hum dono samajhte hain. ❤️
                  </p>
                </div>

                <textarea
                  value={brotherMessage}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setBrotherMessage(e.target.value)}
                  placeholder="“Yaad hai jab hum dono ne mummy se...” ❤️"
                  className="mt-5 h-32 w-full resize-none rounded-2xl border border-[#e2cdbb] bg-white p-5 outline-none focus:border-[#7a1f2b] focus:ring-2 focus:ring-[#7a1f2b]/20"
                />

                <p className="mt-4 text-sm italic text-[#8b7b70]">
                  “Bachpan ki chhoti-chhoti shararatein...
                  <br />
                  aaj bhi dil mein utni hi pyaari hain.” ❤️
                </p>

                <button
                  disabled={!shagun}
                  onClick={() => next("agreement")}
                  className="mt-7 w-full rounded-2xl bg-[#7a1f2b] px-6 py-4 font-bold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Shagun Aur Message Share Kijiye ❤️
                </button>
              </div>
            </motion.section>
          )}

          {/* AGREEMENT - BROTHER SIDE */}
          {screen === "agreement" && (
            <motion.section
              key="agreement"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-screen items-center justify-center px-6 py-16 pb-24"
            >
              <div className="w-full max-w-2xl rounded-[2rem] border-2 border-[#d4a84f] bg-white p-8 text-center shadow-2xl md:p-12">
                {/* ONLY this inner card is converted to the shareable PNG.
                  Buttons, link, status text and sharing instructions are
                  deliberately outside this ref. */}
                <div
                  ref={agreementCardRef}
                  className="pb-10 md:pb-14"
                >
                  <div className="text-6xl">🤝</div>

                  <h2 className="mt-5 text-4xl font-bold text-[#7a1f2b]">
                    Sibling Agreement ❤️
                  </h2>

                  <p className="mt-2 text-lg text-[#9b6b32]">
                    Bhai-Behen Ka Lifetime Agreement
                  </p>

                  <div className="my-8 flex items-center justify-center gap-4 text-2xl font-bold">
                    <span>{sister}</span>
                    <span>❤️</span>
                    <span>{brother}</span>
                  </div>

                  <div className="grid gap-3 text-left">
                    <div className="rounded-xl bg-[#fff8ef] p-4">
                      🪷 Rakhi — <b>Accepted ✓</b>
                    </div>
                    <div className="rounded-xl bg-[#fff8ef] p-4">
                      🎁 Shagun — <b>{shagun}</b>
                    </div>
                    <div className="rounded-xl bg-[#fff8ef] p-4 text-left">
                      <div className="font-semibold text-[#7a1f2b]">
                        💌 Bhai ka Message
                      </div>
                      <div className="mt-3 rounded-xl border border-[#eadaca] bg-white p-4 text-base leading-7 text-[#5e5048]">
                        “{brotherMessage.trim() || "Dil ki baat shayad poori tarah keh nahi paaya... par pyaar hamesha rahega. ❤️"}”
                      </div>
                    </div>
                    <div className="rounded-xl bg-[#fff8ef] p-4">
                      ♾️ Validity — <b>Lifetime</b>
                    </div>
                  </div>

                  <div className="my-10 border-y border-[#eadaca] py-8">
                    <p className="text-lg italic leading-8 text-[#5e5048]">
                      “Rakhi ek din ki hoti hai...
                      <br />
                      par bhai-behen ka rishta lifetime ka hota hai.” ❤️
                    </p>
                  </div>

                  <div className="mt-9 text-3xl">🪷❤️♾️</div>

                  <p className="mt-4 text-sm text-[#8b7b70]">
                    With all my ❤️, for a bond that lasts forever. 🪷
                  </p>
                </div>

                {/* UI controls stay outside the image area */}
                <div className="mt-8 border-t border-[#eadaca] pt-7">
                  <h3 className="text-2xl font-bold text-[#7a1f2b]">
                    Ab Ye Agreement Sister Tak Pyaar Se Pahunchaiye 💌
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-[#6b5b52]">
                    {sister} ko WhatsApp par completed Sibling Agreement bhejiye.
                    <br />
                    Ye khaas pal aap dono ke paas hamesha rahega. ❤️
                  </p>

                  <div className="mt-7 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={async () => {
                        const link = makeAgreementLink(
                          brother,
                          sister,
                          shagun,
                          brotherMessage
                        );
                        setAgreementLink(link);

                        const text =
                          `🤝 Our Sibling Agreement is Official! ❤️\n\n` +
                          `${sister} ❤️ ${brother}\n\n` +
                          `🪷 Rakhi — Accepted ✓\n` +
                          `🎁 Shagun — ${shagun}\n` +
                          `💌 Bhai ka Message — ${brotherMessage || "Dil se, Bhai ❤️"}\n` +
                          `♾️ Validity — Lifetime\n\n` +
                          `“Rakhi ek din ki hoti hai... par bhai-behen ka rishta lifetime ka hota hai.” ❤️\n\n` +
                          `Happy Raksha Bandhan! 🪷❤️\n\n` +
                          `Open your completed Sibling Agreement:\n${link}`;

                        window.open(
                          `https://wa.me/?text=${encodeURIComponent(text)}`,
                          "_blank",
                          "noopener,noreferrer"
                        );

                        await generateAgreementImage();
                      }}
                      className="rounded-2xl bg-[#25D366] px-5 py-4 font-bold text-white shadow-lg transition hover:-translate-y-1"
                    >
                      💬 WhatsApp Share + Agreement Image
                    </button>

                    <button
                      type="button"
                      onClick={async () => {
                        const link = makeAgreementLink(
                          brother,
                          sister,
                          shagun,
                          brotherMessage
                        );
                        setAgreementLink(link);

                        try {
                          await navigator.clipboard.writeText(link);
                          setAgreementCopied(true);
                          setTimeout(() => setAgreementCopied(false), 2200);
                        } catch {
                          window.prompt("Copy this Agreement link:", link);
                        }
                      }}
                      className="rounded-2xl border-2 border-[#7a1f2b] bg-white px-5 py-4 font-bold text-[#7a1f2b] transition hover:-translate-y-1"
                    >
                      {agreementCopied
                        ? "✅ Agreement Link Copied!"
                        : "🔗 Agreement Link Copy Kijiye"}
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={generateAgreementImage}
                    disabled={imageGenerating}
                    className="mt-4 w-full rounded-2xl border border-[#d4a84f] bg-[#fff8ef] px-5 py-3 font-semibold text-[#7a1f2b] transition hover:bg-[#fff0df] disabled:opacity-60"
                  >
                    {imageGenerating
                      ? "🖼️ Agreement Image Taiyaar Ho Rahi Hai..."
                      : imageGenerated
                        ? "✅ Agreement Image Generated"
                        : "🖼️ Agreement Image Banaiye"}
                  </button>

                  {agreementLink && (
                    <div className="mt-5 rounded-xl bg-[#fff8ef] p-3 text-left">
                      <p className="break-all text-xs leading-5 text-[#6b5b52]">
                        {agreementLink}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.section>
          )}

        </AnimatePresence>
      </main>
      <footer className="border-t border-[#f0cfc5] bg-[#fff1eb] px-4 py-4 text-center">
        <p className="text-xs tracking-wide text-[#8b7b70]">
          Made with <span className="text-[#7a1f2b]">❤️</span> by{" "}
          <span className="font-semibold text-[#7a1f2b]">
            Agrim Garg
          </span>{" "}
          <span aria-hidden="true">🪷</span>
        </p>
      </footer>
    </>
  );
}
