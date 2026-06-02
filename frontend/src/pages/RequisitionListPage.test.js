import { describe, test, expect, vi, beforeEach } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import { createRouter, createMemoryHistory } from 'vue-router';
import RequisitionListPage from './RequisitionListPage.vue';

// Mock the api module so tests don't make real HTTP calls
vi.mock('../api', () => ({
  api: {
    listRequisitions: vi.fn(),
  },
}));

import { api } from '../api';

function buildRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', component: { template: '<div />' } },
      { path: '/requisitions', component: RequisitionListPage },
      { path: '/requisitions/new', component: { template: '<div />' } },
      { path: '/requisitions/:id', component: { template: '<div />' } },
    ],
  });
}

describe('RequisitionListPage', () => {
  let router;

  beforeEach(async () => {
    router = buildRouter();
    await router.push('/requisitions');
    vi.clearAllMocks();
  });

  test('renders page title', async () => {
    api.listRequisitions.mockResolvedValue({ items: [] });

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('Purchase Requisitions');
  });

  test('renders a row for each item returned by the API', async () => {
    api.listRequisitions.mockResolvedValue({
      items: [
        { id: 'pr-1', prNumber: 'PR-2026-0001', requesterName: 'Rina', departmentName: 'Ops', title: 'Spare parts', status: 'APPROVED', neededByDate: '2026-06-15' },
        { id: 'pr-2', prNumber: 'PR-2026-0002', requesterName: 'Budi', departmentName: 'IT', title: 'Laptops', status: 'DRAFT', neededByDate: null },
      ],
    });

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });
    await flushPromises();

    const rows = wrapper.findAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].text()).toContain('PR-2026-0001');
    expect(rows[1].text()).toContain('Budi');
  });

  test('renders status badge with correct text', async () => {
    api.listRequisitions.mockResolvedValue({
      items: [
        { id: 'pr-1', prNumber: 'PR-2026-0001', requesterName: 'Rina', departmentName: 'Ops', title: 'Spare parts', status: 'APPROVED', neededByDate: null },
      ],
    });

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });
    await flushPromises();

    expect(wrapper.find('.status-badge').text()).toBe('APPROVED');
  });

  test('shows dash for missing neededByDate', async () => {
    api.listRequisitions.mockResolvedValue({
      items: [
        { id: 'pr-1', prNumber: 'PR-2026-0001', requesterName: 'Rina', departmentName: 'Ops', title: 'Spare parts', status: 'DRAFT', neededByDate: null },
      ],
    });

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });
    await flushPromises();

    const lastCell = wrapper.findAll('tbody td').at(-1);
    expect(lastCell.text()).toBe('-');
  });

  test('shows error message when API call fails', async () => {
    api.listRequisitions.mockRejectedValue(new Error('Network error'));

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });
    await flushPromises();

    expect(wrapper.find('.error').text()).toBe('Network error');
  });

  test('renders New PR link', async () => {
    api.listRequisitions.mockResolvedValue({ items: [] });

    const wrapper = mount(RequisitionListPage, {
      global: { plugins: [router] },
    });

    expect(wrapper.text()).toContain('+ New PR');
  });
});
