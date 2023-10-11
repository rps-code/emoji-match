<template>
    <div class="flex my-5">
        <div class="relative w-1/2 p-2 mr-1 text-white rounded-lg bg-slate-700">
            <span class="block text-gray-400">Pairs Matched</span>{{ game.matches }}
            <span class="text-xs text-gray-400">/ {{ maxPairs }}</span>
            <div class="h-2 mt-2 bg-gray-300 rounded">
                <div :style="{ width: progressBarWidth + '%' }" class="h-full transition-all bg-green-500 rounded"></div>
            </div>
        </div>
        <div class="w-1/2 p-2 ml-1 text-white rounded-lg bg-slate-700">
            <span class="block text-gray-400">Failed Attempts</span>{{ game.attempts }}
            <span class="text-xs text-gray-400">/ {{ maxAttempts }}</span>
            <div class="h-2 mt-2 bg-gray-300 rounded">
                <div :style="{ width: attemptBarWidth + '%' }" class="h-full transition-all bg-red-500 rounded"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useGameStore } from '@/stores/game'
import { computed } from 'vue'

const game = useGameStore()

const maxPairs = game.tiles / 2
const maxAttempts = game.tiles

const progressBarWidth = computed(() => (game.matches / maxPairs) * 100)
const attemptBarWidth = computed(() => (game.attempts / maxAttempts) * 100)
</script>
