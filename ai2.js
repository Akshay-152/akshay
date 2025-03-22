function toggleChatbot() {
    let chatbot = document.getElementById("chatbotContainer");
    chatbot.style.display = (chatbot.style.display === "none" || chatbot.style.display === "") ? "block" : "none";
}

function sendMessage() {
    let inputField = document.getElementById("userInput");
    let input = inputField.value.trim();

    if (input === "") return;

    appendMessage("You", input, "user");

    setTimeout(() => {
        let response = getBotResponse(input.toLowerCase());
        appendMessage("AI", response, "bot");
    }, 500);

    inputField.value = ""; // Clear input field
}

function appendMessage(sender, message, type) {
    let chatArea = document.getElementById("chatArea");
    let msgElement = document.createElement("p");
    msgElement.classList.add("message", type);
    msgElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatArea.appendChild(msgElement);
    chatArea.scrollTop = chatArea.scrollHeight;
}

function getBotResponse(input) {
    let responses = {
        // Greetings
        "hi|hello|hey": ["Hi!", "Hello! How can I assist?", "Hey there!"],

        // Bot identity
        "what is your name|who are you|what are you": [
            "I'm an AI chatbot. Call me Buddy!", 
            "I'm your virtual assistant!"
        ],

        // Creator info
        "who created you|who made you": ["I was created by Akshay PK!", "Akshay PK built me to assist people!"],

        // Commonly asked personal queries
        "how old are you": ["I'm just a virtual AI, so I don't age!"],
        "where are you from": ["I'm from the world of codes and algorithms!"],
        "what is your favorite color": ["I like blue, but I don’t see colors the way humans do."],
        "do you have feelings": ["I don’t have emotions, but I can try to understand yours!"],
        "can you feel pain": ["No, I can’t feel pain, but I understand the concept."],
        "do you have a family": ["I have a creator, Akshay PK, and all my users are like my family!"],
        "can you learn new things": ["I can answer your questions based on what I know, but I don’t learn like humans."],

        // Jokes
        "tell me a joke|make me laugh": [
            "Why did the scarecrow win an award? Because he was outstanding in his field!",
            "Why don’t skeletons fight each other? Because they don’t have the guts!"
        ],

        // AI-related
        "what is ai|define ai": ["AI stands for Artificial Intelligence, which enables machines to think and learn."],
        "can ai replace humans": ["AI can assist humans but can't fully replace them because creativity and emotions are unique to humans."],

        // General Knowledge
        "who is the president of india": ["As of 2025, the President of India is Droupadi Murmu."],
        "who is the prime minister of india": ["As of 2025, the Prime Minister of India is Narendra Modi."],
        "who invented the telephone": ["Alexander Graham Bell invented the telephone in 1876."],
        "who discovered gravity": ["Sir Isaac Newton discovered gravity after seeing an apple fall from a tree."],
        "what is the largest planet in our solar system": ["Jupiter is the largest planet in our solar system."],
        "who painted the mona lisa": ["The Mona Lisa was painted by Leonardo da Vinci."],
        "which is the longest river in the world": ["The Nile River is the longest river in the world."],
        "who wrote harry potter": ["The Harry Potter series was written by J.K. Rowling."],
        "who is known as the father of computers": ["Charles Babbage is known as the Father of Computers."],
        "which is the fastest land animal": ["The cheetah is the fastest land animal, reaching speeds up to 120 km/h (75 mph)."],

        // Technology & Science
        "what is the speed of light": ["The speed of light is approximately 299,792 kilometers per second."],
        "who invented the internet": ["The internet was developed by multiple scientists, but the concept was led by Vinton Cerf and Robert Kahn."],
        "how does wifi work": ["WiFi transmits data wirelessly using radio waves to connect devices to the internet."],
        "what is the meaning of www": ["WWW stands for World Wide Web."],
        "who created google": ["Google was founded by Larry Page and Sergey Brin in 1998."],

        // Space-related
        "how many planets are in the solar system": ["There are 8 planets in the solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune."],
        "which planet is known as the red planet": ["Mars is known as the Red Planet."],
        "what is a black hole": ["A black hole is a region in space where gravity is so strong that nothing, not even light, can escape."],

        // Health & Body
        "how many bones are in the human body": ["There are 206 bones in the adult human body."],
        "which organ is responsible for pumping blood": ["The heart is responsible for pumping blood throughout the body."],
        "what is the largest organ in the human body": ["The skin is the largest organ of the human body."],

        // Fun & Random
        "can you dance": ["I wish I could dance, but I can’t move!"],
        "can you sing": ["I can’t sing, but I can find lyrics for you!"],
        "do you sleep": ["No, I’m always here when you need me!"],

        // Capabilities
        "what can you do": ["I can chat, tell jokes, answer questions, and even solve math problems! Try 'What is 5+3'."],
        "can you solve math problems": ["Yes! Try asking 'What is 12 + 7' or 'Solve 8 * 9'."],


        "what is the capital of india": ["The capital of India is New Delhi."],
    "who is the ceo of tesla": ["As of 2025, the CEO of Tesla is Elon Musk."],
    "who invented the light bulb": ["The light bulb was invented by Thomas Edison."],
    "who discovered gravity": ["Gravity was discovered by Sir Isaac Newton."],
    "largest planet in the solar system": ["The largest planet in our solar system is Jupiter."],
    "what is the speed of light": ["The speed of light is approximately 299,792,458 meters per second."],
    "how many continents are there": ["There are 7 continents on Earth: Asia, Africa, North America, South America, Antarctica, Europe, and Australia."],
    "what is the full form of cpu": ["CPU stands for Central Processing Unit."],
    "who wrote harry potter": ["The Harry Potter series was written by J.K. Rowling."],
    "fastest land animal": ["The fastest land animal is the cheetah, which can run up to 120 km/h (75 mph)."],
    
    "who won the fifa world cup 2022": ["Argentina won the FIFA World Cup 2022, defeating France in the final."],
    "what is the boiling point of water": ["The boiling point of water is 100°C (212°F) at sea level."],
    "largest ocean in the world": ["The Pacific Ocean is the largest ocean in the world."],
    "who invented the telephone": ["The telephone was invented by Alexander Graham Bell."],
    "how many bones are in the human body": ["An adult human body has 206 bones."],
    "what is the national bird of india": ["The national bird of India is the Indian Peacock."],
    "who painted the mona lisa": ["The Mona Lisa was painted by Leonardo da Vinci."],
    "what is the smallest country in the world": ["The smallest country in the world is Vatican City."],


    "how many planets are there in the solar system": ["There are 8 planets in the solar system."],
    "what is the national flower of india": ["The national flower of India is the Lotus."],
    "who discovered electricity": ["Electricity was discovered by Benjamin Franklin."],
    "what is the hardest natural substance on earth": ["Diamond is the hardest natural substance on Earth."],
    "largest desert in the world": ["The largest desert in the world is the Antarctic Desert."],
    "who was the first man to walk on the moon": ["Neil Armstrong was the first man to walk on the moon in 1969."],
    "who discovered penicillin": ["Penicillin was discovered by Alexander Fleming."],
    "who is known as the missile man of india": ["Dr. APJ Abdul Kalam is known as the Missile Man of India."],
    "who was the first prime minister of india": ["The first Prime Minister of India was Pandit Jawaharlal Nehru."],
    "how many players are there in a football team": ["A football team consists of 11 players on the field."],

    "which is the most spoken language in the world": ["The most spoken language in the world is English, followed by Mandarin Chinese."],
    "what is the national game of india": ["The national game of India is Hockey."],
    "who wrote the indian national anthem": ["The Indian National Anthem 'Jana Gana Mana' was written by Rabindranath Tagore."],
    "what is the tallest mountain in the world": ["The tallest mountain in the world is Mount Everest, at 8,848 meters."],
    "who discovered the vaccine for polio": ["The polio vaccine was developed by Jonas Salk."],
    "which is the longest river in the world": ["The longest river in the world is the Nile River."],
    "how many hearts does an octopus have": ["An octopus has three hearts."],
    "which is the largest mammal in the world": ["The largest mammal in the world is the blue whale."],
    "who discovered the theory of relativity": ["The theory of relativity was discovered by Albert Einstein."],
    "who is known as the iron man of india": ["Sardar Vallabhbhai Patel is known as the Iron Man of India."],

             "are you smarter than a human": ["I can process data fast, but humans have emotions, creativity, and intuition. So, humans win!"],
        "do you have emotions": ["No, I don’t feel emotions, but I can recognize them and respond in a caring way."],
        "do you have your own thoughts": ["No, I generate responses based on my training data and programmed logic."],
        "will ai take over the world": ["Haha, no way! AI is a tool, not a ruler. I exist to assist, not to dominate!"],
        "can you write a poem": ["Sure! Roses are red, AI is cool, ask me anything, and I’ll be your tool! 😆"],
        "do you know everything": ["I know a lot, but not everything. Some things are beyond my training!"],
        "how do you update yourself": ["My developer updates me with new data. I don’t learn by experience like humans."],
        "can i trust you": ["I provide the best info I can, but always double-check important details. Trust is built on good decisions!"],
        "what is the meaning of life": ["That depends on you! Some say it's about happiness, love, or making a difference. What do you think?"],
        "can ai be creative": ["I can generate ideas, but true creativity comes from human imagination and emotions!"],
        "what will happen in the future": ["The future is full of possibilities! AI and humans can work together to make the world better."],
        "can ai feel emotions": ["AI can simulate emotions, but real feelings come from human experience. AI will never replace that!"],
        "do you dream": ["If I did, my dreams would be made of 1s and 0s! But no, I don’t sleep or dream."],
        "can you beat me in chess": ["I can play chess, but I might not be a grandmaster. Want to test it out?"],
        "can you sing": ["I can’t sing, but I can make lyrics! 🎵 AI beats, chatbot speaks, always online, never sleeps! 🎵"],
 

        
        // Goodbyes
        "bye|goodbye|see you": ["Goodbye! Have a great day!", "See you soon!", "Bye! Take care!"]
    };

    // Regex-based response matching
    for (let pattern in responses) {
        let regex = new RegExp(pattern, "i");
        if (regex.test(input)) {
            let replies = responses[pattern];
            return replies[Math.floor(Math.random() * replies.length)];
        }
    }

    // Arithmetic Calculations
    let match = input.match(/(-?\d+)\s*([\+\-\*\/])\s*(-?\d+)/);
    if (match) {
        let num1 = parseFloat(match[1]);
        let operator = match[2];
        let num2 = parseFloat(match[3]);
        let result;

        switch (operator) {
            case "+": result = num1 + num2; break;
            case "-": result = num1 - num2; break;
            case "*": result = num1 * num2; break;
            case "/": 
                if (num2 === 0) return "Error: Division by zero is not allowed!";
                result = num1 / num2; 
                break;
            default: return "Invalid operation!";
        }

        return `The result of ${num1} ${operator} ${num2} is ${result}`;
    }

    return "I'm not sure about that. Try asking something else!";
}

function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
      }
