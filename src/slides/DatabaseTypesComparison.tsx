import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";
import SQLHighlighter from "../components/SQLHighlighter";

const teacherGuide = `Selle slaidiga võrreldakse erinevaid andmebaasitüüpe praktiliste koodinäidete abil.

📌 Interaktiivsuse kasutamine:

• Vali ülevalt andmebaasi tüüp (Relatsiooniline, Dokumendipõhine, Võti-väärtus)
• Vali alt operatsioon (Struktuuri loomine, Andmete lisamine, Andmete lugemine)
• Kood muutub vastavalt valikutele

🎯 Põhjalik esitlusjuhend:

1️⃣ RELATSIOONILINE (MySQL) - alusta siit:
   • Struktuur on ETTE MÄÄRATUD (CREATE TABLE)
   • Andmed peavad vastama skeemile
   • JOIN-id seovad tabeleid

   Küsi: "Mis juhtub, kui proovid lisada veergu, mida tabelis pole?"
   → Viga! Relatsiooniline AB on range.

2️⃣ DOKUMENDIPÕHINE (MongoDB):
   • Skeem on PAINDLIK - iga dokument võib olla erinev
   • JSON-laadsed dokumendid
   • Seosed: kas manustatud (embedded) või viited ($lookup)

   Küsi: "Millal on parem manustada, millal viidata?"
   → Manusta, kui andmeid loetakse koos ja neid on vähe
   → Viita, kui andmed muutuvad tihti või neid on palju

3️⃣ VÕTI-VÄÄRTUS (Redis):
   • Kõige lihtsam mudel: võti → väärtus
   • Ülikiire (mälupõhine)
   • Ei ole päringuid - ainult võtme järgi otsimine

   Küsi: "Miks ei saa Redis'es teha JOIN-i?"
   → Pole tabeleid! Ainult võtmed ja väärtused.

💡 MILLAL MIDA KASUTADA:

• Struktureeritud andmed, keerukad seosed → Relatsiooniline
• Paindlik struktuur, kiire arendus → Dokumendipõhine
• Vahemälu, sessioonid, loendurid → Võti-väärtus

❓ KÜSIMUSED:

• "Kas MongoDB-s saab teha JOIN-i?"
  → Jah, $lookup, AGA see on aeglasem kui SQL JOIN

• "Miks on Redis nii kiire?"
  → Andmed on mälus (RAM), mitte kettal

• "Kas relatsiooniline AB saab JSON-i salvestada?"
  → Jah! MySQL ja PostgreSQL toetavad JSON veerge`;

const dbTypes = [
  {
    id: "relational",
    name: "Relatsiooniline",
    icon: "🗃️",
    db: "MySQL",
    color: "#4479A1",
    description: "Struktureeritud tabelid, ranged skeemid, SQL päringud",
  },
  {
    id: "document",
    name: "Dokumendipõhine",
    icon: "📄",
    db: "MongoDB",
    color: "#47A248",
    description: "Paindlikud JSON dokumendid, manustatud andmed",
  },
  {
    id: "keyvalue",
    name: "Võti-väärtus",
    icon: "🔑",
    db: "Redis",
    color: "#DC382D",
    description: "Lihtne võti-väärtus paarid, ülikiire mälupõhine",
  },
];

const operations = [
  { id: "create", name: "Struktuuri loomine", icon: "🏗️" },
  { id: "insert", name: "Andmete lisamine", icon: "➕" },
  { id: "query", name: "Mitme tabeli päring", icon: "🔗" },
];

