document.addEventListener("DOMContentLoaded", () => {
    const lever = document.getElementById("lever");
    const ball = lever.querySelector(".lever-ball");
    const reel1 = document.getElementById("reel1");
    const reel2 = document.getElementById("reel2");
    const reel3 = document.getElementById("reel3");
    const result = document.getElementById("result");
    const slotMachine = document.querySelector(".slot-machine");
    const bgMusic = document.getElementById("bg-music");
    const sfxSpin = document.getElementById("sfx-spin");
    const sfxDing = document.getElementById("sfx-ding");
    const sfxLever = document.getElementById("sfx-lever");
    let musicStarted = false;

    // громкость ниже музыки
    sfxSpin.volume = 0.3;
    sfxDing.volume = 0.4;
    sfxLever.volume = 0.4;

    // 🎁 Пакеты слов
    const wordPacks = [
        {
            slot1: ["Люблю мою", "Обожаю мою", "Ценю мою", "Нежно храню мою", "Обожульки мою"],
            slot2: ["самую красивую", "самую любимую", "заботливую", "нежную", "неповторимую", "родную", "волшебную", "светлую", "умную", "смешную"],
            slot3: ["девочку👩🏻", "принцессу", "женщину", "малышку", "радость", "чудо", "богиню", "музу", "солнышко🌞", "госпожу", "рыжулю", "королеву👸🏻", "Настюшку💌"]
        },
        {
            slot1: ["Люблю твою", "Обожаю твою", "Ценю твою", "Благодарен за твою"],
            slot2: ["милую", "красивую", "нежную", "тёплую", "бесконечную", "искреннюю", "волшебную", "добрую", "яркую", "лучистую"],
            slot3: ["улыбку", "душу", "энергию🔋", "теплоту🔥", "доброту", "харизму", "заботу", "нежность", "искру🔥", "душевность"]
        },
        {
            slot1: ["Благодарен за твои", "Обожаю наши", "Люблю наши", "Ценю наши", "Храню в сердце наши", "Часто вспоминаю наши"],
            slot2: ["теплые", "смешные", "яркие", "волшебные", "магические", "трогательные", "светлые", "особенные"],
            slot3: ["моменты", "вечера🌙", "разговоры🗣️", "шутки", "прогулки", "дни", "секреты🔒"]
        }
    ];

    function fillReel(reel, words) {
        reel.innerHTML = "";
        for (let i = 0; i < 20; i++) {
            words.forEach(w => {
                const div = document.createElement("div");
                div.textContent = w;
                reel.appendChild(div);
            });
        }
    }

    function spinReel(reel, words, duration) {
        return new Promise(resolve => {
            const itemHeight = 220;
            const stopIndex = Math.floor(Math.random() * words.length);
            const extraRounds = 10;
            const finalIndex = stopIndex + words.length * extraRounds;
            const offset = finalIndex * itemHeight;

            reel.style.transition = `transform ${duration}ms cubic-bezier(0.2, 0.9, 0.4, 1.0)`;
            reel.style.transform = `translateY(-${offset}px)`;

            setTimeout(() => {
                reel.style.transition = "none";
                reel.style.transform = `translateY(-${stopIndex * itemHeight}px)`;
                resolve(words[stopIndex]);
            }, duration);
        });
    }

    function spawnParticles() {
        const container = document.querySelector(".casino-container");
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.textContent = Math.random() > 0.5 ? "❤️" : "✨";
            particle.style.left = Math.random() * 100 + "%";
            container.appendChild(particle);

            setTimeout(() => {
                particle.remove();
            }, 3000);
        }
    }

    lever.addEventListener("click", async () => {
        // 🎶 запуск музыки при первой крутке
        if (!musicStarted) {
            bgMusic.play().catch(err => console.log("Автоплей заблокирован:", err));
            musicStarted = true;
        }

        // звук рычага и крутки
        sfxLever.currentTime = 0; sfxLever.play();
        sfxSpin.currentTime = 0; sfxSpin.play();

        const currentPack = wordPacks[Math.floor(Math.random() * wordPacks.length)];

        fillReel(reel1, currentPack.slot1);
        fillReel(reel2, currentPack.slot2);
        fillReel(reel3, currentPack.slot3);

        ball.style.transform = "translateY(12px)";
        setTimeout(() => {
            ball.style.transform = "translateY(0px)";
        }, 300);

        const [word1, word2, word3] = await Promise.all([
            spinReel(reel1, currentPack.slot1, 2500),
            spinReel(reel2, currentPack.slot2, 2700),
            spinReel(reel3, currentPack.slot3, 3000)
        ]);

        result.textContent = word1 + " " + word2 + " " + word3;

        // звук окончания
        sfxDing.currentTime = 0; sfxDing.play();

        slotMachine.classList.add("shake");
        spawnParticles();
        setTimeout(() => slotMachine.classList.remove("shake"), 1000);
    });
});
