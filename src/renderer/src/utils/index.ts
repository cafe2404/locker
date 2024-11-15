import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getRandomEmoji = () => {
  const emojiList = [
    '😀',
    '😂',
    '🥰',
    '😍',
    '😎',
    '🤩',
    '😜',
    '😭',
    '🤯',
    '🥳',
    '😇',
    '🤓',
    '🤠',
    '😡'
  ]
  const randomIndex = Math.floor(Math.random() * emojiList.length)
  return emojiList[randomIndex]
}
