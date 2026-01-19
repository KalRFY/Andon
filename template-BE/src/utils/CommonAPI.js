const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const { cmnApi,commonApi, scApi } = require('../config/config');


const log = async (paramsHeader,paramDetails, token) => {
  let hSMessage = await addLogHeader(paramsHeader, token);
  let i = 0;
  for(i=0;i<paramDetails;i++){
      let dMessage = await addLogDetail(paramDetails[i], token);
  }
  let hEMessage = await addLogHeader(paramsHeader, token);
  return {logMessage:hEMessage}
}
const addLogHeader = async (params, token) => {
  let rMessage = await execLogHeader('add',params, token);
  return {logMessage:rMessage}
}
const updateLogHeader = async (params, token) => {
  let rMessage = await execLogHeader('edit',params, token);
  return {logMessage:rMessage}
}
const execLogHeader = async (process,params, token) => {
  let uri_message = '/api/common-log-header/'+process;
  let body_message_param = JSON.stringify(params);
  let message_responseBody = await commonJsonApi(uri_message, 'POST', token, body_message_param);
  return message_responseBody;
};
const addLogDetail = async (params, token) => {
  let rMessage = await execLogDetail('add',params, token);
  return {logMessage:rMessage}
}
const execLogDetail = async (process,params, token) => {
  let uri_message = '/api/common-log-detail/'+process;
  let body_message_param = JSON.stringify(params);
  let message_responseBody = await commonJsonApi(uri_message, 'POST', token, body_message_param);
  return message_responseBody;
}

const rejectMessage = async (msgId, msgParams, token) => {
    let rMessage = await cmnMessage(msgId, msgParams, token);
}

const cmnTextMessage = async (msgId, msgParams, token) => {
   let message =await cmnMessage(msgId, msgParams, token);
   return message.message;
}
const cmnMessage = async (msgId, msgParams, token) => {
    let uri_message = '/api/common/PlatormDatas/message';
    let body_message_param = JSON.stringify({

        MsgId: msgId,
        MsgParams: msgParams
    });
    let message_responseBody = await cmnNodeJsonApi(uri_message, 'POST', token, body_message_param);
    return {code:msgId, message:message_responseBody.data};
}

const commonJsonApi = async (uri, method, token, jsonBody) => {
  return execJsonApi(commonApi + uri, method, token, jsonBody);
};
const cmnNodeJsonApi = async (uri, method, token, jsonBody) => {
  return execJsonApi(cmnApi + uri, method, token, jsonBody);
};
const scJsonApi = async (uri, method, token, jsonBody) => {
  return execJsonApi(scApi + uri, method, token, jsonBody);
};
const execJsonApi = async (uri, method, token, jsonBody) => {
  try {
    let response = await fetch(uri, {
      method: method, // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
      body: jsonBody
    });
    let jsonResponse = await response.json();
    if (jsonResponse.status === '401') {
      throw (jsonResponse);
    }
    return jsonResponse;
  } catch (e) {
    throw e;
  }
};
const cmnNodeQueryApi = async (uri, method, token, queryParam) => {
  return execQueryApi(cmnApi + uri, method, token, queryParam);
};
const scQueryApi = async (uri, method, token, queryParam) => {
  return execQueryApi(scApi + uri, method, token, queryParam);
};
const execQueryApi = async (uri, method, token, queryParam) => {
  try {
    let response = await fetch(uri + (isEmpty(queryParam) ? '' : ('?' + queryParam)), {
      method: method, // *GET, POST, PUT, DELETE, etc.
      headers: {
        'Content-Type': 'application/json',
        "Authorization": token,
      },
    });
    let jsonResponse = await response.json();
    if (jsonResponse.status === '401') {
      throw (jsonResponse);
    }
    return jsonResponse;
  } catch (e) {
    throw e;
  }
};
const isEmpty = (obj) => {
  return obj == null || obj === undefined || obj === '';
};
const isNotEmpty = (obj) => {
  return !(obj == null || obj === undefined || obj === '');
};

module.exports = {
  cmnNodeJsonApi, isNotEmpty, isEmpty, cmnNodeQueryApi, scQueryApi, scJsonApi, execJsonApi,
  execQueryApi, cmnMessage, rejectMessage, execLogHeader, addLogHeader, execLogDetail, addLogDetail, log,updateLogHeader,
  cmnTextMessage

};
