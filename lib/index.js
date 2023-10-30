var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class FetchRequest {
    constructor(config) {
        this._config = config;
    }
    _checkPromiseResponse(res) {
        if (res.ok) {
            return res.json();
        }
        return Promise.reject(`Error ${res.status}`);
    }
    _apiRequest(url, options) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(url, options);
                console.log("!!! FETCH !!!");
                return this._checkPromiseResponse(res);
            }
            catch (error) {
                return console.log(error);
            }
        });
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._apiRequest(`${this._config.baseUrl}/tasks`, {
                method: "GET",
                headers: this._config.headers,
            });
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
                method: "GET",
                headers: this._config.headers,
            });
        });
    }
    updateTaskById(id, newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
                method: "PATCH",
                headers: this._config.headers,
                body: JSON.stringify(newTaskValues)
            });
        });
    }
    deleteTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._apiRequest(`${this._config.baseUrl}/tasks/${id}`, {
                method: "DELETE",
                headers: this._config.headers,
            });
        });
    }
    addTask(newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._apiRequest(`${this._config.baseUrl}/tasks`, {
                method: "POST",
                headers: this._config.headers,
                body: JSON.stringify(newTaskValues)
            });
        });
    }
}
class XmlRequest {
    constructor(config) {
        this._getResponse = (url, method, data) => new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(method, url);
            xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
            xhr.onload = () => resolve(xhr.response);
            xhr.onerror = () => reject(xhr.status);
            xhr.send(JSON.stringify(data));
        });
        this._config = config;
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("!!! XML !!!");
            return this._getResponse(`${this._config.baseUrl}/tasks`, "GET", null);
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getResponse(`${this._config.baseUrl}/tasks/${id}`, "GET", null);
        });
    }
    updateTaskById(id, newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getResponse(`${this._config.baseUrl}/tasks/${id}`, "PATCH", newTaskValues);
        });
    }
    deleteTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getResponse(`${this._config.baseUrl}/tasks${id}`, "DELETE", null);
        });
    }
    addTask(newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._getResponse(`${this._config.baseUrl}/tasks`, "POST", newTaskValues);
        });
    }
}
export class Api {
    constructor(config) {
        this._config = config;
        this._service = this._config.type === "fetch" ? new FetchRequest(config) : new XmlRequest(config);
    }
    getTasks() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._service.getTasks();
            return data;
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._service.getTaskById(id);
            return data;
        });
    }
    updateTaskById(id, newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._service.updateTaskById(id, newTaskValues);
            return data;
        });
    }
    deleteTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._service.deleteTaskById(id);
            return data;
        });
    }
    addTask(newTaskValues) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this._service.addTask(newTaskValues);
            return data;
        });
    }
}
const fetchConfig = {
    baseUrl: 'http://37.220.80.108',
    headers: {
        "Content-Type": "application/json",
    },
    type: "fetch"
};
const xhrConfig = {
    baseUrl: 'http://37.220.80.108',
    headers: {
        "Content-Type": "application/json",
    },
    type: "xhr"
};
const idInput = document.querySelector('.input-id');
const nameInput = document.querySelector('.input-name');
const infoInput = document.querySelector('.input-info');
const requestTypeRadio = document.querySelectorAll('.radio-button');
const isImportantInput = document.querySelector('.checkbox');
const buttons = document.querySelectorAll('button');
const getTasksButton = document.querySelector('.get-tasks');
const getTaskByIdButton = document.querySelector('.get-task-by-id');
const updateTaskButton = document.querySelector('.update-task-by-id');
const addTaskButton = document.querySelector('.add-task');
const deleteTaskButton = document.querySelector('.delete-task');
let requestType;
let api;
for (const radio of requestTypeRadio) {
    if (!radio.checked) {
        buttons.forEach((button) => button.disabled = true);
    }
    radio.addEventListener('change', () => {
        if (radio.checked) {
            buttons.forEach((button) => button.disabled = false);
            requestType = radio.value;
            requestType === "fetch" ? api = new Api(fetchConfig) : api = new Api(xhrConfig);
        }
    });
}
if (getTasksButton) {
    getTasksButton.onclick = () => {
        api.getTasks().then((data) => console.log(data));
    };
}
let id;
if (idInput) {
    id = Number(idInput.value);
    idInput.addEventListener('change', () => {
        id = Number(idInput.value);
        if (!id) {
            getTaskByIdButton.disabled = true;
            updateTaskButton.disabled = true;
        }
        else {
            getTaskByIdButton.disabled = false;
            updateTaskButton.disabled = false;
        }
    });
}
let name;
if (nameInput) {
    name = nameInput.value;
    nameInput.addEventListener('change', () => {
        name = nameInput.value;
    });
}
let info;
if (infoInput) {
    info = infoInput.value;
    infoInput.addEventListener('change', () => {
        info = infoInput.value;
    });
}
let isImportant;
if (isImportantInput) {
    isImportant = isImportantInput.checked;
    isImportantInput.addEventListener('change', () => {
        isImportant = isImportantInput.checked;
    });
}
getTaskByIdButton.onclick = () => {
    api.getTaskById(id).then((data) => console.log(data));
};
updateTaskButton.onclick = () => {
    api.updateTaskById(id, { "name": name, "info": info, "isImportant": isImportant }).then((data) => console.log(data));
};
deleteTaskButton.onclick = () => {
    api.deleteTaskById(id).then((data) => console.log(data));
};
addTaskButton.onclick = () => {
    api.addTask({ "name": name, "info": info, "isImportant": isImportant }).then((data) => console.log(data));
};
//# sourceMappingURL=index.js.map