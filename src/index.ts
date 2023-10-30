type TTask = {
  name?: string;
  info?: string;
  isImportant?: boolean;
}


export interface IConfig {
  baseUrl?: 'http://37.220.80.108';
  method?: "GET" | "PATCH" | "POST" | "DELETE";
  headers?: {
    "Content-Type": "application/json",
  };
  body?: string;
  type?: "fetch" | "xhr";
}

export interface IApi {
  _config: IConfig;
  getTasks: () => Promise<unknown>;
  getTaskById: (id: number) => Promise<unknown>;
  updateTaskById: (id: number, newTaskValues: TTask) => Promise<unknown>;
  deleteTaskById: (id: number) => Promise<unknown>;
  addTask: (brandNewTask: TTask) => Promise<unknown>;
  _getResponse?: (url: string, method: string, data: TTask) => Promise<unknown>;
}

// fetch
class FetchRequest implements IApi {
  _config: IConfig;
  
  constructor (config: IConfig) {
    this._config = config;
  }

  _checkPromiseResponse <T>(res: Response): Promise<T> {
    if (res.ok) {
      return res.json();
    }

    return Promise.reject(`Error ${res.status}`);
  }

  async _apiRequest(url: string, options: IConfig) {
    try {
      const res = await fetch(url, options);
      console.log("!!! FETCH !!!")
      return this._checkPromiseResponse(res);
    } catch (error) {
      return console.log(error);
    }
  }

  async getTasks() {
    return await this._apiRequest(`${this._config.baseUrl}/tasks`, {
      method: "GET",
      headers: this._config.headers,
    });
  }

  async getTaskById(id: number) {
    return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
      method: "GET",
      headers: this._config.headers,
    });
  }

  async updateTaskById(id: number, newTaskValues: TTask) {
    return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
      method: "PATCH",
      headers: this._config.headers,
      body: JSON.stringify(newTaskValues)
    });
  }

  async deleteTaskById(id: number) {
    return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
      method: "DELETE",
      headers: this._config.headers,
    });
  }

  async addTask(newTaskValues: TTask) {
    return this._apiRequest(`${this._config.baseUrl}/tasks`, {
      method: "POST",
      headers: this._config.headers,
      body: JSON.stringify(newTaskValues)
    });
  }
}

// XMLHttpRequest
class XmlRequest implements IApi{
  _config: IConfig;
  
  constructor (config: IConfig) {
    this._config = config;
  }

  _getResponse = (url: string, method: string, data: TTask | null) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = () => resolve(xhr.response);
    xhr.onerror = () => reject(xhr.status);
    xhr.send(JSON.stringify(data));
  });

  async getTasks() {
    console.log("!!! XML !!!")
    return this._getResponse(`${this._config.baseUrl}/tasks`, "GET", null);
  }

  async getTaskById(id: number) {
    return this._getResponse(`${this._config.baseUrl}/tasks/${id}`, "GET", null);
  }

  async updateTaskById(id: number, newTaskValues: TTask) {
    return this._getResponse(`${this._config.baseUrl}/tasks/${id}`, "PATCH", newTaskValues);
  }

  async deleteTaskById(id: number) {
    return this._getResponse(`${this._config.baseUrl}/tasks${id}`, "DELETE", null);
  }

  async addTask(newTaskValues: TTask) {
    return this._getResponse(`${this._config.baseUrl}/tasks`, "POST", newTaskValues);
  }

}


// Controller

export class Api {
  _config: IConfig;
  _service: FetchRequest | XmlRequest
  constructor(config: IConfig) {
    this._config = config;
    this._service = this._config.type === "fetch" ? new FetchRequest(config) : new XmlRequest(config);
  }
  
    async getTasks() {
      const data = await this._service.getTasks()
      return data;
    }

  async getTaskById(id: number) {
    const data = await this._service.getTaskById(id)
    return data;
  }

  async updateTaskById(id: number, newTaskValues: TTask) {
    const data = await this._service.updateTaskById(id, newTaskValues)
    return data;
  }

