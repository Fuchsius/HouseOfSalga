import React from "react";
import "./Breadcrumbs.css";

export default function Breadcrumbs({ paths = [] }) {
  return (
    <nav className="breadcrumbs">
      {paths.map((p, idx) => (
        <span key={p}>
          {p}
          {idx < paths.length - 1 && <span className="sep">{">"}</span>}
        </span>
      ))}
    </nav>
  );
}
