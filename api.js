import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

let _host = '';
let _port = '';
let api, apiStock, apiReturn, apiSupplier, apiPosStock, apiPosCountedStock, apiGrn;


// Call this function at app startup to update _host and _port from AsyncStorage
export async function updateApiHostPortFromStorage() {
  initApi();
}

export async function initApi() {
  _host = await AsyncStorage.getItem("api_ip") || "192.168.1.5";
  _port = await AsyncStorage.getItem("api_port") || "5000";


 api = axios.create({
  baseURL: `http://${_host}:${_port}/api/Items`,
});

 apiStock = axios.create({
  baseURL: `http://${_host}:${_port}/api/Stocks`,
});

 apiReturn = axios.create({
  baseURL: `http://${_host}:${_port}/api/Return`,
});

 apiSupplier = axios.create({
  baseURL: `http://${_host}:${_port}/api/Supplier`,
});

 apiPosStock = axios.create({
  baseURL: `http://${_host}:${_port}/api/PosStock`,
});

 apiPosCountedStock = axios.create({
  baseURL: `http://${_host}:${_port}/api/PosCountedStock`,
});


 apiGrn = axios.create({
  baseURL: `http://${_host}:${_port}/api/GrnTemp`,
});

}



export const apigetItemWithDetailsByBarcode = (barcode) => {
  const url = `/GetItemWithDetailsByBarcode?barcode=${barcode}`;
  return api.get(url);
};

export function apigetItemByDescription(query) {
  console.log(_host, _port);
  const url = `/search?query=${query}`
  const fullUrl = `${api.defaults.baseURL}${url}`;
 console.log('apigetItemByDescription fullUrl:', fullUrl);
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