  async deleteTaskById(id: number) {
    const data = await this._service.deleteTaskById(id)
    return data;
  }

  async addTask(newTaskValues: TTask) {
    const data = await this._service.addTask(newTaskValues)
    return data;
  }

}


const fetchConfig: IConfig = {
  baseUrl: 'http://37.220.80.108',
  headers: {
    "Content-Type": "application/json",
  },
  type: "fetch"
}

const xhrConfig: IConfig = {
  baseUrl: 'http://37.220.80.108',
  headers: {
    "Content-Type": "application/json",
  },
  type: "xhr"
}

const idInput = document.querySelector('.input-id');
const nameInput = document.querySelector('.input-name');
const infoInput = document.querySelector('.input-info');
const requestTypeRadio = document.querySelectorAll('.radio-button');
const isImportantInput = document.querySelector('.checkbox');

const buttons = document.querySelectorAll('button')
const getTasksButton = document.querySelector('.get-tasks');
const getTaskByIdButton = document.querySelector('.get-task-by-id');
const updateTaskButton = document.querySelector('.update-task-by-id');
const addTaskButton = document.querySelector('.add-task');
const deleteTaskButton = document.querySelector('.delete-task');

let requestType;
let api: IApi;

for (const radio of requestTypeRadio) {
  if (!(radio as HTMLInputElement).checked) {
    buttons.forEach((button) => button.disabled = true)
  }

  radio.addEventListener('change', () => {
    if ((radio as HTMLInputElement).checked) {
      buttons.forEach((button) => button.disabled = false)
      requestType = (radio as HTMLInputElement).value;
      requestType === "fetch" ? api = new Api(fetchConfig) : api = new Api(xhrConfig);
    }  
  })
  
}


// get tasks list 
if (getTasksButton) {
  (getTasksButton as HTMLButtonElement).onclick = () => {
    api.getTasks().then((data: unknown) => console.log(data))
  }

}

// get task by Id
let id: number;
if (idInput) {
  id = Number((idInput as HTMLInputElement).value);
  idInput.addEventListener('change', () => {
    id = Number((idInput as HTMLInputElement).value);
  
    if (!id) {
      (getTaskByIdButton as HTMLButtonElement).disabled = true;
      (updateTaskButton as HTMLButtonElement).disabled = true;
    } else {
      (getTaskByIdButton as HTMLButtonElement).disabled = false;
      (updateTaskButton as HTMLButtonElement).disabled = false;
    }
  })

}

let name: string;
if (nameInput) {
  name = (nameInput as HTMLInputElement).value;
  nameInput.addEventListener('change', () => {
    name = (nameInput as HTMLInputElement).value
  })
}

let info: string;
if (infoInput) {
  info = (infoInput as HTMLInputElement).value;
  infoInput.addEventListener('change', () => {
    info = (infoInput  as HTMLInputElement).value;
  })
}

let isImportant: boolean;
if (isImportantInput) {
  isImportant = (isImportantInput as HTMLInputElement).checked;
  isImportantInput.addEventListener('change', () => {
    isImportant = (isImportantInput as HTMLInputElement).checked;
  })
}


(getTaskByIdButton as HTMLButtonElement).onclick = () => {
  api.getTaskById(id).then((data: unknown) => console.log(data))
}

// update task info

(updateTaskButton as HTMLButtonElement).onclick = () => {
  api.updateTaskById(id, {"name": name, "info": info, "isImportant": isImportant}).then((data: unknown) => console.log(data))
}

// console.log(api.addTask(brandNewTask).then(data => console.log(data)));
(deleteTaskButton as HTMLButtonElement).onclick = () => {
  api.deleteTaskById(id).then((data: unknown) => console.log(data))
}

// console.log(api.deleteTaskById(18).then(data => console.log(data)));
(addTaskButton as HTMLButtonElement).onclick = () => {
  api.addTask({"name": name, "info": info, "isImportant": isImportant}).then((data: unknown) => console.log(data))
}

