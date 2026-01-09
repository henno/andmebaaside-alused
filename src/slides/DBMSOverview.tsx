import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased tutvuksid erinevate andmebaasihaldussüsteemidega ja mõistaksid nende põhilisi erinevusi.

📌 Interaktiivsuse kasutamine:

• Klõpsa igal andmebaasi kaardil, et näidata detailset infot ja omadusi
• Saad kaarte avada ja sulgeda klõpsamisega
• Kasuta seda võimalust, et võrrelda erinevaid süsteeme

🎯 Soovitused esitlemiseks:

1. Alusta küsimusega: "Milliseid andmebaase olete kuulnud või kasutanud?"

2. RELATSIOONILISED (SQL) - klõpsa igaühel:
   • PostgreSQL - võimas, JSON tugi, laiendatav
   • MySQL - populaarseim, kiire, lihtne
   • MariaDB - MySQL fork, täielikult ühilduv, temporaalsed tabelid
   • MS SQL Server - Microsoft'i toode, .NET keskkondades populaarne
   • Oracle - ettevõtte-tase, kallis, keeruline

3. NoSQL ANDMEBAASID:
   • MongoDB - dokumendipõhine, JSON, paindlik skeem

4. MÄLUPÕHISED (vahemälu):
   • Redis - andmestruktuurid, pub/sub, persistentsus võimalik
   • Memcached - lihtsam kui Redis, ainult võti-väärtus, sessioonid

5. MANUSTATUD:
   • SQLite - üks fail, mobiilirakendused, brauserid

💡 Millal mida kasutada:
• Veebirakendus → MySQL/MariaDB/PostgreSQL
• .NET ettevõte → MS SQL Server
• Suurkorporatsioon → Oracle
• Kiire vahemälu → Redis/Memcached
• Mobiilirakendus → SQLite
• Paindlik skeem → MongoDB`;

const dbSystems = [
  {
    name: "PostgreSQL",
    icon: "🐘",
    type: "Relatsiooniline",
    color: "#336791",
    description: "Avatud lähtekoodiga, võimas objekti-relatsiooniline DBMS",
    features: ["ACID", "JSON tugi", "Laiendatav", "Täistekstiotsing"],
  },
  {
    name: "MySQL",
    icon: "🐬",
    type: "Relatsiooniline",
    color: "#4479A1",
    description: "Populaarseim avatud lähtekoodiga relatsiooniline andmebaas",
    features: ["Kiire", "Lihtne", "Replikatsioon", "InnoDB"],
  },
  {
    name: "MariaDB",
    icon: "🦭",
    type: "Relatsiooniline",
    color: "#003545",
    description: "MySQL-i hargnemine (fork), täielikult ühilduv, kuid parema jõudlusega",
    features: ["MySQL ühilduv", "Galera Cluster", "Temporaalsed tabelid", "Avatud lähtekood"],
  },
  {
    name: "MS SQL Server",
    icon: "🗄️",
    type: "Relatsiooniline",
    color: "#CC2927",
    description: "Microsoft'i ettevõtte-taseme relatsiooniline DBMS",
    features: ["T-SQL", "SSMS", "Azure integratsioon", "Business Intelligence"],
  },
  {
    name: "Oracle",
    icon: "🔴",
    type: "Relatsiooniline",
    color: "#F80000",
    description: "Ettevõtte taseme relatsiooniline DBMS",
    features: ["Kõrge saadavus", "Turvalisus", "PL/SQL", "RAC"],
  },
  {
    name: "MongoDB",
    icon: "🍃",
    type: "Dokumendipõhine",
    color: "#47A248",
    description: "NoSQL dokumendipõhine andmebaas JSON-laadsete dokumentidega",
    features: ["Paindlik skeem", "Horisontaalne skaleerimine", "Agregatsiooni torujuhe"],
  },
  {
    name: "Redis",
    icon: "⚡",
    type: "Võti-väärtus",
    color: "#DC382D",
    description: "Mälupõhine andmestruktuuride hoidla",
    features: ["Ülikiire", "Vahemälu", "Pub/Sub", "Andmestruktuurid"],
  },
  {
    name: "Memcached",
    icon: "🧠",
    type: "Võti-väärtus",
    color: "#6DB33F",
    description: "Lihtne, kiire hajutatud mälupõhine vahemälu süsteem",
    features: ["Ülilihtne", "Hajutatud", "Vahemälu", "Sessioonid"],
  },
  {
    name: "SQLite",
    icon: "🪶",
    type: "Manustatud",
    color: "#003B57",
    description: "Iseseisev serverita SQL andmebaasimotor",
    features: ["Nullkonfiguratsioon", "Üks fail", "Manustatud", "Kerge"],
  },
];

export default function DBMSOverview() {
  const [expandedDBs, setExpandedDBs] = useState<Set<number>>(new Set());

  const toggleDB = (index: number) => {
    setExpandedDBs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return (
    <div style={{ width: "100%", maxWidth: "1200px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Andmebaaside Haldussüsteemid
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          fontSize: "1.2rem",
          marginBottom: "50px",
        }}
      >
        Kliki kaardil, et näha rohkem infot
      </motion.p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "25px",
        }}
      >
        {dbSystems.map((db, index) => (
          <motion.div
            key={db.name}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => toggleDB(index)}
            style={{
              padding: "25px",
              borderRadius: "20px",
              background: colors.backgroundLight,
              border: `2px solid ${expandedDBs.has(index) ? db.color : colors.surface}`,
              cursor: "pointer",
              transition: "border-color 0.3s",
              boxShadow: expandedDBs.has(index) ? `0 10px 40px ${db.color}30` : "0 4px 20px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "15px" }}>
              <span style={{ fontSize: "2.5rem" }}>{db.icon}</span>
              <div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "4px" }}>{db.name}</h3>
                <span
                  style={{
                    fontSize: "0.8rem",
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: `${db.color}30`,
                    color: db.color,
                    fontWeight: 500,
                  }}
                >
                  {db.type}
                </span>
              </div>
            </div>

            <AnimatePresence>
              {expandedDBs.has(index) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <p style={{ color: colors.textMuted, marginBottom: "15px", fontSize: "0.95rem" }}>
                    {db.description}
                  </p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {db.features.map((feature) => (
                      <span
                        key={feature}
                        style={{
                          fontSize: "0.75rem",
                          padding: "5px 10px",
                          borderRadius: "8px",
                          background: colors.surface,
                          color: colors.text,
                        }}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
