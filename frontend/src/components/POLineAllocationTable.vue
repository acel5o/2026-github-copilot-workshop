<template>
  <div class="card-panel">
    <div class="card-panel-header">
      <p class="form-section-title" style="margin: 0">Approved PR Lines</p>
      <button type="button" class="btn btn-outline" @click="addLine">+ Add Line</button>
    </div>
    <table>
      <thead>
        <tr>
          <th style="width: 40px; text-align: center">#</th>
          <th>Item Code</th>
          <th>Item Name</th>
          <th style="width: 80px">UOM</th>
          <th style="width: 110px">Req. QTY</th>
          <th style="width: 110px">Order QTY</th>
          <th style="width: 120px">Unit Price</th>
          <th>Site</th>
          <th style="width: 140px">Required Date</th>
          <th style="width: 50px"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="lines.length === 0">
          <td colspan="10" style="text-align: center; color: var(--text-muted); padding: 24px">
            No lines loaded. Select an approved PR in the header above.
          </td>
        </tr>
        <tr v-for="(line, index) in lines" :key="index">
          <td style="text-align: center; color: var(--text-muted); font-size: 12px">{{ index + 1 }}</td>
          <td>
            <input v-model="line.itemCode" placeholder="Type..." required />
          </td>
          <td>
            <input v-model="line.itemName" placeholder="Type..." required />
          </td>
          <td>
            <input v-model="line.uom" placeholder="PCS" required />
          </td>
          <td>
            <span class="qty-badge">{{ line.qtyRequested ?? line.qtyOrdered }}</span>
          </td>
          <td>
            <input
              v-model.number="line.qtyOrdered"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="0"
              required
            />
          </td>
          <td>
            <input
              v-model.number="line.unitPrice"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              required
            />
          </td>
          <td>
            <input v-model="line.siteCode" placeholder="Type..." required />
          </td>
          <td>
            <input v-model="line.requiredDate" type="date" />
          </td>
          <td style="text-align: center">
            <button
              type="button"
              class="btn-danger-icon"
              title="Remove line"
              @click="removeLine(index)"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.5 1.5h5M2 3.5h12M3.5 3.5l.75 9.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5l.75-9.5M6.5 6.5v4.5M9.5 6.5v4.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  lines: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(['update:lines']);

const totalAmount = computed(() =>
  props.lines.reduce((sum, l) => sum + (l.qtyOrdered || 0) * (l.unitPrice || 0), 0)
);

function emptyLine() {
  return {
    prLineId: '',
    itemCode: '',
    itemName: '',
    qtyOrdered: 1,
    uom: 'PCS',
    unitPrice: 0,
    siteCode: '',
    requiredDate: '',
  };
}

function addLine() {
  emit('update:lines', [...props.lines, emptyLine()]);
}

function removeLine(index) {
  const updated = props.lines.filter((_, i) => i !== index);
  emit('update:lines', updated);
}
</script>
