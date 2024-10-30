let bots = [];

async function loadBots() {
  try {
    const response = await fetch("bots.json");
    bots = await response.json();
    renderBots();
    updateDashboard();
  } catch (error) {
    console.error("Error loading bots:", error);
  }
}

function showSection(sectionId) {
  const sections = document.querySelectorAll(".section");
  sections.forEach((section) => (section.style.display = "none"));
  document.getElementById(sectionId).style.display = "block";

  const menuItems = document.querySelectorAll(".sidebar li");
  menuItems.forEach((item) => {
    item.setAttribute("aria-pressed", "false");
    item.classList.remove("active");
  });
  const activeItem = document.querySelector(
    `.sidebar li[onclick="showSection('${sectionId}')"]`
  );
  if (activeItem) {
    activeItem.setAttribute("aria-pressed", "true");
    activeItem.classList.add("active");
  }
}

function addBot() {
  const botName = document.getElementById("bot-name").value;
  const botRole = document.getElementById("bot-role").value;
  const botStatus = document.getElementById("bot-status").value;
  const botType = document.getElementById("bot-type").value;
  const botDescription = document.getElementById("bot-description").value;

  const newBot = {
    name: botName,
    role: botRole,
    status: botStatus,
    type: botType,
    description: botDescription,
  };
  bots.push(newBot);

  renderBots();
  updateDashboard();
  showSection("bot-list");
}

function renderBots() {
  const botContainer = document.getElementById("bot-container");
  botContainer.innerHTML = "";

  const searchTerm = document.getElementById("bot-search").value.toLowerCase();
  const statusFilter = document.getElementById("bot-filter-status").value;
  const categoryFilter = document.getElementById("bot-filter-category").value;

  bots.forEach((bot, index) => {
    if (
      (searchTerm === "" ||
        bot.name.toLowerCase().includes(searchTerm) ||
        bot.role.toLowerCase().includes(searchTerm)) &&
      (statusFilter === "all" || bot.status === statusFilter) &&
      (categoryFilter === "all" || bot.type === categoryFilter)
    ) {
      const botCard = document.createElement("div");
      botCard.className = "bot-card";

      const statusText =
        bot.status === "active"
          ? "פעיל"
          : bot.status === "pending"
          ? "בהמתנה"
          : "כבוי";
      const botInfo = `
        <h3>${bot.name}</h3>
        <p>תפקיד: ${bot.role}</p>
        <p>סוג: ${bot.type}</p>
        <p>תיאור: ${bot.description}</p>
        <span class="bot-status ${bot.status}">${statusText}</span>
        <div>
          <button onclick="toggleBotStatus(${index}, 'active')" class="action-btn">הפעל</button>
          <button onclick="toggleBotStatus(${index}, 'inactive')" class="action-btn">כבה</button>
          <button onclick="toggleBotStatus(${index}, 'pending')" class="action-btn">המתן</button>
        </div>
      `;

      botCard.innerHTML = botInfo;
      botContainer.appendChild(botCard);
    }
  });
}

function toggleBotStatus(index, newStatus) {
  bots[index].status = newStatus;
  renderBots();
  updateDashboard();
}

function updateDashboard() {
  updateBotStatusChart();
  updateActivityLog();
  updateBotPerformanceChart();
  updateSystemStatsChart();
  updateSystemStats();
  updateActivityCards();
  updateVitalInfo();
  updateFooterStats();
  updatePerformanceCards();
  loadDashboardPreferences();
}

