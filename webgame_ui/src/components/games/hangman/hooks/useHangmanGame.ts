import { useState, useEffect, useCallback } from "react";

type GameStatus = "playing" | "won" | "lost";

export const useHangmanGame = (wordList: string[]) => {
	const getRandomWord = useCallback(() => {
		const randomIndex = Math.floor(Math.random() * wordList.length);
		return wordList[randomIndex];
	}, [wordList]);

	const [word, setWord] = useState<string>("");
	const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
	const [wrongGuesses, setWrongGuesses] = useState<string[]>([]);
	const [gameStatus, setGameStatus] = useState<GameStatus>("playing");

	// Initialize word and reset game state when wordList changes
	useEffect(() => {
		setWord(getRandomWord());
		setGuessedLetters([]);
		setWrongGuesses([]);
		setGameStatus("playing");
	}, [wordList, getRandomWord]);

	const checkWin = useCallback(() => {
		return word
			.split("")
			.every((letter) => guessedLetters.includes(letter));
	}, [word, guessedLetters]);

	const checkLoss = useCallback(() => {
		return wrongGuesses.length >= 6;
	}, [wrongGuesses]);

	const guessLetter = useCallback(
		(letter: string) => {
			if (gameStatus !== "playing" || guessedLetters.includes(letter))
				return;

			const updatedGuessed = [...guessedLetters, letter];
			setGuessedLetters(updatedGuessed);

			if (!word.includes(letter)) {
				setWrongGuesses([...wrongGuesses, letter]);
			}
		},
		[gameStatus, guessedLetters, wrongGuesses, word]
	);

	const resetGame = useCallback(() => {
		setWord(getRandomWord());
		setGuessedLetters([]);
		setWrongGuesses([]);
		setGameStatus("playing");
	}, [getRandomWord]);

	useEffect(() => {
		if (gameStatus !== "playing") return;

		if (checkWin()) {
			setGameStatus("won");
		} else if (checkLoss()) {
			setGameStatus("lost");
		}
	}, [gameStatus, checkWin, checkLoss]);

	return {
		word,
		guessedLetters,
		wrongGuesses,
		gameStatus,
		guessLetter,
		resetGame,
	};
};
