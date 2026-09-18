/* ═══════════════════════════════════════════
   VERITY FINANCE LAB — Frontend Engine
   ═══════════════════════════════════════════ */

const fileMap = {
  income: "files/income_statement.csv",
  balance: "files/balance_sheet.csv",
  cash: "files/cash_flow_statement.csv",
  ratios: "files/financial_ratios.csv",
  working: "files/working_capital_detail.csv",
  narrative: "files/narrative_excerpts.csv",
  qa: "files/golden_qa_set.csv",
  config: "files/system_config.csv",
};

const fallbackCsv = {
  income: `company,period,fiscal_year,quarter,revenue_usd,cost_of_goods_sold_usd,gross_profit_usd,gross_margin_pct,operating_expenses_usd,ebitda_usd,ebitda_margin_pct,depreciation_amortization_usd,ebit_usd,interest_expense_usd,pre_tax_income_usd,tax_expense_usd,net_income_usd,net_margin_pct,earnings_per_share_usd,shares_outstanding_m
AlphaCorp,Annual,FY2021,Full Year,4200000000,2520000000,1680000000,0.4000,1050000000,930000000,0.2214,180000000,750000000,45000000,705000000,176250000,528750000,0.1259,2.64,200
AlphaCorp,Annual,FY2022,Full Year,4830000000,2800000000,2030000000,0.4203,1150000000,1110000000,0.2298,195000000,915000000,42000000,873000000,218250000,654750000,0.1355,3.27,200
AlphaCorp,Annual,FY2023,Full Year,5540000000,3100000000,2440000000,0.4404,1240000000,1350000000,0.2437,210000000,1140000000,38000000,1102000000,275500000,826500000,0.1492,4.13,200
AlphaCorp,Annual,FY2024,Full Year,6120000000,3350000000,2770000000,0.4526,1310000000,1610000000,0.2631,220000000,1390000000,35000000,1355000000,338750000,1016250000,0.1660,5.08,200
BetaTech,Annual,FY2021,Full Year,3100000000,1860000000,1240000000,0.4000,775000000,620000000,0.2000,90000000,530000000,32000000,498000000,124500000,373500000,0.1205,1.87,200
BetaTech,Annual,FY2022,Full Year,3580000000,2060000000,1520000000,0.4246,860000000,800000000,0.2235,100000000,700000000,30000000,670000000,167500000,502500000,0.1403,2.51,200
BetaTech,Annual,FY2023,Full Year,3920000000,2195000000,1725000000,0.4400,900000000,925000000,0.2360,110000000,815000000,28000000,787000000,196750000,590250000,0.1506,2.95,200
BetaTech,Annual,FY2024,Full Year,4150000000,2282000000,1868000000,0.4502,940000000,1028000000,0.2478,115000000,913000000,26000000,887000000,221750000,665250000,0.1603,3.33,200`,
  cash: `company,fiscal_year,net_income_usd,depreciation_amortization_usd,changes_in_working_capital_usd,other_operating_adjustments_usd,operating_cash_flow_usd,capex_usd,acquisitions_usd,other_investing_usd,investing_cash_flow_usd,dividends_paid_usd,share_repurchases_usd,debt_repayment_usd,other_financing_usd,financing_cash_flow_usd,net_change_in_cash_usd,free_cash_flow_usd,fcf_margin_pct
AlphaCorp,FY2021,528750000,180000000,-42000000,25000000,691750000,-220000000,0,-15000000,-235000000,-52875000,-100000000,-50000000,5000,-197875000,258875000,471750000,0.1123
AlphaCorp,FY2022,654750000,195000000,-58000000,28000000,819750000,-250000000,-80000000,-18000000,-348000000,-65475000,-120000000,-40000000,6000,-219475000,252275000,569750000,0.1179
AlphaCorp,FY2023,826500000,210000000,-65000000,32000000,1003500000,-280000000,0,-20000000,-300000000,-82650000,-150000000,-40000000,7000,-265650000,437850000,723500000,0.1306
AlphaCorp,FY2024,1016250000,220000000,-72000000,36000000,1200250000,-310000000,0,-22000000,-332000000,-101625000,-180000000,-40000000,8000,-313625000,554625000,890250000,0.1454
BetaTech,FY2021,373500000,90000000,-31000000,18000000,450500000,-160000000,0,-12000000,-172000000,-37350000,-75000000,-35000000,4000,-143350000,135150000,290500000,0.0937
BetaTech,FY2022,502500000,100000000,-42000000,22000000,582500000,-190000000,0,-14000000,-204000000,-50250000,-90000000,-30000000,5000,-165250000,213250000,392500000,0.1097
BetaTech,FY2023,590250000,110000000,-48000000,25000000,677250000,-220000000,0,-16000000,-236000000,-59025000,-105000000,-25000000,6000,-183025000,258225000,457250000,0.1167
BetaTech,FY2024,665250000,115000000,-42000000,27000000,765250000,-245000000,0,-17000000,-262000000,-66525000,-110000000,-20000000,7000,-189525000,313725000,520250000,0.1254`,
  balance: `company,fiscal_year,period_end,cash_and_equivalents_usd,accounts_receivable_usd,inventory_usd,total_current_assets_usd,total_assets_usd,total_current_liabilities_usd,long_term_debt_usd,total_liabilities_usd,total_equity_usd,total_liabilities_and_equity_usd
AlphaCorp,FY2024,2024-12-31,1340000000,734400000,549600000,2777000000,4742000000,851000000,480000000,1491000000,3251000000,4742000000
BetaTech,FY2024,2024-12-31,820000000,498000000,373500000,1801500000,3321500000,600600000,320000000,1020600000,2300900000,3321500000`,
  ratios: `company,fiscal_year,revenue_growth_yoy_pct,gross_margin_pct,ebitda_margin_pct,net_margin_pct,fcf_margin_pct,current_ratio,quick_ratio,debt_to_equity_ratio,interest_coverage_ratio,return_on_equity_pct,return_on_assets_pct,return_on_invested_capital_pct,asset_turnover,inventory_turnover,receivables_days_outstanding,payables_days_outstanding,working_capital_usd,working_capital_change_yoy_usd,pe_ratio,ev_to_ebitda,price_to_book
AlphaCorp,FY2024,0.1046,0.4526,0.2631,0.1660,0.1454,3.26,2.49,0.1476,39.71,0.3124,0.2144,0.2584,1.2909,6.09,43.8,43.8,1926000000,421400000,13.2,8.5,2.1
BetaTech,FY2024,0.0587,0.4502,0.2478,0.1603,0.1254,3.00,2.37,0.1760,35.12,0.2891,0.2003,0.2410,1.2494,6.11,43.8,43.8,1200900000,179750000,13.9,8.9,2.0`,
  working: `company,fiscal_year,net_working_capital_usd,wc_as_pct_revenue,cash_conversion_cycle_days,days_sales_outstanding,days_inventory_outstanding,days_payable_outstanding,yoy_wc_change_usd,yoy_wc_change_pct
AlphaCorp,FY2024,537000000,0.0877,57.3,43.8,59.9,43.8,52400000,0.1081
BetaTech,FY2024,380900000,0.0178,56.6,43.8,59.8,43.8,40750000,0.1198`,
  narrative: `doc_id,company,fiscal_year,section,page_ref,excerpt_text,verified_metric,verified_value,contradiction_flag,notes
N001,AlphaCorp,FY2024,CEO Letter,p.2,"Revenue growth of 10.5% in FY2024 reflects strong demand across our core product lines.",revenue_growth_yoy_pct,0.1046,FALSE,Narrative matches computed 10.46% growth
N005,BetaTech,FY2024,MD&A,p.6,"Revenue growth decelerated to approximately 6% in FY2024 as market saturation offset gains.",revenue_growth_yoy_pct,0.0587,FALSE,5.87% growth is acceptable
N009,BetaTech,FY2021,MD&A,p.8,"Strong top-line performance with 15% revenue growth drove margin expansion.",revenue_growth_yoy_pct,,TRUE,No FY2020 baseline available`,
  qa: `qa_id,question,company,fiscal_year,question_type,required_data_sources,python_formula,expected_answer_value,expected_answer_unit,tolerance_pct,expected_narrative_elements,contradiction_expected,difficulty
Q001,What was AlphaCorp's revenue growth rate in FY2024?,AlphaCorp,FY2024,revenue_growth,income_statement,(revenue_fy2024 - revenue_fy2023) / revenue_fy2023,0.1046,percent,0.001,"10.46% growth; FY2024 revenue $6.12B vs FY2023 $5.54B",FALSE,Easy
Q006,Compare AlphaCorp and BetaTech EBITDA margins in FY2024,Both,FY2024,cross_company_comparison,income_statement,ebitda/revenue for each,AlphaCorp:0.2631|BetaTech:0.2478,percent,0.001,"AlphaCorp 26.31% vs BetaTech 24.78%; 153bps difference",FALSE,Medium
Q009,Did BetaTech's narrative claim of 15% revenue growth in FY2021 match the numbers?,BetaTech,FY2021,contradiction_detection,income_statement+narrative,yoy_revenue_growth_fy2021,NOT_COMPUTABLE,N/A,0,Contradiction flagged: no FY2020 baseline available,TRUE,Hard`,
  config: `config_key,config_value,description,data_type,default_value,allowed_values
retrieval_method,hybrid,Method for document retrieval,string,hybrid,"tfidf,embedding,hybrid"
numeric_tolerance_pct,0.001,Tolerance for numeric match,float,0.001,0.0001-0.05
contradiction_threshold,0.15,Relative deviation to flag contradiction,float,0.15,0.01-0.50`,
};