function updateBotStatusChart() {
  const ctx = document.getElementById("botStatusChart").getContext("2d");
  const statusCounts = bots.reduce((acc, bot) => {
    acc[bot.status] = (acc[bot.status] || 0) + 1;
    return acc;
  }, {});

  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["פעיל", "כבוי", "בהמתה"],
      datasets: [
        {
          data: [
            statusCounts.active || 0,
            statusCounts.inactive || 0,
            statusCounts.pending || 0,
          ],
          backgroundColor: ["#48bb78", "#f56565", "#ed8936"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
}

function updateActivityLog() {
  const activityLog = document.getElementById("activity-log");
  activityLog.innerHTML = `
    <li>בוט חדש נוסף: ${bots[bots.length - 1]?.name || "N/A"}</li>
    <li>בוט ${bots[0]?.name || "N/A"} עודכן לסטטוס ${
    bots[0]?.status || "N/A"
  }</li>
    <li>בוט ${bots[1]?.name || "N/A"} ${
    bots[1]?.status === "inactive" ? "הושבת" : "הופעל"
  }</li>
  `;
}

function updateBotPerformanceChart() {
  const ctx = document.getElementById("botPerformanceChart").getContext("2d");
  const botNames = bots.map((bot) => bot.name);
  const performanceData = bots.map(() => {
    return Array.from({ length: 7 }, () => Math.floor(Math.random() * 100));
  });

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["יום 1", "יום 2", "יום 3", "יום 4", "יום 5", "יום 6", "יום 7"],
      datasets: botNames.map((name, index) => ({
        label: name,
        data: performanceData[index],
        borderColor: getRandomColor(),
        fill: false,
      })),
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 100%, 50%)`;
}

function updateSystemStats() {
  const systemStats = document.getElementById("system-stats");
  systemStats.innerHTML = `
    <li>סך הכל בוטים: ${bots.length}</li>
    <li>בוטים פעילים: ${
      bots.filter((bot) => bot.status === "active").length
    }</li>
    <li>שימוש במשאבי מערכת: ${Math.floor(Math.random() * 30 + 40)}%</li>
    <li>זמן פעילות: ${Math.floor(Math.random() * 30 + 1)} ימים</li>
  `;
}

function updateActivityCards() {
  document.getElementById("active-tasks").textContent = Math.floor(
    Math.random() * 20
  );
  document.getElementById("new-messages").textContent = Math.floor(
    Math.random() * 50
  );
  document.getElementById("system-alerts").textContent = Math.floor(
    Math.random() * 5
  );
  document.getElementById("available-updates").textContent = Math.floor(
    Math.random() * 3
  );
}

function updateVitalInfo() {
  document.getElementById("resource-usage").textContent = `${Math.floor(
    Math.random() * 30 + 40
  )}%`;
  document.getElementById("uptime").textContent = `${Math.floor(
    Math.random() * 30 + 1
  )} ימים`;
  document.getElementById("active-bots").textContent = bots.filter(
    (bot) => bot.status === "active"
  ).length;
  document.getElementById("total-actions").textContent = Math.floor(
    Math.random() * 10000
  );
}

function updateFooterStats() {
  document.getElementById("total-bots").textContent = bots.length;
  document.getElementById("today-actions").textContent = Math.floor(
    Math.random() * 1000
  );
  document.getElementById("avg-response-time").textContent = `${Math.floor(
    Math.random() * 100 + 50
  )}ms`;
  document.getElementById("cpu-usage").textContent = `${Math.floor(
    Math.random() * 30 + 40
  )}%`;

  const recentUpdates = document.getElementById("recent-updates");
  recentUpdates.innerHTML = `
    <li>עדכון גרסה 0.5 הותקן</li>
    <li>תוספת פונקציונליות חדשה: נוח ביצועים</li>
    <li>שיפורי אבטחה</li>
  `;
}

function updateDateTime() {
  const now = new Date();
  const dateTimeString = now.toLocaleString("he-IL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  document.getElementById("datetime").textContent = dateTimeString;
}

function updatePerformanceCards() {
  document.getElementById("avg-response-time").textContent = `${Math.floor(
    Math.random() * 100 + 50
  )}ms`;
  document.getElementById("accuracy").textContent = `${Math.floor(
    Math.random() * 20 + 80
  )}%`;
  document.getElementById("completed-tasks").textContent = Math.floor(
    Math.random() * 1000
  );
  document.getElementById("user-satisfaction").textContent = `${Math.floor(
    Math.random() * 20 + 80
  )}%`;
}

function updateSystemStatsChart() {
  const ctx = document.getElementById("systemStatsChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["1", "2", "3", "4", "5", "6", "7"],
      datasets: [
        {
          label: "שימוש ב-CPU",
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: "rgba(75, 192, 192, 1)",
          tension: 0.1,
        },
        {
          label: "שימוש בזיכרון",
          data: [28, 48, 40, 19, 86, 27, 90],
          borderColor: "rgba(255, 99, 132, 1)",
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadBots();
  showSection("dashboard");
  updateDateTime();
  setInterval(updateDashboard, 5000);
  setInterval(updateDateTime, 1000);

  const menuToggle = document.querySelector(".menu-toggle");
  const sidebar = document.querySelector(".sidebar");

  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  document.getElementById("bot-search").addEventListener("input", renderBots);
  document
    .getElementById("bot-filter-status")
    .addEventListener("change", renderBots);
  document
    .getElementById("bot-filter-category")
    .addEventListener("change", renderBots);

  document
    .getElementById("add-update-task-form")
    .addEventListener("submit", addUpdateTask);

  renderUpdateTasks();
  renderChangelog();
  enableDashboardCustomization();
});

// הוספת מאזין אירועים לטופס ההגדרות
document
  .getElementById("settings-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    const theme = document.getElementById("theme").value;
    const language = document.getElementById("language").value;
    const notifications = document.getElementById("notifications").checked;
    const autoUpdate = document.getElementById("auto-update").checked;

    // כאן תוכל להוסיף לוגיקה לשמירת ההגדרות
    console.log("הגדרות נשמרו:", {
      theme,
      language,
      notifications,
      autoUpdate,
    });

    // הודעה למשתמש
    alert("ההגדרות נשמרו בהצלחה!");
  });

let tasks = [];

function showNotification(message, type = "success") {
  const notificationContainer = document.getElementById(
    "notifications-container"
  );
  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
  notificationContainer.appendChild(notification);

  notification
    .querySelector(".close-notification")
    .addEventListener("click", () => {
      notificationContainer.removeChild(notification);
    });

  setTimeout(() => {
    notificationContainer.removeChild(notification);
  }, 5000);
}

function addTask(event) {
  event.preventDefault();
  const taskName = document.getElementById("task-name").value;
  const taskDescription = document.getElementById("task-description").value;
  const taskBot = document.getElementById("task-bot").value;
  const taskDueDate = document.getElementById("task-due-date").value;

  const newTask = {
    id: Date.now(),
    name: taskName,
    description: taskDescription,
    bot: taskBot,
    dueDate: taskDueDate,
    status: "pending",
  };

  tasks.push(newTask);
  renderTasks();
  showNotification("משימה חדשה נוספה בהצלחה");
  event.target.reset();
}

function renderTasks() {
  const taskList = document.querySelector(".task-list");
  taskList.innerHTML = "";

  tasks.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className = "task-item";
    taskElement.innerHTML = `
            <div class="task-info">
                <h3>${task.name}</h3>
                <p>${task.description}</p>
                <p>בוט: ${task.bot}</p>
                <p>תאריך יעד: ${task.dueDate}</p>
                <p>סטטוס: ${task.status}</p>
            </div>
            <div class="task-actions">
                <button onclick="updateTaskStatus(${task.id}, 'completed')" class="action-btn">סיים משימה</button>
                <button onclick="deleteTask(${task.id})" class="action-btn">מחק משימה</button>
            </div>
        `;
    taskList.appendChild(taskElement);
  });
}

function updateTaskStatus(taskId, newStatus) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = newStatus;
    renderTasks();
    showNotification(`סטטוס המשימה "${task.name}" עודכן ל-${newStatus}`);
  }
}

function deleteTask(taskId) {
  tasks = tasks.filter((t) => t.id !== taskId);
  renderTasks();
  showNotification("המשימה נמחקה בהצלחה", "warning");
}

document.addEventListener("DOMContentLoaded", () => {
  // קוד קיים...

  document.getElementById("add-task-form").addEventListener("submit", addTask);

  // מילוי אפשרויות הבוטים בטופס המשימות
  const taskBotSelect = document.getElementById("task-bot");
  bots.forEach((bot) => {
    const option = document.createElement("option");
    option.value = bot.name;
    option.textContent = bot.name;
    taskBotSelect.appendChild(option);
  });

  renderTasks();
});

// פונקציה לבקשת אישור לקבלת התראות
function requestNotificationPermission() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotification("התראות אושרו בהצלחה!");
      }
    });
  }
}

let updateTasks = [];
let changelog = [];

function renderBots() {
  const botContainer = document.getElementById("bot-container");
  botContainer.innerHTML = "";

  const searchTerm = document.getElementById("bot-search").value.toLowerCase();
  const statusFilter = document.getElementById("bot-filter-status").value;
  const categoryFilter = document.getElementById("bot-filter-category").value;

  bots.forEach((bot, index) => {
    if (
      (searchTerm === "" ||
        bot.name.toLowerCase().includes(searchTerm) ||
        bot.role.toLowerCase().includes(searchTerm)) &&
      (statusFilter === "all" || bot.status === statusFilter) &&
      (categoryFilter === "all" || bot.type === categoryFilter)
    ) {
      const botCard = document.createElement("div");
      botCard.className = "bot-card";

      const statusText =
        bot.status === "active"
          ? "פעיל"
          : bot.status === "pending"
          ? "בהמתנה"
          : "כבוי";
      const botInfo = `
                <h3>${bot.name}</h3>
                <p>תפקיד: ${bot.role}</p>
                <p>סוג: ${bot.type}</p>
                <p>תיאור: ${bot.description}</p>
                <span class="bot-status ${bot.status}">${statusText}</span>
                <div>
                    <button onclick="toggleBotStatus(${index}, 'active')" class="action-btn">הפעל</button>
                    <button onclick="toggleBotStatus(${index}, 'inactive')" class="action-btn">כבה</button>
                    <button onclick="toggleBotStatus(${index}, 'pending')" class="action-btn">המתן</button>
                </div>
            `;

      botCard.innerHTML = botInfo;
      botContainer.appendChild(botCard);
    }
  });
}

function addUpdateTask(event) {
  event.preventDefault();
  const taskName = document.getElementById("update-task-name").value;
  const taskDescription = document.getElementById(
    "update-task-description"
  ).value;

  const newTask = {
    id: Date.now(),
    name: taskName,
    description: taskDescription,
    status: "pending",
  };

  updateTasks.push(newTask);
  renderUpdateTasks();
  showNotification("משימת עדכון חדשה נוספה בהצלחה");
  event.target.reset();
}

function renderUpdateTasks() {
  const updateTasksList = document.getElementById("update-tasks-list");
  updateTasksList.innerHTML = "";

  updateTasks.forEach((task) => {
    const taskElement = document.createElement("li");
    taskElement.innerHTML = `
            <h4>${task.name}</h4>
            <p>${task.description}</p>
            <p>סטטוס: ${task.status}</p>
            <button onclick="completeUpdateTask(${task.id})" class="action-btn">סיים משימה</button>
        `;
    updateTasksList.appendChild(taskElement);
  });
}

function completeUpdateTask(taskId) {
  const task = updateTasks.find((t) => t.id === taskId);
  if (task) {
    task.status = "completed";
    changelog.push(`עדכון: ${task.name} הושלם`);
    renderUpdateTasks();
    renderChangelog();
    showNotification(`משימת העדכון "${task.name}" הושלמה`);
  }
}

function renderChangelog() {
  const changelogList = document.getElementById("changelog-list");
  changelogList.innerHTML = "";

  changelog.forEach((entry) => {
    const entryElement = document.createElement("li");
    entryElement.textContent = entry;
    changelogList.appendChild(entryElement);
  });
}

// הוסף פונקציה חדשה לשמירת העדפות הדשבורד
function saveDashboardPreferences() {
  const widgets = document.querySelectorAll(".dashboard-card");
  const preferences = Array.from(widgets).map((widget) => ({
    id: widget.id,
    visible: !widget.classList.contains("hidden"),
    order: widget.style.order,
  }));
  localStorage.setItem("dashboardPreferences", JSON.stringify(preferences));
}

// הוסף פונקציה חדשה לטעינת העדפות הדשבורד
function loadDashboardPreferences() {
  const preferences = JSON.parse(localStorage.getItem("dashboardPreferences"));
  if (preferences) {
    preferences.forEach((pref) => {
      const widget = document.getElementById(pref.id);
      if (widget) {
        widget.classList.toggle("hidden", !pref.visible);
        widget.style.order = pref.order;
      }
    });
  }
}

// הוסף מאזיני אירועים לגרירה ושחרור של ווידג'טים
function enableDashboardCustomization() {
  const dashboard = document.querySelector(".dashboard-grid");
  let draggedItem = null;

  dashboard.addEventListener("dragstart", (e) => {
    draggedItem = e.target;
    e.dataTransfer.setData("text/plain", "");
  });

  dashboard.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  dashboard.addEventListener("drop", (e) => {
    e.preventDefault();
    if (e.target.classList.contains("dashboard-card")) {
      const afterElement = getDragAfterElement(dashboard, e.clientY);
      if (afterElement) {
        dashboard.insertBefore(draggedItem, afterElement);
      } else {
        dashboard.appendChild(draggedItem);
      }
      saveDashboardPreferences();
    }
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".dashboard-card:not(.dragging)"),
  ];
  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

function setupNotifications() {
  if ("Notification" in window) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        console.log("התראות אושרו");
      }
    });
  }
}

function showNotification(title, body) {
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  }
}

// קרא לפונקציה זו בטעינת הדף
document.addEventListener("DOMContentLoaded", () => {
  // קוד קיים...
  setupNotifications();
});

// דוגמה לשימוש:
// showNotification('בוט חדש נוסף', 'הבוט "Social Media Manager" נוסף למערכת');

function saveVersion(botId) {
  const bot = bots.find((b) => b.id === botId);
  if (bot) {
    if (!bot.versions) bot.versions = [];
    bot.versions.push({
      timestamp: new Date().toISOString(),
      data: JSON.parse(JSON.stringify(bot)),
    });
    showNotification("גרסה נשמרה", `נשמרה גרסה חדשה של הבוט "${bot.name}"`);
  }
}

function restoreVersion(botId, versionIndex) {
  const bot = bots.find((b) => b.id === botId);
  if (bot && bot.versions && bot.versions[versionIndex]) {
    Object.assign(bot, bot.versions[versionIndex].data);
    renderBots();
    showNotification("גרסה שוחזרה", `הבוט "${bot.name}" שוחזר לגרסה קודמת`);
  }
}

// עדכן את פונקציית renderBots כדי להוסיף כפתורי שמירה ושחזור גרסאות
function renderBots() {
  // קוד קיים...
  bots.forEach((bot, index) => {
    // קוד קיים...
    botCard.innerHTML += `
            <button onclick="saveVersion(${bot.id})" class="action-btn">שמור גרסה</button>
            <button onclick="showVersionHistory(${bot.id})" class="action-btn">היסטוריית גרסאות</button>
        `;
  });
}

function showVersionHistory(botId) {
  const bot = bots.find((b) => b.id === botId);
  if (bot && bot.versions) {
    const versionList = bot.versions
      .map(
        (version, index) =>
          `<li>
                גרסה ${index + 1} - ${new Date(
            version.timestamp
          ).toLocaleString()}
                <button onclick="restoreVersion(${
                  bot.id
                }, ${index})">שחזר</button>
            </li>`
      )
      .join("");

    showModal(`היסטוריית גרסאות - ${bot.name}`, `<ul>${versionList}</ul>`);
  }
}

function showModal(title, content) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.innerHTML = `
        <div class="modal-content">
            <h2>${title}</h2>
            ${content}
            <button onclick="this.closest('.modal').remove()">סגור</button>
        </div>
    `;
  document.body.appendChild(modal);
}

function addRecurringTask(event) {
  event.preventDefault();
  const taskName = document.getElementById("recurring-task-name").value;
  const taskDescription = document.getElementById(
    "recurring-task-description"
  ).value;
  const taskBot = document.getElementById("recurring-task-bot").value;
  const taskFrequency = document.getElementById(
    "recurring-task-frequency"
  ).value;

  const newTask = {
    id: Date.now(),
    name: taskName,
    description: taskDescription,
    bot: taskBot,
    frequency: taskFrequency,
    status: "pending",
    nextDue: new Date().toISOString(),
  };

  tasks.push(newTask);
  renderTasks();
  showNotification("משימה חוזרת נוספה", `המשימה "${taskName}" נוספה בהצלחה`);
  event.target.reset();
}

function updateTaskCalendar() {
  const calendarEl = document.getElementById("task-calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    events: tasks.map((task) => ({
      title: task.name,
      start: task.dueDate || task.nextDue,
      allDay: true,
      backgroundColor: task.status === "completed" ? "#48bb78" : "#ed8936",
    })),
  });
  calendar.render();
}

// עדכן את פונקציית renderTasks
function renderTasks() {
  // קוד קיים...
  updateTaskCalendar();
}

// הוסף את הקוד הבא ל-DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // קוד קיים...
  document
    .getElementById("add-recurring-task-form")
    .addEventListener("submit", addRecurringTask);
});
