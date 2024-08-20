import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { rootColors } from './colors'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const decodeJwt = (jwt: string) => {
  try {
    return JSON.parse(atob(jwt.split('.')[1]))
  } catch (error) {
    return { exp: 0 }
  }
}

export function getMockApiData (responseData: any) {
  return {
    isSuccess: true,
    responseCode: '200',
    responseMessage: 'Good to go',
    responseData
  }
}

interface IAvatarProps {
  name: string
  fontSize?: number
  size?: number
  color?: string
  background?: string
  length?: number
  rounded?: boolean
}

export function getAvatar (props: IAvatarProps) {
  const {
    name,
    color = rootColors['wema-purple'].replace('#', ''),
    background = rootColors['primary-color'].replace('#', ''),
    ...restProps
  } = props

  const length = restProps.length ?? 1
  const fontSize = restProps.fontSize ?? (restProps.length === 2 ? 0.45 : 0.55)
  const size = restProps.size ?? 32

  const avatar = `https://ui-avatars.com/api/?name=${name}&font-size=${fontSize}` +
    `&background=${background}&color=${color}&length=${length}&rounded=${!!restProps.rounded}&size=${size}`

  return avatar
}

export function getFullName ({ firstName = '', lastName = '' }) {
  return (`${firstName ?? ''} ${lastName ?? ''}`.trim())
}

export function checkWordsInSentence (sentence: string, words: string[]) {
  const sentenceWords = sentence.toLowerCase().split(/\W+/)

  return words.every((word: string) => sentenceWords.includes(word.toLowerCase()))
}
