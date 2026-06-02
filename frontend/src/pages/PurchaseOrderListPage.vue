<template>
  <section>
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/" class="back-btn" title="Back to Dashboard">&#8592;</RouterLink>
        <div>
          <h2>Purchase Orders</h2>
          <p class="muted">All purchase order records</p>
        </div>
      </div>
      <RouterLink class="btn btn-outline" to="/purchase-orders/new">+ New PO</RouterLink>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="card-panel">
      <table>
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Vendor</th>
            <th>PR Reference</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="items.length === 0">
            <td colspan="5" style="text-align: center; color: var(--text-muted); padding: 24px">No purchase orders found.</td>
          </tr>
          <tr v-for="item in items" :key="item.id">
            <td><RouterLink :to="`/purchase-orders/${item.id}`">{{ item.poNumber }}</RouterLink></td>
            <td>{{ item.vendorName }}</td>
            <td>{{ item.prNumber || '-' }}</td>
            <td>
              <span class="status-badge" :class="item.status.toLowerCase()">{{ item.status }}</span>
            </td>
            <td>{{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { api } from '../api';

const items = ref([]);
const errorMessage = ref('');

onMounted(async () => {
  try {
    const data = await api.listPurchaseOrders();
    items.value = data.items || data;
  } catch (err) {
    errorMessage.value = err.message;
  }
});
</script>
