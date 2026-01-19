import { defineComponent, watch, h, onMounted, ref, resolveComponent} from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import utils from "@/utils/CommonUtils";

import {
  CBadge,
  CSidebarNav,
  CNavItem,
  CNavGroup,
  CNavTitle,
} from '@coreui/vue'
// import nav from '@/_nav.js'


const normalizePath = (path) =>
  decodeURI(path)
    .replace(/#.*$/, '')
    .replace(/(index)?\.(html)$/, '')

const isActiveLink = (route, link) => {
  if (link === undefined) {
    return false
  }

  if (route.hash === link) {
    return true
  }

  const currentPath = normalizePath(route.path)
  const targetPath = normalizePath(link)

  return currentPath === targetPath
}

const isActiveItem = (route, item) => {
  if (isActiveLink(route, item.to)) {
    return true
  }

  if (item.items) {
    return item.items.some((child) => isActiveItem(route, child))
  }

  return false
}


const AppSidebarNav = defineComponent({
  name: 'AppSidebarNav',
  props: [ 'nav' ],
  watch:{
      'nav'(){
          this.$emit('update:nav',this.props.nav);
      },
  },
  data(props) {
      return {
          props: props
      }
  },
  components: {
    CNavItem,
    CNavGroup,
    CNavTitle,
  },
  created(){
  },
  setup(props) {
    const route = useRoute()
    const firstRender = ref(true)

    onMounted( async() => {
      firstRender.value = false
    })
    var listBreadcrumbsNav = ''
    const getParentNode = (el, attribute) => {
      while (el && el.parentNode) {
        el = el.parentNode;
        if(el.tagName == 'HTML' ){
          return null;
        }
        if (el && el.getAttribute(attribute) != undefined) {
          return el;
        }
      }
      
      return null;
    }
    const getBreadCrumbs = (el) => {
      let currBreadcrumbsNav = getParentNode(el,'breadcrumbs');
      if(currBreadcrumbsNav!=null){
        listBreadcrumbsNav = currBreadcrumbsNav.getAttribute('breadcrumbs') + (listBreadcrumbsNav==''?'':',') + listBreadcrumbsNav;
        getBreadCrumbs(currBreadcrumbsNav);
      }else{

      }
      return listBreadcrumbsNav;
    }
    const renderItem = (item) => {
      if(item){
      if (item.items) {
        return h(
          CNavGroup,
          {
            ...(firstRender.value && {
              visible: item.items.some((child) => isActiveItem(route, child)),
            }),
            onClick: async (e) => {  
              e.preventDefault(); 
              e.stopPropagation();
              await e.target.parentNode.classList.add("breadcrumbsNav");
              await e.target.parentNode.setAttribute('breadcrumbs',
              JSON.stringify({"active":false,"name":item.name,"path":""}));
            }
          },
          {
            togglerContent: () => [
              h(resolveComponent('CIcon'), {
                customClassName: 'nav-icon',
                name: item.icon,
              }),
              item.name,
            ],
            default: () => item.items.map((child) => renderItem(child)),
          },
        )
      }

      return item.to
        ? h(
            RouterLink,
            {
              to: item.to,
              custom: true,
            },
            {
              default: (props) =>
                h(
                  resolveComponent(item.component),
                  {
                    active: props.isActive,
                    href: props.href,
                    onClick: async (e) => {
                      if (typeof e?.preventDefault === 'function') {
                        e.preventDefault();
                        e.stopPropagation();
                      }
                      if (e && e.target && e.target.parentNode) {
                        await e.target.parentNode.classList.add("breadcrumbsNav");
                        await e.target.parentNode.setAttribute('breadcrumbs',
                          JSON.stringify({"active": false, "name": item.name, "path": ""}));
                      }

                      let breadcrumbsArray = [];

                      if (item.name !== 'Home') {
                        breadcrumbsArray.push({ name: 'Home', path: '#/dc/dashboard' });
                      }

                      if (listBreadcrumbsNav) {
                        try {
                          const parsedList = JSON.parse('[' + listBreadcrumbsNav + ']');
                          breadcrumbsArray = breadcrumbsArray.concat(parsedList);
                        } catch (err) {
                          console.error('Gagal parse breadcrumbs:', err);
                        }
                      }

                      localStorage.breadcrumbs = JSON.stringify(breadcrumbsArray);

                      // console.log(listBreadcrumbsNav);
                      // console.log(localStorage.breadcrumbs);

                      try {
                        document.getElementById("breadcrumbsChangeValue").click();
                      } catch (e) {
                        console.log(e);
                      }
                      let href = props.href;
                      if (href.indexOf('http://') >= 0) {
                        window.open(href.substring(href.indexOf('http://'), href.length)
                          + '?id_token=' + localStorage.id_token, '_blank')
                      } else if (href.indexOf('https://') >= 0) {
                        window.open(href.substring(href.indexOf('https://'), href.length)
                          + '?id_token=' + localStorage.id_token, '_blank')
                      } else {
                        await props.navigate();
                      }
                      let appName = '';
                      if (item.applicationId) {

                        let responseAppAuthorized = await utils.dcQueryApi('/api/application/view', 'POST', 'id=' + item.applicationId);
                        if (responseAppAuthorized.status === 200) {
                          appName = responseAppAuthorized.data.name;
                        }
                        try {
                          document.getElementById('headerLabel1').innerHTML = process.env.VUE_APP_HEADER_LABEL + ' - ' + appName;
                          document.getElementById('headerLabel2').innerHTML = process.env.VUE_APP_HEADER_LABEL + ' - ' + appName;
                        } catch (e) {
                          console.log(e);
                        }
                      }
                    },
                  },
                  {
                    default: () => [
                      item.icon &&
                        h(resolveComponent('CIcon'), {
                          customClassName: 'nav-icon',
                          name: item.icon,
                        }),
                      item.name,
                      item.badge &&
                        h(
                          CBadge,
                          {
                            class: 'ms-auto',
                            color: item.badge.color,
                          },
                          {
                            default: () => item.badge.text,
                          },
                        ),
                    ],
                  },
                ),
            },
          )
        : h(
            resolveComponent(item.component),
            {
            },
            {
              default: () => item.name,
            },
          )
      }
    }

    return () =>
      h(
        CSidebarNav,
        {},
        {
          default: () => JSON.parse(JSON.stringify(props.nav)).map((item) => renderItem(item)),
        },
      )
  },
})

export { AppSidebarNav }
