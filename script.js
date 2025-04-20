import store from 'store';

class EBookReader {
    constructor() {
        this.reader = document.getElementById('reader');
        this.bookSelect = document.getElementById('bookSelect');
        this.fileInput = document.getElementById('fileInput');
        this.playPauseBtn = document.getElementById('playPause');
        this.speedControl = document.getElementById('speedControl');
        this.speedValue = document.getElementById('speedValue');
        this.speech = window.speechSynthesis;
        this.utterance = null;
        this.isPlaying = false;
        this.currentWordIndex = 0;
        this.textInput = document.getElementById('textInput');
        this.textTitle = document.getElementById('textTitle');
        this.saveTextBtn = document.getElementById('saveText');
        this.decreaseFontBtn = document.getElementById('decreaseFont');
        this.increaseFontBtn = document.getElementById('increaseFont');
        this.currentFontSize = 18; // Default font size
        this.minFontSize = 12;
        this.maxFontSize = 32;

        this.builtInBooks = {
            alice: `One sunny day, Alice and her sister went out for a walk in the garden, and while her sister was busy reading a book, Alice got very bored. Suddenly, Alice spotted a white bunny that was in a hurry.

She was curious so she went after the bunny. The bunny fell through a big hole in a tree trunk, and Alice followed him. Suddenly Alice found herself falling into a very deep well. Then, she finally landed and saw a long corridor ahead of her. The bunny disappeared, and she started to walk toward the many locked doors.

She saw a little golden key placed on a table that fit perfectly into a door behind the curtain. She opened the door using the key and saw a beautiful forest, but the door was very tiny, and Alice couldn’t fit through the door.

Alice noticed a bottle, placed on the table, next to the key. She took the bottle, and drank the potion that was inside it. As she drank the potion, Alice began to shrink. She got tiny and managed to pass through the door, where she saw the white bunny again.

The bunny asked Alice to bring his gloves and hand fan from his home. Alice went to the white bunny’s house and found his gloves and hand fan. She also saw a potion bottle on the bunny’s table. She thought the potion would bring her back to normal size, so she drank it.

Suddenly she became so big that the animals around the house started throwing stones aimed at the house. The stones that the animals were throwing at her turned into small cakes. Alice ate those small cakes and started to shrink and left the house. But she was upset that she was small again.

On the way, Alice saw a blue caterpillar inside a mushroom and asked him what can she do to get back to her original size. The blue caterpillar said that one side of the mushroom could make her grow, and the other side could make her shrink. By eating both sides of the mushroom, she managed to return to her normal size.

Alice now started to walk down the path, where she suddenly saw a cat with a big wide smile and asked him what was his name and where this path led to. The cat informed her that he was a Cheshire cat and that this path led to the Man Hatter and March Hare. After this, the Cheshire cat disappeared slowly, starting from his tail, and at the end, only his face was present.

Next, Alice found the March Hare and Man Hatter having tea under a tree and a Dormouse sleeping in between them. When they saw Alice coming towards them, they denied saying that there was no space available there. But Alice replied that there was plenty of room.

The Man Hatter said to Alice that if she wanted to stay, she had to answer a riddle. “Why does the crow look like the desk,” he asked. Alice asked him, “Why do you think”. He replied, “I don’t know”. Alice got upset with the stupid joke and went away.

Alice continued to walk and, on the way, she saw a tree with a door. She again found a golden key which opened the door to a pretty garden.

Alice was astonished to see the guards of the Queen of the hearts painting all the white roses red. This was because their Queen didn’t like white roses, and all the guards looked like they were playing cards.

The next moment, the Queen came to the garden and invited Alice to play croquet. Alice was shocked to see that the hedgehogs were used as balls and flamingos as Croco mullets in the game. All of a sudden, a huge fight broke out among the players. The Queen got upset and cancelled the croquet party and headed towards the court.

The trial was about a jack of hearts who stole a pie from the Queen’s kitchen. The king yelled from his throne, “Call the first witness,” and the first witness was Man Hatter. When Man Hatter started to talk, Alice suddenly started to grow. Then the rabbit called upon Alice to take the witness stand.

The Queen of hearts asked Alice to narrate everything she knew. But Alice said that she didn’t know anything. The Queen yelled, “If you don’t know, your head must be chopped off”. Alice got very upset and started shouting. Suddenly the King, Queen, and all the other playing cards started to fly towards Alice, and it became a big whirlpool of cards.

Finally, the leaves started flying all around her, and Alice found herself in the garden again. Her sister called out to her to wake up as she was in a deep sleep. When Alice woke up and realised that everything she had seen was just a dream.`,
            sherlock: `Watson had been watching his companion intently ever since he had sat down to the breakfast table. Holmes happened to look up and catch his eye.

‘Well, Watson, what are you thinking about?’ he asked.

‘About you.’

‘Me?’

‘Yes, Holmes. I was thinking how superficial are these tricks of yours, and how wonderful it is that the public should continue to show interest in them.’

‘I quite agree,’ said Holmes. ‘In fact, I have a recollection that I have myself made a similar remark.’

‘Your methods,’ said Watson severely, ‘are really easily acquired.’

‘No doubt,’ Holmes answered with a smile. ‘Perhaps you will yourself give an example of this method of reasoning.’

‘With pleasure,’ said Watson. ‘I am able to say that you were greatly preoccupied when you got up this morning.’

‘Excellent!’ said Holmes. ‘How could you possibly know that?’

‘Because you are usually a very tidy man and yet you have forgotten to shave.’

‘Dear me! How very clever!’ said Holmes. ‘I had no idea, Watson, that you were so apt a pupil. Has your eagle eye detected anything more?’

‘Yes, Holmes. You have a client named Barlow, and you have not been successful with his case.’

‘Dear me, how could you know that?’

‘I saw the name outside his envelope. When you opened it you gave a groan and thrust it into your pocket with a frown on your face.’

‘Admirable! You are indeed observant. Any other points?’

‘I fear, Holmes, that you have taken to financial speculation.’

‘How could you tell that, Watson?’

‘You opened the paper, turned to the financial page, and gave a loud exclamation of interest.’

‘Well, that is very clever of you, Watson. Any more?’

‘Yes, Holmes, you have put on your black coat, instead of your dressing gown, which proves that your are expecting some important visitor at once.’

‘Anything more?’

‘I have no doubt that I could find other points, Holmes, but I only give you these few, in order to show you that there are other people in the world who can be as clever as you.’

‘And some not so clever,’ said Holmes. ‘I admit that they are few, but I am afraid, my dear Watson, that I must count you among them.’

‘What do you mean, Holmes?’

‘Well, my dear fellow, I fear your deductions have not been so happy as I should have wished.’

‘You mean that I was mistaken.’

‘Just a little that way, I fear. Let us take the points in their order: I did not shave because I have sent my razor to be sharpened. I put on my coat because I have, worse luck, an early meeting with my dentist. His name is Barlow, and the letter was to confirm the appointment. The cricket page is beside the financial one, and I turned to it to find if Surrey was holding its own against Kent. But go on, Watson, go on! It ‘s a very superficial trick, and no doubt you will soon acquire it.’`
        };

        this.initializeEventListeners();
        this.loadSavedBooks();
    }

