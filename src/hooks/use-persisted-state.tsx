import type React from 'react'
import { useEffect, useState } from 'react'
import { getLocalStorage } from '../services/helper'
import { useEffectOnce } from '.'

export function usePersistedState<S> (
  key: string,
  defaultValue: (() => S) | S
) {
  const [state, setState] = useState<S>(defaultValue)
  const defaultValueType = Array.isArray(defaultValue) ? defaultValue[0] : defaultValue

  type SElement = ReturnType<() => typeof defaultValueType>

  useEffectOnce(() => {
    const persistedValue = getLocalStorage(key)

    setState((prevValue: SElement) => (persistedValue || prevValue))
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state))
  }, [key, state])

  return [state, setState] as [S, React.Dispatch<React.SetStateAction<SElement>>]
}
