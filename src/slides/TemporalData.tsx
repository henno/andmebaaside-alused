import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid, miks tavaline andmebaas "unustab" ajaloo ja kuidas temporaalseid andmeid hallata.

📌 PÕHIPROBLEEM - alusta siit:

Tavaline UPDATE kustutab vana väärtuse jäädavalt:

  UPDATE tooted SET hind = 89 WHERE id = 1;
  -- Vana hind (99€) on IGAVESEKS kadunud!

Küsimus õpilastele: "Mis juhtub, kui klient esitab reklamatsiooni ja küsib: millise hinnaga ma ostsin?"

📊 LAHENDUS: Ajaloo säilitamine eraldi tabelis

1️⃣ KEHTIVUSAEG (Valid Time) - KÕIGE OLULISEM MÕISTA:

See näitab, MILLAL andmed PÄRISMAAILMAS kehtivad.

NÄIDE - Hinnamuutus:
• Toode maksab PRAEGU 99€
• Homme hakkab maksma 89€ (allahindlus)

Tabel "hind_ajalugu":
  toode_id | hind  | kehtiv_alates | kehtiv_kuni
  ---------|-------|---------------|-------------
  1        | 99.00 | 2024-01-01    | 2024-12-15
  1        | 89.00 | 2024-12-15    | NULL

kehtiv_kuni = NULL tähendab "kehtib praegu ja edaspidi"

SQL päring "Mis oli hind 1. juunil?":
  SELECT hind FROM hind_ajalugu
  WHERE toode_id = 1
    AND kehtiv_alates <= '2024-06-01'
    AND (kehtiv_kuni IS NULL OR kehtiv_kuni > '2024-06-01');

2️⃣ TRANSAKTSIOONIAEG (Transaction Time):

See näitab, MILLAL andmed ANDMEBAASI sisestati/muudeti.

NÄIDE - Vigane sisestus:
• 1. detsembril sisestasime hinna 99€
• 10. detsembril avastasime vea - pidi olema 89€
• Parandasime, AGA tahame teada: "Mis oli andmebaasis 5. detsembril?"

MySQL-is pole automaatset tuge, lisame käsitsi:
  sisestatud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  muudetud TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

3️⃣ BITEMPORAALNE = mõlemad koos:

Vajad, kui on oluline teada:
• Mis TEGELIKULT kehtis mingil hetkel (kehtivusaeg)
• Mida ME TEADSIME mingil hetkel (transaktsiooniaeg)

NÄIDE: Pangalaen intressimääraga
• 1. märtsil sisestasime: intress 5%, kehtib 1. aprillist
• 15. märtsil avastasime vea: tegelikult 4.8%
• Auditi küsimus: "Mida teadsite 10. märtsil?"
  → Vastus: Arvasime, et intress on 5%

💡 PRAKTILINE TEOSTUS MySQL-is:

CREATE TABLE toote_hind_ajalugu (
  id INT AUTO_INCREMENT PRIMARY KEY,
  toode_id INT NOT NULL,
  hind DECIMAL(10,2) NOT NULL,
  -- Kehtivusaeg (pärismaailm)
  kehtiv_alates DATE NOT NULL,
  kehtiv_kuni DATE,
  -- Transaktsiooniaeg (andmebaas)
  sisestatud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (toode_id, kehtiv_alates)
);

Hinna lisamine (uus hind alates homsest):
  -- Lõpeta praegune hind
  UPDATE toote_hind_ajalugu
  SET kehtiv_kuni = CURDATE()
  WHERE toode_id = 1 AND kehtiv_kuni IS NULL;

  -- Lisa uus hind
  INSERT INTO toote_hind_ajalugu (toode_id, hind, kehtiv_alates)
  VALUES (1, 89.00, CURDATE() + INTERVAL 1 DAY);

❓ KÜSIMUSED ÕPILASTELE:

• "Miks ei piisa lihtsalt 'muudetud' veerust?"
  → Näitab ainult VIIMAST muudatust, mitte kogu ajalugu

• "Kas KÕIK andmed vajavad ajalugu?"
  → Ei! Ainult äriliselt olulised: hinnad, lepingud, palgad, audit

• "Mis vahe on DELETE ja kehtiv_kuni seadmisel?"
  → DELETE kustutab jäädavalt; kehtiv_kuni säilitab ajaloo

