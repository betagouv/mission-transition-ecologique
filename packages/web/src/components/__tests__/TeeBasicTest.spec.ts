import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TeeApp from '../../TeeApp.ce.vue'
import { TrackId } from '../../types'

describe('BasicTest', () => {
  it('renders properly', () => {
    const wrapper = mount(TeeApp, {
      props: {
        seed: TrackId.Needs,
        msg: 'Hello'
      }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
