import { useTranslation } from "react-i18next";
import { supportedLanguages } from "../i18n/config";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(event.target.value);
  };

  return (
    <select
      value={i18n.language}
      onChange={handleLanguageChange}
      style={{
        marginLeft: "10px",
        padding: "2px 4px",
        border: "1px solid #ccc",
        backgroundColor: "white",
        fontFamily: "'Roboto Mono', monospace",
      }}
    >
      {supportedLanguages.map((lang) => (
        <option key={lang} value={lang}>
          {lang === "en" ? "English" : "日本語"}
        </option>
      ))}
    </select>
  );
}
