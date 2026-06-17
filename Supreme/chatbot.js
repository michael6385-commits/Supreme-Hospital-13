/* 
===============================================
CHATBOT WIDGET SCRIPT
Theme: Supreme Speciality Hospitals Premium
===============================================
*/

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSupremeChatbot);
} else {
    initSupremeChatbot();
}

function initSupremeChatbot() {
    // Avoid double injection
    if (document.getElementById("supreme-chat-container")) return;

    // Create container
    const container = document.createElement("div");
    container.id = "supreme-chat-container";
    container.innerHTML = `
        <!-- Floating Bubble Trigger -->
        <button class="supreme-chat-trigger" id="supreme-chat-trigger" aria-label="Open Chat Assistant">
            <img src="images/chatbot-icon.png" alt="Chat Assistant">
            <span class="supreme-chat-badge" id="supreme-chat-badge" style="top: 0; right: 0;"></span>
        </button>

        <!-- Chat Window Panel -->
        <div class="supreme-chat-panel" id="supreme-chat-panel">
            <!-- Header -->
            <div class="supreme-chat-header">
                <div class="supreme-chat-header-info">
                    <div class="supreme-chat-avatar" style="background: none; border: none;">
                        <img src="images/chatbot-icon.png" alt="Avatar" style="width: 100%; height: 100%; object-fit: contain;">
                        <span class="supreme-chat-avatar-online" style="bottom: 0; right: 0;"></span>
                    </div>
                    <div class="supreme-chat-header-text">
                        <h4>Supreme Assistant</h4>
                        <span>Active Support</span>
                    </div>
                </div>
                <button class="supreme-chat-close-btn" id="supreme-chat-close" aria-label="Close Chat">
                    <i class="fas fa-times"></i>
                </button>
            </div>

            <!-- Messages Box -->
            <div class="supreme-chat-messages" id="supreme-chat-messages">
                <!-- Welcome greeting -->
                <div class="supreme-chat-msg bot">
                    <div class="supreme-chat-msg-avatar" style="background: transparent; overflow: hidden;">
                        <img src="images/chatbot-icon.png" alt="Bot" style="width: 100%; height: 100%; object-fit: contain;">
                    </div>
                    <div class="supreme-chat-msg-content">
                        <div class="supreme-chat-bubble">
                            Greetings from Supreme Speciality Hospitals! 🏥<br><br>
                            We are online and available to talk right now. To initiate, select options given below or type your query in the chatbox.
                            
                            <div class="supreme-chat-options">
                                <button class="supreme-chat-opt-btn" data-action="book">
                                    <span>📅 Book an Appointment</span> <i class="fas fa-chevron-right"></i>
                                </button>
                                <button class="supreme-chat-opt-btn" data-action="doctors">
                                    <span>🩺 Find a Doctor / Specialty</span> <i class="fas fa-chevron-right"></i>
                                </button>
                                <button class="supreme-chat-opt-btn" data-action="emergency">
                                    <span>🚨 Emergency & Contact</span> <i class="fas fa-chevron-right"></i>
                                </button>
                                <button class="supreme-chat-opt-btn" data-action="callback_form">
                                    <span>📞 Request a Callback</span> <i class="fas fa-chevron-right"></i>
                                </button>
                            </div>
                        </div>
                        <span class="supreme-chat-timestamp">Just now</span>
                    </div>
                </div>
            </div>

            <!-- Footer / Input Form -->
            <form class="supreme-chat-footer" id="supreme-chat-input-form">
                <div class="supreme-chat-input-wrapper">
                    <input type="text" class="supreme-chat-text-input" id="supreme-chat-input" placeholder="Ask about doctors, departments, timing..." autocomplete="off">
                    <button type="submit" class="supreme-chat-send-btn" id="supreme-chat-send" aria-label="Send Message">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(container);

    // Grab elements
    const trigger = document.getElementById("supreme-chat-trigger");
    const panel = document.getElementById("supreme-chat-panel");
    const closeBtn = document.getElementById("supreme-chat-close");
    const badge = document.getElementById("supreme-chat-badge");
    const messagesBox = document.getElementById("supreme-chat-messages");
    const inputForm = document.getElementById("supreme-chat-input-form");
    const inputField = document.getElementById("supreme-chat-input");

    let isOpenedOnce = false;

    // Toggle Chat Panel
    trigger.addEventListener("click", () => {
        const isOpen = panel.classList.toggle("open");
        trigger.classList.toggle("active", isOpen);
        
        if (isOpen) {
            badge.style.display = "none"; // Hide notification badge once opened
            isOpenedOnce = true;
            inputField.focus();
            
            // Auto-scroll to bottom
            scrollToBottom();
        }
    });

    // Close Panel
    closeBtn.addEventListener("click", () => {
        panel.classList.remove("open");
        trigger.classList.remove("active");
    });

    // Bind click to existing footer chatbot image if it exists
    const footerChatbot = document.querySelector(".chatbot-wrapper, .chatbot-img");
    if (footerChatbot) {
        footerChatbot.style.cursor = "pointer";
        footerChatbot.addEventListener("click", (e) => {
            e.preventDefault();
            const isOpen = panel.classList.toggle("open");
            trigger.classList.toggle("active", isOpen);
            if (isOpen) {
                badge.style.display = "none";
                isOpenedOnce = true;
                inputField.focus();
                scrollToBottom();
            }
        });
    }

    // Handle Quick Action Options (delegated click)
    messagesBox.addEventListener("click", (e) => {
        const btn = e.target.closest(".supreme-chat-opt-btn");
        if (!btn) return;

        const action = btn.getAttribute("data-action");
        handleQuickAction(action);
    });

    // Handle Text Input Form Submit
    inputForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = inputField.value.trim();
        if (!text) return;

        // Add user message
        addUserMessage(text);
        inputField.value = "";

        // Trigger bot response after a brief simulated typing delay
        showTypingIndicator();
        setTimeout(() => {
            removeTypingIndicator();
            const reply = generateAiReply(text);
            addBotMessage(reply);
        }, 1000 + Math.random() * 800);
    });

    // Quick Actions Logic
    function handleQuickAction(action) {
        if (action === "book") {
            addUserMessage("I would like to book an appointment.");
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBotMessage(`
                    To book an appointment, you can visit our direct scheduling page:
                    <a href="book-an-appointment.html" class="btn-block">Go to Booking Page</a>
                    Or, if you prefer, you can fill out our brief Callback Request Form right here in the chat:
                    <button class="supreme-chat-opt-btn mt-2" data-action="callback_form">📞 Open Callback Form</button>
                `);
            }, 800);
        } else if (action === "doctors") {
            addUserMessage("I want to find a doctor or specialty.");
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBotMessage(`
                    We have outstanding consultants across multiple specialties. What department are you interested in?
                    <div class="supreme-chat-options">
                        <button class="supreme-chat-opt-btn" data-action="dept_ortho">🦴 Orthopedics</button>
                        <button class="supreme-chat-opt-btn" data-action="dept_gyno">🤰 Gynecology & Obstetrics</button>
                        <button class="supreme-chat-opt-btn" data-action="dept_cardio">❤️ Cardiology</button>
                        <button class="supreme-chat-opt-btn" data-action="dept_derma">🧪 Dermatology</button>
                        <button class="supreme-chat-opt-btn" data-action="dept_all">🩺 Show All Specialties</button>
                    </div>
                `);
            }, 800);
        } else if (action === "emergency") {
            addUserMessage("Show me emergency and contact details.");
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBotMessage(`
                    🚨 **24/7 Emergency Helpline:**<br>
                    Call: <a href="tel:04467453535">**044 67453535**</a> (Immediate Ambulance & Critical Support)<br><br>
                    📞 **OPD / Front Desk Assistance:**<br>
                    Call: <a href="tel:+919940010007">**+91 99400 10007**</a><br><br>
                    📍 **Main Address:**<br>
                    No. 1/56, Old Mahabalipuram Road, Padur, Chennai 603103.
                `);
            }, 800);
        } else if (action === "callback_form") {
            addUserMessage("Request a Callback Form");
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                renderCallbackForm();
            }, 800);
        } else if (action.startsWith("dept_")) {
            const dept = action.replace("dept_", "");
            showTypingIndicator();
            setTimeout(() => {
                removeTypingIndicator();
                addBotMessage(getDepartmentInfo(dept));
            }, 800);
        }
    }

    // Render Form directly inside message box
    function renderCallbackForm() {
        const formId = "chat-callback-form-" + Date.now();
        const msgDiv = document.createElement("div");
        msgDiv.className = "supreme-chat-msg bot";
        msgDiv.innerHTML = `
            <div class="supreme-chat-msg-avatar" style="background: transparent; overflow: hidden;">
                <img src="images/chatbot-icon.png" alt="Bot" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="supreme-chat-msg-content">
                <div class="supreme-chat-bubble" style="width: 290px;">
                    Fill out the form below to book a chat callback:
                    <form class="supreme-chat-form" id="${formId}">
                        <div class="supreme-chat-form-group">
                            <label for="${formId}-name">Full Name</label>
                            <input type="text" id="${formId}-name" class="supreme-chat-input-field" placeholder="Your Name" required>
                        </div>
                        <div class="supreme-chat-form-group">
                            <label for="${formId}-phone">Phone Number</label>
                            <input type="tel" id="${formId}-phone" class="supreme-chat-input-field" placeholder="10-digit number" pattern="[0-9]{10}" required>
                        </div>
                        <div class="supreme-chat-form-group">
                            <label for="${formId}-dept">Specialty Needed</label>
                            <select id="${formId}-dept" class="supreme-chat-input-field" style="height: auto;" required>
                                <option value="" disabled selected>Select Specialty</option>
                                <option value="Orthopedics">Orthopedics</option>
                                <option value="Gynecology">Gynecology & Obstetrics</option>
                                <option value="Cardiology">Cardiology</option>
                                <option value="Dermatology">Dermatology</option>
                                <option value="General Medicine">General Medicine</option>
                                <option value="Pediatrics">Pediatrics</option>
                                <option value="Other">Other Query</option>
                            </select>
                        </div>
                        <button type="submit" class="supreme-chat-submit-btn">
                            Submit Request <i class="fas fa-paper-plane"></i>
                        </button>
                    </form>
                </div>
                <span class="supreme-chat-timestamp">Just now</span>
            </div>
        `;
        messagesBox.appendChild(msgDiv);
        scrollToBottom();

        // Bind form submission event
        const formElement = document.getElementById(formId);
        formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById(`${formId}-name`).value;
            const phone = document.getElementById(`${formId}-phone`).value;
            const dept = document.getElementById(`${formId}-dept`).value;

            // Disable button
            const submitBtn = formElement.querySelector("button");
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Sending...`;

            setTimeout(() => {
                formElement.parentElement.innerHTML = `
                    <div style="text-align: center; padding: 10px 0;">
                        <i class="fas fa-check-circle" style="color: #22c55e; font-size: 24px; margin-bottom: 8px;"></i>
                        <div style="font-weight: 700; color: var(--chat-secondary); font-size: 13.5px; margin-bottom: 4px;">Request Received!</div>
                        <div style="font-size: 12px; color: #64748b;">
                            Thank you **${name}**. Our health coordinator will call you back on **${phone}** shortly to confirm your booking for **${dept}**.
                        </div>
                    </div>
                `;
                scrollToBottom();
            }, 1200);
        });
    }

    // Add User Message Bubble
    function addUserMessage(text) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "supreme-chat-msg user";
        msgDiv.innerHTML = `
            <div class="supreme-chat-msg-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="supreme-chat-msg-content">
                <div class="supreme-chat-bubble">${escapeHtml(text)}</div>
                <span class="supreme-chat-timestamp">${getCurrentTime()}</span>
            </div>
        `;
        messagesBox.appendChild(msgDiv);
        scrollToBottom();
    }

    // Add Bot Message Bubble
    function addBotMessage(htmlContent) {
        const msgDiv = document.createElement("div");
        msgDiv.className = "supreme-chat-msg bot";
        msgDiv.innerHTML = `
            <div class="supreme-chat-msg-avatar" style="background: transparent; overflow: hidden;">
                <img src="images/chatbot-icon.png" alt="Bot" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="supreme-chat-msg-content">
                <div class="supreme-chat-bubble">${htmlContent}</div>
                <span class="supreme-chat-timestamp">${getCurrentTime()}</span>
            </div>
        `;
        messagesBox.appendChild(msgDiv);
        scrollToBottom();
    }

    // Typing Indicator functions
    function showTypingIndicator() {
        const indicator = document.createElement("div");
        indicator.className = "supreme-chat-msg bot";
        indicator.id = "supreme-chat-typing-indicator";
        indicator.innerHTML = `
            <div class="supreme-chat-msg-avatar" style="background: transparent; overflow: hidden;">
                <img src="images/chatbot-icon.png" alt="Bot" style="width: 100%; height: 100%; object-fit: contain;">
            </div>
            <div class="supreme-chat-msg-content">
                <div class="supreme-chat-bubble">
                    <div class="supreme-typing-indicator">
                        <span class="supreme-typing-dot"></span>
                        <span class="supreme-typing-dot"></span>
                        <span class="supreme-typing-dot"></span>
                    </div>
                </div>
            </div>
        `;
        messagesBox.appendChild(indicator);
        scrollToBottom();
    }

    function removeTypingIndicator() {
        const indicator = document.getElementById("supreme-chat-typing-indicator");
        if (indicator) indicator.remove();
    }

    // Scroll to bottom helper
    function scrollToBottom() {
        messagesBox.scrollTop = messagesBox.scrollHeight;
    }

    // Time helper
    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        return hours + ':' + minutes + ' ' + ampm;
    }

    // HTML escape helper
    function escapeHtml(unsafe) {
        return unsafe
             .replace(/&/g, "&amp;")
             .replace(/</g, "&lt;")
             .replace(/>/g, "&gt;")
             .replace(/"/g, "&quot;")
             .replace(/'/g, "&#039;");
    }

    // Department-specific Info Fetcher
    function getDepartmentInfo(dept) {
        switch (dept) {
            case "ortho":
                return `
                    🦴 **Orthopedics Department**<br>
                    Specializing in bone and joint replacement, fractures, and sports injuries.<br><br>
                    Our Orthopedic specialists:<br>
                    • **Dr. Abdul Khader. F** (MBBS, MS Ortho, MCh Ortho) - Senior Consultant<br>
                    • **Dr. Thirumal** (Fracture, joint replacements knee/hip) - Senior Consultant<br><br>
                    <a href="book-an-appointment.html" class="btn-block">Book Orthopedic Appointment</a>
                `;
            case "gyno":
                return `
                    🤰 **Obstetrics & Gynecology**<br>
                    Providing full maternity care, infertility treatment, and gynecological surgeries.<br><br>
                    Our Specialist:<br>
                    • **Dr. K. Rini Ezhil** (Senior Consultant) - PCOS, prenatal & delivery care.<br><br>
                    <a href="book-an-appointment.html" class="btn-block">Book Gynecology Appointment</a>
                `;
            case "cardio":
                return `
                    ❤️ **Cardiology Department**<br>
                    Comprehensive heart health diagnostics, screenings, and treatments.<br><br>
                    Our team provides 24/7 emergency cardiology and modern cardiac assessment labs.<br><br>
                    <a href="book-an-appointment.html" class="btn-block">Book Cardiology Appointment</a>
                `;
            case "derma":
                return `
                    🧪 **Dermatology & Cosmetology**<br>
                    Expert treatment for skin disorders, eczema, psoriasis, acne, and cosmetic rejuvenation.<br><br>
                    Our Specialist:<br>
                    • **Dr. Yuwarani** (Senior Consultant)<br><br>
                    <a href="book-an-appointment.html" class="btn-block">Book Dermatology Appointment</a>
                `;
            case "all":
            default:
                return `
                    🩺 **Supreme Medical Specialties:**<br>
                    - Orthopedics (Dr. Abdul Khader / Dr. Thirumal)<br>
                    - Gynecology & Obstetrics (Dr. K. Rini Ezhil)<br>
                    - Dermatology (Dr. Yuwarani)<br>
                    - Diabetology (Dr. R. Arun Kumar)<br>
                    - Psychiatry (Dr. Arasi D. M)<br>
                    - General Medicine (Dr. Bravian Samvict Devadas)<br>
                    - General Surgery (Dr. Felix Anandraj)<br>
                    - Gastroenterology (Dr. Arun Kasiviswanathan)<br>
                    - Palliative Care (Dr. Shery Angel Rajakumar)<br>
                    - Pediatrics, ENT, Cardiology, Urology, Radiology.<br><br>
                    Would you like to speak to a counselor? Fill out the callback request form above!
                `;
        }
    }

    // Simulated Natural Language Query / FAQ Engine
    function generateAiReply(query) {
        const text = query.toLowerCase();

        // 1. GREETINGS
        if (text.match(/\b(hi|hello|hey|greetings|hola|good morning|good afternoon)\b/)) {
            return "Hello! Welcome to Supreme Speciality Hospitals. How can I help you today?";
        }

        // 2. APPOINTMENT / BOOKING
        if (text.includes("appointment") || text.includes("book") || text.includes("schedule") || text.includes("consultation")) {
            return `
                To schedule a visit or consultation, you can:<br>
                1. Request a callback in this chat by opening our form:<br>
                   <button class="supreme-chat-opt-btn mt-2" data-action="callback_form">📞 Request Callback</button>
                2. Complete the online booking form:<br>
                   <a href="book-an-appointment.html" class="btn-block">Go to Booking Page</a>
                3. Call our front desk at <a href="tel:+919940010007">+91 99400 10007</a>.
            `;
        }

        // 3. LOCATION / ADDRESS
        if (text.includes("location") || text.includes("address") || text.includes("where") || text.includes("map") || text.includes("locate") || text.includes("directions") || text.includes("chennai") || text.includes("padur")) {
            return `
                Supreme Speciality Hospitals has two main hubs:<br>
                📍 **Kelambakkam/Padur Location:** No. 1/56, Old Mahabalipuram Road, Padur, Chennai 603103 (on OMR, near Kelambakkam).<br>
                📍 **Thiruporur Location:** No. 85, Mellandai Street, Old Mahabalipuram Rd, Thiruporur, Tamil Nadu 603110.<br><br>
                🗺️ [Open Google Maps Directions](https://www.google.com/maps/dir/13.0843007,80.2704622/supreme+hospital+map)
            `;
        }

        // 4. CONTACTS / PHONE
        if (text.includes("phone") || text.includes("contact") || text.includes("call") || text.includes("number") || text.includes("email") || text.includes("telephone") || text.includes("mobile")) {
            return `
                You can reach us anytime via:<br>
                📞 **OPD & Appointments:** <a href="tel:+919940010007">+91 99400 10007</a><br>
                🚨 **Emergency Helpline:** <a href="tel:04467453535">044 67453535</a> (Ambulance services)<br>
                ✉️ **Email:** contact@supremehospitals.in
            `;
        }

        // 5. TIMINGS
        if (text.includes("timings") || text.includes("hours") || text.includes("open") || text.includes("time") || text.includes("close")) {
            return "Supreme Speciality Hospitals operates **24/7** for Emergency, ICU, Trauma care, and Pharmacy. Outpatient (OPD) consultation timings are Monday to Saturday, **9:00 AM to 7:00 PM**.";
        }

        // 6. INSURANCE / CASHLESS / BILLING
        if (text.includes("insurance") || text.includes("cashless") || text.includes("claim") || text.includes("tpa") || text.includes("billing")) {
            return "Yes, we accept cashless claims. We are empaneled with major health insurance companies and TPAs. Our billing desk assists with documentation and claim processing. For verification of a specific insurer, contact us at [+91 99400 10007](tel:+919940010007).";
        }

        // 7. EMERGENCY
        if (text.includes("emergency") || text.includes("icu") || text.includes("critical") || text.includes("ambulance") || text.includes("trauma")) {
            return `
                🚨 **Emergency Services:**<br>
                Our ICU and Emergency trauma units are fully staffed 24/7. Call our helpline at <a href="tel:04467453535">**044 67453535**</a> for immediate ambulance dispatch.
            `;
        }

        // 8. DIAGNOSTIC / LABS
        if (text.includes("diagnostic") || text.includes("lab") || text.includes("scan") || text.includes("xray") || text.includes("x-ray") || text.includes("ultrasound") || text.includes("ecg")) {
            return "Yes, we have a fully equipped in-house laboratory and diagnostics center offering CT scans, digital X-rays, ultrasound, ECG, and pathology tests. Available 24/7 for emergency cases.";
        }

        // 9. HEALTH CHECK-UPS
        if (text.includes("health check") || text.includes("checkup") || text.includes("check-up") || text.includes("package") || text.includes("wellness")) {
            return `
                We offer customized Health Check-Up packages (Basic, Comprehensive, Diabetic, Cardiac). You can view our packages here:
                <a href="health-check-ups.html" class="btn-block">Check Health Packages</a>
            `;
        }

        // 10. DOCTORS / SPECIALISTS
        if (text.includes("doctor") || text.includes("specialist") || text.includes("consultant")) {
            return `
                We have highly experienced specialists. Type a department name or doctor's name, or choose one:
                <div class="supreme-chat-options">
                    <button class="supreme-chat-opt-btn" data-action="dept_ortho">🦴 Orthopedics</button>
                    <button class="supreme-chat-opt-btn" data-action="dept_gyno">🤰 Gynecology & Obstetrics</button>
                    <button class="supreme-chat-opt-btn" data-action="dept_cardio">❤️ Cardiology</button>
                    <button class="supreme-chat-opt-btn" data-action="dept_derma">🧪 Dermatology</button>
                    <button class="supreme-chat-opt-btn" data-action="dept_all">🩺 Show All Specialties</button>
                </div>
            `;
        }

        // 11. ORTHOPEDICS
        if (text.includes("ortho") || text.includes("bone") || text.includes("joint") || text.includes("fracture") || text.includes("spine") || text.includes("arthritis")) {
            return getDepartmentInfo("ortho");
        }

        // 12. GYNECOLOGY / PREGNANCY / MATERNITY
        if (text.includes("gyno") || text.includes("gyne") || text.includes("pregnancy") || text.includes("maternity") || text.includes("childbirth") || text.includes("baby") || text.includes("obstet") || text.includes("infertility") || text.includes("pcos") || text.includes("rini")) {
            return getDepartmentInfo("gyno");
        }

        // 13. CARDIOLOGY / HEART
        if (text.includes("cardio") || text.includes("heart") || text.includes("cardiac") || text.includes("chest pain")) {
            return getDepartmentInfo("cardio");
        }

        // 14. DERMATOLOGY / SKIN
        if (text.includes("derma") || text.includes("skin") || text.includes("acne") || text.includes("eczema") || text.includes("hair") || text.includes("cosmetic")) {
            return getDepartmentInfo("derma");
        }

        // 15. DIABETOLOGY / DIABETES / SUGAR
        if (text.includes("diabet") || text.includes("sugar") || text.includes("arun kumar")) {
            return `
                👨‍⚕️ **Diabetology**<br>
                **Dr. R. Arun Kumar** (Senior Consultant) specializes in Diabetes Control (diet, insulin, medications) and preventative checks.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book Diabetology Appointment</a>
            `;
        }

        // 16. PSYCHIATRY / COUNSELLING / ANXIETY
        if (text.includes("psychia") || text.includes("counsel") || text.includes("depress") || text.includes("anxiety") || text.includes("arasi")) {
            return `
                🧠 **Psychiatry & Rehabilitation**<br>
                **Dr. Arasi D. M** (Senior Consultant) provides counseling, psychiatric care, and anxiety/rehabilitation programs.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book Psychiatry Appointment</a>
            `;
        }

        // 17. PALLIATIVE / PAIN
        if (text.includes("palliative") || text.includes("pain") || text.includes("shery")) {
            return `
                🩹 **Pain & Palliative Care**<br>
                **Dr. Shery Angel Rajakumar** (Senior Consultant) treats chronic arthritis, spine, and nerve pain, along with long-term supportive care.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book Palliative Appointment</a>
            `;
        }

        // 18. GENERAL MEDICINE / FEVER
        if (text.includes("medicine") || text.includes("fever") || text.includes("cough") || text.includes("cold") || text.includes("bravian")) {
            return `
                🩺 **General Medicine**<br>
                **Dr. Bravian Samvict Devadas** (MD – General Medicine, Senior Consultant) manages chronic illnesses, general health checks, and virus/fever treatments.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book General Medicine Appointment</a>
            `;
        }

        // 19. SURGERY
        if (text.includes("surgery") || text.includes("surgeon") || text.includes("appendix") || text.includes("hernia") || text.includes("gallbladder") || text.includes("laparoscop") || text.includes("felix")) {
            return `
                ✂️ **General & Laparoscopic Surgery**<br>
                **Dr. Felix Anandraj** (Senior Consultant) conducts hernia repairs, appendectomies, gallbladder removals, and keyhole surgeries.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book Surgery Appointment</a>
            `;
        }

        // 20. GASTROENTEROLOGY / STOMACH
        if (text.includes("gastro") || text.includes("stomach") || text.includes("digestion") || text.includes("endoscopy") || text.includes("colonoscopy") || text.includes("liver")) {
            return `
                🧪 **Medical Gastroenterology**<br>
                **Dr. Arun Kasiviswanathan** (Senior Consultant) handles digestive, liver, pancreatic disorders and endoscopy procedures.<br><br>
                <a href="book-an-appointment.html" class="btn-block">Book Gastroenterology Appointment</a>
            `;
        }

        // 21. HELP
        if (text.includes("help") || text.includes("menu") || text.includes("options")) {
            return `
                Here are topics you can ask me about:<br>
                • **Bookings** (type 'book' or 'appointment')<br>
                • **Our Doctors** (type 'doctors' or a department like 'ortho' or 'gyno')<br>
                • **Emergencies** (type 'emergency')<br>
                • **Address / Timings** (type 'location' or 'open')<br>
                • **Insurances & Billing** (type 'insurance')<br>
                • **Diagnostics & CT scans** (type 'lab')<br>
                Or type 'callback' to open our request form.
            `;
        }

        // 22. DEFAULT FALLBACK
        return `
            I'm not sure I fully understand your query. I can help you with doctors, scheduling appointments, pricing/insurance, or diagnostic scanning services.<br><br>
            Please check our menu by typing **'help'** or feel free to request a call from our staff:<br>
            <button class="supreme-chat-opt-btn mt-2" data-action="callback_form">📞 Open Callback Form</button>
        `;
    }
}
