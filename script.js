// URL de la imagen de flores amarillas
const imageUrl = 'https://img.freepik.com/fotos-premium/flores-lirio-amarillo-vibrante-gotas-lluvia-fondo-oscuro_1199273-4654.jpg';

// Número de piezas en el rompecabezas (2x2 para simplificar)
const rows = 3;
const cols = 3;
const totalPieces = rows * cols;

// Tamaño de cada pieza
const pieceWidth = 200;
const pieceHeight = 200;

// Contenedor del rompecabezas
const puzzleContainer = document.getElementById('puzzle-container');
puzzleContainer.style.width = `${pieceWidth * cols}px`;
puzzleContainer.style.height = `${pieceHeight * rows}px`;

// Elemento del mensaje de felicitaciones
const congratsMessage = document.getElementById('congrats-message');

// Crear las piezas del rompecabezas
const pieces = [];
for (let i = 0; i < totalPieces; i++) {
    const piece = document.createElement('div');
    piece.className = 'puzzle-piece';
    piece.style.width = `${pieceWidth}px`;
    piece.style.height = `${pieceHeight}px`;
    piece.style.backgroundImage = `url(${imageUrl})`;
    piece.style.backgroundSize = `${pieceWidth * cols}px ${pieceHeight * rows}px`;
    piece.style.backgroundPosition = `-${(i % cols) * pieceWidth}px -${Math.floor(i / cols) * pieceHeight}px`;
    piece.dataset.correctPosition = `${(i % cols) * pieceWidth},${Math.floor(i / cols) * pieceHeight}`;
    piece.dataset.currentPosition = `${(i % cols) * pieceWidth},${Math.floor(i / cols) * pieceHeight}`;
    puzzleContainer.appendChild(piece);
    pieces.push(piece);
}

// Mezclar las piezas
pieces.forEach(piece => {
    const randomX = Math.floor(Math.random() * (puzzleContainer.offsetWidth - pieceWidth));
    const randomY = Math.floor(Math.random() * (puzzleContainer.offsetHeight - pieceHeight));
    piece.style.left = `${randomX}px`;
    piece.style.top = `${randomY}px`;
    piece.dataset.currentPosition = `${randomX},${randomY}`;
});

// Función para mover las piezas
let selectedPiece = null;

puzzleContainer.addEventListener('mousedown', (e) => {
    if (e.target.classList.contains('puzzle-piece')) {
        selectedPiece = e.target;
        selectedPiece.style.zIndex = 1; // Traer al frente
    }
});

puzzleContainer.addEventListener('mousemove', (e) => {
    if (selectedPiece) {
        selectedPiece.style.left = `${e.clientX - puzzleContainer.offsetLeft - pieceWidth / 2}px`;
        selectedPiece.style.top = `${e.clientY - puzzleContainer.offsetTop - pieceHeight / 2}px`;
    }
});

puzzleContainer.addEventListener('mouseup', () => {
    if (selectedPiece) {
        selectedPiece.style.zIndex = 0; // Devolver al fondo
        const currentX = parseInt(selectedPiece.style.left);
        const currentY = parseInt(selectedPiece.style.top);
        selectedPiece.dataset.currentPosition = `${currentX},${currentY}`;
        checkPuzzleCompletion();
        selectedPiece = null;
    }
});

// Función para verificar si el rompecabezas está completo
function checkPuzzleCompletion() {
    let isComplete = true;
    pieces.forEach(piece => {
        const [correctX, correctY] = piece.dataset.correctPosition.split(',').map(Number);
        const [currentX, currentY] = piece.dataset.currentPosition.split(',').map(Number);
        if (Math.abs(correctX - currentX) > 10 || Math.abs(correctY - currentY) > 10) {
            isComplete = false;
        }
    });

    if (isComplete) {
        // Mostrar el mensaje de felicitaciones
        congratsMessage.style.display = 'block';

        // Mostrar la imagen completa sin líneas
        puzzleContainer.innerHTML = '';
        const completeImage = document.createElement('div');
        completeImage.style.width = `${pieceWidth * cols}px`;
        completeImage.style.height = `${pieceHeight * rows}px`;
        completeImage.style.backgroundImage = `url(${imageUrl})`;
        completeImage.style.backgroundSize = 'cover';
        puzzleContainer.appendChild(completeImage);

        // Iniciar animación de fuegos artificiales
        startFireworks();
    }
}

// Función para iniciar los fuegos artificiales
function startFireworks() {
    const container = document.body;
    const fireworks = new Fireworks(container, {
        hue: { min: 0, max: 360 },
        acceleration: 1.05,
        brightness: { min: 50, max: 80 },
        decay: { min: 0.015, max: 0.03 },
        delay: { min: 30, max: 60 },
        rocketsPoint: 50,
        lineWidth: { explosion: { min: 1, max: 3 }, trace: { min: 1, max: 2 } },
        lineStyle: 'round',
        sound: {
            enabled: true,
            files: ['https://fireworks.js.org/sounds/explosion0.mp3', 'https://fireworks.js.org/sounds/explosion1.mp3', 'https://fireworks.js.org/sounds/explosion2.mp3'],
            volume: { min: 1, max: 2 }
        }
    });
    fireworks.start();
}