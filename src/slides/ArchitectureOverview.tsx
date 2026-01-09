import React, { useState } from "react";
import { motion } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased mõistaksid andmebaasi sisemist ülesehitust ja kuidas erinevad kihid omavahel suhtlevad.

📌 Interaktiivsuse kasutamine:

• Klõpsa vasakul igal kihil, et näha selle detaile paremal paneelil
• Iga kiht on visuaalselt eristatud värvi ja ikooniga
• Nooled kihtide vahel näitavad andmevoogu

🎯 Soovitused esitlemiseks:

1. Alusta ülevalt alla - nii liiguvad ka päringud:
   • Rakenduskiht → kasutaja esitab päringu
   • Päringukiht → SQL parsitakse ja optimeeritakse
   • Tehingukiht → ACID garanteeritakse
   • Salvestuskiht → andmed loetakse kettalt

2. Klõpsa igal kihil ja selgita komponente:
   • Rakenduskiht: ORM (Object-Relational Mapping) peidab SQL-i keerukuse
   • Päringukiht: Optimeerija valib parima täitmisplaani
   • Tehingukiht: Lukuhaldur hoiab ära andmekonfliktid
   • Salvestuskiht: Puhverhaldur hoiab sageli kasutatavaid andmeid mälus

3. Küsi: "Mis juhtub, kui vahepeal vool kaob?" - Taastehaldur taastab andmed logist

