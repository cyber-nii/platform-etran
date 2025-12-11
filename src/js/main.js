// DOM Elements
const sidebar = document.getElementById("sidebar");
const mobileBackdrop = document.getElementById("mobile-sidebar-backdrop");
const menuBtn = document.getElementById("menu-btn");

// Notification Elements
const notificationBtn = document.getElementById("notification-btn");
const notificationDropdown = document.getElementById("notification-dropdown");
const notificationBadge = document.getElementById("notification-badge");
const clearNotificationsBtn = document.getElementById("clear-notifications");
const notificationList = document.getElementById("notification-list");
const noNotifications = document.getElementById("no-notifications");

// Shared Utils
const toggleSidebar = () => {
  const isClosed = sidebar.classList.contains("-translate-x-full");
  if (isClosed) {
    sidebar.classList.remove("-translate-x-full");
    mobileBackdrop.classList.remove("hidden");
  } else {
    sidebar.classList.add("-translate-x-full");
    mobileBackdrop.classList.add("hidden");
  }
};

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "resolved":
    case "closed":
    case "success":
      return "bg-green-500/10 text-green-400 border-green-500/20";
    case "in progress":
    case "open":
      return "text-slate-200";
    case "failed":
    case "critical":
      return "bg-red-500/10 text-red-400 border-red-500/20";
    case "pending":
    case "investigating":
      return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    default:
      return "bg-slate-700 text-slate-300";
  }
};

const getImpactColor = (impact) => {
  if (!impact) return "bg-slate-700 text-slate-300 ring-slate-600";
  switch (impact.toLowerCase()) {
    case "critical":
      return "bg-red-500/10 text-red-500 ring-red-500/20";
    case "high":
      return "bg-orange-500/10 text-orange-500 ring-orange-500/20";
    case "medium":
      return "bg-yellow-500/10 text-yellow-500 ring-yellow-500/20";
    case "low":
      return "bg-blue-500/10 text-blue-500 ring-blue-500/20";
    default:
      return "bg-slate-700 text-slate-300 ring-slate-600";
  }
};

// Global Initialization for Sidebar & Notifications
document.addEventListener("DOMContentLoaded", () => {
  if (menuBtn) menuBtn.addEventListener("click", toggleSidebar);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", toggleSidebar);

  // Notification Logic
  if (notificationBtn && notificationDropdown) {
    notificationBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      notificationDropdown.classList.toggle("hidden");
      if (
        !notificationDropdown.classList.contains("hidden") &&
        notificationBadge
      ) {
        notificationBadge.classList.add("hidden");
      }
    });

    document.addEventListener("click", (e) => {
      if (
        !notificationDropdown.classList.contains("hidden") &&
        !notificationDropdown.contains(e.target) &&
        !notificationBtn.contains(e.target)
      ) {
        notificationDropdown.classList.add("hidden");
      }
    });
  }

  if (clearNotificationsBtn) {
    clearNotificationsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (notificationList) notificationList.innerHTML = "";
      if (noNotifications) noNotifications.classList.remove("hidden");
    });
  }

  // Page Specific Initializations
  if (document.getElementById("stats-container")) {
    initDashboard();
  } else if (document.getElementById("transactions-table-body")) {
    initAnalytics();
  } else if (document.getElementById("incident-form")) {
    initIncidentForm();
  }
});

