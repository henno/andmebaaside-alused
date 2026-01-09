import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased rakendaksid praktiliselt kõiki kursuse jooksul õpitud teemasid.

📌 Ülesande ülevaade:

Õpilased disainivad andmebaasi RAAMATUKOGU süsteemile, mis hõlmab:
• Tabelite loomist õigete andmetüüpidega
• Seoste ja piirangute määramist
• Indeksite loomist jõudluse optimeerimiseks
• Temporaalsete andmete haldamist (laenutusajalugu)

🎯 Soovitused läbiviimiseks:

1️⃣ GRUPI- VÕI INDIVIDUAALTÖÖ (15-20 min):
   • Jagage õpilased 3-4 liikmelistesse gruppidesse
   • Iga grupp lahendab ülesande iseseisvalt
   • Pärast arutage lahendusi klassiga

2️⃣ SAMM-SAMMULT:

   A) Tabelite disain (5 min):
      • Millised tabelid on vajalikud?
      • Millised veerud igas tabelis?
      • Millised andmetüübid?

   B) Seosed ja piirangud (5 min):
      • Mis on primaarvõtmed?
      • Kus on välisvõtmed?
      • Milliseid CHECK piiranguid vaja?

   C) Indeksid (3 min):
      • Milliseid päringuid tehakse kõige rohkem?
      • Millised indeksid kiirendaksid neid?

   D) Temporaalsus (5 min):
      • Kuidas jälgida laenutuste ajalugu?
      • Mis juhtub, kui raamat tagastatakse hilja?

3️⃣ NÄIDISLAHENDUSE LÄBIARUTELU:
   • Klõpsa "Näita lahendust" nupul
   • Arutage iga otsuse põhjendusi
   • Rõhuta: pole ainuõiget lahendust!

💡 HINDAMISKRITEERIUMID:
• Korrektsed andmetüübid valitud
• Seosed loogilised ja normaliseeritud
• Indeksid mõistlikud
• Temporaalsus arvestatud`;

const exerciseTasks = [
  {
    number: 1,
    title: "Planeerimine",
    description: "Raamatukogu süsteemi jaoks on vaja andmebaasi. Mõtle läbi, millised tabelid on vajalikud põhifunktsionaalsuse tagamiseks.",
    hint: "Mõtle: mida raamatukogu teeb? Hoiab raamatuid, omab lugejaid/liikmeid, ja laenutab raamatuid. Iga neist vajab oma tabelit.",
    solution: `-- Raamatukogu andmebaasi jaoks on vaja 3 tabelit:

-- 1. RAAMATUD (books)
--    Hoiab infot kõigi raamatukogus olevate
--    raamatute kohta

-- 2. LUGEJAD (readers/members)
--    Hoiab infot registreeritud lugejate kohta,
--    kes saavad raamatuid laenutada

-- 3. LAENUTUSED (loans)
--    Seob raamatud ja lugejad kokku,
--    jälgib kes mis raamatu laenutas
--    ja millal see tagastada tuleb`
  },
  {
    number: 2,
    title: "Tabel: RAAMATUD",
    description: "Loo esimene ja peamine tabel RAAMATUD, mis hoiab infot kõigi raamatukogu raamatute kohta.",
    hint: "Raamatul peaks olema: unikaalne identifikaator (ISBN), pealkiri, autor, väljaandmisaasta, žanr. Mõtle ka: mitu eksemplari võib ühest raamatust olla?",
    solution: `CREATE TABLE raamatud (
  -- ISBN on rahvusvaheline standardnumber
  -- ja sobib primaarvõtmeks
  isbn VARCHAR(13) PRIMARY KEY,

  -- Põhiandmed
  pealkiri VARCHAR(255) NOT NULL,
  autor VARCHAR(200) NOT NULL,
  valjaandmisaasta SMALLINT,
  zanr VARCHAR(50),

  -- Mitu eksemplari on raamatukogus
  eksemplare INT DEFAULT 1
    CHECK (eksemplare >= 0),

  -- Millal raamat lisati
  lisatud DATE DEFAULT (CURRENT_DATE)
);

-- Näide andmete sisestamisest:
INSERT INTO raamatud (isbn, pealkiri, autor, valjaandmisaasta, zanr)
VALUES ('9789949331234', 'Tõde ja õigus', 'A. H. Tammsaare', 1926, 'Romaan');`
  },
  {
    number: 3,
    title: "Tabel: LUGEJAD",
    description: "Loo teine tabel LUGEJAD, mis hoiab infot raamatukogu registreeritud liikmete kohta.",
    hint: "Lugejal peaks olema: unikaalne ID, nimi, kontaktandmed (email, telefon). Mõtle ka: kuidas vältida duplikaate?",
    solution: `CREATE TABLE lugejad (
  -- Automaatne ID iga uue lugeja jaoks
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Isikuandmed
  eesnimi VARCHAR(100) NOT NULL,
  perenimi VARCHAR(100) NOT NULL,

  -- Kontaktandmed (email peab olema unikaalne!)
  email VARCHAR(255) UNIQUE NOT NULL,
  telefon VARCHAR(20),

  -- Millal liitus raamatukoguga
  registreeritud DATE DEFAULT (CURRENT_DATE),

  -- Kas konto on aktiivne
  aktiivne BOOLEAN DEFAULT TRUE
);