const codeExamples: Record<string, Record<string, { code: string; note: string }>> = {
  relational: {
    create: {
      code: `-- Kasutajate tabel
CREATE TABLE kasutajad (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nimi VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE
);

-- Tellimuste tabel (viitab kasutajale)
CREATE TABLE tellimused (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kasutaja_id INT NOT NULL,
  toode VARCHAR(100),
  summa DECIMAL(10,2),
  FOREIGN KEY (kasutaja_id) REFERENCES kasutajad(id)
);`,
      note: "Struktuur on rangelt määratud. Veerud, tüübid ja seosed on ette kirjeldatud.",
    },
    insert: {
      code: `-- Lisa kasutaja
INSERT INTO kasutajad (nimi, email)
VALUES ('Mari Mets', 'mari@email.ee');

-- Lisa tellimus (kasutaja_id peab eksisteerima!)
INSERT INTO tellimused (kasutaja_id, toode, summa)
VALUES (1, 'Sülearvuti', 899.99);

-- Mitu rida korraga
INSERT INTO tellimused (kasutaja_id, toode, summa)
VALUES
  (1, 'Hiir', 29.99),
  (1, 'Klaviatuur', 79.99);`,
      note: "Andmed peavad vastama skeemile. FOREIGN KEY tagab, et kasutaja_id viitab olemasolevale kasutajale.",
    },
    query: {
      code: `-- JOIN: kasutaja koos tema tellimustega
SELECT
  k.nimi,
  k.email,
  t.toode,
  t.summa
FROM kasutajad k
JOIN tellimused t ON k.id = t.kasutaja_id
WHERE k.id = 1;

-- Agregeeritud päring: iga kasutaja tellimuste summa
SELECT
  k.nimi,
  COUNT(t.id) AS tellimuste_arv,
  SUM(t.summa) AS kogusumma
FROM kasutajad k
LEFT JOIN tellimused t ON k.id = t.kasutaja_id
GROUP BY k.id, k.nimi;`,
      note: "JOIN seob tabeleid võtmete kaudu. SQL on deklaratiivne - kirjeldad MIDA tahad, mitte KUIDAS.",
    },
  },
  document: {
    create: {
      code: `// MongoDB: kollektsiooni EI PEA looma!
// See luuakse automaatselt esimese dokumendi lisamisel

// Valikuline: valideerimisskeem
db.createCollection("kasutajad", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["nimi", "email"],
      properties: {
        nimi: { bsonType: "string" },
        email: { bsonType: "string" },
        tellimused: { bsonType: "array" }
      }
    }
  }
});`,
      note: "Skeemi pole vaja! Iga dokument võib olla erineva struktuuriga. Valideerimine on valikuline.",
    },
    insert: {
      code: `// Lisa kasutaja KOOS tellimustega (manustatud)
db.kasutajad.insertOne({
  nimi: "Mari Mets",
  email: "mari@email.ee",
  tellimused: [
    { toode: "Sülearvuti", summa: 899.99 },
    { toode: "Hiir", summa: 29.99 },
    { toode: "Klaviatuur", summa: 79.99 }
  ]
});

// Või eraldi kollektsioonides (viitega)
db.kasutajad.insertOne({
  _id: ObjectId("..."),
  nimi: "Mari Mets",
  email: "mari@email.ee"
});
db.tellimused.insertMany([
  { kasutaja_id: ObjectId("..."), toode: "Sülearvuti", summa: 899.99 }
]);`,
      note: "Kaks lähenemist: 1) Manustatud - kõik ühes dokumendis, 2) Viited - eraldi kollektsioonides.",
    },
    query: {
      code: `// Manustatud andmed: lihtne päring
db.kasutajad.findOne(
  { nimi: "Mari Mets" },
  { nimi: 1, email: 1, tellimused: 1 }
);

// Eraldi kollektsioonid: $lookup (nagu JOIN)
db.kasutajad.aggregate([
  { $match: { nimi: "Mari Mets" } },
  { $lookup: {
      from: "tellimused",
      localField: "_id",
      foreignField: "kasutaja_id",
      as: "tellimused"
  }},
  { $project: {
      nimi: 1,
      tellimuste_arv: { $size: "$tellimused" },
      kogusumma: { $sum: "$tellimused.summa" }
  }}
]);`,
      note: "$lookup on MongoDB JOIN. Manustatud andmetega pole JOIN-i vaja - kõik on juba koos!",
    },
  },
  keyvalue: {
    create: {
      code: `# Redis: struktuuri EI LOODA!
# Andmed salvestatakse otse võtme alla

# Erinevad andmetüübid:
# - STRING: lihtne väärtus
# - HASH: võtme-väärtuse paarid (nagu objekt)
# - LIST: järjestatud nimekiri
# - SET: unikaalsete väärtuste hulk
# - SORTED SET: järjestatud hulk skooriga

# Näide: kasutaja andmete struktuur
# kasutaja:1        → HASH (nimi, email)
# kasutaja:1:tellimused → LIST (tellimuste ID-d)
# tellimus:1        → HASH (toode, summa)`,
      note: "Pole tabeleid ega skeeme! Andmed on võtmete all. Struktuur on sinu otsustada.",
    },
    insert: {
      code: `# Lisa kasutaja (HASH)
HSET kasutaja:1 nimi "Mari Mets" email "mari@email.ee"

# Lisa tellimused (HASH-id)
HSET tellimus:1 toode "Sülearvuti" summa "899.99" kasutaja_id "1"
HSET tellimus:2 toode "Hiir" summa "29.99" kasutaja_id "1"
HSET tellimus:3 toode "Klaviatuur" summa "79.99" kasutaja_id "1"

# Seo kasutaja tellimustega (LIST)
RPUSH kasutaja:1:tellimused 1 2 3

# Alternatiiv: JSON string
SET kasutaja:1:json '{"nimi":"Mari","tellimused":[...]}'`,
      note: "Võtme nimi on sinu valida. Levinud muster: 'tüüp:id' või 'tüüp:id:alamandmed'.",
    },
    query: {
      code: `# Loe kasutaja andmed
HGETALL kasutaja:1
# Tulemus: {"nimi": "Mari Mets", "email": "mari@email.ee"}

# Loe kasutaja tellimuste ID-d
LRANGE kasutaja:1:tellimused 0 -1
# Tulemus: ["1", "2", "3"]

# Loe iga tellimus ERALDI (pole JOIN-i!)
HGETALL tellimus:1
HGETALL tellimus:2
HGETALL tellimus:3

# Rakenduse kood peab tegema mitu päringut
# ja andmed kokku panema!`,
      note: "JOIN-i EI OLE! Seotud andmete lugemine nõuab mitut päringut. See on kompromiss kiiruse nimel.",
    },
  },
};

