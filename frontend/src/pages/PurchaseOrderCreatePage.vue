<template>
  <section>
    <!-- Page header -->
    <div class="page-header">
      <div class="page-header-left">
        <RouterLink to="/purchase-orders" class="back-btn" title="Back to list">&#8592;</RouterLink>
        <div>
          <h2>Create Purchase Order</h2>
          <p class="muted">Allocate approved PR lines to a new purchase order</p>
        </div>
      </div>
    </div>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>

    <form @submit.prevent="handleSubmit">
      <!-- PO Header -->
      <POHeaderForm v-model="form.header" />

      <!-- PO Line Allocation -->
      <POLineAllocationTable
        :lines="form.lines"
        @update:lines="form.lines = $event"
      />

      <!-- Action buttons -->
      <div class="btn-group">
        <RouterLink to="/purchase-orders" class="btn btn-outline">Cancel</RouterLink>
        <button class="btn btn-primary" type="submit" :disabled="submitting">
          {{ submitting ? 'Saving…' : 'Save as Draft' }}
        </button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import POHeaderForm from '../components/POHeaderForm.vue';
import POLineAllocationTable from '../components/POLineAllocationTable.vue';
import { api } from '../api.js';

const router = useRouter();
const errorMessage = ref('');
const submitting = ref(false);

const form = reactive({
  header: {
    vendorName: '',
    prNumber: '',
    expectedDeliveryDate: '',
    paymentTerms: '',
    notes: '',
  },
  lines: [],
});

async function handleSubmit() {
  if (form.lines.length === 0) {
    errorMessage.value = 'Please add at least one line before saving.';
    return;
  }
  errorMessage.value = '';
  submitting.value = true;

  const payload = {
    vendorName: form.header.vendorName,
    prNumber: form.header.prNumber,
    expectedDeliveryDate: form.header.expectedDeliveryDate || null,
    paymentTerms: form.header.paymentTerms || null,
    notes: form.header.notes || null,
    lines: form.lines.map((l) => ({
      prLineId: l.prLineId,
      itemCode: l.itemCode,
      itemName: l.itemName,
      qtyOrdered: l.qtyOrdered,
      uom: l.uom,
      unitPrice: l.unitPrice,
      siteCode: l.siteCode,
      requiredDate: l.requiredDate || null,
    })),
  };

  try {
    const created = await api.createPurchaseOrder(payload);
    router.push(`/purchase-orders/${created.id}`);
  } catch (err) {
    // 422 over-allocation and other rule violations surface here
    errorMessage.value = err.message || 'Failed to create purchase order.';
  } finally {
    submitting.value = false;
  }
}
</script>
