<template>
  
  <CModal 
  :visible="visible"
  @close="$emit('close')"
  fullscreen
  aria-labelledby="LiveDemoExampleLabel"
  >
    <CModalHeader>
      <CModalTitle id="LiveDemoExampleLabel">Edit Problem</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CForm 
        class="row g-3 needs-validation" 
        novalidate 
        :validated="validatedCustom01" 
        @submit="handleSubmitCustom01"
      >
        <!-- <CCol md="8">
          <CFormInput
            feedbackValid="Looks good!"
            id="machineName"
            label="Machine Name"
            required
            v-model="submit.machineName"
          />
        </CCol> -->
        <CCol md="6">
          <label for="machineSelect" class="form-label">Machine Name</label>
          <Treeselect
            id="machineSelect"
            v-model="localSubmit.machineName"
            :options="machineOptions"
            :searchable="true"
            :clearable="true"
            :children="false"
            placeholder="Select or input machine"
            @input="onMachineInput"
          :value-consists-of="['id']"
          :value-key="'id'"
          :label-key="'label'"
          />
        </CCol>
        <CCol md="6">
          <label for="lineSelect" class="form-label">Line</label>
          <Treeselect
            id="lineSelect"
            v-model="localSubmit.line"
            :multiple="false"
            :flat="true"
            :options="lineOptions"
            :searchable="true"
            :clearable="true"
            placeholder="Select or input line"
            @input="onMachineInput"
            :value-consists-of="['id']"
            :value-key="'id'"
            :label-key="'label'"
          />
        </CCol>
        <!-- <CCol md="4">
            <CFormSelect
              aria-describedby="validationCustom04Feedback"
              feedbackInvalid="Please select the line."
              id="lineSelect"
              label="Line"
              required
              v-model="submit.line"
            >
              <option selected disabled value="">Choose Line...</option>
              <option v-for="line in lines" :key="line.fid" :value="line.fline">{{ line.fline }}</option>
            </CFormSelect>
        </CCol> -->
        <CCol md="6">
          <CFormInput 
            feedbackInvalid="Operation No."
            id="Problems"
            label="Operation No."
            required
            v-model="fidProblem"
          />
        </CCol>
        <CCol md="6">
          <CFormInput 
            feedbackInvalid="Maker"
            id="Problems"
            label="Maker"
            required
            v-model="maker"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Problems"
            required
            v-model="problems"
          />
        </CCol>
        <CCol md="8">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Uraian Kejadian"
            required
            v-model="uraianKejadian"
          />
        </CCol>
        <CCol md="4">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Upload Image"
            required
            v-model="uploadImage"
          />
        </CCol>
        <CCol md="8">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Ilustrasi Standart"
            required
            v-model="ilustrasiStandart"
          />
        </CCol>
        <CCol md="4">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Standart Image"
            required
            v-model="standartImage"
          />
        </CCol>
        <CCol md="8">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Ilustrasi Actual"
            required
            v-model="ilustrasiActual"
          />
        </CCol>
        <CCol md="4">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Actual Image"
            required
            v-model="actualImage"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Gap Between Standar and Actual"
            required
            v-model="gapBetweenStandarAndActual"
          />
        </CCol>
        <CCol md="8">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Pilih Focus Thema Member"
            required
            v-model="pilihFocusThemaMember"
          />
        </CCol>
        <CCol md="4">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Pilih Taskforce"
            required
            v-model="pilihTaskforce"
          />
        </CCol>
        <CCol md="12">
          <label for="operatorSelect" class="form-label">Operator</label>
          <Treeselect
            id="operatorSelect"
            v-model="localSubmit.operator"
            :multiple="true"
            :flat="true"
            :options="memberOption"
            :searchable="true"
            :clearable="true"
            placeholder="Select or input member"
            @input="onMachineInput"
            :value-consists-of="['id']"
            :value-key="'id'"
            :label-key="'label'"
          />
        </CCol>
        <CCol md="6">
          <CFormSelect
              aria-describedby="avCategory"
              feedbackInvalid="Please select the AV Category."
              id="avCategorySelect"
              label="AV Category"
              required
              v-model="avCategory"
            >
              <option :value="avCategory" selected>{{ avCategory }}</option>
              <option disabled value="">Choose AV Category...</option>
              <option value="1">MESIN</option>
              <option value="2">DIES</option>
              <option value="3">TOOL</option>
              <option value="4">COOLANT</option>
          </CFormSelect>
        </CCol>
        <CCol md="6">
          <CFormSelect
              aria-describedby="shift"
              feedbackInvalid="Please select the shift."
              id="shiftSelect"
              label="O6 Category:"
              required
              v-model="fshift"
            >
              <option :value="shift" selected>{{ shiftName }}</option>
              <option disabled value="">Choose shift</option>
              <option value="r">Red</option>
              <option value="w">White</option>
              <option value="">No Shift</option>
          </CFormSelect>
        </CCol>
        <CCol md="6">
          <label for="startDateModal" class="form-label">Start Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
            <CFormInput
              id="startDateModal"
              type="date"
              required
              v-model="startDateProblem"
              aria-label="Start Date"
              aria-describedby="basic-addon1"
            />
          </CInputGroup>
        </CCol>
        <CCol md="6">
          <label for="finishDateModal" class="form-label">Finish Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon2"><Clock size="16" /></CInputGroupText>
            <CFormInput
              id="finishDateModal"
              type="date"
              required
              v-model="finishDateProblem"
              aria-label="Finish Date"
              aria-describedby="basic-addon2"
            />
          </CInputGroup>
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Duration (min)"
            required
            v-model="durationMin"
          />
        </CCol>

        <CCol md="12">
          <CFormSelect
              aria-describedby="problemCategory"
              feedbackInvalid="Please select the problem category."
              id="problemCategorySelect"
              label="Problem Category:"
              required
              v-model="problemCategory"
            >
              <option :value="problemCategory" selected>{{ problemCategoryName }}</option>
              <option disabled value="">Choose problem Category...</option>
              <option :value="1">Small</option>
              <option :value="2">Chokotei</option>
              <option :value="3">LTB</option>
          </CFormSelect>
        </CCol>

        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Item Temporary Action"
            required
            v-model="itemTemporaryAction"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Rootcauses 5 Why (Kenapa Terjadi)"
            required
            v-model="rootcauses5Why"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Tambah Analysis TERJADI"
            required
            v-model="tambahAnalysisTerjadi"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="5 Why (Kenapa Terjadi) Image"
            required
            v-model="whyImage"
          />
        </CCol>
        <CCol md="12">
          <CFormSelect
              aria-describedby="O6 Category"
              feedbackInvalid="Please select the O6 Category."
              id="o6CategorySelect"
              label="O6 Category:"
              required
              v-model="oCategory"
            >
              <option :value="oCategory" selected>{{ oCategoryName }}</option>
              <option disabled value="">Choose problem 06 Category...</option>
              <option :value="1">O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))</option>
              <option :value="2">O2: Henkaten Issue (No Enough Trial, No Confirm (others team))</option>
              <option :value="3">O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)</option>
              <option :value="4">O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)</option>
              <option :value="5">O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))</option>
              <option :value="6">O6: Lifetime Issue (Out of Standard Running, Over Capacity)</option>
          </CFormSelect>
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Step Repair"
            required
            v-model="stepRepair"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Part Change"
            required
            v-model="partChange"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Countermeasure (kenapa terjadi)"
            required
            v-model="countermeasureKenapaTerjadi"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Yokoten"
            required
            v-model="yokoten"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Rootcause 5 Why (kenapa lama)"
            required
            v-model="rootcause5WhyKenapaLama"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Tambah Analisis LAMA"
            required
            v-model="tambahAnalisisLama"
          />
        </CCol>
        <CCol md="12">
          <CFormSelect
              aria-describedby="Q6 Category"
              feedbackInvalid="Please select the Q6 Category."
              id="q6CategorySelect"
              label="Q6 Category:"
              required
              v-model="qCategory"
            >
              <option :value="qCategory" selected>{{ qCategoryName }}</option>
              <option disabled value="">Choose problem Q6 Category...</option>
              <option :value="1">Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))</option>
              <option :value="2">Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)</option>
              <option :value="3">Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)</option>
              <option :value="4">Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)</option>
              <option :value="5">Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))</option>
              <option :value="6">Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)</option>
          </CFormSelect>
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="5 Why (Kenapa Lama) Image"
            required
            v-model="whyLamaImage"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Countermeasure (kenapa Lama)"
            required
            v-model="countermeasureKenapaLama"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Attachment Meeting"
            required
            v-model="attachmentMeeting"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Comments 5 Why"
            required
            v-model="comments5Why"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Comments Countermeasure"
            required
            v-model="commentsCountermeasure"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Last Report File"
            required
            v-model="lastReportFile"
          />
        </CCol>
        <CCol md="12">
          <CFormInput 
            feedbackInvalid="Please input the problems"
            id="Problems"
            label="Upload File"
            required
            v-model="uploadFile"
          />
        </CCol>
        <CCol xs="12">
          <CFormCheck
            feedbackInvalid="You must agree before submitting."
            id="invalidCheck"
            label="Agree to terms and conditions"
            required
            type="checkbox"
            v-model="agreeTerms"
          />
        </CCol>
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLiveDemo = false }">
        Close
      </CButton>

      <CButton color="primary" @click="saveSubmit">Submit</CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref, watch, toRefs } from 'vue'
