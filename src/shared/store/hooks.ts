import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook
} from 'react-redux'
import type { RootState, AppDispatch } from '.'

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
