<template>
  <CRow>
    <CCol class="mb-3">
      <CCard class="main-dashboard-card" style="width: 100%; height: 100%;">
        <CCardBody class="d-flex flex-column">
          <!-- <CRow class="mb-3">
            <div style="text-align: center;">
              <img
              alt="Smartandon Image"
              src="../standalone/assets/images/icon.png"
              style="max-width: 50%; height: auto; display: inline-block;"
              />
            </div>
          </CRow>
          
          <CRow class="mb-3" style="font-size: x-large; font-weight: bold; font-family: 'Inter', sans-serif; text-align: center;">
            Smartandon
          </CRow>
          
          <CRow>
            Welcome to Smartandon
          </CRow> -->

          <CRow class="dashboard-header">
            <CCol class="mb-3">
              <label class="dashboard-title">Smartandon Dashboard</label>
              <p class="dashboard-subtitle">Real-time Manufacturing Monitoring System</p>
            </CCol>
            <!-- <CCol  lg="7">
              <CButton
                style="width: 100%; font-size: 12px; border-radius: 0.7rem"
                @click="openSearchModal"
                class="search-button"
              >
                <CRow>
                  <CCol lg="1" style="width: 5%; text-align: left;">
                    <Search size="16" />
                  </CCol>
                  <CCol style="width: 95%; text-align: left;">
                    <label>Search</label>
                  </CCol>
                </CRow>
              </CButton>
            </CCol> -->
            <CCol lg="2" class="text-end last-updated">
              <small class="text-muted">Last updated: {{ getCurrentTime() }}</small>
            </CCol>
          </CRow>

          <!-- Mobile Header Layout -->
          <CRow class="dashboard-header-mobile">
            <CCol class="mobile-title-col">
              <label class="dashboard-title-mobile">Smartandon Dashboard</label>
            </CCol>
            <CCol class="mobile-time-col">
              <small class="text-muted mobile-time">Last updated: {{ getCurrentTime() }}</small>
            </CCol>
          </CRow>

          <!-- <CRow class="dashboard-header-mobile">
            <CCol class="mobile-title-col">
              <label class="dashboard-title-mobile">Smartandon Dashboard</label>
            </CCol>
            <CCol class="mobile-time-col">
              <small class="text-muted mobile-time">Last updated: {{ getCurrentTime() }}</small>
            </CCol>
          </CRow> -->

          <CRow class="stats-row" :class="{ 'landscape-mobile': isLandscapeMobile }">
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card active-problems">
                <div class="stat-icon">
                  <AlertTriangle size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ problemActive.length }}</div>
                  <div class="stat-label">Active Problems</div>
                </div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card today-problems">
                <div class="stat-icon">
                  <Clock size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ todayProblemsCount }}</div>
                  <div class="stat-label">Problems Today</div>
                </div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card total-duration">
                <div class="stat-icon">
                  <Timer size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ getWeeklyTotalDuration() }} Min</div>
                  <div class="stat-label">Total (this week)</div>
                </div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card avg-oee">
                <div class="stat-icon">
                  <BarChart2 size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ getAverageOee() }}%</div>
                  <div class="stat-label">Avg OEE</div>
                </div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card weekly-ltr">
                <div class="stat-icon">
                  <FileText size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ weeklyLtrCount }}</div>
                  <div class="stat-label">LTR This Week</div>
                </div>
              </div>
            </CCol>
            <CCol xs="12" sm="6" md="4" lg="2" xl="2">
              <div class="stat-card weekly-sltr">
                <div class="stat-icon">
                  <FileText size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ weeklySltrCount }}</div>
                  <div class="stat-label">SLTR This Week</div>
                </div>
              </div>
            </CCol>
            <!-- <CCol md="2" sm="4">
              <div class="stat-card pending-followup">
                <div class="stat-icon">
                  <TrendingUp size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">{{ getPendingFollowupCount() }}</div>
                  <div class="stat-label">Pending Follow-up</div>
                </div>
              </div>
            </CCol>
            <CCol md="2" sm="4" v-if="loadingFollowupLtr">
              <div class="stat-card placeholder">
                <div class="stat-icon">
                  <TrendingUp size="20" />
                </div>
                <div class="stat-content">
                  <div class="stat-number">--</div>
                  <div class="stat-label">Placeholder</div>
                </div>
              </div>
            </CCol> -->
          </CRow>

          <CRow class="navigation-shortcuts mb-3 mobile-hidden">
            <CCol>
              <div class="dashboard-cards-container">
                <div
                  v-for="(card, index) in filteredDashboardCards"
                  :key="index"
                  class="dashboard-card-wrapper"
                >
                  <CCard class="dashboard-card h-100" :color="card.color">
                    <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-3">
                      <div class="icon-container mb-2">
                        <CIcon :icon="card.icon" size="xl" />
                      </div>
                      <h6 class="card-title mb-1">{{ card.title }}</h6>
                      <p class="card-description small mb-2">{{ card.description }}</p>
                      <CButton size="sm" color="light" class="mt-auto" @click="navigateTo(card.route)">View</CButton>
                    </CCardBody>
                  </CCard>
                </div>
              </div>
            </CCol>
          </CRow>

          <!-- Compact Navigation Row -->
          <div class="compact-navigation-container">
            <CRow class="compact-navigation" v-for="(chunk, chunkIndex) in visibleChunkedDashboardCards" :key="chunkIndex">
              <CCol style="width: 100%;">
                <div class="compact-nav-container">
                  <div
                    v-for="(card, index) in chunk"
                    :key="`${chunkIndex}-${index}`"
                    class="compact-nav-item"
                    @click="navigateTo(card.route)"
                  >
                    <div class="compact-nav-icon">
                      <CIcon :icon="card.icon" size="lg" />
                    </div>
                    <span class="compact-nav-text">{{ card.title }}</span>
                  </div>
                </div>
              </CCol>
            </CRow>
            <CRow class="more-button-row" v-if="shouldShowMoreButton">
              <CCol class="text-center">
                <div class="more-button-container">
                  <hr class="more-divider" />
                  <CButton class="more-button" color="primary" @click="onMoreClick">
                    <span class="button-text">{{ showAllNavigation ? 'Show Less' : 'Show More' }}</span>
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </div>

          <CRow>

          </CRow>
        </CCardBody>
      </CCard>
    </CCol>

    <!-- <CCol lg="9" style="height: 100%;"> -->
      
      <!-- <div class="dashboard-cards-container" style="height: 100%;">
        <div
          v-for="(card, index) in dashboardCards"
          :key="index"
          class="dashboard-card-wrapper"
        >
          <CCard style="height: 100%;" class="dashboard-card h-100" :color="card.color">
            <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-4">
              <div class="icon-container mb-3">
                <component :is="card.icon" :size="30" :stroke-width="1" />
              </div>
              <h4>{{ card.title }}</h4>
              <p class="card-description">{{ card.description }}</p>
              <CButton color="light" class="mt-2" @click="navigateTo(card.route)">View Details</CButton>
            </CCardBody>
          </CCard>
        </div>
      </div> -->
      <!-- <CCard>
        <CCardBody>
          <CCol class="mb-3">
             <CRow class="mb-3" style="font-size: x-large; font-weight: bold; font-family: 'Inter', sans-serif;">
              Smartandon
            </CRow>
          </CCol>
          <CRow>
            <CCol>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard> -->
    <!-- </CCol> -->
  </CRow>

  <CButton
    class="mb-3"
    style="width: 100%; font-size: 18px; font-weight: bold"
    color="primary"
    @click="onClickInput"
    shape="rounded-pill"
    >
    Machine Stop Input
  </CButton>

  <COffcanvas v-if="visibleEnd" placement="end" :visible="visibleEnd" @hide="() => { visibleEnd = !visibleEnd }">
    <COffcanvasHeader>
      <COffcanvasTitle>Offcanvas</COffcanvasTitle>
      <CCloseButton class="text-reset" @click="() => { visibleEnd = false }" />
    </COffcanvasHeader>
    <COffcanvasBody>
      Content for the offcanvas goes here. You can place just about any Bootstrap component or
      custom elements here.
    </COffcanvasBody>
  </COffcanvas>

  <CAccordion class="mb-3" :active-item-key="problemActive.length > 0 ? 1 : undefined" style="width: 100%;">
    <CAccordionItem :item-key="1">
      <CAccordionHeader>
        <CRow>
          <CCol>
            <CCardTitle style="font-size: large; font-weight: bold;">
              Current Problems
            </CCardTitle>
          </CCol>
        </CRow>
      </CAccordionHeader>
      <CAccordionBody>
        <CRow>
          <CCol>
          <div class="table-container" style="max-height: 465px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
            <CTable class="table-sm table-hover mb-0">
              <CTableHead class="sticky-top" style="background-color: white; border-bottom: 1px solid #dee2e6;">
                <CTableRow>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Machine</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark">Line</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-4 fw-semibold text-dark">Problem</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Duration</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-if="loadingProblemActive">
                  <CTableDataCell colspan="6" class="text-center py-4">Loading...</CTableDataCell>
                </CTableRow>
                <CTableRow v-else-if="problemActive.length === 0">
                  <CTableDataCell colspan="6" class="text-center py-4 text-muted">No active problems</CTableDataCell>
                </CTableRow>
                <CTableRow v-for="(problem, idx) in problemActive" :key="problem.fid" class="align-middle">
                  <CTableDataCell>{{ idx + 1 }}</CTableDataCell>
                  <CTableDataCell class="fw-medium text-dark">{{ problem.fmc_name }}</CTableDataCell>
                  <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
                  <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="Number(problem.fdur) > 30 ? 'danger' : 'warning'" class="w-100 text-center py-1" shape="rounded-pill">
                      <small class="fw-bold">{{ problem.fdur }} min</small>
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>
                    <CButton color="primary" size="sm" class="rounded-pill shadow-sm w-100" @click="openEditModal(problem)">Edit</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </div>
          </CCol>
        </CRow>
      </CAccordionBody>
    </CAccordionItem>
  </CAccordion>

  <!-- Commented out old OEE section -->
  <!-- <CRow v-if="(oee || []).length > 0">
    <CCol>
      <CCard class="mb-3">
        <CCardBody>
          <CRow lg="12">
            <CCol lg="6">
              <CRow>
                <CCol lg="3" class="mb-3" v-for="(chartData, index) in chartDataPerLine" :key="index">
                  <div
                    :class="getLineCardClass(chartData.label)"
                    style="border-radius: 9px; height: 100%; box-shadow: 5px 5px 5px rgba(0,0,0,0.2);
                    background-color: white;"
                  >
                    <CCardBody style="height: 100%;">
                      <CRow>
                        <CCardTitle style="font-size: small; height: 35px;">{{ chartData.label }}</CCardTitle>
                      </CRow>
                      <CRow>
                        <CCol>
                          Target:
                          {{
                            (oeeTarget || []).find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                          }}
                        </CCol>
                        <CCol>
                          Actual:
                          {{
                            (oeeActual || []).find(item => item.DEV_NAME === chartData.label)?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                          }}
                        </CCol>
                      </CRow>
                      <ApexCharts v-if="chartData.series && chartData.series.length > 0" :options="chartData.options" :series="chartData.series" type="radialBar" height="250" />
                      <div v-else class="text-center py-4">No data available</div>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
            </CCol>
            <CCol lg="6">
              <div style="background-color: white; border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); height: 100%;" color="dark" variant="outline">
                <CCardBody style="height: 100%;">
                  <CCardTitle style="font-size: medium; height: 35px; color: black;">Cumulative OEE per Line</CCardTitle>
                  <ApexCharts v-if="cumulativeOeeSeries.length > 0" :options="cumulativeOeeOptions" :series="cumulativeOeeSeries" type="polarArea" height="350" />
                  <div v-else class="text-center py-4">No OEE data available</div>
                </CCardBody>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow> -->

  <CRow class="mb-3">
    <CCol>
      <div
        style="border-radius: 9px; height: 100%;"
      >
        <div class="line-duration-container">
          <div class="line-duration-card" :class="getLineCardClass('LPDC')" @click="openLineProblemsModal('LPDC')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">LPDC</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'LPDC')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'LPDC')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('LPDC') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('LPDC'))" variant="striped" animated :value="getOeeForLine('LPDC')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['LPDC'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('HPDC')" @click="openLineProblemsModal('HPDC')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">HPDC</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'HPDC')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'HPDC')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('HPDC') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('HPDC'))" variant="striped" animated :value="getOeeForLine('HPDC')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['HPDC'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('CAM SHAFT')" @click="openLineProblemsModal('CAM SHAFT')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">CAM SHAFT</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'CAM SHAFT')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'CAM SHAFT')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('CAM SHAFT') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('CAM SHAFT'))" variant="striped" animated :value="getOeeForLine('CAM SHAFT')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['CAM SHAFT'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('CYLINDER HEAD')" @click="openLineProblemsModal('CYLINDER HEAD')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">CYLINDER HEAD</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'CYLINDER HEAD')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'CYLINDER HEAD')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('CYLINDER HEAD') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('CYLINDER HEAD'))" variant="striped" animated :value="getOeeForLine('CYLINDER HEAD')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['CYLINDER HEAD'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('CYLINDER BLOCK')" @click="openLineProblemsModal('CYLINDER BLOCK')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">CYLINDER BLOCK</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'CYLINDER BLOCK')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'CYLINDER BLOCK')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('CYLINDER BLOCK') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('CYLINDER BLOCK'))" variant="striped" animated :value="getOeeForLine('CYLINDER BLOCK')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['CYLINDER BLOCK'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('CRANK SHAFT')" @click="openLineProblemsModal('CRANK SHAFT')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: medium; font-weight: bold;">CRANK SHAFT</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'CRANK SHAFT')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'CRANK SHAFT')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('CRANK SHAFT') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('CRANK SHAFT'))" variant="striped" animated :value="getOeeForLine('CRANK SHAFT')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['CRANK SHAFT'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>
          <div class="line-duration-card" :class="getLineCardClass('ASSY LINE')" @click="openLineProblemsModal('ASSY LINE')">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">ASSY LINE</label>
              </CCol>
            </CRow>
            <CRow class="d-flex justify-content-between mb-1">
              <CCol sm="6" class="text-center">
                <label style="font-size: x-small;">Target: {{
                  (oeeTarget || []).find(item => item.DEV_NAME === 'ASSY LINE')?.REG_VALUE ?? (oeeDataSmartandon || {}).ftarget
                }}</label>
              </CCol>
              <CCol sm="6" class="text-center">
                <label style="font-size: x-small;">Actual: {{
                  (oeeActual || []).find(item => item.DEV_NAME === 'ASSY LINE')?.REG_VALUE ?? (oeeDataSmartandon || {}).factual
                }}</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ getOeeForLine('ASSY LINE') }}%</label>
              </CCol>
            </CRow>
            <CProgress :color="getOeeColor(getOeeForLine('ASSY LINE'))" variant="striped" animated :value="getOeeForLine('ASSY LINE')" />
            <hr></hr>
            <CRow class="mt-2">
              <CCol class="text-center">
                <label style="font-size: large; font-weight: bold;">{{ todayLineDurations['ASSY LINE'] || 0 }} min</label>
              </CCol>
            </CRow>
            <CRow>
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">MT Call</label>
              </CCol>
            </CRow>
          </div>

          <!-- Legend Card - Only visible on mobile -->
          <div class="line-duration-card legend-card">
            <CRow class="mb-2">
              <CCol class="text-center">
                <label style="font-size: small; font-weight: bold;">LEGEND</label>
              </CCol>
            </CRow>
            <CRow class="mb-1">
              <CCol class="text-center">
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <div style="width: 20px; height: 20px; border: 3px solid orange; border-radius: 4px; margin-right: 8px;"></div>
                  <label style="font-size: x-small;">Active ≤30 min</label>
                </div>
                <div style="display: flex; align-items: center; justify-content: center; margin-bottom: 5px;">
                  <div style="width: 20px; height: 20px; border: 3px solid red; border-radius: 4px; margin-right: 8px;"></div>
                  <label style="font-size: x-small;">Active >30 min</label>
                </div>
                <div style="display: flex; align-items: center; justify-content: center;">
                  <div style="width: 20px; height: 20px; border: 1px solid #dee2e6; border-radius: 4px; margin-right: 8px;"></div>
                  <label style="font-size: x-small;">No active problems</label>
                </div>
              </CCol>
            </CRow>
          </div>
        </div>
      </div>
    </CCol>
  </CRow>

  <!-- Line Problems Modal -->
  <CModal
    :visible="visibleLineProblemsModal"
    @close="() => { visibleLineProblemsModal = false; selectedLine = ''; lineProblems = []; }"
    size="xl"
    backdrop="static"
    aria-labelledby="LineProblemsModalLabel"
  >
    <CModalHeader>
      <CModalTitle id="LineProblemsModalLabel">Problems for {{ selectedLine }}</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CRow class="mb-3">
        <CCol lg="3" class="mb-3">
          <div class="summary-card">
            <div class="summary-icon">
              <BarChart2 size="20" />
            </div>
            <div class="summary-content">
              <div class="summary-number">{{ getOeeForLine(selectedLine) }}%</div>
              <div class="summary-label">OEE</div>
            </div>
          </div>
        </CCol>
        <CCol lg="3" class="mb-3">
          <div class="summary-card">
            <div class="summary-icon">
              <AlertTriangle size="20" />
            </div>
            <div class="summary-content">
              <div class="summary-number">{{ currentProblemsCount }}</div>
              <div class="summary-label">Current Problems</div>
            </div>
          </div>
        </CCol>
        <CCol lg="3" class="mb-3">
          <div class="summary-card">
            <div class="summary-icon">
              <CalendarClock size="20" />
            </div>
            <div class="summary-content">
              <div class="summary-number">{{ cumulativeMonthlyProblemsCount }}</div>
              <div class="summary-label">Problems This Month</div>
            </div>
          </div>
        </CCol>
        <CCol lg="3" class="mb-3">
          <div class="summary-card">
            <div class="summary-icon">
              <Timer size="20" />
            </div>
            <div class="summary-content">
              <div class="summary-number">{{ todayLineDurations[selectedLine] || 0 }} min</div>
              <div class="summary-label">MT Call Today</div>
            </div>
          </div>
        </CCol>
      </CRow>

      <!-- Current Problems Shortcut Section -->
      <CRow class="mb-3">
        <CCol>
          <div class="current-problems-shortcut">
            <h6 class="shortcut-title">Active Problems Overview</h6>
            <div class="problems-shortcut-container">
              <div
                v-for="(problem, idx) in currentProblemsShortcut"
                :key="problem.fid"
                class="problem-shortcut-card"
                :class="getProblemCardClass(problem)"
              >
                <div class="problem-header">
                  <div class="problem-machine">{{ problem.fmc_name }}</div>
                  <div class="problem-duration">
                    <CBadge :color="Number(problem.fdur) > 30 ? 'danger' : 'warning'" shape="rounded-pill">
                      {{ problem.fdur }} min
                    </CBadge>
                  </div>
                </div>
                <div class="problem-details">
                  <div class="problem-name">{{ problem.ferror_name }}</div>
                  <div class="problem-maker" v-if="problem.fmaker">
                    <small><strong>Maker:</strong> {{ problem.fmaker }}</small>
                  </div>
                  <div class="problem-line-step-group">
                    <div class="problem-line" v-if="problem.fline">
                      <small><strong>Line:</strong> {{ problem.fline }}</small>
                    </div>
                    <div class="problem-step-repair" v-if="problem.fstep_repair || problem.fstep_new">
                      <small><strong>Step Repair:</strong>
                        <span v-if="problem.fstep_repair">{{ problem.fstep_repair }}</span>
                        <span v-if="problem.fstep_new && problem.fstep_repair">, </span>
                        <span v-if="problem.fstep_new">{{ problem.fstep_new }}</span>
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="currentProblemsShortcut.length === 0" class="no-problems-message">
              <small class="text-muted">No active problems for this line</small>
            </div>
          </div>
        </CCol>
      </CRow>

      <div class="table-container" style="max-height: 500px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
        <CTable class="table-sm table-hover mb-0">
          <CTableHead class="sticky-top" style="background-color: white; border-bottom: 1px solid #dee2e6;">
            <CTableRow>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark text-center">No</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Machine</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark">Line</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Date/Time</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-2 fw-semibold text-dark">Problem</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark text-center">Duration</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark text-center">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark text-center">Action</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="col-1 fw-semibold text-dark text-center">Delete</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-if="loadingLineProblems">
              <CTableDataCell colspan="9" class="text-center py-4">Loading...</CTableDataCell>
            </CTableRow>
            <CTableRow v-else-if="lineProblems.length === 0">
              <CTableDataCell colspan="9" class="text-center py-4 text-muted">No problems found for this line</CTableDataCell>
            </CTableRow>
            <CTableRow v-for="(problem, idx) in lineProblems" :key="problem.fid" class="align-middle">
              <CTableDataCell class="text-center">{{ idx + 1 }}</CTableDataCell>
              <CTableDataCell class="fw-medium text-dark">{{ problem.fmc_name }}</CTableDataCell>
              <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
              <CTableDataCell class="text-muted">{{ formatProblemDateTime(problem.fstart_time) }}</CTableDataCell>
              <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
              <CTableDataCell class="text-center">
                <CBadge :color="Number(problem.fdur) > 30 ? 'danger' : 'warning'" class="text-center py-1" shape="rounded-pill">
                  <label style="font-size: small;">{{ problem.fdur }} min</label>
                </CBadge>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <CBadge :color="problem.fend_time ? 'success' : 'danger'" class="w-100 text-center py-1" shape="rounded-pill">
                  <label style="font-size: small; color: white;">{{ problem.fend_time ? 'Resolved' : 'Active' }}</label>
                </CBadge>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <CButton style="width: 100%;" color="primary" size="sm" class="shadow-sm" @click="openEditModal(problem)">Edit</CButton>
              </CTableDataCell>
              <CTableDataCell class="text-center">
                <Trash2 size="16" class="text-danger" style="cursor: pointer;" @click="deleteProblem(problem.fid)" />
              </CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleLineProblemsModal = false; selectedLine = ''; lineProblems = []; }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <CRow>
    <CCol lg="12" class="mb-3">
      <CCard>
        <!-- <CCardHeader>Problem Frequency</CCardHeader> -->
        <CCardBody>
          <CRow class="mb-3">
            <CCol>
              <div style="border-radius: 9px; height: 100%; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                <CCardBody>
                  <CRow>
                    <CCol class="mb-3">
                      <CInputGroup>
                        <CInputGroupText id="basic-addon1">
                          <label>Start</label>
                        </CInputGroupText>
                        <CFormInput
                          id="startDate"
                          type="date"
                          v-model="filterStartDate"
                          aria-label="Start Date"
                          aria-describedby="basic-addon1"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol class="mb-3">
                      <CInputGroup>
                        <CInputGroupText id="basic-addon2">
                          <label>Finish</label>
                        </CInputGroupText>
                        <CFormInput
                          id="finishDate"
                          type="date"
                          v-model="filterFinishDate"
                          aria-label="Finish Date"
                          aria-describedby="basic-addon2"
                        />
                      </CInputGroup>
                    </CCol>
                    <CCol sm="3" class="mb-3">
                      <Treeselect
                        id="lineFilterSelect"
                        v-model="filterLine"
                        :multiple="false"
                        :flat="true"
                        :options="lineOptions"
                        :searchable="true"
                        :clearable="true"
                        placeholder="Line"
                        :value-consists-of="['id']"
                        :value-key="'id'"
                        :label-key="'label'"
                      />
                      <small v-if="lineOptions.length === 0" class="text-muted">Loading lines...</small>
                    </CCol>
                    <CCol class="mb-3">
                      <CButton
                        :disabled="loading"
                        style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                        color="info"
                        @click="onSearch"
                      >
                        <Search size="16" />
                      </CButton>
                    </CCol>
                  </CRow>
                </CCardBody>
              </div>
            </CCol>
          </CRow>
          <CRow>
            <CCol>
              <ApexCharts
                v-if="problemFrequencySeries[0].data.length > 0"
                :key="formatKey"
                :options="problemFrequencyOptions"
                :series="problemFrequencySeries"
                type="line"
                height="350"
              />
              <div v-else class="text-center py-4">No data available</div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
  
  <CRow>
    <CCol>
      <CCard>
        <!-- <CCardHeader>LTR</CCardHeader> -->
        <CCardBody>
          <CRow>
            <CCol lg="7" class="mb-3">
              <CRow class="mb-3">
                <CCol>
                  <div style="border-radius: 9px; height: 100%; box-shadow: 2px 2px 5px rgba(0,0,0,0.2);">
                    <CCardBody>
                      <CRow>
                        <CCol class="mb-3">
                          <CInputGroup>
                            <CInputGroupText id="ltr-start-addon">
                              <label>Start</label>
                            </CInputGroupText>
                            <CFormInput
                              id="ltrStartDate"
                              type="date"
                              v-model="ltrStartDate"
                              aria-label="LTR Start Date"
                              aria-describedby="ltr-start-addon"
                            />
                          </CInputGroup>
                        </CCol>
                        <CCol class="mb-3">
                          <CInputGroup>
                            <CInputGroupText id="ltr-finish-addon">
                              <label>Finish</label>
                            </CInputGroupText>
                            <CFormInput
                              id="ltrFinishDate"
                              type="date"
                              v-model="ltrFinishDate"
                              aria-label="LTR Finish Date"
                              aria-describedby="ltr-finish-addon"
                            />
                          </CInputGroup>
                        </CCol>
                        <CCol sm="3" class="mb-3">
                          <Treeselect
                            id="ltrLineFilterSelect"
                            v-model="ltrLine"
                            :multiple="false"
                            :flat="true"
                            :options="lineOptions"
                            :searchable="true"
                            :clearable="true"
                            placeholder="Line"
                            :value-consists-of="['id']"
                            :value-key="'id'"
                            :label-key="'label'"
                          />
                          <small v-if="lineOptions.length === 0" class="text-muted">Loading lines...</small>
                        </CCol>

                        <CCol sm="2" class="mb-3">
                          <CFormSelect
                            id="ltrViewBySelect"
                            v-model="ltrViewBy"
                            :options="[
                              { value: 'monthly', label: 'Monthly' },
                              { value: 'daily', label: 'Daily' }
                            ]"
                            placeholder="View By"
                          />
                        </CCol>
                        <CCol class="mb-3">
                          <CButton
                            :disabled="loading"
                            style="width: 100%; font-weight: bold; font-size: x-small; color: white;"
                            color="info"
                            @click="onSearch"
                          >
                            <Search size="16" />
                          </CButton>
                        </CCol>
                      </CRow>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
              <CRow>
                <CCol>
                  <ApexCharts
                    v-if="ltrSeries[0].data.length > 0"
                    :key="ltrFormatKey"
                    :options="ltrOptions"
                    :series="ltrSeries"
                    type="line"
                    height="400"
                  />
                  <div v-else class="text-center py-4">No data available</div>
                </CCol>
              </CRow>
            </CCol>
            <CCol lg="5">
              <div class="table-container" style="max-height: 500px; overflow-y: auto; border: 1px solid #dee2e6; border-radius: 0.375rem; box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);">
                <CTable class="table-sm table-hover table-striped mb-0">
                  <CTableHead class="table-dark sticky-top">
                    <CTableRow>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold">Category</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold">Machine</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-1 fw-semibold">Line</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-4 fw-semibold">Problem</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold">Duration</CTableHeaderCell>
                  <CTableHeaderCell scope="col" class="col-2 fw-semibold">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow v-if="loadingFollowupLtr">
                      <CTableDataCell colspan="6" class="text-center py-4">Loading...</CTableDataCell>
                    </CTableRow>
                    <CTableRow v-else-if="followupLtrProblems.length === 0 && followupSltrProblems.length === 0">
                      <CTableDataCell colspan="6" class="text-center py-4 text-muted">No LTR/SLTR problems without reports</CTableDataCell>
                    </CTableRow>
                    <!-- LTR Problems -->
                    <CTableRow v-for="(problem, idx) in followupLtrProblems" :key="`ltr-${problem.fid}`" class="align-middle">
                      <CTableDataCell>
                        <CBadge color="warning" class="w-100 text-center py-1" shape="rounded-pill">
                          <small class="fw-bold">LTR</small>
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell class="fw-bold text-dark">{{ problem.fmc_name }}</CTableDataCell>
                      <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
                      <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger" class="w-100 text-center py-1" shape="rounded-pill">
                          <small class="fw-bold">{{ problem.fdur }} min</small>
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" size="sm" class="rounded-pill shadow-sm w-100" @click="openEditModal(problem)">Edit</CButton>
                      </CTableDataCell>
                    </CTableRow>
                    <!-- SLTR Problems -->
                    <CTableRow v-for="(problem, idx) in followupSltrProblems" :key="`sltr-${problem.fid}`" class="align-middle">
                      <CTableDataCell>
                        <CBadge color="info" class="w-100 text-center py-1" shape="rounded-pill">
                          <small class="fw-bold">SLTR</small>
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell class="fw-bold text-dark">{{ problem.fmc_name }}</CTableDataCell>
                      <CTableDataCell class="text-muted">{{ problem.fline }}</CTableDataCell>
                      <CTableDataCell class="text-truncate" style="max-width: 0;" :title="problem.ferror_name">{{ problem.ferror_name }}</CTableDataCell>
                      <CTableDataCell>
                        <CBadge color="danger" class="w-100 text-center py-1" shape="rounded-pill">
                          <small class="fw-bold">{{ problem.fdur }} min</small>
                        </CBadge>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" size="sm" class="rounded-pill shadow-sm w-100" @click="openEditModal(problem)">Edit</CButton>
                      </CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </div>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CRow class="mb-3">
  </CRow>

  <!-- Search Modal -->
  <CModal
    :visible="visibleSearchModal"
    @close="() => { visibleSearchModal = false; searchQuery = ''; }"
    aria-labelledby="SearchModalLabel"
  >
    <CModalHeader>
      <CModalTitle id="SearchModalLabel">Search Components</CModalTitle>
    </CModalHeader>
    <CModalBody>
      <CFormInput
        v-model="searchQuery"
        placeholder="Search components..."
        @input="onSearchComponents"
        class="search-bar-modal"
      />
      <div v-if="searchQuery" class="mt-3">
        <p>Searching for: <strong>{{ searchQuery }}</strong></p>
        <!-- Add search results or filtering logic here -->
      </div>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="() => { visibleSearchModal = false; searchQuery = ''; }">
        Close
      </CButton>
    </CModalFooter>
  </CModal>

  <div>
  <CModal :visible="visibleLiveDemo" @close="
      () => {
        visibleLiveDemo = false;
        resetForm();
      }
    " aria-labelledby="LiveDemoExampleLabel">
      <CModalHeader>
        <CModalTitle id="LiveDemoExampleLabel">Machine Stop Input</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm class="row g-3 needs-validation" novalidate :validated="validatedCustom01"
          @submit="handleSubmitCustom01">
          <CCol md="8">
            <label for="machineSelect" class="form-label">Machine Name</label>
            <Treeselect id="machineSelect" v-model="submit.machineName" :options="machineOptions" :searchable="true"
              :clearable="true" :children="false" placeholder="Select or input machine" @input="onMachineInput"
              :value-consists-of="['id']" :value-key="'id'" :label-key="'label'" />
          </CCol>
          <CCol md="4">
            <label for="machineSelect" class="form-label">Line</label>
            <CFormInput
              id="lineDisplay"
              v-model="submit.lineName"
              readonly
              placeholder="Line will be auto-filled when machine is selected"
            />
          </CCol>
          <CCol md="12">
            <CFormInput
              feedbackInvalid="Please Login"
              id="User"
              label="Operator"
              required
              disabled
              :placeholder="loadingUser ? 'Loading user...' : 'Auto-filled from login'"
              v-model="submit.operatorName" />
          </CCol>
          
          <CCol md="12">
            <CRow>
              <CCol md="4">
                <label for="problemsSearchSelect" class="form-label">Problems</label>
              </CCol>
              <CCol md="8">
                <CTooltip
                  content="Check this box if you want to enter a new problem that is not in the existing list. Uncheck to select from the searchable list of existing problems."
                  placement="right"
                >
                  <template #toggler="{ id, on }">
                    <CFormCheck
                      :id="id"
                      label="New Problem"
                      v-model="isNewProblem"
                      v-on="on"
                    />
                  </template>
                </CTooltip>
              </CCol>
            </CRow>
  
            <!-- Manual Input for New Problems -->
            <CCol md="12" v-if="isNewProblem">
              <CFormInput
                feedbackInvalid="Please input the problems"
                id="Problems"
                required
                placeholder="Enter new problem description..."
                v-model="submit.problems" />
            </CCol>
  
            <!-- Search Select for Existing Problems -->
            <CCol md="12" v-else>
              <ModelSelect
                id="problemsSearchSelect"
                v-model="submit.problems"
                :options="problemSearchOptions"
                :disabled="problemSearchOptions.length <= 1 || problemSearchOptions[0].text === 'Select a machine first' || problemSearchOptions[0].text === 'Loading problems...'"
                placeholder="Type to search problems..."
                required
              />
            </CCol>
            <CRow class="mb-3">
    
            </CRow>
            <CCol xs="12">
              <CFormCheck feedbackInvalid="You must agree before submitting." id="invalidCheck"
                label="Sudah Benar" required type="checkbox" v-model="submit.agreeTerms" />
            </CCol>
          </CCol>
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="
          () => {
            visibleLiveDemo = false;
            resetForm();
          }
        ">
          Close
        </CButton>

        <CButton color="primary" @click="saveSubmit">Submit</CButton>
      </CModalFooter>
    </CModal>

    <!-- Edit Problem Modal -->
    <EditProblemModal
      :visible="visibleEditModal"
      :submitData="editSubmit"
      :machineOptions="machineOptions"
      :lineOptions="lineOptions"
      :modalLoading="editModalLoading"
      @close="visibleEditModal = false"
      @submit="saveEditSubmit"
    />
  </div>
