
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import React from 'react'
import '@testing-library/jest-dom'

import { PlayPauseButton } from '../../src/components/PlayPauseButton'
import { State } from '../../src/Player'
import { createContextProvider, expectMatchesSnapshot } from '../testUtils'

describe('<PlayPauseButton />', () => {
  const helpers = createContextProvider()
  const get = () => {
    return screen.getByTestId('pp-ui-playpause-toggle')
  }

  afterEach(() => {
    // restore the spy created with spyOn
    jest.restoreAllMocks()
  })

  test('should match snapshot', () => {
    expectMatchesSnapshot(<PlayPauseButton/>)
  })

  test('should react to state changes', () => {
    helpers.render(<PlayPauseButton/>)

    const button = get()

    expect(button).toHaveClass('pp-ui-playpause-toggle-play')
    expect(button).not.toHaveClass('pp-ui-playpause-toggle-pause')
    expect(button).not.toBeDisabled()

    helpers.emitPlayerEvent('statechanged', {
      currentState: State.Playing,
      previousState: State.Paused,
      timeSinceLastStateChangeMS: 0,
    })

    expect(button).not.toHaveClass('pp-ui-playpause-toggle-play')
    expect(button).toHaveClass('pp-ui-playpause-toggle-pause')
  })

  test('can reset rate', async () => {
    helpers.render(<PlayPauseButton resetRate/>)

    const rateSetter = jest.spyOn(helpers.player, 'rate', 'set')
    const button = get()

    expect(button).toHaveClass('pp-ui-playpause-toggle-play')

    helpers.emitPlayerEvent('statechanged', {
      currentState: State.Playing,
      previousState: State.Paused,
      timeSinceLastStateChangeMS: 0,
    })
    jest.spyOn(helpers.player, 'rate', 'get').mockReturnValue(2)
    helpers.emitPlayerEvent('ratechange', 2)

    expect(button).toHaveClass('pp-ui-playpause-toggle-play')

    await userEvent.click(button)
    
    expect(rateSetter).toHaveBeenCalledTimes(1)
    expect(rateSetter).toHaveBeenCalledWith(1)
    expect(button).toHaveClass('pp-ui-playpause-toggle-play')
  })
})
