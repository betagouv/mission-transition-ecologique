import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WebApp from '../../WebApp.vue'
import { TrackId } from '../../types'

describe('BasicTest', () => {
  it('renders properly', () => {
    const wrapper = mount(WebApp, {
      props: {
        seed: TrackId.Goals,
        msg: 'Hello'
      }
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
