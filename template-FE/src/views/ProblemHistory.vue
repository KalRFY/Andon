<template>
  <EditProblemModal
    :visible="visibleLiveDemo"
    :submitData="submit"
    :machineOptions="machineOptions"
    :lineOptions="lineOptions"
    @close="visibleLiveDemo = false"
    @submit="saveSubmit"
  />

  <CRow class="mb-3">
    <CCol>

      <CCard>
        <CCardHeader>Search</CCardHeader>
        <CCardBody>

          <CRow>
            <CCol>
              <CFormLabel for="startDate">Start</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
                <CFormInput 
                  id="startDate"
                  type="date"
                  v-model="filterStartDate"
                  aria-label="Start Date"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CFormLabel for="finishDate">Finish</CFormLabel>
              <CInputGroup>
                <CInputGroupText id="basic-addon1"><Clock size="16" /></CInputGroupText>
                <CFormInput 
                  id="finishDate"
                  type="date"
                  v-model="filterFinishDate"
                  aria-label="Finish Date"
                  aria-describedby="basic-addon1"
                />
              </CInputGroup>
            </CCol>
            <CCol>
              <CCol class="md-6">
                <label for="lineSelect" class="form-label">Line</label>
                <Treeselect
                  id="lineSelect"
                  v-model="selectedLine"
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
            </CCol>
            <CCol>
              <label for="selectedMachineName" class="form-label">Machine Name</label>
              <Treeselect
                id="selectedMachineName"
                v-model="selectedMachineName"
                :options="machineOptions"
                :searchable="true"
                :clearable="true"
                :children="false"
                placeholder="Select or input machine"
                @input="onMachineInput"
                :value-consists-of="['label']"
                :value-key="'selectedMachineName'"
                :label-key="'label'"
              />
            </CCol>
          </CRow>
          <CRow class="mb-3">
            <CFormLabel for="basic-url">Problem</CFormLabel>
            <CInputGroup>
              <CInputGroupText id="basic-addon1">Problem</CInputGroupText>
              <CFormInput
                feedbackInvalid="Please input problem"
                id="problem"
                placeholder="Problem"
                v-model="selectedProblem"
                aria-label="Problem"
                aria-describedby="basic-addon1"/>
            </CInputGroup>
          </CRow>
          <hr></hr>
          <CRow class="mb-3">
            <CCol sm="2">
            <CButton :disabled="loading" style="width: 100%" color="dark" variant="outline" @click="resetFilters">Reset</CButton>
            </CCol>
            <CCol sm="10">
              <CButton :disabled="loading" style="width: 100%" color="primary" @click="fetchProblems()">Search</CButton>
            </CCol>
          </CRow>
          <CRow v-if="loading" class="mb-3">
            <CCol class="text-center">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow>
    <CCol>
      <CCard>
        <CCardHeader>Table History</CCardHeader>
        <CCardBody>
          <CRow>
            <CRow>
              <CCol>
                <CFormLabel style="font-weight: bold">Filters</CFormLabel>
                <CRow>
                  <CCol sm="3">
                    <CButton style="width: 100%; font-weight: bold; color: white" color="info" @click="freq">Frequency Problem</CButton>
                  </CCol>
                  <CCol sm="7">
                    <CButton style="width: 50%; font-weight: bold; color: white" color="info" @click="ltb">LTB</CButton>
                  </CCol>
                </CRow>
              </CCol>
            <CCol sm="2">
              <CFormLabel style="font-weight: bold;">Download Excel</CFormLabel>
              <CButton style="width: 100%; font-weight: bold; color: white" color="success" @click="download">Download</CButton>
            </CCol>
          </CRow>
          </CRow>

          <hr></hr>

          <CRow>
            <CCol class="mb-3">
              <CTable v-if="problemsView.length" bordered hover responsive>
                <CTableHead>
                  <CTableRow>
                    <!-- <CTableHeaderCell>No</CTableHeaderCell> -->
                    <CTableHeaderCell scope="col">No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Machine</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Problem</CTableHeaderCell>
                    <CTableHeaderCell scope="col">PIC</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Duration</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    <CTableHeaderCell scope="col">LTB Reports</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow v-for="(problem, index) in problemsView" :key="problem.fid">
                    <CTableDataCell>{{ (currentPage - 1) * pageSize + index + 1 }}</CTableDataCell>
                    <CTableDataCell>{{ formatDate(problem.fend_time) }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fmc_name || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.ferror_name || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.foperator || '' }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fline }}</CTableDataCell>
                    <CTableDataCell>{{ problem.fdur || '' }}</CTableDataCell>
                    <CTableDataCell>
                      <CButton class="mb-3" shape="rounder-pill" color="success" style="font-size: small; font-weight: bold; color: white;" @click="onClickInput(problem)">
                        Edit Problem
                      </CButton>
                    </CTableDataCell>
                      <CTableDataCell>
                        <CButton 
                          class="mb-3" 
                          shape="rounded-pill" 
                          color="info" 
                          style="font-size: small; font-weight: bold; color: white;" 
                          @click="onClickLtbReport(problem)"
                        >
                          View LTB Report
                        </CButton>
                      </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
              <p v-else>
                <CFormLabel>Loading data...</CFormLabel>
                <CCol class="text-center">
                  <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </CCol>
              </p>

              <CPagination aria-label="Page navigation example">
                <CPaginationItem
                  href="#"
                  :disabled="currentPage === 1"
                  @click.prevent="goToPage(1)"
                >
                  First
                </CPaginationItem>
                <CPaginationItem
                  href="#"
                  :disabled="currentPage === 1"
                  @click.prevent="goToPage(currentPage - 1)"
                >
                  Previous
                </CPaginationItem>
              <CPaginationItem
                v-for="page in visiblePages"
                :key="page"
                href="#"
                :active="page === currentPage"
                @click.prevent="goToPage(page)"
              >
                {{ page }}
              </CPaginationItem>
                <CPaginationItem
                  href="#"
                  :disabled="currentPage === totalPages"
                  @click.prevent="goToPage(currentPage + 1)"
                >
                  Next
                </CPaginationItem>
                <CPaginationItem
                  href="#"
                  :disabled="currentPage === totalPages"
                  @click.prevent="goToPage(totalPages)"
                >
                  Last
                </CPaginationItem>
              </CPagination>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script>
