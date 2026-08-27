import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from 'react-native';

let _host = '';
let _port = '';
let api, apiStock, apiReturn, apiSupplier, apiPosStock, apiPosCountedStock, apiGrn;

const DEFAULT_HOST = "192.168.1.6";
const DEFAULT_PORT = "";

// Builds a base URL for one API path from the current _host/_port.
// Supports two ways of connecting:
//  - Plain IP + port on the LAN, e.g. host="192.168.1.5" port="5000"
//      -> http://192.168.1.5:5000/api/Items
//  - A full tunnel/domain URL with no port, e.g.
//    host="https://sharp-gras-gourmet-employer.trycloudflare.com" port=""
//      -> https://sharp-gras-gourmet-employer.trycloudflare.com/api/Items
function buildBaseUrl(apiPath) {
  let host = (_host || DEFAULT_HOST).trim().replace(/\/+$/, '');

  // If the saved host already includes a scheme (e.g. pasted tunnel URL),
  // use that scheme and strip it off before recombining below.
  let protocol = 'http';
  const schemeMatch = host.match(/^(https?):\/\/(.*)$/i);
  if (schemeMatch) {
    protocol = schemeMatch[1].toLowerCase();
    host = schemeMatch[2];
  }

  const port = (_port || '').trim();
  const portPart = port ? `:${port}` : '';

  return `${protocol}://${host}${portPart}/api/${apiPath}`;
}

// Call this function at app startup to update _host and _port from AsyncStorage
export async function updateApiHostPortFromStorage() {
  await initApi();
}

export async function initApi() {
  const storedHost = await AsyncStorage.getItem("api_ip");
  const storedPort = await AsyncStorage.getItem("api_port");

  _host = storedHost || DEFAULT_HOST;
  // An empty string is a deliberate "no port" choice (e.g. a tunnel URL) —
  // only fall back to the default port when nothing has ever been saved.
  _port = storedPort !== null ? storedPort : DEFAULT_PORT;

  const itemsUrl = buildBaseUrl('Items');
  api = axios.create({ baseURL: itemsUrl });
  apiStock = axios.create({ baseURL: buildBaseUrl('Stocks') });
  apiReturn = axios.create({ baseURL: buildBaseUrl('Return') });
  apiSupplier = axios.create({ baseURL: buildBaseUrl('Supplier') });
  apiPosStock = axios.create({ baseURL: buildBaseUrl('PosStock') });
  apiPosCountedStock = axios.create({ baseURL: buildBaseUrl('PosCountedStock') });
  apiGrn = axios.create({ baseURL: buildBaseUrl('GrnTemp') });

  // Debug aid: show the final base URL being used, right when it's built —
  // both in the Metro/terminal log and as an on-device popup, so you can
  // confirm it (e.g. spot a stray :5000 on a tunnel URL) without digging
  // through logs on the phone.
  console.log('[api] Final base URL:', itemsUrl);
  Alert.alert('API URL set', itemsUrl);
}



export const apigetItemWithDetailsByBarcode = (barcode) => {
  const url = `/GetItemWithDetailsByBarcode?barcode=${barcode}`;
  return api.get(url);
};

export function apigetItemByDescription(query) {
  const url = `/search?query=${query}`
  //const fullUrl = `${api.defaults.baseURL}${url}`;
 //console.log('apigetItemByDescription fullUrl:', fullUrl);
  return api.get(url);
}

export const getPriceLink = (itemCode) => {
  const url = `/GetPriceLink?itemCode=${itemCode}`;
  return api.get(url);
};

export const addPriceLink = (data) => {
  const url = '/AddPriceLink';
  return api.post(url, data);
};

export const updateItemRetPrice = (itemCode, eRetPrice) => {
  const url = "/UpdateItemRetPrice";
  const data = { itemCode, eRetPrice };
  return api.post(url, data);
};


export function apigetStockByItemCode(_itemcode) {
  return apiStock.get(`/GetStock?itemcode=${_itemcode}`);
}

export const updateStock = (data) => {
  const url = '/UpdateStock';
  return apiStock.post(url, data);
};

export function getAllReturnItemsBySuppCode(suppcode) {
  const url = `/GetItemsBySuppCode?suppcode=${suppcode}`
  return apiReturn.get(url);
}

export function apiAddReturnItem(data) {
  const url = '/AddReturnItem';
  return apiReturn.post(url, data);
}

export function apiUpdateItemById(id, data) {
  const url = `/${id}`;
  return apiReturn.put(url, data);;
}

export function apiProcessReturnItems(data) {
  const url = '/process';
  return apiReturn.post(url, data);;
}

export function apiPrint(data) {
  const url = '/print';
  return apiReturn.post(url, data);;
}

export function apiDeleteItemById(id) {
  const url = `/${id}`;
  return apiReturn.delete(url);;
}

export function apigetSuppByDescription(query) {
  const url = `/SearchSuppliers?query=${query}`
  return apiSupplier.get(url);
}

export function apigetPosStockByItemCode(_itemcode) {
  const url =`/GetPosStock?itemCode=${_itemcode}`;
  return apiPosStock.get(url);
}

export function deleteAllPosCountedStock() {
  const url = '/DeleteAll';
  return apiPosCountedStock.post(url);
}

export function deletePosCountedStockByItemCode(itemCode) {
  const url = `/DeleteByItemCode?itemCode=${itemCode}`;
  return apiPosCountedStock.post(url);
}



export function apiAddGrn(data) {
  
  const url = '/AddGrnTemp';

  //console.log('apiAddGrn', data);
   // const fullUrl = `${apiGrn.defaults.baseURL}${url}`;
  //console.log(fullUrl);

  return apiGrn.post(url, data);;
}

export function apiDeleteGrn(id) {
  const url = `/DeleteGrnTemp/${id}`;
  return apiGrn.delete(url);
}

//GetGrnTempByGrnReferenceAndStatus
export function apiGetGrnTempByGrnReferenceAndStatus(grnReference, status) {
  const url = `/GetGrnTempByGrnReferenceAndStatus?grnReference=${grnReference}&status=${status}`;
  return apiGrn.get(url);
}





