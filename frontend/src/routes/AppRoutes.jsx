import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SMSPage from "../pages/SMSPage";
import STTPage from "../pages/STTPage";
import LessonPage from "../pages/LessonPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sms" element={<SMSPage />} />
      <Route path="/speak" element={<STTPage />} />
      <Route path="/lesson" element={<LessonPage />} />
    </Routes>
  );
}
