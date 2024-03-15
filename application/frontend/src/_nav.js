import React from "react";
import CIcon from "@coreui/icons-react";
import { cilNotes, cilCode, cilContact } from "@coreui/icons";
import { CNavItem, CNavTitle } from "@coreui/react";

const _nav = [
  {
    component: CNavTitle,
    name: "External Links",
  },

  {
    component: CNavItem,
    name: "Git Repository",
    href: "https://github.com/nzwemmer/FeedbackDiaryFinal",
    icon: <CIcon icon={cilCode} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Thesis | Docs",
    href: "https://www.overleaf.com/read/skwdmymftgvp#0232d6",
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: "Contact",
    href: "mailto:info@feedbackdiary.nl",
    icon: <CIcon icon={cilContact} customClassName="nav-icon" />,
  },
];

export default _nav;
