import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TeeApp from '../../TeeApp.ce.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(TeeApp, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
