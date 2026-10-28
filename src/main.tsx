import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import css from "./App.module.css";
import CustomSelect from "./components/CustomSelect/CustomSelect";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div className={css.container}>
      <CustomSelect />
    </div>
  </StrictMode>,
);
