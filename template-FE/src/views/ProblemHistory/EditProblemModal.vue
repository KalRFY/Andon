<template>
  
  <CModal
    :visible="visible"
    @close="$emit('close')"
    fullscreen
    backdrop="static"
    aria-labelledby="LiveDemoExampleLabel"
  >
    <CModalHeader class="mb-3">
      <CModalTitle id="LiveDemoExampleLabel">Edit Problem</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <div v-if="modalLoading" style="text-align: center; padding: 40px 0">
        <CSpinner color="primary" style="width: 3rem; height: 3rem" />
        <div style="margin-top: 10px">Loading data...</div>
      </div>
      <CRow class="mb-3">
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" for="machineSelect" class="form-label">Machine Name</label>
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
          <label style="font-size: medium; font-weight: bold;" for="lineSelect" class="form-label">Line</label>
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
      </CRow>
      <CRow class="mb-3">
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" class="form-label">Operation No.</label>
          <CFormInput
            feedbackInvalid="Operation No."
            id="Problems"
            placeholder="Not yet inputted"
            required
            disabled
            v-model="localSubmit.operationNo"
          />
        </CCol>
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" class="form-label">Maker</label>
          <CFormInput
            feedbackInvalid="Maker"
            id="Problems"
            placeholder="Not yet inputted"
            required
            disabled
            v-model="localSubmit.maker"
          />
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <label style="font-size: medium; font-weight: bold;" class="form-label">Problems</label>
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            placeholder="Not yet inputted"
            required
            v-model="localSubmit.problems"
          />
        </CCol>
      </CRow>

      <CRow class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol md="8">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Uraian Kejadian</label>
                  <CFormInput
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    placeholder="Not yet inputted"
                    required
                    v-model="localSubmit.uraianKejadian"
                  />
                </CCol>
                <CCol md="4">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Upload Image</label>
                  <CFormInput
                    type="file"
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    required
                    @change="onFileChange($event, 'uploadImage')"
                  />
                  <img
                    :src="displayUploadImgImage"
                    width="200"
                    style="cursor: pointer;"
                    v-if="displayUploadImgImage"
                    @click="showFullSizeImageUpload = true"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        :visible="showFullSizeImageUpload"
        @update:visible="val => showFullSizeImageUpload = val"
        @close="showFullSizeImageUpload = false"
        size="lg"
        aria-labelledby="fullSizeImageLabel"
        centered
      >
        <CModalHeader>
          <CModalTitle id="fullSizeImageLabel">Upload Image Preview</CModalTitle>
        </CModalHeader>

        <CModalBody style="text-align: center;">
          <img :src="displayUploadImgImage" style="max-width: 100%; max-height: 80vh;" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" size="sm" @click="showFullSizeImageUpload = false">Close</CButton>
        </CModalFooter>
        
      </CModal>

      <CRow class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol md="8">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Ilustrasi Standart</label>
                  <CFormInput
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    placeholder="Not yet inputted"
                    required
                    v-model="localSubmit.ilustrasiStandart"
                  />
                </CCol>
                <CCol md="4">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Standart Image</label>
                  <CFormInput
                    type="file"
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    required
                    @change="onFileChange($event, 'standartImage')"
                  />
                  <img
                    :src="displayStandardImage"
                    width="200"
                    style="cursor: pointer;"
                    v-if="displayStandardImage"
                    @click="showFullSizeImageStandart = true"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        :visible="showFullSizeImageStandart"
        @update:visible="val => showFullSizeImageStandart = val"
        @close="showFullSizeImageStandart = false"
        size="lg"
        aria-labelledby="fullSizeImageStandartLabel"
        centered
      >
        <CModalHeader>
          <CModalTitle id="fullSizeImageStandartLabel">Standart Image Preview</CModalTitle>
        </CModalHeader>

        <CModalBody style="text-align: center;">
          <img :src="displayStandardImage" style="max-width: 100%; max-height: 80vh;" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" size="sm" @click="showFullSizeImageStandart = false">Close</CButton>
        </CModalFooter>
      </CModal>

      <CRow class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol md="8">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Ilustrasi Actual</label>
                  <CFormInput
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    placeholder="Not yet inputted"
                    required
                    v-model="localSubmit.ilustrasiActual"
                  />
                </CCol>
                <CCol md="4">
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Actual Image</label>
                  <CFormInput
                    type="file"
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    required
                    @change="onFileChange($event, 'actualImage')"
                  />
                  <img
                    :src="displayActualImage"
                    width="200"
                    style="cursor: pointer;"
                    v-if="displayActualImage"
                    @click="showFullSizeImageActual = true"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        :visible="showFullSizeImageActual"
        @update:visible="val => showFullSizeImageActual = val"
        @close="showFullSizeImageActual = false"
        size="lg"
        aria-labelledby="fullSizeImageActualLabel"
        centered
      >
        <CModalHeader>
          <CModalTitle id="fullSizeImageActualLabel">Actual Image Preview</CModalTitle>
        </CModalHeader>

        <CModalBody style="text-align: center;">
          <img :src="displayActualImage" style="max-width: 100%; max-height: 80vh;" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" size="sm" @click="showFullSizeImageActual = false">Close</CButton>
        </CModalFooter>
      </CModal>

      <CRow md="12" class="mb-3">
        <CCol>
          <label style="font-size: medium; font-weight: bold;" class="form-label">Gap Between Standar and Actual</label>
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            placeholder="Not yet inputted"
            required
            v-model="localSubmit.gapBetweenStandarAndActual"
          />
        </CCol>
      </CRow>
      <!-- <CRow class="mb-3">
        <CCol md="8">
          <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Pilih Focus Thema Member"
            placeholder="Not yet inputted" required v-model="localSubmit.pilihFocusThemaMember" />
        </CCol>
        <CCol md="4">
          <CFormInput feedbackInvalid="Please input the problems" id="Problems" label="Pilih Taskforce"
            placeholder="Not yet inputted" required v-model="localSubmit.pilihTaskforce" />
        </CCol>
      </CRow> -->
      <CRow md="12" class="mb-3">
        <CCol>
          <label style="font-size: medium; font-weight: bold;" for="operatorSelect" class="form-label">Operator</label>
        <Treeselect
          id="operatorSelect"
          v-model="localSubmit.operator"
          :multiple="true"
          :flat="true"
          :options="filteredMemberOption"
          :searchable="true"
          :clearable="true"
          placeholder="Select or input member"
          @input="onMachineInput"
          :value-consists-of="['id']"
          :value-key="'id'"
          :label-key="'label'"
        />
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" class="form-label">AV Category</label>
          <CFormSelect
            aria-describedby="avCategory"
            feedbackInvalid="Please select the AV Category."
            id="avCategorySelect"
            required
            v-model="localSubmit.avCategory"
          >
            <option disabled value="">Choose AV Category...</option>
            <option value="MESIN">MESIN</option>
            <option value="DIES">DIES</option>
            <option value="TOOL">TOOL</option>
            <option value="COOLANT">COOLANT</option>
          </CFormSelect>
        </CCol>
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" class="form-label">Shift</label>
          <CFormSelect
            aria-describedby="shift"
            feedbackInvalid="Please select the shift."
            id="shiftSelect"
            required
            v-model="localSubmit.shift"
          >
            <option :value="localSubmit.shift" selected>
              {{ shiftName }}
            </option>
            <option disabled value="">Choose shift</option>
            <option value="r">Red</option>
            <option value="w">White</option>
            <option value="">No Shift</option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CRow class="mb-3">
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" for="startDateModal" class="form-label">Start Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon1">
              <CIcon icon="cilClock" size="l" />
            </CInputGroupText>
            <CFormInput id="startDateModal" type="datetime-local" required v-model="localSubmit.startDate"
              aria-label="Start Date" aria-describedby="basic-addon1" />
          </CInputGroup>
        </CCol>
        <CCol md="6">
          <label style="font-size: medium; font-weight: bold;" for="finishDateModal" class="form-label">Finish Date</label>
          <CInputGroup>
            <CInputGroupText id="basic-addon2">
              <CIcon icon="cilClock" size="l" />
            </CInputGroupText>
            <CFormInput id="finishDateModal" type="datetime-local" required v-model="localSubmit.finishDate"
              aria-label="Finish Date" aria-describedby="basic-addon2" />
          </CInputGroup>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <label style="font-size: medium; font-weight: bold;" class="form-label">Duration (min)</label>
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            placeholder="Not yet inputted"
            required
            v-model="localSubmit.durationMin"
            disabled
          />
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <label style="font-size: medium; font-weight: bold;" class="form-label">Problem Category:</label>
        <CCol>
          <CFormSelect
            aria-describedby="problemCategory"
            feedbackInvalid="Please select the problem category."
            id="problemCategorySelect"
            required
            v-model="localSubmit.problemCategory"
          >
            <option :value="localSubmit.problemCategory" selected>
              {{ problemCategoryName }}
            </option>
            <option disabled value="">Choose problem Category...</option>
            <option :value="1">Small</option>
            <option :value="2">Repeat (Problem yang sama terjadi lebih dari 2 kali dalam sehari)</option>
            <option :value="3">LTR
              (Casting: Durasi antara 120 hingga 659 menit.
              Machining: Durasi antara 120 hingga 359 menit.
              Assy (Assembly): Durasi antara 15 hingga 179 menit.)
            </option>
            <option :value="4">SLTR
              (Casting: Durasi lebih dari 659 menit.
              Machining: Durasi lebih dari 359 menit.
              Assy (Assembly): Durasi lebih dari 179 menit.)
            </option>
          </CFormSelect>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <label style="font-size: medium; font-weight: bold;" class="form-label">Item Temporary Action</label>
          <CFormInput
            feedbackInvalid="Please input the problems"
            id="Problems"
            placeholder="Not yet inputted"
            required
            v-model="localSubmit.itemTemporaryAction"
          />
        </CCol>
      </CRow>
      <!-- <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Rootcause 5 Why (Kenapa Terjadi)</label>
                  <CTable bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style="width: 50px">No</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell style="width: 120px"
                          >Actions</CTableHeaderCell
                        >
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow
                        v-for="(item, index) in localSubmit.rootcauses5Why"
                        :key="item.id"
                      >
                        <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            v-model="item.description"
                            placeholder="Enter description"
                            :disabled="
                              editingRootcauses?.[item.id] === 'locked' ||
                              !editingRootcauses?.[item.id]
                            "
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            class="me-2"
                            @click="editRootcause(index)"
                          >
                            <CIcon
                              :icon="
                                editingRootcauses?.[item.id]
                                  ? 'cil-paper-plane'
                                  : 'cil-pencil'
                              "
                            />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            @click="deleteRootcause(index)"
                          >
                            <CIcon icon="cil-trash" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                  <CButton
                    color="success"
                    size="sm"
                    class="mt-2"
                    style="color: white"
                    @click="addRootcause"
                    v-if="localSubmit.rootcauses5Why.length < 5"
                  >
                    Add Rootcause
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow> -->
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CCol>
                <AnalysisTreeList
                  v-model="localSubmit.tambahAnalysisTerjadi"
                  title="Tambah Analisis TERJADI O6"
                />
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CCol>
                <AnalysisTreeList
                  v-model="localSubmit.tambahAnalisisLama"
                  title="Tambah Analisis LAMA Q6"
                />
              </CCol>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">5 Why (Kenapa Terjadi) Image</label>
                  <CFormInput
                    type="file"
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    required
                    @change="onFileChange($event, 'whyImage')"
                  />
                  <img
                    :src="displayImg_problem"
                    width="200"
                    style="cursor: pointer;"
                    v-if="displayImg_problem"
                    @click="showFullSizeImage = true"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        :visible="showFullSizeImage"
        @update:visible="val => showFullSizeImage = val"
        @close="showFullSizeImage = false"
        size="lg"
        aria-labelledby="fullSizeImageLabel"
        centered
      >
        <CModalHeader>
          <CModalTitle id="fullSizeImageLabel">5 Why (Kenapa Terjadi) Image Preview</CModalTitle>
        </CModalHeader>

        <CModalBody style="text-align: center;">
          <img :src="displayImg_problem" style="max-width: 100%; max-height: 80vh;" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" size="sm" @click="showFullSizeImage = false">Close</CButton>
        </CModalFooter>
        
      </CModal>

      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">5 Why (Kenapa Lama) Image</label>
                  <CFormInput
                    type="file"
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    required
                    @change="onFileChange($event, 'whyLamaImage')"
                  />
                  <img
                    :src="displayWhyLamaImage"
                    width="200"
                    style="cursor: pointer;"
                    v-if="displayWhyLamaImage"
                    @click="showFullSizeImageLama = true"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        :visible="showFullSizeImageLama"
        @update:visible="val => showFullSizeImageLama = val"
        @close="showFullSizeImageLama = false"
        size="lg"
        aria-labelledby="fullSizeImageLabel"
        centered
      >
        <CModalHeader>
          <CModalTitle id="fullSizeImageLabel">5 Why (Kenapa Lama) Image Preview</CModalTitle>
        </CModalHeader>

        <CModalBody style="text-align: center;">
          <img :src="displayWhyLamaImage" style="max-width: 100%; max-height: 80vh;" />
        </CModalBody>

        <CModalFooter>
          <CButton color="secondary" size="sm" @click="showFullSizeImageLama = false">Close</CButton>
        </CModalFooter>
        
      </CModal>
      
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow md="12" class="mb-3">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <label style="font-size: medium; font-weight: bold;" class="form-label">O6 Category:</label>
                          <CFormSelect
                            aria-describedby="O6 Category"
                            feedbackInvalid="Please select the O6 Category."
                            id="o6CategorySelect"
                            required
                            v-model="localSubmit.oCategory"
                          >
                            <option :value="localSubmit.oCategory" selected>
                              {{ oCategoryName }}
                            </option>
                            <option disabled value="">Choose problem 06 Category...</option>
                            <option :value="1">
                              O1: Design & Installation (Design / Installation Not Good
                              (Refers to Function Check / Eng. Memo))
                            </option>
                            <option :value="2">
                              O2: Henkaten Issue (No Enough Trial, No Confirm (others team))
                            </option>
                            <option :value="3">
                              O3: PM Issue (No Have/Unclear, Unclear Methode,
                              Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)
                            </option>
                            <option :value="4">
                              O4: Symptom (No Have Symptom, Have Symptom but Unfollow
                              Activity)
                            </option>
                            <option :value="5">
                              O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible
                              Area, Unpredictable (water leak / crush))
                            </option>
                            <option :value="6">
                              O6: Lifetime Issue (Out of Standard Running, Over Capacity)
                            </option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow md="12" class="mb-3">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <label style="font-size: medium; font-weight: bold;" class="form-label">Q6 Category:</label>
                          <CFormSelect
                            aria-describedby="Q6 Category"
                            feedbackInvalid="Please select the Q6 Category."
                            id="q6CategorySelect"
                            required
                            v-model="localSubmit.qCategory"
                          >
                            <option :value="localSubmit.qCategory" selected>
                              {{ qCategoryName }}
                            </option>
                            <option disabled value="">Choose problem Q6 Category...</option>
                            <option :value="1">
                              Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))
                            </option>
                            <option :value="2">
                              Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)
                            </option>
                            <option :value="3">
                              Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)
                            </option>
                            <option :value="4">
                              Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)
                            </option>
                            <option :value="5">
                              Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))
                            </option>
                            <option :value="6">
                              Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)
                            </option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
              <CRow md="12">
                <CCol>
                  <CCard>
                    <CCardBody>
                      <CRow>
                        <CCol>
                          <label style="font-size: medium; font-weight: bold;" class="form-label">PM6 Category:<span v-if="localSubmit.oCategory === '3'" style="color: red;">*</span></label>
                          <CFormSelect
                            aria-describedby="PM Category"
                            feedbackInvalid="Please select the PM Category."
                            id="pmCategorySelect"
                            :required="localSubmit.oCategory === '3'"
                            :disabled="pmCategoryDisabled"
                            :class="{ 'is-invalid': pmCategoryInvalid }"
                            v-model="localSubmit.pmCategory"
                          >
                            <option :value="localSubmit.pmCategory" selected>
                              {{ pmCategoryName }}
                            </option>
                            <option disabled value="">Choose problem PM Category...</option>
                            <option :value="1">
                              PM1: No Have / Unclear Item
                            </option>
                            <option :value="2">
                              PM2: Un-clear Method
                            </option>
                            <option :value="3">
                              PM3: Confine / Invinsible Area
                            </option>
                            <option :value="4">
                              PM4: Out of Period Check
                            </option>
                            <option :value="5">
                              PM5: No Have Time
                            </option>
                            <option :value="6">
                              PM6: Lack of Skill
                            </option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <!-- Step Repair New - Primary Section -->
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard class="border-primary">
            <CCardBody class="pb-2">
              <CRow>
                <CCol>
                  <div class="d-flex align-items-center mb-3">
                    <CIcon icon="cil-star" class="text-primary me-2" />
                    <label style="font-size: large; font-weight: bold; color: #0d6efd;" class="form-label mb-0">Step Repair New (Primary)</label>
                    <small class="text-muted ms-2">- Main step repair tracking with detailed timing</small>
                  </div>
                  <StepRepairTable
                    v-model="localSubmit.stepRepairNew"
                    title="Step Repair New"
                    :max-items="15"
                    @validation-change="onStepRepairValidationChange"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <!-- Step Repair Old - Hidden unless has data -->
      <CRow md="12" class="mb-3" v-if="hasLegacyStepRepairData">
        <CCol>
          <CCard class="mb-3 border-warning">
            <CCardBody class="pb-2">
              <CRow>
                <CCol>
                  <div class="d-flex align-items-center mb-3">
                    <CIcon icon="cil-history" class="text-warning me-2" />
                    <label style="font-size: medium; font-weight: bold; color: #fd7e14;" class="form-label mb-0">Step Repair (Legacy Data)</label>
                    <small class="text-muted ms-2">- Legacy format (hidden when empty)</small>
                  </div>
                  <CTable bordered>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell style="width: 50px">No</CTableHeaderCell>
                        <CTableHeaderCell>Description</CTableHeaderCell>
                        <CTableHeaderCell style="width: 120px">Actions</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      <CTableRow
                        v-for="(item, index) in localSubmit.stepRepair"
                        :key="item.id"
                      >
                        <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                        <CTableDataCell>
                          <CFormInput
                            type="text"
                            v-model="item.stepDesc"
                            placeholder="Enter description"
                            :disabled="!editingStepRepair || !editingStepRepair[item.id]"
                          />
                        </CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="primary"
                            size="sm"
                            class="me-2"
                            @click="editStepRepair(index)"
                          >
                            <CIcon
                              :icon="editingStepRepair && editingStepRepair[localSubmit.stepRepair[index].id] === true ? 'cil-paper-plane' : 'cil-pencil'"
                            />
                          </CButton>
                          <CButton
                            color="danger"
                            size="sm"
                            @click="deleteStepRepair(index)"
                          >
                            <CIcon icon="cil-trash" />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                  <CButton
                    color="success"
                    size="sm"
                    class="mt-2"
                    style="color: white"
                    @click="addStepRepair"
                    v-if="localSubmit.stepRepair.length < 5"
                  >
                    Add Step Repair
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <!-- <CRow md="12" class="mb-3">
        <CCol>
                  <StepRepairTable
                    v-model="localSubmit.stepRepairNew"
                    title="Step Repair New"
                    :max-items="15"
                    @validation-change="onStepRepairValidationChange"
                  />
        </CCol>
      </CRow> -->
      <CRow md="12" class="mb-3" v-if="localSubmit.partChange && localSubmit.partChange.trim() !== ''">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Part Change</label>
                  <CFormInput
                    feedbackInvalid="Please input the problems"
                    id="Problems"
                    placeholder="Not yet inputted"
                    required
                    v-model="localSubmit.partChange"
                  />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <label style="font-size: medium; font-weight: bold;" class="form-label">Sparepart</label>
              <div v-if="sparepart_list.length === 0">
                <CButton class="mb-3" color="primary" @click="toggleSparepartForm">Tambah Sparepart</CButton>
              </div>
              <div v-if="showSparepartForm" class="mb-3">
                <CRow class="g-2 align-items-center">
                  <CCol md="4">
                    <CFormSelect
                      label="Is New Part*"
                      v-model="sparepartForm.newPart"
                    >
                      <option value="0">NO</option>
                      <option value="1">YES</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md="4">
                    <div v-if="sparepartForm.newPart === '1'">
                      <CFormInput
                        label="Sparepart*"
                        v-model="sparepartForm.sparepart"
                        placeholder="Enter sparepart name"
                      />
                    </div>
                    <div v-else>
                      <label class="form-label">Sparepart*</label>
                      <Multiselect
                        id="sparepartSelect"
                        v-model="sparepartForm.sparepart"
                        :options="sparepartOptions"
                        :searchable="true"
                        :close-on-select="true"
                        :show-labels="false"
                        placeholder="Type to search sparepart..."
                        track-by="value"
                        label="text"
                        @search-change="handleSparepartSearch"
                        @input="onSparepartSelect"
                        :max-height="300"
                        :max-width="400"
                        :append-to-body="true"
                        :dropdown-position="'auto'"
                        :dropdown-direction="'bottom'"
                      />
                    </div>
                  </CCol>
                  <CCol md="4">
                    <label class="form-label">Part Similar</label>
                    <Multiselect
                      id="partSimilarSelect"
                      v-model="sparepartForm.partSimilar"
                      :options="sparepartOptions"
                      :searchable="true"
                      :close-on-select="true"
                      :show-labels="false"
                      placeholder="Type to search part similar..."
                      track-by="value"
                      label="text"
                      @search-change="handleSparepartSearch"
                      @input="onPartSimilarSelect"
                      :disabled="String(sparepartForm.status) !== '2'"
                      :max-height="300"
                      :max-width="400"
                      :append-to-body="true"
                      :dropdown-position="'auto'"
                      :dropdown-direction="'bottom'"
                    />
                  </CCol>
                  <CCol md="4">
                    <CFormSelect
                      id="statusSelect"
                      label="Status*"
                      v-model="sparepartForm.status"
                      placeholder="Choose Status"
                    >
                      <option disabled value="">Choose Status</option>
                      <option value="1">ORIGINAL PART</option>
                      <option value="2">SIMILAR PART</option>
                    </CFormSelect>
                  </CCol>
                  <CCol>
                    <CFormInput
                      id="vendorInput"
                      label="Vendor"
                      v-model="sparepartForm.vendor"
                      placeholder="Vendor"
                      :disabled="sparepartForm.newPart !== '1'"
                    />
                  </CCol>
                  <CCol md="1">
                    <CFormInput
                      v-if="sparepartForm.newPart === '1'"
                      id="priceInput"
                      label="Price"
                      v-model="displayPrice"
                      placeholder="Price"
                      type="text"
                    />
                    <CFormInput
                      v-else
                      id="priceInput"
                      label="Price"
                      :value="formatCurrency(sparepartForm.price)"
                      placeholder="Price"
                      :disabled="true"
                    />
                  </CCol>
                  <CCol md="1">
                    <CFormInput
                      id="quantityInput"
                      label="Quantity*"
                      v-model="sparepartForm.quantity"
                      placeholder="Quantity"
                      type="number"
                      min="1"
                    />
                  </CCol>
                  <CCol md="1">
                    <CFormSelect
                      id="isModifySelect"
                      label="Modify*"
                      v-model="sparepartForm.isModify"
                    >
                      <option value="NO">NO</option>
                      <option value="YES">YES</option>
                    </CFormSelect>
                  </CCol>
                  <CCol md="1">
                    <CFormInput
                      id="totalInput"
                      label="Total"
                      :value="formatCurrency(sparepartForm.total)"
                      placeholder="Total"
                      :disabled="true"
                    />
                  </CCol>
                  <CCol md="8">
                    <CFormInput
                      id="sparepartDescription"
                      label="Input Description"
                      v-model="sparepartForm.description"
                      placeholder="Text Description"
                    />
                  </CCol>
                  <CCol md="4" v-if="sparepartForm.newPart === '1'">
                    <CFormInput
                      id="materialNumberInput"
                      label="Input Material Number"
                      v-model="sparepartForm.materialNumber"
                      placeholder="Material Number"
                    />
                  </CCol>
                </CRow>
                <CRow class="mt-2 g-2 align-items-center">
                  <CCol md="10" class="d-flex gap-2">
                    <CButton style="color: white;" color="success" @click="submitSparepart">Submit</CButton>
                    <CButton style="color: white;" color="secondary" @click="cancelSparepart">Cancel</CButton>
                  </CCol>
                </CRow>
              </div>
              <div v-if="sparepart_list.length > 0">
                <CTable bordered hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell>No</CTableHeaderCell>
                      <CTableHeaderCell>Sparepart</CTableHeaderCell>
                      <CTableHeaderCell>Part Similar</CTableHeaderCell>
                      <CTableHeaderCell>Price</CTableHeaderCell>
                      <CTableHeaderCell>Vendor</CTableHeaderCell>
                      <CTableHeaderCell>Quantity</CTableHeaderCell>
                      <CTableHeaderCell>Status</CTableHeaderCell>
                      <CTableHeaderCell>Is Modify</CTableHeaderCell>
                      <CTableHeaderCell>Total</CTableHeaderCell>
                      <CTableHeaderCell>Description</CTableHeaderCell>
                      <CTableHeaderCell>Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-for="(sparepart, index) in sparepart_list" :key="index">
                      <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.sparepart?.label || '' }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.partSimilar || '' }}</CTableDataCell>
                      <CTableDataCell>{{ formatCurrency(sparepart.price) }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.vendor }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.quantity || 1 }}</CTableDataCell>
                      <CTableDataCell>{{ mapSparepartStatus(sparepart.status) }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.isModify || 'NO' }}</CTableDataCell>
                      <CTableDataCell>{{ formatCurrency(sparepart.total || 0) }}</CTableDataCell>
                      <CTableDataCell>{{ sparepart.description || '' }}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="warning" size="sm" class="me-2" @click="editSparepart(index)">Edit</CButton>
                        <CButton color="danger" size="sm" @click="removeSparepart(index)">Remove</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
                <CButton
                  color="primary"
                  class="mt-2"
                  @click="showSparepartForm = true"
                >
                  Tambah Sparepart
                </CButton>
                <div class="mt-3 p-3 bg-light rounded">
                  <CRow>
                    <CCol md="3">
                      <small class="text-muted">Total Sparepart Cost</small>
                      <div class="fw-bold">{{ formatCurrency(totalSparepartCost) }}</div>
                    </CCol>
                  </CRow>
                </div>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Yokoten</label>
                  <div style="height: 100;" v-if="yokotenList.length === 0">
                    <CButton color="primary" @click="showYokotenForm = true" class="mb-3"
                      >Tambah Yokoten</CButton
                    >
                  </div>
                  <div v-if="showYokotenForm">
                    <CRow class="mb-2 g-2">
                      <CCol xs="12" md="4">
                        <CFormInput
                          v-model="yokotenForm.machine"
                          placeholder="Yokoten Item"
                        />
                      </CCol>
                      <CCol xs="6" md="2">
                        <Treeselect
                          v-model="yokotenForm.pic"
                          :options="picOptions"
                          :searchable="true"
                          :clearable="true"
                          placeholder="Select PIC"
                          :value-key="'id'"
                          :label-key="'label'"
                        />
                      </CCol>
                      <CCol xs="6" md="2">
                        <CFormInput
                          type="date"
                          v-model="yokotenForm.datePlan"
                        />
                      </CCol>
                      <CCol xs="6" md="2">
                        <CFormSelect v-model="yokotenForm.judg">
                          <option :value="false">Belum</option>
                          <option :value="true">Sudah</option>
                        </CFormSelect>
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="success" @click="submitYokoten">Submit</CButton>
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="secondary" @click="cancelYokoten">Cancel</CButton>
                      </CCol>
                    </CRow>
                  </div>
                  <div v-if="yokotenList.length > 0" class="table-responsive">
                    <CTable bordered hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Item Yokoten</CTableHeaderCell>
                          <CTableHeaderCell>PIC</CTableHeaderCell>
                          <CTableHeaderCell>Plan Date</CTableHeaderCell>
                          <CTableHeaderCell>Judge</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow v-for="(item, idx) in yokotenList" :key="idx">
                          <CTableDataCell>{{ item.machine }}</CTableDataCell>
                          <CTableDataCell>{{
                            picOptions.find(
                              (opt) => String(opt.value) === String(item.pic),
                            )?.label || item.pic
                          }}</CTableDataCell>
                          <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                          <CTableDataCell>{{
                            item.judg ? 'Sudah' : 'Belum'
                          }}</CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="warning"
                              size="sm"
                              class="me-2"
                              @click="editYokoten(idx)"
                              >Edit</CButton
                            >
                            <CButton
                              color="danger"
                              size="sm"
                              @click="removeYokoten(idx)"
                              >Remove</CButton
                            >
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <CButton
                      color="primary"
                      class="mt-2"
                      @click="showYokotenForm = true"
                      >Tambah Yokoten</CButton
                    >
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Countermeasure (kenapa terjadi)</label>
                  <div v-if="countermeasureKenapaTerjadiList.length === 0">
                    <CButton
                      class="mb-3"
                      color="primary"
                      @click="showCountermeasureKenapaTerjadiForm = true"
                      >Tambah Countermeasure</CButton
                    >
                  </div>
                    <div v-if="showCountermeasureKenapaTerjadiForm">
                      <CRow class="mb-2 g-2">
                        <CCol xs="12" md="auto">
                          <CFormCheck
                            v-model="countermeasureKenapaTerjadiForm.isAction"
                            label="Ini Action?"
                          />
                        </CCol>
                        <CCol xs="12" md="4">
                          <CFormInput
                            v-model="countermeasureKenapaTerjadiForm.cmDesc"
                            placeholder="Countermeasure/Action"
                          />
                        </CCol>
                        <CCol xs="6" md="2">
                          <CFormInput
                            type="date"
                            v-model="countermeasureKenapaTerjadiForm.datePlan"
                          />
                        </CCol>
                        <CCol xs="6" md="2">
                          <CFormSelect
                            v-model="countermeasureKenapaTerjadiForm.category"
                          >
                            <option value="">C/M Category</option>
                            <option value="Improvement">Improvement</option>
                            <option value="Training">Training</option>
                            <option value="Revisi TPM">Revisi TPM</option>
                            <option value="Sparepart">Sparepart</option>
                          </CFormSelect>
                        </CCol>
                      <CCol xs="12" md="2">
                        <Treeselect
                          v-model="countermeasureKenapaTerjadiForm.pic"
                          :options="picOptions"
                          :searchable="true"
                          :clearable="true"
                          placeholder="Select PIC"
                          :value-key="'id'"
                          :label-key="'label'"
                        />
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="success" @click="submitCountermeasureKenapaTerjadi">Submit</CButton>
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="secondary" @click="cancelCountermeasureKenapaTerjadi">Cancel</CButton>
                      </CCol>
                      </CRow>
                      <CRow v-if="typeof countermeasureKenapaTerjadiForm._editIdx === 'number'" class="mb-2 g-2">
                        <CCol xs="6" md="2">
                          <CFormSelect
                            v-model="countermeasureKenapaTerjadiForm.judg"
                          >
                            <option value="belum">Belum</option>
                            <option value="sudah">Sudah</option>
                          </CFormSelect>
                        </CCol>
                        <CCol xs="12" md="10">
                          <CFormTextarea
                            v-model="countermeasureKenapaTerjadiForm.result"
                            placeholder="Result Notes"
                            rows="2"
                          />
                        </CCol>
                      </CRow>
                    </div>
                  <div v-if="countermeasureKenapaTerjadiList.length > 0">
                    <div class="table-responsive">
                      <CTable bordered>
                        <CTableHead>
                          <CTableRow>
                            <CTableHeaderCell>Action?</CTableHeaderCell>
                            <CTableHeaderCell>Countermeasure/Action</CTableHeaderCell>
                            <CTableHeaderCell>Plan Date</CTableHeaderCell>
                            <CTableHeaderCell>C/M Category</CTableHeaderCell>
                            <CTableHeaderCell>PIC</CTableHeaderCell>
                            <CTableHeaderCell>Judge</CTableHeaderCell>
                            <CTableHeaderCell>Result Notes</CTableHeaderCell>
                            <CTableHeaderCell>Actions</CTableHeaderCell>
                          </CTableRow>
                        </CTableHead>
                        <CTableBody>
                          <CTableRow
                            v-for="(item, idx) in countermeasureKenapaTerjadiList"
                            :key="idx"
                          >
                            <CTableDataCell>{{
                              item.isAction ? 'Ya' : 'Tidak'
                            }}</CTableDataCell>
                            <CTableDataCell>{{ item.cmDesc }}</CTableDataCell>
                            <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                            <CTableDataCell>{{ item.category }}</CTableDataCell>
                            <CTableDataCell>{{
                              picOptions.find(
                                (opt) => String(opt.value) === String(item.pic),
                              )?.label || item.pic
                            }}</CTableDataCell>
                            <CTableDataCell>
                              <CFormSelect v-model="item.judg" disabled>
                                <option value="belum">Belum</option>
                                <option value="sudah">Sudah</option>
                              </CFormSelect>
                            </CTableDataCell>
                            <CTableDataCell>
                              <CFormTextarea v-model="item.result" disabled rows="2" />
                            </CTableDataCell>
                            <CTableDataCell>
                              <CButton
                                color="warning"
                                size="sm"
                                class="me-2"
                                @click="editCountermeasureKenapaTerjadi(idx)"
                                >Edit</CButton
                              >
                              <CButton
                                color="danger"
                                size="sm"
                                @click="removeCountermeasureKenapaTerjadi(idx)"
                                >Remove</CButton
                              >
                            </CTableDataCell>
                          </CTableRow>
                        </CTableBody>
                      </CTable>
                    </div>
                    <CButton
                      color="primary"
                      class="mb-3"
                      @click="showCountermeasureKenapaTerjadiForm = true"
                      >Tambah Countermeasure</CButton
                    >
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <label style="font-size: medium; font-weight: bold;" class="form-label">Countermeasure (kenapa Lama)</label>
                  <div v-if="countermeasureKenapaLamaList.length === 0">
                    <CButton
                      class="mb-3"
                      color="primary"
                      @click="showCountermeasureKenapaLamaForm = true"
                      >Tambah Countermeasure</CButton
                    >
                  </div>
                  <div v-if="showCountermeasureKenapaLamaForm">
                    <CRow class="mb-2 g-2">
                      <CCol xs="12" md="auto">
                        <CFormCheck
                          v-model="countermeasureKenapaLamaForm.isAction"
                          label="Ini Action?"
                        />
                      </CCol>
                      <CCol xs="12" md="4">
                        <CFormInput
                          v-model="countermeasureKenapaLamaForm.cmDesc"
                          placeholder="Countermeasure/Action"
                        />
                      </CCol>
                      <CCol xs="6" md="2">
                        <CFormInput
                          type="date"
                          v-model="countermeasureKenapaLamaForm.datePlan"
                        />
                      </CCol>
                      <CCol xs="6" md="2">
                        <CFormSelect
                          v-model="countermeasureKenapaLamaForm.category"
                        >
                          <option value="">C/M Category</option>
                          <option value="Improvement">Improvement</option>
                          <option value="Training">Training</option>
                          <option value="Revisi TPM">Revisi TPM</option>
                          <option value="Sparepart">Sparepart</option>
                        </CFormSelect>
                      </CCol>
                      <CCol xs="12" md="2">
                        <Treeselect
                          v-model="countermeasureKenapaLamaForm.pic"
                          :options="picOptions"
                          :searchable="true"
                          :clearable="true"
                          placeholder="Select PIC"
                          :value-key="'id'"
                          :label-key="'label'"
                        />
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="success" @click="submitCountermeasureKenapaLama">Submit</CButton>
                      </CCol>
                      <CCol xs="auto">
                        <CButton style="color: white;" color="secondary" @click="cancelCountermeasureKenapaLama">Cancel</CButton>
                      </CCol>
                    </CRow>
                    <CRow v-if="typeof countermeasureKenapaLamaForm._editIdx === 'number'" class="mb-2 g-2">
                      <CCol xs="6" md="2">
                        <CFormSelect
                          v-model="countermeasureKenapaLamaForm.judg"
                        >
                          <option value="belum">Belum</option>
                          <option value="sudah">Sudah</option>
                        </CFormSelect>
                      </CCol>
                      <CCol xs="12" md="10">
                        <CFormTextarea
                          v-model="countermeasureKenapaLamaForm.result"
                          placeholder="Result Notes"
                          rows="2"
                        />
                      </CCol>
                    </CRow>
                  </div>
                  <div v-if="countermeasureKenapaLamaList.length > 0" class="table-responsive">
                    <CTable bordered hover responsive>
                      <CTableHead>
                        <CTableRow>
                          <CTableHeaderCell>Action?</CTableHeaderCell>
                          <CTableHeaderCell>Countermeasure/Action</CTableHeaderCell>
                          <CTableHeaderCell>Plan Date</CTableHeaderCell>
                          <CTableHeaderCell>C/M Category</CTableHeaderCell>
                          <CTableHeaderCell>PIC</CTableHeaderCell>
                          <CTableHeaderCell>Judge</CTableHeaderCell>
                          <CTableHeaderCell>Result Notes</CTableHeaderCell>
                          <CTableHeaderCell>Actions</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        <CTableRow
                          v-for="(item, idx) in countermeasureKenapaLamaList"
                          :key="idx"
                        >
                          <CTableDataCell>{{
                            item.isAction ? 'Ya' : 'Tidak'
                          }}</CTableDataCell>
                          <CTableDataCell>{{ item.cmDesc }}</CTableDataCell>
                          <CTableDataCell>{{ item.datePlan }}</CTableDataCell>
                          <CTableDataCell>{{ item.category }}</CTableDataCell>
                          <CTableDataCell>{{
                            picOptions.find(
                              (opt) => String(opt.value) === String(item.pic),
                            )?.label || item.pic
                          }}</CTableDataCell>
                          <CTableDataCell>
                            <CFormSelect v-model="item.judg" disabled>
                              <option value="belum">Belum</option>
                              <option value="sudah">Sudah</option>
                            </CFormSelect>
                          </CTableDataCell>
                          <CTableDataCell>
                            <CFormTextarea v-model="item.result" disabled rows="2" />
                          </CTableDataCell>
                          <CTableDataCell>
                            <CButton
                              color="warning"
                              size="sm"
                              class="me-2"
                              @click="editCountermeasureKenapaLama(idx)"
                              >Edit</CButton
                            >
                            <CButton
                              color="danger"
                              size="sm"
                              @click="removeCountermeasureKenapaLama(idx)"
                              >Remove</CButton
                            >
                          </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                    <CButton
                      color="primary"
                      class="mt-2"
                      @click="showCountermeasureKenapaLamaForm = true"
                      >Tambah Countermeasure</CButton
                    >
                  </div>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <!-- Legend Status -->
          <CRow class="mb-4">
            <CCol>
              <div class="d-flex align-items-center justify-content-center gap-4 p-3 bg-light rounded">
                <div class="d-flex align-items-center gap-2">
                  <div class="status-circle status-none"></div>
                  <small class="text-muted">none</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="status-circle status-comment"></div>
                  <small class="text-muted">comment</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="status-circle status-delay"></div>
                  <small class="text-muted">delay</small>
                </div>
                <div class="d-flex align-items-center gap-2">
                  <div class="status-circle status-approved"></div>
                  <small class="text-muted">approved</small>
                </div>
              </div>
            </CCol>
          </CRow>

          <CCard>
            <CCardBody>
              <CRow>
                <CCol>
                  <h5>Approval Status 5 Why</h5>
                  <CRow class="text-center mb-3">
                    <CCol>
                      <CButton style="color: white;" size="sm" color="success" @click="onApprove('5why')">Approve</CButton>
                      <CButton style="color: white;" size="sm" color="info" class="ms-2" @click="onComment('5why')">Comment</CButton>
                    </CCol>
                  </CRow>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>TL Check</CCol>
                    <CCol>GL Check</CCol>
                    <CCol>SH Check</CCol>
                  </CRow>
                  <CRow class="text-center py-3">
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'fiveWhyTlApprove')" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'fiveWhyLhApprove')" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'fiveWhyShApprove')" />
                    </CCol>
                  </CRow>

                  <h5 class="mt-4">Approval Status Countermeasure</h5>
                  <CRow class="text-center mb-3">
                    <CCol>
                      <CButton style="color: white;" size="sm" color="success" @click="onApprove('counter')">Approve</CButton>
                      <CButton style="color: white;" size="sm" color="info" class="ms-2" @click="onComment('counter')">Comment</CButton>
                    </CCol>
                  </CRow>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>TL Check</CCol>
                    <CCol>GL Check</CCol>
                    <CCol>SH Check</CCol>
                  </CRow>
                  <CRow class="text-center py-3">
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'cmTlApprove')" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'cmLhApprove')" />
                    </CCol>
                    <CCol>
                      <span class="status-circle" :class="statusClass(localSubmit, 'cmShApprove')" />
                    </CCol>
                  </CRow>

                  <h5 class="mt-4">Approval Status Departement Head</h5>
                  <CRow class="text-center mb-3">
                    <CCol>
                    <CButton style="color: white;" size="sm" color="success" @click="onApprove('dph')">Approve</CButton>
                    <CButton style="color: white;" size="sm" color="info" class="ms-2" @click="onComment('dph')">Comment</CButton>
                    </CCol>
                  </CRow>
                  <CRow class="bg-black text-white fw-bold text-center py-2">
                    <CCol>Dph Check</CCol>
                  </CRow>
                  <CRow class="justify-content-center text-center py-3 mb-4">
                    <CCol xs="auto">
                      <span class="status-circle" :class="statusClass(localSubmit, 'cmDhApprove')" />
                    </CCol>
                  </CRow>

                  <CCard class="mt-4">
                    <CCardHeader>
                      <h5 class="mb-0">Five Why Comments</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow v-if="localSubmit.fiveWhyTlFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Five Why - TL:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.fiveWhyTlFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                      <CRow v-if="localSubmit.fiveWhyLhFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Five Why - LH/GL:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.fiveWhyLhFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                      <CRow v-if="localSubmit.fiveWhyShFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Five Why - SH:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.fiveWhyShFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>

                  <CCard class="mt-4">
                    <CCardHeader>
                      <h5 class="mb-0">Countermeasure Comments</h5>
                    </CCardHeader>
                    <CCardBody>
                      <CRow v-if="localSubmit.cmTlFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Countermeasure - TL:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.cmTlFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                      <CRow v-if="localSubmit.cmLhFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Countermeasure - LH/GL:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.cmLhFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                      <CRow v-if="localSubmit.cmShFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Countermeasure - SH:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.cmShFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                      <CRow v-if="localSubmit.cmDhFeedback" class="mb-2">
                        <CCol md="2" class="fw-bold">Countermeasure - DPH:</CCol>
                        <CCol md="10">
                          <CFormTextarea
                            v-model="localSubmit.cmDhFeedback"
                            rows="3"
                            readonly
                          />
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </CCard>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCol md="12">
            <label class="form-label">Last Report File</label>
          </CCol>
          <CCol md="12">
            <CButton style="width: 100%" :color="localSubmit.file_report ? 'primary' : 'secondary'"
              @click="downloadLastReportFile" :disabled="!localSubmit.file_report" v-if="localSubmit.file_report">
              Download Last Report File
            </CButton>
            <CButton style="width: 100%" color="warning" disabled v-else>
              Belum Ada Report di Upload
            </CButton>
          </CCol>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CCol md="12">
            <CButton style="width: 100%" :color="'secondary'" @click="downloadTemplateFile">
              Download Template
            </CButton>
          </CCol>
        </CCol>
      </CRow>
      <CRow md="12" class="mb-3">
        <CCol>
          <CFormInput type="file" feedbackInvalid="Please input the problems" id="Problems" label="Upload Report"
            required @change="onFileChange($event, 'uploadFile')" />
        </CCol>
      </CRow>
      <CRow xs="12" class="mb-3">
        <CCol>
          <CFormCheck feedbackInvalid="You must agree before submitting." id="invalidCheck"
            label="Agree to terms and conditions" required type="checkbox" v-model="localSubmit.agreeTerms" />
        </CCol>
      </CRow>

      <!-- Comment Modal -->
      <CModal
        :visible="showCommentModal"
        @update:visible="val => showCommentModal = val"
        @close="cancelComment"
        aria-labelledby="commentModalLabel"
      >
        <CModalHeader>
          <CModalTitle id="commentModalLabel">
            Add Comment for {{ currentSection === '5why' ? '5 Why' : currentSection === 'counter' ? 'Countermeasure' : currentSection === 'dph' ? 'Department Head' : 'Section' }} - {{ currentUserName }}{{ currentUserRole ? ' (' + currentUserRole + ')' : '' }}
          </CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CFormTextarea
            v-model="commentText"
            placeholder="Enter your comment here... (Your name and role will be automatically added)"
            rows="4"
            label="Comment"
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="cancelComment">Cancel</CButton>
          <CButton color="info" @click="submitComment">Submit Comment</CButton>
        </CModalFooter>
      </CModal>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="$emit('close')"> Close </CButton>

      <CButton color="primary" @click="saveSubmit" :disabled="isSaving">
        <span v-if="isSaving">
          <CSpinner size="sm" /> Saving...
        </span>
        <span v-else> Submit </span>
      </CButton>
    </CModalFooter>
  </CModal>