/* ═══════ STATE ═══════ */
const state = { data: {}, company: "", year: "", source: "files", questions: [], latestAnswer: null, upload: null };
const API_BASE = window.location.protocol === "file:" ? "http://127.0.0.1:8000" : "";

const $ = (sel) => document.querySelector(sel);
const money = (v) => {
  const n = Number(v || 0);
  if (Math.abs(n) >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toLocaleString()}`;
};
const pct = (v) => `${(Number(v || 0) * 100).toFixed(2)}%`;
const num = (v, d = 2) => Number(v || 0).toFixed(d);
const clean = (k) => k.replaceAll("_", " ").replace(/\busd\b/gi, "$").replace(/\bpct\b/gi, "%");
const esc = (v) =>
  String(v ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

/* ═══════ CSV PARSER ═══════ */
function parseCsv(text) {
  const rows = [];
  let row = [], value = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && quoted && n === '"') { value += '"'; i++; }
    else if (c === '"') { quoted = !quoted; }
    else if (c === "," && !quoted) { row.push(value); value = ""; }
    else if ((c === "\n" || c === "\r") && !quoted) {
      if (value || row.length) { row.push(value); rows.push(row); row = []; value = ""; }
      if (c === "\r" && n === "\n") i++;
    } else { value += c; }
  }
  if (value || row.length) { row.push(value); rows.push(row); }
  const headers = rows.shift() || [];
  return rows.filter(Boolean).map((cells) => {
    const rec = {};
    headers.forEach((h, i) => {
      const raw = cells[i] ?? "";
      rec[h] = raw !== "" && !isNaN(Number(raw)) ? Number(raw) : raw;
    });
    return rec;
  });
}

/* ═══════ DATA LOADING ═══════ */
async function loadData() {
  const entries = await Promise.all(
    Object.entries(fileMap).map(async ([key, path]) => {
      try {
        const r = await fetch(path);
        if (!r.ok) throw new Error();
        return [key, parseCsv(await r.text()), true];
      } catch {
        state.source = "fallback";
        return [key, parseCsv(fallbackCsv[key]), false];
      }
    })
  );
  entries.forEach(([k, r]) => { state.data[k] = r; });
}

async function loadModelMetadata() {
  try {
    const r = await fetch("/api/metadata");
    if (!r.ok) throw new Error();
    const m = await r.json();
    state.questions = m.questions || [];
    $("#modelStatus").textContent = "Python engine online";
    $("#modelStatus").style.background = "linear-gradient(135deg, var(--leaf), #059669)";
  } catch {
    state.questions = state.data.qa.map((r) => r.question).filter(Boolean);
    $("#modelStatus").textContent = "Dashboard mode";
  }
}

/* ═══════ HELPERS ═══════ */
function annualIncome(company = state.company) {
  return state.data.income
    .filter((r) => r.company === company && r.period === "Annual")
    .sort((a, b) => String(a.fiscal_year).localeCompare(String(b.fiscal_year)));
}

function rowFor(table, company = state.company, year = state.year) {
  return state.data[table].find((r) => r.company === company && r.fiscal_year === year) || {};
}

/* ═══════ SELECTORS ═══════ */
function populateSelectors() {
  const companies = [...new Set(state.data.income.map((r) => r.company))];
  state.company = companies[0] || "";
  $("#companySelect").innerHTML = companies.map((c) => `<option>${c}</option>`).join("");
  populateYears();
}

function populateYears() {
  const years = [...new Set(annualIncome(state.company).map((r) => r.fiscal_year))];
  state.year = years.at(-1) || "";
  $("#yearSelect").innerHTML = years.map((y) => `<option ${y === state.year ? "selected" : ""}>${y}</option>`).join("");
}

/* ═══════ METRICS ═══════ */
function renderMetrics() {
  const inc = rowFor("income");
  const rat = rowFor("ratios");
  const cash = rowFor("cash");
  const metrics = [
    ["Revenue", money(inc.revenue_usd), `${pct(rat.revenue_growth_yoy_pct)} YoY`, "var(--aqua)"],
    ["Gross Margin", pct(inc.gross_margin_pct), `${num((inc.gross_margin_pct - 0.4) * 100, 0)} pts over 40%`, "var(--leaf)"],
    ["Free Cash Flow", money(cash.free_cash_flow_usd), `${pct(cash.fcf_margin_pct)} margin`, "var(--plum)"],
    ["Interest Cover", `${num(rat.interest_coverage_ratio)}x`, `D/E ${num(rat.debt_to_equity_ratio)}x`, "var(--ochre)"],
  ];
  $("#metricGrid").innerHTML = metrics
    .map(([l, v, d, c]) => `<article class="metric"><span>${l}</span><strong style="color:${c}">${v}</strong><em>${d}</em></article>`)
    .join("");
}

/* ═══════ THESIS ═══════ */
function renderThesis() {
  const inc = rowFor("income");
  const rat = rowFor("ratios");
  const claims = state.data.narrative.filter((r) => r.company === state.company && r.fiscal_year === state.year);
  const flags = claims.filter((r) => String(r.contradiction_flag).toUpperCase() === "TRUE").length;
  const score = Math.max(72, Math.round(96 - flags * 12 - Math.max(0, 0.16 - Number(inc.net_margin_pct || 0)) * 80));
  $("#qualityScore").textContent = score;
  $("#thesisTitle").textContent = `${state.company} ${state.year}: ${pct(rat.revenue_growth_yoy_pct)} growth, ${pct(inc.net_margin_pct)} net margin.`;
  $("#thesisText").textContent =
    `${money(inc.revenue_usd)} revenue, ${money(inc.net_income_usd)} net income, ${num(rat.interest_coverage_ratio)}x interest coverage. ` +
    `${claims.length} narrative claim${claims.length === 1 ? "" : "s"} linked, ${flags} contradiction flag${flags === 1 ? "" : "s"}.`;
}

/* ═══════ TREND CHART ═══════ */

function buildSvgChart(values, labels, formatFn) {
  if (!values || !values.length) return `<div style="display:grid;place-items:center;height:100%;color:var(--muted);font-size:0.85rem">No data available</div>`;
  
  let yMin = Math.min(...values);
  let yMax = Math.max(...values);
  if (yMin === yMax) { yMin = Math.min(0, yMin); yMax = yMax > 0 ? yMax * 1.2 : 1; }
  let range = yMax - yMin || 1;

  const getP = (v, i) => {
    const x = values.length > 1 ? 8 + (i / (values.length - 1)) * 84 : 50;
    const y = 80 - ((v - yMin) / range) * 60; 
    return { x, y, v, l: labels[i] };
  };

  const pts = values.map(getP);
  
  let dLine = "";
  if (pts.length === 1) {
    dLine = `M ${pts[0].x - 10},${pts[0].y} L ${pts[0].x + 10},${pts[0].y}`;
  } else {
    dLine = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(" ");
  }

  const dArea = pts.length > 1 
    ? `${dLine} L ${pts[pts.length - 1].x},90 L ${pts[0].x},90 Z`
    : "";

  const gradId = 'lineGrad_' + Math.random().toString(36).substring(7);
  const svg = `
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; overflow: visible; z-index: 1;">
      <defs>
        <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0ea5e9" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#0ea5e9" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      ${dArea ? `<path d="${dArea}" fill="url(#${gradId})" />` : ''}
      <path d="${dLine}" fill="none" stroke="#0ea5e9" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;

  const htmlPts = pts.map(p => {
    const formatted = formatFn ? formatFn(p.v) : p.v;
    return `
      <div class="chart-dot" style="left: ${p.x}%; top: ${p.y}%;" title="${p.l}: ${formatted}"></div>
      <div class="chart-label" style="left: ${p.x}%; top: calc(${p.y}% - 32px);">
        <strong style="color:var(--ink); font-size:0.75rem;">${p.l}</strong><br/>
        <span style="color:var(--aqua); font-weight:700; font-size:0.75rem;">${formatted}</span>
      </div>
    `;
  }).join("");

  return `<div style="position: relative; width: 100%; height: 260px; padding-top: 10px;">${svg}${htmlPts}</div>`;
}

