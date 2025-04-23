document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const boardElement = document.getElementById('board');
    const diceElement = document.getElementById('dice');
    const rollButton = document.getElementById('roll-button');
    const messageArea = document.getElementById('message-area');
    const currentPlayerSpan = document.getElementById('current-player');
    const difficultySelect = document.getElementById('difficulty');
    const startGameButton = document.getElementById('start-game');
    const gameSetupDiv = document.getElementById('game-setup');
    const gameContainerDiv = document.getElementById('game-container');

    // --- Game Constants ---
    const PLAYERS = ['red', 'blue', 'green', 'yellow']; // Blue là người chơi
    const HUMAN_PLAYER = 'blue';
    const PIECES_PER_PLAYER = 4;
    const BOARD_SIZE_GRID = 15; // Số ô trên mỗi cạnh của lưới ảo
    const SQUARE_SIZE = 40; // Kích thước 1 ô vuông (px) - phải khớp với CSS
    const PATH_LENGTH = 52; // Tổng số ô trên đường đi chính
    const HOME_PATH_LENGTH = 6; // Số ô đường về đích

    // Vị trí các ô xuất phát trên path (index 0-51)
    const START_POSITIONS = {
        red: 0,    // Ô đầu tiên của đoạn đường đỏ
        blue: 13,   // Ô đầu tiên của đoạn đường xanh dương
        green: 26,  // Ô đầu tiên của đoạn đường xanh lá
        yellow: 39  // Ô đầu tiên của đoạn đường vàng
    };

    // Vị trí ô ngay trước khi vào đường về đích của mỗi màu
    const PRE_HOME_POSITIONS = {
        red: 51,
        blue: 12,
        green: 25,
        yellow: 38
    };

    // --- Game State ---
    let gameState = {};

    // --- Board Path & Home Path Coordinates ---
    // Mảng lưu tọa độ {top, left} của các ô trên đường đi chính
    const pathCoordinates = new Array(PATH_LENGTH);
    // Object lưu mảng tọa độ {top, left} của các ô trên đường về đích cho từng màu
    const homePathCoordinates = {
        red: new Array(HOME_PATH_LENGTH),
        blue: new Array(HOME_PATH_LENGTH),
        green: new Array(HOME_PATH_LENGTH),
        yellow: new Array(HOME_PATH_LENGTH)
    };

    // --- Hàm Vẽ Bàn Cờ (QUAN TRỌNG) ---
    function initializeBoardGraphics() {
        console.log("Initializing board graphics...");
        // Xóa các ô và quân cờ cũ trước khi vẽ lại
        boardElement.querySelectorAll('.square, .piece').forEach(el => el.remove());
        pathCoordinates.fill(undefined); // Reset mảng tọa độ
        Object.values(homePathCoordinates).forEach(arr => arr.fill(undefined));

        // 1. Vẽ Đường Đi Chính (52 ô)
        const pathDef = [
            // Red area -> Blue corner (13 ô: 0-12)
            { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, // 0-4 (Start Red = 0)
            { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, // 5-9
            { r: 0, c: 6 }, // 10
            { r: 0, c: 7 }, // 11 (Turn)
            { r: 0, c: 8 }, // 12 (Pre-Blue Home)
            // Blue area -> Green corner (13 ô: 13-25)
            { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, // 13-17 (Start Blue = 13)
            { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, // 18-22
            { r: 6, c: 14 }, // 23
            { r: 7, c: 14 }, // 24 (Turn)
            { r: 8, c: 14 }, // 25 (Pre-Green Home)
            // Green area -> Yellow corner (13 ô: 26-38)
            { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, // 26-30 (Start Green = 26)
            { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, // 31-35
            { r: 14, c: 8 }, // 36
            { r: 14, c: 7 }, // 37 (Turn)
            { r: 14, c: 6 }, // 38 (Pre-Yellow Home)
            // Yellow area -> Red corner (13 ô: 39-51)
            { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, // 39-43 (Start Yellow = 39)
            { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, // 44-48
            { r: 8, c: 0 }, // 49
            { r: 7, c: 0 }, // 50 (Turn)
            { r: 6, c: 0 }, // 51 (Pre-Red Home)
        ];

        pathDef.forEach((pos, index) => {
            const top = pos.r * SQUARE_SIZE;
            const left = pos.c * SQUARE_SIZE;
            pathCoordinates[index] = { top, left }; // Lưu tọa độ
            const square = document.createElement('div');
            square.classList.add('square');
            square.style.top = `${top}px`;
            square.style.left = `${left}px`;
            // square.textContent = index; // Debug: Hiển thị index ô
            boardElement.appendChild(square);

            // Tô màu ô xuất phát đặc biệt
            Object.entries(START_POSITIONS).forEach(([player, startIdx]) => {
                if (index === startIdx) {
                    square.classList.add('start-square', player);
                }
            });
             // Tô màu các ô an toàn (có thể thêm nếu muốn)
            // if ([0, 8, 13, 21, 26, 34, 39, 47].includes(index)) { // Ví dụ index các ô an toàn
            //     square.style.backgroundColor = '#f0f0f0'; // Màu xám nhạt
            // }
        });

        // 2. Vẽ Đường Về Đích (Home Paths)
        const homePathDefs = {
            red:    [{r:7,c:1}, {r:7,c:2}, {r:7,c:3}, {r:7,c:4}, {r:7,c:5}, {r:7,c:6}],
            blue:   [{r:1,c:7}, {r:2,c:7}, {r:3,c:7}, {r:4,c:7}, {r:5,c:7}, {r:6,c:7}],
            green:  [{r:7,c:13}, {r:7,c:12}, {r:7,c:11}, {r:7,c:10}, {r:7,c:9}, {r:7,c:8}],
            yellow: [{r:13,c:7}, {r:12,c:7}, {r:11,c:7}, {r:10,c:7}, {r:9,c:7}, {r:8,c:7}],
        };

        PLAYERS.forEach(player => {
            homePathDefs[player].forEach((pos, index) => {
                const top = pos.r * SQUARE_SIZE;
                const left = pos.c * SQUARE_SIZE;
                homePathCoordinates[player][index] = { top, left }; // Lưu tọa độ
                const homeSquare = document.createElement('div');
                homeSquare.classList.add('square', 'home-path', player);
                homeSquare.dataset.homeIndex = index + 1; // Index từ 1-6
                homeSquare.style.top = `${top}px`;
                homeSquare.style.left = `${left}px`;
                 // homeSquare.textContent = index + 1; // Debug
                boardElement.appendChild(homeSquare);
            });
        });
         console.log("Board graphics initialized.");
    }


    // --- Piece Class ---
    class Piece {
        constructor(player, id) {
            this.player = player;
            this.id = id; // Ví dụ: 'red-0', 'blue-1'

            this.element = document.createElement('div');
            this.element.classList.add('piece');
            this.element.dataset.pieceId = this.id;

            // --- Tạo SVG hình MÓNG ngựa ---
            const svgNS = "http://www.w3.org/2000/svg";
            const svg = document.createElementNS(svgNS, "svg");
            // viewBox 0 0 40 40, giữ nguyên hoặc điều chỉnh nếu cần
            svg.setAttribute("viewBox", "0 0 40 40");
            svg.setAttribute("width", "100%");
            svg.setAttribute("height", "100%");
            svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

            const path = document.createElementNS(svgNS, "path");
            // Đường path vẽ hình cung (móng ngựa đơn giản)
            // M x y: Move to start point (bottom-left)
            // A rx ry x-axis-rotation large-arc-flag sweep-flag x y: Draw an arc to end point (bottom-right)
            path.setAttribute("d", "M 8 32 A 12 12 0 0 1 32 32"); // Bắt đầu từ (8,32), vẽ cung bán kính 12 đến (32,32)

            // --- Sử dụng stroke thay vì fill ---
            path.setAttribute("fill", "none"); // Quan trọng: không tô màu bên trong
            path.setAttribute("stroke-width", "6"); // Độ dày của nét vẽ (móng ngựa) - điều chỉnh nếu muốn
            path.setAttribute("stroke-linecap", "round"); // Làm tròn 2 đầu móng ngựa

            // Đặt màu cho nét vẽ (stroke) dựa trên người chơi
            let strokeColor = player;
            if (player === 'yellow') {
                strokeColor = '#d4b81f'; // Vàng đậm
            } else if (player === 'green') {
                strokeColor = 'darkgreen'; // Xanh lá đậm
            } else if (player === 'blue') {
                 strokeColor = 'mediumblue'; // Xanh dương đậm hơn chút
            }
            path.setAttribute("stroke", strokeColor);

            svg.appendChild(path);
            this.element.appendChild(svg);

            // --- Các thuộc tính và phương thức khác giữ nguyên ---
            this.state = 'stable';
            this.position = -1;
            this.stepsTaken = 0;
            this.element.addEventListener('click', () => handlePieceClick(this));
            this.resetPosition();
        }

        // --- Các phương thức còn lại (resetPosition, moveToPath, v.v...) giữ nguyên như phiên bản trước ---
        // Đảm bảo các phương thức này không bị thay đổi so với lần cập nhật gần nhất

        resetPosition() {
            this.state = 'stable';
            this.position = -1;
            this.stepsTaken = 0;
            const stableInner = document.getElementById(`stable-${this.player}`).querySelector('.stable-inner');
            if (stableInner) {
                 stableInner.appendChild(this.element);
             } else {
                  document.getElementById(`stable-${this.player}`).appendChild(this.element);
                  console.warn(`Could not find .stable-inner for ${this.player}`);
             }
            this.element.classList.add('in-stable');
            this.element.style.position = '';
            this.element.style.top = '';
            this.element.style.left = '';
        }

        moveToPath(pathIndex) {
             this.state = 'on_path';
             this.position = pathIndex % PATH_LENGTH;
             this.element.classList.remove('in-stable');
             this.element.style.position = 'absolute';
             boardElement.appendChild(this.element);
             const coords = pathCoordinates[this.position];
             if (coords) {
                 const pieceSize = parseInt(window.getComputedStyle(this.element).width) || 32; // Lấy kích thước thực tế từ CSS hoặc mặc định
                 this.element.style.top = `${coords.top + (SQUARE_SIZE - pieceSize) / 2}px`;
                 this.element.style.left = `${coords.left + (SQUARE_SIZE - pieceSize) / 2}px`;
             } else {
                  console.error(`Invalid path index ${this.position} for piece ${this.id}`);
             }
        }

        moveToHomePath(homeIndex) {
             this.state = 'in_home_path';
             this.position = homeIndex;
             this.element.classList.remove('in-stable');
             this.element.style.position = 'absolute';
             boardElement.appendChild(this.element);
             const coords = homePathCoordinates[this.player][homeIndex - 1];
             if (coords) {
                 const pieceSize = parseInt(window.getComputedStyle(this.element).width) || 32;
                 this.element.style.top = `${coords.top + (SQUARE_SIZE - pieceSize) / 2}px`;
                 this.element.style.left = `${coords.left + (SQUARE_SIZE - pieceSize) / 2}px`;
             } else {
                 console.error(`Invalid home path index ${homeIndex} for player ${this.player}`);
             }
        }

         finish() {
             this.state = 'finished';
             this.position = -1;
             this.element.style.display = 'none';
             messageArea.textContent = `Quân ${this.id} của ${this.player} đã về đích!`;
         }

        highlight(canMove) {
            if (canMove) {
                this.element.classList.add('highlight');
            } else {
                this.element.classList.remove('highlight');
            }
        }
    } // Kết thúc class Piece
    // Gán lại hàm moveToHomePath cho prototype sau khi khai báo
    Piece.prototype.moveToHomePath = Piece.prototype.moveToHomePath;


    // --- Game Logic Functions ---

    function initGame() {
        console.log("Initializing game...");
        // Vẽ lại bàn cờ đồ họa
        initializeBoardGraphics();

        gameState = {
            pieces: {}, // Chứa các object Piece, key là pieceId
            diceValue: null,
            currentPlayer: HUMAN_PLAYER, // Người chơi bắt đầu
            turnState: 'waiting_for_roll', // 'waiting_for_roll', 'waiting_for_move', 'ai_thinking', 'game_over'
            difficulty: difficultySelect.value,
            validMoves: [], // Lưu các nước đi hợp lệ sau khi tung xúc xắc
        };

        // Tạo quân cờ và đặt vào chuồng
        PLAYERS.forEach(player => {
            for (let i = 0; i < PIECES_PER_PLAYER; i++) {
                const pieceId = `${player}-${i}`;
                gameState.pieces[pieceId] = new Piece(player, pieceId);
            }
        });

        console.log("Pieces created:", gameState.pieces);

        updateTurnIndicator();
        rollButton.disabled = false;
        diceElement.textContent = '?';
        messageArea.textContent = `Lượt của bạn (${HUMAN_PLAYER}). Hãy tung xúc xắc!`;
        gameSetupDiv.classList.add('hidden');
        gameContainerDiv.classList.remove('hidden');
        console.log("Game initialized.");
    }

    function rollDice() {
        if (gameState.turnState !== 'waiting_for_roll') return;

        gameState.diceValue = Math.floor(Math.random() * 6) + 1;
        // gameState.diceValue = 6; // DEBUG: Luôn ra 6
        // gameState.diceValue = 1; // DEBUG: Luôn ra 1
        diceElement.textContent = gameState.diceValue;
        rollButton.disabled = true;

        console.log(`${gameState.currentPlayer} rolled a ${gameState.diceValue}`);

        findValidMoves();

        if (gameState.validMoves.length > 0) {
             if (gameState.currentPlayer === HUMAN_PLAYER) {
                 gameState.turnState = 'waiting_for_move';
                 messageArea.textContent = `Bạn (${HUMAN_PLAYER}) tung được ${gameState.diceValue}. Chọn quân để đi.`;
                 highlightValidPieces(true);
             } else {
                 gameState.turnState = 'ai_thinking';
                 messageArea.textContent = `Máy (${gameState.currentPlayer}) tung được ${gameState.diceValue}. Đang suy nghĩ...`;
                 setTimeout(aiChooseMove, 1000);
             }
        } else {
            messageArea.textContent = `${gameState.currentPlayer} tung được ${gameState.diceValue} nhưng không có nước đi hợp lệ.`;
            setTimeout(switchTurn, 1500);
        }
    }

    function findValidMoves() {
    gameState.validMoves = [];
    const player = gameState.currentPlayer;
    const dice = gameState.diceValue;

    for (const pieceId in gameState.pieces) {
        const piece = gameState.pieces[pieceId];
        if (piece.player !== player || piece.state === 'finished') continue;

        let targetPos = -1;
        let targetState = piece.state;
        let moveType = 'invalid';
        let isCapture = false;
        let capturedPieceId = null;
        let isPathBlocked = false; // Biến kiểm tra chặn đường

        if (piece.state === 'stable') {
            // Ra quân: Chỉ kiểm tra ô đích (START_POSITIONS)
            if (dice === 1 || dice === 6) {
                targetPos = START_POSITIONS[player];
                targetState = 'on_path';
                moveType = 'stable_out';
                // Việc kiểm tra ô đích (bị quân mình chặn/đá quân địch) sẽ thực hiện ở cuối
            }
        } else if (piece.state === 'on_path') {
            const currentPos = piece.position;
            const preHomePos = PRE_HOME_POSITIONS[player];
            const startPos = START_POSITIONS[player];
            const potentialStepsTaken = piece.stepsTaken + dice;

            let stepsToPreHome;
            if (preHomePos >= startPos) {
                stepsToPreHome = preHomePos - startPos + 1;
            } else {
                stepsToPreHome = (PATH_LENGTH - startPos) + preHomePos + 1;
            }

            // --- *** KIỂM TRA CHẶN ĐƯỜNG (MỚI) *** ---
            if (potentialStepsTaken < stepsToPreHome) {
                // Trường hợp đi hoàn toàn trên path chính
                for (let i = 1; i < dice; i++) {
                    const intermediatePos = (currentPos + i) % PATH_LENGTH;
                    if (getPieceAtBoardPosition(intermediatePos, 'on_path')) { // Bất kỳ quân nào cũng chặn
                        isPathBlocked = true;
                        // console.log(`Path blocked (on path) for ${pieceId} at step ${i}, pos ${intermediatePos}`);
                        break;
                    }
                }
                 if (!isPathBlocked) {
                     targetPos = (currentPos + dice) % PATH_LENGTH;
                     targetState = 'on_path';
                     moveType = 'normal';
                 } else {
                     moveType = 'invalid';
                 }
            } else {
                // Trường hợp đi vào home path
                const homePathIndex = potentialStepsTaken - (stepsToPreHome - 1);

                if (homePathIndex <= HOME_PATH_LENGTH) {
                     // Kiểm tra chặn trên path chính (đoạn đường còn lại trước khi vào nhà)
                     const stepsOnPathBeforeHome = stepsToPreHome - 1 - piece.stepsTaken;
                     for (let i = 1; i < stepsOnPathBeforeHome; i++) {
                          const intermediatePos = (currentPos + i) % PATH_LENGTH;
                          if (getPieceAtBoardPosition(intermediatePos, 'on_path')) {
                             isPathBlocked = true;
                             // console.log(`Path blocked (entering home) for ${pieceId} at step ${i}, pos ${intermediatePos}`);
                             break;
                          }
                     }

                     // Kiểm tra chặn trong home path (chỉ quân mình chặn)
                     if (!isPathBlocked) {
                         for (let h = 1; h < homePathIndex; h++) { // Kiểm tra các ô home path trung gian (1 đến index-1)
                             if (getPieceAtBoardPosition(h, 'in_home_path', player)) { // Chỉ quân mình mới chặn
                                 isPathBlocked = true;
                                 // console.log(`Home path blocked (entering home) for ${pieceId} at home step ${h}`);
                                 break;
                             }
                         }
                     }

                     if (!isPathBlocked) {
                         targetPos = homePathIndex;
                         targetState = 'in_home_path';
                         moveType = (homePathIndex === HOME_PATH_LENGTH) ? 'finish' : 'home_path';
                     } else {
                         moveType = 'invalid'; // Bị chặn khi vào nhà
                     }
                } else {
                     moveType = 'invalid'; // Đi quá đích
                }
            }
            // --- *** KẾT THÚC KIỂM TRA CHẶN ĐƯỜNG *** ---

        } else if (piece.state === 'in_home_path') {
            const currentHomePos = piece.position; // 1-6
            const potentialHomePos = currentHomePos + dice;

            if (potentialHomePos <= HOME_PATH_LENGTH) {
                 // --- *** KIỂM TRA CHẶN ĐƯỜNG TRONG NHÀ (MỚI) *** ---
                 for (let i = 1; i < dice; i++) {
                     const intermediateHomePos = currentHomePos + i;
                     // Chỉ kiểm tra nếu ô trung gian nằm trong home path (< đích)
                     if (intermediateHomePos < potentialHomePos && intermediateHomePos < HOME_PATH_LENGTH) {
                         if (getPieceAtBoardPosition(intermediateHomePos, 'in_home_path', player)) { // Chỉ quân mình chặn
                             isPathBlocked = true;
                            // console.log(`Home path blocked (inside) for ${pieceId} at step ${i}, pos ${intermediateHomePos}`);
                             break;
                         }
                     } else {
                          break; // Không cần kiểm tra chặn nữa nếu đã vượt qua ô đích tiềm năng
                     }
                 }
                 // --- *** KẾT THÚC KIỂM TRA CHẶN ĐƯỜNG TRONG NHÀ *** ---

                 if (!isPathBlocked) {
                     targetPos = potentialHomePos;
                     targetState = 'in_home_path';
                     moveType = (potentialHomePos === HOME_PATH_LENGTH) ? 'finish' : 'home_path';
                 } else {
                      moveType = 'invalid'; // Bị chặn trong nhà
                 }
            } else {
                moveType = 'invalid'; // Đi quá đích
            }
        }

        // --- Kiểm tra ô ĐÍCH và tính hợp lệ cuối cùng ---
        if (moveType !== 'invalid') { // Chỉ kiểm tra ô đích nếu đường đi không bị chặn
            let isTargetValid = true;
            capturedPieceId = null; // Reset lại phòng trường hợp tính toán trước đó
            isCapture = false;

            if (targetState === 'on_path') { // Áp dụng cho normal, capture, stable_out
                const occupyingPiece = getPieceAtBoardPosition(targetPos, 'on_path');
                if (occupyingPiece) {
                    if (occupyingPiece.player === player) {
                        isTargetValid = false; // Không được ĐÁP xuống ô quân mình
                    } else {
                        // Hợp lệ nếu đá quân địch
                        isCapture = true;
                        // Cập nhật moveType để phản ánh việc đá quân nếu là ra quân
                        if (moveType === 'stable_out') moveType = 'stable_out_capture';
                        else moveType = 'capture';
                        capturedPieceId = occupyingPiece.id;
                    }
                }
            } else if (targetState === 'in_home_path' && moveType !== 'finish') {
                // Chỉ kiểm tra chặn bởi quân mình ở ô đích trong nhà
                const occupyingPiece = getPieceAtBoardPosition(targetPos, 'in_home_path', player);
                if (occupyingPiece) {
                    isTargetValid = false; // Không được ĐÁP xuống ô quân mình trong nhà
                }
            }
            // Ô đích khi 'finish' luôn hợp lệ (không có quân nào ở đó)

            if (isTargetValid) { // Thêm vào validMoves nếu đường đi không bị chặn VÀ ô đích hợp lệ
                gameState.validMoves.push({
                    pieceId: piece.id,
                    targetPos: targetPos,
                    targetState: targetState,
                    moveType: moveType,
                    isCapture: isCapture,
                    capturedPieceId: capturedPieceId
                });
            }
        }
    } // Kết thúc vòng lặp duyệt quân cờ

    console.log(`Valid moves for ${player} with dice ${dice} (blocking rule applied):`, gameState.validMoves);
} // Kết thúc hàm findValidMoves

    // Lấy quân cờ (nếu có) tại một vị trí cụ thể trên bàn cờ
    // stateType: 'on_path' hoặc 'in_home_path'
    // targetPlayer (optional): chỉ tìm quân của người chơi này (dùng cho home path)
    function getPieceAtBoardPosition(position, stateType, targetPlayer = null) {
         for (const pieceId in gameState.pieces) {
             const piece = gameState.pieces[pieceId];
             if (piece.state === stateType && piece.position === position) {
                 if (!targetPlayer || piece.player === targetPlayer) {
                    return piece;
                 }
             }
         }
         return null;
    }


    function highlightValidPieces(highlight) {
        document.querySelectorAll('.piece.highlight').forEach(p => p.classList.remove('highlight'));
        if (highlight) {
            gameState.validMoves.forEach(move => {
                gameState.pieces[move.pieceId]?.highlight(true);
            });
        }
    }

    function handlePieceClick(clickedPiece) {
        if (gameState.turnState !== 'waiting_for_move' || gameState.currentPlayer !== HUMAN_PLAYER) return;

        const validMove = gameState.validMoves.find(move => move.pieceId === clickedPiece.id);

        if (validMove) {
            console.log(`Player chose move:`, validMove);
            highlightValidPieces(false);
            executeMove(validMove);
        } else {
            messageArea.textContent = "Nước đi không hợp lệ cho quân cờ này. Hãy chọn quân khác.";
            console.log("Invalid piece clicked:", clickedPiece.id);
        }
    }

     function executeMove(move) {
         const piece = gameState.pieces[move.pieceId];
         if (!piece || gameState.turnState === 'game_over') return;

         gameState.turnState = 'executing_move';

         // Xử lý đá quân (nếu có)
         if (move.isCapture && move.capturedPieceId) {
             const capturedPiece = gameState.pieces[move.capturedPieceId];
             if (capturedPiece) {
                 messageArea.textContent = `${piece.player} (${piece.id}) đá quân ${capturedPiece.id} của ${capturedPiece.player}!`;
                 capturedPiece.resetPosition();
             }
         }

         // Di chuyển quân cờ
         switch (move.moveType) {
             case 'stable_out':
                 piece.moveToPath(move.targetPos);
                 piece.stepsTaken = 0; // Bắt đầu đếm từ ô xuất phát
                 break;
             case 'normal':
             case 'capture':
                 piece.moveToPath(move.targetPos);
                 piece.stepsTaken += gameState.diceValue;
                 break;
             case 'home_path':
                 piece.moveToHomePath(move.targetPos);
                 // stepsTaken không cần cập nhật nữa
                 break;
             case 'finish':
                 piece.finish(); // Sẽ ẩn quân cờ
                 break;
         }

         // Kiểm tra thắng sau mỗi nước đi (đặc biệt là khi finish)
         if (checkWinCondition(piece.player)) {
             return; // Dừng lại nếu đã có người thắng
         }

         // --- *** THAY ĐỔI LOGIC THÊM LƯỢT *** ---
         // Kiểm tra có được tung thêm lượt (tung được 1, 6 HOẶC đá được quân)
         if (gameState.diceValue === 1 || gameState.diceValue === 6 || move.isCapture) {
              // Thông báo lý do thêm lượt (có thể tùy chỉnh)
              let reason = "";
              if (gameState.diceValue === 1) reason = "tung được 1";
              else if (gameState.diceValue === 6) reason = "tung được 6";
              if (move.isCapture) reason += (reason ? " và " : "") + "đá được quân";

              messageArea.textContent = `${gameState.currentPlayer} ${reason}. Được tung thêm lượt!`;
              gameState.turnState = 'waiting_for_roll'; // Quay lại trạng thái chờ tung
              if (gameState.currentPlayer === HUMAN_PLAYER) {
                  rollButton.disabled = false; // Cho phép người chơi tung lại
              } else {
                  // AI tự động tung lại sau độ trễ
                  setTimeout(rollDice, 1000);
              }
         } else {
             // Không được thêm lượt -> Chuyển lượt chơi
             setTimeout(switchTurn, 500); // Chờ chút để nhìn thấy nước đi
         }
     } // Kết thúc hàm executeMove


    function switchTurn() {
         if (gameState.turnState === 'game_over') return;

        const currentIndex = PLAYERS.indexOf(gameState.currentPlayer);
        gameState.currentPlayer = PLAYERS[(currentIndex + 1) % PLAYERS.length];
        gameState.diceValue = null;
        gameState.validMoves = [];
        gameState.turnState = 'waiting_for_roll';

        updateTurnIndicator();
        diceElement.textContent = '?';

        if (gameState.currentPlayer === HUMAN_PLAYER) {
            messageArea.textContent = `Lượt của bạn (${HUMAN_PLAYER}). Hãy tung xúc xắc!`;
            rollButton.disabled = false;
        } else {
            messageArea.textContent = `Đến lượt Máy (${gameState.currentPlayer})...`;
            rollButton.disabled = true;
            setTimeout(rollDice, 1500);
        }
    }


    // ================================

    function updateTurnIndicator() {
        currentPlayerSpan.textContent = gameState.currentPlayer;
        currentPlayerSpan.className = gameState.currentPlayer;
    }

    function checkWinCondition(player) {
        let finishedCount = 0;
        for (const pieceId in gameState.pieces) {
            if (gameState.pieces[pieceId].player === player && gameState.pieces[pieceId].state === 'finished') {
                finishedCount++;
            }
        }

        if (finishedCount === PIECES_PER_PLAYER) {
            gameState.turnState = 'game_over';
            messageArea.textContent = `Chúc mừng ${player.toUpperCase()} đã chiến thắng!`;
            rollButton.disabled = true;
            highlightValidPieces(false);
            gameSetupDiv.classList.remove('hidden'); // Hiển thị lại phần setup
             // Thêm nút Chơi lại nếu chưa có
             if (!document.getElementById('restart-button')) {
                 const restartButton = document.createElement('button');
                 restartButton.textContent = "Chơi lại";
                 restartButton.id = 'restart-button'; // Gán ID để kiểm tra
                 restartButton.onclick = () => {
                     // Xóa nút chơi lại đi
                     restartButton.remove();
                     initGame(); // Khởi tạo lại game
                 };
                 gameSetupDiv.appendChild(restartButton);
             }
             return true; // Đã có người thắng
        }
        return false; // Chưa ai thắng
    }

    // --- AI Logic (Giữ nguyên như cũ) ---
    function aiChooseMove() {
        if (gameState.turnState !== 'ai_thinking' || gameState.validMoves.length === 0) {
             console.log("AI has no moves or wrong state, switching turn.");
             setTimeout(switchTurn, 500); // Chuyển lượt nếu không có nước đi
            return;
        }

        let bestMove = null;
        const difficulty = gameState.difficulty;
        const player = gameState.currentPlayer;

        if (difficulty === 'easy') {
            bestMove = gameState.validMoves[Math.floor(Math.random() * gameState.validMoves.length)];
        } else { // Normal & Hard
            let highScore = -Infinity;
            const scoredMoves = gameState.validMoves.map(move => {
                 let score = 0;
                 const piece = gameState.pieces[move.pieceId];

                 // Ưu tiên cơ bản
                 if (move.moveType === 'finish') score += 1000;
                 if (move.isCapture) score += 500;
                 if (move.moveType === 'stable_out') score += (gameState.diceValue === 6 ? 210 : 200); // Ưu tiên ra bằng 6 hơn 1 chút
                 if (move.moveType === 'home_path') score += 300;

                 // Ưu tiên tiến lên (dựa trên targetPos nếu trên path, hoặc home index)
                 if(move.targetState === 'on_path') {
                     // Tính khoảng cách tương đối trên vòng lặp 0-51
                     let currentRelPos = piece.position - START_POSITIONS[player];
                     if (currentRelPos < 0) currentRelPos += PATH_LENGTH;
                     let targetRelPos = move.targetPos - START_POSITIONS[player];
                      if (targetRelPos < 0) targetRelPos += PATH_LENGTH;
                     score += (targetRelPos > currentRelPos ? targetRelPos : targetRelPos + PATH_LENGTH); // Cộng điểm tiến lên
                 } else if (move.targetState === 'in_home_path') {
                     score += move.targetPos * 10; // Ưu tiên tiến sâu vào nhà
                 }


                 if (difficulty === 'hard') {
                     // Hard: Ưu tiên quân gần về đích hơn
                     const preHomePos = PRE_HOME_POSITIONS[player];
                     const startPos = START_POSITIONS[player];
                     let stepsToPreHome;
                      if (preHomePos >= startPos) stepsToPreHome = preHomePos - startPos + 1;
                      else stepsToPreHome = (PATH_LENGTH - startPos) + preHomePos + 1;

                      if(piece.state === 'on_path'){
                          score += (stepsToPreHome - piece.stepsTaken) * 2; // Càng ít bước còn lại càng tốt
                      } else if (piece.state === 'in_home_path') {
                          score += (HOME_PATH_LENGTH - piece.position) * 5; // Ưu tiên quân đang ở trong nhà và gần đích
                      }

                      // Hard: Tránh vị trí dễ bị đá (heuristic đơn giản)
                      // Nếu ô đích có nhiều quân địch có thể tới trong 6 bước tới -> giảm điểm
                      // (Logic này phức tạp, tạm bỏ qua để giữ code gọn)
                 }

                 // console.log(`Move ${move.pieceId} to ${move.targetPos} (${move.moveType}) scored: ${score}`);
                 return { move, score };
            });

             scoredMoves.sort((a, b) => b.score - a.score);

            if (scoredMoves.length > 0) {
                 bestMove = scoredMoves[0].move;
                 if(difficulty === 'hard'){
                     const topScore = scoredMoves[0].score;
                     const bestMoves = scoredMoves.filter(m => m.score === topScore);
                      bestMove = bestMoves[Math.floor(Math.random() * bestMoves.length)].move; // Chọn ngẫu nhiên trong các nước tốt nhất
                 }
            } else {
                 bestMove = gameState.validMoves[Math.floor(Math.random() * gameState.validMoves.length)]; // Fallback ngẫu nhiên
            }
        }

        if (bestMove) {
             console.log(`AI (${player} - ${difficulty}) chose move:`, bestMove);
            messageArea.textContent = `Máy (${player}) chọn đi quân ${bestMove.pieceId}.`;
            executeMove(bestMove);
        } else {
             console.error("AI could not choose a best move!", gameState.validMoves);
             setTimeout(switchTurn, 500); // Chuyển lượt nếu lỗi
        }
    }

    // --- Event Listeners ---
    rollButton.addEventListener('click', rollDice);
    startGameButton.addEventListener('click', initGame);

    // --- Initial Setup ---
    // Không tự động init, chờ người dùng chọn độ khó và bấm nút
    // initializeBoardGraphics(); // Có thể gọi để vẽ bàn cờ trước khi bấm start

});