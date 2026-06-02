import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import PurchaseOrderCreatePage from './PurchaseOrderCreatePage.vue';

// Stub child components to keep tests focused on the page logic
vi.mock('../components/POHeaderForm.vue', () => ({
  default: { template: '<div data-testid="po-header-form" />', props: ['modelValue'], emits: ['update:modelValue'] },
}));

vi.mock('../components/POLineAllocationTable.vue', () => ({
  default: { template: '<div data-testid="po-line-table" />', props: ['lines'], emits: ['update:lines'] },
}));

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/purchase-orders', component: { template: '<div />' } },
      { path: '/purchase-orders/new', component: PurchaseOrderCreatePage },
    ],
  });
}

describe('PurchaseOrderCreatePage', () => {
  let router;

  beforeEach(async () => {
    router = buildRouter();
    await router.push('/purchase-orders/new');
  });

  test('renders page title', () => {
    const wrapper = mount(PurchaseOrderCreatePage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Create Purchase Order');
  });

  test('renders Save as Draft and Cancel buttons', () => {
    const wrapper = mount(PurchaseOrderCreatePage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Save as Draft');
    expect(wrapper.text()).toContain('Cancel');
  });

  test('shows error when submitting with no lines', async () => {
    const wrapper = mount(PurchaseOrderCreatePage, {
      global: { plugins: [router] },
    });

    await wrapper.find('form').trigger('submit');

    expect(wrapper.text()).toContain('Please add at least one line');
  });

  test('no error message shown on initial render', () => {
    const wrapper = mount(PurchaseOrderCreatePage, {
      global: { plugins: [router] },
    });

    expect(wrapper.find('.error').exists()).toBe(false);
  });

  test('renders POHeaderForm and POLineAllocationTable', () => {
    const wrapper = mount(PurchaseOrderCreatePage, {
      global: { plugins: [router] },
    });

    expect(wrapper.find('[data-testid="po-header-form"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="po-line-table"]').exists()).toBe(true);
  });
});
