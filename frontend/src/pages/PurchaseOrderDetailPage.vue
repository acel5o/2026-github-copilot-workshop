<template>
  <section>
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/purchase-orders" class="back-btn" title="Back to list">&#8592;</RouterLink>
        <div>
          <h2>Purchase Order Detail</h2>
          <p class="muted">{{ po?.poNumber || '-' }} &mdash; Purchase Order information detail</p>
        </div>
      </div>
      <div class="btn-group" v-if="po">
        <button v-if="po.status === 'DRAFT'" class="btn btn-primary" :disabled="submitting" @click="submitPo">
          {{ submitting ? 'Submitting…' : 'Submit PO' }}
        </button>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <div class="card-panel" v-if="po">
      <p class="form-section-title">PO Header</p>
      <div class="form-row">
        <div class="form-group">
          <label>PO Number</label>
          <input :value="po.poNumber" disabled />
        </div>
        <div class="form-group">
          <label>Vendor Name</label>
          <input :value="po.vendorName" disabled />
        </div>
        <div class="form-group">
          <label>PR Reference</label>
          <input :value="po.prNumber || '-'" disabled />
        </div>
        <div class="form-group">
          <label>Expected Delivery</label>
          <input :value="po.expectedDeliveryDate || '-'" disabled />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Status</label>
          <span class="status-badge" :class="po.status.toLowerCase()">{{ po.status }}</span>
        </div>
        <div class="form-group">
          <label>Payment Terms</label>
          <input :value="po.paymentTerms || '-'" disabled />
        </div>
      </div>
      <div class="form-group full">
        <label>Notes</label>
        <textarea :value="po.notes || '-'" disabled rows="3" />
      </div>
    </div>

    <div class="card-panel" v-if="po">
      <p class="form-section-title">PO Lines</p>
      <table>
        <thead>
          <tr>
            <th style="width: 50px">Line</th>
            <th>Item Code</th>
            <th>Item Name</th>
            <th>QTY Ordered</th>
            <th>UOM</th>
            <th>Unit Price</th>
            <th>Total</th>
            <th>Site</th>
            <th>Required Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="line in po.lines" :key="line.id">
            <td>{{ line.lineNo }}</td>
            <td>{{ line.itemCode }}</td>
            <td>{{ line.itemName }}</td>
            <td>{{ line.qtyOrdered }}</td>
            <td>{{ line.uom }}</td>
            <td>{{ Number(line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
            <td>{{ (line.qtyOrdered * line.unitPrice).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</td>
            <td>{{ line.siteCode }}</td>
            <td>{{ line.requiredDate ? line.requiredDate.slice(0, 10) : '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="card-panel po-summary" v-if="po && po.lines && po.lines.length > 0">
      <div class="po-summary-row">
        <span class="po-summary-label">Grand Total</span>
        <span class="po-summary-value">{{ po.lines.reduce((s, l) => s + l.qtyOrdered * l.unitPrice, 0).toLocaleString(undefined, { minimumFractionDigits: 2 }) }}</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import { api } from '../api';

const route = useRoute();
const po = ref(null);
const errorMessage = ref('');
const submitting = ref(false);

onMounted(async () => {
  try {
    po.value = await api.getPurchaseOrder(route.params.id);
  } catch (err) {
    errorMessage.value = err.message;
  }
});

async function submitPo() {
  submitting.value = true;
  errorMessage.value = '';
  try {
    po.value = await api.submitPurchaseOrder(route.params.id);
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    submitting.value = false;
  }
}
</script>