-- Näide andmete sisestamisest:
INSERT INTO lugejad (eesnimi, perenimi, email, telefon)
VALUES ('Mari', 'Maasikas', 'mari@email.ee', '5551234');`
  },
  {
    number: 4,
    title: "Tabel: LAENUTUSED",
    description: "Loo kolmas tabel LAENUTUSED, mis seob raamatud ja lugejad ning jälgib laenutuste ajalugu.",
    hint: "Laenutuses peab olema: viide lugejale, viide raamatule, laenutamise kuupäev, tagastamistähtaeg. Mõtle: kuidas märkida tagastatud raamatut?",
    solution: `CREATE TABLE laenutused (
  id INT AUTO_INCREMENT PRIMARY KEY,

  -- Viited teistele tabelitele (välisvõtmed)
  lugeja_id INT NOT NULL,
  raamat_isbn VARCHAR(13) NOT NULL,

  -- Temporaalsed andmed
  laenutatud DATE NOT NULL DEFAULT (CURRENT_DATE),
  tagastama DATE NOT NULL,  -- Tähtaeg
  tagastatud DATE,  -- NULL = pole tagastatud

  -- Võimalik trahv hilinemisel
  trahv DECIMAL(5,2) DEFAULT 0,

  -- Välisvõtmed
  FOREIGN KEY (lugeja_id) REFERENCES lugejad(id),
  FOREIGN KEY (raamat_isbn) REFERENCES raamatud(isbn),

  -- Sama lugeja ei saa sama raamatut
  -- samal ajal mitu korda laenutada
  UNIQUE KEY unikaalne_laenutus (lugeja_id, raamat_isbn, laenutatud)
);

-- Näide: Mari laenutab raamatu 2 nädalaks
INSERT INTO laenutused (lugeja_id, raamat_isbn, tagastama)
VALUES (1, '9789949331234', DATE_ADD(CURRENT_DATE, INTERVAL 14 DAY));`
  },
  {
    number: 5,
    title: "Indeksid",
    description: "Loo indeksid, mis kiirendavad kõige levinumaid päringuid raamatukogu süsteemis.",
    hint: "Mõtle: milliseid otsinguid tehakse kõige rohkem? Raamatu otsing pealkirja järgi, tagastamata raamatute nimekiri, lugeja otsing...",
    solution: `-- Otsing raamatu pealkirja järgi
CREATE INDEX idx_raamatud_pealkiri
  ON raamatud(pealkiri);

-- Otsing autori järgi
CREATE INDEX idx_raamatud_autor
  ON raamatud(autor);

-- Otsing žanri järgi
CREATE INDEX idx_raamatud_zanr
  ON raamatud(zanr);

-- Tagastamata laenutuste otsing
-- Indekseerime tagastama ja tagastatud veerud
CREATE INDEX idx_laenutused_tagastama
  ON laenutused(tagastama, tagastatud);

-- Lugeja laenutuste ajalugu
CREATE INDEX idx_laenutused_lugeja
  ON laenutused(lugeja_id, laenutatud);`
  },
  {
    number: 6,
    title: "Päringud",
    description: "Kirjuta SQL päringud igapäevaste toimingute jaoks: tagastamata raamatud, hilinenud tagastused, populaarsed raamatud.",
    hint: "Kasuta JOIN-e, et ühendada tabeleid. WHERE tagastatud IS NULL leiab tagastamata raamatud.",
    solution: `-- 1. Kõik tagastamata raamatud
SELECT r.pealkiri, r.autor,
       CONCAT(l.eesnimi, ' ', l.perenimi) AS lugeja,
       l.email, la.tagastama
FROM laenutused la
JOIN raamatud r ON la.raamat_isbn = r.isbn
JOIN lugejad l ON la.lugeja_id = l.id
WHERE la.tagastatud IS NULL
ORDER BY la.tagastama;

-- 2. Hilinenud tagastused koos trahviga
SELECT l.eesnimi, l.perenimi, r.pealkiri,
       la.tagastama,
       DATEDIFF(CURRENT_DATE, la.tagastama) AS paevi_hilja,
       DATEDIFF(CURRENT_DATE, la.tagastama) * 0.10 AS trahv
FROM laenutused la
JOIN lugejad l ON la.lugeja_id = l.id
JOIN raamatud r ON la.raamat_isbn = r.isbn
WHERE la.tagastatud IS NULL
  AND la.tagastama < CURRENT_DATE;

