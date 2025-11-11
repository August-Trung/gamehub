// src/types/game.ts
import { ReactNode } from "react";

export interface GameItem {
	id: string;
	name: string;
	component: ReactNode;
	tagline?: string;
	category?: string;
	categoryKey?: string;
	difficulty?: string;
	difficultyKey?: string;
	players?: string;
	playersKey?: string;
	icon?: string;
	status?: string;
	gradient?: string;
}
