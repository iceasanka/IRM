import axios from 'axios';

const _host = '192.168.132.21';
const _port = '5000';

const api = axios.create({
  baseURL: `http://${_host}:${_port}/api/Items`,
});

const apiStock = axios.create({
  baseURL: `http://${_host}:${_port}/api/Stocks`,
});

const apiReturn = axios.create({
  baseURL: `http://${_host}:${_port}/api/Return`,
});

const apiSupplier = axios.create({
  baseURL: `http://${_host}:${_port}/api/Supplier`,
});


export const apigetItemWithDetailsByBarcode = (barcode) => {
  const url = `/GetItemWithDetailsByBarcode?barcode=${barcode}`;
  return api.get(url);
};

export function apigetItemByDescription(query) {
  const url = `/search?query=${query}`
  return api.get(url);
}

export const getPriceLink = (itemCode) => {
  const url = `/GetPriceLink?itemCode=${itemCode}`;
  return api.get(url);
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
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`; 
  //console.log(fullUrl);
  return apiReturn.get(url);
}

export function apiAddReturnItem(data) {
  const url = '/AddReturnItem';
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`;
  // console.log(fullUrl);
  return apiReturn.post(url, data);
}

export function apiUpdateItemById(id, data) {
  const url = `/${id}`;
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`; // Combine baseURL and endpoint
  //console.log(fullUrl);
  return apiReturn.put(url, data);;
}

export function apiProcessReturnItems(data) {
  const url = '/process';
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`; // Combine baseURL and endpoint
  //console.log(fullUrl);
  return apiReturn.post(url, data);;
}

export function apiPrint(data) {
  const url = '/print';
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`;
  //console.log(fullUrl);
  return apiReturn.post(url, data);;
}

export function apiDeleteItemById(id) {
  const url = `/${id}`;
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`; // Combine baseURL and endpoint
  //console.log(fullUrl);
  return apiReturn.delete(url);;
}

export function apigetSuppByDescription(query) {
  const url = `/SearchSuppliers?query=${query}`
  //const fullUrl = `${apiReturn.defaults.baseURL}${url}`;
  //console.log(fullUrl);
  return apiSupplier.get(url);
}



