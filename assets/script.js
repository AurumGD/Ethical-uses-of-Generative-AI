document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("commentForm");
    const section = document.getElementById("commentSection");
    const clearBtn = document.getElementById("clearComments");
    clearBtn.classList.add("d-none");
    const ADMIN_PASSWORD = "MrP00pyP@n75";
    let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    renderComments();
    updateClearButtonState();

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const comment = document.getElementById("comment").value.trim();
        if (!comment) return;

        const personName = name || "Anonymous";

        savedComments.push({ name: personName, text: comment });

        localStorage.setItem("comments", JSON.stringify(savedComments));

        renderComments();
        updateClearButtonState();
        form.reset();
    });

    clearBtn.addEventListener("click", function () {
        if (savedComments.length === 0) return;

        const ok = confirm("Are you sure you want to delete all comments? This cannot be undone.");
        if (!ok) return;

        localStorage.removeItem("comments");
        savedComments = [];
        renderComments();
        updateClearButtonState();
    });

    document.addEventListener("keydown", function (e) {
        if (e.shiftKey && e.key === "A") {
            const entered = prompt("Enter admin password:");
            if (entered === ADMIN_PASSWORD) {
                clearBtn.classList.remove("d-none");
                alert("Admin mode enabled.");
            } else {
                alert("Incorrect password.");
            }
        }
    });

    function renderComments() {
        section.innerHTML = "";
        if (savedComments.length === 0) {
            section.innerHTML = "<p class='text-muted'>No comments yet. Be the first to comment!</p>";
            return;
        }

        savedComments.forEach(function (c) {
            const box = document.createElement("div");
            box.classList.add("comment-box", "mb-2", "p-2");
            box.innerHTML =
                "<div class='comment-name fw-bold'>" + escapeHtml(c.name) + "</div>" +
                "<div class='comment-text'>" + escapeHtml(c.text) + "</div>";
            section.appendChild(box);
        });
    }

    function updateClearButtonState() {
        if (!clearBtn) return;
        clearBtn.disabled = savedComments.length === 0;
    }

    function escapeHtml(str) {
        if (typeof str !== "string") return "";
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
});
