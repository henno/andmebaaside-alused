import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { colors } from "../styles";

interface TableOfContentsProps {
  isOpen: boolean;
  onClose: () => void;
  currentSlide: number;
  onNavigate: (index: number) => void;
}

const slideNames = [
  { title: "Tiitelslaid", subtitle: "Sissejuhatus andmebaaside alustesse", icon: "🎯" },
  { title: "Kus asub andmebaas?", subtitle: "Andmebaasi roll arhitektuuris", icon: "🏛️" },
  { title: "DBMS Ülevaade", subtitle: "Andmebaaside haldussüsteemid", icon: "🗄️" },
  { title: "DBMS Võrdlus", subtitle: "Süsteemide võrdlustabel", icon: "📊" },
  { title: "DBMS Omadused", subtitle: "Andmebaasimootori omadused", icon: "⚙️" },
  { title: "Arhitektuur", subtitle: "Andmebaasi arhitektuur", icon: "🏗️" },
  { title: "Andmebaasiobjektid", subtitle: "Tabelid, vaated, indeksid", icon: "📦" },
  { title: "Andmebaasitüübid", subtitle: "Relatsiooniline vs NoSQL", icon: "🔄" },
  { title: "Andmetüübid", subtitle: "Numbrid, tekst, kuupäevad", icon: "🔢" },
  { title: "Normaliseerimine", subtitle: "1NF, 2NF, 3NF, BCNF", icon: "📐" },
  { title: "Skaleerimine", subtitle: "Sharding, replikatsioon, caching", icon: "📈" },
  { title: "SQL Ajalugu", subtitle: "Ajalugu ja dialektid", icon: "📜" },
  { title: "Temporaalsed andmed", subtitle: "Ajast sõltuvad andmed", icon: "⏰" },
  { title: "Kokkuvõte", subtitle: "Kursuse kokkuvõte", icon: "✅" },
  { title: "Praktiline ülesanne", subtitle: "Raamatukogu andmebaas", icon: "📚" },
];

export default function TableOfContents({ isOpen, onClose, currentSlide, onNavigate }: TableOfContentsProps) {
  const handleNavigate = (index: number) => {
    onNavigate(index);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.4)",
              zIndex: 999,
            }}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "320px",
              maxWidth: "85vw",
              height: "100vh",
              background: colors.backgroundLight,
              zIndex: 1000,
              boxShadow: "10px 0 40px rgba(0, 0, 0, 0.4)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "20px 25px",
                borderBottom: `1px solid ${colors.surface}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: colors.background,
              }}
            >
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "2px" }}>
                  Sisukord
                </h3>
                <span style={{ fontSize: "0.75rem", color: colors.textMuted }}>
                  {slideNames.length} slaidi
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: colors.surface,
                  color: colors.text,
                  fontSize: "1.2rem",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                ×
              </motion.button>
            </div>

            {/* Slide list */}
            <div
              style={{
                flex: 1,
                overflow: "auto",
                padding: "15px",
              }}
            >
              {slideNames.map((slide, index) => (
                <motion.button
                  key={index}
                  whileHover={{ x: 5, backgroundColor: colors.surface }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleNavigate(index)}
                  style={{
                    width: "100%",
                    padding: "14px 15px",
                    marginBottom: "8px",
                    borderRadius: "12px",
                    border: "none",
                    background: currentSlide === index ? colors.primary : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    transition: "background 0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: currentSlide === index ? "rgba(255,255,255,0.2)" : colors.surface,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.2rem",
                      flexShrink: 0,
                    }}
                  >
                    {slide.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: currentSlide === index ? 600 : 500,
                        color: colors.text,
                        marginBottom: "2px",
                      }}
                    >
                      {index + 1}. {slide.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: currentSlide === index ? "rgba(255,255,255,0.8)" : colors.textMuted,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {slide.subtitle}
                    </div>
                  </div>
                  {currentSlide === index && (
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        background: "white",
                        flexShrink: 0,
                      }}
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "15px 20px",
                borderTop: `1px solid ${colors.surface}`,
                background: colors.background,
                fontSize: "0.75rem",
                color: colors.textMuted,
                textAlign: "center",
              }}
            >
              Kasuta ← → navigeerimiseks
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
