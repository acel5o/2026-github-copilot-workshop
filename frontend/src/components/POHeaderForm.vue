<template>
  <div class="card-panel">
    <p class="form-section-title">PO Header</p>
    <div class="form-row">
      <div class="form-group">
        <label>Vendor Name</label>
        <input
          :value="modelValue.vendorName"
          @input="emit('update:modelValue', { ...modelValue, vendorName: $event.target.value })"
          placeholder="Type..."
          required
        />
      </div>
      <div class="form-group">
        <label>PR Reference</label>
        <input
          :value="modelValue.prNumber"
          @input="emit('update:modelValue', { ...modelValue, prNumber: $event.target.value })"
          placeholder="e.g. PR-2026-0001"
          required
        />
      </div>
      <div class="form-group">
        <label>Expected Delivery Date</label>
        <input
          :value="modelValue.expectedDeliveryDate"
          @input="emit('update:modelValue', { ...modelValue, expectedDeliveryDate: $event.target.value })"
          type="date"
        />
      </div>
      <div class="form-group">
        <label>Payment Terms</label>
        <select
          :value="modelValue.paymentTerms"
          @change="emit('update:modelValue', { ...modelValue, paymentTerms: $event.target.value })"
        >
          <option value="">Select...</option>
          <option value="NET30">Net 30</option>
          <option value="NET60">Net 60</option>
          <option value="COD">Cash on Delivery</option>
          <option value="PREPAID">Prepaid</option>
        </select>
      </div>
    </div>
    <div class="form-group full">
      <label>Notes</label>
      <textarea
        :value="modelValue.notes"
        @input="emit('update:modelValue', { ...modelValue, notes: $event.target.value })"
        placeholder="Type..."
        rows="3"
      />
    </div>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
</script>
