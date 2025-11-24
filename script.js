function CheckPassword(inputElement) {
    const password = inputElement.value;

    const result = evaluateStrength(password);

    updateStrengthBar(result);
    updateStrengthMessage(result);
}

function toggleVisibility() {
    const input = document.getElementById("password");
    const btn = document.getElementById("toggle_btn");

    if (input.type === "password") {
        input.type = "text";
        btn.innerText = "🙈";
    } else {
        input.type = "password";
        btn.innerText = "👁️";
    }
}

function evaluateStrength(password) {

    let score = 0;

    const flags = {
        length: false,
        lowercase: false,
        uppercase: false,
        number: false,
        special: false,
        common: false,
        repeated: false
    };

    
    if (!password || password.trim() === "") {
        return {
            score: 0,
            level: "Empty",
            flags
        };
    }

    
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);

    if (password.length >= 12) {
        score++;
        flags.length = true;
    }

    if (hasLower) {
        score++;
        flags.lowercase = true;
    }

    if (hasUpper) {
        score++;
        flags.uppercase = true;
    }

    if (hasNumber) {
        score++;
        flags.number = true;
    }

    if (hasSpecial) {
        score++;
        flags.special = true;
    }

    
    const variety = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
    if (variety >= 3) score++;

    // Common passwords
    const weakPasswords = [
        "password", "123456", "123456789101", "qwerty",
        "admin", "password1234", "iloveyou1234", "adminadmin12"
    ];

    if (weakPasswords.includes(password)) {
        flags.common = true;
        score = 0; 
    }

    // Repetition pattern
    const repeatedPatterns = [
        "111111", "222222", "333333", "444444", "555555",
        "666666", "777777", "888888", "999999"
    ];

    if (repeatedPatterns.includes(password)) {
        flags.repeated = true;
        score = Math.max(0, score - 2);
    }

    // Clamp score
    if (score < 0) score = 0;
    if (score > 5) score = 5;

    // Level tags
    let level = "";
    if (score === 0) level = "Very Weak";
    else if (score <= 2) level = "Weak";
    else if (score === 3) level = "Medium";
    else level = "Strong";

    return {
        score,
        level,
        flags
    };
}



function updateStrengthBar(result) {
    const bars = document.querySelectorAll(".bar");
    if (!bars || bars.length !== 3) return;

    // Reset
    bars.forEach(b => b.style.backgroundColor = "lightgray");

    const score = result.score;

    if (score === 0) return;

    if (score === 1 || score === 2) {
        bars[0].style.backgroundColor = "red";
    }

    if (score === 2 || score === 3) {
        bars[1].style.backgroundColor = score === 3 ? "orange" : "red";
    }

    if (score >= 4) {
        bars[0].style.backgroundColor = "green";
        bars[1].style.backgroundColor = "green";
        bars[2].style.backgroundColor = "green";
    }
}

function updateStrengthMessage(result) {
    const msg = document.getElementById("message_text");
    if (!msg) return;

    const { level, flags, score } = result;

    // Color mapping
    const colors = {
        "Empty": "gray",
        "Very Weak": "red",
        "Weak": "crimson",
        "Medium": "orange",
        "Strong": "green"
    };

    msg.style.color = colors[level] || "black";

    // Special case: empty
    if (level === "Empty") {
        msg.innerText = "Start typing a password...";
        return;
    }

    // Build message
    let problems = [];

    if (!flags.length) problems.push("use at least 12 characters");
    if (!flags.lowercase) problems.push("add lowercase letters");
    if (!flags.uppercase) problems.push("add uppercase letters");
    if (!flags.number) problems.push("add numbers");
    if (!flags.special) problems.push("add special characters");
    if (flags.common) problems.push("avoid common passwords");
    if (flags.repeated) problems.push("avoid repeated digits");

    if (problems.length === 0) {
        msg.innerText = `Strength: ${level} ✔️`;
    } else {
        msg.innerText = `Strength: ${level} — Improve by: ${problems.join(", ")}`;
    }
}
