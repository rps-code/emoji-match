<template>
    <div ref="tilesContainer" class="grid grid-cols-4 gap-3">
        <div
            v-for="(tile, index) in tiles"
            :key="index"
            :class="{ 'fall-off-screen': resetTiles }"
            class="w-full h-24 flip-card"
            @click="handleClick(index)"
        >
            <div :class="{ 'flip-card-inner transition transform duration-300 w-full h-full': true, flipped: tile.flipped }">
                <div
                    class="absolute flex items-center justify-center w-full h-full rounded-lg flip-card-front hover:cursor-pointer bg-slate-600"
                ></div>
                <div
                    :class="[
                        'absolute flex items-center justify-center w-full h-full text-4xl rounded-lg rotate-180 flip-card-back bg-slate-700',
                        { 'opacity-25': tile.matched }
                    ]"
                >
                    {{ tile.emoji }}
                </div>
            </div>
        </div>
    </div>
    <div class="flex justify-end">
        <button
            :disabled="game.attempts == 0 && game.matches == 0"
            class="px-4 py-2 mt-5 text-white transition-opacity bg-orange-500 rounded-full disabled:opacity-50 disabled:hover:cursor-not-allowed disabled:hover:bg-orange-500 hover:bg-orange-600"
            @click="resetGame"
        >
            Reset
        </button>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import { useGameStore } from '@/stores/game'

const game = useGameStore()

const tilesContainer = ref<HTMLElement | null>(null)
const selectedTiles = ref<number[]>([])
const canClick = ref<boolean>(true)
const resetTiles = ref<boolean>(false)

const randomEmojis = computed(() => pickRandomEmojis(game.emojis, game.tiles / 2))

// Pick 8 random emojis
const pickRandomEmojis = (emojiArray: string[], num: number): string[] => {
    const tempArray = [...emojiArray]
    const pickedEmojis: string[] = []

    for (let i = 0; i < num; i++) {
        const randomIndex = Math.floor(Math.random() * tempArray.length)
        const [chosenEmoji] = tempArray.splice(randomIndex, 1)
        pickedEmojis.push(chosenEmoji)
    }

    return pickedEmojis
}

// Shuffle emojis function
const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
}

// Shake container on loss
const shakeContainer = () => {
    const container = document.querySelector('main')
    container?.classList.add('shake-it')
    setTimeout(() => {
        container?.classList.remove('shake-it')
    }, 500)
}

// Check for a win
const checkWinCondition = () => {
    if (game.matches === game.tiles / 2) game.toggleConfetti()
}

// Check for a loss
const checkLoseCondition = () => {
    if (game.attempts >= game.tiles) {
        shakeContainer()
        resetGame()
    }
}

// reset game
const resetGame = () => {
    game.resetGame()

    // Create a new set of random emojis and tiles
    const newRandomEmojis = pickRandomEmojis(game.emojis, game.tiles / 2)
    const newPairedEmojis = [...newRandomEmojis, ...newRandomEmojis]
    const newShuffledEmojis = shuffleArray([...newPairedEmojis])

    // Update the tiles reactive array
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].emoji = newShuffledEmojis[i]
        tiles[i].flipped = false
        tiles[i].matched = false
    }
}

// Duplicate the randomEmojis to make pairs
const pairedEmojis = [...randomEmojis.value, ...randomEmojis.value]

// Shuffle the 16 emojis
const shuffledEmojis = shuffleArray([...pairedEmojis])
const tiles = reactive(shuffledEmojis.map((emoji) => ({ emoji, flipped: false, matched: false })))

const handleClick = (index: number) => {
    if (!canClick.value || tiles[index].flipped) return

    tiles[index].flipped = !tiles[index].flipped

    selectedTiles.value.push(index)

    if (selectedTiles.value.length === 2) {
        canClick.value = false

        const [firstIndex, secondIndex] = selectedTiles.value

        if (tiles[firstIndex].emoji === tiles[secondIndex].emoji) {
            game.incrementMatches()
            tiles[firstIndex].matched = true
            tiles[secondIndex].matched = true
            canClick.value = true
            checkWinCondition()
        } else {
            game.incrementAttempts()
            checkLoseCondition()

            setTimeout(() => {
                tiles[firstIndex].flipped = false
                tiles[secondIndex].flipped = false
                canClick.value = true
            }, 600)
        }

        selectedTiles.value = []
    }
}
</script>

<style scoped>
.flip-card {
    perspective: 1000px;
}

.flip-card-inner {
    transform-style: preserve-3d;
}

.flip-card-inner.flipped {
    transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
    backface-visibility: hidden;
}

.flip-card-back {
    transform: rotateY(180deg);
}
</style>