export default function DatabaseTypesComparison() {
  const [selectedType, setSelectedType] = useState("relational");
  const [selectedOp, setSelectedOp] = useState("create");

  const currentType = dbTypes.find((t) => t.id === selectedType)!;
  const currentExample = codeExamples[selectedType][selectedOp];

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.5rem",
          fontWeight: 700,
          marginBottom: "30px",
          textAlign: "center",
        }}
      >
        Andmebaasitüüpide Võrdlus
      </motion.h2>

      {/* Database type selector */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "15px",
          marginBottom: "25px",
        }}
      >
        {dbTypes.map((type) => (
          <motion.button
            key={type.id}
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedType(type.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "15px 25px",
              borderRadius: "15px",
              border: "none",
              background: selectedType === type.id ? type.color : colors.backgroundLight,
              color: selectedType === type.id ? "white" : colors.text,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s",
              boxShadow: selectedType === type.id ? `0 8px 25px ${type.color}50` : "none",
            }}
          >
            <span style={{ fontSize: "1.5rem" }}>{type.icon}</span>
            <div style={{ textAlign: "left" }}>
              <div>{type.name}</div>
              <div style={{ fontSize: "0.75rem", opacity: 0.8, fontWeight: 400 }}>{type.db}</div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Operation selector */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "25px",
        }}
      >
        {operations.map((op) => (
          <motion.button
            key={op.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedOp(op.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              borderRadius: "10px",
              border: `2px solid ${selectedOp === op.id ? currentType.color : colors.surface}`,
              background: selectedOp === op.id ? `${currentType.color}20` : "transparent",
              color: colors.text,
              fontSize: "0.9rem",
              fontWeight: selectedOp === op.id ? 600 : 400,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <span>{op.icon}</span>
            {op.name}
          </motion.button>
        ))}
      </motion.div>

      {/* Code display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedType}-${selectedOp}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Description */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
              padding: "15px",
              borderRadius: "12px",
              background: `${currentType.color}15`,
              border: `1px solid ${currentType.color}30`,
            }}
          >
            <span style={{ fontSize: "1.1rem", color: colors.text }}>{currentType.description}</span>
          </div>

          {/* Code block */}
          <div
            style={{
              borderRadius: "20px",
              background: "#1a1a2e",
              border: `1px solid ${colors.surface}`,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "15px 20px",
                borderBottom: `1px solid ${colors.surface}`,
                background: "#12121f",
              }}
            >
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ff5f56" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#ffbd2e" }} />
              <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#27ca40" }} />
              <span style={{ marginLeft: "15px", color: currentType.color, fontSize: "0.9rem", fontWeight: 600 }}>
                {currentType.db}
              </span>
            </div>
            <div style={{ padding: "20px", maxHeight: "320px", overflow: "auto" }}>
              <SQLHighlighter code={currentExample.code} fontSize="0.8rem" />
            </div>
          </div>

          {/* Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            style={{
              marginTop: "15px",
              padding: "15px 20px",
              borderRadius: "12px",
              background: colors.backgroundLight,
              border: `1px solid ${colors.surface}`,
              display: "flex",
              alignItems: "flex-start",
              gap: "12px",
            }}
          >
            <span style={{ fontSize: "1.3rem" }}>💡</span>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: "0.9rem", lineHeight: 1.6 }}>
              {currentExample.note}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
