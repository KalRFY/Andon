<template>
  <div class="tree-node" :style="{ marginLeft: level * 20 + 'px' }">
    <div class="node-content">
      <div class="node-input-group">
        <CButton 
          v-if="level < 3"
          color="secondary" 
          size="sm" 
          class="me-2"
          @click="toggleChildren"
        >
          <CIcon :icon="showChildren ? 'cil-minus' : 'cil-plus'" />
        </CButton>
        
        <CFormTextarea
          v-model="localNode.description"
          placeholder="Enter description"
          class="node-input"
          @input="updateNode"
          style="font-size: small;"
        />
        
        <CButton 
          color="danger" 
          size="sm" 
          class="ms-2"
          @click="$emit('delete:node')"
        >
          <CIcon icon="cil-trash" />
        </CButton>
      </div>
      <div class="node-actions">
        <CButton 
          v-if="level < 3"
          color="success" 
          size="sm" 
          @click="addChild"
          class="add-child-btn"
        >
          <CIcon style="color: white;" icon="cil-plus"/>
          <label style="color: white;"> Add Child</label>
        </CButton>
      </div>
    </div>
    
    <div v-if="showChildren && localNode.subItems && localNode.subItems.length" class="children-container">
      <TreeNode
        v-for="(child, index) in localNode.subItems"
        :key="child.id"
        :node="child"
        :level="level + 1"
        @update:node="updateChild(index, $event)"
        @delete:node="deleteChild(index)"
        @add:child="addGrandchild(index)"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch } from 'vue'
import { CButton, CFormInput, CIcon } from '@coreui/vue'

export default {
  name: 'TreeNode',
  components: {
    CButton,
    CFormInput,
    CIcon,
  },
  props: {
    node: {
      type: Object,
      required: true
    },
    level: {
      type: Number,
      default: 0
    }
  },
  emits: ['update:node', 'delete:node', 'add:child'],
  setup(props, { emit }) {
    const localNode = ref({ ...props.node })
    const showChildren = ref(true)

    watch(() => props.node, (newNode) => {
      localNode.value = { ...newNode }
    }, { deep: true })

    const updateNode = () => {
      emit('update:node', localNode.value)
    }

    const addChild = () => {
      if (!localNode.value.subItems) {
        localNode.value.subItems = []
      }
      localNode.value.subItems.push({
        id: Date.now() + Math.random().toString(36).substr(2, 9),
        description: '',
        subItems: []
      })
      updateNode()
    }

    const updateChild = (index, updatedChild) => {
      if (localNode.value.subItems && localNode.value.subItems[index]) {
        localNode.value.subItems[index] = updatedChild
        updateNode()
      }
    }

    const deleteChild = (index) => {
      if (localNode.value.subItems) {
        localNode.value.subItems.splice(index, 1)
        updateNode()
      }
    }

    const addGrandchild = (childIndex) => {
      if (localNode.value.subItems && localNode.value.subItems[childIndex]) {
        if (!localNode.value.subItems[childIndex].subItems) {
          localNode.value.subItems[childIndex].subItems = []
        }
        localNode.value.subItems[childIndex].subItems.push({
          id: Date.now() + Math.random().toString(36).substr(2, 9),
          description: '',
          subItems: []
        })
        updateNode()
      }
    }

    const toggleChildren = () => {
      showChildren.value = !showChildren.value
    }

    return {
      localNode,
      showChildren,
      updateNode,
      addChild,
      updateChild,
      deleteChild,
      addGrandchild,
      toggleChildren
    }
  }
}
</script>

<style scoped>
.tree-node {
  margin-bottom: 10px;
  border: 1px solid #e9ecef;
  border-radius: 4px;
  padding: 10px;
  background-color: white;
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.node-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.node-input {
  flex: 1;
  min-width: 200px;
}

.node-actions {
  display: flex;
  justify-content: flex-end;
}

.add-child-btn {
  font-size: 12px;
}

.children-container {
  margin-top: 10px;
  padding-left: 20px;
  border-left: 2px solid #e9ecef;
}
</style>
