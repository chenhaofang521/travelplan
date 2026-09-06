/* 韩国之旅单页应用脚本 */

(function () {
  "use strict";

  const DATA = window.TRIP_DATA;
  const TODO_KEY = "koreaTripTodos";
  const EXPENSE_LOCAL_KEY = "koreaTripExpenses";

  // ---------- 通用工具 ----------
  function escapeHtml(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function pad2(n) {
    return String(n).padStart(2, "0");
  }

  function formatMoney(krwAmount) {
    const rounded = Math.round(Number(krwAmount) || 0);
    return "₩" + rounded.toLocaleString("en-US");
  }

  function formatCny(cnyAmount) {
    return "¥" + Number(cnyAmount || 0).toLocaleString("zh-CN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  function krwToCny(krwAmount) {
    const rate = Number(expenseConfig.rates.CNY) || 1;
    return Number(krwAmount || 0) / rate;
  }

  function formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    if (Number.isNaN(d.getTime())) return dateStr;
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  function getNaverSearchUrl(query) {
    return "https://map.naver.com/v5/search/" + encodeURIComponent(query);
  }

  // ---------- 1. 简明行程 ----------
  function formatShortDate(dateStr) {
    const d = new Date(dateStr + "T00:00:00");
    if (Number.isNaN(d.getTime())) return dateStr;
    const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
    return `${d.getMonth() + 1}.${d.getDate()}（${weekdays[d.getDay()]}）`;
  }

  function renderOverview() {
    const body = document.getElementById("overview-body");
    if (!body) return;

    body.innerHTML = DATA.days
      .map((day, index) => `
        <tr>
          <td class="overview-date">
            <strong>第${index + 1}天</strong>
            <small>${escapeHtml(formatShortDate(day.date))}</small>
          </td>
          <td class="overview-summary">${escapeHtml(day.title)}</td>
        </tr>
      `)
      .join("");
  }

  // ---------- 2. 每日行程时间轴 ----------
  const categoryNames = {
    flight: "航班",
    train: "火车 / 铁路",
    bus: "公交 / 大巴",
    metro: "地铁",
    hotel: "住宿",
    meal: "餐饮",
    activity: "活动",
    appointment: "预约事项",
    transport: "交通"
  };

  function renderItinerary() {
    const listEl = document.getElementById("day-list");
    if (!listEl) return;

    listEl.innerHTML = DATA.days
      .map((day, index) => {
        const openClass = index === 0 ? " open" : "";
        const hotelText = day.hotel
          ? `🏠 当晚住宿：${day.hotel}${day.hotelAddress ? "（" + day.hotelAddress + "）" : ""}`
          : "本日行程结束后返港，无住宿安排";

        const stopsHtml = day.stops
          .map((stop) => {
            const url = getNaverSearchUrl(stop.mapQuery || stop.title);
            const categoryName = categoryNames[stop.category] || stop.category;
            return `
              <li class="timeline-item">
                <span class="stop-dot"></span>
                <div class="stop-time">${escapeHtml(stop.time)}</div>
                <a class="stop-link" href="${url}" target="_blank" rel="noopener noreferrer">${escapeHtml(stop.title)}</a>
                <p class="stop-note">${escapeHtml(stop.note || "")}</p>
                <span class="category-tag">${escapeHtml(categoryName)}</span>
              </li>
            `;
          })
          .join("");

        return `
          <article class="day-card${openClass}" data-day-index="${index}">
            <button class="day-header" type="button" aria-expanded="${index === 0 ? "true" : "false"}">
              <span class="day-number">${pad2(index + 1)}</span>
              <span class="day-title-wrap">
                <h3>${escapeHtml(day.dayLabel)}</h3>
                <p>${escapeHtml(day.title)}</p>
              </span>
              <span class="day-arrow">›</span>
            </button>
            <div class="day-body">
              <p class="day-hotel">${escapeHtml(hotelText)}</p>
              <div class="day-map-container" data-day-index="${index}"></div>
              <ol class="timeline">${stopsHtml}</ol>
            </div>
          </article>
        `;
      })
      .join("");

    listEl.querySelectorAll(".day-header").forEach((header, index) => {
      header.addEventListener("click", () => {
        const card = header.closest(".day-card");
        const willOpen = !card.classList.contains("open");

        listEl.querySelectorAll(".day-card").forEach((otherCard) => {
          otherCard.classList.remove("open");
          otherCard.querySelector(".day-header").setAttribute("aria-expanded", "false");
        });

        if (willOpen) {
          card.classList.add("open");
          header.setAttribute("aria-expanded", "true");
          ensureDayMap(index);
        }
      });
    });
  }

  // ---------- 3. 每日真实地图 ----------
  const dayMaps = [];

  function getDayRouteConfig(dayIndex) {
    return DATA.map && DATA.map.dayRoutes ? DATA.map.dayRoutes[dayIndex] : null;
  }

  function getDayRoutePoints(dayIndex) {
    const config = getDayRouteConfig(dayIndex);
    if (!config) return [];
    return config.points
      .map((id) => DATA.map.cityPoints?.[config.city]?.[id])
      .filter((point) => point && Number.isFinite(point.lat) && Number.isFinite(point.lng));
  }

  function createDayMap(dayIndex) {
    const container = document.querySelector(
      `.day-map-container[data-day-index="${dayIndex}"]`
    );
    if (!container) return null;

    const points = getDayRoutePoints(dayIndex);
    if (!points.length) return null;

    const map = L.map(container, {
      scrollWheelZoom: false,
      attributionControl: true
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    const latlngs = points.map((point) => [point.lat, point.lng]);
    L.polyline(latlngs, {
      color: "#8B6F47",
      weight: 4,
      opacity: 0.85,
      dashArray: "8 8",
      lineCap: "round",
      lineJoin: "round"
    }).addTo(map);

    points.forEach((point, index) => {
      const isStart = index === 0;
      const isEnd = index === points.length - 1;
      const badgeClass = isStart
        ? "route-marker route-marker-start"
        : isEnd
          ? "route-marker route-marker-end"
          : "route-marker";
      const icon = L.divIcon({
        className: "route-marker-wrap",
        html: `<span class="${badgeClass}">${index + 1}</span>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15],
        popupAnchor: [0, -15]
      });
      L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(`<strong>${index + 1}. ${escapeHtml(point.name)}</strong>`);
    });

    map.fitBounds(L.latLngBounds(latlngs).pad(0.25));
    return map;
  }

  function ensureDayMap(dayIndex) {
    if (!window.L) return;

    if (dayMaps[dayIndex]) {
      window.setTimeout(() => dayMaps[dayIndex].invalidateSize(), 50);
      return;
    }

    const map = createDayMap(dayIndex);
    if (map) dayMaps[dayIndex] = map;
  }

  // ---------- 4. 共享记账 ----------
  const expenseConfig = DATA.expense;
  let expenses = [];
  let todos = {};

  function getJsonBinConfig() {
    return expenseConfig.jsonBin || {};
  }

  function isSharedMode() {
    const cfg = getJsonBinConfig();
    return Boolean(cfg.binId && (cfg.accessKey || cfg.masterKey));
  }

  function authHeaders(contentType) {
    const cfg = getJsonBinConfig();
    const headers = contentType ? { "Content-Type": "application/json" } : {};
    if (cfg.masterKey) {
      headers["X-Master-Key"] = cfg.masterKey;
    } else if (cfg.accessKey) {
      headers["X-Access-Key"] = cfg.accessKey;
    }
    return headers;
  }

  async function loadSharedData() {
    if (isSharedMode()) {
      const cfg = getJsonBinConfig();
      try {
        const response = await fetch(
          `https://api.jsonbin.io/v3/b/${encodeURIComponent(cfg.binId)}/latest`,
          { headers: authHeaders(false) }
        );
        if (!response.ok) throw new Error("读取共享数据失败");
        const payload = await response.json();
        const record = payload.record || {};
        expenses = Array.isArray(record) ? record : Array.isArray(record.expenses) ? record.expenses : [];
        todos = (record && record.todos && typeof record.todos === "object") ? record.todos : {};
        setExpenseStatus("共享账本已连接（JSONBin）。记账与待办清单都会跨设备同步。", "ok");
      } catch (error) {
        console.error(error);
        setExpenseStatus("共享数据读取失败，请检查 binId 与 Key。已暂时使用本机缓存。", "error");
        expenses = readLocalExpenses();
        todos = readLocalTodos();
      }
    } else {
      expenses = readLocalExpenses();
      todos = readLocalTodos();
      setExpenseStatus(
        "当前为本机演示模式：数据只保存在这个浏览器里。要开启多人共享，请在 data/trip-data.js 的 expense.jsonBin 中填入 binId 与 Key。",
        "info"
      );
    }

    renderExpense();
    renderChecklist();
  }

  function readLocalExpenses() {
    try {
      const raw = localStorage.getItem(EXPENSE_LOCAL_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      return [];
    }
  }

  function writeLocalExpenses() {
    localStorage.setItem(EXPENSE_LOCAL_KEY, JSON.stringify(expenses));
  }

  function readLocalTodos() {
    try {
      const raw = localStorage.getItem(TODO_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      return {};
    }
  }

  function writeLocalTodos() {
    localStorage.setItem(TODO_KEY, JSON.stringify(todos));
  }

  async function saveSharedData() {
    if (isSharedMode()) {
      const cfg = getJsonBinConfig();
      try {
        const response = await fetch(
          `https://api.jsonbin.io/v3/b/${encodeURIComponent(cfg.binId)}`,
          {
            method: "PUT",
            headers: authHeaders(true),
            body: JSON.stringify({ expenses, todos })
          }
        );
        if (!response.ok) throw new Error("写入共享数据失败");
        setExpenseStatus("已同步。其他设备刷新后即可看到最新内容。", "ok");
      } catch (error) {
        console.error(error);
        setExpenseStatus("同步失败，请检查 Key 是否具备写权限；本次修改已临时保留在本机。", "error");
        writeLocalExpenses();
        writeLocalTodos();
      }
    } else {
      writeLocalExpenses();
      writeLocalTodos();
    }
  }

  let saveTimer = null;
  function scheduleSave() {
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveTimer = null;
      saveSharedData();
    }, 350);
  }

  function setExpenseStatus(message, type) {
    const el = document.getElementById("expense-status");
    if (!el) return;
    el.textContent = message;
    el.dataset.type = type || "info";
  }

  function toBaseAmount(amount, currency) {
    const rate = expenseConfig.rates[currency] ?? 1;
    return Number(amount || 0) * rate;
  }

  function renderExpenseSelects() {
    const categorySelect = document.getElementById("exp-category");
    const payerSelect = document.getElementById("exp-payer");
    const filterSelect = document.getElementById("exp-filter");

    if (categorySelect) {
      categorySelect.innerHTML = expenseConfig.categories
        .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
        .join("");
    }
    if (payerSelect) {
      payerSelect.innerHTML = expenseConfig.payers
        .map((p) => `<option value="${escapeHtml(p)}">${escapeHtml(p)}</option>`)
        .join("");
    }
    if (filterSelect) {
      const allOption = `<option value="all">全部</option>`;
      filterSelect.innerHTML =
        allOption +
        expenseConfig.categories
          .map((c) => `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`)
          .join("");
    }
  }

  function renderExpense() {
    const totalEl = document.getElementById("exp-total");
    const totalKrwEl = document.getElementById("exp-total-krw");
    const categorySummaryEl = document.getElementById("exp-category-summary");
    const personSummaryEl = document.getElementById("exp-person-summary");
    const listEl = document.getElementById("exp-list");
    const filterValue = document.getElementById("exp-filter")?.value || "all";

    const visible = expenses.filter((item) => {
      if (filterValue === "all") return true;
      return item.category === filterValue;
    });

    const totalKrw = visible.reduce(
      (sum, item) => sum + toBaseAmount(item.amount, item.currency),
      0
    );
    totalEl.textContent = formatCny(krwToCny(totalKrw));
    if (totalKrwEl) totalKrwEl.textContent = formatMoney(totalKrw);

    const categoryMap = {};
    const personMap = {};
    visible.forEach((item) => {
      const base = toBaseAmount(item.amount, item.currency);
      categoryMap[item.category] = (categoryMap[item.category] || 0) + base;
      personMap[item.payer] = (personMap[item.payer] || 0) + base;
    });

    categorySummaryEl.innerHTML = Object.entries(categoryMap)
      .map(
        ([name, value]) =>
          `<span><span>${escapeHtml(name)}</span><strong>${formatCny(krwToCny(value))}</strong></span>`
      )
      .join("") || `<span class="empty">暂无数据</span>`;

    personSummaryEl.innerHTML = Object.entries(personMap)
      .map(
        ([name, value]) =>
          `<span><span>${escapeHtml(name)}</span><strong>${formatCny(krwToCny(value))}</strong></span>`
      )
      .join("") || `<span class="empty">暂无数据</span>`;

    const sorted = [...visible].sort((a, b) => {
      const dateCompare = String(b.date || "").localeCompare(String(a.date || ""));
      if (dateCompare !== 0) return dateCompare;
      return Number(b.createdAt || 0) - Number(a.createdAt || 0);
    });

    if (sorted.length === 0) {
      listEl.innerHTML = `<li class="empty">还没有账单，先添加一笔吧。</li>`;
    } else {
      listEl.innerHTML = sorted
        .map((item) => {
          const base = toBaseAmount(item.amount, item.currency);
          const cny = formatCny(krwToCny(base));
          const krw = formatMoney(base);
          return `
            <li class="expense-item">
              <div class="expense-main">
                <strong>${escapeHtml(item.category || "其他")} · ${escapeHtml(item.note || "无备注")}</strong>
                <small>${escapeHtml(item.payer || "")} · ${escapeHtml(formatDate(item.date))}</small>
              </div>
              <div class="expense-amount">
                <strong class="amount-cny">${cny}</strong>
                <small class="amount-krw">${krw}</small>
              </div>
              <button class="expense-delete" type="button" data-id="${escapeHtml(item.id)}" aria-label="删除">×</button>
            </li>
          `;
        })
        .join("");
    }

    listEl.querySelectorAll(".expense-delete").forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.getAttribute("data-id");
        expenses = expenses.filter((item) => item.id !== id);
        renderExpense();
        saveSharedData();
      });
    });
  }

  function initExpenseForm() {
    const form = document.getElementById("expense-form");
    if (!form) return;

    const dateInput = document.getElementById("exp-date");
    const now = new Date();
    dateInput.value = `${now.getFullYear()}-${pad2(now.getMonth() + 1)}-${pad2(now.getDate())}`;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const amount = Number(document.getElementById("exp-amount").value);
      if (!Number.isFinite(amount) || amount <= 0) return;

      const item = {
        id: "exp-" + Date.now() + "-" + Math.random().toString(16).slice(2, 6),
        amount,
        currency: document.getElementById("exp-currency").value,
        category: document.getElementById("exp-category").value,
        payer: document.getElementById("exp-payer").value,
        note: document.getElementById("exp-note").value.trim(),
        date: document.getElementById("exp-date").value,
        createdAt: Date.now()
      };

      expenses.push(item);
      renderExpense();
      saveSharedData();
      form.reset();
      dateInput.value = item.date;
    });

    document.getElementById("exp-filter").addEventListener("change", renderExpense);
  }

  // ---------- 韩元 → 人民币换算器 ----------
  function initFxCalculator() {
    const input = document.getElementById("fx-krw");
    const resultEl = document.getElementById("fx-cny");
    const rateEl = document.getElementById("fx-rate");
    if (!input || !resultEl) return;

    const rate = Number(expenseConfig.rates.CNY) || 1;
    if (rateEl) rateEl.textContent = `1 CNY ≈ ${Number(rate).toFixed(2)} KRW`;

    function update() {
      const krw = Number(input.value);
      resultEl.textContent = Number.isFinite(krw) && krw >= 0 ? formatCny(krwToCny(krw)) : "¥0.00";
    }

    input.addEventListener("input", update);
    update();
  }

  // ---------- 5. 待办清单 ----------
  function renderChecklist() {
    const container = document.getElementById("todo-groups");
    const progressEl = document.getElementById("todo-progress");
    const progressTextEl = document.getElementById("todo-progress-text");
    if (!container) return;

    const state = todos;
    const allItems = [];

    DATA.checklist.forEach((group) => {
      group.items.forEach((item) => allItems.push(item));
    });

    const doneCount = allItems.filter((item) => state[item.id]).length;
    const percent = allItems.length ? Math.round((doneCount / allItems.length) * 100) : 0;
    progressEl.style.width = percent + "%";
    progressTextEl.textContent = percent + "%";

    container.innerHTML = DATA.checklist
      .map((group) => {
        const itemsHtml = group.items
          .map((item) => {
            const checked = state[item.id] ? " checked" : "";
            const doneClass = state[item.id] ? " done" : "";
            const wideClass = item.url ? " todo-item-wide" : "";
            const linkHtml = item.url
              ? `<a class="todo-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">去填写 ↗</a>`
              : "";
            return `
              <label class="todo-item${doneClass}${wideClass}">
                <input type="checkbox" data-todo-id="${escapeHtml(item.id)}"${checked} />
                <span class="todo-text">${escapeHtml(item.text)}</span>
                ${linkHtml}
              </label>
            `;
          })
          .join("");
        return `
          <div class="todo-group">
            <h3>${escapeHtml(group.category)}</h3>
            <div class="todo-items">${itemsHtml}</div>
          </div>
        `;
      })
      .join("");

    container.querySelectorAll("input[type='checkbox']").forEach((input) => {
      input.addEventListener("change", () => {
        todos[input.dataset.todoId] = input.checked;
        renderChecklist();
        scheduleSave();
      });
    });
  }

  // ---------- 明洞药妆 & 护肤推荐 ----------
  function renderSkincare() {
    const skincare = DATA.skincare;
    if (!skincare) return;

    const noteEl = document.getElementById("skincare-note");
    const storesEl = document.getElementById("skincare-stores");
    const groupsEl = document.getElementById("skincare-groups");
    const tipsEl = document.getElementById("skincare-tips");
    if (!noteEl || !storesEl || !groupsEl || !tipsEl) return;

    noteEl.textContent = skincare.note || "";

    storesEl.innerHTML = (skincare.stores || [])
      .map(
        (store) => `
          <a class="skincare-store" href="${getNaverSearchUrl(store.ko || store.zh)}" target="_blank" rel="noopener noreferrer">
            <strong>${escapeHtml(store.zh)}</strong>
            <span class="ko">${escapeHtml(store.ko)}</span>
            <span class="en">${escapeHtml(store.en)}</span>
            <p>${escapeHtml(store.note || "")}</p>
          </a>
        `
      )
      .join("");

    groupsEl.innerHTML = (skincare.groups || [])
      .map(
        (group) => `
          <div class="skincare-group">
            <h3>${escapeHtml(group.category)}</h3>
            <ul class="skincare-list">
              ${(group.items || [])
                .map(
                  (item) => `
                    <li>
                      <div class="skincare-item">
                        <strong>${escapeHtml(item.zh)}</strong>
                        <span class="ko">${escapeHtml(item.ko)}</span>
                        <span class="en">${escapeHtml(item.en)}</span>
                      </div>
                    </li>
                  `
                )
                .join("")}
            </ul>
          </div>
        `
      )
      .join("");

    tipsEl.innerHTML = (skincare.tips || [])
      .map((tip) => `<p>${escapeHtml(tip)}</p>`)
      .join("");
  }

  // ---------- 赴韩旅游注意事项 ----------
  function renderNotes() {
    const notes = DATA.notes;
    const container = document.getElementById("notes-groups");
    if (!notes || !container) return;

    container.innerHTML = (notes.groups || [])
      .map(
        (group) => `
          <div class="notes-group">
            <h3>${escapeHtml(group.title)}</h3>
            <ul>
              ${(group.items || [])
                .map((item) => `<li>${escapeHtml(item)}</li>`)
                .join("")}
            </ul>
          </div>
        `
      )
      .join("");
  }

  // ---------- PWA ----------
  function registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js").catch((error) => {
          console.warn("Service Worker 注册失败：", error);
        });
      });
    }
  }

  // ---------- 启动 ----------
  document.addEventListener("DOMContentLoaded", () => {
    renderOverview();
    renderItinerary();
    ensureDayMap(0);
    renderExpenseSelects();
    initExpenseForm();
    initFxCalculator();
    loadSharedData();
    renderSkincare();
    renderNotes();
    registerServiceWorker();
  });
})();