function renderTrend() {
  const metric = $("#trendMetric").value;
  const source = metric === "free_cash_flow_usd"
    ? state.data.cash.filter((r) => r.company === state.company)
    : annualIncome();
  const values = source.map(r => Number(r[metric] || 0));
  const labels = source.map(r => r.fiscal_year);
  const fmt = metric.includes('pct') ? pct : money;
  $("#trendChart").innerHTML = buildSvgChart(values, labels, fmt);
}

/* ═══════ PEERS ═══════ */
function renderPeers() {
  const metricsArr = ["revenue_usd", "ebitda_margin_pct", "net_margin_pct", "interest_coverage_ratio"];
  const rows = metricsArr.map((m) => {
    const aI = rowFor("income", "AlphaCorp", "FY2024");
    const bI = rowFor("income", "BetaTech", "FY2024");
    const aR = rowFor("ratios", "AlphaCorp", "FY2024");
    const bR = rowFor("ratios", "BetaTech", "FY2024");
    const a = m in aI ? aI[m] : aR[m];
    const b = m in bI ? bI[m] : bR[m];
    const max = Math.max(Number(a || 0), Number(b || 0), 1);
    const fmt = m.includes("pct") ? pct : m.includes("usd") ? money : (v) => `${num(v)}x`;
    return `
      <div class="peer-row">
        <strong>${clean(m)}</strong>
        <span class="delta">${fmt(a)} / ${fmt(b)}</span>
        <div class="peer-bars">
          <div class="mini-bar"><span style="width:${(a / max) * 100}%"></span></div>
          <div class="mini-bar beta"><span style="width:${(b / max) * 100}%"></span></div>
        </div>
      </div>`;
  });
  $("#peerGrid").innerHTML = rows.join("");
}

