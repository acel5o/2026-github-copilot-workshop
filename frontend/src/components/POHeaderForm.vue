<template>
  <div class="card-panel">
    <p class="form-section-title">PO Header</p>
    <div class="form-row">
      <div class="form-group">
        <label>Vendor</label>
        <input
          :value="modelValue.vendorName"
          @input="emit('update:modelValue', { ...modelValue, vendorName: $event.target.value })"
          placeholder="Type..."
          required
        />
      </div>
      <div class="form-group">
        <label>Arrival by date</label>
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
      <div class="form-group">
        <label>PR Reference</label>
        <select
          :value="modelValue.prId"
          @change="onPrChange($event.target.value)"
          required
        >
          <option value="">Select approved PR...</option>
          <option v-for="pr in approvedPrs" :key="pr.id" :value="pr.id">
            {{ pr.prNumber }}
          </option>
        </select>
      </div>
    </div>
    <div class="form-group full">
      <label>Note</label>
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
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  approvedPrs: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['update:modelValue', 'prSelected']);

function onPrChange(prId) {
  const pr = props.approvedPrs.find((p) => p.id === prId);
  emit('update:modelValue', { ...props.modelValue, prId, prNumber: pr?.prNumber || '' });
  emit('prSelected', prId);
}
</script>
