(() => {
  // DOM Elements
  const sidebar = document.getElementById("sidebar");
  const mobileBackdrop = document.getElementById("mobile-sidebar-backdrop");
  const menuBtn = document.getElementById("menu-btn");
  const form = document.getElementById("incident-form");
  const tableBody = document.getElementById("incident-table-body");
  const emptyState = document.getElementById("empty-state");
  const clearBtn = document.getElementById("clear-btn");

  // Initial Data
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

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "open":
        return "text-slate-200";
      case "in progress":
        return "text-blue-400";
      case "resolved":
        return "text-emerald-400";
      default:
        return "text-slate-400";
    }
  };

  const generateId = () => {
    return (
      "INC-" +
      new Date().getFullYear() +
      "-" +
      Math.floor(100 + Math.random() * 900)
    );
  };

  // Render
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
                <td class="px-6 py-4 font-medium ${getStatusColor(
                  inc.status
                )}">${inc.status}</td>
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

    // Add to top
    incidents.unshift(newIncident);

    // Keep list manageable
    if (incidents.length > 20) incidents.pop();

    renderTable();
    form.reset();
  };

  // Event Listeners
  if (menuBtn) menuBtn.addEventListener("click", toggleSidebar);
  if (mobileBackdrop) mobileBackdrop.addEventListener("click", toggleSidebar);

  if (form) form.addEventListener("submit", handleFormSubmit);

  if (clearBtn)
    clearBtn.addEventListener("click", () => {
      incidents = [];
      renderTable();
    });

  // Init
  document.addEventListener("DOMContentLoaded", () => {
    renderTable();
  });
})();