/* ═══════ STATEMENT TABLE ═══════ */
function renderStatement() {
  const key = $("#statementSelect").value;
  const rows = state.data[key].filter((r) => r.company === state.company);
  const keys = Object.keys(rows[0] || {}).filter((k) => !["company", "period_end"].includes(k)).slice(0, 10);
  $("#statementTable").innerHTML = `
    <thead><tr>${keys.map((k) => `<th>${clean(k)}</th>`).join("")}</tr></thead>
    <tbody>
      ${rows.map((r) => `<tr>${keys.map((k) => {
        const v = r[k];
        return `<td>${k.includes("usd") ? money(v) : k.includes("pct") ? pct(v) : v}</td>`;
      }).join("")}</tr>`).join("")}
    </tbody>`;
}

/* ═══════ COMPOSITION ═══════ */
function renderComposition() {
  const b = rowFor("balance");
  const total = Number(b.total_assets_usd || b.total_liabilities_and_equity_usd || 1);
  const items = [
    ["Cash", b.cash_and_equivalents_usd, "var(--aqua)"],
    ["Receivables", b.accounts_receivable_usd, "var(--plum)"],
    ["Inventory", b.inventory_usd, "var(--ochre)"],
    ["Equity", b.total_equity_usd, "var(--leaf)"],
    ["Liabilities", b.total_liabilities_usd, "var(--ember)"],
  ].filter(([, v]) => v !== undefined);
  $("#compositionYear").textContent = state.year;
  $("#composition").innerHTML = items
    .map(([l, v, c]) => `
      <div class="comp-row">
        <strong>${l}</strong>
        <div class="comp-track"><span style="width:${Math.min(100, (Number(v) / total) * 100)}%;background:${c}"></span></div>
        <span>${money(v)}</span>
      </div>`)
    .join("");
}

/* ═══════ VERIFICATION ═══════ */
function buildChecks() {
  const inc = rowFor("income");
  const cash = rowFor("cash");
  const rat = rowFor("ratios");
  const bal = rowFor("balance");
  const checks = [];
  const close = (a, b, t = 0.002) => Math.abs(Number(a || 0) - Number(b || 0)) <= t;

  const gm = inc.revenue_usd ? inc.gross_profit_usd / inc.revenue_usd : 0;
  checks.push(["Gross margin recomputes", `Gross profit / revenue = ${pct(gm)}; stored ${pct(inc.gross_margin_pct)}`, close(gm, inc.gross_margin_pct)]);

  const nm = inc.revenue_usd ? inc.net_income_usd / inc.revenue_usd : 0;
  checks.push(["Net margin recomputes", `Net income / revenue = ${pct(nm)}; stored ${pct(inc.net_margin_pct)}`, close(nm, inc.net_margin_pct)]);

  const ic = inc.interest_expense_usd ? inc.ebit_usd / inc.interest_expense_usd : 0;
  checks.push(["Interest coverage ties", `EBIT / interest = ${num(ic)}x; ratio ${num(rat.interest_coverage_ratio)}x`, Math.abs(ic - Number(rat.interest_coverage_ratio || 0)) < 0.04]);

  const fm = inc.revenue_usd ? cash.free_cash_flow_usd / inc.revenue_usd : 0;
  checks.push(["FCF margin ties to revenue", `FCF / revenue = ${pct(fm)}; cash flow ${pct(cash.fcf_margin_pct)}`, close(fm, cash.fcf_margin_pct)]);

  if (bal.total_assets_usd && bal.total_liabilities_and_equity_usd) {
    checks.push(["Balance sheet balances", `${money(bal.total_assets_usd)} assets vs ${money(bal.total_liabilities_and_equity_usd)} L+E`, bal.total_assets_usd === bal.total_liabilities_and_equity_usd]);
  }

  const fc = state.data.narrative.filter((r) => r.company === state.company && String(r.contradiction_flag).toUpperCase() === "TRUE").length;
  checks.push(["Narrative contradiction screen", `${fc} flag${fc === 1 ? "" : "s"} for ${state.company}`, fc === 0, fc ? "warn" : "pass"]);
  return checks;
}

function renderChecks() {
  const checks = buildChecks();
  const passed = checks.filter((c) => c[2]).length;
  $("#checkSummary").textContent = `${passed}/${checks.length} passed`;
  $("#checkList").innerHTML = checks
    .map(([t, d, ok, m]) => {
      const k = ok ? "" : m === "warn" ? "warn" : "fail";
      return `<div class="check-row ${k}"><span class="check-icon">${ok ? "✓" : "!"}</span><div><strong>${t}</strong><small>${d}</small></div><span class="delta">${ok ? "Pass" : "Review"}</span></div>`;
    })
    .join("");
}

