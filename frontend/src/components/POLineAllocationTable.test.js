import { describe, test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import POLineAllocationTable from './POLineAllocationTable.vue';

function sampleLine(overrides = {}) {
  return {
    prLineId: 'pr-line-001',
    itemCode: 'BRG-001',
    itemName: 'Safety Helmet',
    qtyOrdered: 5,
    uom: 'PCS',
    unitPrice: 150000,
    siteCode: 'WH-JKT',
    requiredDate: '',
    ...overrides,
  };
}

describe('POLineAllocationTable', () => {
  test('shows empty state message when no lines', () => {
    const wrapper = mount(POLineAllocationTable, { props: { lines: [] } });

    expect(wrapper.text()).toContain('No lines added');
  });

  test('does not show empty state when lines exist', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { lines: [sampleLine()] },
    });

    expect(wrapper.text()).not.toContain('No lines added');
  });

  test('renders one row per line', () => {
    const wrapper = mount(POLineAllocationTable, {
      props: { lines: [sampleLine(), sampleLine({ itemCode: 'BRG-002' })] },
    });

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
  });

  test('emits update:lines with new empty line when Add Line clicked', async () => {
    const wrapper = mount(POLineAllocationTable, { props: { lines: [] } });

    await wrapper.find('button').trigger('click');

    const emitted = wrapper.emitted('update:lines');
    expect(emitted).toBeTruthy();
    expect(emitted[0][0]).toHaveLength(1);
    expect(emitted[0][0][0].itemCode).toBe('');
  });

  test('emits update:lines without removed line when delete clicked', async () => {
    const lines = [sampleLine({ itemCode: 'A' }), sampleLine({ itemCode: 'B' })];
    const wrapper = mount(POLineAllocationTable, { props: { lines } });

    // click the first row's delete button
    await wrapper.find('.btn-danger-icon').trigger('click');

    const emitted = wrapper.emitted('update:lines');
    expect(emitted[0][0]).toHaveLength(1);
    expect(emitted[0][0][0].itemCode).toBe('B');
  });

  test('shows total in footer when lines exist', () => {
    // 2 lines: 5 × 150000 + 3 × 100000 = 1050000
    const lines = [
      sampleLine({ qtyOrdered: 5, unitPrice: 150000 }),
      sampleLine({ qtyOrdered: 3, unitPrice: 100000 }),
    ];
    const wrapper = mount(POLineAllocationTable, { props: { lines } });

    expect(wrapper.find('tfoot').exists()).toBe(true);
    expect(wrapper.find('tfoot').text()).toContain('Total');
  });

  test('footer is not shown when lines is empty', () => {
    const wrapper = mount(POLineAllocationTable, { props: { lines: [] } });

    expect(wrapper.find('tfoot').exists()).toBe(false);
  });
});
