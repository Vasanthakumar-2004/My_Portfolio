(() => {
  const DEFAULT_ENDPOINT = "https://script.google.com/macros/s/AKfycbxq3XnWbDhPx257gtrZGJ5Cny6Xc65-8sm-J-P-5jkpeSm6nsvsNx46kxS2k51-QV_N/exec";
  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = msg || "";
    if (kind === "success") el.style.color = "lightgreen";
    else if (kind === "error") el.style.color = "#ff6b6b";
    else el.style.color = "white";
  }

  async function submitToSheets(endpoint, data) {
    const body = new URLSearchParams(data);
    await fetch(endpoint, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    return true;
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
    if (/^https?:\/\/forms\.gle\//i.test(endpoint) || /^https?:\/\/docs\.google\.com\/forms\//i.test(endpoint)) {
      e.preventDefault();
      setStatus(statusEl, "You pasted a Google Forms link. Use the Apps Script Web App URL (script.google.com/.../exec) from GOOGLE_SHEETS_SETUP.md.", "error");
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
      await submitToSheets(endpoint, { name, email, message, page: location.pathname, ts: new Date().toISOString() });
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
