import { defineStore } from 'pinia'
import { nextTick } from 'vue'

interface GameState {
    attempts: number
    matches: number
    tiles: number
    emojis: string[]
    confetti: boolean | any
}

export const useGameStore = defineStore('game', {
    state: (): GameState => ({
        attempts: 0,
        matches: 0,
        tiles: 16,
        emojis: ['💰', '🔥', '🧠', '🤖', '🧑‍💻', '💻', '💩', '🎮', '💋', '👀'],
        confetti: false
    }),

    actions: {
        incrementAttempts() {
            this.attempts++
        },

        incrementMatches() {
            this.matches++
        },

        async toggleConfetti() {
            this.confetti = true
            await nextTick()
            this.confetti = false
        },

        resetGame() {
            this.attempts = 0
            this.matches = 0
            this.confetti = false
        }
    }
})