💼 KUS KASUTATAKSE:
• Pangad - intressimäärad, kontosaldod
• E-pood - hinnad, kampaaniad
• Personal - palgad, ametikohad
• Tervishoid - diagnoosid, retseptid
• Riigiasutused - seadused, määrused`;

export default function TemporalData() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedTimezone, setSelectedTimezone] = useState("Europe/Tallinn");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const timezones = [
    { id: "Europe/Tallinn", name: "Tallinn", offset: "+02:00" },
    { id: "UTC", name: "UTC", offset: "+00:00" },
    { id: "America/New_York", name: "New York", offset: "-05:00" },
    { id: "Asia/Tokyo", name: "Tokyo", offset: "+09:00" },
  ];

  const temporalConcepts = [
    {
      title: "Transaktsiooniaeg",
      icon: "🔄",
      description: "Millal andmed andmebaasi salvestati",
      example: `sisestatud TIMESTAMP
  DEFAULT CURRENT_TIMESTAMP`,
      color: "#22c55e",
    },
    {
      title: "Kehtivusaeg",
      icon: "📆",
      description: "Millal andmed tegelikkuses kehtivad",
      example: `kehtiv_alates DATE,
kehtiv_kuni DATE`,
      color: "#3b82f6",
    },
    {
      title: "Bitemporaalne",
      icon: "⏳",
      description: "Kombineerib mõlemad: täielik ajalugu",
      example: `kehtiv_alates + kehtiv_kuni
+ sisestatud + muudetud`,
      color: "#f59e0b",
    },
  ];

  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "40px",
          textAlign: "center",
        }}
      >
        Ajast Sõltuvad Andmed
      </motion.h2>

      {/* Live clock */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "25px",
          borderRadius: "20px",
          background: colors.backgroundLight,
          border: `1px solid ${colors.surface}`,
        }}
      >
        <div style={{ fontSize: "0.9rem", color: colors.textMuted, marginBottom: "10px" }}>
          Praegune aeg ({selectedTimezone})
        </div>
        <motion.div
          key={currentTime.getSeconds()}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          style={{
            fontSize: "3rem",
            fontWeight: 700,
            fontFamily: "'Fira Code', monospace",
            background: colors.gradient3,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {currentTime.toLocaleString("et-EE", {
            timeZone: selectedTimezone,
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </motion.div>
        <div style={{ marginTop: "15px", display: "flex", justifyContent: "center", gap: "10px" }}>
          {timezones.map((tz) => (
            <motion.button
              key={tz.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedTimezone(tz.id)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: selectedTimezone === tz.id ? colors.primary : colors.surface,
                color: colors.text,
                fontSize: "0.85rem",
                cursor: "pointer",
                transition: "background 0.3s",
              }}
            >
              {tz.name} ({tz.offset})
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Temporal concepts */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "25px", marginBottom: "40px" }}>
        {temporalConcepts.map((concept, index) => (
          <motion.div
            key={concept.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ y: -5 }}
            style={{
              padding: "25px",
              borderRadius: "20px",
              background: colors.backgroundLight,
              border: `2px solid ${concept.color}40`,
            }}
          >
            <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "15px" }}>{concept.icon}</span>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 600, marginBottom: "10px", color: concept.color }}>
              {concept.title}
            </h3>
            <p style={{ color: colors.textMuted, fontSize: "0.9rem", marginBottom: "15px", lineHeight: 1.5 }}>
              {concept.description}
            </p>
            <code
              style={{
                display: "block",
                padding: "10px",
                borderRadius: "8px",
                background: colors.background,
                fontSize: "0.8rem",
                color: colors.accent,
              }}
            >
              {concept.example}
            </code>
          </motion.div>
        ))}
      </div>

      {/* SQL Example */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          padding: "25px",
          borderRadius: "20px",
          background: "#1a1a2e",
          border: `1px solid ${colors.surface}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
          <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27ca40" }} />
          <span style={{ marginLeft: "10px", color: colors.textMuted, fontSize: "0.85rem" }}>
            Hinnaajalooga tabel (MySQL)
          </span>
        </div>
        <SQLHighlighter
          code={`-- Tabel hindade ajalooga
CREATE TABLE toote_hind (
  id INT AUTO_INCREMENT PRIMARY KEY,
  toode_id INT NOT NULL,
  hind DECIMAL(10,2) NOT NULL,
  kehtiv_alates DATE NOT NULL,
  kehtiv_kuni DATE,               -- NULL = kehtib praegu
  sisestatud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (toode_id, kehtiv_alates)
);

-- Päring: Mis oli toote hind kindlal kuupäeval?
SELECT hind FROM toote_hind
WHERE toode_id = 1
  AND kehtiv_alates <= '2024-06-15'
  AND (kehtiv_kuni IS NULL OR kehtiv_kuni > '2024-06-15');`}
          fontSize="0.8rem"
        />
      </motion.div>
    </div>
  );
}
