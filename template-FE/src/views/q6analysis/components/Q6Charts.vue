<template>
  <CContainer fluid v-if="isDataValid" id="chart">
    <ApexChart
      :options="options"
      :series="validSeriesData"
      type="line"
      height="350"
    />
  </CContainer>
</template>

<script setup>
import { computed, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import ApexChart from 'vue3-apexcharts'
import { CContainer } from '@coreui/vue'

const props = defineProps({
  graphData: {
    type: Object,
    required: true,
  },
  seriesData: {
    type: Array,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const { graphData, seriesData, categories, title } = toRefs(props);

const router = useRouter();

const isValidHexColor = (color) => {
  return /^#([0-9A-F]{3}){1,2}$/i.test(color);
};

const sanitizeColors = (colors) => {
  const defaultColors = ['#FF5733', '#33FF57', '#3357FF', '#F033FF', '#FF33A1'];
  if (!Array.isArray(colors)) return defaultColors;
  const validColors = colors.filter(isValidHexColor);
  return validColors.length > 0 ? validColors : defaultColors;
};

const isDataValid = computed(() => {
  const s = Array.isArray(seriesData?.value) ? seriesData.value : [];
  return s.length > 0 && s.every(series => series && Array.isArray(series.data) && series.data.length > 0);
});

const validSeriesData = computed(() => {
  const s = Array.isArray(seriesData?.value) ? seriesData.value : [];
  return s.filter(series => series && Array.isArray(series.data) && series.data.length > 0);
});

const options = computed(() => {
    try {
        const g = graphData?.value ?? {};
        const s = Array.isArray(seriesData?.value) ? seriesData.value : [];

        return {
        chart: {
            stacked: true,
            height: 350,
            type: 'line',
            events: {
            dataPointSelection: (event, chartContext, config) => {
                const si = config?.seriesIndex;
                const di = config?.dataPointIndex;
                const item = s?.[si]?.data?.[di];
                if (!item || !item.fid) return;
                router.push(`/editProblem?v_=${item.fid}`);
            },
            },
        },
        colors: sanitizeColors(g.chartOptions?.colors),
        legend: { show: false },
        stroke: { 
            width: g.chartOptions?.strokeWidth ?? [4]
        },
        title: { text: title.value },
        dataLabels: {
            enabled: true,
            enabledOnSeries: g.chartOptions?.enabledOnSeries ?? [],
        },
        tooltip: {
            shared: true,
            intersect: false
        },

        labels: categories.value,
        xaxis: {
            categories: categories.value
        },
        yaxis: Array.isArray(g.chartOptions?.yaxis) && g.chartOptions.yaxis.length > 0
            ? g.chartOptions.yaxis[0]
            : {
                title: { text: 'Values' }
            }
        };
    } catch (error) {
        console.error('Error in options computed:', error);
        return {
        chart: { type: 'line', height: 350 },
        series: []
        };
    }
});

</script>

<style scoped>
#chart {
  width: 100%;
}
</style>