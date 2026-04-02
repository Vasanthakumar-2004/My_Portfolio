(() => {
  const DEFAULT_ENDPOINT = "";

  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg || "";
    if (kind === "success") el.style.color = "lightgreen";
    else if (kind === "error") el.style.color = "#ff6b6b";
    else el.style.color = "white";
  }

  async function submitToSheets(endpoint, data) {
    const body = new URLSearchParams(data);
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8" },
      body,
    });
    return res.ok;
  }

  async function onSubmit(e) {
    const form = e.currentTarget;
    const statusEl = document.getElementById("contact-status");
    const endpoint = (form.getAttribute("data-sheets-endpoint") || DEFAULT_ENDPOINT).trim();

    if (!endpoint) {
      e.preventDefault();
      setStatus(statusEl, "Setup needed: add your Google Sheets Web App URL in data-sheets-endpoint.", "error");
      return;
    }

    e.preventDefault();
    const submitBtn = form.querySelector("button[type=\"submit\"]");
    const name = (form.elements.namedItem("name")?.value || "").trim();
    const email = (form.elements.namedItem("email")?.value || "").trim();
    const message = (form.elements.namedItem("message")?.value || "").trim();

    if (!name || !email || !message) {
      setStatus(statusEl, "Please fill name, email, and message.", "error");
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    setStatus(statusEl, "Sending…", "info");

    try {
      const ok = await submitToSheets(endpoint, { name, email, message, page: location.pathname, ts: new Date().toISOString() });
      if (!ok) throw new Error("Request failed");
      form.reset();
      setStatus(statusEl, "Message sent successfully.", "success");
    } catch {
      setStatus(statusEl, "Failed to send. Please try again.", "error");
    } finally {
      if (submitBtn) submitBtn.disabled = false;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    if (!form) return;
    form.addEventListener("submit", onSubmit);
  });
})();