</template>

<script>
import { ref, watch, toRefs, onMounted, computed } from 'vue'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CCol,
  CRow,
  CFormInput,
  CFormCheck,
  CButton,
  CSpinner,
  CCardBody,
  CTable,
} from '@coreui/vue'
import Treeselect from 'vue3-treeselect'
import Multiselect from 'vue-multiselect'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import { cilClock } from '@coreui/icons'
import { CIcon } from '@coreui/icons-vue'
import LegendStatus from '@/views/ProblemHistory/components/LegendStatus.vue'
import AnalysisTreeList from '@/components/AnalysisTreeList.vue'
import StepRepairTable from '@/components/StepRepairTable.vue'
import api from '@/apis/CommonAPI'

export default {
  name: 'EditProblemModal',
  emits: ['close', 'submit'],
  components: {
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CForm,
    CCol,
    CRow,
    CFormInput,
    CFormCheck,
    CButton,
    CSpinner,
    CTable,
    Treeselect,
    Multiselect,
    cilClock,
    LegendStatus,
    AnalysisTreeList,
    StepRepairTable,
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    submitData: {
      type: Object,
      required: false,
      default: () => ({}),
    },
    machineOptions: {
      type: Array,
      default: () => [],
    },
    lineOptions: {
      type: Array,
      default: () => [],
    },
    memberOption: {
      type: Array,
      default: () => [],
    },
    modalLoading: {
      type: Boolean,
      default: false,
    },
    saving: {
      type: Boolean,
      default: false,
    },
  },

  setup(props, { emit }) {
    const { submitData } = toRefs(props || {})
    console.log('EditProblemModal props:', JSON.stringify(props, null, 2))

    const parseFrealProb = (frealProb) => {
      if (!frealProb) return [{ id: 1, description: '' }]
      if (typeof frealProb === 'string') {
        const cleaned = frealProb.trim()
        const lines = cleaned.split('\\n').filter((line) => line.trim() !== '')
        if (lines.length === 0) return [{ id: 1, description: '' }]
        const result = lines.map((line, index) => ({
          id: index + 1,
          description: line.trim(),
        }))
        console.log('parseFrealProb result:', result)
        return result
      } else if (Array.isArray(frealProb)) {
        return frealProb.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            return { id: index + 1, description: item.description }
          } else {
            return { id: index + 1, description: '' }
          }
        })
      } else {
        return [{ id: 1, description: '' }]
      }
    }

    const parseStepRepair = (stepRepair) => {
      if (!stepRepair || typeof stepRepair !== 'string')
        return [{ id: 1, stepDesc: '', quick6: '', idealTime: 0, actualTime: 0 }]
      const cleaned = stepRepair.trim()
      const lines = cleaned.split(/\r?\n/).filter((line) => line.trim() !== '')
      if (lines.length === 0) return [{ id: 1, stepDesc: '', quick6: '', idealTime: 0, actualTime: 0 }]
      return lines.map((line, index) => ({
        id: index + 1,
        stepDesc: line.trim(),
        quick6: '',
        idealTime: 0,
        actualTime: 0,
      }))
    }

    const parseStepRepairNew = (stepRepairNew) => {
      console.log('parseStepRepairNew called with:', stepRepairNew)
      console.log('Type of stepRepairNew:', typeof stepRepairNew)
      if (!stepRepairNew) {
        console.log('stepRepairNew is empty, returning []')
        return []
      }
      try {
        let parsed = stepRepairNew
        if (typeof stepRepairNew === 'string') {
          console.log('Parsing stepRepairNew as string')
          parsed = JSON.parse(stepRepairNew)
          console.log('Parsed result:', parsed)
        }
        if (!Array.isArray(parsed)) {
          console.log('Parsed result is not an array:', parsed)
          return []
        }
        const result = parsed.map((item, index) => ({
          id: item.id || index + 1,
          stepDesc: item.stepDesc || '',
          quick6: item.quick6 || '',
          idealTime: item.idealTime || 0,
          actualTime: item.actualTime || 0,
        }))
        console.log('Final parsed stepRepairNew result:', result)
        return result
      } catch (error) {
        console.error('Error parsing stepRepairNew:', error)
        return []
      }
    }

    const countermeasureKenapaTerjadiList = ref([])
    const lastGeneratedSparepartId = ref(0)
    const showCountermeasureKenapaTerjadiForm = ref(false)
    const countermeasureKenapaTerjadiForm = ref({
      isAction: false,
      cmDesc: '',
      datePlan: '',
      category: '',
      pic: '',
      result: '',
      judg: 'belum',
    })

    const countermeasureKenapaLamaList = ref([])
    const showCountermeasureKenapaLamaForm = ref(false)
    const countermeasureKenapaLamaForm = ref({
      isAction: false,
      cmDesc: '',
      datePlan: '',
      category: '',
      pic: '',
      judge: 'belum',
    })

    const parseTambahAnalysis = (data) => {
      try {
        if (!data) return []
        let parsed = data
        if (typeof data === 'string') parsed = JSON.parse(data)
        if (!Array.isArray(parsed)) return []
        // <- penting: konversi ke struktur TreeNode (description/subItems)
        return convertBackendToTreeNode(parsed)
      } catch (error) {
        console.error('Error parsing tambahAnalysisTerjadi:', error)
        return []
      }
    };

    const hasAnalysisContent = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return false;

      const checkNode = (node) => {
        if (!node) return false;
        const desc = node.description || node.name || '';
        if (desc.trim() !== '') return true;
        if (node.subItems && Array.isArray(node.subItems)) {
          return node.subItems.some(checkNode);
        }
        return false;
      };

      return arr.some(checkNode);
    };

    const hasCountermeasureContent = (arr) => {
      if (!Array.isArray(arr) || arr.length === 0) return false;
      return arr.some(item => item.cmDesc && item.cmDesc.trim() !== '');
    };

    // Ubah struktur backend -> struktur TreeNode (description/subItems)
    const convertBackendToTreeNode = (list) => {
      if (!list) return [];
      let arr = [];
      
      if (typeof list === 'string') {
        try {
          arr = JSON.parse(list);
        } catch (e) {
          console.error('Error parsing JSON:', e);
          return [];
        }
      } else if (Array.isArray(list)) {
        arr = list;
      } else {
        return [];
      }

      return arr.map((item) => {
        if (!item) return null;
        
        return {
          id: item.id || (Date.now() + Math.random().toString(36).slice(2)),
          description: item.description || item.name || '',
          subItems: convertBackendToTreeNode(item.children || item.subItems || [])
        };
      }).filter(Boolean);
    }

    // Ubah struktur TreeNode -> struktur backend (name/children/isLeaf/pid)
    const convertTreeNodeToBackend = (nodes, pid = 0) => {
      if (!Array.isArray(nodes)) {
        return [];
      }
      
      return nodes.map((node) => {
        if (!node) return null;
        
        const nodeId = typeof node.id === 'number' ? node.id : Date.now() + Math.floor(Math.random() * 1000);
        const children = convertTreeNodeToBackend(node.subItems || node.children || [], nodeId);
        
        return {
          id: nodeId,
          isLeaf: !children || children.length === 0,
          name: node.description || node.name || node.text || '',
          pid: pid,
          children: children
        };
      }).filter(Boolean);
    }

    const localSubmit = ref({
      sparepart: null,
      tambahAnalysisTerjadi: parseTambahAnalysis(submitData.value?.tambahAnalysisTerjadi || '[]'),
      tambahAnalisisLama: parseTambahAnalysis(submitData.value?.tambahAnalisisLama || '[]'),
      ...(submitData.value || {}),
      rootcauses5Why: parseFrealProb(submitData.value?.freal_prob),
      stepRepairArray: parseStepRepair(submitData.value?.stepRepair),
      stepRepairNew: parseStepRepairNew(submitData.value?.fstep_new),
      comments5WhySH: submitData.value?.fiveWhyShFeedback || '',
      comments5WhyLH: submitData.value?.fiveWhyLhFeedback || '',
      fiveWhyTlApprove: submitData.value?.fiveWhyTlApprove ?? 0,
      fiveWhyLhApprove: submitData.value?.fiveWhyLhApprove ?? 0,
      fiveWhyShApprove: submitData.value?.fiveWhyShApprove ?? 0,
      cmTlApprove: submitData.value?.cmTlApprove ?? 0,
      cmLhApprove: submitData.value?.cmLhApprove ?? 0,
      cmShApprove: submitData.value?.cmShApprove ?? 0,
      cmDhApprove: submitData.value?.cmDhApprove ?? 0,
      fiveWhyLhFeedback: submitData.value?.fiveWhyLhFeedback ?? '',
      fiveWhyShFeedback: submitData.value?.fiveWhyShFeedback ?? '',
      cmLhFeedback: submitData.value?.cmLhFeedback ?? '',
      cmShFeedback: submitData.value?.cmShFeedback ?? '',
      cmTlFeedback: submitData.value?.cmTlFeedback ?? '',
      cmDhFeedback: submitData.value?.cmDhFeedback ?? '',
    }),
    totalSparepartCost = computed(() => {
      return sparepart_list.value.reduce((sum, item) => sum + (Number(item.total) || 0), 0)
    })

    console.log('Initial localSubmit setup:', JSON.stringify(localSubmit.value, null, 2))
    console.log('Initial stepRepairNew from setup:', localSubmit.value.stepRepairNew)

    const validatedCustom01 = ref(false)
    const isSaving = ref(false)
    const editingRootcauses = ref({})
    const editingStepRepair = ref({})


    const initializeEditingRootcauses = (rootcausesArray) => {
      const editingState = {}
      rootcausesArray.forEach((item) => {
        editingState[item.id] = item.description.trim() === '' ? true : false
      })
      editingRootcauses.value = editingState
    }

    // async onClickInput(problem) {
    //   try {
    //     this.tableLoading = true
    //     this.modalLoading = true
    //     const response = await axios.get(`/api/smartandon/problemId/${problem.fid}`);
    //     const problemData = response.data
    //     console.log('Problem data:', problemData);
    //     this.submit = this.mapProblemDataToSubmit(problemData)
    //     console.log('Submit data sent to EditProblemModal:', JSON.stringify(this.submit, null, 2))

    //     // Fetch tambahAnalysis data and filter by id_problem matching fid
    //     const analysisResponse = await axios.get('/api/smartandon/tambahAnalysis');
    //     const allAnalysis = analysisResponse.data;
    //     const filteredAnalysis = allAnalysis.filter(item => item.id_problem === problem.fid);

    //     // Mapping berdasarkan analisys_category "TERJADI" dan "LAMA"
    //     const terjadiAnalysis = filteredAnalysis.filter(item => item.analisys_category === 'TERJADI');
    //     const lamaAnalysis = filteredAnalysis.filter(item => item.analisys_category === 'LAMA');

    //     this.tambahAnalysisData = {
    //       terjadi: terjadiAnalysis,
    //       lama: lamaAnalysis,
    //     };
    //     console.log('Mapped tambahAnalysis data:', this.tambahAnalysisData);

    //     this.tambahAnalysisTerjadi = terjadiAnalysis;
    //     this.tambahAnalysisLama = lamaAnalysis;

    //     // Map option labels for O6, Shift, Problem Category, and Q6
    //     const o6Option = this.o6Options.find(opt => opt.id === this.submit.pilihO6)
    //     this.oCategoryName = o6Option ? o6Option.label : ''

    //     const shiftOption = this.shiftOptions.find(opt => opt.id === this.submit.shift)
    //     this.shiftName = shiftOption ? shiftOption.label : ''

    //     const problemCategoryOption = this.problemCategoryOptions.find(
    //       opt => opt.id === this.submit.problemCategory,
    //     )
    //     this.problemCategoryName = problemCategoryOption ? problemCategoryOption.label : ''

    //     const q6Option = this.q6Options.find(opt => opt.id === this.submit.qCategory)
    //     this.qCategoryName = q6Option ? q6Option.label : ''

    //     this.visibleLiveDemo = true
    //   } catch (error) {
    //     alert('Failed to load problem data: ' + error.message)
    //     console.error(error)
    //   } finally {
    //     this.modalLoading = false
    //     this.tableLoading = false
    //   }
    // },

    const initializeEditingStepRepair = (stepRepairArray) => {
      console.log('Initializing editingStepRepair with:', stepRepairArray)
      const editingState = {}
      stepRepairArray.forEach((item) => {
        // Add null/undefined check for item.stepDesc before calling trim()
        const stepDesc = item.stepDesc || ''
        editingState[item.id] = stepDesc.trim() === '' ? true : false
      })
      console.log('Editing state for step repair:', editingState)
      editingStepRepair.value = editingState
    }

    watch(submitData, (newVal) => {
      if (!newVal) return;
      let rootcausesArray = []
      if (
        Array.isArray(newVal?.rootcauses5Why) &&
        newVal.rootcauses5Why.length > 0
      ) {
        rootcausesArray = newVal.rootcauses5Why.map((item, index) => {
          if (typeof item === 'string') {
            console.log(`rootcauses5Why1[${index}] description:`, item)
            return { id: index + 1, description: item }
          } else if (item && typeof item.description === 'string') {
            console.log(
              `rootcauses5Why2[${index}] description:`,
              item.description,
            )
            return { id: index + 1, description: item.description }
          } else {
            console.log(`rootcauses5Why3[${index}] description: empty`)
            return { id: index + 1, description: '' }
          }
        })
      } else if (typeof newVal?.rootcauses5Why === 'string') {
        rootcausesArray = parseFrealProb(newVal.rootcauses5Why)
        rootcausesArray.forEach((item, index) => {
          console.log(
            `Parsed rootcauses5Why string[${index}] description:`,
            item.description,
          )
        })
      } else if (typeof newVal?.freal_prob === 'string') {
        rootcausesArray = parseFrealProb(newVal.freal_prob)
        rootcausesArray.forEach((item, index) => {
          console.log(
            `Parsed freal_prob[${index}] description:`,
            item.description,
          )
        })
      } else {
        rootcausesArray = [{ id: 1, description: '' }]
        console.log('rootcauses5Why empty: default empty')
      }

      let stepRepairArray = []
      console.log('newVal.stepRepair:', newVal?.stepRepair)
      console.log('TYPE OF newVal.stepRepair:', typeof newVal?.stepRepair)

      if (Array.isArray(newVal?.stepRepair) && newVal.stepRepair.length > 0) {
        stepRepairArray = newVal.stepRepair.map((item, index) => {
          if (typeof item === 'string') {
            return { id: index + 1, stepDesc: item, quick6: '', idealTime: 0, actualTime: 0 }
          } else if (item && typeof item.description === 'string') {
            return { id: item.id || index + 1, stepDesc: item.description, quick6: '', idealTime: 0, actualTime: 0 }
          } else {
            return { id: index + 1, stepDesc: '', quick6: '', idealTime: 0, actualTime: 0 }
          }
        })
        console.log('stepRepair from array:', stepRepairArray)
      } else if (typeof newVal?.stepRepair === 'string') {
        try {
          const parsed = JSON.parse(newVal.stepRepair)
          if (Array.isArray(parsed)) {
            stepRepairArray = parsed.map((item, index) => {
              if (typeof item === 'string') {
                return { id: index + 1, stepDesc: item, quick6: '', idealTime: 0, actualTime: 0 }
              } else if (item && typeof item.description === 'string') {
                return {
                  id: item.id || index + 1,
                  stepDesc: item.description,
                  quick6: '',
                  idealTime: 0,
                  actualTime: 0,
                }
              } else {
                return { id: index + 1, stepDesc: '', quick6: '', idealTime: 0, actualTime: 0 }
              }
            })
            console.log('Parsed stepRepair from JSON:', stepRepairArray)
          } else {
            stepRepairArray = parseStepRepair(newVal.stepRepair)
            console.log('Parsed stepRepair as string:', stepRepairArray)
          }
        } catch (e) {
          stepRepairArray = parseStepRepair(newVal.stepRepair)
          console.log('Parsed stepRepair from fallback:', stepRepairArray)
        }
      } else if (typeof newVal?.fstep_repair === 'string') {
        stepRepairArray = parseStepRepair(newVal.fstep_repair)
        console.log('Parsed stepRepair from fstep_repair:', stepRepairArray)
      } else {
        stepRepairArray = [{ id: 1, stepDesc: '', quick6: '', idealTime: 0, actualTime: 0 }]
        console.log('Default stepRepair array:', stepRepairArray)
      }

      const stepRepairNewArray = parseStepRepairNew(newVal?.stepRepairNew)
      console.log('stepRepairNewArray result:', stepRepairNewArray)
      localSubmit.value.stepRepairNew = stepRepairNewArray

      console.log('submitData newVal before assign:', newVal);
      console.log('newVal keys before assign:', Object.keys(newVal || {}));
      console.log('newVal oCategory:', newVal?.oCategory, 'type:', typeof newVal?.oCategory);
      console.log('newVal qCategory:', newVal?.qCategory, 'type:', typeof newVal?.qCategory);
      console.log('newVal pmCategory:', newVal?.pmCategory, 'type:', typeof newVal?.pmCategory);

      Object.assign(localSubmit.value, newVal || {});
      console.log('localSubmit after assign - oCategory:', localSubmit.value.oCategory, 'type:', typeof localSubmit.value.oCategory);
      console.log('localSubmit after assign - qCategory:', localSubmit.value.qCategory, 'type:', typeof localSubmit.value.qCategory);
      console.log('localSubmit after assign - pmCategory:', localSubmit.value.pmCategory, 'type:', typeof localSubmit.value.pmCategory);

      // Map pilih* fields to *Category as numbers for select matching
      localSubmit.value.oCategory = String(Number(newVal?.pilihO6 ?? newVal?.oCategory ?? 0)) || '';
      localSubmit.value.qCategory = String(Number(newVal?.pilihQ6 ?? newVal?.qCategory ?? 0)) || '';
      localSubmit.value.pmCategory = String(Number(newVal?.pilihPM6 ?? newVal?.pmCategory ?? 0)) || '';
      if (localSubmit.value.oCategory !== '3') {
        localSubmit.value.pmCategory = '';
        pmCategoryName.value = '';
      }

      console.log('After mapping - oCategory:', localSubmit.value.oCategory, 'type:', typeof localSubmit.value.oCategory);
      console.log('After mapping - qCategory:', localSubmit.value.qCategory, 'type:', typeof localSubmit.value.qCategory);
      console.log('After mapping - pmCategory:', localSubmit.value.pmCategory, 'type:', typeof localSubmit.value.pmCategory);

      localSubmit.value.tambahAnalysisTerjadi = parseTambahAnalysis(newVal?.tambahAnalysisTerjadi || '[]');
      localSubmit.value.tambahAnalisisLama = parseTambahAnalysis(newVal?.tambahAnalisisLama || '[]');
      localSubmit.value.stepRepair = stepRepairArray;
      localSubmit.value.stepRepairNew = stepRepairNewArray;
      console.log('Final localSubmit.stepRepairNew:', localSubmit.value.stepRepairNew)
      localSubmit.value.fiveWhyTlApprove = newVal.fiveWhyTlApprove ?? 0;
      localSubmit.value.fiveWhyLhApprove = newVal.fiveWhyLhApprove ?? 0;
      localSubmit.value.fiveWhyShApprove = newVal.fiveWhyShApprove ?? 0;
      localSubmit.value.fiveWhyLhFeedback = newVal.fiveWhyLhFeedback ?? '';
      localSubmit.value.fiveWhyShFeedback = newVal.fiveWhyShFeedback ?? '';
      localSubmit.value.cmLhApprove = newVal.cmLhApprove ?? 0;
      localSubmit.value.cmShApprove = newVal.cmShApprove ?? 0;
      localSubmit.value.cmTlApprove = newVal.cmTlApprove ?? 0;
      localSubmit.value.cmDhApprove = newVal.cmDhApprove ?? 0;
      localSubmit.value.cmLhFeedback = newVal.cmLhFeedback ?? '';
      localSubmit.value.cmShFeedback = newVal.cmShFeedback ?? '';
      localSubmit.value.cmTlFeedback = newVal.cmTlFeedback ?? '';
      localSubmit.value.cmDhFeedback = newVal.cmDhFeedback ?? '';

      console.log(
        'Updated localSubmit:',
        JSON.stringify(localSubmit.value, null, 2),
      )
      console.log(
        'IS ARRAY COUNTERMEASURE KENAPA TERJADI:',
        Array.isArray(newVal.countermeasureKenapaTerjadi),
      )

      console.log(
        'IS ARRAY COUNTERMEASURE KENAPA LAMA:',
        Array.isArray(newVal.countermeasureKenapaLama),
      )
      initializeEditingRootcauses(rootcausesArray)
      initializeEditingStepRepair(stepRepairArray)
      countermeasureKenapaTerjadiList.value = Array.isArray(
        newVal.countermeasureKenapaTerjadi,
      )
        ? newVal.countermeasureKenapaTerjadi
        : typeof newVal.countermeasureKenapaTerjadi === 'string' &&
          newVal.countermeasureKenapaTerjadi
          ? JSON.parse(newVal.countermeasureKenapaTerjadi)
          : []
      countermeasureKenapaLamaList.value = Array.isArray(
        newVal.countermeasureKenapaLama,
      )
        ? newVal.countermeasureKenapaLama
        : typeof newVal.countermeasureKenapaLama === 'string' &&
          newVal.countermeasureKenapaLama
          ? JSON.parse(newVal.countermeasureKenapaLama)
          : []
      yokotenList.value = Array.isArray(submitData.value?.yokoten)
        ? submitData.value.yokoten
        : typeof submitData.value?.yokoten === 'string' &&
          submitData.value.yokoten
          ? JSON.parse(submitData.value.yokoten)
          : []
      sparepart_list.value = Array.isArray(submitData.value?.sparepart_list)
        ? submitData.value.sparepart_list.map(item => ({
            ...item,
            quantity: parseInt(item.quantity) || 1,
            total: parseFloat(item.total) || 0
          }))
        : typeof submitData.value?.sparepart_list === 'string' &&
          submitData.value.sparepart_list
        ? JSON.parse(submitData.value.sparepart_list).map(item => ({
            ...item,
            quantity: parseInt(item.quantity) || 1,
            total: parseFloat(item.total) || 0
          }))
        : []

      // Populate missing fields for existing spareparts
      let populatedCount = 0;
      sparepart_list.value = sparepart_list.value.map(item => {
        if (!item.material_number || !item.sparepart_id) {
          const found = allSpareparts.value.find(sp => sp.sparepart_nm === item.sparepart?.label);
          if (found) {
            populatedCount++;
            return {
              ...item,
              material_number: item.material_number || found.material_number,
              sparepart_id: item.sparepart_id || found.sparepart_id,
              sparepartTr: found.sparepartTr || item.sparepartTr || `${localSubmit.value.fidProblem}-${found.material_number}`,
              price: item.price || found.price,
              vendor: item.vendor || found.vendor,
              status: item.status || found.status,
            };
          }
        }
        return item;
      });
      console.log(`Sparepart population: ${populatedCount} items populated, total ${sparepart_list.value.length} spareparts.`);
      if (populatedCount > 0) {
        console.log('Population successful for existing spareparts.');
      }

      // Ensure sparepart object is properly formatted for new parts
      sparepart_list.value = sparepart_list.value.map(item => {
        if (item.newPart === '1' && typeof item.sparepart === 'string') {
          return {
            ...item,
            sparepart: { label: item.sparepart, id: item.sparepart_id || null }
          };
        }
        return item;
      });

      // Convert partSimilar from object to string if necessary
      sparepart_list.value = sparepart_list.value.map(item => ({
        ...item,
        partSimilar: item.partSimilar && typeof item.partSimilar === 'object' ? item.partSimilar.text || '' : item.partSimilar,
      }));
    })



    const onMachineInput = () => {
      console.log('Machine input changed:', localSubmit.value.machineName)
    }
    const handleSubmit = () => {
      validatedCustom01.value = true
      saveSubmit()
    }
    const formatDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return null
      const date = new Date(dateTimeStr)
      // Konversi ke format ISO untuk konsistensi
      return date.toISOString().slice(0, 19).replace('T', ' ')
    }

    const normalizeDateTime = (dateTimeStr) => {
      if (!dateTimeStr) return null
      const date = new Date(dateTimeStr)
      // Normalisasi untuk menghindari masalah timezone
      const offset = date.getTimezoneOffset()
      const normalizedDate = new Date(date.getTime() + (offset * 60000))
      return normalizedDate.toISOString().slice(0, 19).replace('T', ' ')
    }
    const saveSubmit = () => {
      try {
        let avCategories = '';

        avCategories = localSubmit.value.avCategory

        if (!localSubmit.value || !localSubmit.value.machineName) {
          alert('Please input machine name')
          return
        }
        if (!localSubmit.value.line) {
          alert('Please input line')
          return
        }
        if (!localSubmit.value.problems) {
          alert('Please input problems')
          return
        }
        if (
          !localSubmit.value.operator ||
          localSubmit.value.operator.length === 0
        ) {
          alert('Please select at least one operator')
          return
        }
        if (!localSubmit.value.fidProblem) {
          alert('Please input fid')
          return
        }
        if (!localSubmit.value.agreeTerms) {
          alert('You must agree to terms and conditions before submitting')
          return
        }
        if (localSubmit.value.oCategory === '3' && !localSubmit.value.pmCategory) {
          alert('Please select the PM Category.')
          return
        }

        // Validate that all spareparts have sparepart_id and sparepartTr is consistent
        // if (localSubmit.value.sparepart_list && localSubmit.value.sparepart_list.length > 0) {
        //   for (const sp of localSubmit.value.sparepart_list) {
        //     // if (!sp.sparepart_id) {
        //     //   alert('All spareparts must have sparepart_id before submitting.')
        //     //   return
        //     // }
        //     // Ensure sparepartTr matches sparepart_id or material_number
        //     if (!sp.sparepartTr || (sp.sparepartTr !== sp.sparepart_id && sp.sparepartTr !== sp.material_number)) {
        //       sp.sparepartTr = sp.sparepart_id;
        //     }
        //   }
        // }

        isSaving.value = true

        // Helper: resolve PIC label dari ID
        const resolvePicLabel = (value) => {
          const found = Array.isArray(picOptions.value)
            ? picOptions.value.find((opt) => String(opt.value) === String(value))
            : null
          return found?.label || (value ?? '')
        }

        // Map list agar field pic berisi label (nama), bukan ID
        const mapPicToLabel = (list) =>
          Array.isArray(list)
            ? list.map((item) => ({
                ...item,
                pic: resolvePicLabel(item.pic),
              }))
            : []

        // Simpan versi yang sudah termap untuk dikirim ke backend
        localSubmit.value.countermeasureKenapaTerjadiList = mapPicToLabel(
          countermeasureKenapaTerjadiList.value,
        )
        localSubmit.value.countermeasureKenapaLamaList = mapPicToLabel(
          countermeasureKenapaLamaList.value,
        )
        localSubmit.value.yokotenList = mapPicToLabel(yokotenList.value)
        localSubmit.value.sparepart_list = sparepart_list.value



        // Prepare tambahAnalysis data - ensure we have valid arrays
        const tambahAnalysisTerjadiData = convertTreeNodeToBackend(localSubmit.value.tambahAnalysisTerjadi || [])
        const tambahAnalisisLamaData = convertTreeNodeToBackend(localSubmit.value.tambahAnalisisLama || [])

        // Ensure pmCategory is set to null if oCategory is not '3' before submitting
        let pmCategoryForSubmit = localSubmit.value.pmCategory;
        if (localSubmit.value.oCategory !== '3') {
          pmCategoryForSubmit = '0';
        }

        const submitDataFormatted = {
          machineName: localSubmit.value.machineName ?? '',
          line: localSubmit.value.line ?? '',
          operationNo: localSubmit.value.operationNo ?? '',
          maker: localSubmit.value.maker ?? '',
          problems: localSubmit.value.problems ?? '',
          uraianKejadian: localSubmit.value.uraianKejadian ?? '',
          uploadImage: localSubmit.value.uploadImage ?? '',
          ilustrasiStandart: localSubmit.value.ilustrasiStandart ?? '',
          standartImage: localSubmit.value.standartImage ?? '',
          ilustrasiActual: localSubmit.value.ilustrasiActual ?? '',
          actualImage: localSubmit.value.actualImage ?? '',
          gapBetweenStandarAndActual:
            localSubmit.value.gapBetweenStandarAndActual ?? '',
          pilihFocusThemaMember: localSubmit.value.pilihFocusThemaMember ?? '',
          pilihTaskforce: localSubmit.value.pilihTaskforce ?? '',
          operator: localSubmit.value.operator ?? [],
          avCategory: avCategories ?? '',
          shift: localSubmit.value.shift ?? '',
          startDate: formatDateTime(localSubmit.value.startDate),
          finishDate: formatDateTime(localSubmit.value.finishDate),
          durationMin: localSubmit.value.durationMin ?? '',
          problemCategory: localSubmit.value.problemCategory ?? '',
          itemTemporaryAction: localSubmit.value.itemTemporaryAction ?? '',
          rootcauses5Why: localSubmit.value.rootcauses5Why ?? [],
          ...( (localSubmit.value.stepRepair ?? []).filter(item => item.stepDesc && item.stepDesc.trim().length > 0).length > 0 && { stepRepair: (localSubmit.value.stepRepair ?? []).filter(item => item.stepDesc && item.stepDesc.trim().length > 0) } ),
          stepRepairNew: localSubmit.value.stepRepairNew ?? [],
          partChange: localSubmit.value.partChange ?? '',
          countermeasureKenapaTerjadi:
            localSubmit.value.countermeasureKenapaTerjadiList ?? [],
          yokoten: localSubmit.value.yokotenList ?? [],
          rootcause5WhyKenapaLama:
            localSubmit.value.rootcause5WhyKenapaLama ?? '',
          tambahAnalysisTerjadi: tambahAnalysisTerjadiData,
          tambahAnalisisLama: tambahAnalisisLamaData,
          whyImage: localSubmit.value.whyImage ?? '',
          whyLamaImage: localSubmit.value.whyLamaImage ?? '',
          comments5WhySH: localSubmit.value.comments5WhySH ?? '',
          comments5WhyLH: localSubmit.value.comments5WhyLH ?? '',
          commentsCountermeasure:
            localSubmit.value.commentsCountermeasure ?? '',
          attachmentMeeting: localSubmit.value.attachmentMeeting ?? '',
          file_report: localSubmit.value.file_report ?? '',
          uploadFile: localSubmit.value.uploadFile ?? '',
          fidProblem: localSubmit.value.fidProblem ?? '',
          agreeTerms: localSubmit.value.agreeTerms ?? false,
          oCategory: localSubmit.value.oCategory ?? '',
          qCategory: localSubmit.value.qCategory ?? '',
          pmCategory: pmCategoryForSubmit,
          cmKenapaLama: localSubmit.value.countermeasureKenapaLamaList ?? [],
          cmKenapaTerjadi: localSubmit.value.countermeasureKenapaTerjadiList ?? [],
          sparepart_list: localSubmit.value.sparepart_list ?? [],
          fiveWhyTlApprove: localSubmit.value.fiveWhyTlApprove ?? 0,
          fiveWhyLhApprove: localSubmit.value.fiveWhyLhApprove ?? 0,
          fiveWhyShApprove: localSubmit.value.fiveWhyShApprove ?? 0,
          cmTlApprove: localSubmit.value.cmTlApprove ?? 0,
          cmLhApprove: localSubmit.value.cmLhApprove ?? 0,
          cmShApprove: localSubmit.value.cmShApprove ?? 0,
          cmDhApprove: localSubmit.value.cmDhApprove ?? 0,
          fiveWhyLhFeedback: localSubmit.value.fiveWhyLhFeedback ?? '',
          fiveWhyShFeedback: localSubmit.value.fiveWhyShFeedback ?? '',
          cmLhFeedback: localSubmit.value.cmLhFeedback ?? '',
          cmShFeedback: localSubmit.value.cmShFeedback ?? '',
          cmTlFeedback: localSubmit.value.cmTlFeedback ?? '',
          cmDhFeedback: localSubmit.value.cmDhFeedback ?? '',
        }

        console.log('Submit data formatted:', submitDataFormatted)

        // Send data to backend using existing problem endpoint
        // const response = await fetch(`/api/smartandon/problem/${localSubmit.value.fidProblem}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(submitDataFormatted),
        // });

        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }

        // const result = await response.json();
        // console.log('Data submitted successfully:', result);
        
        emit('submit', submitDataFormatted)
      } catch (error) {
        alert('Error during submit: ' + error.message)
        isSaving.value = false
      }
    }
    const shiftName = ref('')
    const oCategoryName = ref('')
    const qCategoryName = ref('')
    const pmCategoryName = ref('')
    const problemCategoryName = ref('')
    watch(
      () => localSubmit.value.shift,
      (newShift) => {
        if (newShift === 'r') shiftName.value = 'Red'
        else if (newShift === 'w') shiftName.value = 'White'
        else shiftName.value = ''
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.oCategory,
      (newO6) => {
        console.log('O6 ini:', localSubmit.value.oCategory)
        const o6Map = {
          1: 'O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))',
          2: 'O2: Henkaten Issue (No Enough Trial, No Confirm (others team))',
          3: 'O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)',
          4: 'O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)',
          5: 'O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))',
          6: 'O6: Lifetime Issue (Out of Standard Running, Over Capacity)',
        }
        oCategoryName.value = o6Map[newO6] || ''
        console.log('O6 ini 1:', localSubmit.value.oCategory)
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.problemCategory,
      (newCategory) => {
        console.log(
          'Problem Category changed:',
          localSubmit.value.problemCategory,
        )
        const categoryMap = {
          1: 'Small',
          2: 'Repeat',
          3: 'LTR',
          4: 'SLTR'
        }
        problemCategoryName.value = categoryMap[newCategory] || ''
        console.log(
          'Problem Category changed 1:',
          localSubmit.value.problemCategory,
        )
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.qCategory,
      (newQ6) => {
        console.log('Q6 ini:', localSubmit.value.qCategory)
        const q6Map = {
          1: 'Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))',
          2: 'Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)',
          3: 'Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)',
          4: 'Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)',
          5: 'Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))',
          6: "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)",
        }
        qCategoryName.value = q6Map[newQ6] || ' '
        console.log('Q6 ini 1:', localSubmit.value.qCategory)
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.pmCategory,
      (newPM6) => {
        console.log('PM6 ini:', localSubmit.value.pmCategory)
        const pm6Map = {
          1: 'PM1: No Have / Unclear Item',
          2: 'PM2: Un-clear Method',
          3: 'PM3: Confine / Invinsible Area',
          4: 'PM4: Out of Period Check',
          5: 'PM5: No Have Time',
          6: 'PM6: Lack of Skill',
        }
        pmCategoryName.value = pm6Map[newPM6] || ' '
        console.log('PM ini 1:', localSubmit.value.pmCategory)
      },
      { immediate: true },
    )
    watch(
      () => localSubmit.value.oCategory,
      (newO6) => {
        if (newO6 !== '3') {
          localSubmit.value.pmCategory = '';
          pmCategoryName.value = '';
        }
      }
    )
    console.log('Local submit data: ' + localSubmit.value)
    console.log(
      'Local submit data 2:',
      JSON.stringify(localSubmit.value, null, 2),
    )
    const stopSaving = () => {
      isSaving.value = false
    }
    const editRootcause = (index) => {
      if (!Array.isArray(localSubmit.value.rootcauses5Why)) {
        console.error('editRootcause1: rootcauses5Why is not an array')
        return
      }
      const id = localSubmit.value.rootcauses5Why[index]?.id
      if (id === undefined) {
        console.error('editRootcause1: id is undefined for index', index)
        return
      }
      const currentState = editingRootcauses.value[id]
      if (!currentState || currentState === false) {
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: true,
        }
      } else if (currentState === true) {
        editingRootcauses.value = {
          ...editingRootcauses.value,
          [id]: false,
        }
      }
    }

    watch(
      () => props.visible,
      (newVal) => {
        if (!newVal) {
          isSaving.value = false
        }
      },
    )

    // Watch for startDate and finishDate changes to auto-calculate durationMin
    watch(
      [() => localSubmit.value.startDate, () => localSubmit.value.finishDate],
      ([startDate, finishDate]) => {
        if (startDate && finishDate) {
          const start = new Date(startDate);
          const finish = new Date(finishDate);
          if (!isNaN(start.getTime()) && !isNaN(finish.getTime())) {
            const diffInMs = Math.abs(finish.getTime() - start.getTime());
            const durationInMin = Math.floor(diffInMs / (1000 * 60));
            localSubmit.value.durationMin = durationInMin.toString();
          } else {
            localSubmit.value.durationMin = '';
          }
        } else {
          localSubmit.value.durationMin = '';
        }
      },
      { immediate: true }
    )

    // Remove the deep watch on localSubmit to prevent recursive updates
    // Instead, use specific watchers for individual properties

    watch(() => [localSubmit.value.tambahAnalysisTerjadi, localSubmit.value.tambahAnalisisLama], ([terjadi, lama]) => {
      if (hasAnalysisContent(terjadi) && hasAnalysisContent(lama)) {
        localSubmit.value.fiveWhyTlApprove = 1;
      }
    }, { deep: true });

    watch(() => [countermeasureKenapaTerjadiList.value, countermeasureKenapaLamaList.value], ([terjadi, lama]) => {
      if (hasCountermeasureContent(terjadi) && hasCountermeasureContent(lama)) {
        localSubmit.value.cmTlApprove = 1;
      }
    }, { deep: true });
    const yokotenForm = ref({
      machine: '',
      pic: '',
      datePlan: '',
      judg: false,
    })
    const yokotenList = ref([])
    const showYokotenForm = ref(false)

    const submitYokoten = () => {
      if (typeof yokotenForm.value._editIdx === 'number') {
        yokotenList.value[yokotenForm.value._editIdx] = { ...yokotenForm.value }
        delete yokotenForm.value._editIdx
      } else {
        yokotenList.value.push({ ...yokotenForm.value })
      }
      showYokotenForm.value = false
      yokotenForm.value = { machine: '', pic: '', datePlan: '', judg: false }
    }

    const editYokoten = (idx) => {
      const item = yokotenList.value[idx]
      if (item) {
        const picOption = picOptions.value.find(opt => String(opt.value) === String(item.pic))
        yokotenForm.value = {
          ...item,
          pic: picOption ? picOption.value : item.pic
        }
        showYokotenForm.value = true
        yokotenForm.value._editIdx = idx
      }
    }

    const removeYokoten = (idx) => {
      yokotenList.value.splice(idx, 1)
    }

    const cancelYokoten = () => {
      showYokotenForm.value = false
      yokotenForm.value = { machine: '', pic: '', datePlan: '', judg: false }
    }

    const submitCountermeasureKenapaTerjadi = () => {
      if (typeof countermeasureKenapaTerjadiForm.value._editIdx === 'number') {
        countermeasureKenapaTerjadiList.value[
          countermeasureKenapaTerjadiForm.value._editIdx
        ] = {
          ...countermeasureKenapaTerjadiForm.value,
        }
        delete countermeasureKenapaTerjadiForm.value._editIdx
      } else {
        countermeasureKenapaTerjadiList.value.push({
          ...countermeasureKenapaTerjadiForm.value,
        })
      }
      showCountermeasureKenapaTerjadiForm.value = false
      countermeasureKenapaTerjadiForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        result: '',
        judg: 'belum',
      }
    }
    const cancelCountermeasureKenapaTerjadi = () => {
      showCountermeasureKenapaTerjadiForm.value = false
      countermeasureKenapaTerjadiForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        result: '',
        judg: 'belum',
      }
    }
    const editCountermeasureKenapaTerjadi = (idx) => {
      const item = countermeasureKenapaTerjadiList.value[idx]
      if (item) {
        const picOption = picOptions.value.find(opt => String(opt.value) === String(item.pic))
        countermeasureKenapaTerjadiForm.value = {
          ...item,
          pic: picOption ? picOption.value : item.pic
        }
        showCountermeasureKenapaTerjadiForm.value = true
        countermeasureKenapaTerjadiForm.value._editIdx = idx
      }
    }
    const removeCountermeasureKenapaTerjadi = (idx) => {
      countermeasureKenapaTerjadiList.value.splice(idx, 1)
    }
    watch(
      () => countermeasureKenapaTerjadiForm.value.isAction,
      (val) => {
        if (val) {
          countermeasureKenapaTerjadiForm.value.cmDesc = '[ACTION]'
        } else {
          countermeasureKenapaTerjadiForm.value.cmDesc = ''
        }
      },
    )

    const submitCountermeasureKenapaLama = () => {
      if (typeof countermeasureKenapaLamaForm.value._editIdx === 'number') {
        countermeasureKenapaLamaList.value[
          countermeasureKenapaLamaForm.value._editIdx
        ] = {
          ...countermeasureKenapaLamaForm.value,
        }
        delete countermeasureKenapaLamaForm.value._editIdx
      } else {
        countermeasureKenapaLamaList.value.push({
          ...countermeasureKenapaLamaForm.value,
        })
      }
      showCountermeasureKenapaLamaForm.value = false
      countermeasureKenapaLamaForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        judge: 'belum',
      }
    }

    const editStepRepair = (index) => {
      console.log('editStepRepair called with index:', index)
      console.log('localSubmit.stepRepair:', localSubmit.value.stepRepair)
      if (
        !localSubmit.value.stepRepair ||
        !Array.isArray(localSubmit.value.stepRepair)
      ) {
        console.error(
          'editStepRepair: stepRepair is not an array or is undefined',
        )
        return
      }
      if (index < 0 || index >= localSubmit.value.stepRepair.length) {
        console.error('editStepRepair: index out of bounds', index)
        return
      }
      const item = localSubmit.value.stepRepair[index]
      if (!item || typeof item.id === 'undefined') {
        console.error(
          'editStepRepair: item or item.id is undefined for index',
          index,
        )
        return
      }
      const id = item.id
      console.log('editStepRepair id:', id)
      console.log('editingStepRepair:', editingStepRepair.value)
      const currentState = editingStepRepair.value[id]
      if (!currentState || currentState === false) {
        editingStepRepair.value = {
          ...editingStepRepair.value,
          [id]: true,
        }
      } else if (currentState === true) {
        editingStepRepair.value = {
          ...editingStepRepair.value,
          [id]: false,
        }
      }
    }

    const cancelCountermeasureKenapaLama = () => {
      showCountermeasureKenapaLamaForm.value = false
      countermeasureKenapaLamaForm.value = {
        isAction: false,
        cmDesc: '',
        datePlan: '',
        category: '',
        pic: '',
        judge: 'belum',
      }
    }
    const editCountermeasureKenapaLama = (idx) => {
      const item = countermeasureKenapaLamaList.value[idx]
      if (item) {
        const picOption = picOptions.value.find(opt => String(opt.value) === String(item.pic))
        countermeasureKenapaLamaForm.value = {
          ...item,
          pic: picOption ? picOption.value : item.pic
        }
        showCountermeasureKenapaLamaForm.value = true
        countermeasureKenapaLamaForm.value._editIdx = idx
      }
    }
    const removeCountermeasureKenapaLama = (idx) => {
      countermeasureKenapaLamaList.value.splice(idx, 1)
    }
    watch(
      () => countermeasureKenapaLamaForm.value.isAction,
      (val) => {
        if (val) {
          countermeasureKenapaLamaForm.value.action = '[ACTION]'
        } else {
          countermeasureKenapaLamaForm.value.action = ''
        }
      },
    )

    const picOptions = ref([])
    const sparepartOptions = ref([])
    const allSpareparts = ref([])
    const sparepart_list = ref([])
    const filteredMemberOption = ref([])
    const showSparepartForm = ref(false)
    const currentUserRole = ref('')
    const currentUserName = ref('')
    const showCommentModal = ref(false)
    const commentText = ref('')
    const currentSection = ref('')
    const currentFeedbackField = ref('')
    const currentApproveField = ref('')
    const sparepartForm = ref({
      sparepart: null,
      price: '',
      vendor: '',
      status: '1',
      quantity: 1,
      total: 0,
      isModify: 'NO',
      description: ''
    })

    // Dummy options for static test
    const dummyOptions = ref([
      { value: 1, text: 'Dummy Sparepart 1' },
      { value: 2, text: 'Dummy Sparepart 2' },
      { value: 3, text: 'Dummy Sparepart 3' },
      { value: 4, text: 'Dummy Sparepart 4' },
      { value: 5, text: 'Dummy Sparepart 5' }
    ])
    const dummySelected = ref(null)

    watch(showSparepartForm, (newVal) => {
      if (newVal) {
        console.log('Watcher triggered: showSparepartForm is true, loading initial sparepart options');
        onSparepartSearch('');
      }
    });

    const nameWithLang = (option) => {
      return `${option.label} — [${option.id}]`
    }

    const getLastSparepartId = async () => {
      try {
        console.log('Fetching last sparepart_id...');
        const sparepartRes = await api.get('/smartandon/spareparts/last-id');
        console.log('API response for last sparepart_id:', sparepartRes.status);

        if (sparepartRes.status === 200) {
          const maxId = sparepartRes.data.data || 0;
          console.log('Found max sparepart_id:', maxId);
          return maxId;
        }
        throw new Error(`Failed to get last sparepart_id, status: ${sparepartRes.status}`);
      } catch (e) {
        console.error('Error getting last sparepart_id:', e);
        return 0; // Return 0 as fallback
      }
    };

    const onSparepartSearch = async (searchQuery) => {
      console.log('onSparepartSearch called with:', searchQuery);
      try {
        const params = { limit: 100 };
        if (searchQuery && searchQuery.trim() !== '') {
          params.search = searchQuery.trim();
        }
        console.log('Calling API with params:', params);
        const sparepartRes = await api.get('/smartandon/spareparts', params);
        console.log('API response status:', sparepartRes.status);
        if (sparepartRes.status === 200) {
          console.log('Sparepart options data for search:', searchQuery, sparepartRes.data);

          // Handle both direct array and wrapped response
          const spareparts = sparepartRes.data.data || sparepartRes.data;
          sparepartOptions.value = Array.isArray(spareparts)
            ? spareparts.map((sp) => ({
                value: sp.sparepart_id,
                text: sp.sparepart_nm,
                price: sp.price,
                vendor: sp.vendor,
                status: sp.status,
                material_number: sp.material_number,
                sparepart_id: sp.sparepart_id,
              })).sort((a, b) => a.text.localeCompare(b.text))
            : [];
          console.log('Processed sparepart options length:', sparepartOptions.value.length);
          console.log('First few sparepart options:', sparepartOptions.value.slice(0, 5));
          console.log('ModelSelect should now have options:', sparepartOptions.value);
        } else {
          throw new Error(`Failed to load spareparts, status: ${sparepartRes.status}`);
        }
      } catch (e) {
        console.error('Error loading spareparts for search:', e);
        sparepartOptions.value = [];
        console.log('Options set to empty due to error');
      }
    };

    const handleSparepartSearch = (searchQuery) => {
      console.log('handleSparepartSearch called with:', searchQuery);
      onSparepartSearch(searchQuery);
    };

    onMounted(async () => {
      try {
        // First, fetch current user data
        console.log('Fetching current user data...')
        const userRes = await api.get('/user/user')
        console.log('Current user response:', userRes)
        let currentUserNoreg = ''
        if (userRes.status === 200 && userRes.data && userRes.data.user) {
          currentUserNoreg = userRes.data.user.fnoreg || userRes.data.user.noreg || ''
          currentUserRole.value = userRes.data.user.frole || ''
          currentUserName.value = userRes.data.user.fname || userRes.data.user.name || ''
          console.log('Current user noreg:', currentUserNoreg)
          console.log('Current user role:', currentUserRole.value)
          console.log('Current user name:', currentUserName.value)
        } else {
          console.warn('Failed to fetch current user data')
        }

        console.log('Loading PIC options...')
        const res = await api.get('/smartandon/member')
        console.log('API response for members:', res)
        if (res.status === 200) {
          const data = res.data.data || res.data

          // Filter members by current user's noreg for PIC options (keep filtered for PIC)
          let filteredData = data
          if (currentUserNoreg) {
            filteredData = data.filter(member => member.fnoreg === currentUserNoreg)
            // console.log(`Filtered members by noreg ${currentUserNoreg}:`, filteredData.length, 'members found')
          } else {
            console.warn('No current user noreg available, showing all members')
          }

          // Set current user role from filtered member data
          if (filteredData.length > 0) {
            currentUserRole.value = filteredData[0].frole || ''
            console.log('Current user role from member data:', currentUserRole.value)
          } else {
            console.warn('No member data found for current user')
          }

          // Print detailed member data from tb_mt_member
          if (Array.isArray(filteredData)) {
            console.log('Filtered member data:')
            filteredData.forEach(member => {
              console.log({
                fid: member.fid,
                fname: member.fname,
                fnoreg: member.fnoreg,
                farea: member.farea,
                fline: member.fline,
                fshift: member.fshift,
                frole: member.frole,
                fwa_no: member.fwa_no,
                approval: member.approval,
                fmt_id: member.fmt_id,
                fimage: member.fimage,
                line_nm: member.line_nm,
              })
            })
          }

          picOptions.value = Array.isArray(data)
            ? data.map((m) => ({
              id: m.fname,
              label: m.fname,
            }))
            : []
          console.log('picOptions set to:', picOptions.value)

          // Set filteredMemberOption for operator selection to all members (not filtered)
          filteredMemberOption.value = Array.isArray(data)
            ? data.map((m) => ({
              id: m.fid,
              label: m.fname,
            }))
            : []
          console.log('filteredMemberOption set to:', filteredMemberOption.value)
        } else {
          throw new Error(`Failed to load members, status: ${res.status}`)
        }
      } catch (e) {
        console.error('Error loading PIC options:', e)
        picOptions.value = []
        filteredMemberOption.value = []
      }

      // Load all spareparts for populating existing data
      try {
        const allSparepartRes = await api.get('/smartandon/spareparts');
        allSpareparts.value = allSparepartRes.data.data || [];
        console.log('All spareparts loaded:', allSpareparts.value.length);
      } catch (e) {
        console.error('Error loading all spareparts:', e);
        allSpareparts.value = [];
      }

      // Load initial sparepart options
      await onSparepartSearch('');
    })

    const addRootcause = () => {
      if (!localSubmit.value.rootcauses5Why) {
        localSubmit.value.rootcauses5Why = []
      }
      if (localSubmit.value.rootcauses5Why.length < 5) {
        const newId = localSubmit.value.rootcauses5Why.length
          ? Math.max(
            ...localSubmit.value.rootcauses5Why.map((item) => item.id),
          ) + 1
          : 1
        localSubmit.value.rootcauses5Why.push({ id: newId, description: '' })
      }
    }

    const deleteRootcause = (index) => {
      if (
        !localSubmit.value.rootcauses5Why ||
        !localSubmit.value.rootcauses5Why[index]
      ) {
        return
      }
      if (Array.isArray(localSubmit.value.rootcauses5Why)) {
        localSubmit.value.rootcauses5Why.splice(index, 1)
      } else {
        localSubmit.value.rootcauses5Why = []
      }
    }

    const addStepRepair = () => {
      if (!localSubmit.value.stepRepair) {
        localSubmit.value.stepRepair = []
      }
      if (localSubmit.value.stepRepair.length < 5) {
        const newId = localSubmit.value.stepRepair.length
          ? Math.max(...localSubmit.value.stepRepair.map((item) => item.id)) + 1
          : 1
        localSubmit.value.stepRepair.push({ id: newId, description: '' })
      }
    }

    const deleteStepRepair = (index) => {
      if (
        !localSubmit.value.stepRepair ||
        !localSubmit.value.stepRepair[index]
      ) {
        return
      }
      if (Array.isArray(localSubmit.value.stepRepair)) {
        localSubmit.value.stepRepair.splice(index, 1)
      } else {
        localSubmit.value.stepRepair = []
      }
    }

    const submitSparepart = async () => {
      try {
        console.log('submitSparepart called');
        console.log('sparepartForm entire state:', JSON.stringify(sparepartForm.value, null, 2));

      const selectedSparepart = sparepartForm.value.sparepart;
      const selectedPartSimilar = sparepartForm.value.partSimilar;
      if (sparepartForm.value.newPart === '1') {
        if (!selectedSparepart || selectedSparepart.trim() === '') {
          alert('Please enter a valid sparepart name.');
          console.log('Sparepart name is empty for new part, aborting submit');
          return;
        }
      } else {
        if (!selectedSparepart || !selectedSparepart.text || selectedSparepart.text.trim() === '') {
          alert('Please select a sparepart with a valid name.');
          console.log('Sparepart name is empty, aborting submit');
          return;
        }
      }

        if (!sparepartForm.value.status || sparepartForm.value.status === '') {
          alert('Please select a status before submitting.');
          return;
        }

        if (!sparepartForm.value.quantity || sparepartForm.value.quantity < 1) {
          alert('Please enter a valid quantity (at least 1) before submitting.');
          return;
        }

        console.log('selectedSparepart:', JSON.stringify(selectedSparepart, null, 2));
        console.log('selectedPartSimilar:', JSON.stringify(selectedPartSimilar, null, 2));

        let sparepartObj = {};
        let price = '';
        let vendor = '';
        let material_number = '';
        let sparepart_id = '';

        if (sparepartForm.value.newPart === '1') {
          // For new part, sparepart is a string (name)
          sparepartObj = { label: selectedSparepart };
          price = sparepartForm.value.price || '';
          vendor = sparepartForm.value.vendor ? sparepartForm.value.vendor.toUpperCase() : '';
          material_number = sparepartForm.value.materialNumber || '';
          // Check if editing existing new part
          if (typeof sparepartForm.value._editIdx === 'number') {
            // Use existing sparepart_id if editing
            sparepart_id = sparepart_list.value[sparepartForm.value._editIdx]?.sparepart_id || '';
            console.log('Using existing sparepart_id for edit:', sparepart_id);
          }
          if (!sparepart_id || sparepart_id === '' || sparepart_id === '0' || sparepart_id === null) {
            // Generate new sparepart_id using local counter to avoid collision
            if (lastGeneratedSparepartId.value === 0) {
              lastGeneratedSparepartId.value = await getLastSparepartId();
            }
            lastGeneratedSparepartId.value += 1;
            sparepart_id = lastGeneratedSparepartId.value.toString();
            console.log('Generated new sparepart_id:', sparepart_id);
            // Create the new sparepart in the master table
            try {
              await api.post('/smartandon/spareparts', {
                sparepart_nm: selectedSparepart,
                material_number: material_number,
                sparepart_id: sparepart_id,
                price: price,
                vendor: vendor
              });
              console.log('New sparepart created in master table');
            } catch (createError) {
              console.error('Error creating sparepart in master table:', createError);
              // Continue anyway, as the sparepart is still added to the problem
            }
          }
        } else {
          sparepartObj = { id: selectedSparepart.value, label: selectedSparepart.text };
          if (sparepartForm.value.status === '1' || sparepartForm.value.status === 1) {
            // ORIGINAL PART
            console.log('MASUK SPAREPART 1');
            price = selectedSparepart.price || '';
            vendor = selectedSparepart.vendor || '';
            material_number = selectedSparepart.material_number || '';
            sparepart_id = selectedSparepart.sparepart_id || '';
          } else if (sparepartForm.value.status === '2' || sparepartForm.value.status === 2) {
            console.log('MASUK SPAREPART 2');
            // SIMILAR PART
            if (selectedPartSimilar && typeof selectedPartSimilar === 'object') {
              console.log('MASUK SPAREPART 3');
              price = selectedPartSimilar.price || '';
              vendor = selectedPartSimilar.vendor || '';
              material_number = selectedPartSimilar.material_number || '';
              sparepart_id = selectedPartSimilar.sparepart_id || '';
            } else {
              console.log('MASUK SPAREPART 4');
              price = selectedSparepart.price || '';
              vendor = selectedSparepart.vendor || '';
              material_number = selectedSparepart.material_number || '';
              sparepart_id = selectedSparepart.sparepart_id || '';
            }
          }
        }

        console.log('Hasil sparepart id:', sparepart_id);

        const newItem = {
          sparepart: sparepartObj,
          partSimilar: sparepartForm.value.partSimilar?.text || null,
          price: price,
          material_number: sparepartForm.value.materialNumber || material_number,
          vendor: vendor,
          quantity: sparepartForm.value.quantity || 1,
          status: parseInt(sparepartForm.value.status) || 0,
          isModify: sparepartForm.value.isModify || 'NO',
          total: sparepartForm.value.total || 0,
          sparepart_id: sparepart_id,
          newPart: sparepartForm.value.newPart || 0,
          description: sparepartForm.value.description || '',
          sparepartTr: `${localSubmit.value.fidProblem}-${material_number || Date.now()}`
        };
        newItem.sparepart_id = sparepart_id;
        console.log('newItem created:', JSON.stringify(newItem, null, 2));

        // Console log name to total for each submit
        console.log(`Submitting Sparepart: Name=${newItem.sparepart.label}, Price=${newItem.price}, Vendor=${newItem.vendor}, Quantity=${newItem.quantity}, Status=${newItem.status}, Total=${newItem.total}`);

        console.log('sparepart_list length before add:', sparepart_list.value.length);
        console.log('Is editing? _editIdx:', sparepartForm.value._editIdx);

        if (typeof sparepartForm.value._editIdx === 'number') {
          sparepart_list.value[sparepartForm.value._editIdx] = newItem;
          console.log('Updated item at index:', sparepartForm.value._editIdx);
          delete sparepartForm.value._editIdx
        } else {
          sparepart_list.value.push(newItem);
          console.log('Pushed new item to list');
        }

        console.log('sparepart_list length after add:', sparepart_list.value.length);
        console.log('Updated sparepart_list:', JSON.stringify(sparepart_list.value, null, 2));

        showSparepartForm.value = false
        sparepartForm.value = { sparepart: null, price: '', vendor: '', status: '1', quantity: 1, total: 0, newPart: 0, description: ''}
        console.log('Form reset and hidden');
      } catch (error) {
        console.error('Error in submitSparepart:', error);
      }
    }

    const editSparepart = async (idx) => {
      const item = sparepart_list.value[idx]
      if (item) {
        if (sparepartOptions.value.length === 0) {
          await onSparepartSearch('');
        }
        // Find the matching sparepart option object by value to set for Multiselect
        const matchedSparepartOption = sparepartOptions.value.find(
          (opt) => opt.value === item?.sparepart?.value || opt.value === item?.sparepart?.id
        ) || null;

        // Find the matching partSimilar option object by value or text to set for Multiselect
        const matchedPartSimilarOption = sparepartOptions.value.find(
          (opt) => {
            if (typeof item.partSimilar === 'string') {
              return opt.text === item.partSimilar;
            } else if (item.partSimilar && typeof item.partSimilar === 'object') {
              return opt.value === item.partSimilar.value || opt.value === item.partSimilar.id;
            }
            return false;
          }
        ) || null;

        console.log("INI STATUS:", item.status);
        // Map status string to number string
        let statusValue = '1';
        if (item.status === '1') {
          console.log("STATUS: 1");
          statusValue = '1';
        } else if (item.status === '2') {
          console.log("STATUS: 2");
          statusValue = '2';
        }

        // Handle newPart: if '1', set sparepart as string (label), else as option object
        let sparepartValue;
        if (item.newPart === '1') {
          sparepartValue = item.sparepart?.label || '';
        } else {
          sparepartValue = matchedSparepartOption;
        }

        console.log("NEW PART:", item.newPart);
        console.log("SPAREPART VALUE 1:", sparepartValue);

        sparepartForm.value = {
          sparepart: sparepartValue,
          partSimilar: matchedPartSimilarOption,
          price: item.price || '',
          vendor: item.vendor || '',
          quantity: item.quantity || 1,
          status: item.status,
          isModify: item.isModify || 'NO',
          total: item.total || 0,
          newPart: item.newPart || '0',
          description: item.description || '',
          materialNumber: item.material_number || ''
        };
        showSparepartForm.value = true
        sparepartForm.value._editIdx = idx
      }
    }

    const removeSparepart = (idx) => {
      sparepart_list.value.splice(idx, 1)
    }

    const cancelSparepart = () => {
      showSparepartForm.value = false
      sparepartForm.value = { sparepart: null, price: '', vendor: '', status: '', quantity: 1, total: 0, newPart: 0, description: ''}
    }

    const toggleSparepartForm = () => {
      console.log('Tambah Sparepart clicked, showing form');
      // Reset the form to null/empty values except status defaults to '1'
      sparepartForm.value = {
        sparepart: null,
        price: '',
        vendor: '',
        status: '1',
        quantity: 1,
        total: 0,
        isModify: 'NO',
        newPart: 0,
        description: ''
      };
      showSparepartForm.value = true;
    }



    const getFeedbackField = (approveField) => {
      return approveField.replace('Approve', 'Feedback');
    }

    const statusClass = (localSubmit, field) => {
      const status = localSubmit?.[field] || 0;
      const feedbackField = getFeedbackField(field);
      const hasFeedback = localSubmit?.[feedbackField] && localSubmit[feedbackField].trim() !== '';

      if (status === 1) {
        return hasFeedback ? 'status-comment' : 'status-approved';
      } else if (status === 2 || status === 'comment') {
        return 'status-comment';
      } else if (status === 0 || status === 'rejected') {
        return 'status-rejected';
      } else if (status === 'delay') {
        return 'status-delay';
      } else {
        return 'status-none';
      }
    }

    const onApprove = (section) => {
      console.log('Approve', section)
      console.log('Current user role:', currentUserRole.value)

      // Determine which field to update based on current user's role
      // ADMIN role is treated the same as SH (Section Head)
      const userRole = currentUserRole.value.toLowerCase()
      const effectiveRole = userRole === 'admin' ? 'sh' : userRole

    // Update approval status based on user's role
      if (section === '5why') {
        if (effectiveRole === 'tl') {
          localSubmit.value.fiveWhyTlApprove = 1
        } else if (effectiveRole === 'gl' || effectiveRole === 'gh' || effectiveRole === 'lh') {
          localSubmit.value.fiveWhyLhApprove = 1
        } else if (effectiveRole === 'sh') {
          localSubmit.value.fiveWhyShApprove = 1
        }
      } else if (section === 'counter') {
        if (effectiveRole === 'tl' || effectiveRole === 'gh') {
          localSubmit.value.cmTlApprove = 1
        } else if (effectiveRole === 'gl' || effectiveRole === 'lh') {
          localSubmit.value.cmLhApprove = 1
        } else if (effectiveRole === 'sh') {
          localSubmit.value.cmShApprove = 1
        } else if (effectiveRole === 'dph' || effectiveRole === 'dh') {
          localSubmit.value.cmDhApprove = 1
        }
      } else if (section === 'dph') {
        if (effectiveRole === 'dph' || effectiveRole === 'dh') {
          localSubmit.value.cmDhApprove = 1
        }
      }
    }
    
    const getFeedbackAndApproveFields = (section, effectiveRole) => {
      let feedbackField = ''
      let approveField = ''
      if (section === '5why') {
        if (effectiveRole === 'tl') {
          feedbackField = 'fiveWhyTlFeedback'
          approveField = 'fiveWhyTlApprove'
        } else if (effectiveRole === 'gl') {
          feedbackField = 'fiveWhyLhFeedback'
          approveField = 'fiveWhyLhApprove'
        } else if (effectiveRole === 'sh') {
          feedbackField = 'fiveWhyShFeedback'
          approveField = 'fiveWhyShApprove'
        }
      } else if (section === 'counter') {
        if (effectiveRole === 'tl') {
          feedbackField = 'cmTlFeedback'
          approveField = 'cmTlApprove'
        } else if (effectiveRole === 'gl') {
          feedbackField = 'cmLhFeedback'
          approveField = 'cmLhApprove'
        } else if (effectiveRole === 'sh') {
          feedbackField = 'cmShFeedback'
          approveField = 'cmShApprove'
        } else if (effectiveRole === 'dph') {
          feedbackField = 'cmDhFeedback'
          approveField = 'cmDhApprove'
        }
      } else if (section === 'dph') {
        feedbackField = 'cmDhFeedback'
        approveField = 'cmDhApprove'
      }
      return { feedbackField, approveField }
    }

    const onComment = (section) => {
      console.log('Comment clicked for section:', section)
      console.log('Current user role:', currentUserRole.value)

      const userRole = currentUserRole.value.toLowerCase()
      const effectiveRole = userRole === 'admin' ? 'sh' : userRole

      // Check if only GL or SH can comment on 5why and counter sections
      if ((section === '5why' || section === 'counter') && (effectiveRole !== 'gl' && effectiveRole !== 'sh')) {
        alert('Only GL or SH users can comment on this section.')
        return
      }

      // Check if only DPH role can comment on DPH section
      if (section === 'dph' && currentUserRole.value.toLowerCase() !== 'dph') {
        alert('Only DPH users can comment on this section.')
        return
      }

      let feedbackField = ''
      let approveField = ''

      if (section === '5why') {
        if (effectiveRole === 'tl') {
          feedbackField = 'fiveWhyTlFeedback'
          approveField = 'fiveWhyTlApprove'
        } else if (effectiveRole === 'gl') {
          feedbackField = 'fiveWhyLhFeedback'
          approveField = 'fiveWhyLhApprove'
        } else if (effectiveRole === 'sh') {
          feedbackField = 'fiveWhyShFeedback'
          approveField = 'fiveWhyShApprove'
        } else {
          feedbackField = 'fiveWhyTlFeedback'
          approveField = 'fiveWhyTlApprove'
        }
      } else if (section === 'counter') {
        if (effectiveRole === 'tl') {
          feedbackField = 'cmTlFeedback'
          approveField = 'cmTlApprove'
        } else if (effectiveRole === 'gl') {
          feedbackField = 'cmLhFeedback'
          approveField = 'cmLhApprove'
        } else if (effectiveRole === 'sh') {
          feedbackField = 'cmShFeedback'
          approveField = 'cmShApprove'
        } else if (effectiveRole === 'dph') {
          feedbackField = 'cmDhFeedback'
          approveField = 'cmDhApprove'
        } else {
          feedbackField = 'cmTlFeedback'
          approveField = 'cmTlApprove'
        }
      } else if (section === 'dph') {
        feedbackField = 'cmDhFeedback'
        approveField = 'cmDhApprove'
      }

      if (feedbackField && approveField) {
        currentSection.value = section
        currentFeedbackField.value = feedbackField
        currentApproveField.value = approveField
        commentText.value = localSubmit.value[feedbackField] || ''
        showCommentModal.value = true
      } else {
        console.error('No feedback field found for section')
      }
    }

    const submitComment = () => {
      if (currentFeedbackField.value && currentApproveField.value) {
        localSubmit.value[currentFeedbackField.value] = commentText.value.trim()
        localSubmit.value[currentApproveField.value] = 1
      }
      showCommentModal.value = false
      commentText.value = ''
    }

    const onSparepartSelect = (selected) => {
      console.log('onSparepartSelect called with:', selected, 'Type:', typeof selected); // Enhanced: Log selected and its type

      if (selected && typeof selected === 'object') {
        console.log('Using selected object directly');
        sparepartForm.value.price = selected.price || '';
        sparepartForm.value.vendor = selected.vendor || '';
        // Set status to '1' (ORIGINAL PART) by default
        sparepartForm.value.status = '1';
        console.log('Set price:', sparepartForm.value.price, 'vendor:', sparepartForm.value.vendor, 'status:', sparepartForm.value.status);
      } else {
        console.log('Clearing sparepart fields (no selection or invalid)');
        sparepartForm.value.price = '';
        sparepartForm.value.vendor = '';
        sparepartForm.value.status = '1';
        sparepartForm.value.quantity = 1;
        sparepartForm.value.total = 0;
        sparepartForm.value.newPart = 0;
        sparepartForm.value.description = '';
      }
    }

    const onPartSimilarSelect = (selected) => {
      console.log('onPartSimilarSelect called with:', selected);
      if (selected && typeof selected === 'object') {
        console.log('Setting part similar fields');
        sparepartForm.value.price = selected.price || '';
        sparepartForm.value.vendor = selected.vendor || '';
        // Recalculate total based on new price
        const p = parseFloat(selected.price) || 0;
        const q = parseFloat(sparepartForm.value.quantity) || 1;
        sparepartForm.value.total = (p * q).toFixed(2);
        console.log('Set price:', sparepartForm.value.price, 'vendor:', sparepartForm.value.vendor, 'total:', sparepartForm.value.total);
      } else {
        console.log('Clearing part similar fields');
        sparepartForm.value.price = '';
        sparepartForm.value.vendor = '';
        sparepartForm.value.total = 0;
      }
    }

    // Combined watch for sparepart, partSimilar, and status to populate price/vendor accordingly
    watch(
      [() => sparepartForm.value.sparepart, () => sparepartForm.value.partSimilar, () => sparepartForm.value.status],
      ([newSparepart, newPartSimilar, newStatus]) => {
        console.log('Combined watch triggered:', { newSparepart, newPartSimilar, newStatus });
        // For new parts, don't overwrite price/vendor, keep the values set in editSparepart
        if (sparepartForm.value.newPart === '1') {
          return;
        }
        if (newStatus === '1' || newStatus === 1) {
          // ORIGINAL PART - populate from sparepart
          if (newSparepart && typeof newSparepart === 'object') {
            sparepartForm.value.price = newSparepart.price || '';
            sparepartForm.value.vendor = newSparepart.vendor || '';
            console.log('Populated price/vendor from sparepart for ORIGINAL PART');
          } else {
            sparepartForm.value.price = '';
            sparepartForm.value.vendor = '';
          }
        } else if (newStatus === '2' || newStatus === 2) {
          // SIMILAR PART - populate from partSimilar
          if (newPartSimilar && typeof newPartSimilar === 'object') {
            sparepartForm.value.price = newPartSimilar.price || '';
            sparepartForm.value.vendor = newPartSimilar.vendor || '';
            console.log('Populated price/vendor from partSimilar for SIMILAR PART');
          } else {
            sparepartForm.value.price = '';
            sparepartForm.value.vendor = '';
          }
        } else {
          sparepartForm.value.price = '';
          sparepartForm.value.vendor = '';
        }
      },
      { immediate: true }
    );

    // Watch price and quantity changes to auto-calculate total
    watch([() => sparepartForm.value.price, () => sparepartForm.value.quantity], ([price, quantity]) => {
      const p = parseFloat(price) || 0;
      const q = parseFloat(quantity) || 1;
      sparepartForm.value.total = (p * q).toFixed(2);
      console.log('Total calculated:', sparepartForm.value.total, 'from price:', price, 'quantity:', quantity);
    }, { immediate: true });

    const cancelComment = () => {
      showCommentModal.value = false
      commentText.value = ''
    }

    const onStepRepairValidationChange = (validation) => {
      console.log('Step Repair validation changed:', validation)
      // Handle validation state if needed
    }

    return {
      localSubmit,
      validatedCustom01,
      onMachineInput,
      handleSubmit,
      saveSubmit,
      shiftName,
      oCategoryName,
      qCategoryName,
      pmCategoryName,
      problemCategoryName,
      isSaving,
      stopSaving,
      editRootcause,
      countermeasureKenapaTerjadiList,
      countermeasureKenapaLamaList,
      showCountermeasureKenapaTerjadiForm,
      countermeasureKenapaTerjadiForm,
      submitCountermeasureKenapaTerjadi,
      cancelCountermeasureKenapaTerjadi,
      editCountermeasureKenapaTerjadi,
      removeCountermeasureKenapaTerjadi,
      showCountermeasureKenapaLamaForm,
      countermeasureKenapaLamaForm,
      submitCountermeasureKenapaLama,
      cancelCountermeasureKenapaLama,
      editCountermeasureKenapaLama,
      removeCountermeasureKenapaLama,
      picOptions,
      sparepartOptions,
      sparepart_list,
      showSparepartForm,
      sparepartForm,
      submitSparepart,
      editSparepart,
      removeSparepart,
      cancelSparepart,
      toggleSparepartForm,
      nameWithLang,
      onSparepartSearch,
      handleSparepartSearch,
      onSparepartSelect,
      onPartSimilarSelect,
      editStepRepair,
      editingStepRepair,
      yokotenForm,
      yokotenList,
      showYokotenForm,
      submitYokoten,
      cancelYokoten,
      editYokoten,
      removeYokoten,
      addRootcause,
      deleteRootcause,
      addStepRepair,
      deleteStepRepair,
      statusClass,
      onApprove,
      onComment,
      onStepRepairValidationChange,
      filteredMemberOption,
      currentUserName,
      showCommentModal,
      commentText,
      currentSection,
      currentFeedbackField,
      currentApproveField,
      submitComment,
      cancelComment,
      totalSparepartCost,
    }
  },
  
  computed: {
    pmCategoryDisabled() {
      return this.localSubmit.oCategory !== '3';
    },
    pmCategoryInvalid() {
      return this.localSubmit.oCategory === '3' && !this.localSubmit.pmCategory;
    },
    displayPrice: {
      get() {
        return this.formatCurrency(this.sparepartForm.price);
      },
      set(value) {
        this.sparepartForm.price = value.replace(/[^\d]/g, '');
      }
    },
    displayImg_problem() {
      if (this.imagePreviews.whyImage) {
        return this.imagePreviews.whyImage
      }
      if (this.localSubmit?.whyImage) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.whyImage}`
      }
      return ''
    },
    display_attachmentImg() {
      if (this.imagePreviews.attachmentMeeting) {
        return this.imagePreviews.attachmentMeeting
      }
      if (this.localSubmit?.attachmentMeeting) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.attachmentMeeting}`
      }
      return ''
    },
    displayWhyLamaImage() {
      if (this.imagePreviews.whyLamaImage) {
        return this.imagePreviews.whyLamaImage
      }
      if (this.localSubmit?.whyLamaImage) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.whyLamaImage}`
      }
      return ''
    },
    displayUploadImgImage() {
      if (this.imagePreviews.uploadImage) {
        return this.imagePreviews.uploadImage
      }
      if (this.localSubmit?.uploadImage) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.uploadImage}`
      }
      return ''
    },
    displayActualImage() {
      if (this.imagePreviews.actualImage) {
        return this.imagePreviews.actualImage
      }
      if (this.localSubmit?.actualImage) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.actualImage}`
      }
      return ''
    },
    displayStandardImage() {
      if (this.imagePreviews.standartImage) {
        return this.imagePreviews.standartImage
      }
      if (this.localSubmit?.standartImage) {
        return `${process.env.VUE_APP_API_URL}/smartandon/image?path=${this.localSubmit.standartImage}`
      }
      return ''
    },
    hasLegacyStepRepairData() {
      const stepRepair = this.localSubmit?.stepRepair

      // Handle empty string, null, undefined
      if (!stepRepair) {
        return false
      }

      // Handle empty string specifically
      if (stepRepair === '') {
        return false
      }

      // Handle empty array
      if (Array.isArray(stepRepair) && stepRepair.length === 0) {
        return false
      }

      // Handle array with items - check if any item has meaningful data
      if (Array.isArray(stepRepair) && stepRepair.length > 0) {
        // Check if any item has actual content (not just empty strings)
        const hasMeaningfulData = stepRepair.some(item => {
          if (!item || typeof item !== 'object') return false

          // Check if stepDesc has content (main field for step repair)
          const stepDesc = item.stepDesc || item.description || ''
          if (typeof stepDesc === 'string' && stepDesc.trim() !== '') {
            return true
          }

          // Check other fields that might indicate real data
          const hasOtherData = item.actualTime > 0 ||
                              item.idealTime > 0 ||
                              (item.quick6 && item.quick6.trim() !== '')

          return hasOtherData
        })

        return hasMeaningfulData
      }

      // Handle string data that might contain actual step repair data
      if (typeof stepRepair === 'string' && stepRepair.trim() !== '') {
        try {
          const parsed = JSON.parse(stepRepair)
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Apply the same meaningful data check to parsed array
            const hasMeaningfulData = parsed.some(item => {
              if (!item || typeof item !== 'object') return false

              const stepDesc = item.stepDesc || item.description || ''
              if (typeof stepDesc === 'string' && stepDesc.trim() !== '') {
                return true
              }

              const hasOtherData = item.actualTime > 0 ||
                                  item.idealTime > 0 ||
                                  (item.quick6 && item.quick6.trim() !== '')

              return hasOtherData
            })

            return hasMeaningfulData
          }
          return false
        } catch {
          // If it's a non-empty string that's not valid JSON, consider it as having data
          return true
        }
      }

      return false
    },
  },
  data() {
    return {
      showFullSizeImage: false,
      showFullSizeImageLama: false,
      showFullSizeImageUpload: false,
      showFullSizeImageStandart: false,
      showFullSizeImageActual: false,
      imagePreviews: {
        whyImage: null,
        whyLamaImage: null,
        uploadImage: null,
        standartImage: null,
        actualImage: null,
        attachmentMeeting: null,
      },
    }
  },
  methods: {
    mapSparepartStatus(status) {
      const statusMap = {
        1: 'ORIGINAL PART',
        2: 'SIMILAR PART',
      }
      if (typeof status === 'string') {
        // Try to parse string to number if possible
        const num = parseInt(status, 10)
        if (!isNaN(num)) {
          return statusMap[num] || status.toUpperCase()
        }
        return status.toUpperCase()
      }
      return statusMap[status] || ''
    },
    formatCurrency(value) {
      if (value === null || value === undefined || value === '') return 'Rp 0';
      const num = parseFloat(value);
      if (isNaN(num)) return 'Rp 0';
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    },
    onFileChange(event, field) {
      const file = event.target.files[0]
      if (file) {
        this.localSubmit[field] = file

        // Create a preview URL for the uploaded file and update imagePreviews
        const reader = new FileReader()
        reader.onload = (e) => {
          this.imagePreviews[field] = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.localSubmit[field] = null
        this.imagePreviews[field] = null
      }
    },
    downloadLastReportFile() {
      if (
        this.localSubmit.file_report &&
        this.localSubmit.fidProblem &&
        this.localSubmit.problems
      ) {
        let url = `${process.env.VUE_APP_API_URL}/smartandon/download-report?fid=${encodeURIComponent(
          this.localSubmit.fidProblem,
        )}&problem=${encodeURIComponent(this.localSubmit.problems)}`
        console.log('Download URL:', url)
        const link = document.createElement('a')
        link.href = url

        const filename = this.localSubmit.file_report
          .substring(this.localSubmit.file_report.lastIndexOf('/') + 1)
          .split('?')[0]
        link.setAttribute('download', filename)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        alert(
          'No last report file or required parameters available to download.',
        )
      }
    },
    downloadTemplateFile() {
      if (this.localSubmit.fidProblem) {
        const url = `${process.env.VUE_APP_API_URL}/smartandon/download-template?fid=${encodeURIComponent(
          this.localSubmit.fidProblem,
        )}`
        window.open(url, '_blank')
      } else {
        alert(
          'No last report file or required parameters available to download.',
        )
      }
    },
  },
}
</script>

<style scoped>
.custom-card {
  border-radius: 12px;
}

.analysis-list ul {
  list-style-type: none;
  padding-left: 20px;
}

.analysis-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
}

.analysis-item input[type='text'] {
  flex-grow: 1;
  margin-right: 10px;
  padding: 4px 8px;
  font-size: 14px;
}

.analysis-item .actions button {
  margin-left: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
}

.analysis-item .actions button:hover {
  color: #007bff;
}

.status-circle {
  display: inline-block;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.status-approved {
  background-color: #2eb85c;
  border-color: #2eb85c;
}

.status-rejected {
  background-color: #e55353;
  border-color: #e55353;
}

.status-pending {
  background-color: white;
  border-color: #ccc;
}

.status-none {
  background-color: white;
  border-color: #ccc;
}

.status-comment {
  background-color: #f9ca24;
  border-color: #f9ca24;
}

.status-delay {
  background-color: #e55353;
  border-color: #e55353;
}

.vue-treeselect__menu {
  z-index: 9999;
}
</style>

<style>
/* Override Multiselect option hover color to blue */
.multiselect__option--highlight,
.multiselect__option--selected {
  background-color: #007bff !important; /* Bootstrap primary blue */
  color: white !important;
}

</style>