/* ═══════ NARRATIVE ═══════ */
function renderNarrative() {
  const claims = state.data.narrative.filter((r) => r.company === state.company || r.company === "Both");
  $("#claimCount").textContent = `${claims.length} claims`;
  $("#claimList").innerHTML = claims
    .map((c) => {
      const flag = String(c.contradiction_flag).toUpperCase() === "TRUE";
      return `<article class="claim ${flag ? "flag" : ""}">
        <strong>${c.doc_id} — ${c.company} ${c.fiscal_year} — ${c.section} ${c.page_ref}</strong>
        <blockquote>${c.excerpt_text}</blockquote>
        <small>${clean(c.verified_metric)} = ${c.verified_value || "not computable"} — ${c.notes}</small>
      </article>`;
    })
    .join("");

  $("#configList").innerHTML = state.data.config
    .map((r) => `<div class="config-row"><div><strong>${clean(r.config_key)}</strong><small>${r.description}</small></div><span class="delta">${r.config_value}</span></div>`)
    .join("");
}

/* ═══════ QA LAB ═══════ */
function renderQaOptions() {
  $("#qaSelect").innerHTML = state.data.qa.map((r, i) => `<option value="${i}">${r.qa_id} — ${r.difficulty}</option>`).join("");
}

function renderQuestionOptions() {
  $("#questionSelect").innerHTML = state.questions.map((q, i) => `<option value="${i}">${q}</option>`).join("");
  $("#questionInput").value = state.questions[0] || "";
}

function renderQa() {
  const qa = state.data.qa[Number($("#qaSelect").value || 0)] || {};
  $("#qaDifficulty").textContent = `${qa.difficulty || "Easy"} — ${qa.question_type || "qa"}`;
  $("#qaQuestion").textContent = qa.question || "No question selected";
  $("#qaAnswer").textContent = qa.expected_narrative_elements || "";
  $("#qaFormula").textContent = qa.python_formula || "";
  $("#qaMeta").innerHTML = `
    <span class="pill">Expected: ${qa.expected_answer_value ?? ""} ${qa.expected_answer_unit ?? ""}</span>
    <span class="pill">Tolerance: ${qa.tolerance_pct ?? ""}</span>
    <span class="pill">Sources: ${qa.required_data_sources ?? ""}</span>`;
}

/* ═══════ TOAST ═══════ */
function showToast(msg) {
  $("#toast").textContent = msg;
  $("#toast").classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => $("#toast").classList.remove("show"), 2800);
}

/* ═══════ MODEL CHART ═══════ */
function fmtChart(v, f) {
  if (f === "percent") return pct(v);
  if (f === "money") return money(v);
  return Number(v || 0).toFixed(2).replace(/\.00$/, "");
}

function renderModelChart(chart = {}) {
  const vals = chart.values || [];
  const labels = chart.labels || [];
  $("#modelChart").innerHTML = buildSvgChart(vals, labels, chart.format === "percent" ? pct : money);
}

/* ═══════ TRACE & CITATIONS ═══════ */
function renderTrace(answer) {
  const t = answer?.trace || [];
  $("#traceList").innerHTML = t.length
    ? t.map((i) => `<div class="trace-row"><strong>${i.label}</strong><span class="delta">${i.value}</span><code>${i.formula}</code><small>${i.source}</small></div>`).join("")
    : `<div class="trace-row"><strong>No calculation yet</strong><small>Ask a question to generate the trace.</small></div>`;
}

function renderCitations(answer) {
  const c = answer?.citations || [];
  $("#citationCount").textContent = `${c.length} chunks`;
  $("#citationList").innerHTML = c.length
    ? c.map((i) => `<article class="citation"><strong>${i.kind} — ${i.title}</strong><p>${i.text}</p><small>Retrieval score ${i.score}</small></article>`).join("")
    : `<article class="citation"><strong>No citations yet</strong><p>Ask a question to retrieve supporting text.</p></article>`;
}

/* ═══════ UPLOAD ANALYSIS ═══════ */
function getColumns(rows) { return Object.keys(rows[0] || {}); }
function numericColumns(rows) { return getColumns(rows).filter((c) => rows.some((r) => typeof r[c] === "number" && isFinite(r[c]))); }
function findCol(cols, pats) { return cols.find((c) => pats.some((p) => c.toLowerCase().includes(p))); }
function uploadLabel(r, i, lc) { return lc ? r[lc] : `Row ${i + 1}`; }

