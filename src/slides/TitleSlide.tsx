import React from "react";
import { motion } from "framer-motion";
import { colors } from "../styles";
import InfoButton from "../components/InfoButton";

const teacherGuide = `Selle slaidiga taoteldakse, et õpilased saaksid ülevaate kursuse sisust ja peamistest teemadest.

📌 Soovitused esitlemiseks:

1. Alusta enesetutvustusega ja kursuse eesmärkide selgitamisega

2. Näita nelja peamist teemat (DBMS, Arhitektuur, Objektid, Andmetüübid) ja selgita lühidalt, mida iga teema käsitleb

3. Küsi õpilastelt, kas kellelgi on varasemaid kogemusi andmebaasidega - see aitab kohandada esitluse tempot

4. Mainida, et esitlus on interaktiivne ja õpilased võivad küsimusi esitada igal ajal

💡 Navigeerimine: Kasuta nooleklahve (← →) või klõpsa alumisel ribal olevaid punkte, et liikuda slaidide vahel.`;

export default function TitleSlide() {
  return (
    <div
      style={{
        textAlign: "center",
        maxWidth: "900px",
      }}
    >
      <InfoButton content={teacherGuide} />
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", duration: 1, delay: 0.2 }}
        style={{
          width: "120px",
          height: "120px",
          margin: "0 auto 40px",
          borderRadius: "30px",
          background: colors.gradient1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "60px",
          boxShadow: "0 20px 60px rgba(99, 102, 241, 0.4)",
        }}
      >
        🗄️
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        style={{
          fontSize: "4.5rem",
          fontWeight: 800,
          marginBottom: "20px",
          background: colors.gradient3,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight: 1.1,
        }}
      >
        ANDMEBAASIDE
        <br />
        ALUSED
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          fontSize: "1.5rem",
          color: colors.textMuted,
          marginBottom: "50px",
          fontWeight: 300,
        }}
      >
        Ülevaade andmebaaside haldussüsteemidest, arhitektuurist ja andmetüüpidest
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {["DBMS", "Arhitektuur", "Objektid", "Andmetüübid"].map((topic, i) => (
          <motion.div
            key={topic}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 + i * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            style={{
              padding: "15px 25px",
              borderRadius: "12px",
              background: colors.backgroundLight,
              border: `1px solid ${colors.surface}`,
              fontSize: "1rem",
              fontWeight: 500,
              color: colors.text,
            }}
          >
            {topic}
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        style={{
          marginTop: "60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
          color: colors.textMuted,
          fontSize: "0.9rem",
        }}
      >
        <motion.span
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          →
        </motion.span>
        Vajuta nooleklahvi jätkamiseks
      </motion.div>
    </div>
  );
}
