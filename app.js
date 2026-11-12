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

const publicationTimeline = document.getElementById("publication-timeline-chart");
const publicationTimelineSummary = document.getElementById("publication-timeline-summary");
const publicationsPerYear = publicationsByDate.reduce((counts, publication) => {
  if (Number.isInteger(Number(publication.year))) {
    const year = publication.year;
    counts[year] ||= { journals: 0, conferences: 0 };
    counts[year][publication.type === "journal" ? "journals" : "conferences"] += 1;
  }
  return counts;
}, {});
const yearlyEntries = Object.entries(publicationsPerYear).sort(([firstYear], [secondYear]) => Number(firstYear) - Number(secondYear));

if (yearlyEntries.length) {
  const totalPublications = yearlyEntries.reduce((total, [, counts]) => total + counts.journals + counts.conferences, 0);
  const maximumCount = Math.max(...yearlyEntries.map(([, counts]) => counts.journals + counts.conferences));
  const chartWidth = Math.max(720, yearlyEntries.length * 42);
  const chartHeight = 270;
  const chartMargin = { top: 24, right: 16, bottom: 38, left: 34 };
  const plotWidth = chartWidth - chartMargin.left - chartMargin.right;
  const plotHeight = chartHeight - chartMargin.top - chartMargin.bottom;
  const columnWidth = plotWidth / yearlyEntries.length;
  const barWidth = Math.max(10, columnWidth - 9);
  const labelInterval = Math.max(1, Math.ceil(yearlyEntries.length / 12));
  const gridValues = [...new Set([0, Math.ceil(maximumCount / 2), maximumCount])];
  const yPosition = (count) => chartMargin.top + plotHeight - (count / maximumCount) * plotHeight;

  publicationTimeline.setAttribute("viewBox", `0 0 ${chartWidth} ${chartHeight}`);
  publicationTimelineSummary.textContent = `${totalPublications} publications from ${yearlyEntries[0][0]} to ${yearlyEntries[yearlyEntries.length - 1][0]}`;
  publicationTimeline.innerHTML = `
    <title>Publications by year</title>
    <desc>${publicationTimelineSummary.textContent}</desc>
    ${gridValues.map((count) => `<g><line class="chart-grid" x1="${chartMargin.left}" x2="${chartWidth - chartMargin.right}" y1="${yPosition(count)}" y2="${yPosition(count)}" /><text class="chart-axis-label" x="${chartMargin.left - 8}" y="${yPosition(count) + 4}" text-anchor="end">${count}</text></g>`).join("")}
    ${yearlyEntries.map(([year, counts], index) => {
      const journalHeight = (counts.journals / maximumCount) * plotHeight;
      const conferenceHeight = (counts.conferences / maximumCount) * plotHeight;
      const x = chartMargin.left + index * columnWidth + (columnWidth - barWidth) / 2;
      const journalY = chartMargin.top + plotHeight - journalHeight;
      const conferenceY = journalY - conferenceHeight;
      const showLabel = index % labelInterval === 0 || index === yearlyEntries.length - 1;
      const total = counts.journals + counts.conferences;
      return `<g><rect class="chart-bar journal" x="${x}" y="${journalY}" width="${barWidth}" height="${journalHeight}" rx="2"><title>${year}: ${counts.journals} journals, ${counts.conferences} conferences (${total} total)</title></rect><rect class="chart-bar conference" x="${x}" y="${conferenceY}" width="${barWidth}" height="${conferenceHeight}" rx="2"><title>${year}: ${counts.journals} journals, ${counts.conferences} conferences (${total} total)</title></rect>${showLabel ? `<text class="chart-axis-label" x="${x + barWidth / 2}" y="${chartHeight - 12}" text-anchor="middle">${year}</text>` : ""}</g>`;
    }).join("")}`;
}

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
