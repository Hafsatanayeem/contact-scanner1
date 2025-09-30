document.addEventListener("DOMContentLoaded", () => {
  const html5QrCode = new Html5Qrcode("reader");

  const qrConfig = { fps: 10, qrbox: 250 };

  const nameField = document.getElementById("name");
  const phoneField = document.getElementById("phone");
  const emailField = document.getElementById("email");
  const saveBtn = document.getElementById("saveBtn");

  function onScanSuccess(decodedText) {
    try {
      // Expect QR to contain JSON like: {"name":"John Doe","phone":"1234567890","email":"john@example.com"}
      const contact = JSON.parse(decodedText);

      nameField.textContent = contact.name || "N/A";
      phoneField.textContent = contact.phone || "N/A";
      emailField.textContent = contact.email || "N/A";
      saveBtn.disabled = false;
    } catch (e) {
      alert("Invalid QR code format! Please use JSON contact info.");
    }

    html5QrCode.stop().catch(err => console.error("Stop failed:", err));
  }

  html5QrCode.start(
    { facingMode: "environment" }, // Use rear camera
    qrConfig,
    onScanSuccess
  ).catch(err => console.error("Camera start error:", err));

  saveBtn.addEventListener("click", () => {
    const name = nameField.textContent;
    const phone = phoneField.textContent;
    const email = emailField.textContent;

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${name}
TEL:${phone}
EMAIL:${email}
END:VCARD`;

    const blob = new Blob([vCard], { type: "text/vcard" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  });
});