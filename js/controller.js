/* =====================================================================
   CONTROLLER — listens to the user, updates the Model, tells the View.
   ===================================================================== */

const Controller = {

  transitioning: false,

  init() {
    View.init();
    this.bindMenu();
    this.bindKeyboard();
    this.bindBackButtons();
    this.bindAudioToggle();
    this.bindContactForm();
  },

  /* ---------- Contact form (relayed via formsubmit.co, mailto fallback) ---------- */
  bindContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const status = document.getElementById("form-status");
    const btn = form.querySelector(".form-send");

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      if (data._honey) return;  // honeypot caught a bot
      if (!data.name.trim() || !data.email.trim() || !data.message.trim()) {
        status.textContent = "Fill in all three fields first.";
        return;
      }
      btn.disabled = true;
      status.textContent = "Sending…";
      try {
        const res = await fetch(`https://formsubmit.co/ajax/${Model.contactEmail}`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            message: data.message,
            _subject: `Portfolio message from ${data.name}`,
          }),
        });
        if (!res.ok) throw new Error(res.status);
        status.textContent = "Sent! I'll get back to you soon.";
        form.reset();
        View.playSelect();
      } catch {
        // relay unreachable: open the visitor's own mail app instead
        status.textContent = "Couldn't reach the relay, opening your email app instead…";
        const subject = encodeURIComponent(`Portfolio message from ${data.name}`);
        const body = encodeURIComponent(`${data.message}\n\nReply to: ${data.email}`);
        location.href = `mailto:${Model.contactEmail}?subject=${subject}&body=${body}`;
      } finally {
        btn.disabled = false;
      }
    });
  },

  /* ---------- Navigation ---------- */
  goTo(screen) {
    if (this.transitioning || screen === Model.state.screen) return;
    this.transitioning = true;
    View.playSelect();

    View.wipe(
      () => {                       // mid-wipe: swap screens while covered
        Model.state.screen = screen;
        View.showScreen(screen);
        if (screen === "projects") this.loadProjects();
        if (screen === "skills") this.loadSkills();
        if (screen === "about") View.renderAchievements(Model.achievements);
      },
      () => { this.transitioning = false; }
    );
  },

  select(index) {
    const n = View.els.menuItems.length;
    const next = (index + n) % n;
    if (next !== Model.state.menuIndex) View.playSelect();
    Model.state.menuIndex = next;
    View.setMenuSelection(next);
  },

  bindMenu() {
    View.els.menuItems.forEach((item, i) => {
      item.addEventListener("mouseenter", () => this.select(i));
      item.addEventListener("click", () => this.goTo(item.dataset.target));
    });
    // clicking the big name goes back home
    const name = document.getElementById("big-name");
    if (name) name.addEventListener("click", () => this.goTo("home"));
  },

  bindBackButtons() {
    document.querySelectorAll("[data-back]").forEach(b => {
      b.addEventListener("click", () => this.goTo("home"));
    });
  },

  bindKeyboard() {
    addEventListener("keydown", e => {
      if (Model.state.screen === "home") {
        if (e.key === "ArrowDown") { e.preventDefault(); this.select(Model.state.menuIndex + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); this.select(Model.state.menuIndex - 1); }
        else if (e.key === "Enter") {
          const item = View.els.menuItems[Model.state.menuIndex];
          if (item) this.goTo(item.dataset.target);
        }
      } else if (e.key === "Escape") {
        this.goTo("home");
      }
    });
  },

  /* ---------- Audio on/off (synthesized blips, so no files to load) ---------- */
  bindAudioToggle() {
    const btn = document.getElementById("audio-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => {
      View.audioOn = !View.audioOn;
      btn.textContent = View.audioOn ? "🔊" : "🔇";
      btn.setAttribute("aria-label", View.audioOn ? "Turn audio off" : "Turn audio on");
      if (View.audioOn) View.playSelect();
    });
  },

  /* ---------- Screen data loading ---------- */
  async loadProjects() {
    View.renderFeatured(Model.featured);
    if (Model.state.reposLoaded) return;
    Model.state.reposLoaded = true;
    const { repos, live } = await Model.fetchRepos();
    View.renderRepos(
      repos,
      live ? `Live from github.com/${Model.githubUser}` : "GitHub unreachable — showing cached picks",
      Model
    );
  },

  loadSkills() {
    if (!Model.state.skillsBuilt) {
      Model.state.skillsBuilt = true;
      View.renderSkills(Model.skills);
    }
    View.animateSkillBars();
  },
};

document.addEventListener("DOMContentLoaded", () => Controller.init());