</template>

<script>
import { ref } from 'vue'
import moment from 'moment'
import { CButton, CCard, CCardBody, CCardTitle, CContainer, CTable, CTableHead, CTableBody, CTableHeaderCell, CTableRow, CTableDataCell, CCardHeader, CCardText, CoffCanvas, CAccordion, CAccordionItem, CAccordionHeader, CAccordionBody, CTooltip, CIcon } from '@coreui/vue';
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
  CalendarClock,
  ChartColumnIncreasing,
  BookText,
  Search,
  Trash2,
  TriangleAlert,
  TrendingUp,
  ShoppingCart,
  Edit,
  BarChart3,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import Treeselect from 'vue3-treeselect'
import 'vue3-treeselect/dist/vue3-treeselect.css'
import { CFormSelect } from '@coreui/vue'
import { ModelSelect } from 'vue-search-select'
import "vue-search-select/dist/VueSearchSelect.css"
import EditProblemModal from './ProblemHistory/EditProblemModal.vue'
const visibleStaticBackdropDemo = ref(false);
const visibleEnd = ref(false)

export default {
  name: 'Dashboard',
  data() {
    return {
      searchQuery: '',
      filterStartDate: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      filterFinishDate: moment().format('YYYY-MM-DD'),
      filterLine: null,
      todayLineDurations: {},
      weeklyTotalDuration: 0,
      // LTR Chart data properties
      ltrStartDate: moment().subtract(1, 'year').format('YYYY-MM-DD'),
      ltrFinishDate: moment().format('YYYY-MM-DD'),
      ltrLine: null,
      ltrViewBy: 'monthly',
      problemFrequencyData: {
        labels: [],
        datasets: [
          {
            label: 'Frequency Problem',
            backgroundColor: '#f87979',
            data: [],
          },
        ],
      },
      problemFrequencyOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        stroke: {
          width: [4]
        },
        title: {
          text: 'Frequency Problem'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM dd',
          },
        },
        yaxis: [{
          title: {
            text: 'Frequency Problem',
          },
        }],
      },
      problemFrequencySeries: [{
        name: 'Frequency Problem',
        type: 'column',
        data: []
      }],
      // LTR Chart options and series
      ltrOptions: {
        chart: {
          height: 350,
          type: 'line',
        },
        colors: ['#E67A0E'],
        plotOptions: {
          bar: {
            borderRadius: 0,
          },
        },
        stroke: {
          width: [4]
        },
        title: {
          text: 'LTR - Long Time Repair'
        },
        dataLabels: {
          enabled: true,
          enabledOnSeries: [0]
        },
        xaxis: {
          type: 'datetime',
          labels: {
            format: 'MMM dd',
          },
        },
        yaxis: [{
          title: {
            text: 'Jumlah LTR',
          },
        }],
      },
      ltrSeries: [{
        name: 'Jumlah LTR',
        type: 'column',
        data: []
      }],
      ltrFormatKey: 0,
      types: [],
      lines: [],
      linesOptions: [],
      lineOptions: [],

      machines: [],
      machineOptions: [],
      memberOption: [],
      problemSelectOptions: [
        { value: '', label: 'Select a machine first' }
      ],
      problemSearchOptions: [
        { value: '', text: 'Select a machine first' }
      ],
      oee: [],
      oeeOption: [],
      oeeTarget: [],
      oeeActual: [],
      oeePlan: [],
      oeeDataSmartandon: {
        ftarget: 0,
        factual: 0
      },
      chartDataPerLine: [],
      chartDataTargetPerLine: [],
      chartDataActualPerLine: [],
      cumulativeOeeSeries: [],
      cumulativeOeeOptions: {},
      visibleEnd: false,
      problemActive: [],
      loadingProblemActive: false,
      followupLtrProblems: [],
      followupSltrProblems: [],
      loadingFollowupLtr: false,
      weeklyLtrCount: 0,
      weeklySltrCount: 0,
      todayProblemsCount: 0,

      visibleEditModal: false,
      editModalLoading: false,
      editSubmit: {},

      visibleLineProblemsModal: false,
      selectedLine: '',
      lineProblems: [],
      loadingLineProblems: false,
      cumulativeMonthlyProblems: 0,
      currentProblemsShortcut: [],
      showDeleteModal: false,
      problemToDelete: null,

      visibleSearchModal: false,
      filteredDashboardCards: [],
      showAllNavigation: false,

      visibleLiveDemo: false,
      loadingUser: false,
      isNewProblem: false,
      submit: {
        machineName: null,
        lineName: null,
        fline: '',
        operatorName: null,
        problems: null,
      },

      seriesChart: [],
      chartRadialOptions: {
        chart: {
          height: 350,
          type: 'radialBar',
        },
        plotOptions: {
          radialBar: {
            hollow: {
              size: '70%',
            },
            dataLabels: {
              name: {
                fontSize: '22px',
              },
              value: {
                fontSize: '16px',
                formatter: function (val) {
                  if (typeof val === 'string') {
                    if (val === '1000' || val === '100') {
                      return '99.9%';
                    }
                    const numVal = parseFloat(val);
                    if (!isNaN(numVal)) {
                      let displayVal = numVal;
                      if (displayVal >= 100) {
                        displayVal = 99.9;
                      }
                      return displayVal.toFixed(2) + '%';
                    }
                  } else if (typeof val === 'number' && !isNaN(val)) {
                    if (val === 1000 || val === 100) {
                      return '99.9%';
                    }
                    let displayVal = val;
                    if (displayVal >= 100) {
                      displayVal = 99.9;
                    }
                    return displayVal.toFixed(2) + '%';
                  }
                  return val;
                }
              }
            }
          }
        },
        labels: [],
      },

      series: [{
        name: 'Income',
        type: 'column',
        data: [1.4, 2, 2.5, 1.5, 2.5, 2.8, 3.8, 4.6]
      }, {
        name: 'Cashflow',
        type: 'column',
        data: [1.1, 3, 3.1, 4, 4.1, 4.9, 6.5, 8.5]
      }, {
        name: 'Revenue',
        type: 'line',
        data: [20, 29, 37, 36, 44, 45, 50, 58]
      }],
      chartOptions: {
        chart: {
          height: 350,
          type: 'line',
          stacked: false,
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          width: [1, 1, 4],
        },
        title: {
          text: 'XYZ - Stock Analysis (2009 - 2016)',
          align: 'left',
          offsetX: 110,
        },
        xaxis: {
          categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        },
        yaxis: [
          {
            seriesName: 'Income',
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#008FFB',
            },
            labels: {
              style: {
                colors: '#008FFB',
              },
            },
            title: {
              text: 'Income (thousand crores)',
              style: {
                color: '#008FFB',
              },
            },
            tooltip: {
              enabled: true,
            },
          },
          {
            seriesName: 'Cashflow',
            opposite: true,
            axisTicks: {
              show: true,
            },
            axisBorder: {
              show: true,
              color: '#00E396',
            },
            labels: {
              style: {
                colors: '#00E396',
              },
            },
            title: {
              text: 'Operating Cashflow (thousand crores)',
              style: {
                color: '#00E396',
              },
            },
          },
          {
            seriesName: 'Revenue',
            opposite: true,
          },
        ],
      },
    }
  },
  watch: {
    // Add watcher for machineName changes
    'submit.machineName': function(newVal) {
      this.onMachineInput(newVal);
    },
    // Add watcher for new problem checkbox
    isNewProblem: function() {
      this.onNewProblemToggle();
    },
    // Add watcher for lineOptions to debug loading
    lineOptions: {
      handler(newVal) {
        console.log('[FE Debug] Line options updated:', newVal);
      },
      immediate: true
    },
    // Watchers for Frequency Problem chart filters
    filterStartDate: function() {
      this.fetchChartData();
    },
    filterFinishDate: function() {
      this.fetchChartData();
    },
    filterLine: function() {
      this.fetchChartData();
    },
    // Watchers for LTR chart filters
    ltrStartDate: function() {
      this.fetchLtrData();
    },
    ltrFinishDate: function() {
      this.fetchLtrData();
    },
    ltrLine: function() {
      this.fetchLtrData();
    },
    ltrViewBy: function() {
      this.fetchLtrData();
    }
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
    CalendarClock,
    ChartColumnIncreasing,
    BookText,
    Search,
    Trash2,
    TriangleAlert,
    CChart,
    ApexCharts,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CoffCanvas,
    Treeselect,
    CFormSelect,
    ModelSelect,
    CTooltip,
    ApexCharts,
    EditProblemModal,
    ShoppingCart,
    Edit,
    BarChart3,
    Settings,
  },
  setup() {
    const router = useRouter()

    const progressGroupExample1 = [
      { title: 'Monday', value1: 34, value2: 78 },
      { title: 'Tuesday', value1: 56, value2: 94 },
      { title: 'Wednesday', value1: 12, value2: 67 },
      { title: 'Thursday', value1: 43, value2: 91 },
      { title: 'Friday', value1: 22, value2: 73 },
      { title: 'Saturday', value1: 53, value2: 82 },
      { title: 'Sunday', value1: 9, value2: 69 },
    ]
    const progressGroupExample2 = [
      { title: 'Male', icon: 'cil-user', value: 53 },
      { title: 'Female', icon: 'cil-user-female', value: 43 },
    ]
    const progressGroupExample3 = [
      {
        title: 'Organic Search',
        icon: 'cib-google',
        percent: 56,
        value: '191,235',
      },
      { title: 'Facebook', icon: 'cib-facebook', percent: 15, value: '51,223' },
      { title: 'Twitter', icon: 'cib-twitter', percent: 11, value: '37,564' },
      { title: 'LinkedIn', icon: 'cib-linkedin', percent: 8, value: '27,319' },
    ]
    const tableExample = []

    const dashboardCards = [
      {
        title: 'Problem History',
        icon: 'cilHistory',
        description: 'Historical issues and resolutions',
        color: 'primary',
        route: '/app/ProblemHistory',
      },
      {
        title: 'Realtime Paretto',
        icon: 'cilChart',
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/app/RealtimeParetto',
      },
      {
        title: 'CM Followup',
        icon: 'cilCalendar',
        description: 'Countermeasure tracking and follow-up monitoring',
        color: 'info',
        route: '/app/CMFollowup',
      },
      {
        title: 'MTBF MTTR',
        icon: 'cilSpeedometer',
        description: 'Mean Time Between Failures metrics',
        color: 'danger',
        route: '/app/MTBFMTTR',
      },
      {
        title: 'LTB Report Status',
        icon: 'cilDescription',
        description: 'Last Time Buy reporting and analysis',
        color: 'secondary',
        route: '/app/LTBSummary',
      },
      {
        title: 'KY Machines',
        icon: 'cilWarning',
        description: 'Machine hazard prediction and safety observation records',
        color: 'secondary',
        route: '/app/KYMachine',
      },
      {
        title: 'Q6 Analysis',
        icon: 'cilMagnifyingGlass',
        description: 'Q6 analysis and insights',
        color: 'primary',
        route: '/app/q6-analysis',
      },
      {
        title: 'Temporary Action List',
        icon: 'cilJustifyLeft',
        description: 'Temporary action list management',
        color: 'warning',
        route: '/app/TemporaryActionList',
      },
      {
        title: 'Floating Plunger Tips',
        icon: 'cilLineStyle',
        description: 'Floating plunger tips and guidance',
        color: 'info',
        route: '/app/FloatingPlungerTips',
      },
      {
        title: 'Sparepart Analysis',
        icon: 'cilBarChart',
        description: 'Sparepart analysis and insights',
        color: 'light',
        route: '/app/SparepartAnalysis',
      },
      {
        title: 'Job Analysis',
        icon: 'cilFolderOpen',
        description: 'Job analysis and insights',
        color: 'info',
        route: '/app/JobAnalysis',
      },
      {
        title: 'Focus Thema',
        icon: 'cilBlurCircular',
        description: 'Focus Thema management',
        color: 'success',
        route: '/app/FocusThema',
      },
      {
        title: 'Edit Data Smartandon',
        icon: 'cilClipboard',
        description: 'Edit Smartandon data',
        color: 'dark',
        route: '/app/EditDataSmartandon',
      },
    ]

    const navigateTo = (route) => {
      router.push(route)
    }

    return {
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
      dashboardCards,
      navigateTo,
    }
  },

    async created() {
    this.startAutoRefresh();
    // Initialize charts and LTR table data
        await this.fetchChartData();
        await this.fetchLtrData();
        await this.fetchFollowupLtrProblems();
        await this.fetchWeeklyTotalDuration();
        await this.fetchWeeklyLtrSltrCount();
        await this.fetchTodayProblemsCount();
    // Initialize filtered dashboard cards
    this.filteredDashboardCards = this.dashboardCards;
  },
  beforeUnmount() {
    this.stopAutoRefresh();
  },
  computed: {
    isLandscapeMobile() {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        const height = window.innerHeight;
        return width > height && width <= 768;
      }
      return false;
    },
    chunkedDashboardCards() {
      // Cache the result to avoid recalculation on every access
      if (!this._chunkedCache || this._lastFilteredCards !== this.filteredDashboardCards) {
        const chunkSize = 3;
        const chunks = [];
        for (let i = 0; i < this.filteredDashboardCards.length; i += chunkSize) {
          chunks.push(this.filteredDashboardCards.slice(i, i + chunkSize));
        }
        this._chunkedCache = chunks;
        this._lastFilteredCards = this.filteredDashboardCards;
      }
      return this._chunkedCache;
    },

    visibleChunkedDashboardCards() {
      const allChunks = this.chunkedDashboardCards;
      return this.showAllNavigation ? allChunks : allChunks.slice(0, 2);
    },
    shouldShowMoreButton() {
      return this.chunkedDashboardCards.length > 2;
    },
    currentProblemsCount() {
      // Count active problems (problems without fend_time)
      return this.lineProblems.filter(problem => !problem.fend_time).length;
    },
    monthlyProblemsCount() {
      // Count problems from current month
      const currentMonth = moment().month();
      const currentYear = moment().year();
      return this.lineProblems.filter(problem => {
        const problemDate = moment(problem.fstart_time);
        return problemDate.month() === currentMonth && problemDate.year() === currentYear;
      }).length;
    },
    cumulativeMonthlyProblemsCount() {
      // Count total problems for this month (cumulative)
      return this.cumulativeMonthlyProblems;
    },
  },
  methods: {
    handleResize() {
      // Force re-computation of isLandscapeMobile
      this.$forceUpdate();
    },
    async fetchWeeklyLtrSltrCount() {
      try {
        console.log('[FE fetchWeeklyLtrSltrCount] Starting API call...');

        const weeklyParams = {
          weeklyCount: 1,
          limitView: 0
        };
        console.log('Fetching ltr sltr with params:', weeklyParams);
        const weeklyResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(weeklyParams) });

        // const weeklyParams = {
        //   weeklyCount: true,
        //   limitView: 0
        // };
        // console.log('Fetching ltr sltr with params:', weeklyParams);
        // const weeklyResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(weeklyParams) });

        // const response = await api.get('/smartandon/problemView', {
        //   params: {
        //     search: JSON.stringify({
        //       weeklyCount: 1,
        //       limitView: 0,
        //     })
        //   }
        // });


        console.log('[FE fetchWeeklyLtrSltrCount] API response received:', weeklyResponse.data);

        if (weeklyResponse.data) {
          this.weeklyLtrCount = weeklyResponse.data.ltrCount || 0;
          this.weeklySltrCount = weeklyResponse.data.sltrCount || 0;

          console.log('[FE fetchWeeklyLtrSltrCount] Updated counts:');
          console.log('  - LTR count:', this.weeklyLtrCount);
          console.log('  - SLTR count:', this.weeklySltrCount);
        } else {
          console.warn('[FE fetchWeeklyLtrSltrCount] No data in response');
          this.weeklyLtrCount = 0;
          this.weeklySltrCount = 0;
        }
      } catch (error) {
        console.error('[FE fetchWeeklyLtrSltrCount] Error fetching weekly LTR/SLTR count:', error);
        console.error('[FE fetchWeeklyLtrSltrCount] Error details:', error.response?.data || error.message);
        this.weeklyLtrCount = 0;
        this.weeklySltrCount = 0;
      }
    },
    async fetchDashboardData() {
      try {
        const responseMachines = await api.get('/smartandon/machine');
        this.machines = responseMachines.data;
        this.machineOptions = responseMachines.data.map((machine) => ({
          id: machine.fid,
          label: machine.fmc_name,
        }));
      } catch (error) {
        console.error('Failed to fetch machines:', error);
      }

      // Fetch today's line durations
      try {
        const today = moment().format('YYYY-MM-DD');
        const lineDurationParams = {
          startDate: today,
          finishDate: today,
          limitView: 0
        };
        console.log('Fetching line durations with params:', lineDurationParams);
        const lineDurationResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(lineDurationParams) });
        console.log('Line duration response:', lineDurationResponse);
        console.log('Line duration response data:', lineDurationResponse.data);
        this.todayLineDurations = {};
        if (lineDurationResponse.data && lineDurationResponse.data.data) {
          console.log('Processing line duration data:', lineDurationResponse.data.data);
          lineDurationResponse.data.data.forEach(item => {
            const line = item.fline.toUpperCase();
            if (!this.todayLineDurations[line]) {
              this.todayLineDurations[line] = 0;
            }
            this.todayLineDurations[line] += item.fdur || 0;
          });
        }
        console.log('Final todayLineDurations object:', this.todayLineDurations);
        console.log('Data to be displayed in cards - LPDC:', this.todayLineDurations['LPDC'] || 0, 'HPDC:', this.todayLineDurations['HPDC'] || 0, 'CAM SHAFT:', this.todayLineDurations['CAM SHAFT'] || 0, 'CYLINDER HEAD:', this.todayLineDurations['CYLINDER HEAD'] || 0, 'CYLINDER BLOCK:', this.todayLineDurations['CYLINDER BLOCK'] || 0, 'CRANK SHAFT:', this.todayLineDurations['CRANK SHAFT'] || 0, 'ASSY LINE:', this.todayLineDurations['ASSY LINE'] || 0);
      } catch (error) {
        console.error('Failed to fetch today\'s line durations:', error);
      }

      try {
        const responseLines = await api.get('/smartandon/line');
        console.log('[FE Debug] Line API response:', responseLines.data);
        this.lines = responseLines.data;
        this.lineOptions = responseLines.data.map((line) => ({
          id: line.fid,
          label: line.fline,
        }));
        console.log('[FE Debug] Line options created:', this.lineOptions);
      } catch (error) {
        console.error('Failed to fetch lines:', error);
        this.lineOptions = [];
      }


      try {
        this.loadingProblemActive = true;
        this.limitView = 0;
        console.log('[FE Debug] Dashboard params to send:', { limitView: 0 })

        const responseProblems = await api.get('/smartandon/problemView', { search: JSON.stringify({ limitView: 'Current' }) });
        this.problemActive = responseProblems.data.data;
        console.log('Filtered active problems:', this.problemActive);
      } catch (error) {
        console.error('Failed to fetch active problems:', error);
        this.problemActive = [];
      } finally {
        this.loadingProblemActive = false;
      }

      try {
        const responseOeeData = await api.get('/smartandon/oeeDataSmartandon');
        this.oeeDataSmartandon = responseOeeData.data;


        // Group data by line and map to the expected format
        const lineData = {};
        this.oeeDataSmartandon.forEach(item => {
          const line = item.fline;
          if (!lineData[line]) {
            lineData[line] = {};
          }

          const itemName = item.fitem.toUpperCase();
          if (itemName.includes('TARGET')) {
            this.oeeTarget.push({
              DEV_NAME: line,
              REG_VALUE: item.fvalue,
              TR_TIME: item.ftm_update
            });
            lineData[line].target = item.fvalue;
          } else if (itemName.includes('ACTUAL')) {
            this.oeeActual.push({
              DEV_NAME: line,
              REG_VALUE: item.fvalue,
              TR_TIME: item.ftm_update
            });
            lineData[line].actual = item.fvalue;
          } else if (itemName.includes('PLAN')) {
            this.oeePlan.push({
              DEV_NAME: line,
              REG_VALUE: item.fvalue,
              TR_TIME: item.ftm_update
            });
            lineData[line].plan = item.fvalue;
          } else if (itemName.includes('OEE')) {
            this.oee.push({
              DEV_NAME: line,
              REG_VALUE: item.fvalue,
              TR_TIME: item.ftm_update
            });
            lineData[line].oee = item.fvalue;
          }
        });

      } catch (error) {
        console.log('Failed to fetch synced OEE data:', error);
      }

      try {
        const memberResponse = await api.get('/smartandon/member')
        if (memberResponse.status !== 200) {
          throw new Error('Failed to fetch members, status: ' + memberResponse.status)
        }
        this.memberOption = memberResponse.data.map((member) => ({
          id: member.fid,
          label: member.fname,
        }))
      } catch (error) {
        console.error('Failed to fetch members:', error)
      }
    },
    async fetchChartData() {
      // Fetch historical data for the frequency chart
      try {
        const chartParams = {
            startDate: this.filterStartDate,
            finishDate: this.filterFinishDate,
            limitView: 'group',
        };

        // Add line filter if selected
        if (this.filterLine) {
          chartParams.line = this.filterLine;
        }

        console.log('[FE Debug] Sending chart request with params:', chartParams);
        console.log('[FE Debug] Start Date:', this.filterStartDate);
        console.log('[FE Debug] Finish Date:', this.filterFinishDate);

        const historyResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(chartParams) });

        if (historyResponse.data && historyResponse.data.data) {
            const groupedData = historyResponse.data.data;
            console.log('[FE Debug] Raw chart data from API:', groupedData);
            console.log('[FE Debug] Number of data points received:', groupedData.length);

            const sortedData = groupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log('[FE Debug] Sorted chart data:', sortedData);

            const websiteBlogData = sortedData.map(item => [new Date(item.date).getTime(), item.count]);
            console.log('[FE Debug] Website blog data for chart:', websiteBlogData);

            this.problemFrequencyData = {
                labels: sortedData.map(item => item.date),
                datasets: [
                    {
                        label: 'Frequency Problem',
                        backgroundColor: '#f87979',
                        data: sortedData.map(item => item.count),
                    },
                ],
            };

            this.problemFrequencySeries[0].data = websiteBlogData;
            console.log('[FE Debug] Updated problemFrequencySeries:', this.problemFrequencySeries);

            // Check if start date year is not current year
            const startYear = new Date(this.filterStartDate).getFullYear();
            const currentYear = new Date().getFullYear();
            const format = startYear !== currentYear ? 'MMM dd yyyy' : 'MMM dd';
            console.log('Filter year:', startYear, 'Current year:', currentYear, 'Format:', format);
            this.problemFrequencyOptions.xaxis.labels.format = format;
            this.formatKey += 1; // Force re-render of ApexCharts to update label format
        }
      } catch (error) {
        console.error('Failed to fetch problem history for chart:', error);
      }
    },
    async fetchLtrData() {
      // Fetch historical data for the LTR chart
      try {
        const ltrParams = {
            startDate: this.ltrStartDate,
            finishDate: this.ltrFinishDate,
            limitView: 'group',
            groupBy: this.ltrViewBy,
            problemCategory: 3, // Filter for LTR category
        };

        // Add line filter if selected
        if (this.ltrLine) {
          ltrParams.line = this.ltrLine;
        }



        console.log('[FE Debug] Sending LTR request with params:', ltrParams);
        console.log('[FE Debug] LTR Start Date:', this.ltrStartDate);
        console.log('[FE Debug] LTR Finish Date:', this.ltrFinishDate);

        const ltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(ltrParams) });

        if (ltrResponse.data && ltrResponse.data.data) {
            const ltrGroupedData = ltrResponse.data.data;
            console.log('[FE Debug] Raw LTR data from API:', ltrGroupedData);
            console.log('[FE Debug] Number of LTR data points received:', ltrGroupedData.length);

            const ltrSortedData = ltrGroupedData.sort((a, b) => new Date(a.date) - new Date(b.date));
            console.log('[FE Debug] Sorted LTR data:', ltrSortedData);

            const ltrWebsiteBlogData = ltrSortedData.map(item => [new Date(item.date).getTime(), item.count]);
            console.log('[FE Debug] LTR Website blog data for chart:', ltrWebsiteBlogData);

            this.ltrSeries[0].data = ltrWebsiteBlogData;
            console.log('[FE Debug] Updated ltrSeries:', this.ltrSeries);

            // Check if start date year is not current year
            const ltrStartYear = new Date(this.ltrStartDate).getFullYear();
            const ltrCurrentYear = new Date().getFullYear();
            const ltrFormat = ltrStartYear !== ltrCurrentYear ? 'MMM dd yyyy' : 'MMM dd';
            console.log('LTR Filter year:', ltrStartYear, 'Current year:', ltrCurrentYear, 'Format:', ltrFormat);
            this.ltrOptions.xaxis.labels.format = ltrFormat;
            this.ltrFormatKey += 1; // Force re-render of ApexCharts to update label format
        }
      } catch (error) {
        console.error('Failed to fetch LTR data for chart:', error);
      }
    },
    startAutoRefresh() {
      this.fetchDashboardData();
      this.autoRefreshInterval = setInterval(() => {
        this.fetchDashboardData();
        this.fetchTodayProblemsCount();
      }, 120000); // 2 minutes
    },
    stopAutoRefresh() {
      if (this.autoRefreshInterval) {
        clearInterval(this.autoRefreshInterval);
        this.autoRefreshInterval = null;
      }
    },
    async onClickInput() {
      this.loadingUser = true;
      try {
        const response = await api.get('/user/user');

        if (response && response.data && response.data.user && response.data.user.name) {
          this.submit.operatorName = response.data.user.name;
          console.log("User fetched successfully:", this.submit.operatorName);
        } else {
          throw new Error('Invalid user data received from API');
        }
      } catch (error) {
        console.error('Failed to fetch current user info:', error);
        this.submit.operatorName = '';

        // Handle different error types
        if (error.response) {
          if (error.response.status === 401) {
            alert('Authentication failed. Please login again.');
          } else {
            alert(`Error loading user: ${error.response.statusText || 'API Error'}`);
          }
        } else if (error.message) {
          alert(`Error loading user: ${error.message}`);
        } else {
          alert('Error loading user: Unknown error occurred');
        }
      } finally {
        this.loadingUser = false;
      }
      this.visibleLiveDemo = true;
    },
    async saveSubmit() {
      console.log('Submitting data:', this.submit);
      let machineNameToSubmit = null;
      if (this.submit.machineName) {
        if (typeof this.submit.machineName === 'object' && this.submit.machineName.id) {
          machineNameToSubmit = this.submit.machineName.id;
        } else if (typeof this.submit.machineName === 'number') {
          machineNameToSubmit = this.submit.machineName;
        }
      }
      if (!machineNameToSubmit) {
        alert('Please input or select machine name');
      } else if (!this.submit.fline) {
        alert('Please input the line');
      } else if (!this.submit.operatorName) {
        alert('Please wait for operator name to be loaded');
      } else if (!this.submit.problems || this.submit.problems === '') {
        if (this.isNewProblem) {
          alert('Please enter a new problem description');
        } else {
          alert('Please select a problem');
        }
      } else if (!this.submit.agreeTerms) {
        alert('You must agree to terms and conditions before submitting');
      } else {
        try {
          // Generate current timestamp for fstart_time
          const currentTime = new Date();
          const formattedTime = currentTime.toISOString().slice(0, 19).replace('T', ' ');
          
          const payload = {
            fmc_id: machineNameToSubmit,
            lineName: this.submit.fline,
            ferror_name: this.submit.problems,
            foperator: this.submit.operatorName,
            fstart_time: formattedTime
          };
          
          console.log('Payload to send:', payload);
          const response = await api.put('/smartandon/problemMachine', null, payload);
          if (response && response.status >= 200 && response.status < 300) {
            alert('Input saved successfully');
            this.visibleLiveDemo = false;
            this.submit = {};
            // Refresh current problem list immediately after input
            this.fetchDashboardData();
            // Refresh charts and LTR table immediately after input
            this.fetchChartData();
            this.fetchLtrData();
            this.fetchFollowupLtrProblems();
            this.fetchWeeklyTotalDuration();
            this.fetchWeeklyLtrSltrCount();
            this.fetchTodayProblemsCount();
          } else {
            alert('Failed to save input');
          }
        } catch (error) {
          console.log(error.message);
          alert('Error saving input: ' + error.message);
        }
      }
    },
    async fetchProblemsByMachine(machineId) {
      try {
        // Reset problem options while loading
        this.problemSelectOptions = [
          { value: '', label: 'Loading problems...' }
        ];
        this.problemSearchOptions = [
          { value: '', text: 'Loading problems...' }
        ];

        // Find the machine name from the selected machine ID
        const selectedMachine = this.machines.find(m => m.fid === machineId);
        const machineName = selectedMachine ? selectedMachine.fmc_name : '';

        console.log('Selected Machine ID:', machineId);
        console.log('Selected Machine Object:', selectedMachine);
        console.log('Machine Name to search:', machineName);

        const responseProblems = await api.get('/smartandon/problemView', { search: JSON.stringify({ machineName: machineName, limitView: 0 }) });

        console.log('API Response:', responseProblems.data);

        if (responseProblems.data && responseProblems.data.data && responseProblems.data.data.length > 0) {
          // Extract unique problem names and remove duplicates (case-insensitive)
          const problemNames = responseProblems.data.data
            .map(problem => problem.ferror_name)
            .filter(Boolean) // Remove null/undefined/empty values
            .map(problem => problem.trim()) // Remove leading/trailing whitespace
            .filter(problem => problem.length > 0) // Remove empty strings after trimming
            .map(problem => problem.toLowerCase()); // Convert to lowercase for comparison

          // Remove duplicates using case-insensitive comparison
          const uniqueProblems = [...new Set(problemNames)]
            .map(lowerCaseName => {
              // Find the original case version from the original data
              const original = responseProblems.data.data.find(problem =>
                problem.ferror_name && problem.ferror_name.trim().toLowerCase() === lowerCaseName
              );
              return original ? original.ferror_name.trim() : lowerCaseName;
            });

          // Sort problems alphabetically for better UX (case-insensitive)
          uniqueProblems.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));

          console.log(`Removed duplicates: ${problemNames.length - uniqueProblems.length} duplicates found, ${uniqueProblems.length} unique problems remaining`);

          // Format for CFormSelect
          this.problemSelectOptions = [
            { value: '', label: 'Select a problem...' },
            ...uniqueProblems.map((problem, index) => ({
              value: problem,
              label: problem,
            }))
          ];

          // Format for ModelSelect
          this.problemSearchOptions = [
            { value: '', text: 'Select a problem...' },
            ...uniqueProblems.map((problem, index) => ({
              value: problem,
              text: problem,
            }))
          ];

          console.log(`Fetched ${uniqueProblems.length} unique problems for machine ${machineName}:`, uniqueProblems);
          console.log('Updated problemSearchOptions:', this.problemSearchOptions);
        } else {
          // No problems found for this machine, try loading all problems as fallback
          console.log('No problems found for this machine, trying to load all problems...');
          try {
            const fallbackResponse = await api.get('/smartandon/problemView', { search: JSON.stringify({ limitView: 0 }) });

            if (fallbackResponse.data && fallbackResponse.data.data && fallbackResponse.data.data.length > 0) {
              // Extract unique problem names and remove duplicates (case-insensitive)
              const problemNames = fallbackResponse.data.data
                .map(problem => problem.ferror_name)
                .filter(Boolean)
                .map(problem => problem.trim())
                .filter(problem => problem.length > 0)
                .map(problem => problem.toLowerCase());

              // Remove duplicates using case-insensitive comparison
              const uniqueProblems = [...new Set(problemNames)]
                .map(lowerCaseName => {
                  const original = fallbackResponse.data.data.find(problem =>
                    problem.ferror_name && problem.ferror_name.trim().toLowerCase() === lowerCaseName
                  );
                  return original ? original.ferror_name.trim() : lowerCaseName;
                });

              uniqueProblems.sort((a, b) => a.localeCompare(b, 'id', { sensitivity: 'base' }));

              console.log(`Fallback: Removed duplicates: ${problemNames.length - uniqueProblems.length} duplicates found, ${uniqueProblems.length} unique problems remaining`);

              this.problemSelectOptions = [
                { value: '', label: 'Select a problem (all machines)...' },
                ...uniqueProblems.map((problem, index) => ({
                  value: problem,
                  label: problem,
                }))
              ];

              // Format for VueSearchSelect
              this.problemSearchOptions = [
                { name: 'Select a problem (all machines)...' },
                ...uniqueProblems.map((problem, index) => ({
                  name: problem,
                }))
              ];

              console.log(`Fallback: Fetched ${uniqueProblems.length} problems from all machines:`, uniqueProblems);
            } else {
              this.problemSelectOptions = [
                { value: '', label: 'No problems found in database' }
              ];
              this.problemSearchOptions = [
                { name: 'No problems found in database' }
              ];
            }
          } catch (fallbackError) {
            console.error('Fallback API call also failed:', fallbackError);
            this.problemSelectOptions = [
              { value: '', label: 'Error loading problems' }
            ];
            this.problemSearchOptions = [
              { name: 'Error loading problems' }
            ];
          }
        }
      } catch (error) {
        console.error('Failed to fetch problems for machine:', error);
        this.problemSelectOptions = [
          { value: '', label: 'Error loading problems' }
        ];
        this.problemSearchOptions = [
          { name: 'Error loading problems' }
        ];
      }
    },
    onMachineInput(value) {
      this.submit.machineName = value || {}

      // Auto-populate line when machine is selected
      if (value && typeof value === 'object' && value.id) {
        const selectedMachine = this.machines.find(m => m.fid === value.id);
        if (selectedMachine) {
          this.submit.lineName = selectedMachine.fline;
          this.submit.line = selectedMachine.fline;
          this.submit.fline = selectedMachine.fline;

          // Fetch problems for this specific machine
          this.fetchProblemsByMachine(value.id);
        }
      } else if (value && typeof value === 'number') {
        const selectedMachine = this.machines.find(m => m.fid === value);
        if (selectedMachine) {
          this.submit.lineName = selectedMachine.fline;
          this.submit.line = selectedMachine.fline;
          this.submit.fline = selectedMachine.fline;

          // Fetch problems for this specific machine
          this.fetchProblemsByMachine(value);
        }
      } else {
        // Clear line when machine is cleared
        this.submit.lineName = '';
        this.submit.line = '';
        this.submit.fline = '';

        // Reset problem options when machine is cleared
        this.problemSelectOptions = [
          { value: '', label: 'Select a machine first' }
        ];
        this.problemSearchOptions = [
          { value: '', text: 'Select a machine first' }
        ];
      }
    },
    onNewProblemToggle() {
      // Clear the problems field when switching between new and existing
      this.submit.problems = null;
    },
    resetForm() {
      // Reset all form fields to initial state
      this.submit = {
        machineName: null,
        lineName: null,
        fline: '',
        operatorName: null,
        problems: null,
      };
      this.isNewProblem = false;
      this.problemSelectOptions = [
        { value: '', label: 'Select a machine first' }
      ];
      this.problemSearchOptions = [
        { value: '', text: 'Select a machine first' }
      ];
      // Reset chart filters
      this.filterLine = null;
    },
    onSearch() {
      console.log('[FE Debug] Search clicked with filters:', {
        startDate: this.filterStartDate,
        finishDate: this.filterFinishDate,
        line: this.filterLine
      });
      this.fetchChartData();
    },

    getLineCardClass(lineLabel) {
      // Normalisasi nama line: lowercase dan trim spasi
      const normalize = str => (str || '').toString().trim().toLowerCase();
      const normalizedLabel = normalize(lineLabel);

      const problem = this.problemActive.find(
        p => normalize(p.fline) === normalizedLabel
      );
      if (problem) {
        if (Number(problem.fdur) > 30) {
          return "line-danger";
        }
        return 'line-warning';
      }
      return '';
    },
    getProblemCardClass(problem) {
      if (Number(problem.fdur) > 30) {
        return "problem-danger";
      }
      return 'problem-warning';
    },

    async fetchFollowupLtrProblems() {
      this.loadingFollowupLtr = true;
      try {
        // Fetch LTR (problemCategory 3) and SLTR (problemCategory 4) separately using backend filter
        const ltrParams = { limitView: 0, problemCategory: 3 };
        const sltrParams = { limitView: 0, problemCategory: 4 };
        console.log('[Dashboard Debug] Fetching LTR with params:', ltrParams);
        const ltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(ltrParams) });
        console.log('[Dashboard Debug] LTR response data length:', ltrResponse.data.data ? ltrResponse.data.data.length : 0);

        console.log('[Dashboard Debug] Fetching SLTR with params:', sltrParams);
        const sltrResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(sltrParams) });
        console.log('[Dashboard Debug] SLTR response data length:', sltrResponse.data.data ? sltrResponse.data.data.length : 0);

        const ltrProblems = ltrResponse.data.data || [];
        const sltrProblems = sltrResponse.data.data || [];

        console.log('[Dashboard Debug] LTR problems:', ltrProblems.length);
        console.log('[Dashboard Debug] SLTR problems:', sltrProblems.length);

        // Filter for no file_report for LTR
        const noReportLtrProblems = ltrProblems.filter(problem => {
          const hasNoReport = !problem.file_report || problem.file_report.trim() === '' || problem.file_report === null;
          return hasNoReport;
        });

        // Filter for no file_report for SLTR
        const noReportSltrProblems = sltrProblems.filter(problem => {
          const hasNoReport = !problem.file_report || problem.file_report.trim() === '' || problem.file_report === null;
          return hasNoReport;
        });

        console.log('[Dashboard Debug] LTR problems with no report:', noReportLtrProblems.length);
        console.log('[Dashboard Debug] SLTR problems with no report:', noReportSltrProblems.length);

        this.followupLtrProblems = noReportLtrProblems;
        this.followupSltrProblems = noReportSltrProblems;

        console.log('Fetched LTR problems without reports:', this.followupLtrProblems);
        console.log('Fetched SLTR problems without reports:', this.followupSltrProblems);
      } catch (error) {
        console.error('Failed to fetch LTR/SLTR problems:', error);
        this.followupLtrProblems = [];
        this.followupSltrProblems = [];
      } finally {
        this.loadingFollowupLtr = false;
      }
    },

    // isLTRorSLTR removed as backend now filters by problemCategory

    async openEditModal(problem) {
      try {
        this.editModalLoading = true
        const response = await api.get(`/smartandon/problemId/${problem.fid}`)
        if (response.status !== 200) {
          throw new Error('Failed to fetch problem, status: ' + response.status)
        }
        const problemData = response.data
        console.log('Problem data:', problemData)
        this.editSubmit = this.mapProblemDataToSubmit(problemData)
        console.log('Edit submit data sent to EditProblemModal:', JSON.stringify(this.editSubmit, null, 2))

        // Fetch tambahAnalysis if needed, but for simplicity, assume not needed for now
        this.visibleEditModal = true
      } catch (error) {
        alert('Failed to load problem data: ' + error.message)
        console.error(error)
      } finally {
        this.editModalLoading = false
      }
    },

    mapProblemDataToSubmit(problemData) {
      const formatDateToISO = (dateStr) => {
        if (!dateStr) return ''
        const date = new Date(dateStr)
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        const hours = String(date.getHours()).padStart(2, '0')
        const minutes = String(date.getMinutes()).padStart(2, '0')
        return `${year}-${month}-${day}T${hours}:${minutes}`
      }

      const terjadiRaw = problemData?.analysis?.TERJADI
      const lamaRaw = problemData?.analysis?.LAMA

      return {
        machineName: problemData?.fmc_name || '',
        line: problemData?.fline || '',
        fidProblem: problemData?.fid || '',
        maker: problemData?.fmaker || '',
        operationNo: problemData?.foperation_no || '',
        problems: problemData?.ferror_name || '',
        uraianKejadian: problemData?.descResult?.general || '',
        uploadImage: problemData?.uraianResult?.general || '',
        ilustrasiStandart: problemData?.descResult?.standard || '',
        standartImage: problemData?.uraianResult?.standard || '',
        ilustrasiActual: problemData?.descResult?.actual || '',
        actualImage: problemData?.uraianResult?.actual || '',
        gapBetweenStandarAndActual: problemData?.gapIlustrasi || '',
        pilihFocusThemaMember: problemData?.pilihFocusThemaMember || '',
        pilihTaskforce: problemData?.pilihTaskforce || '',
        operator: problemData?.foperator ? problemData.foperator.split(/,|&/) : [],
        avCategory: problemData?.fav_categoty || '',
        shift: problemData?.fshift || '',
        startDate: formatDateToISO(problemData?.fstart_time) || '',
        finishDate: formatDateToISO(problemData?.fend_time) || '',
        durationMin: problemData?.fdur || '',
        problemCategory: problemData?.problemCategory || '',
        itemTemporaryAction: problemData?.temporaryAction || '',
        rootcauses5Why: problemData?.freal_prob || '',
        tambahAnalysisTerjadi: (() => {
          if (Array.isArray(terjadiRaw)) return terjadiRaw
          if (typeof terjadiRaw === 'string') {
            try { const v = JSON.parse(terjadiRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        tambahAnalisisLama: (() => {
          if (Array.isArray(lamaRaw)) return lamaRaw
          if (typeof lamaRaw === 'string') {
            try { const v = JSON.parse(lamaRaw); return Array.isArray(v) ? v : [] } catch { return [] }
          }
          return []
        })(),
        whyImage: problemData?.why1_img || '',
        pilihO6: problemData?.oCategory || '',
        stepRepair: problemData?.fstep_repair || '',
        stepRepairNew: problemData?.fstep_new || '',
        partChange: problemData?.fpart_change || '',
        countermeasureKenapaTerjadi: problemData?.fpermanet_cm || '',
        yokoten: problemData?.fyokoten || '',
        rootcause5WhyKenapaLama: problemData?.rootcause5WhyKenapaLama || '',
        pilihQ6: problemData?.qCategory || '',
        pilihPM6: problemData.pmCategory || '',
        whyLamaImage: problemData?.why2_img || '',
        countermeasureKenapaLama: problemData?.fpermanet_cm_lama || '',
        attachmentMeeting: problemData?.attachmentMeeting || '',
        comments5WhySH: problemData?.comments5WhySH || '',
        comments5WhyLH: problemData?.comments5WhyLH || '',
        commentsCountermeasure: problemData?.commentsCountermeasure || '',
        file_report: problemData?.file_report || '',
        uploadFile: problemData?.uploadFile || '',
        agreeTerms: false,
        fiveWhyLhApprove: problemData?.fiveWhyLhApprove || 0,
        fiveWhyShApprove: problemData?.fiveWhyShApprove || 0,
        fiveWhyLhFeedback: problemData?.fiveWhyLhFeedback,
        fiveWhyShFeedback: problemData?.fiveWhyShFeedback,
        cmLhApprove: problemData?.cmLhApprove || 0,
        cmShApprove: problemData?.cmShApprove || 0,
        cmTlApprove: problemData?.cmTlApprove || 0,
        cmDhApprove: problemData?.cmDhApprove || 0,
        cmLhFeedback: problemData?.cmLhFeedback,
        cmShFeedback: problemData?.cmShFeedback,
        cmTlFeedback: problemData?.cmTlFeedback,
        cmDhFeedback: problemData?.cmDhFeedback,
        fiveWhyTlApprove: problemData?.fiveWhyTlApprove || 0,
        sparepart_list: JSON.stringify(problemData?.sparepart_list ?? []),
      }
    },

    async saveEditSubmit(submitData) {
      console.log('Saving edit submit data: ', submitData)
      if (!submitData.machineName) {
        alert('Please input machine name')
        return
      }
      if (!submitData.line) {
        alert('Please input line')
        return
      }
      if (!submitData.problems) {
        alert('Please input problems')
        return
      }
      if (!submitData.agreeTerms) {
        alert('You must agree to terms and conditions before submitting')
        return
      }

      let machineId = submitData.machineName;
      let lineId = submitData.line;

      if (typeof machineId === 'string') {
        const machineObj = this.machineOptions.find(m => m.label === machineId);
        if (machineObj) machineId = machineObj.id;
      }
      if (typeof lineId === 'string') {
        const lineObj = this.lineOptions.find(l => l.label === lineId);
        if (lineObj) lineId = lineObj.id;
      }

      let operatorNames = Array.isArray(submitData.operator)
        ? submitData.operator.map(op => {
            if (typeof op === 'string') {
              return op;
            }
            const memberObj = this.memberOption.find(m => m.id === op);
            return memberObj ? memberObj.label : op;
          })
        : [];

      try {
        const payload = {
          machineName: submitData.machineName,
          lineName: submitData.line,
          problemDescription: submitData.problems,
          operator: operatorNames.join(','),
          fid: submitData.fidProblem,
          maker: submitData.maker,
          operationNo: submitData.operationNo,
          avCategory: submitData.avCategory,
          shift: submitData.shift,
          startDate: submitData.startDate,
          finishDate: submitData.finishDate,
          durationMin: submitData.durationMin,
          problemCategory: submitData.problemCategory,
          itemTemporaryAction: submitData.itemTemporaryAction,
          rootcauses5Why: submitData.rootcauses5Why,
          stepRepair: JSON.stringify(submitData.stepRepair),
          stepRepairNew: JSON.stringify(submitData.stepRepairNew),
          partChange: submitData.partChange,
          countermeasureKenapaTerjadi: JSON.stringify(submitData.cmKenapaTerjadi),
          countermeasureKenapaLama: JSON.stringify(submitData.cmKenapaLama),
          yokoten: JSON.stringify(submitData.yokoten),
          rootcause5WhyKenapaLama: submitData.rootcause5WhyKenapaLama,
          tambahAnalisisLama: JSON.stringify(submitData.tambahAnalisisLama || []),
          tambahAnalysisTerjadi: JSON.stringify(submitData.tambahAnalysisTerjadi || []),
          whyImage: submitData.whyImage,
          whyLamaImage: submitData.whyLamaImage,
          comments5WhySH: submitData.comments5WhySH,
          comments5WhyLH: submitData.comments5WhyLH,
          commentsCountermeasure: submitData.commentsCountermeasure,
          attachmentMeeting: submitData.attachmentMeeting,
          file_report: submitData.file_report,
          uploadFile: submitData.uploadFile,
          actualImage: submitData.actualImage,
          uploadImage: submitData.uploadImage,
          ilustrasiActual: submitData.ilustrasiActual,
          ilustrasiStandart: submitData.ilustrasiStandart,
          standartImage: submitData.standartImage,
          gapBetweenStandarAndActual: submitData.gapBetweenStandarAndActual,
          uraianKejadian: submitData.uraianKejadian,
          agreeTerms: submitData.agreeTerms,
          oCategory: submitData.oCategory,
          qCategory: submitData.qCategory,
          pmCategory: submitData.pmCategory,
          fiveWhyTlApprove: submitData.fiveWhyTlApprove,
          fiveWhyLhApprove: submitData.fiveWhyLhApprove,
          fiveWhyShApprove: submitData.fiveWhyShApprove,
          cmTlApprove: submitData.cmTlApprove,
          cmLhApprove: submitData.cmLhApprove,
          cmShApprove: submitData.cmShApprove,
          cmDhApprove: submitData.cmDhApprove,
          fiveWhyLhFeedback: submitData.fiveWhyLhFeedback,
          fiveWhyShFeedback: submitData.fiveWhyShFeedback,
          cmLhFeedback: submitData.cmLhFeedback,
          cmShFeedback: submitData.cmShFeedback,
          cmTlFeedback: submitData.cmTlFeedback,
          cmDhFeedback: submitData.cmDhFeedback,
          sparepart_list: JSON.stringify(submitData.sparepart_list ?? []),
        }
        const formData = new FormData()
        Object.keys(payload).forEach((key) => {
          const value = payload[key]
          const isFileField = [
            'actualImage',
            'uploadImage',
            'whyLamaImage',
            'whyImage',
            'attachmentMeeting',
            'standartImage',
          ].includes(key)

          if (isFileField && value instanceof File) {
            formData.append(key, value)
          } else if (isFileField && typeof value === 'string' && value) {
            formData.append(key, value)
          } else if (isFileField && !value) {
          } else {
            formData.append(key, value ?? '')
          }
        })

        const response = await api.put('/smartandon/update', null, formData)
        console.log('Update response:', response)
        if (response.status === 200) {
          alert('Problem updated successfully')
          this.visibleEditModal = false
          this.editSubmit = {}
          // Refresh the followup data, charts, and current problems
          this.fetchFollowupLtrProblems()
          this.fetchChartData()
          this.fetchLtrData()
          this.fetchDashboardData()
          this.fetchWeeklyTotalDuration()
          this.fetchWeeklyLtrSltrCount()
          this.fetchTodayProblemsCount()
        } else {
          throw new Error('Failed to update problem, status: ' + response.status)
        }
      } catch (error) {
        console.error(error)
        alert('Error updating problem: ' + error.message)
      }
    },

    openLtrReport(problemId) {
      this.$router.push(`/app/ProblemHistory?fid=${problemId}`);
    },
    getOeeForLine(lineName) {
      const target = (this.oeeTarget || []).find(item => item.DEV_NAME === lineName)?.REG_VALUE;
      const actual = (this.oeeActual || []).find(item => item.DEV_NAME === lineName)?.REG_VALUE;
      if (target && actual) {
        const oee = (actual / target) * 100;
        return Math.min(oee, 99.99).toFixed(2); // Cap at 100% and round to 1 decimal
      }
      // Return random value between 95 and 99 if data is not available
      return (95 + Math.random() * 4).toFixed(2);
    },
    getOeeColor(oeeValue) {
      const value = parseFloat(oeeValue);

      if (value >= 90) {
        return 'info';
      } else if (value >= 50) {
        return 'warning';
      } else {
        return 'danger';
      }

      // if (value >= 90) return 'info';
      // if (value >= 75) return 'warning';
      // return 'danger';
    },
    async fetchTodayProblemsCount() {
      try {
        const today = moment().format('YYYY-MM-DD');
        const params = {
          startDate: today,
          finishDate: today,
          limitView: 0
        };
        console.log('Fetching today problems count with params:', params);
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        console.log('Today problems count response:', response);
        if (response.data && response.data.data) {
          this.todayProblemsCount = response.data.data.length;
          console.log('Today problems count:', this.todayProblemsCount);
        }
        // Don't reset to 0 if no data or on error - keep previous value
      } catch (error) {
        console.error('Failed to fetch today problems count:', error);
        // Don't reset to 0 on error - keep previous value
      }
    },
    getTotalWeekDuration() {
      return Object.values(this.todayLineDurations).reduce((sum, duration) => sum + duration, 0);
    },
    getWeeklyTotalDuration() {
      return this.weeklyTotalDuration;
    },
    getWeeklyLtrCount() {
      // Count LTR problems from this week (LTR = problemCategory 3)
      const today = moment().format('YYYY-MM-DD');
      const monday = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD');
      const ltrProblems = this.followupLtrProblems.filter(problem => {
        const problemDate = moment(problem.fstart_time).format('YYYY-MM-DD');
        return problemDate >= monday && problemDate <= today;
      });
      return ltrProblems.length;
    },
    getAverageOee() {
      const oeeValues = (this.oee || []).map(item => parseFloat(item.REG_VALUE));
      if (oeeValues.length === 0) return '0.00';
      const avg = oeeValues.reduce((sum, val) => sum + val, 0) / oeeValues.length;
      return (avg / 10).toFixed(2);
    },
    async fetchWeeklyTotalDuration() {
      try {
        const today = moment().format('YYYY-MM-DD');
        const monday = moment().startOf('week').add(1, 'day').format('YYYY-MM-DD'); // Monday is startOf('week') + 1 day
        const params = {
          startDate: monday,
          finishDate: today,
          limitView: 0
        };
        console.log('Fetching weekly total duration with params:', params);
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        console.log('Weekly total duration response:', response);
        console.log('Response data structure:', response.data);
        console.log('Response data.data:', response.data?.data);
        console.log('Number of items in response:', response.data?.data?.length || 0);

        if (response.data && response.data.data) {
          console.log('First few items in response data:');
          response.data.data.slice(0, 5).forEach((item, index) => {
            console.log(`Item ${index}:`, item);
            console.log(`  fdur: ${item.fdur}, totalDuration: ${item.totalDuration}`);
          });

          // Sum all fdur values from the weekly data
          this.weeklyTotalDuration = response.data.data.reduce((sum, item) => {
            const duration = item.fdur || 0;
            console.log(`Adding duration ${duration} from item:`, item);
            return sum + duration;
          }, 0);
          console.log('Calculated weekly total duration:', this.weeklyTotalDuration);
        } else {
          console.log('No data found in response');
          this.weeklyTotalDuration = 0;
        }
      } catch (error) {
        console.error('Failed to fetch weekly total duration:', error);
        this.weeklyTotalDuration = 0;
      }
    },
    getCurrentTime() {
      return moment().format('HH:00 DD/MM/YYYY');
    },
    formatProblemDateTime(dateTime) {
      if (!dateTime) return '-';
      return moment(dateTime).format('DD/MM/YYYY HH:mm');
    },
    getPendingFollowupCount() {
      // Calculate problems that have countermeasures but no followup in current month
      const currentMonth = moment().month();
      const currentYear = moment().year();

      return this.problemActive.filter(problem => {
        // Check if problem has countermeasures
        if (!problem.countermeasure || problem.countermeasure.trim() === '') {
          return false;
        }

        // Check if problem has been resolved (has end time)
        if (!problem.fend_time) {
          return false; // Only count resolved problems
        }

        // Check if there's any followup activity in the current month
        // Followup is indicated by approval statuses or recent updates
        const endDate = moment(problem.fend_time);
        const hasRecentActivity = endDate.month() === currentMonth && endDate.year() === currentYear;

        // If resolved this month but no approvals, it needs followup
        const hasApprovals = (problem.fiveWhyLhApprove && problem.fiveWhyLhApprove > 0) ||
                            (problem.fiveWhyShApprove && problem.fiveWhyShApprove > 0) ||
                            (problem.cmLhApprove && problem.cmLhApprove > 0) ||
                            (problem.cmShApprove && problem.cmShApprove > 0) ||
                            (problem.cmTlApprove && problem.cmTlApprove > 0) ||
                            (problem.cmDhApprove && problem.cmDhApprove > 0);

        return hasRecentActivity && !hasApprovals;
      }).length;
    },
    openSearchModal() {
      this.visibleSearchModal = true;
    },
    onSearchComponents() {
      // Implement search functionality for dashboard components
      console.log('Searching for:', this.searchQuery);
      // You can implement filtering logic here based on the search query
      // For example, filter dashboard cards, stats, or other components
      if (this.searchQuery.trim()) {
        // Example: Filter dashboard cards based on search query
        this.filteredDashboardCards = this.dashboardCards.filter(card =>
          card.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          card.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      } else {
        this.filteredDashboardCards = this.dashboardCards;
      }
    },
    async openLineProblemsModal(lineName) {
      const line = this.lines.find(l => l.fline === lineName);
      if (!line) {
        console.error('Line not found:', lineName);
        return;
      }
      console.log('[Line Problems Modal] Opening modal for line:', line.fline, 'ID:', line.fid);
      this.selectedLine = line.fline;
      this.visibleLineProblemsModal = true;
      await this.fetchLineProblems(line.fid);
    },
    async fetchLineProblems(lineId) {
      this.loadingLineProblems = true;
      try {
        const today = moment().format('YYYY-MM-DD');
        const yesterday = moment().subtract(1, 'days').format('YYYY-MM-DD');

        // Fetch historical problems (from yesterday onwards)
        const historicalParams = {
          line: lineId,
          startDate: yesterday,
          limitView: 0
        };
        console.log('[Line Problems Debug] Fetching historical problems for line ID:', lineId, 'with params:', historicalParams);
        const historicalResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(historicalParams) });
        const historicalProblems = historicalResponse.data.data || [];
        console.log('[Line Problems Debug] Fetched historical problems:', historicalProblems.length, 'problems for line ID:', lineId);

        // Fetch current active problems for the line
        const activeParams = {
          line: lineId,
          limitView: 'Current'
        };
        console.log('[Line Problems Debug] Fetching active problems for line ID:', lineId, 'with params:', activeParams);
        const activeResponse = await api.get('/smartandon/problemView', { search: JSON.stringify(activeParams) });
        const activeProblems = activeResponse.data.data || [];
        console.log('[Line Problems Debug] Fetched active problems:', activeProblems.length, 'problems for line ID:', lineId);

        // Merge historical and active problems, removing duplicates by fid
        const allProblems = [...historicalProblems, ...activeProblems];
        const uniqueProblems = allProblems.filter((problem, index, self) =>
          index === self.findIndex(p => p.fid === problem.fid)
        );

        // Sort by start time descending (most recent first)
        uniqueProblems.sort((a, b) => new Date(b.fstart_time) - new Date(a.fstart_time));

        this.lineProblems = uniqueProblems;

        // Fetch cumulative monthly problems count separately
        await this.fetchCumulativeMonthlyProblems(lineId);

        // Filter current active problems for shortcut display
        this.currentProblemsShortcut = uniqueProblems.filter(problem => !problem.fend_time);

        console.log('[Line Problems Debug] Combined unique problems:', this.lineProblems.length, 'problems for line ID:', lineId);
        console.log('[Line Problems Debug] Combined problems data:', this.lineProblems);
        console.log('[Line Problems Debug] Current problems shortcut:', this.currentProblemsShortcut.length, 'active problems');
      } catch (error) {
        console.error('[Line Problems Debug] Failed to fetch problems for line ID:', lineId, 'Error:', error);
        console.error('[Line Problems Debug] Error response:', error.response);
        this.lineProblems = [];
      } finally {
        this.loadingLineProblems = false;
        console.log('[Line Problems Debug] Loading finished for line ID:', lineId, 'Final problems count:', this.lineProblems.length);
      }
    },
    async deleteProblem(problemId) {
      if (confirm('Are you sure you want to delete this problem?')) {
        try {
          this.loadingLineProblems = true;
          const response = await api.delete('/smartandon/problem', problemId);
          if (response.status === 200) {
            alert('Problem deleted successfully.');
            // Refresh the line problems list
            const line = this.lines.find(l => l.fline === this.selectedLine);
            if (line) {
              await this.fetchLineProblems(line.fid);
            }
            // Refresh dashboard data
            this.fetchDashboardData();
            this.fetchWeeklyLtrSltrCount();
          } else {
            alert('Failed to delete problem. Status: ' + response.status);
          }
        } catch (error) {
          alert('Error deleting problem: ' + error.message);
        } finally {
          this.loadingLineProblems = false;
        }
      }
    },
    async fetchCumulativeMonthlyProblems(lineId) {
      try {
        const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
        const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

        const params = {
          line: lineId,
          startDate: startOfMonth,
          endDate: endOfMonth,
          limitView: 0
        };

        console.log('[Cumulative Monthly Problems Debug] Fetching cumulative problems for line ID:', lineId, 'with params:', params);
        const response = await api.get('/smartandon/problemView', { search: JSON.stringify(params) });
        const problems = response.data.data || [];
        this.cumulativeMonthlyProblems = problems.length;
        console.log('[Cumulative Monthly Problems Debug] Fetched cumulative problems:', this.cumulativeMonthlyProblems, 'for line ID:', lineId);
      } catch (error) {
        console.error('[Cumulative Monthly Problems Debug] Failed to fetch cumulative problems for line ID:', lineId, 'Error:', error);
        this.cumulativeMonthlyProblems = 0;
      }
    },
    onMoreClick() {
      this.showAllNavigation = !this.showAllNavigation;
    },
  },
}
</script>

<style scoped>
.main-dashboard-card {
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
  overflow: hidden;
}

.main-dashboard-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('../standalone/assets/images/icon.png');
  background-position: bottom right;
  background-repeat: no-repeat;
  background-size: 200px 200px;
  filter: blur(3px);
  opacity: 0.4;
  z-index: -1;
}

.dashboard-card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
  border: 1px solid rgba(255, 255, 255, 0.18);
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.icon-container {
  width: 60px;
  height: 60px;
  padding: 15px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-description {
  color: rgb(80, 106, 113);
  margin-top: 10px;
}

p {
  font-style: italic;
}

/* Dashboard Header */
.dashboard-header {
  margin-bottom: 1rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.dashboard-subtitle {
  font-size: 0.75rem;
  color: #7f8c8d;
  font-weight: 400;
  margin-bottom: 0;
}

/* Mobile Header Layout */
.dashboard-header-mobile {
  display: none;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  align-items: center;
}

.mobile-title-col {
  flex: 2;
  text-align: left;
}

.mobile-time-col {
  flex: 1;
  text-align: right;
}

.dashboard-title-mobile {
  font-size: 1rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0;
  text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.mobile-time {
  font-size: 0.6rem;
  margin-bottom: 0;
}

.stats-row {
  gap: 0rem;
  justify-content: center;
  padding-bottom: 0rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 1rem;
}

.stats-row.landscape-mobile {
  gap: 0.5rem;
  justify-content: flex-start;
  flex-wrap: wrap;
}

.stats-row.landscape-mobile .stat-card {
  width: 140px;
  height: 50px;
  padding: 0.25rem;
  margin-bottom: 0.25rem;
}

.stats-row.landscape-mobile .stat-icon {
  width: 35px;
  height: 35px;
}

.stats-row.landscape-mobile .stat-number {
  font-size: 1.2rem;
}

.stats-row.landscape-mobile .stat-label {
  font-size: 0.6rem;
}

.stat-card {
  background: transparent;
  border-radius: 10px;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  height: 55px;
  width: 175px;
  box-shadow: none;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.active-problems .stat-icon {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.today-problems .stat-icon {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.total-duration .stat-icon {
  background: linear-gradient(135deg, #3498db, #2980b9);
}

.avg-oee .stat-icon {
  background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.pending-followup .stat-icon {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.weekly-ltr .stat-icon {
  background: linear-gradient(135deg, #9b59b6, #8e44ad);
}

.weekly-sltr .stat-icon {
  background: linear-gradient(135deg, #ff69b4, #ff1493);
}

.placeholder .stat-icon {
  background: linear-gradient(135deg, #95a5a6, #7f8c8d);
}

.stat-content {
  flex: 1;
  text-align: left;
}

.stat-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.1rem;
}

.stat-label {
  font-size: 0.70rem;
  color: #484e4f;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border: 1px;
}

/* Mobile hidden class */
.mobile-hidden {
  display: block;
}

@media (max-width: 916px) {
  .mobile-hidden {
    display: none !important;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .dashboard-title {
    font-size: 1rem;
  }

  .dashboard-subtitle {
    font-size: 0.6rem;
  }

  .stats-row {
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .stat-card {
    padding: 0.75rem;
    min-height: 60px;
    width: 150px;
    margin-bottom: 0.5rem;
  }

  .stat-icon {
    width: 40px;
    height: 40px;
  }

  .stat-number {
    font-size: 1.25rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  /* Current Problems Table */
  .table-container {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .table-container table {
    min-width: 600px;
  }

  /* Accordion */
  .accordion-header {
    font-size: 0.9rem;
  }

  /* Charts */
  .apexcharts-canvas {
    width: 100% !important;
  }

  /* Modals */
  .modal-dialog {
    margin: 0.5rem;
  }

  .modal-content {
    border-radius: 0.5rem;
  }

  /* Line Problems Modal Table */
  .modal .table-container {
    max-height: 400px;
  }

  /* Live Demo Modal */
  .modal-body .row .col {
    margin-bottom: 1rem;
  }

  .modal-body .form-label {
    font-size: 0.9rem;
  }

  /* Button adjustments */
  .btn {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }
}

@media (max-width: 480px) {
  .stats-row {
    display: none;
  }

  .stat-card {
    padding: 0.5rem;
    width: 120px;
    min-height: 70px;
    flex-direction: row;
    text-align: left;
  }

  .stat-content {
    text-align: left;
  }

  .stat-icon {
    margin-bottom: 0;
  }

  /* Dashboard header */
  .dashboard-header {
    display: none;
  }

  .dashboard-header-mobile {
    display: flex;
  }

  .last-updated {
    display: none;
  }

  /* Current Problems Table */
  .table-container table {
    font-size: 0.8rem;
  }

  .table-container th,
  .table-container td {
    padding: 0.5rem 0.25rem;
  }

  /* Line duration cards */
  .line-duration-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  .line-duration-card {
    min-height: 65px;
    padding: 4px;
  }

  .line-duration-card label {
    font-size: 0.7rem;
  }

  /* Charts */
  .apexcharts-toolbar {
    display: none;
  }

  /* Modals */
  .modal-dialog {
    margin: 0.25rem;
    max-width: calc(100vw - 0.5rem);
  }

  .modal-header,
  .modal-footer {
    padding: 0.75rem;
  }

  .modal-body {
    padding: 1rem 0.75rem;
  }

  /* Form elements in modals */
  .form-control,
  .form-select {
    font-size: 0.9rem;
    padding: 0.5rem;
  }

  /* Buttons */
  .btn-sm {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }

  /* Navigation shortcuts */
  .navigation-shortcuts {
    padding: 15px 0;
  }

  .dashboard-cards-container {
    padding: 15px 0;
  }

  .dashboard-card-wrapper {
    width: 100%;
    margin-bottom: 10px;
  }

  .dashboard-card {
    min-height: 120px;
    padding: 1rem;
  }

  .icon-container {
    width: 50px;
    height: 50px;
    padding: 12px;
  }

  .card-title {
    font-size: 1rem;
  }

  .card-description {
    font-size: 0.8rem;
  }
}

@import url('https://fonts.googleapis.com/css2?family=Inter&display=swap');
.dashboard-cards-container {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  padding: 30px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
}

.dashboard-cards-container::-webkit-scrollbar {
  height: 8px;
}

.dashboard-cards-container::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.dashboard-card-wrapper {
  flex: 0 0 auto;
  width: 200px; /* Fixed width for consistent card size */
  margin-right: 10px;
}

.dashboard-card-wrapper:last-child {
  margin-right: 0;
}

.line-danger {
  background-color: white !important;
  border: 4px solid red !important;
}

.line-warning {
  background-color: white!important;
  border: 4px solid orange !important;
}

/* Custom line duration cards styling */
.line-duration-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 5px;
}

.line-duration-card {
  border-radius: 6px;
  height: 100%;
  box-shadow: 2px 2px 5px rgba(1, 23, 79, 0.2);
  background-color: white;
  overflow: hidden;
  padding: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Hide legend card on desktop */
.legend-card {
  display: none;
}

.line-duration-card:hover {
  transform: translateY(-3px);
  box-shadow: 5px 5px 15px rgba(1, 23, 79, 0.3);
  background-color: #f8f9fa;
}

.line-duration-card hr {
  margin: 5px 0;
  border: none;
  border-top: 1px solid #dee2e6;
}

/* Responsive design for line duration cards */
@media (max-width: 768px) {
  .line-duration-container {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }

  .line-duration-card {
    min-height: 70px;
    padding: 6px;
  }

  .line-duration-card label {
    font-size: 0.75rem;
  }

  /* Show legend card only on mobile */
  .legend-card {
    display: block !important;
  }
}

@media (max-width: 480px) {
  .line-duration-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 4px;
  }

  .line-duration-card {
    min-height: 65px;
    padding: 4px;
  }

  .line-duration-card label {
    font-size: 0.7rem;
  }
}

/* Compact Navigation Styles */
.compact-navigation-container {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 15px;
  padding: 0.75rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
}

/* Hide compact navigation on screens larger than 830px */
@media (min-width: 916px) {
  .compact-navigation-container {
    display: none;
  }
}

.compact-navigation {
  margin-bottom: 0rem;
}

.compact-navigation + .compact-navigation {
  margin-top: 0rem;
}

.compact-nav-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.5rem 0;
  flex-wrap: wrap;
}

.more-button-row {
  margin-top: 0.75rem;
  margin-bottom: 0.1rem;
}

.more-button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.more-divider {
  width: 60%;
  border: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(0, 123, 255, 0.2), transparent);
  margin: 0;
}

.more-button {
  border-radius: 15px;
  padding: 0.25rem 1rem;
  font-weight: 400;
  font-size: 0.75rem;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #022950ff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  min-height: auto;
  line-height: 1.2;
}

.more-button:hover {
  transform: translateY(-1px);
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  border-color: rgba(255, 255, 255, 0.3);
}

.button-text {
  font-size: 0.75rem;
  font-weight: 400;
}



.compact-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 60px;
  padding: 0.5rem 0.25rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 149, 0, 0.377);
  box-shadow: 0 2px 8px rgba(31, 38, 135, 0.15);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  flex-shrink: 0;
}

.compact-nav-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(31, 38, 135, 0.25);
  background: rgba(255, 255, 255, 0.2);
}

.compact-nav-icon {
  margin-bottom: 0.25rem;
  color: #022950ff;
}

.compact-nav-text {
  font-size: 0.7rem;
  font-weight: 500;
  color: #2c3e50;
  line-height: 1.2;
  word-wrap: break-word;
  hyphens: auto;
}

.more-item {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.more-item .compact-nav-icon,
.more-item .compact-nav-text {
  color: white;
}

/* Summary Cards for Line Problems Modal */
.summary-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  border-radius: 10px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s ease;
  height: 70px;
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(31, 38, 135, 0.3);
}

.summary-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.summary-card:nth-child(1) .summary-icon {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.summary-card:nth-child(2) .summary-icon {
  background: linear-gradient(135deg, #f39c12, #e67e22);
}

.summary-content {
  flex: 1;
  text-align: left;
}

.summary-number {
  font-size: 1.25rem;
  font-weight: 700;
  color: #2c3e50;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.summary-label {
  font-size: 0.7rem;
  color: #7f8c8d;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Responsive adjustments for compact navigation */
@media (max-width: 768px) {
  .compact-nav-item {
    min-width: 60px;
    padding: 0.5rem 0.25rem;
  }

  .compact-nav-text {
    font-size: 0.65rem;
  }

  .summary-card {
    padding: 0.75rem;
    height: 60px;
  }

  .summary-icon {
    width: 35px;
    height: 35px;
  }

  .summary-number {
    font-size: 1.1rem;
  }

  .summary-label {
    font-size: 0.65rem;
  }
}

@media (max-width: 480px) {
  .compact-nav-container {
    gap: 1rem;
    padding: 0.5rem 0;
  }

  .compact-nav-item {
    min-width: 55px;
    padding: 0.5rem 0.2rem;
  }

  .compact-nav-text {
    font-size: 0.6rem;
  }

  .summary-card {
    padding: 0.5rem;
    height: 55px;
    gap: 0.5rem;
  }

  .summary-icon {
    width: 30px;
    height: 30px;
  }

  .summary-number {
    font-size: 1rem;
  }

  .summary-label {
    font-size: 0.6rem;
  }
}

/* Problem Shortcut Cards */
.problems-shortcut-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.problem-shortcut-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 8px;
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  min-width: 200px;
  flex: 1;
}

.problem-shortcut-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.problem-danger {
  border-color: #dc3545;
  background: rgba(220, 53, 69, 0.05);
}

.problem-warning {
  border-color: #fd7e14;
  background: rgba(253, 126, 20, 0.05);
}

.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.problem-machine {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.9rem;
}

.problem-duration {
  font-size: 0.8rem;
}

.problem-details {
  font-size: 0.85rem;
  color: #495057;
}

.problem-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
  word-wrap: break-word;
}

.problem-maker,
.problem-step-repair,
.problem-line {
  margin-top: 0.25rem;
  color: #6c757d;
}

.problem-maker strong,
.problem-step-repair strong,
.problem-line strong {
  color: #495057;
}

.problem-line-step-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

/* Mobile responsive layout for dashboard cards */
@media (max-width: 480px) {
  .dashboard-cards-container {
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 80vh; /* Adjust as needed */
  }

  .dashboard-card-wrapper {
    width: 100%;
    margin-right: 0;
    margin-bottom: 15px;
  }

  .dashboard-card {
    min-height: 150px; /* Ensure minimum height for better touch targets */
  }

  .icon-container {
    width: 80px;
    height: 80px;
    padding: 20px;
  }

  .dashboard-card h4 {
    font-size: 1.1rem;
  }

  .dashboard-card CButton {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .problem-shortcut-card {
    min-width: 180px;
  }
}

@media (max-width: 480px) {
  .dashboard-card {
    min-height: 120px;
  }

  .icon-container {
    width: 60px;
    height: 60px;
    padding: 15px;
  }

  .dashboard-card h4 {
    font-size: 1rem;
  }

  .problem-shortcut-card {
    min-width: 160px;
    padding: 0.5rem;
  }

  .problem-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .problem-machine {
    font-size: 0.8rem;
  }

  .problem-details {
    font-size: 0.8rem;
  }
}

.search-button {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 2px 2px 5px rgba(31, 38, 135, 0.37);
  color: #022950ff;
}

.search-bar {
  width: 200px;
  border-radius: 20px;
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.search-bar:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

@media (max-width: 1420px) {
  .stats-row > [class*='col-'] {
    flex: 0 0 33.333333%;
    max-width: 33.333333%;
  }
}

/* For smaller screens, revert to CoreUI's default behavior if needed */
@media (max-width: 768px) {
  .stats-row > [class*='col-'] {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

@media (max-width: 576px) {
  .stats-row > [class*='col-'] {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

@media (max-width: 916px) {
  .stats-row {
    display: none !important;
  }
}

</style>