// ==========================================
// Dashboard Page Logic
// ==========================================
function initDashboard() {
  const bankDropdown = document.getElementById("bank-dropdown");
  const statsContainer = document.getElementById("stats-container");

  let mainChartInstance = null;
  let deviceChartInstance = null;

  const data = {
    all: {
      stats: [
        {
          label: "Total Incidents",
          value: "1,245",
          change: "+12.5%",
          isPositive: false,
        },
        {
          label: "Resolved",
          value: "1,100",
          change: "+8.2%",
          isPositive: true,
        },
        { label: "Pending", value: "145", change: "-2.4%", isPositive: true },
        {
          label: "Resolution Rate",
          value: "94.2%",
          change: "+0.1%",
          isPositive: true,
        },
      ],
      chart: [15, 29, 40, 51, 36, 25, 40],
      trends: [20, 30, 10, 15, 5, 10, 45],
    },
    zenith: {
      stats: [
        {
          label: "Total Incidents",
          value: "450",
          change: "+5.5%",
          isPositive: false,
        },
        { label: "Resolved", value: "400", change: "+12.1%", isPositive: true },
        { label: "Pending", value: "50", change: "-1.0%", isPositive: true },
        {
          label: "Resolution Rate",
          value: "88.9%",
          change: "-0.2%",
          isPositive: false,
        },
      ],
      chart: [10, 15, 20, 12, 40, 15, 25],
      trends: [10, 20, 5, 8, 3, 5, 25],
    },
    gtb: {
      stats: [
        {
          label: "Total Incidents",
          value: "320",
          change: "-15.2%",
          isPositive: true,
        },
        { label: "Resolved", value: "315", change: "+4.5%", isPositive: true },
        { label: "Pending", value: "5", change: "-3.2%", isPositive: true },
        {
          label: "Resolution Rate",
          value: "98.4%",
          change: "+0.1%",
          isPositive: true,
        },
      ],
      chart: [8, 5, 12, 10, 15, 10, 12],
      trends: [5, 8, 4, 6, 2, 4, 15],
    },
    access: {
      stats: [
        {
          label: "Total Incidents",
          value: "475",
          change: "+2.1%",
          isPositive: false,
        },
        { label: "Resolved", value: "380", change: "-1.5%", isPositive: false },
        { label: "Pending", value: "95", change: "+4.1%", isPositive: false },
        {
          label: "Resolution Rate",
          value: "80.0%",
          change: "-0.6%",
          isPositive: false,
        },
      ],
      chart: [12, 14, 25, 20, 30, 25, 22],
      trends: [8, 12, 6, 8, 3, 6, 20],
    },
  };

  if (bankDropdown) {
    bankDropdown.addEventListener("change", (e) => {
      updateDashboard(e.target.value);
    });
  }

  function renderStats(stats) {
    statsContainer.innerHTML = stats
      .map(
        (stat) => `
            <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
                <dt class="truncate text-sm font-medium text-slate-400 group-hover:text-sky-400 transition-colors">${
                  stat.label
                }</dt>
                <dd class="mt-2 flex items-baseline sm:pb-7">
                    <p class="text-2xl font-semibold text-white">${
                      stat.value
                    }</p>
                    <p class="ml-2 flex items-baseline text-sm font-semibold ${
                      stat.isPositive ? "text-green-400" : "text-red-400"
                    }">
                        ${stat.isPositive ? "↑" : "↓"}
                        <span class="sr-only"> ${
                          stat.isPositive ? "Increased" : "Decreased"
                        } by </span>
                        ${stat.change}
                    </p>
                </dd>
            </div>
        `
      )
      .join("");
  }

  function updateDashboard(bankKey) {
    const bankData = data[bankKey];
    renderStats(bankData.stats);

    if (mainChartInstance) {
      mainChartInstance.data.datasets[0].data = bankData.chart;
      mainChartInstance.update();
    }
    if (deviceChartInstance) {
      deviceChartInstance.data.datasets[0].data = bankData.trends;
      deviceChartInstance.update();
    }
  }

  function initCharts() {
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "Inter";

    const mainChartEl = document.getElementById("mainChart");
    if (mainChartEl) {
      const ctxMain = mainChartEl.getContext("2d");
      const gradient = ctxMain.createLinearGradient(0, 0, 0, 400);
      gradient.addColorStop(0, "rgba(14, 165, 233, 0.5)");
      gradient.addColorStop(1, "rgba(14, 165, 233, 0)");

      mainChartInstance = new Chart(ctxMain, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Incidents",
              data: data.all.chart,
              borderColor: "#0ea5e9",
              backgroundColor: gradient,
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: "#0f172a",
              pointBorderColor: "#0ea5e9",
              pointBorderWidth: 2,
              pointRadius: 4,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1e293b",
              titleColor: "#f8fafc",
              bodyColor: "#e2e8f0",
              borderColor: "#334155",
              borderWidth: 1,
              padding: 10,
              displayColors: false,
            },
          },
          scales: {
            y: {
              grid: { color: "#334155", drawBorder: false },
              beginAtZero: true,
            },
            x: {
              grid: { display: false, drawBorder: false },
            },
          },
        },
      });
    }

    const trendsChartEl = document.getElementById("trendsChart");
    if (trendsChartEl) {
      const ctxTrends = trendsChartEl.getContext("2d");
      const trendsData = [120, 190, 30, 50, 20, 30, 250];

      deviceChartInstance = new Chart(ctxTrends, {
        type: "bar",
        data: {
          labels: ["M", "T", "W", "T", "F", "S", "S"],
          datasets: [
            {
              label: "Volume",
              data: trendsData,
              backgroundColor: "#6366f1",
              borderRadius: 4,
              hoverBackgroundColor: "#818cf8",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: "#1e293b",
              borderColor: "#334155",
              borderWidth: 1,
            },
          },
          scales: {
            y: { display: false },
            x: {
              grid: { display: false, drawBorder: false },
              ticks: { color: "#64748b" },
            },
          },
        },
      });
    }
  }

  updateDashboard("all");
  initCharts();
}

