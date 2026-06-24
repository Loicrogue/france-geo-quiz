export interface TrainingResult {
    correct: number
    total: number
}

export function getTrainingEndMessage(correct: number): {
    emoji: string
    title: string
    message: string
} {
if (correct === 96) return {
        emoji: '🏆',
        title: 'Maîtrise totale !',
        message: 'Impressionnant. Aucun département ne t’échappe, tu pourrais redessiner la carte de France de mémoire.',
    }
    if (correct >= 72) return {
        emoji: '🌟',
        title: 'Excellent niveau !',
        message: 'Très belle performance ! Quelques hésitations subsistent, mais tu es clairement à l’aise sur la carte.',
    }
    if (correct >= 48) return {
        emoji: '🗺️',
        title: 'Bonne progression',
        message: 'Tu connais déjà une bonne partie du territoire. Avec un peu de pratique, tout deviendra automatique.',
    }
    if (correct >= 24) return {
        emoji: '🧭',
        title: 'En bonne voie',
        message: 'Les bases sont là ! Continue à t’entraîner, tu progresses dans la bonne direction.',
    }
    if (correct >= 10) return {
        emoji: '😅',
        title: 'Encore un effort',
        message: 'Ce n’est pas encore ça, mais rien d’alarmant. Un peu de révision et ça va vite s’améliorer.',
    }
    return {
        emoji: '📍',
        title: 'On reprend les bases',
        message: 'Tu as trouvé ' + correct + ' départements. Pas de panique, chaque essai te rapproche du niveau supérieur.',
    }
}