💡 Analoogia: See on nagu tehase konveier - iga kiht teeb oma töö ja annab edasi järgmisele.`;

const layers = [
  {
    name: "Rakenduskiht",
    color: "#22c55e",
    icon: "💻",
    desc: "Kasutajaliides ja äriloogika",
    components: [
      {
        name: "Veebirakendus",
        desc: "Kasutajaliides (HTML, React, Vue), mis võimaldab kasutajal andmeid sisestada, otsida ja kuvada",
      },
      {
        name: "API (REST/GraphQL)",
        desc: "Programmeerimisliides, mis võimaldab teistel rakendustel andmebaasiga suhelda HTTP päringute kaudu",
      },
      {
        name: "ORM (Object-Relational Mapping)",
        desc: "Teek (nt Sequelize, Hibernate), mis teisendab SQL päringud objektideks ja vastupidi, peidab SQL keerukuse",
      },
    ],
  },
  {
    name: "Päringukiht",
    color: "#3b82f6",
    icon: "🔍",
    desc: "SQL parseerimine ja optimeerimine",
    components: [
      {
        name: "Parser (Süntaksianalüsaator)",
        desc: "Kontrollib SQL süntaksit ja teisendab päringu sisemiseks puustruktuuriks (AST - Abstract Syntax Tree)",
      },
      {
        name: "Optimeerija (Query Optimizer)",
        desc: "Analüüsib erinevaid täitmisviise ja valib kiireima plaani, kasutades statistikat ja indekseid",
      },
      {
        name: "Täitja (Executor)",
        desc: "Käivitab optimeeritud päringuplaani, koordineerib andmete lugemist ja kirjutamist",
      },
    ],
  },
  {
    name: "Tehingukiht",
    color: "#f59e0b",
    icon: "🔄",
    desc: "ACID tagamine ja lukustamine",
    components: [
      {
        name: "Lukuhaldur (Lock Manager)",
        desc: "Haldab ridadele ja tabelitele seatud lukke, takistab samaaegset kirjutamist samadele andmetele",
      },
      {
        name: "Taastehaldur (Recovery Manager)",
        desc: "Taastab andmed pärast süsteemitõrget, kasutades WAL (Write-Ahead Log) logisid",
      },
      {
        name: "Transaktsioonilogi (WAL)",
        desc: "Kirjutab KÕIK muudatused ENNE andmefaili, tagab püsivuse ka voolukatkestuse korral",
      },
    ],
  },
  {
    name: "Salvestuskiht",
    color: "#ec4899",
    icon: "💾",
    desc: "Füüsiline andmete salvestamine",
    components: [
      {
        name: "Puhverhaldur (Buffer Pool)",
        desc: "Hoiab sageli kasutatavaid andmelehti mälus (RAM), vähendab aeglasi kettaoperatsioone",
      },
      {
        name: "Failihaldur (Storage Engine)",
        desc: "Haldab andmefaile kettal, nt InnoDB (MySQL), tegeleb lehtede ja extentide haldusega",
      },
      {
        name: "Indeksihaldur",
        desc: "Haldab B-Tree ja teisi indeksstruktuure, võimaldab kiireid otsinguid ilma täisskannita",
      },
    ],
  },
];

export default function ArchitectureOverview() {
  const [activeLayer, setActiveLayer] = useState<number | null>(null);

  return (
    <div style={{ width: "100%", maxWidth: "1100px" }}>
      <InfoButton content={teacherGuide} />
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          fontSize: "2.8rem",
          fontWeight: 700,
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        Andmebaasi Arhitektuur
      </motion.h2>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          textAlign: "center",
          color: colors.textMuted,
          marginBottom: "50px",
          fontSize: "1.1rem",
        }}
      >
        Kihtide arhitektuur tagab modulaarsuse ja abstraktsiooni
      </motion.p>

      <div style={{ display: "flex", gap: "50px", alignItems: "center" }}>
        {/* Architecture stack */}
        <div style={{ flex: 1 }}>
          {layers.map((layer, index) => (
            <motion.div
              key={layer.name}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15 }}
              whileHover={{ scale: 1.02, x: 10 }}
              onClick={() => setActiveLayer(activeLayer === index ? null : index)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                padding: "25px 30px",
                marginBottom: index < layers.length - 1 ? "15px" : 0,
                borderRadius: "15px",
                background: activeLayer === index ? `${layer.color}20` : colors.backgroundLight,
                border: `2px solid ${activeLayer === index ? layer.color : colors.surface}`,
                cursor: "pointer",
                transition: "all 0.3s",
                position: "relative",
              }}
            >
              {/* Connection line */}
              {index < layers.length - 1 && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "15px" }}
                  transition={{ delay: index * 0.15 + 0.3 }}
                  style={{
                    position: "absolute",
                    bottom: "-15px",
                    left: "50%",
                    width: "3px",
                    background: colors.surface,
                    zIndex: 0,
                  }}
                />
              )}

              <span style={{ fontSize: "2.5rem" }}>{layer.icon}</span>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 600, marginBottom: "5px", color: layer.color }}>
                  {layer.name}
                </h3>
                <p style={{ color: colors.textMuted, fontSize: "0.9rem" }}>{layer.desc}</p>
              </div>
              <motion.span
                animate={{ rotate: activeLayer === index ? 180 : 0 }}
                style={{ fontSize: "1.2rem", color: colors.textMuted }}
              >
                ▼
              </motion.span>
            </motion.div>
          ))}
        </div>

        {/* Detail panel */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          style={{
            width: "350px",
            padding: "30px",
            borderRadius: "20px",
            background: colors.backgroundLight,
            border: `1px solid ${colors.surface}`,
            minHeight: "400px",
          }}
        >
          {activeLayer !== null ? (
            <>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "15px",
                  marginBottom: "25px",
                }}
              >
                <span style={{ fontSize: "3rem" }}>{layers[activeLayer].icon}</span>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 700, color: layers[activeLayer].color }}>
                  {layers[activeLayer].name}
                </h3>
              </div>

              <p style={{ color: colors.textMuted, marginBottom: "25px", lineHeight: 1.6 }}>
                {layers[activeLayer].desc}
              </p>

              <h4 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "15px" }}>Komponendid:</h4>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {layers[activeLayer].components.map((comp, i) => (
                  <motion.div
                    key={comp.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    style={{
                      padding: "14px 16px",
                      borderRadius: "12px",
                      background: `${layers[activeLayer].color}15`,
                      border: `1px solid ${layers[activeLayer].color}40`,
                    }}
                  >
                    <div style={{ fontSize: "0.95rem", fontWeight: 600, marginBottom: "6px", color: layers[activeLayer].color }}>
                      {comp.name}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: colors.textMuted, lineHeight: 1.5 }}>
                      {comp.desc}
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div
              style={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: colors.textMuted,
                textAlign: "center",
              }}
            >
              <span style={{ fontSize: "4rem", marginBottom: "20px", opacity: 0.5 }}>👆</span>
              <p style={{ fontSize: "1.1rem" }}>Kliki kihil, et näha detaile</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
