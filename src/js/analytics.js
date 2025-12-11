// DOM Elements
const sidebar = document.getElementById("sidebar");
const mobileBackdrop = document.getElementById("mobile-sidebar-backdrop");
const menuBtn = document.getElementById("menu-btn");
const filterBtn = document.getElementById("filter-btn");
const downloadBtn = document.getElementById("download-btn");
const tableBody = document.getElementById("transactions-table-body");
const bankDropdown = document.getElementById("analytics-bank-dropdown");

// Notification Elements
const notificationBtn = document.getElementById("notification-btn");
const notificationDropdown = document.getElementById("notification-dropdown");
const notificationBadge = document.getElementById("notification-badge");
const clearNotificationsBtn = document.getElementById("clear-notifications");
const notificationList = document.getElementById("notification-list");
const noNotifications = document.getElementById("no-notifications");

// Mock Data for Charts
const chartData = {
  banks: ["Zenith", "GTB", "Access", "UBA", "First Bank"],
  volumes: [120, 190, 80, 150, 100],
  successRate: [85, 15], // Resolved, Pending
};

// Mock Data for Table
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

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case "resolved":
    case "closed":
    case "success":
      return "bg-green-500/10 text-green-400 border-green-500/20";
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

// Render Functions
const renderTable = (data) => {
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
};

// Event Delegation for View Buttons
tableBody.addEventListener("click", (e) => {
  if (e.target.classList.contains("view-btn")) {
    const incId = e.target.getAttribute("data-id");
    alert(
      `Viewing details for Incident ID: ${incId}\n\n(This would open a detailed modal in a production app)`
    );
  }
});

const initCharts = () => {
  Chart.defaults.color = "#94a3b8";
  Chart.defaults.font.family = "Inter";

  // Bank Volume Chart (Bar)
  const ctxBank = document.getElementById("bankVolumeChart").getContext("2d");
  new Chart(ctxBank, {
    type: "bar",
    data: {
      labels: chartData.banks,
      datasets: [
        {
          label: "Incident Volume",
          data: chartData.volumes,
          backgroundColor: "#0ea5e9", // Sky 500
          borderRadius: 6,
          hoverBackgroundColor: "#38bdf8", // Sky 400
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
        },
      },
      scales: {
        y: {
          grid: { color: "#334155", drawBorder: false }, // Slate 700
          beginAtZero: true,
        },
        x: {
          grid: { display: false, drawBorder: false },
          ticks: { color: "#94a3b8" },
        },
      },
    },
  });

  // Success Rate Chart (Doughnut)
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
          backgroundColor: ["#10b981", "#ef4444"], // Emerald-500, Red-500
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
          labels: {
            usePointStyle: true,
            padding: 20,
            color: "#cbd5e1",
          },
        },
        tooltip: {
          backgroundColor: "#1e293b",
          borderColor: "#334155",
          borderWidth: 1,
        },
      },
    },
  });
};

// Event Listeners
menuBtn.addEventListener("click", toggleSidebar);
mobileBackdrop.addEventListener("click", toggleSidebar);

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

filterBtn.addEventListener("click", () => {
  // Simulate filtering
  const selectedBank = bankDropdown.value;
  alert(`Applying filters for bank: ${selectedBank}... (Simulated)`);
  // In a real app, you would filter 'incidents' array and re-call renderTable()
  // For demo, let's just shuffle the table rows to look active
  const shuffled = [...incidents].sort(() => 0.5 - Math.random());
  renderTable(shuffled);
});

downloadBtn.addEventListener("click", () => {
  // Simulate PDF Download (basic text for now)
  const pdfContent =
    "Incident Report\n\n" +
    incidents
      .map(
        (e) => `${e.id} | ${e.date} | ${e.bank} | ${e.severity} | ${e.status}`
      )
      .join("\n");

  alert("Downloading PDF Report... (Simulated)\nContent: " + pdfContent);
});

// Initialize
window.addEventListener("DOMContentLoaded", () => {
  renderTable(incidents);
  initCharts();
});