    initializeEventListeners() {
        this.bookSelect.addEventListener('change', () => this.loadBook());
        this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
        this.playPauseBtn.addEventListener('click', () => this.togglePlayPause());
        this.speedControl.addEventListener('input', () => this.updateSpeed());
        this.saveTextBtn.addEventListener('click', () => this.handleTextSave());
        this.decreaseFontBtn.addEventListener('click', () => this.adjustFontSize(-2));
        this.increaseFontBtn.addEventListener('click', () => this.adjustFontSize(2));
    }

    loadSavedBooks() {
        const savedBooks = store.get('books') || {};
        Object.entries(savedBooks).forEach(([title, text]) => {
            const option = new Option(title, title);
            this.bookSelect.add(option);
            this.builtInBooks[title] = text;
        });
    }

    async handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        const text = await file.text();
        const title = file.name.replace('.txt', '');
        
        // Save to local storage
        const savedBooks = store.get('books') || {};
        savedBooks[title] = text;
        store.set('books', savedBooks);

        // Add to select options
        const option = new Option(title, title);
        this.bookSelect.add(option);
        this.builtInBooks[title] = text;
        
        // Load the new book
        this.bookSelect.value = title;
        this.loadBook();
    }

    loadBook() {
        const selectedBook = this.bookSelect.value;
        if (!selectedBook) return;

        const text = this.builtInBooks[selectedBook];
        this.displayText(text);
    }

    displayText(text) {
        // Split text into paragraphs and handle empty lines
        const paragraphs = text.split(/\n\s*\n/);
        
        this.reader.innerHTML = paragraphs
            .map(paragraph => {
                // Skip empty paragraphs
                if (!paragraph.trim()) return '';
                
                // Create spans for each word in the paragraph
                const wordSpans = paragraph.trim().split(' ')
                    .map((word, index) => `<span class="word" data-index="${index}">${word}</span>`)
                    .join(' ');
                
                return `<p class="paragraph">${wordSpans}</p>`;
            })
            .join('');

        this.reader.querySelectorAll('.word').forEach(word => {
            word.addEventListener('click', () => this.speakWord(word.textContent));
        });
    }

    speakWord(word) {
        if (this.speech.speaking) this.speech.cancel();
        const utterance = new SpeechSynthesisUtterance(word);
        utterance.rate = parseFloat(this.speedControl.value);
        this.speech.speak(utterance);
    }

    togglePlayPause() {
        if (this.isPlaying) {
            this.speech.cancel();
            this.isPlaying = false;
            this.reader.querySelectorAll('.word').forEach(w => w.classList.remove('active'));
            return;
        }

        const words = Array.from(this.reader.querySelectorAll('.word'));
        if (!words.length) return; // Guard against empty text

        // Reset current word index if we're at the end
        if (this.currentWordIndex >= words.length) {
            this.currentWordIndex = 0;
        }

        // Collect individual words for better speech-text synchronization
        const allWords = words.slice(this.currentWordIndex).map(w => w.textContent);
        
        // Create a utterance for the entire text (for smooth playback)
        this.utterance = new SpeechSynthesisUtterance(allWords.join(' '));
        this.utterance.rate = parseFloat(this.speedControl.value);
        
        // Track the last processed word to prevent getting ahead
        let lastProcessedIndex = this.currentWordIndex - 1;
        
        this.utterance.onboundary = (event) => {
            // Only process word boundaries (not character or sentence boundaries)
            if (event.name === 'word' && this.currentWordIndex < words.length) {
                // Make sure we don't skip ahead too quickly
                if (this.currentWordIndex > lastProcessedIndex) {
                    // Remove highlight from previous word
                    words[lastProcessedIndex]?.classList.remove('active');
                    // Highlight the current word
                    words[this.currentWordIndex]?.classList.add('active');
                    // Update last processed index
                    lastProcessedIndex = this.currentWordIndex;
                }
                // Increment for next word boundary
                this.currentWordIndex++;
            }
        };

        this.utterance.onend = () => {
            this.isPlaying = false;
            this.currentWordIndex = 0;
            words.forEach(w => w.classList.remove('active'));
        };

        // Clear any existing speech
        if (this.speech.speaking) {
            this.speech.cancel();
        }

        try {
            this.speech.speak(this.utterance);
            this.isPlaying = true;
            // Highlight the first word
            words[this.currentWordIndex]?.classList.add('active');
        } catch (error) {
            console.error('Speech synthesis failed:', error);
            this.isPlaying = false;
        }
    }

    updateSpeed() {
        const speed = this.speedControl.value;
        this.speedValue.textContent = `${speed}x`;
        if (this.utterance) {
            this.utterance.rate = parseFloat(speed);
        }
    }

    adjustFontSize(change) {
        const newSize = Math.min(Math.max(this.currentFontSize + change, this.minFontSize), this.maxFontSize);
        if (newSize !== this.currentFontSize) {
            this.currentFontSize = newSize;
            this.reader.style.fontSize = `${this.currentFontSize}px`;
        }
    }

    handleTextSave() {
        const text = this.textInput.value.trim();
        const title = this.textTitle.value.trim();

        if (!text || !title) {
            alert('Please enter both text and title');
            return;
        }

        // Save to local storage
        const savedBooks = store.get('books') || {};
        savedBooks[title] = text;
        store.set('books', savedBooks);

        // Add to select options if not exists
        if (!this.bookSelect.querySelector(`option[value="${title}"]`)) {
            const option = new Option(title, title);
            this.bookSelect.add(option);
        }
        this.builtInBooks[title] = text;
        
        // Load the new book
        this.bookSelect.value = title;
        this.loadBook();

        // Clear inputs
        this.textInput.value = '';
        this.textTitle.value = '';
    }
}

new EBookReader();