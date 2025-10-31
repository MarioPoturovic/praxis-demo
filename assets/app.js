// assets/app.js

// 1) Put your Webhook URL here
const GHL_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/c/YOUR_GHL_WEBHOOK_URL_HERE";

// 2) Helper: normalize phone to something close to E.164 (+387… for BA by default).
function normalizePhone(raw) {
  if (!raw) return "";
  const digits = String(raw).replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) return digits;
  // Adjust default country code if needed
  return `+387${digits.replace(/^0+/, "")}`;
}

// 3) Auto-fill UTM + page_url
(function setTrackingFields() {
  const params = new URLSearchParams(location.search);
  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val || "";
  };
  setVal("utm_source", params.get("utm_source"));
  setVal("utm_medium", params.get("utm_medium"));
  setVal("utm_campaign", params.get("utm_campaign"));
  setVal("page_url", location.href);
})();

// 4) Handle submit via fetch (AJAX). Keeps you on the page.
(function wireForm() {
  const form = document.getElementById("appointmentForm");
  const message = document.getElementById("formMessage");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: if filled, silently "succeed"
    if (form.website && form.website.value) {
      showSuccess();
      form.reset();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    // minimal cleanup
    data.phone = normalizePhone(data.phone);

    // Construct the payload as your workflow expects it
    // You used first_name / email / phone; keep that
    const payload = {
      first_name: data.first_name || "",
      email: data.email || "",
      phone: data.phone || "",
      utm_source: data.utm_source || "",
      utm_medium: data.utm_medium || "",
      utm_campaign: data.utm_campaign || "",
      page_url: data.page_url || ""
    };

    try {
      const res = await fetch(GHL_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        showSuccess();
        form.reset();
      } else {
        const txt = await res.text();
        showError("There was a problem. Please try again.");
        console.error("Webhook error:", txt);
      }
    } catch (err) {
      console.error(err);
      showError("Network error. Please try again.");
    }

    function showSuccess() {
      message.textContent = "✅ Thank you! We’ll contact you soon.";
      message.classList.remove("hidden");
      message.classList.add("block", "text-emerald-400");
      setTimeout(() => message.classList.add("hidden"), 5000);
    }
    function showError(text) {
      message.textContent = `❌ ${text}`;
      message.classList.remove("hidden");
      message.classList.add("block", "text-red-400");
    }
  });
})();
