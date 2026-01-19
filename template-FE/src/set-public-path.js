import { setPublicPath } from 'systemjs-webpack-interop'

try{
    setPublicPath('@tmcp/mf-qdc', 2)
}catch(e){
    console.log('For stand alone')
    console.log(e.message)
}
