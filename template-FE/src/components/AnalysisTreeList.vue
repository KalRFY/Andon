<template>
  <div class="tree-header">
    <h5>{{ title }}</h5>
    <CButton 
      color="primary" 
      size="sm" 
      @click="addRootItem"
      class="ms-2"
    >
      <CIcon icon="cil-plus"/>
      <label>Add item</label>
    </CButton>
  </div>
  
  <div class="tree-content">
    <TreeNode
      v-for="(item, index) in treeData"
      :key="item.id"
      :node="item"
      :level="0"
      @update:node="updateNode(index, $event)"
      @delete:node="deleteNode(index)"
      @add:child="addChild(index)"
      class="tree-node"
    />
  </div>
  <!-- <CCard class="analysis-tree-container">
  </CCard> -->
</template>

<script>
import { ref, watch } from 'vue'
import { CButton, CIcon } from '@coreui/vue'
import TreeNode from './TreeNode.vue'

export default {
  name: 'AnalysisTreeList',
  components: {
    CButton,
    CIcon,
    TreeNode,
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    title: {
      type: String,
      default: 'Analysis Tree'
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const treeData = ref([])

    const normalizeToTreeNode = (list) => {
      // Pastikan input adalah array
      if (!Array.isArray(list)) {
        return [];
      }
      return list.map((item) => {
        const safeItem = item || {};
        return {
          id: safeItem.id || safeItem.id || (Date.now() + Math.random().toString(36).slice(2, 9)),
          description: safeItem.description || safeItem.name || '',
          subItems: normalizeToTreeNode(safeItem.subItems || safeItem.children || [])
        };
      });
    }

    // Initialize tree data
    const initializeTree = () => {
      try {
        if (Array.isArray(props.modelValue) && props.modelValue.length > 0) {
          treeData.value = normalizeToTreeNode(props.modelValue)
        } else if (typeof props.modelValue === 'object' && props.modelValue !== null) {
          // Handle case where modelValue is an object instead of array
          treeData.value = [{
            id: generateId(),
            description: props.modelValue.description || '',
            subItems: normalizeToTreeNode(props.modelValue.subItems || props.modelValue.children || [])
          }]
        } else {
          treeData.value = [{
            id: generateId(),
            description: '',
            subItems: []
          }]
        }
      } catch (error) {
        console.error('Error initializing tree:', error)
        treeData.value = [{
          id: generateId(),
          description: '',
          subItems: []
        }]
      }
    }

    // Generate unique ID
    const generateId = () => {
      return Date.now() + Math.random().toString(36).substr(2, 9)
    }

    // Add root item
    const addRootItem = () => {
      treeData.value.push({
        id: generateId(),
        description: '',
        subItems: []
      })
      emitUpdate()
    }

    // Add child item
    const addChild = (parentIndex) => {
      if (!treeData.value[parentIndex].subItems) {
        treeData.value[parentIndex].subItems = []
      }
      treeData.value[parentIndex].subItems.push({
        id: generateId(),
        description: '',
        subItems: []
      })
      emitUpdate()
    }

    // Update node
    const updateNode = (index, updatedNode) => {
      treeData.value[index] = updatedNode
      emitUpdate()
    }

    // Delete node
    const deleteNode = (index) => {
      treeData.value.splice(index, 1)
      if (treeData.value.length === 0) {
        addRootItem()
      }
      emitUpdate()
    }

    // Update child node
    const updateChildNode = (parentIndex, childIndex, updatedNode) => {
      if (treeData.value[parentIndex]?.subItems?.[childIndex]) {
        treeData.value[parentIndex].subItems[childIndex] = updatedNode
        emitUpdate()
      }
    }

    // Delete child node
    const deleteChildNode = (parentIndex, childIndex) => {
      if (treeData.value[parentIndex]?.subItems) {
        treeData.value[parentIndex].subItems.splice(childIndex, 1)
        emitUpdate()
      }
    }

    // Emit update to parent
    const emitUpdate = () => {
      emit('update:modelValue', treeData.value)
    }

    // Watch for external changes
    watch(() => props.modelValue, initializeTree, { immediate: true })
    
    return {
      treeData,
      addRootItem,
      addChild,
      updateNode,
      deleteNode,
      updateChildNode,
      deleteChildNode,
    }
  }
}
</script>

<style scoped>
.analysis-tree-container {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 15px;
  background-color: #f8f9fa;
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #dee2e6;
}

.tree-content {
  max-height: 400px;
  overflow-y: auto;
}

.tree-node {
  margin-bottom: 10px;
}
</style>
