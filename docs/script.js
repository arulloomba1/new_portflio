document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("commandInput");
    const output = document.getElementById("output");
    const terminal = document.getElementById("terminal-container");
    const hint = document.getElementById("autocompleteHint");
    const mirror = document.getElementById("inputMirror");

    let commandHistory = [];
    let historyIndex = -1;

    const helpMessage = `
    <b>💻 System Commands:</b><br>
    <b>help or h</b>        - Show available commands<br>
    <b>clear or cls</b>       - Clear the terminal<br>
    <b>neofetch or fetch</b>    - Display system info (Arch Linux style)<br>
    <br>
    <b>👤 Personal Information:</b><br>
    <b>whoami</b>      - Display my identity<br>
    <b>skills</b>      - Show my technical skills<br>
    <b>projects</b>    - List my featured projects<br>
    <b>awards</b>      - Display my achievements<br>
    <b>others</b>      - Show my management/soft skills<br>
    <br>
    <b>🌐 Online Profiles:</b><br>
    <b>linkedin or ln</b>    - Open my LinkedIn profile<br>
    <b>github or gh</b>      - Open my GitHub profile<br>
    <br>
    <b>📄 Documents:</b><br>
    <b>resume or r</b>      - Download my resume<br>
    `;

    const commands = {
        help: helpMessage,
        neofetch: () => {
            let currentTime = new Date().toLocaleTimeString();
            return `<pre>
        <span class="blue">      /\\      </span>  User: arulloomba
        <span class="blue">     /  \\     </span>  OS: Arch Linux
        <span class="blue">    /    \\    </span>  Hostname: arulloomba.github.io
        <span class="blue">   /  /\\  \\   </span>  Time: ${currentTime}
        <span class="blue">  /  (--)  \\  </span>  Email: <a href="mailto:arulloomba@berkeley.edu" class="custom-link">arulloomba@berkeley.edu</a>
        <span class="blue"> /  /    \\  \\ </span>  GitHub: <a href="https://GitHub.com/arulloomba1" target="_blank" class="custom-link">GitHub.com/arulloomba1</a>
        <span class="blue">/___\\    /___\\</span>  LinkedIn: <a href="https://LinkedIn.com/in/arul-loomba" target="_blank" class="custom-link">LinkedIn.com/in/arul-loomba</a>
        </pre>`;
        },

        github: () => {
            window.open("https://github.com/arulloomba1", "_blank");
            return `Opening <a href="https://github.com/arulloomba1" target="_blank" class="custom-link">GitHub/arulloomba1</a>...`;
        },

        linkedin: () => {
            window.open("https://www.linkedin.com/in/arul-loomba/", "_blank");
            return `Opening <a href="https://linkedin.com/in/arul-loomba" target="_blank" class="custom-link">LinkedIn/arul-loomba</a>...`;
        },

        projects: `
        - Voice Recognition & Object Detection: YOLO-v8 model for 250+ household objects with FPGA-based voice synthesis<br>
        - RISC-V Neural Network: Assembly-level implementation with stock market analysis applications<br>
        - MAE Encoder Pipeline: Triple-stream architecture processing 500+GB of multimodal data<br>
        - Robot Arm Simulator: Mujoco-based system supporting multiple robot arms with inverse kinematics<br>
        - Snek Game: Feature-rich snake game with 30+ characters and 75+ map layouts, built in C/C++ with OpenGL<br>
        - S1XT33N: Voice-controlled robot car with custom circuits and PCA-based voice classification<br>
        `,
        awards: `
        - 4x Dean's List Award (2023-2025) UC Berkeley, EECS <br>
        - 2nd Place MOOC AI Hackathon 2025, UC Berkeley (Historical AI Debate Agent) <br>
        `,
        skills: `
        - Backend Development<br>
        - Python: PyTorch, FastAPI, discord.py<br>
        - Java: Spring Boot (learning)<br>
        - JavaScript: NodeJs, discord.js, passport.js<br>
        - Database: MySQL<br>
        - Version Control: Git<br>
        - CI/CD: Docker, GitHub CI/CD<br>
        - Cloud: Azure, AWS, GCP, Oracle Cloud<br>
        - Tools: Postman, BurpSuite, Nmap, Cloudflared<br>
        - OS: Arch Linux, Ubuntu, Windows
        `,
        others: `
        - Rapid learner with a strong ability to adapt to new technologies<br>
        - Strong communication and interpersonal skills<br>
        - Strong problem-solving skills<br>
        `,
        whoami: `<a href="arulloomba1.github.io" class="custom-link">Arul Loomba</a> | Software Engineer`,

        resume: () => {
            const link = document.createElement("a");
            link.href = "/resume1.pdf";
            link.download = "Arul_Resume.pdf";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return "Downloading resume...";
        },

        clear: () => resetTerminal(),
        exit: () => resetTerminal(),
    };

    const aliases = {
        gh: "github",
        ln: "linkedin",
        r: "resume",
        cls: "clear",
        h: "help",
        fetch: "neofetch"
    };

    const commandList = Object.keys(commands).concat(Object.keys(aliases));

    function processCommand(cmd) {
        cmd = cmd.toLowerCase();
        if (cmd === "") {
            output.scrollTop = output.scrollHeight;
            return;
        }

        commandHistory.push(cmd);
        historyIndex = commandHistory.length;

        if (aliases[cmd]) cmd = aliases[cmd];

        if (cmd === "clear" || cmd === "exit") {
            resetTerminal();
            return;
        }

        let response = typeof commands[cmd] === "function" ? commands[cmd]() : commands[cmd] || getClosestCommand(cmd);
        appendCommand(cmd, response);
    }

    function resetTerminal() {
        output.innerHTML = `<div class="help-message">Type 'help' to see available commands.</div>`;
        input.value = "";
        hint.textContent = "";
    }

    function appendCommand(command, result) {
        let commandLine = document.createElement("div");
        commandLine.classList.add("command-line");
        commandLine.innerHTML = `<span class="prompt">λ</span> ${command}`;
        output.appendChild(commandLine);

        let resultLine = document.createElement("div");
        resultLine.classList.add("command-result");
        resultLine.innerHTML = result;
        output.appendChild(resultLine);

        input.scrollIntoView({ behavior: "smooth" });
    }

    function getClosestCommand(inputCmd) {
        let closestMatch = commandList.find(cmd => cmd.startsWith(inputCmd));
        return closestMatch ? `Did you mean <b>${closestMatch}</b>?` : `Command not found: ${inputCmd}`;
    }

    function updateAutocompleteHint() {
        let currentInput = input.value;
        if (!currentInput) {
            hint.textContent = "";
            return;
        }
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) {
            hint.textContent = match.slice(currentInput.length);
            mirror.textContent = currentInput;
            hint.style.left = mirror.offsetWidth + "px";
        } else {
            hint.textContent = "";
        }
    }

    function autocompleteCommand() {
        let currentInput = input.value;
        if (!currentInput) return;
        let match = commandList.find(cmd => cmd.startsWith(currentInput));
        if (match) input.value = match;
        hint.textContent = "";
    }

    function createCommandBar() {
        const bar = document.getElementById("command-bar");
    
        const allCommands = Object.keys(commands);
    
        [...allCommands].sort().forEach(cmd => {
            const button = document.createElement("button");
            button.textContent = cmd;
            button.dataset.cmd = cmd;
            button.addEventListener("click", () => {
                processCommand(cmd);
            });
            bar.appendChild(button);
        });
    }

    input.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            processCommand(input.value.trim());
            input.value = "";
            hint.textContent = "";
        } else if (event.key === "ArrowRight" || event.key === "Tab") {
            event.preventDefault();
            autocompleteCommand();
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                input.value = commandHistory[historyIndex];
            }
        } else if (event.key === "ArrowDown") {
            event.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                input.value = commandHistory[historyIndex];
            } else {
                historyIndex = commandHistory.length;
                input.value = "";
            }
        }
    });

    input.addEventListener("input", updateAutocompleteHint);

    terminal.addEventListener("click", function () {
        input.focus();
    });

    resetTerminal();
    createCommandBar();
});