// ==========================================
// Analytics Page Logic
// ==========================================
function initAnalytics() {
  const filterBtn = document.getElementById("filter-btn");
  const downloadBtn = document.getElementById("download-btn");
  const tableBody = document.getElementById("transactions-table-body");
  const bankDropdown = document.getElementById("analytics-bank-dropdown");

  const chartData = {
    banks: ["Zenith", "GTB", "Access", "UBA", "First Bank"],
    volumes: [120, 190, 80, 150, 100],
    successRate: [85, 15],
  };

  const incidents = [
    {
      id: "INC-2023-001",
      date: "2023-10-25 10:30",
      bank: "Zenith Bank",
      severity: "Critical",
      status: "Resolved",
    },
    {
      id: "INC-2023-002",
      date: "2023-10-25 10:35",
      bank: "GTBank",
      severity: "Medium",
      status: "Pending",
    },
    {
      id: "INC-2023-003",
      date: "2023-10-25 11:00",
      bank: "Access Bank",
      severity: "Low",
      status: "Resolved",
    },
    {
      id: "INC-2023-004",
      date: "2023-10-25 11:15",
      bank: "Zenith Bank",
      severity: "High",
      status: "Investigating",
    },
    {
      id: "INC-2023-005",
      date: "2023-10-25 11:45",
      bank: "GTBank",
      severity: "Critical",
      status: "Resolved",
    },
    {
      id: "INC-2023-006",
      date: "2023-10-25 12:00",
      bank: "UBA",
      severity: "Low",
      status: "Closed",
    },
    {
      id: "INC-2023-007",
      date: "2023-10-25 12:30",
      bank: "First Bank",
      severity: "Medium",
      status: "Resolved",
    },
    {
      id: "INC-2023-008",
      date: "2023-10-25 13:00",
      bank: "Zenith Bank",
      severity: "High",
      status: "Pending",
    },
    {
      id: "INC-2023-009",
      date: "2023-10-25 13:30",
      bank: "GTBank",
      severity: "Low",
      status: "Resolved",
    },
    {
      id: "INC-2023-010",
      date: "2023-10-25 14:00",
      bank: "Access Bank",
      severity: "Medium",
      status: "Investigating",
    },
  ];

  function renderAnalyticsTable(data) {
    tableBody.innerHTML = data
      .map(
        (inc) => `
            <tr class="hover:bg-slate-800/30 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-slate-300 font-medium">${
                  inc.id
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-400">${
                  inc.date
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-slate-300">${
                  inc.bank
                }</td>
                <td class="px-6 py-4 whitespace-nowrap text-white font-medium">
                    <span class="${
                      inc.severity === "Critical"
                        ? "text-red-400 font-bold"
                        : inc.severity === "High"
                        ? "text-orange-400"
                        : "text-slate-300"
                    }">
                        ${inc.severity}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(
                      inc.status
                    )}">
                        ${inc.status}
                    </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right">
                    <button data-id="${
                      inc.id
                    }" class="view-btn text-sky-400 hover:text-sky-300 font-medium text-xs">View</button>
                </td>
            </tr>
        `
      )
      .join("");
  }

  tableBody.addEventListener("click", (e) => {
    if (e.target.classList.contains("view-btn")) {
      const incId = e.target.getAttribute("data-id");
      alert(
        `Viewing details for Incident ID: ${incId}\n\n(This would open a detailed modal in a production app)`
      );
    }
  });

  if (filterBtn) {
    filterBtn.addEventListener("click", () => {
      const selectedBank = bankDropdown.value;
      alert(`Applying filters for bank: ${selectedBank}... (Simulated)`);
      const shuffled = [...incidents].sort(() => 0.5 - Math.random());
      renderAnalyticsTable(shuffled);
    });
  }

  if (downloadBtn) {
    downloadBtn.addEventListener("click", () => {
      const pdfContent =
        "Incident Report\n\n" +
        incidents
          .map(
            (e) =>
              `${e.id} | ${e.date} | ${e.bank} | ${e.severity} | ${e.status}`
          )
          .join("\n");
      alert("Downloading PDF Report... (Simulated)\nContent: " + pdfContent);
    });
  }

  function initCharts() {
    Chart.defaults.color = "#94a3b8";
    Chart.defaults.font.family = "Inter";

    const ctxBank = document.getElementById("bankVolumeChart").getContext("2d");
    new Chart(ctxBank, {
      type: "bar",
      data: {
        labels: chartData.banks,
        datasets: [
          {
            label: "Incident Volume",
            data: chartData.volumes,
            backgroundColor: "#0ea5e9",
            borderRadius: 6,
            hoverBackgroundColor: "#38bdf8",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } }, // simplified options
        scales: {
          y: {
            grid: { color: "#334155", drawBorder: false },
            beginAtZero: true,
          },
          x: {
            grid: { display: false, drawBorder: false },
            ticks: { color: "#94a3b8" },
          },
        },
      },
    });

    const ctxSuccess = document
      .getElementById("successRateChart")
      .getContext("2d");
    new Chart(ctxSuccess, {
      type: "doughnut",
      data: {
        labels: ["Resolved", "Pending/Open"],
        datasets: [
          {
            data: chartData.successRate,
            backgroundColor: ["#10b981", "#ef4444"],
            borderWidth: 0,
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: true,
            position: "bottom",
            labels: { usePointStyle: true, padding: 20, color: "#cbd5e1" },
          },
        },
      },
    });
  }

  renderAnalyticsTable(incidents);
  initCharts();
}

