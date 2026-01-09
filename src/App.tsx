import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { globalStyles, colors } from "./styles";
import TableOfContents from "./components/TableOfContents";

// Slides
import TitleSlide from "./slides/TitleSlide";
import DatabaseIntroduction from "./slides/DatabaseIntroduction";
import DBMSOverview from "./slides/DBMSOverview";
import DBMSComparison from "./slides/DBMSComparison";
import DBMSFeatures from "./slides/DBMSFeatures";
import ArchitectureOverview from "./slides/ArchitectureOverview";
import DatabaseObjects from "./slides/DatabaseObjects";
import DatabaseTypesComparison from "./slides/DatabaseTypesComparison";
import DataTypes from "./slides/DataTypes";
import SQLHistory from "./slides/SQLHistory";
import TemporalData from "./slides/TemporalData";
import Normalization from "./slides/Normalization";
import ScalingTechniques from "./slides/ScalingTechniques";
import Summary from "./slides/Summary";
import PracticalExercise from "./slides/PracticalExercise";

const slides = [
  TitleSlide,
  DatabaseIntroduction,
  DBMSOverview,
  DBMSComparison,
  DBMSFeatures,
  ArchitectureOverview,
  DatabaseObjects,
  DatabaseTypesComparison,
  DataTypes,
  Normalization,
  ScalingTechniques,
  SQLHistory,
  TemporalData,
  Summary,
  PracticalExercise,
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
    scale: 0.9,
  }),
};

export default function App() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [tocOpen, setTocOpen] = useState(false);

  const navigateToSlide = (index: number) => {
    setPage([index, index > page ? 1 : -1]);
  };

  const paginate = useCallback((newDirection: number) => {
    setPage(([currentPage]) => {
      const nextPage = currentPage + newDirection;
      if (nextPage < 0 || nextPage >= slides.length) return [currentPage, 0];
      return [nextPage, newDirection];
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        e.preventDefault();
        paginate(1);
      } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
        e.preventDefault();
        paginate(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        setPage([0, -1]);
      } else if (e.key === "End") {
        e.preventDefault();
        setPage([slides.length - 1, 1]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [paginate]);

  const CurrentSlide = slides[page];

  return (
    <>
      <style>{globalStyles}</style>
      <div
        style={{
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          position: "relative",
          background: `radial-gradient(ellipse at top, ${colors.backgroundLight} 0%, ${colors.background} 100%)`,
        }}
      >
        {/* Table of Contents Sidebar */}
        <TableOfContents
          isOpen={tocOpen}
          onClose={() => setTocOpen(false)}
          currentSlide={page}
          onNavigate={navigateToSlide}
        />

        {/* Hamburger Menu Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setTocOpen(true)}
          data-testid="hamburger-menu"
          style={{
            position: "absolute",
            top: "25px",
            left: "30px",
            width: "45px",
            height: "45px",
            borderRadius: "12px",
            border: "none",
            background: colors.surface,
            color: colors.text,
            cursor: "pointer",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
            zIndex: 100,
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
          }}
        >
          <span style={{ width: "20px", height: "2px", background: colors.text, borderRadius: "1px" }} />
          <span style={{ width: "20px", height: "2px", background: colors.text, borderRadius: "1px" }} />
          <span style={{ width: "20px", height: "2px", background: colors.text, borderRadius: "1px" }} />
        </motion.button>

        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 60, repeat: Infinity, ease: "linear" },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              position: "absolute",
              top: "-50%",
              right: "-30%",
              width: "80vw",
              height: "80vw",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.primary}15 0%, transparent 70%)`,
            }}
          />
          <motion.div
            animate={{
              rotate: -360,
              scale: [1, 1.2, 1],
            }}
            transition={{
              rotate: { duration: 45, repeat: Infinity, ease: "linear" },
              scale: { duration: 8, repeat: Infinity, ease: "easeInOut" },
            }}
            style={{
              position: "absolute",
              bottom: "-40%",
              left: "-20%",
              width: "60vw",
              height: "60vw",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${colors.secondary}10 0%, transparent 70%)`,
            }}
          />
        </div>

        {/* Slide content */}
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.2, ease: "easeOut" },
              opacity: { duration: 0.1 },
              scale: { duration: 0.1 },
            }}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "40px",
            }}
          >
            <CurrentSlide />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: "20px",
            zIndex: 100,
          }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(-1)}
            disabled={page === 0}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "none",
              background: page === 0 ? colors.surface : colors.primary,
              color: colors.text,
              cursor: page === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              opacity: page === 0 ? 0.5 : 1,
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            ←
          </motion.button>

          <div
            style={{
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
          >
            {slides.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setPage([index, index > page ? 1 : -1])}
                style={{
                  width: index === page ? "30px" : "10px",
                  height: "10px",
                  borderRadius: "5px",
                  border: "none",
                  background: index === page ? colors.primary : colors.surface,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => paginate(1)}
            disabled={page === slides.length - 1}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: "50%",
              border: "none",
              background: page === slides.length - 1 ? colors.surface : colors.primary,
              color: colors.text,
              cursor: page === slides.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              opacity: page === slides.length - 1 ? 0.5 : 1,
              boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
            }}
          >
            →
          </motion.button>
        </div>

        {/* Progress bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: colors.surface,
          }}
        >
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((page + 1) / slides.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            style={{
              height: "100%",
              background: colors.gradient3,
            }}
          />
        </div>

        {/* Slide counter */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            right: "40px",
            fontSize: "14px",
            color: colors.textMuted,
            fontWeight: 500,
          }}
        >
          {page + 1} / {slides.length}
        </div>

        {/* Keyboard hint */}
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "40px",
            fontSize: "12px",
            color: colors.textMuted,
            display: "flex",
            gap: "10px",
          }}
        >
          <span style={{ padding: "4px 8px", background: colors.surface, borderRadius: "4px" }}>←</span>
          <span style={{ padding: "4px 8px", background: colors.surface, borderRadius: "4px" }}>→</span>
          <span style={{ marginLeft: "5px", opacity: 0.7 }}>navigeeri</span>
        </div>
      </div>
    </>
  );
}
