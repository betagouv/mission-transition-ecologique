import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TeeApp from '../../TeeApp.ce.vue'

describe('BasicTest', () => {
  it('renders properly', () => {
    const wrapper = mount(TeeApp, { 
      props: { 
        seed: 'track_needs',
        msg: 'Hello'
      } 
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