-- 3. Top 5 enim laenutatud raamatut
SELECT r.pealkiri, r.autor, COUNT(*) AS kordi
FROM laenutused la
JOIN raamatud r ON la.raamat_isbn = r.isbn
GROUP BY r.isbn, r.pealkiri, r.autor
ORDER BY kordi DESC
LIMIT 5;`
  }
];

export default function PracticalExercise() {
  const [activeTask, setActiveTask] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [planningRevealed, setPlanningRevealed] = useState(false);

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Praktiline ülesanne
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginBottom: "30px",
          fontSize: "1.1rem",
        }}
      >
        Disaini andmebaas raamatukogu süsteemile
      </motion.p>

      {/* Task tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >
        {exerciseTasks.map((task, index) => {
          // Blur table names for LUGEJAD and LAENUTUSED until planning is revealed
          const shouldBlurName = !planningRevealed && (index === 2 || index === 3);
          const titleParts = task.title.split(": ");

          return (
            <motion.button
              key={task.number}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setActiveTask(index);
                setShowSolution(false);
              }}
              style={{
                padding: "12px 20px",
                borderRadius: "12px",
                border: "none",
                background: activeTask === index ? colors.primary : colors.backgroundLight,
                color: colors.text,
                fontSize: "0.9rem",
                fontWeight: activeTask === index ? 600 : 400,
                cursor: "pointer",
                transition: "all 0.3s",
              }}
            >
              {shouldBlurName && titleParts.length === 2 ? (
                <>
                  {task.number}. {titleParts[0]}:{" "}
                  <span style={{ filter: "blur(4px)", userSelect: "none" }}>{titleParts[1]}</span>
                </>
              ) : (
                <>{task.number}. {task.title}</>
              )}
            </motion.button>
          );
        })}
      </motion.div>

      {/* Task content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTask}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "25px",
          }}
        >
          {/* Left: Task description */}
          <div
            style={{
              padding: "25px",
              borderRadius: "20px",
              background: colors.backgroundLight,
              border: `1px solid ${colors.surface}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: colors.primary,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {exerciseTasks[activeTask].number}
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 600 }}>
                {(() => {
                  const shouldBlur = !planningRevealed && (activeTask === 2 || activeTask === 3);
                  const parts = exerciseTasks[activeTask].title.split(": ");
                  if (shouldBlur && parts.length === 2) {
                    return <>{parts[0]}: <span style={{ filter: "blur(4px)", userSelect: "none" }}>{parts[1]}</span></>;
                  }
                  return exerciseTasks[activeTask].title;
                })()}
              </h3>
            </div>

            <p style={{ fontSize: "1rem", lineHeight: 1.7, marginBottom: "20px" }}>
              {exerciseTasks[activeTask].description}
            </p>

            <div
              style={{
                padding: "15px",
                borderRadius: "12px",
                background: `${colors.accent}15`,
                border: `1px solid ${colors.accent}30`,
              }}
            >
              <strong style={{ color: colors.accent, fontSize: "0.9rem" }}>Vihje:</strong>
              <p style={{ fontSize: "0.9rem", color: colors.text, marginTop: "8px", lineHeight: 1.5 }}>
                {exerciseTasks[activeTask].hint}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowSolution(!showSolution);
                // Reveal table names when first task solution is shown
                if (activeTask === 0 && !showSolution) {
                  setPlanningRevealed(true);
                }
              }}
              style={{
                marginTop: "20px",
                width: "100%",
                padding: "14px",
                borderRadius: "12px",
                border: "none",
                background: showSolution ? colors.surface : colors.secondary,
                color: colors.text,
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {showSolution ? "Peida lahendus" : "Näita lahendust"}
            </motion.button>
          </div>

          {/* Right: Solution */}
          <div
            style={{
              padding: "20px",
              borderRadius: "20px",
              background: "#1a1a2e",
              border: `1px solid ${colors.surface}`,
              fontFamily: "'Fira Code', monospace",
              overflow: "hidden",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "15px" }}>
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27ca40" }} />
              <span style={{ marginLeft: "10px", color: colors.textMuted, fontSize: "0.85rem" }}>
                {showSolution ? "Lahendus" : "Proovi ise!"}
              </span>
            </div>

            <div
              style={{
                maxHeight: "350px",
                overflow: "auto",
                filter: showSolution ? "none" : "blur(5px)",
                userSelect: showSolution ? "text" : "none",
                transition: "filter 0.3s",
              }}
            >
              <SQLHighlighter code={exerciseTasks[activeTask].solution} fontSize="0.75rem" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: "25px",
          padding: "15px 20px",
          borderRadius: "12px",
          background: `${colors.primary}10`,
          border: `1px solid ${colors.primary}30`,
          textAlign: "center",
        }}
      >
        <span style={{ color: colors.primary, fontWeight: 600 }}>Boonus:</span>
        <span style={{ color: colors.text, marginLeft: "8px" }}>
          Millist DBMS-i soovitaksid selle raamatukogu jaoks? Põhjenda oma valikut!
        </span>
      </motion.div>
    </div>
  );
}
