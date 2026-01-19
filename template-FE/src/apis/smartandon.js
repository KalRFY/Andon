import axios from 'axios'

const smartandonAxios = axios.create({
  baseURL: 'https://mt-system.id/api/smartandon',
  timeout: 10000,
})

export function getLines() {
  return smartandonAxios.get('/line')
}

export function getMachines() {
  return smartandonAxios.get('/machine')
}

const kyAxios = axios.create({
  baseURL: 'https://mt-system.id/v2/ky',
  timeout: 10000,
})

const kyMachineAxios = axios.create({
  baseURL: 'https://mt-system.id',
  timeout: 10000,
})

export function getKYData(fline, fid, name, initCount) {
  return kyAxios.get(
    `/get?fline=${encodeURIComponent(
      fline,
    )}&fid=${fid}&name=${encodeURIComponent(name)}&INIT_COUNT=${initCount}`,
  )
}

export function getKYMachines(line) {
  return kyMachineAxios.get(`/machines?line=${encodeURIComponent(line)}`)
}

export function getKYColorDash() {
  return kyAxios.get('/colordash')
}
