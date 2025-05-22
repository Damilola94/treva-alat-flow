import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { rootColors } from './colors';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const decodeJwt = (jwt: string) => {
  try {
    return JSON.parse(atob(jwt.split('.')[1]));
  } catch (error) {
    return { exp: 0 };
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getMockApiData(responseData: any) {
  return {
    isSuccess: true,
    responseCode: '200',
    responseMessage: 'Good to go',
    responseData,
  };
}

interface IAvatarProps {
  name?: string | null;
  fontSize?: number;
  size?: number;
  color?: string;
  background?: string;
  length?: number;
  rounded?: boolean;
}

export function getAvatar(props: IAvatarProps) {
  const {
    name,
    color = rootColors['wema-purple'].replace('#', ''),
    background = rootColors['primary-color'].replace('#', ''),
    ...restProps
  } = props;

  const length = restProps.length ?? 1;
  const fontSize = restProps.fontSize ?? (restProps.length === 2 ? 0.45 : 0.55);
  const size = restProps.size ?? 32;

  const avatar =
    `https://ui-avatars.com/api/?name=${name}&font-size=${fontSize}` +
    `&background=${background}&color=${color}&length=${length}&rounded=${!!restProps.rounded}&size=${size}`;

  return avatar;
}

export function getFullName({
  firstName = '',
  lastName = '',
}: {
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}) {
  return `${firstName ?? ''} ${lastName ?? ''}`.trim();
}

export function extractName(fullName: string): {
  firstName: string;
  lastName: string;
} {
  const nameParts = fullName.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';
  return { firstName, lastName };
}

export function checkWordsInSentence(sentence: string, words: string[]) {
  const sentenceWords = sentence.toLowerCase().split(/\W+/);

  return words.every((word: string) =>
    sentenceWords.includes(word.toLowerCase()),
  );
}

export function formatDate(dateString: string | number | Date) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}
