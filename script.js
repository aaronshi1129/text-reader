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
            alice: `Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do...`,
            sherlock: `To Sherlock Holmes she is always THE woman. I have seldom heard him mention her under any other name...`
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
        this.reader.innerHTML = text.split(' ').map((word, index) => 
            `<span class="word" data-index="${index}">${word}</span>`
        ).join(' ');

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

        const text = words.slice(this.currentWordIndex).map(w => w.textContent).join(' ');
        if (!text) return; // Guard against empty text
            
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.rate = parseFloat(this.speedControl.value);
        
        this.utterance.onboundary = (event) => {
            if (this.currentWordIndex < words.length) {
                words[this.currentWordIndex]?.classList.remove('active');
                this.currentWordIndex++;
                words[this.currentWordIndex]?.classList.add('active');
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
            // Ensure we have a valid word to highlight
            if (this.currentWordIndex < words.length) {
                words[this.currentWordIndex].classList.add('active');
            }
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