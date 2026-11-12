const categoryLabels = { Q1: "Q1", Q2: "Q2", Q3: "Q3", Q4: "Q4", international: "International", national: "National", unclassified: "Unclassified" };
const normalise = (publication) => ({
  ...publication,
  type: String(publication.type).toLowerCase().includes("journal") ? "journal" : "conference",
  category: ["Q1", "Q2", "Q3", "Q4"].includes(publication.quarter) ? publication.quarter : String(publication.quarter).toLowerCase().includes("international") ? "international" : String(publication.quarter).toLowerCase().includes("national") ? "national" : "unclassified",
});

const publicationList = document.getElementById("publication-list");
const highlightRaulMontoliu = (authors) => authors.replace(/(?:ra[uú]l\s+montoliu(?:[- ]col[aá]s)?|montoliu(?:[- ]col[aá]s)?\s*,?\s*ra[uú]l|r\.?\s*montoliu(?:[- ]col[aá]s)?|montoliu(?:[- ]col[aá]s)?\s*,?\s*r\.?)/gi, "<u>$&</u>");
const publicationsByDate = window.publications.map(normalise).sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
const linkLabel = (url) => url.replace(/^https?:\/\/(dx\.)?doi\.org\//, "");

publicationList.innerHTML = publicationsByDate.map((publication) => `
  <li>
    <div class="pub-meta">
      <span>${publication.year}</span>
      <span class="tag ${publication.type}">${publication.type === "journal" ? "Journal" : "Conference"}</span>
      <span class="tag quarter">${categoryLabels[publication.category]}</span>
    </div>
    <div>
      <p class="authors">${highlightRaulMontoliu(publication.authors)}</p>
      <h3>${publication.title}</h3>
      <p class="venue">${publication.publisher}${publication.type === "conference" && publication.slug ? ` · ${publication.slug.trim()}` : ""}</p>
      ${publication.doi ? `<a class="doi" href="${publication.doi}" target="_blank" rel="noopener noreferrer">${linkLabel(publication.doi)} ↗</a>` : ""}
    </div>
  </li>`).join("");

document.getElementById("copyright-year").textContent = new Date().getFullYear();