function analyzeUploadedRows(rows) {
  const columns = getColumns(rows);
  const numeric = numericColumns(rows);
  const labelColumn = findCol(columns, ["fiscal_year", "year", "date", "period", "quarter", "month"]) || columns.find((c) => typeof rows[0]?.[c] === "string");
  const revenueColumn = findCol(numeric, ["revenue", "sales", "income_total", "turnover"]);
  const profitColumn = findCol(numeric, ["net_income", "profit", "earnings", "ebit", "ebitda"]);
  const costColumn = findCol(numeric, ["cost", "expense", "cogs", "opex"]);
  const marginColumn = findCol(numeric, ["margin", "gross_margin", "net_margin"]);
  const defaultMetric = profitColumn || revenueColumn || numeric[0] || "";
  const labels = rows.map((r, i) => uploadLabel(r, i, labelColumn));
  const insights = [];

  // Profit analysis
  if (profitColumn) {
    const profitRows = rows.map((r, i) => ({ row: r, index: i, value: Number(r[profitColumn] || 0) }));
    const best = profitRows.reduce((w, item) => (item.value > w.value ? item : w), profitRows[0]);
    const worst = profitRows.reduce((l, item) => (item.value < l.value ? item : l), profitRows[0]);
    const profitable = profitRows.filter((i) => i.value > 0);
    const losses = profitRows.filter((i) => i.value < 0);
    insights.push({
      tone: profitable.length ? "good" : "warn",
      title: profitable.length ? `✅ Profit in ${profitable.length} of ${rows.length} periods` : "⚠️ No profitable period detected",
      text: profitable.length
        ? `Best: ${money(best.value)} at ${uploadLabel(best.row, best.index, labelColumn)}. Worst: ${money(worst.value)} at ${uploadLabel(worst.row, worst.index, labelColumn)}.`
        : `The detected profit column "${clean(profitColumn)}" never rises above zero.`,
    });
    if (losses.length) {
      insights.push({
        tone: "warn",
        title: `📉 Loss in ${losses.length} period${losses.length === 1 ? "" : "s"}`,
        text: losses.map((i) => `${uploadLabel(i.row, i.index, labelColumn)}: ${money(i.value)}`).join(", "),
      });
    }
  }

  // Revenue growth
  if (revenueColumn && rows.length > 1) {
    const first = Number(rows[0][revenueColumn] || 0);
    const last = Number(rows.at(-1)[revenueColumn] || 0);
    const growth = first ? (last - first) / Math.abs(first) : 0;
    insights.push({
      tone: growth >= 0 ? "good" : "warn",
      title: `${growth >= 0 ? "📈" : "📉"} Revenue ${growth >= 0 ? "grew" : "declined"} ${Math.abs(growth * 100).toFixed(2)}%`,
      text: `${clean(revenueColumn)} moved from ${money(first)} to ${money(last)} across the period.`,
    });
  }

  // Margin progression
  if (profitColumn && revenueColumn && rows.length > 1) {
    const firstM = Number(rows[0][revenueColumn] || 0) ? Number(rows[0][profitColumn] || 0) / Number(rows[0][revenueColumn]) : 0;
    const lastM = Number(rows.at(-1)[revenueColumn] || 0) ? Number(rows.at(-1)[profitColumn] || 0) / Number(rows.at(-1)[revenueColumn]) : 0;
    insights.push({
      tone: lastM >= firstM ? "good" : "warn",
      title: `${lastM >= firstM ? "✅" : "⚠️"} Profit margin ${lastM >= firstM ? "improved" : "compressed"}`,
      text: `Margin from ${pct(firstM)} → ${pct(lastM)}. ${lastM >= firstM ? "Revenue converted to profit more efficiently." : "Costs absorbed more of revenue."}`,
    });
  }

  // Possible reason
  if (revenueColumn && costColumn && rows.length > 1) {
    const revMove = Number(rows.at(-1)[revenueColumn] || 0) - Number(rows[0][revenueColumn] || 0);
    const costMove = Number(rows.at(-1)[costColumn] || 0) - Number(rows[0][costColumn] || 0);
    const reason =
      revMove > 0 && costMove < revMove
        ? "💡 Likely reason: Revenue increased faster than costs — operational leverage improved."
        : revMove > 0 && costMove >= revMove
          ? "💡 Likely reason: Cost growth matched or exceeded revenue growth — margin pressure."
          : "💡 Likely reason: Revenue pressure reduced profitability.";
    insights.push({ tone: costMove < revMove ? "good" : "warn", title: "Root cause analysis", text: reason });
  }

  // YoY growth rates
  if (revenueColumn && rows.length > 2) {
    const growthRates = [];
    for (let i = 1; i < rows.length; i++) {
      const prev = Number(rows[i - 1][revenueColumn] || 0);
      const curr = Number(rows[i][revenueColumn] || 0);
      if (prev) growthRates.push({ period: uploadLabel(rows[i], i, labelColumn), rate: (curr - prev) / Math.abs(prev) });
    }
    if (growthRates.length) {
      const fastest = growthRates.reduce((a, b) => (b.rate > a.rate ? b : a));
      const slowest = growthRates.reduce((a, b) => (b.rate < a.rate ? b : a));
      insights.push({
        tone: "",
        title: "📊 Period-over-period growth breakdown",
        text: `Fastest growth: ${pct(fastest.rate)} at ${fastest.period}. Slowest: ${pct(slowest.rate)} at ${slowest.period}.`,
      });
    }
  }

  if (!insights.length) {
    insights.push({
      tone: "",
      title: "CSV parsed successfully",
      text: `Detected ${rows.length} rows and ${columns.length} columns. Select a numeric field to graph it.`,
    });
  }

  return { columns, numeric, labelColumn, revenueColumn, profitColumn, costColumn, marginColumn, defaultMetric, labels, insights };
}

function renderUploadMetrics(analysis, rows) {
  const cards = [
    ["Rows", rows.length.toLocaleString(), `${analysis.columns.length} columns`],
    ["Numeric Fields", analysis.numeric.length.toLocaleString(), analysis.numeric.slice(0, 3).map(clean).join(", ") || "None"],
    ["Time Label", analysis.labelColumn ? clean(analysis.labelColumn) : "Row index", "Auto detected"],
    ["Primary Metric", analysis.defaultMetric ? clean(analysis.defaultMetric) : "None", "Used for graph"],
  ];
  $("#uploadMetrics").innerHTML = cards
    .map(([l, v, d]) => `<article class="metric"><span>${l}</span><strong>${esc(v)}</strong><em>${esc(d)}</em></article>`)
    .join("");
}

function renderUploadChart() {
  const upload = state.upload;
  if (!upload?.rows?.length) {
    $("#uploadChartTitle").textContent = "Upload a CSV to begin";
    $("#uploadChart").innerHTML = `<div style="display:grid;place-items:center;height:100%;color:var(--muted);font-size:0.85rem">Upload a CSV with at least one numeric column.</div>`;
    return;
  }

  const metric = $("#uploadMetricSelect").value;
  if (!metric || !upload.analysis.numeric.includes(metric)) {
    $("#uploadChartTitle").textContent = "No numeric field available";
    $("#uploadChart").innerHTML = `<div style="display:grid;place-items:center;height:100%;color:var(--muted);font-size:0.85rem">The uploaded CSV has no numeric column to graph.</div>`;
    return;
  }

  const labels = upload.analysis.labels;
  const values = upload.rows.map((row) => Number(row[metric] || 0));
  const fmt = money;
  $("#uploadChartTitle").textContent = `${clean(metric)} over time`;
  $("#uploadChart").innerHTML = buildSvgChart(values, labels, fmt);
}

