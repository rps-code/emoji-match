<template>
    <main class="block max-w-md p-6 rounded-lg shadow bg-slate-800">
        <ConfettiExplosion class="absolute top-0 left-1/2" v-if="confetti" />
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-white">Emoji Match</h5>
        <p class="font-normal text-gray-400">Match the emoji pairs in the least amount of moves to win.</p>
        <Stats />
        <Tiles />
    </main>
</template>

<script setup lang="ts">
import Stats from './components/Stats.vue'
import Tiles from './components/Tiles.vue'
import ConfettiExplosion from 'vue-confetti-explosion'
import { useGameStore } from '@/stores/game'
import { watch, ref } from 'vue'

const game = useGameStore()

var confetti = ref(false)

watch(
    () => game.confetti,
    (newVal) => {
        if (newVal) {
            confetti.value = true
            setTimeout(() => {
                confetti.value = false
            }, 3500)
        }
    }
)
</script>

<style scoped>
@keyframes shake {
    0% {
        transform: translateX(0);
    }
    25% {
        transform: translateX(-10px);
    }
    50% {
        transform: translateX(10px);
    }
    75% {
        transform: translateX(-10px);
    }
    100% {
        transform: translateX(0);
    }
}

.shake-it {
    animation: shake 0.5s linear;
}
</style>
