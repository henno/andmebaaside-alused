import React from "react";
import { motion } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased saaksid ülevaate kõigist käsitletud teemadest ja kinnistaksid õpitu.

📌 Selle slaidi eripära:

• See on kokkuvõtlik slaid ilma interaktiivsuseta
• Neli kaarti näitavad peamisi teemasid koos võtmepunktidega
• Kasuta seda kordamiseks ja küsimuste esitamiseks

🎯 Soovitused esitlemiseks:

1. Kiire ülevaade - käi läbi kõik neli kaarti:
   • Andmebaaside haldussüsteemid - "Milliseid süsteeme mäletate?"
   • Mootori omadused - "Mis on ACID?"
   • Arhitektuur - "Millised kihid on andmebaasis?"
   • Objektid ja andmetüübid - "Mis vahe on tabelil ja vaatel?"

2. Küsimuste voor:
   • Küsi 2-3 kontrollküsimust materjali kohta
   • Las õpilased küsivad, kui midagi jäi segaseks

3. Praktiline ülesanne kodutööks (valikuline):
   • "Disaini andmebaas oma lemmikrakenduse jaoks"
   • "Millised tabelid, millised andmetüübid?"

4. Järgmise loengu eelvaade:
   • SQL päringud
   • Andmete sisestamine ja pärimine

💡 Lõpeta positiivselt: "Andmebaasid on igal pool - iga veebileht ja rakendus kasutab neid!"`;

const summaryPoints = [
  {
    title: "Andmebaaside Haldussüsteemid",
    icon: "🗄️",
    points: [
      "Relatsioonilised (PostgreSQL, MySQL, Oracle)",
      "NoSQL (MongoDB, Redis, Cassandra)",
      "Igal süsteemil omad tugevused",
    ],
    color: "#22c55e",
  },
  {
    title: "Mootori Omadused",
    icon: "⚙️",
    points: [
      "ACID transaktsioonid",
      "Indeksid kiireks otsinguks",
      "Replikatsioon ja turvalisus",
    ],
    color: "#3b82f6",
  },
  {
    title: "Arhitektuur",
    icon: "🏗️",
    points: [
      "Kihiline ülesehitus",
      "Päringu töötlemine ja optimeerimine",
      "Salvestuse ja mälu haldus",
    ],
    color: "#f59e0b",
  },
  {
    title: "Objektid ja Andmetüübid",
    icon: "📊",
    points: [
      "Tabelid, vaated, indeksid",
      "Trigerid ja protseduurid",
      "Mitmekesised andmetüübid",
    ],
    color: "#ec4899",
  },
];

export default function Summary() {
  return (
    <div style={{ width: "100%", maxWidth: "1000px", textAlign: "center" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "50px",
        }}
      >
        Kokkuvõte
      </motion.h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "25px",
          marginBottom: "50px",
        }}
      >
        {summaryPoints.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.15 }}
            whileHover={{ scale: 1.03 }}
            style={{
              padding: "30px",
              borderRadius: "20px",
              background: colors.backgroundLight,
              border: `2px solid ${item.color}40`,
              textAlign: "left",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "20px" }}>
              <span style={{ fontSize: "2.5rem" }}>{item.icon}</span>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: item.color }}>{item.title}</h3>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {item.points.map((point, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.15 + i * 0.1 }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "10px",
                    color: colors.textMuted,
                    fontSize: "0.95rem",
                  }}
                >
                  <span style={{ color: item.color }}>✓</span>
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        style={{
          padding: "40px",
          borderRadius: "25px",
          background: colors.gradient1,
          boxShadow: "0 20px 60px rgba(99, 102, 241, 0.3)",
        }}
      >
        <h3 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "15px" }}>Täname tähelepanu eest!</h3>
        <p style={{ fontSize: "1.1rem", opacity: 0.9 }}>
          Andmebaasid on kaasaegse tarkvaraarenduse alustala
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          marginTop: "40px",
          color: colors.textMuted,
          fontSize: "0.9rem",
        }}
      >
        <span style={{ marginRight: "20px" }}>🎓 Andmebaaside Alused</span>
        <span>2024/2025</span>
      </motion.div>
    </div>
  );
}
