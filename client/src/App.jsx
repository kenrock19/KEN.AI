import { useState } from "react";
import "./App.css";

const navigationItems = [
  { id: "dashboard", icon: "⌂", label: "Dashboard" },
  { id: "chat", icon: "✦", label: "AI Chat" },
  { id: "documents", icon: "▤", label: "Documents" },
  { id: "email", icon: "✉", label: "Email" },
  { id: "powerbi", icon: "▥", label: "Power BI" },
  { id: "safety", icon: "◈", label: "EHS & Safety" },
  { id: "it", icon: "⌘", label: "IT Support" },
  { id: "school", icon: "◇", label: "School" },
];

const quickActions = [
  {
    icon: "✉",
    title: "Draft an Email",
    description: "Create a professional workplace email.",
  },
  {
    icon: "▤",
    title: "Upload a Document",
    description: "Analyze reports, PDFs, and spreadsheets.",
  },
  {
    icon: "◈",
    title: "Create Safety Talk",
    description: "Generate a toolbox talk for employees.",
  },
  {
    icon: "▥",
    title: "Analyze Data",
    description: "Get help with Excel and Power BI.",
  },
];

const projects = [
  {
    name: "Machine Issue Tracking App",
    category: "Power Apps",
    status: "In Progress",
  },
  {
    name: "Weekly KPI Automation",
    category: "Power BI",
    status: "Planning",
  },
  {
    name: "Final Inspection Automation",
    category: "Manufacturing",
    status: "In Progress",
  },
];

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-logo">K</div>

          <div>
            <h1>KEN.AI</h1>
            <p>Intelligent Workspace</p>
          </div>
        </div>

        <nav className="navigation" aria-label="Main navigation">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              className={
                activePage === item.id
                  ? "nav-button active"
                  : "nav-button"
              }
              onClick={() => setActivePage(item.id)}
              type="button"
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button
            className="nav-button"
            onClick={() => setActivePage("settings")}
            type="button"
          >
            <span className="nav-icon">⚙</span>
            <span>Settings</span>
          </button>

          <div className="user-card">
            <div className="avatar">KL</div>

            <div>
              <strong>Ken LaVoie</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">KEN.AI COMMAND CENTER</p>
            <h2>Good morning, Ken</h2>
            <p className="subtitle">
              Here is what is happening across your workspace.
            </p>
          </div>

          <div className="topbar-actions">
            <button className="icon-button" type="button">
              🔔
            </button>

            <button className="new-chat-button" type="button">
              <span>✦</span>
              New AI Chat
            </button>
          </div>
        </header>

        {activePage === "dashboard" ? (
          <Dashboard />
        ) : (
          <ComingSoon
            page={
              navigationItems.find(
                (item) => item.id === activePage
              )?.label || "Settings"
            }
          />
        )}
      </main>
    </div>
  );
}

function Dashboard() {
  return (
    <div className="dashboard">
      <section className="hero-card">
        <div>
          <span className="hero-label">KEN.AI ASSISTANT</span>

          <h3>What can I help you accomplish today?</h3>

          <p>
            Draft emails, create reports, analyze information,
            troubleshoot IT problems, or organize your projects.
          </p>
        </div>

        <button className="hero-button" type="button">
          Start a conversation
          <span>→</span>
        </button>
      </section>

      <section className="metrics-grid">
        <MetricCard
          icon="▤"
          value="8"
          label="Active Projects"
          detail="3 need attention"
        />

        <MetricCard
          icon="✓"
          value="12"
          label="Tasks Completed"
          detail="This month"
        />

        <MetricCard
          icon="✦"
          value="24"
          label="AI Conversations"
          detail="Recent activity"
        />

        <MetricCard
          icon="◈"
          value="0"
          label="Open Safety Issues"
          detail="All clear"
          positive
        />
      </section>

      <div className="dashboard-columns">
        <section className="panel quick-actions-panel">
          <div className="panel-header">
            <div>
              <h3>Quick Actions</h3>
              <p>Start a common KEN.AI task.</p>
            </div>
          </div>

          <div className="quick-actions-grid">
            {quickActions.map((action) => (
              <button
                className="quick-action"
                key={action.title}
                type="button"
              >
                <span className="quick-action-icon">
                  {action.icon}
                </span>

                <span>
                  <strong>{action.title}</strong>
                  <small>{action.description}</small>
                </span>

                <span className="action-arrow">→</span>
              </button>
            ))}
          </div>
        </section>

        <section className="panel activity-panel">
          <div className="panel-header">
            <div>
              <h3>Recent Activity</h3>
              <p>Your latest KEN.AI work.</p>
            </div>

            <button className="text-button" type="button">
              View all
            </button>
          </div>

          <div className="activity-list">
            <ActivityItem
              icon="✉"
              title="Weekly report drafted"
              time="20 minutes ago"
            />

            <ActivityItem
              icon="◈"
              title="Forklift safety talk created"
              time="Yesterday"
            />

            <ActivityItem
              icon="▥"
              title="KPI spreadsheet analyzed"
              time="2 days ago"
            />
          </div>
        </section>
      </div>

      <section className="panel projects-panel">
        <div className="panel-header">
          <div>
            <h3>Current Projects</h3>
            <p>Track the initiatives you are working on.</p>
          </div>

          <button className="text-button" type="button">
            View portfolio
          </button>
        </div>

        <div className="project-table">
          <div className="project-row project-heading">
            <span>Project</span>
            <span>Category</span>
            <span>Status</span>
            <span></span>
          </div>

          {projects.map((project) => (
            <div className="project-row" key={project.name}>
              <strong>{project.name}</strong>
              <span>{project.category}</span>

              <span
                className={`status-badge ${project.status
                  .toLowerCase()
                  .replaceAll(" ", "-")}`}
              >
                {project.status}
              </span>

              <button className="row-button" type="button">
                Open
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MetricCard({
  icon,
  value,
  label,
  detail,
  positive = false,
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon">{icon}</div>

      <div>
        <strong className="metric-value">{value}</strong>
        <p>{label}</p>

        <span className={positive ? "positive" : ""}>
          {detail}
        </span>
      </div>
    </article>
  );
}

function ActivityItem({ icon, title, time }) {
  return (
    <div className="activity-item">
      <span className="activity-icon">{icon}</span>

      <div>
        <strong>{title}</strong>
        <span>{time}</span>
      </div>
    </div>
  );
}

function ComingSoon({ page }) {
  return (
    <section className="coming-soon">
      <div className="coming-soon-icon">✦</div>
      <p className="eyebrow">KEN.AI V2</p>
      <h3>{page}</h3>

      <p>
        This workspace is ready for us to build next. Use the
        Dashboard button to return home.
      </p>
    </section>
  );
}

export default App;
