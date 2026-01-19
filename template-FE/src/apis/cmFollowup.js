import axios from 'axios'
import dayjs from 'dayjs'

const cmAxios = axios.create({
  baseURL: 'https://mt-system.id'
})

export async function getCMFollowup(filters) {
  const { line, machine, start_date, end_date } = filters

  const response = await cmAxios.get('/cmFollowup', {
    params: {
      ...(line ? { line } : {}),
      ...(machine ? { machine } : {}),
      startDate: start_date,
      endDate: end_date,
    },
  })

  const raw = response.data?.data || response.data || []

  return raw.map((item, idx) => {
    let cms = []
    try {
      cms = JSON.parse(item.fpermanet_cm || '[]')
    } catch {
      cms = []
    }
    const first = cms[0] || {}

    const schedule = []
    if (first.datePlan) {
      const m = dayjs(first.datePlan).month() + 1
      if (m >= 1 && m <= 12) schedule.push(m)
    }

    return {
      no: idx + 1,
      line: item.fline || '-',
      machine: item.fmc_name || '-',
      date: item.fstart_time ? dayjs(item.fstart_time).format('YYYY-MM-DD') : '-',
      problem: item.ferror_name || '-',
      duration: item.fdur || '-',
      rootcause: first.cmCategory || '-',
      countermeasure: first.cmDesc || '-',
      dueDate: first.datePlan || '-',
      pic: first.pic || '-',
      status: first.judg ? 'OK' : 'NOT YET',
      kategori: first.cmCategory || '-',
      reason_occurred: !!first.judg,
      reason_delayed: false,
      schedule,
    }
  })
}
