<template>

  <div>
    <CRow>
      <CCol v-for="(card, index) in dashboardCards" :key="index" sm="6" lg="4" class="mb-4">
        <CCard class="dashboard-card h-100" :color="card.color">
          <CCardBody class="d-flex flex-column align-items-center justify-content-center text-center p-4">
            <div class="icon-container mb-3">
              <component :is="card.icon" :size="48" :stroke-width="1.5" />
            </div>
            <h4>{{ card.title }}</h4>
            <p class="card-description">{{ card.description }}</p>
            <CButton color="light" class="mt-2" @click="navigateTo(card.route)">View Details</CButton>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>

  <div>
    <CCard>
      <CCardBody>
        <div data-layer="Table" class="Table"
          style="align-self: stretch; height: 460px; padding: 10px; background: rgba(255, 255, 255, 0.30); overflow: hidden; border-radius: 20px; outline: 0.75px rgba(255, 255, 255, 0.50) solid; outline-offset: -0.75px; flex-direction: column; justify-content: flex-start; align-items: center; gap: 5px; display: inline-flex">
          <div data-layer="Table" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 0.75px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -0.75px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="No" class="No"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                No</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Machine Name" class="MachineName"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                Machine Name</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="OEE" class="Oee"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                OEE</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" class="Status"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                Status</div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="MT Call" class="MtCall"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                MT Call</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="Used" class="Used"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 800; word-wrap: break-word">
                Used</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                1</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                LPDC</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Running" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #00FF8C; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Running" class="Running"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Running</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                0 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                2</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                HPDC</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Stop U" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #F9B115; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Stop" class="Stop"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Stop</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                20 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                3</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                Cam Shaft</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Stop O" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #E55353; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Stop" class="Stop"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Stop</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                35 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                4</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                Crank Shaft</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Running" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #00FF8C; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Running" class="Running"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Running</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                0 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                5</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                Cylinder Head</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Running" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #00FF8C; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Running" class="Running"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Running</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                0 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                6</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                Cylinder Block</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Running" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #00FF8C; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Running" class="Running"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Running</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                0 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
          <div data-layer="Table" data-data="Default" class="Table"
            style="align-self: stretch; height: 70px; background: white; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05); overflow: hidden; border-radius: 30px; outline: 1px rgba(5.01, 14.24, 97.40, 0.10) solid; outline-offset: -1px; justify-content: flex-start; align-items: flex-start; display: inline-flex">
            <div data-layer="No" class="No"
              style="width: 75px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="1"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                7</div>
            </div>
            <div data-layer="Machine Name" class="MachineName"
              style="width: 235px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="LPDC" class="Lpdc"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                Assy Line</div>
            </div>
            <div data-layer="OEE Data" class="OeeData"
              style="width: 350px; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="95.3%" class="3"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                95.3%</div>
            </div>
            <div data-layer="Status" class="Status"
              style="width: 290px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="Status" data-property-1="Running" class="Status"
                style="width: 159px; padding-left: 50px; padding-right: 50px; padding-top: 10px; padding-bottom: 10px; background: #00FF8C; box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.20); overflow: hidden; border-radius: 20px; justify-content: center; align-items: center; display: flex">
                <div data-layer="Running" class="Running"
                  style="text-align: center; color: white; font-size: 15px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                  Running</div>
              </div>
            </div>
            <div data-layer="MT Call" class="MtCall"
              style="width: 250px; align-self: stretch; overflow: hidden; justify-content: center; align-items: center; display: flex">
              <div data-layer="0 Min" class="Min"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                0 Min</div>
            </div>
            <div data-layer="Used" class="Used"
              style="flex: 1 1 0; align-self: stretch; justify-content: center; align-items: center; display: flex">
              <div data-layer="211/416" class="416"
                style="text-align: center; color: black; font-size: 20px; font-family: Inter; font-weight: 500; word-wrap: break-word">
                211/416</div>
            </div>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>

</template>

<script>
import { CCard } from '@coreui/vue';
import MainChartExample from './charts/MainChartExample'
import WidgetsStatsA from './widgets/WidgetsStatsTypeA.vue'
import WidgetsStatsD from './widgets/WidgetsStatsTypeD.vue'
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
  TriangleAlert,
} from 'lucide-vue-next';
import { useRouter } from 'vue-router';
import { CCardBody } from '@coreui/vue';

export default {
  name: 'Dashboard',
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
    TriangleAlert,
  },
  setup() {
    const router = useRouter();

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
    const tableExample = [

    ]

    const dashboardCards = [
      {
        title: 'Machine Stop Input',
        icon: 'AlertTriangle',
        description: 'Record and monitor machine stop events',
        color: 'danger',
        route: '/machine-stop'
      },
      {
        title: 'MTBF',
        icon: 'Clock',
        description: 'Mean Time Between Failures metrics',
        color: 'info',
        route: '/mtbf'
      },
      {
        title: 'MTTR',
        icon: 'Timer',
        description: 'Mean Time To Repair analytics',
        color: 'warning',
        route: '/mttr'
      },
      {
        title: 'Problem History',
        icon: 'History',
        description: 'Historical issues and resolutions',
        color: 'primary',
        route: '/app/problem-history'
      },
      {
        title: 'Realtime Pareto',
        icon: 'BarChart2',
        description: 'Live Pareto analysis of issues',
        color: 'success',
        route: '/realtime-pareto'
      },
      {
        title: 'LTB Report Status',
        icon: 'FileText',
        description: 'Last Time Buy reporting and analysis',
        color: 'secondary',
        route: '/app/LTBSummary'
      },
      {
        title: 'CM Followup',
        icon: 'CalendarClock',
        description: 'Countermeasure tracking and follow-up monitoring',
        color: 'secondary',
        route: '/app/CMFollowup',
      },
      {
        title: 'KY Machines',
        icon: 'TriangleAlert',
        description: 'Machine hazard prediction and safety observation records',
        color: 'secondary',
        route: '/app/KYMachine',
      },
    ]

    const navigateTo = (route) => {
      router.push(route);
    }

    return {
      tableExample,
      progressGroupExample1,
      progressGroupExample2,
      progressGroupExample3,
      dashboardCards,
      navigateTo
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
</style>