function renderUploadProfitChart(rows, analysis) {
  const col = analysis.profitColumn;
  if (!col) return;
  const vals = rows.map((r) => Number(r[col] || 0));
  const profitable = vals.filter((v) => v > 0).length;
  $("#uploadProfitSummary").textContent = `${profitable}/${vals.length} profitable`;
  $("#uploadProfitTitle").textContent = `${clean(col)} by period`;
  const labels = rows.map((r, i) => uploadLabel(r, i, analysis.labelColumn));
  $("#uploadProfitChart").innerHTML = buildSvgChart(vals, labels, money);
}

function renderUploadMarginChart(rows, analysis) {
  if (!analysis.profitColumn || !analysis.revenueColumn) return;
  const margins = rows.map((r) => {
    const rev = Number(r[analysis.revenueColumn] || 0);
    return rev ? Number(r[analysis.profitColumn] || 0) / rev : 0;
  });
  const firstM = margins[0] || 0;
  const lastM = margins.at(-1) || 0;
  $("#uploadMarginSummary").textContent = `${pct(firstM)} → ${pct(lastM)}`;
  $("#uploadMarginTitle").textContent = "Profit margin trend";
  const labels = rows.map((r, i) => uploadLabel(r, i, analysis.labelColumn));
  $("#uploadMarginChart").innerHTML = buildSvgChart(margins, labels, pct);
}

function renderUploadTable(rows, columns) {
  const vRows = rows.slice(0, 25);
  const vCols = columns.slice(0, 10);
  $("#uploadTable").innerHTML = `
    <thead><tr>${vCols.map((c) => `<th>${esc(clean(c))}</th>`).join("")}</tr></thead>
    <tbody>
      ${vRows.map((r) => `<tr>${vCols.map((c) => `<td>${esc(r[c])}</td>`).join("")}</tr>`).join("")}
    </tbody>`;
}

function renderUploadInsights(rows, fileName) {
  const analysis = analyzeUploadedRows(rows);
  state.upload = { rows, analysis, fileName };
  $("#uploadName").textContent = fileName;
  $("#uploadRowCount").textContent = `${rows.length} rows`;
  $("#uploadMetricSelect").innerHTML = analysis.numeric.map((c) => `<option value="${esc(c)}">${esc(clean(c))}</option>`).join("");
  $("#uploadMetricSelect").value = analysis.defaultMetric;
  $("#uploadInsights").innerHTML = analysis.insights
    .map((i) => `<div class="insight-row ${i.tone}"><strong>${esc(i.title)}</strong><small>${esc(i.text)}</small></div>`)
    .join("");
  renderUploadMetrics(analysis, rows);
  renderUploadChart();
  renderUploadTable(rows, analysis.columns);

  // Show extra dashboard charts if profit detected
  const dash = $("#uploadDashboard");
  if (analysis.profitColumn) {
    dash.style.display = "grid";
    renderUploadProfitChart(rows, analysis);
    renderUploadMarginChart(rows, analysis);
  } else {
    dash.style.display = "none";
  }
}

/* ═══════ LOCAL ANSWER ═══════ */
function localAnswer(question) {
  const normalizedQuestion = question.trim().toLowerCase();
  if (/^(hi|hello|hey|thanks|thank you)[!. ]*$/.test(normalizedQuestion)) {
    return {
      answer: "Hello. Ask me about revenue growth, margins, working capital, or another financial metric.",
      company: state.company,
      year: state.year,
      confidence: 0,
      trace: [],
      citations: [],
      chart: { labels: [], values: [], format: "money" },
    };
  }

  if (/^(ok|okay|got it|great|sure)[!. ]*$/.test(normalizedQuestion)) {
    return {
      answer: "Great. Ask me about a company metric or financial topic whenever you are ready.",
      company: state.company,
      year: state.year,
      confidence: 0,
      trace: [],
      citations: [],
      chart: { labels: [], values: [], format: "money" },
    };
  }

  const qa = state.data.qa.find((r) => r.question.toLowerCase() === normalizedQuestion);
  if (!qa) {
    return {
      answer: "I can help explain the financial data in this dashboard. Try asking about revenue growth, gross margin, operating margin, liquidity, working capital, ROE, or debt-to-equity.",
      company: state.company,
      year: state.year,
      confidence: 0,
      trace: [],
      citations: [],
      chart: { labels: [], values: [], format: "money" },
    };
  }

  return {
    answer: qa.expected_narrative_elements || "Model API is offline, but the benchmark answer is available from the golden QA file.",
    company: qa.company || state.company,
    year: qa.fiscal_year || state.year,
    confidence: 78,
    trace: [{
      label: "Golden answer",
      formula: qa.python_formula || "stored benchmark",
      value: `${qa.expected_answer_value || ""} ${qa.expected_answer_unit || ""}`,
      source: qa.required_data_sources || "golden_qa_set.csv",
    }],
    citations: state.data.narrative.slice(0, 3).map((r) => ({
      kind: "Narrative",
      title: `${r.doc_id} ${r.company} ${r.fiscal_year}`,
      text: r.excerpt_text,
      score: 1,
    })),
    chart: { labels: annualIncome().map((r) => r.fiscal_year), values: annualIncome().map((r) => r.revenue_usd), format: "money" },
  };
}

