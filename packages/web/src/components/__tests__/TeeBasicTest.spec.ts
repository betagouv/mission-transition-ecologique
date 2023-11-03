import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WebApp from '../../WebApp.vue'

describe('BasicTest', () => {
  it('renders properly', () => {
    const wrapper = mount(WebApp, { 
      props: { 
        seed: 'track_needs',
        msg: 'Hello'
      } 
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
