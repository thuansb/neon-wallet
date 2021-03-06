// @flow
import { getClaimAmounts } from 'neon-js'
// Constants
export const SET_CLAIM = 'SET_CLAIM'
export const SET_CLAIM_REQUEST = 'SET_CLAIM_REQUEST'
export const DISABLE_CLAIM = 'DISABLE_CLAIM'

// Actions
export function setClaim (available: number, unavailable: number) {
  return {
    type: SET_CLAIM,
    available,
    unavailable
  }
}

export function setClaimRequest (status: boolean) {
  return {
    type: SET_CLAIM_REQUEST,
    status
  }
}

export function disableClaim (status: boolean) {
  return {
    type: DISABLE_CLAIM,
    status
  }
}

export const syncAvailableClaim = (net: NetworkType, address: string) => (dispatch: DispatchType) => {
  getClaimAmounts(net, address).then((result) => {
    return dispatch(setClaim(result.available, result.unavailable))
  })
}

// Reducer for managing claims data
export default (state: Object = { claimRequest: false, claimAmount: 0, claimAvailable: 0, claimUnavailable: 0, claimWasUpdated: false, disableClaimButton: false, signingFunction: () => ({}) }, action: Object) => {
  switch (action.type) {
    case SET_CLAIM_REQUEST:
      return { ...state, 'claimRequest': action.status }
    case SET_CLAIM:
      let claimWasUpdated = false
      if (action.available > state.claimAvailable && state.claimRequest === true) {
        claimWasUpdated = true
      }
      return {
        ...state,
        'claimAmount': (action.available + action.unavailable) / 100000000,
        'claimAvailable': action.available,
        'claimUnavailable': action.unavailable,
        claimWasUpdated
      }
    case DISABLE_CLAIM:
      return { ...state, disableClaimButton: action.status }
    default:
      return state
  }
}