import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CForm, CCol, CFormInput, CFormCheck, CButton } from '@coreui/vue'
import Treeselect from 'vue3-treeselect'

export default {
  name: 'EditProblemModal',
  components: {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CCol,
    CFormInput,
    CFormCheck,
    CButton,
    Treeselect
  },
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    submitData: {
      type: Object,
      required: false,
      default: () => ({})
    },
    machineOptions: {
      type: Array,
      default: () => []
    },
    lineOptions: {
      type: Array,
      default: () => []
    }
  },
setup(props, { emit }) {
    const { submitData } = toRefs(props)
    // Defensive initialization to avoid undefined errors
    const localSubmit = ref({ ...submitData.value || {} })

    watch(submitData, (newVal) => {
      localSubmit.value = { ...newVal || {} }
    })

    const validatedCustom01 = ref(false)

    const onMachineInput = () => {
      // Placeholder for any input handling
    }

    const handleSubmit = () => {
      validatedCustom01.value = true
      saveSubmit()
    }

    const saveSubmit = () => {
      if(!localSubmit.value || !localSubmit.value.machineName){
        alert("Please input machine name");
        return;
      }
      if(!localSubmit.value.line){
        alert("Please input line");
        return;
      }
      if(!localSubmit.value.problems){
        alert("Please input problems");
        return;
      }
      if(!localSubmit.value.agreeTerms){
        alert("You must agree to terms and conditions before submitting");
        return;
      }
      emit('submit', localSubmit.value)
    }

    return {
      localSubmit,
      validatedCustom01,
      onMachineInput,
      handleSubmit,
      saveSubmit
    }
  }
}
</script>
