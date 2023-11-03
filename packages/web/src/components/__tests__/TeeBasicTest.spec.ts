import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import WidgetApp from '../../WidgetApp.ce.vue'

describe('BasicTest', () => {
  it('renders properly', () => {
    const wrapper = mount(WidgetApp, { 
      props: { 
        seed: 'track_needs',
        msg: 'Hello'
      } 
    })
    expect(wrapper.text()).toContain('Hello')
  })
})
