<template>
  <CBreadcrumb class="d-md-down-none me-auto mb-0" id="AppBreadcrumb">
    <CBreadcrumbItem
      v-for="item in breadcrumbsJsonValue"
      :key="item"
      :href="item.active ? '' : item.path"
      :active="item.active"      
      v-on:click="onClickBreadcrumb"
    >
      {{ item.name }}
    </CBreadcrumbItem>
    <CButton @click="breadcrumbsStrJsonValueChange()" id="breadcrumbsChangeValue" 
    :style="{visibility: 'hidden'}">BreadcrumbsHelper</CButton>
  </CBreadcrumb>  
</template>

<script>

export default {
  el:'#AppBreadcrumb',
  name: 'AppBreadcrumb',
  // data() {
  //     return {
  //       breadcrumbsJsonValue: [{"active":false,"name":"Home","path":"#/dc/dashboard"}]
  //     }
  // },
  data() {
      return {
        breadcrumbsJsonValue: [{"active":false,"name":"Home","path":"#/app/dashboard"}]
      }
    },
    mounted() {
      this.breadcrumbsStrJsonValueChange()
    },
    methods: {
      breadcrumbsStrJsonValueChange(){
        // console.log('mf-header '+localStorage.breadcrumbs);
        // console.log('mf-header '+JSON.parse(localStorage.breadcrumbs))
        if (localStorage.breadcrumbs) {
          this.breadcrumbsJsonValue = JSON.parse(localStorage.breadcrumbs)
        } else {
          this.breadcrumbsJsonValue = [{"active":false,"name":"Home","path":"#/dc/dashboard"}]
        }
      },
    onClickBreadcrumb(e){
      let nextBreadCrumbLiElement = e.target.parentNode.nextElementSibling;
      while(nextBreadCrumbLiElement){
        console.log(nextBreadCrumbLiElement.tagName)
        if(nextBreadCrumbLiElement.tagName==='LI'){
          nextBreadCrumbLiElement.remove();
          nextBreadCrumbLiElement = e.target.parentNode.nextElementSibling;
        }else{
          nextBreadCrumbLiElement=undefined;
        }
      }
    }
  }
}
</script>
