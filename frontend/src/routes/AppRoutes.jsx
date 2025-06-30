import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "../pages/HomePage";
import SMSPage from "../pages/SMSPage";
import STTPage from "../pages/STTPage";
import LessonPage from "../pages/LessonPage";
import ExpensePage from "../pages/ExpensePage";
import DocumentUpload from "../pages/DocumentUpload";
import FinalGuidePage from "../pages/FinalGuidePage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/upload" element={<DocumentUpload />} />
      <Route path="/sms" element={<SMSPage />} />
      <Route path="/speak" element={<STTPage />} />
      <Route path="/lesson" element={<LessonPage />} />
      <Route path="/expense" element={<ExpensePage />} />
      <Route path="/final-guide" element={<FinalGuidePage />} />
    </Routes>
  );
}