// ==========================================
// Incident Form Page Logic
// ==========================================
function initIncidentForm() {
  const form = document.getElementById("incident-form");
  const tableBody = document.getElementById("incident-table-body");
  const emptyState = document.getElementById("empty-state");
  const clearBtn = document.getElementById("clear-btn");

  let incidents = [
    {
      id: "INC-2024-001",
      title: "Database Latency Warning",
      institution: "Zenith Bank",
      serviceAffected: "Database",
      impact: "Medium",
      status: "Open",
      reportedBy: "System Monitor",
      time: "5 mins ago",
    },
  ];

  const generateId = () => {
    return (
      "INC-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100 + Math.random() * 900)
    );
  };

  const renderTable = () => {
    if (incidents.length === 0) {
      tableBody.innerHTML = "";
      emptyState.classList.remove("hidden");
      return;
    }

    emptyState.classList.add("hidden");
    tableBody.innerHTML = incidents
      .map(
        (inc) => `
            <tr class="hover:bg-slate-800/20 transition-colors border-b border-slate-800/50 last:border-0">
                <td class="px-6 py-4 font-mono text-xs text-slate-500">${
                  inc.id
                }</td>
                <td class="px-6 py-4">
                    <div class="text-white font-medium">${inc.title}</div>
                    <div class="text-slate-500 text-xs mt-0.5">${
                      inc.institution || "N/A"
                    }</div>
                </td>
                <td class="px-6 py-4 text-slate-300 text-sm">
                    ${inc.serviceAffected || "N/A"}
                </td>
                <td class="px-6 py-4">
                    <span class="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${getImpactColor(
                      inc.impact
                    )}">
                        ${inc.impact || "Unknown"}
                    </span>
                </td>
                <td class="px-6 py-4 font-medium text-slate-200">${
                  inc.status
                }</td>
                <td class="px-6 py-4 text-slate-400">${inc.reportedBy}</td>
                <td class="px-6 py-4 text-right text-xs text-slate-500">${
                  inc.time
                }</td>
            </tr>
        `
      )
      .join("");
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    const newIncident = {
      id: generateId(),
      title: formData.get("title"),
      institution: formData.get("institution"),
      serviceAffected: formData.get("serviceAffected"),
      impact: formData.get("impact"),
      status: formData.get("status"),
      reportedBy: formData.get("reportedBy"),
      description: formData.get("description"),
      rootCause: formData.get("rootCause"),
      time: "Just now",
    };

    incidents.unshift(newIncident);
    if (incidents.length > 20) incidents.pop();

    renderTable();
    form.reset();
  };

  if (form) form.addEventListener("submit", handleFormSubmit);

  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      incidents = [];
      renderTable();
    });

  renderTable();
}
