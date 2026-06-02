import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import POHeaderForm from './POHeaderForm.vue';

function defaultModel() {
  return {
    vendorName: '',
    prNumber: '',
    expectedDeliveryDate: '',
    paymentTerms: '',
    notes: '',
  };
}

describe('POHeaderForm', () => {
  test('renders all header fields', () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: defaultModel() },
    });

    expect(wrapper.find('input[placeholder="Type..."]').exists()).toBe(true);
    expect(wrapper.find('input[placeholder="e.g. PR-2026-0001"]').exists()).toBe(true);
    expect(wrapper.find('input[type="date"]').exists()).toBe(true);
    expect(wrapper.find('select').exists()).toBe(true);
    expect(wrapper.find('textarea').exists()).toBe(true);
  });

  test('displays the current vendorName value', () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: { ...defaultModel(), vendorName: 'PT Maju Jaya' } },
    });

    const input = wrapper.find('input[placeholder="Type..."]');
    expect(input.element.value).toBe('PT Maju Jaya');
  });

  test('emits update:modelValue with new vendorName when typed', async () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: defaultModel() },
    });

    const input = wrapper.find('input[placeholder="Type..."]');
    await input.setValue('New Vendor');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0].vendorName).toBe('New Vendor');
  });

  test('emits update:modelValue with new prNumber when typed', async () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: defaultModel() },
    });

    const input = wrapper.find('input[placeholder="e.g. PR-2026-0001"]');
    await input.setValue('PR-2026-0005');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted[0][0].prNumber).toBe('PR-2026-0005');
  });

  test('payment terms select lists all options', () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: defaultModel() },
    });

    const options = wrapper.findAll('select option');
    const values = options.map((o) => o.element.value);

    expect(values).toContain('NET30');
    expect(values).toContain('NET60');
    expect(values).toContain('COD');
    expect(values).toContain('PREPAID');
  });

  test('emits update:modelValue with selected paymentTerms', async () => {
    const wrapper = mount(POHeaderForm, {
      props: { modelValue: defaultModel() },
    });

    await wrapper.find('select').setValue('NET30');

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted[0][0].paymentTerms).toBe('NET30');
  });
});