/* ═══════ ASK MODEL ═══════ */
async function askModel() {
  const question = $("#questionInput").value.trim() || state.questions[0] || "What was AlphaCorp's revenue growth rate in FY2024?";
  $("#askButton").disabled = true;
  $("#askButton").innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke-dasharray="31.4" stroke-dashoffset="10"><animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/></circle></svg> Calculating...`;
  try {
    const r = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, company: state.company, year: state.year }),
    });
    if (!r.ok) throw new Error();
    state.latestAnswer = await r.json();
  } catch {
    state.latestAnswer = localAnswer(question);
  } finally {
    $("#askButton").disabled = false;
    $("#askButton").innerHTML = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg> Generate grounded answer`;
  }
  applyAnswer(state.latestAnswer);
  showToast("✓ Grounded answer generated with calculation trace.");
}

function applyAnswer(answer) {
  $("#answerScope").textContent = `${answer.company} — ${answer.year}`;
  $("#answerConfidence").textContent = `${answer.confidence}% confidence`;
  $("#modelAnswerTitle").textContent = "Grounded answer";
  $("#modelAnswer").textContent = `${answer.answer} ${answer.guardrail || ""}`;
  renderModelChart(answer.chart);
  renderTrace(answer);
  renderCitations(answer);
}

async function askQuestion(question) {
  try {
    const r = await fetch(`${API_BASE}/api/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, company: state.company, year: state.year }),
    });
    if (!r.ok) throw new Error();
    return await r.json();
  } catch {
    return localAnswer(question);
  }
}

/* ═══════ CHATBOT ═══════ */
function addChatMsg(msg, type = "bot") {
  const node = document.createElement("div");
  node.className = type === "user" ? "user-msg" : "bot-msg";
  if (type === "bot") {
    node.innerHTML = msg;
  } else {
    node.textContent = msg;
  }
  $("#chatMessages").appendChild(node);
  $("#chatMessages").scrollTop = $("#chatMessages").scrollHeight;
}

/* ═══════ RENDER ALL ═══════ */
function renderAll() {
  renderMetrics();
  renderThesis();
  renderTrend();
  renderPeers();
  renderStatement();
  renderComposition();
  renderChecks();
  renderNarrative();
  renderQa();
}

/* ═══════ EVENT BINDINGS ═══════ */
function bindEvents() {
  // Nav
  $("#nav").addEventListener("click", (e) => {
    const btn = e.target.closest(".nav-button");
    if (!btn) return;
    document.querySelectorAll(".nav-button").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
    btn.classList.add("active");
    document.querySelector(`[data-panel="${btn.dataset.view}"]`).classList.add("active");
  });

  // Company / Year
  $("#companySelect").addEventListener("change", (e) => { state.company = e.target.value; populateYears(); renderAll(); });
  $("#yearSelect").addEventListener("change", (e) => { state.year = e.target.value; renderAll(); });

  // Dropdowns
  $("#trendMetric").addEventListener("change", renderTrend);
  $("#statementSelect").addEventListener("change", renderStatement);
  $("#qaSelect").addEventListener("change", renderQa);
  $("#uploadMetricSelect").addEventListener("change", renderUploadChart);

  // CSV Upload
  $("#csvUpload").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const rows = parseCsv(text);
    if (!rows.length) { showToast("CSV is empty or could not be parsed."); return; }
    renderUploadInsights(rows, file.name);
    showToast(`✓ Analyzed ${rows.length} uploaded rows — insights generated.`);
  });

  // Question Select
  $("#questionSelect").addEventListener("change", (e) => {
    $("#questionInput").value = state.questions[Number(e.target.value)] || "";
  });

  // Ask Button
  $("#askButton").addEventListener("click", askModel);

  // Verification
  $("#runVerification").addEventListener("click", () => {
    renderChecks();
    showToast(`✓ Verification refreshed for ${state.company} ${state.year}.`);
  });

  // Chatbot
  $("#chatToggle").addEventListener("click", () => {
    const bot = document.querySelector(".chatbot");
    bot.classList.toggle("open");
  });
  $("#chatClose").addEventListener("click", () => document.querySelector(".chatbot").classList.remove("open"));

  $("#chatForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = $("#chatInput");
    const question = input.value.trim();
    if (!question) return;
    addChatMsg(question, "user");
    input.value = "";
    addChatMsg(`<em style="color:var(--muted)">Calculating with source data...</em>`, "bot");
    const answer = await askQuestion(question);
    // Remove loading message
    $("#chatMessages").lastElementChild.remove();
    // Format bot response with trace
    let botHtml = `<strong>Answer:</strong> ${esc(answer.answer)}`;
    if (answer.trace && answer.trace.length) {
      botHtml += `<br><br><strong style="color:var(--aqua)">Calculation trace:</strong>`;
      answer.trace.forEach((t) => {
        botHtml += `<br>• <strong>${esc(t.label)}</strong>: ${esc(t.value)} <span style="color:var(--muted);font-size:0.75rem">(${esc(t.source)})</span>`;
      });
    }
    if (answer.confidence) {
      botHtml += `<br><span style="color:var(--muted);font-size:0.75rem">Confidence: ${answer.confidence}% | ${answer.guardrail || ""}</span>`;
    }
    addChatMsg(botHtml, "bot");

    // Also update the main model card
    state.latestAnswer = answer;
    applyAnswer(answer);
  });
}

/* ═══════ INIT ═══════ */
async function init() {
  await loadData();
  await loadModelMetadata();
  populateSelectors();
  renderQaOptions();
  renderQuestionOptions();
  bindEvents();
  renderAll();
  renderTrace(null);
  renderCitations(null);

  // Init upload section
  $("#uploadMetricSelect").innerHTML = `<option>No CSV uploaded</option>`;
  $("#uploadMetrics").innerHTML = [
    ["Rows", "0", "Upload CSV"],
    ["Numeric Fields", "0", "Auto detected"],
    ["Time Label", "—", "Auto detected"],
    ["Primary Metric", "—", "Auto graph"],
  ]
    .map(([l, v, d]) => `<article class="metric"><span>${l}</span><strong>${v}</strong><em>${d}</em></article>`)
    .join("");

  const src = state.source === "files"
    ? "✓ Loaded live CSVs from the files folder."
    : "Using embedded fallback data (browser blocked CSV reads).";
  $("#datasetStatus").textContent = src;
  showToast(src);
}

init();
