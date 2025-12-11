// DOM Elements
const sidebar = document.getElementById("sidebar");
const mobileBackdrop = document.getElementById("mobile-sidebar-backdrop");
const menuBtn = document.getElementById("menu-btn");
const bankDropdown = document.getElementById("bank-dropdown");
const statsContainer = document.getElementById("stats-container");

// Notification Elements
const notificationBtn = document.getElementById("notification-btn");
const notificationDropdown = document.getElementById("notification-dropdown");
const notificationBadge = document.getElementById("notification-badge");
const clearNotificationsBtn = document.getElementById("clear-notifications");
const notificationList = document.getElementById("notification-list");
const noNotifications = document.getElementById("no-notifications");

// State
let mainChartInstance = null;
let deviceChartInstance = null;

// Mock Data
// Mock Data
const data = {
  all: {
    stats: [
      {
        label: "Total Incidents",
        value: "1,245",
        change: "+12.5%",
        isPositive: false,
      },
      { label: "Resolved", value: "1,100", change: "+8.2%", isPositive: true },
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

// Utils
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

// Event Listeners
menuBtn.addEventListener("click", toggleSidebar);
mobileBackdrop.addEventListener("click", toggleSidebar);

if (bankDropdown) {
  bankDropdown.addEventListener("change", (e) => {
    updateDashboard(e.target.value);
  });
}

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

// Render Functions
const renderStats = (stats) => {
  statsContainer.innerHTML = stats
    .map(
      (stat) => `
        <div class="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 shadow-lg backdrop-blur-sm hover:bg-slate-800/80 transition-all duration-300 group">
            <dt class="truncate text-sm font-medium text-slate-400 group-hover:text-sky-400 transition-colors">${
              stat.label
            }</dt>
            <dd class="mt-2 flex items-baseline sm:pb-7">
                <p class="text-2xl font-semibold text-white">${stat.value}</p>
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
};

const updateDashboard = (bankKey) => {
  const bankData = data[bankKey];
  renderStats(bankData.stats);

  // Update Charts
  if (mainChartInstance) {
    mainChartInstance.data.datasets[0].data = bankData.chart;
    mainChartInstance.update();
  }

  // Update Trends Chart (using deviceChartInstance variable name for now to avoid refactor overhead, as per previous initialization)
  if (deviceChartInstance) {
    deviceChartInstance.data.datasets[0].data = bankData.trends;
    deviceChartInstance.update();
  }
};

const initCharts = () => {
  Chart.defaults.color = "#94a3b8";
  Chart.defaults.font.family = "Inter";

  // Main Chart (Revenue/Transactions Line)
  const mainChartEl = document.getElementById("mainChart");
  if (mainChartEl) {
    const ctxMain = mainChartEl.getContext("2d");
    const gradient = ctxMain.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, "rgba(14, 165, 233, 0.5)"); // Sky-500
    gradient.addColorStop(1, "rgba(14, 165, 233, 0)");

    mainChartInstance = new Chart(ctxMain, {
      type: "line",
      data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
          {
            label: "Incidents",
            data: data.all.chart,
            borderColor: "#0ea5e9", // Sky-500
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
            grid: { color: "#334155", drawBorder: false }, // Slate-700
            beginAtZero: true,
          },
          x: {
            grid: { display: false, drawBorder: false },
          },
        },
      },
    });
  }

  // Trends Chart (Bar) - formerly Device Usage
  const trendsChartEl = document.getElementById("trendsChart");
  if (trendsChartEl) {
    const ctxTrends = trendsChartEl.getContext("2d");
    // Mock data for weekly trends
    const trendsData = [120, 190, 30, 50, 20, 30, 250];

    deviceChartInstance = new Chart(ctxTrends, {
      // Reuse variable or rename later, keeping simple for now
      type: "bar",
      data: {
        labels: ["M", "T", "W", "T", "F", "S", "S"],
        datasets: [
          {
            label: "Volume",
            data: trendsData,
            backgroundColor: "#6366f1", // Indigo-500
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

  // Check for other charts if we add them later...
};

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  updateDashboard("all");
  initCharts();
});