import { ref } from 'vue'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CPagination, CPaginationItem, CFormLabel } from '@coreui/vue';
import axios from 'axios';
import { CChart } from '@coreui/vue-chartjs'
import ApexCharts from 'vue3-apexcharts'
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
import api from '../apis/CommonAPI'
import { 
  AlertTriangle, 
  Clock, 
  Timer, 
  History, 
  BarChart2, 
  FileText,
  ChartColumnIncreasing, 
  BookText 
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import PaginationControls from '../components/PaginationControls.vue'
import EditProblemModal from '../components/EditProblemModal.vue'

const visibleStaticBackdropDemo = ref(false);


export default {
  name: 'Dashboard',
  data() {
    return {
      
      types: [],
      lines: [],
      lineOptions: [],
      machines: [],
      machineOptions: [],
      problems: [],
      problemOption: [],
      problemsView: [],
      filterStartDate: '',
      filterFinishDate: '',
      members: [],
      memberOption: [],

      problemCategoryName: '',
      oCategoryName: '',
      qCategoryName: '',

      selectedLine: null,
      selectedMachineName: null,
      selectedProblem: '',

      // Pagination data
      currentPage: 1,
      pageSize: 50,
      pages: 5,
      totalRecords: 0,
      totalPages: 0,
      loading: false,
      error: null,
      fidProblem: "",

      visibleLiveDemo: false,

      modalLoading: false,
      submit: {
        machineName: '',
        line: '',
        operationNo: '',
        maker: '',
        fmaker: '',
        problems: '',
        uraianKejadian: '',
        uploadImage: '',
        ilustrasiStandart: '',
        standartImage: '',
        ilustrasiActual: '',
        actualImage: '',
        gapBetweenStandarAndActual: '',
        pilihFocusThemaMember: '',
        pilihTaskforce: '',
        operator: [],
        avCategory: '',
        shift: '',
        startDate: '',
        finishDate: '',
        durationMin: '',
        problemCategory: '',
        itemTemporaryAction: '',
        rootcauses5Why: '',
        tambahAnalysisTerjadi: '',
        whyImage: '',
        pilihO6: '',
        stepRepair: '',
        partChange: '',
        countermeasureKenapaTerjadi: '',
        yokoten: '',
        rootcause5WhyKenapaLama: '',
        tambahAnalisisLama: '',
        pilihQ6: '',
        whyLamaImage: '',
        countermeasureKenapaLama: '',
        attachmentMeeting: '',
        comments5Why: '',
        commentsCountermeasure: '',
        lastReportFile: '',
        uploadFile: '',
        agreeTerms: false,
      },

    };
  },

  components: {
    MainChartExample,
    WidgetsStatsA,
    WidgetsStatsD,
    AlertTriangle,
    Clock,
    Timer,
    History,
    BarChart2,
    FileText,
    ChartColumnIncreasing,
    BookText,
    CChart,
    ApexCharts,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    Treeselect,
    CPagination,
    CPaginationItem,
    EditProblemModal
  },

  setup() {

    const router = useRouter();

    const navigateTo = (route) => {
      router.push(route);
    }

    return {
      navigateTo
    }

  },

  methods: {
    async fetchProblems(page = 1) {
      this.loading = true;
      this.error = null;
      console.log("===================================" + this.selectedMachineName + "============================================");
      try {
        const limit = this.pageSize || 50;

        // Convert selectedMachineName id to label for API query
        let machineLabel = undefined;
        if (this.selectedMachineName) {
          const machine = this.machineOptions.find(m => m.id === this.selectedMachineName);
          if (machine) {
            machineLabel = machine.label;
          }
        }

        const params = {
          page,
          limit,
          startDate: this.filterStartDate || undefined,
          finishDate: this.filterFinishDate || undefined,
          line: this.selectedLine || undefined,
          machineName: machineLabel || undefined,
          problem: this.selectedProblem || undefined,
        };
        console.log(params);
        const response = await axios.get('/api/smartandon/problemView', {
          params,
        });
        console.log('fetchProblems response:', response);
        this.problemsView = response.data.data;
        this.totalRecords = response.data.total;
        this.currentPage = response.data.page;
        this.pageSize = response.data.limit;
        this.totalPages = Math.ceil(this.totalRecords / this.pageSize);
      } catch (error) {
        this.error = 'Failed to fetch problems: ' + error.message;
        console.error(this.error);
      } finally {
        this.loading = false;
      }
    },

    resetFilters() {
      this.filterStartDate = '';
      this.filterFinishDate = '';
      this.selectedMachineName = null;
      this.selectedLine = null;
      this.selectedProblem = '';
      // this.$refs.machineSelect.clear();
      // this.$refs.lineSelect.clear();
      // this.fetchProblems(1);
    },

    async onClickInput(problem) {
      try {
        console.log("1=================================================================");
        this.modalLoading = true;
        // Fetch full problem data from backend API by problem ID
        const response = await axios.get(`/api/smartandon/problemId/${problem.fid}`);
        console.log("=================================================================");
        const problemData = response.data;

        // Helper function to convert date to yyyy-mm-dd format for input type date
        function formatDateToISO(dateStr) {
          if (!dateStr) return '';
          const date = new Date(dateStr);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        }

        // Populate submit object with fetched data based on modal labels
        // Find machine object in machineOptions matching problemData.fmc_name
        const selectedMachine = this.machineOptions.find(
          (machine) => machine.label === problemData.fmc_name
        ) || null;

        this.submit = {
          machineName: problemData.fmc_name || null,
          line: problemData.fline || null,
          fidProblem: problemData.fid || '',
          fmaker: problemData.fmaker || '',
          problems: problemData.ferror_name || '',
          uraianKejadian: problemData.uraian_kejadian || '',
          uploadImage: problemData.upload_image || '',
          standartImage: problemData.standart_image || '',
          ilustrasiStandart: problemData.ilustrasi_standart || '',
          ilustrasiActual: problemData.ilustrasi_actual || '',
          actualImage: problemData.actual_image || '',
          gapBetweenStandarAndActual: problemData.gapIlustrasi || '',
          pilihFocusThemaMember: problemData.pilih_focus_thema_member || '',
          pilihTaskforce: problemData.pilih_taskforce || '',
          operator: problemData.foperator ? problemData.foperator.split(',') : [],
          avCategory: problemData.fav_categoty || '',
          shift: problemData.shift || '',
          startDate: formatDateToISO(problemData.start_date) || '',
          finishDate: formatDateToISO(problemData.finish_date) || '',
          durationMin: problemData.duration_min || '',
          problemCategory: problemData.problemCategory || null,
          itemTemporaryAction: problemData.item_temporary_action || '',
          rootcauses5Why: problemData.rootcauses_5_why || '',
          tambahAnalysisTerjadi: problemData.tambah_analysis_terjadi || '',
          whyImage: problemData.why_image || '',
          pilihO6: problemData.pilih_o6 || '',
          stepRepair: problemData.step_repair || '',
          partChange: problemData.part_change || '',
          countermeasureKenapaTerjadi: problemData.countermeasure_kenapa_terjadi || '',
          yokoten: problemData.yokoten || '',
          rootcause5WhyKenkaLama: problemData.rootcause_5_why_kenka_lama || '',
          tambahAnalisisLama: problemData.tambah_analisis_lama || '',
          pilihQ6: problemData.pilih_q6 || '',
          whyLamaImage: problemData.why_lama_image || '',
          countermeasureKenapaLama: problemData.countermeasure_kenapa_lama || '',
          attachmentMeeting: problemData.attachment_meeting || '',
          comments5Why: problemData.comments_5_why || '',
          commentsCountermeasure: problemData.comments_countermeasure || '',
          lastReportFile: problemData.last_report_file || '',
          uploadFile: problemData.upload_file || '',
          agreeTerms: false,
        };

        this.machineName = problemData.fmc_name || null,
        this.line = problemData.fline || null,
        this.fidProblem = problemData.fid || '';
        this.fmaker = problemData.fmaker || '';
        this.problems = problemData.ferror_name || '';
        this.uraianKejadian = problemData.ferror_detail || '';
        this.uploadImage = problemData.upload_image || '';
        this.standartImage = problemData.standart_image || '';
        this.ilustrasiStandart = problemData.ilustrasi_standart || '';
        this.ilustrasiActual = problemData.ilustrasi_actual || '';
        this.actualImage = problemData.actual_image || '';
        this.gapBetweenStandarAndActual = problemData.gap_between_standar_and_actual || "No data for gap between standar and actual";
        this.pilihFocusThemaMember = problemData.pilih_focus_thema_member || '';
        this.pilihTaskforce = problemData.pilih_taskforce || '';
        this.operator = problemData.foperator || '';
        this.avCategory = problemData.fav_categoty || '';
        this.shift = problemData.fshift || '';
        if(this.shift == "r"){
          this.shiftName = "Red";
        } else if (this.shift == "w"){
          this.shiftName = "White";
        } else {
          this.shiftName = "Not yet inputted"
        }

        this.startDate = formatDateToISO(problemData.fstart_time || '');
        this.finishDate = formatDateToISO(problemData.fend_time || '');
        console.log("YESS");
        console.log("Start Date: " + this.startDate);
        console.log("Finish Date: " + this.finishDate);

        console.log("Start Date1: " + problemData.fstart_time);
        console.log("Finish Date1: " + problemData.fend_time);

        this.startDateProblem = formatDateToISO(problemData.fstart_time || '');
        this.finishDateProblem = formatDateToISO(problemData.fend_time || '');

        // this.startDate = this.formatDate(problemData.fstart_time || '');
        // this.finishDate = this.formatDate(problemData.fend_time || '');
        
        console.log("YESSS");
        console.log("Start Date: " + this.startDateProblem);
        console.log("Finish Date: " + this.finishDateProblem);

        console.log("Start Date2: " + problemData.fstart_time);
        console.log("Finish Date2: " + problemData.fend_time);

        this.durationMin = problemData.fdur || '';
        this.problemCategory = problemData.problemCategory || null;

        if (this.problemCategory == 1) {
          this.problemCategoryName = "Small";
        } else if (this.problemCategory == 2) {
          this.problemCategoryName = "Chokotei";
        } else if (this.problemCategory == 3) {
          this.problemCategoryName = "LTB";
        } else {
          this.problemCategoryName = "";
        }

        this.itemTemporaryAction = problemData.temporaryAction || "No item temporary action";
        this.rootcauses5Why = problemData.froot_cause || "No root cause 5 why";
        this.tambahAnalysisTerjadi = problemData.tambah_analysis_terjadi || "No analysis terjadi";
        this.whyImage = problemData.why_image || '';

        this.pilihO6 = problemData.oCategory || '';
        if (this.pilihO6 == 1) {
          this.oCategoryName = "O1: Design & Installation (Design / Installation Not Good (Refers to Function Check / Eng. Memo))";
        } else if (this.pilihO6 == 2) {
          this.oCategoryName = "O2: Henkaten Issue (No Enough Trial, No Confirm (others team))";
        } else if (this.pilihO6 == 3) {
          this.oCategoryName = "O3: PM Issue (No Have/Unclear, Unclear Methode, Confine/Invisible, Out of Periode, No Have Time, Lack of Skill)";
        } else if (this.pilihO6 == 4) {
          this.oCategoryName = "O4: Symptom (No Have Symptom, Have Symptom but Unfollow Activity)";
        } else if (this.pilihO6 == 5) {
          this.oCategoryName = "O5: Environment & 3rd Factor (Dirty, Confine Space, Invisible Area, Unpredictable (water leak / crush))";
        } else if (this.pilihO6 == 6) {
          this.oCategoryName = "o6: Lifetime Issue (Out of Standard Running, Over Capacity)";
        } else {
          this.oCategoryName = "";
        }

        this.stepRepair = problemData.fstep_repair || '';
        this.partChange = problemData.fpart_change || '';
        this.countermeasureKenapaTerjadi = problemData.countermeasure_kenapa_terjadi || '';
        this.yokoten = problemData.fyokoten || '';
        this.rootcause5WhyKenapaLama = problemData.rootcause_5_why_kenapa_lama || '';
        this.tambahAnalisisLama = problemData.tambah_analisis_lama || '';

        this.pilihQ6 = problemData.qCategory || '';
        if (this.pilihQ6 == 1) {
          this.qCategoryName = "Q1: Diagnose (Meeting, accuracy check (run-out, backlash, etc))";
        } else if (this.pilihQ6 == 2) {
          this.qCategoryName = "Q2: Sparepart (Part preparation, fabrication of part, repair of damage part due to unavailability at SPW)";
        } else if (this.pilihQ6 == 3) {
          this.qCategoryName = "Q3: Tool (Special tools preparation, change of tools, personal tool, change dresser, safety tool)";
        } else if (this.pilihQ6 == 4) {
          this.qCategoryName = "Q4: Maint. Ability (Repair, overhaul, part replace, tomoken, 5S)";
        } else if (this.pilihQ6 == 5) {
          this.qCategoryName = "Q5: Setting Ability (Quality checking, program adjustment, program zeroing, position memory set, autosizer setting & amp, PSW set, backlash adjustment (slide gib / kamisori, parameter set, centering, etc))";
        } else if (this.pilihQ6 == 6) {
          this.qCategoryName = "Q6: Back-Up (Back-Up MC's Preparation, Back-Up MC's dandori)";
        } else {
          this.qCategoryName = " ";
        }

        console.log("YES");
        console.log("================================================" + this.qCategoryName + "====================================================");

        this.whyLamaImage = problemData.why_lama_image || '';
        this.countermeasureKenapaLama = problemData.countermeasure_kenapa_lama || '';
        this.attachmentMeeting = problemData.attachment_meeting || '';
        this.comments5Why = problemData.fiveWhyLhFeedback || problemData.fiveWhyShFeedback || '';
        this.commentsCountermeasure = problemData.comments_countermeasure || '';
        this.lastReportFile = problemData.last_report_file || '';
        this.uploadFile = problemData.upload_file || '';
        this.agreeTerms = false,
        this.fidProblem = problem.fid; // store problem id if needed
        this.maker = problem.fmaker;
        this.visibleLiveDemo = true;
      } catch (error) {
        alert('Failed to load problem data: ' + error.message);
        this.modalLoading = false;
        console.error(error);
      }
    },

    onClickLtbReport(problem) {
      // Placeholder for LTB Report button click handler
      // For example, navigate to LTB report page or show modal with report details
      alert(`LTB Report clicked for problem ID: ${problem.fid}`);
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    async saveSubmit(submitData) {
      if(!submitData.machineName){
        alert("Please input machine name");
      } else if(!submitData.line){
        alert("Please input line");
      } else if(!submitData.problems){
        alert("Please input problems");
      } else if(!submitData.agreeTerms){
        alert("You must agree to terms and conditions before submitting");
      } else {
        try {
          const payload = {
            machineName: submitData.machineName,
            lineName: submitData.line,
            problemDescription: submitData.problems,
            operator: submitData.operator.join(','), // join array to string
            // Include problem ID for update
            fid: submitData.fidProblem,
          };
          // Use PUT or PATCH for update endpoint if available
          const response = await api.put('/smartandon/problem/update', payload);
          if (response.data.status === 'success') {
            alert('Input updated successfully');
            this.visibleLiveDemo = false;
            this.submit = {};
            // Refresh problem list
            this.fetchProblems(this.currentPage);
          } else {
            alert('Failed to update input');
          }
        } catch (error) {
          console.log(error.message);
          alert('Error updating input: ' + error.message);
        }
      }
    },

    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchProblems(page);
      }
    },
  },

  computed: {
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      const maxVisible = this.pages || 5;
      let start = Math.max(1, current - Math.floor(maxVisible / 2));
      let end = start + maxVisible - 1;
      if (end > total) {
        end = total;
        start = Math.max(1, end - maxVisible + 1);
      }
      const pages = [];
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      return pages;
    },
  },

  async created() {
    this.loading = true;
    this.error = null;
    try {
      const response = await axios.get('/api/smartandon/machine');
      this.machines = response.data;
      this.machineOptions = response.data.map(machine => ({
        id: machine.fid,
        label: machine.fmc_name
      }));
    } catch (error) {
      console.error('Failed to fetch machines:', error);
    }
    try {
      const response = await axios.get('/api/smartandon/line');
      this.lines = response.data;
      this.lineOptions = response.data.map(line => ({
        id: line.fid,
        label: line.fline
      }));
    } catch (error) {
      console.error('Failed to fetch lines:', error);
    }
    try {
      await this.fetchProblems(this.currentPage);
    } catch (error) {
      this.error = 'Failed to fetch problems: ' + error.message;
      console.error(this.error);
    }
    try {
      const response = await axios.get('/api/smartandon/member');
      this.members = response.data;
      this.memberOption = response.data.map(member => ({
        id: member.fid,
        label: member.fname
      }));
    } catch (error) {
      console.error('Failed to fetch member:', error);
    }
    try {
      await this.fetchProblems(this.currentPage);
    } catch (error) {
      this.error = 'Failed to fetch problems: ' + error.message;
      console.error(this.error);
    } finally {
      this.loading = false;
    }
  },
}

</script>






<style scoped>
.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 10px;
  overflow: hidden;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  padding: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-description {
  color: rgba(255, 255, 255, 0.8);
  margin-top: 10px;
}




p {
  font-style: italic;
}
</style>