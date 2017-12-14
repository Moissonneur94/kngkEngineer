webpackJsonp([0],{

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticatedSoapService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_xml2js__ = __webpack_require__(321);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_xml2js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_xml2js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors__ = __webpack_require__(132);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__ = __webpack_require__(340);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_throw__ = __webpack_require__(343);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_throw___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_add_observable_throw__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





// import "rxjs/add/operator/map";


var AuthenticatedSoapService = /** @class */ (function () {
    function AuthenticatedSoapService(http, serviceUrl, targetNamespace) {
        this.http = http;
        this.serviceUrl = serviceUrl;
        this.targetNamespace = targetNamespace;
        this.username = "";
        this.password = "";
        this.envelopeBuilder = null;
    }
    AuthenticatedSoapService_1 = AuthenticatedSoapService;
    AuthenticatedSoapService.prototype.setAuth = function (username, password) {
        this.username = username;
        this.password = password;
    };
    AuthenticatedSoapService.prototype.getAuthBasic = function () {
        return "Basic " + btoa(this.username + ":" + this.password);
    };
    AuthenticatedSoapService.prototype.post = function (predicate, method, responseRoot, body) {
        var _this = this;
        if (!this.serviceUrl || !this.envelopeBuilder || !method || !body) {
            return null;
        }
        var envelopedRequest = this.envelopeBuilder(this.toXml(body, predicate), predicate, method, this.targetNamespace);
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
            _this.http
                .request("POST", _this.serviceUrl, {
                body: envelopedRequest,
                headers: { SOAPAction: _this.targetNamespace + "/" + method },
                withCredentials: true,
                responseType: "text"
            })
                .subscribe(function (res1) {
                return _this.convert(res1, responseRoot).subscribe(function (res) {
                    observer.next(res);
                    observer.complete();
                }, function (err) {
                    observer.error(err);
                    observer.complete();
                });
            }, function (err1) {
                return _this.convert(err1.error, responseRoot).subscribe(function (res) {
                    observer.error(res);
                    observer.complete();
                }, function (err) {
                    observer.error(err1);
                    observer.complete();
                });
            });
        });
    };
    /*
     *
     * SOAP
     *
     */
    AuthenticatedSoapService.prototype.convert = function (data, responseRoot) {
        return __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].create(function (observer) {
            new __WEBPACK_IMPORTED_MODULE_3_xml2js__["Parser"]({
                normalizeTags: true,
                tagNameProcessors: [__WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors__["stripPrefix"]],
                valueNameProcessors: [
                    __WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors__["parseBooleans"],
                    __WEBPACK_IMPORTED_MODULE_4_xml2js_lib_processors__["parseNumbers"]
                ],
                xmlns: false,
                explicitArray: false,
                explicitChildren: false,
                mergeAttrs: false
            }).parseString(data, function (err, result) {
                if (null !== err) {
                    observer.error(err);
                    observer.complete();
                    return;
                }
                observer.next(result);
                observer.complete();
            });
        });
    };
    AuthenticatedSoapService.prototype.toXml = function (parameters, predicate) {
        var xml = "";
        var parameter;
        switch (typeof parameters) {
            case "string":
                xml += parameters
                    .replace(/&/g, "&amp;")
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;");
                break;
            case "number":
            case "boolean":
                xml += parameters.toString();
                break;
            case "object":
                if (parameters.constructor.toString().indexOf("function Date()") > -1) {
                    var year = parameters.getFullYear().toString();
                    var month = ("0" + (parameters.getMonth() + 1).toString()).slice(-2);
                    var date = ("0" + parameters.getDate().toString()).slice(-2);
                    var hours = ("0" + parameters.getHours().toString()).slice(-2);
                    var minutes = ("0" + parameters.getMinutes().toString()).slice(-2);
                    var seconds = ("0" + parameters.getSeconds().toString()).slice(-2);
                    var milliseconds = parameters.getMilliseconds().toString();
                    var tzOffsetMinutes = Math.abs(parameters.getTimezoneOffset());
                    var tzOffsetHours = 0;
                    while (tzOffsetMinutes >= 60) {
                        tzOffsetHours++;
                        tzOffsetMinutes -= 60;
                    }
                    var tzMinutes = ("0" + tzOffsetMinutes.toString()).slice(-2);
                    var tzHours = ("0" + tzOffsetHours.toString()).slice(-2);
                    var timezone = (parameters.getTimezoneOffset() < 0 ? "-" : "+") +
                        tzHours +
                        ":" +
                        tzMinutes;
                    xml +=
                        year +
                            "-" +
                            month +
                            "-" +
                            date +
                            "T" +
                            hours +
                            ":" +
                            minutes +
                            ":" +
                            seconds +
                            "." +
                            milliseconds +
                            timezone;
                }
                else if (parameters.constructor.toString().indexOf("function Array()") > -1) {
                    // Array
                    for (parameter in parameters) {
                        if (parameters.hasOwnProperty(parameter)) {
                            if (!isNaN(parameter)) {
                                // linear array
                                /function\s+(\w*)\s*\(/gi.exec(parameters[parameter].constructor.toString());
                                var type = RegExp.$1;
                                switch (type) {
                                    case "":
                                        type = typeof parameters[parameter];
                                        break;
                                    case "String":
                                        type = "string";
                                        break;
                                    case "Number":
                                        type = "int";
                                        break;
                                    case "Boolean":
                                        type = "bool";
                                        break;
                                    case "Date":
                                        type = "DateTime";
                                        break;
                                }
                                xml += this.toElement(type, parameters[parameter], predicate);
                            }
                            else {
                                // associative array
                                xml += this.toElement(parameter, parameters[parameter], predicate);
                            }
                        }
                    }
                }
                else {
                    // Object or custom function
                    for (parameter in parameters) {
                        if (parameters.hasOwnProperty(parameter)) {
                            xml += this.toElement(parameter, parameters[parameter], predicate);
                        }
                    }
                }
                break;
            default:
                throw new Error("SoapService error: type '" + typeof parameters + "' is not supported");
        }
        return xml;
    };
    AuthenticatedSoapService.prototype.toElement = function (tagNamePotentiallyWithAttributes, parameters, predicate) {
        var elementContent = this.toXml(parameters, predicate);
        if (undefined !== predicate) {
            predicate += ":";
        }
        else {
            predicate = "";
        }
        if ("" === elementContent) {
            return "<" + predicate + tagNamePotentiallyWithAttributes + "/>";
        }
        else {
            return ("<" +
                predicate +
                tagNamePotentiallyWithAttributes +
                ">" +
                elementContent +
                "</" +
                predicate +
                AuthenticatedSoapService_1.stripTagAttributes(tagNamePotentiallyWithAttributes) +
                ">");
        }
    };
    AuthenticatedSoapService.stripTagAttributes = function (tagNamePotentiallyWithAttributes) {
        tagNamePotentiallyWithAttributes = tagNamePotentiallyWithAttributes + " ";
        return tagNamePotentiallyWithAttributes.slice(0, tagNamePotentiallyWithAttributes.indexOf(" "));
    };
    AuthenticatedSoapService = AuthenticatedSoapService_1 = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__angular_common_http__["b" /* HttpClient */], String, String])
    ], AuthenticatedSoapService);
    return AuthenticatedSoapService;
    var AuthenticatedSoapService_1;
}());

//# sourceMappingURL=authenticatedSoap.service.js.map

/***/ }),

/***/ 133:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditTaskComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__myListTask_myListTask__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__listTask_listTask__ = __webpack_require__(63);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the EditingComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
var EditTaskComponent = /** @class */ (function () {
    function EditTaskComponent(events, data, loadingCtrl, alerCtrl, navParams, formBuilder, navCtrl) {
        this.events = events;
        this.data = data;
        this.loadingCtrl = loadingCtrl;
        this.alerCtrl = alerCtrl;
        this.navParams = navParams;
        this.formBuilder = formBuilder;
        this.navCtrl = navCtrl;
        this.nomer = "";
        this.typeOfReq = "";
        this.stats = "";
        this.myPage = "";
        this.statusTask = "Завершен";
        this.statExec = "Зарегистрирован";
        this.taskD = [];
        /*
        * Логические переменные
        */
        this.edClick = false; // для редактирования заявки
        this.ComBody = "";
        this.executor = "";
        this.DFile = "";
        this.NFile = "";
        this.Attaches = new Array();
        this.nomer = navParams.get("nomer");
        this.typeOfReq = navParams.get("typeOfReq");
        this.stats = navParams.get("stats");
        this.myPage = navParams.get("myPages");
        this.base = navParams.get('base');
        this.ImageBase64();
        // console.log(this.nomer);
        // console.log(this.typeOfReq);
    }
    EditTaskComponent.prototype.ImageBase64 = function () {
        this.type = "image/png";
        this.numI = this.base.length;
        this.base64 = this.base.replace(/\s/g, "");
        // for(var i = 0; i<=this.numI; i+= 64){
        this.base64 = this.base64.replace(/\n/g, "");
        // }
        this.datas = "data:image/jpg;base64," + this.base64;
        console.log(this.base64);
    };
    EditTaskComponent.prototype.ionViewWillLoad = function () {
        this.item = this.formBuilder.control("");
    };
    EditTaskComponent.prototype.ngOnInit = function () {
        this.getTaskDescription();
    };
    EditTaskComponent.prototype.doRefresh = function (refresher) {
        this.getTaskDescription(refresher);
        refresher.complete();
    };
    EditTaskComponent.prototype.getTaskDescription = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.GetTaskDescription(this.nomer, this.typeOfReq).subscribe(function (result) {
            _this.taskD = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("GetTaskDescription(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
    };
    // кнопка редактировать
    EditTaskComponent.prototype.EditTask = function () {
        this.edClick = this.edClick === true ? false : true;
    };
    // Взять в работу
    EditTaskComponent.prototype.Appoint = function () { };
    EditTaskComponent.prototype.TakeToWork = function () { };
    // Добавить комментарий
    EditTaskComponent.prototype.AddComment = function (event, text, refresher) {
        var _this = this;
        this.ComBody = text;
        console.log(this.ComBody);
        this.Attaches.push();
        this.data
            .EditTask(this.nomer, this.typeOfReq, this.ComBody, this.Attaches)
            .subscribe(function (result) {
            _this.taskD = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("EditTask(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
        this.edClick = false;
    };
    // изменение статуса заявки
    EditTaskComponent.prototype.ChangeStat = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.CancelTask(this.nomer, this.typeOfReq).subscribe(function (result) {
            _this.cancelTask = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("CancelTask(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
        if (this.myPage === "ListTaskComponent") {
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_5__listTask_listTask__["a" /* ListTaskComponent */], null, null);
        }
        if (this.myPage === "MyListTaskComponent") {
            // this.navCtrl.insert(1, MyListTaskComponent);
            //   this.navCtrl.popToRoot();
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__myListTask_myListTask__["a" /* MyListTaskComponent */], null, null);
        }
    };
    EditTaskComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "editTask",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\editTask\editTask.html"*/'<ion-header class="body">\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Редактирование заявки:\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="Нажмите вниз чтобы обновить..." refreshingSpinner="circles"\n      refreshingText="Обновление..."></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-toolbar>\n    <div *ngFor="let task of taskD">\n      {{task.id}}\n      <p>\n        <b>Тема: </b>{{task.subject}}</p>\n      <p>\n        <img [src]="datas" width="100" heigth="100" class="leftimg">\n        <b>Инициатор:</b> {{task.owner.fio}}<br>\n        <b>Организация:</b> {{task.owner.company}}<br>\n      \n      \n        <b>Телефон:</b> {{task.owner.telephone}}\n      <p>\n        <b>Статус:</b> {{task.status.status}}</p>\n      <span *ngIf="task.urgency.urgency">\n        <p>\n          <b>Срочность:</b> {{task.urgency.urgency}}</p>\n      </span>\n      <p>\n        <b>Дата и время:</b> {{task.created}}</p>\n\n        <!-- <p><b>Инициатор2:</b> {{task.executor.fio}}</p> -->\n        <!-- {{stats}}\n    {{myPage}} -->\n    <!-- {{tests}} -->\n    <!-- <p><img [src]="datas" width="100" heigth="100"></p> -->\n    <!-- <hr> -->\n    <!-- {{base64}} -->\n    </div>\n\n    <div *ngIf="edClick==true">\n      <button ion-button block (click)="ChangeStat()">\n        Выполнено\n      </button>\n    </div>\n  </ion-toolbar>\n\n  <br>\n\n  <ion-toolbar>\n    <div *ngFor="let task of taskD">\n      <div padding [innerHTML]="task.comBody" *ngIf="edClick==false"></div>\n    </div>\n\n    <div *ngIf="edClick==true">\n      <text-editor [formControlItem]="item"></text-editor>\n      <button ion-button block (click)="AddComment($event, item.value)">\n        Написать комментарий\n      </button>\n    </div>\n  </ion-toolbar>\n\n  <br>\n\n  <ion-toolbar *ngIf="stats != statusTask">\n    <ion-row>\n      <ion-grid>\n        <ion-row justify-content-center>\n\n\n          <ion-col>\n            <button ion-button block (click)="EditTask()">\n              Редактировать\n            </button>\n          </ion-col>\n\n          <ion-col *ngIf="stats==statExec">\n            <button ion-button color="secondary" block icon-start (click)="TakeToWork()">\n              <b>Взять в работу</b>\n            </button>\n          </ion-col>\n\n        </ion-row>\n      </ion-grid>\n    </ion-row>\n  </ion-toolbar>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\editTask\editTask.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__["a" /* GetDataService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]])
    ], EditTaskComponent);
    return EditTaskComponent;
}());

//# sourceMappingURL=editTask.js.map

/***/ }),

/***/ 134:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CreateTaskComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_service_getData_service__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CreateTaskComponent = /** @class */ (function () {
    function CreateTaskComponent(navCtrl, alerCtrl, formBuilder, data, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.alerCtrl = alerCtrl;
        this.formBuilder = formBuilder;
        this.data = data;
        this.loadingCtrl = loadingCtrl;
        this.subjectTask = ""; // текст заявки
        this.body = "";
        this.error = false;
        // private tasks: Array<CTask> = [];
        this.newTask = [];
        this.service = [];
        this.serviceCat = [];
        this.Attaches = new Array();
        this.id = "000000007";
        this.CatId = "000000005";
        this.Keys = 0;
        this.typeCat = "";
    }
    CreateTaskComponent.prototype.ionViewWillLoad = function () {
        this.item = this.formBuilder.control("");
    };
    CreateTaskComponent.prototype.ngOnInit = function () {
        this.Service();
    };
    CreateTaskComponent.prototype.doRefresh = function (refresher) {
        this.Category(refresher);
        this.Service(refresher);
        refresher.complete();
    };
    CreateTaskComponent.prototype.Service = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.Service().subscribe(function (result) {
            _this.service = result;
            _this.serviceCat[0] = _this.service[_this.Keys].category;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("Router(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
    };
    CreateTaskComponent.prototype.Category = function (refresher) {
        if (this.Keys === 18) {
            this.CatId = this.service[17].category[0].id;
            this.typeCat = this.service[17].category[0].typeCategory;
            this.id = this.service[17].id;
            this.serviceCat[0] = this.service[17].category;
        }
        if (this.Keys === 19) {
            this.CatId = this.service[18].category[0].id;
            this.typeCat = this.service[18].category[0].typeCategory;
            this.id = this.service[17].id;
            this.serviceCat[0] = this.service[18].category;
        }
        if (this.Keys <= 16) {
            this.CatId = this.service[this.Keys].category[0].id;
            this.typeCat = this.service[this.Keys].category[0].typeCategory;
            this.id = this.service[this.Keys].id;
            this.serviceCat[0] = this.service[this.Keys].category;
        }
    };
    // создание заявки
    CreateTaskComponent.prototype.CreateTask = function (event, body, subject, refresher) {
        // проверка на заполненые поля
        var _this = this;
        // if(this.subjectTask==null || this.subjectTask=="") {
        //   this.errorField();
        // }
        //   else if(!this.error) {
        //   this.errorAlert();
        // }
        //   else {
        //     this.completeAlert();
        // }
        // Данные заявки
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data
            .NewTask((this.body = body), (this.subjectTask = subject), this.id, this.CatId, this.typeCat, this.Attaches)
            .subscribe(function (result) {
            _this.newTask = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("Router(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
        /*
        * ТУТ ДОЛЖНЫ БЫТЬ ИНСТРУКИИ
        */
        this.completeAlert();
        this.CloseOrder();
    };
    CreateTaskComponent.prototype.CloseOrder = function () {
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomeComponent */]);
    };
    // Оповещения для пользователя
    CreateTaskComponent.prototype.completeAlert = function () {
        var alert = this.alerCtrl.create({
            title: "Заявка принята",
            message: "Спасибо за вашу заявку, ожидайте результатов выполнения!",
            buttons: ["Закрыть"]
        });
        alert.present();
    };
    CreateTaskComponent.prototype.errorAlert = function () {
        var alert = this.alerCtrl.create({
            title: "Ошибка",
            message: "Произошла ошибка, пожалуйста повторите отправку заявки",
            buttons: ["Закрыть"]
        });
        alert.present();
    };
    CreateTaskComponent.prototype.errorField = function () {
        var alert = this.alerCtrl.create({
            title: "Пустые поля",
            message: "Есть пустые поля, пожалуйста заполните все поля и повторите отправку заявки",
            buttons: ["Закрыть"]
        });
        alert.present();
    };
    CreateTaskComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "createTask",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\createTask\createTask.html"*/'<ion-header class="body">\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Создать заявку\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n  <!-- <ion-refresher  (ionPull)="doRefresh($event)">\n    <ion-refresher-content>\n    </ion-refresher-content>\n  </ion-refresher> -->\n  <br>\n  <ion-list>\n\n    <ion-item>\n      <ion-label>Услуги</ion-label>\n      <ion-select [(ngModel)]="Keys" interface="popover" placeholder="Выберите услугу" (ionChange)="Category($event)">\n        <ion-option *ngFor="let s of service" [value]="s.keys">{{s.name}} </ion-option>\n      </ion-select>\n    </ion-item>\n    <br>\n    <ion-item>\n      <ion-label>Категории</ion-label>\n      <ion-select [(ngModel)]="CatId" interface="popover" placeholder="Выберите категорию">\n        <ion-option *ngFor="let sc of serviceCat[0]" [value]="sc.id">{{sc.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n\n    <ion-item>\n      <ion-label color="primary" stacked>\n        <label for="subject">Тема заявки</label>\n      </ion-label>\n      <ion-input type="user" [(ngModel)]="subjectTask" required placeholder="Тема заявки"></ion-input>\n    </ion-item>\n\n  </ion-list>\n  <ion-label color="primary" stacked>\n    <label for="body">Введите текст вашей заявки</label>\n  </ion-label>\n  <text-editor [formControlItem]="item"></text-editor>\n\n  <br>\n\n  <ion-grid>\n    <ion-row>\n\n      <ion-col col-6>\n        <button ion-button block color="secondary" submit icon-start (click)="CreateTask($event, item.value, subjectTask)">\n          <ion-icon name="checkmark-circle" item-left></ion-icon>\n          Создать\n        </button>\n      </ion-col>\n\n      <ion-col col-6>\n        <button ion-button block color="danger" icon-start (click)="CloseOrder()">\n          <ion-icon name="close-circle" item-left></ion-icon>\n          Отмена\n        </button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n\n  <hr>\n\n  <!-- <div padding [innerHTML]="item.value"></div>\n  <div >{{typeCat}}</div> -->\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\createTask\createTask.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__app_service_getData_service__["a" /* GetDataService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], CreateTaskComponent);
    return CreateTaskComponent;
}());

//# sourceMappingURL=createTask.js.map

/***/ }),

/***/ 145:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 145;

/***/ }),

/***/ 187:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 187;

/***/ }),

/***/ 240:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var HelpComponent = /** @class */ (function () {
    function HelpComponent() {
    }
    HelpComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\help\help.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <button ion-button menuToggle icon-only>\n\n      <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n      Справка\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n    <img src="../resources/icon.png">\n\n  Департамент ИТ\n\n  <hr>\n\n  Версия 1.6\n\n</ion-content>'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\help\help.html"*/
        })
    ], HelpComponent);
    return HelpComponent;
}());

//# sourceMappingURL=help.js.map

/***/ }),

/***/ 241:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__home_home__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__app_service_getData_service__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_storage__ = __webpack_require__(227);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var LoginComponent = /** @class */ (function () {
    function LoginComponent(navCtrl, loadingCtrl, data, storage) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.data = data;
        this.storage = storage;
        this.user = "";
        this.password = "";
        this.saveUser = false;
        this.errorHeader = null;
        this.errorText = null;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.data.clearAuth();
        this.storage.get("user").then(function (user) { return (_this.user = user); });
        this.storage.get("saveUser").then(function (saveUser) { return (_this.saveUser = saveUser); });
        this.storage.get("password").then(function (password) { return (_this.password = password); });
    };
    LoginComponent.prototype.setSaveUser = function () {
        if (this.saveUser === true) {
            this.storage.set("saveUser", true);
            this.storage.set("user", this.user);
            this.storage.set("password", this.password);
        }
        else {
            this.storage.set("saveUser", false);
            this.storage.set("user", "");
            this.storage.set("password", "");
        }
    };
    LoginComponent.prototype.userLogin = function () {
        var _this = this;
        this.setSaveUser();
        this.errorHeader = "";
        this.errorText = "";
        var loader = this.loadingCtrl.create({
            content: "Пожалуйста подождите пока выполняется вход..."
        });
        loader.present();
        this.data.setAuth(this.user, this.password);
        this.data.GetUser(this.user).subscribe(function (user) {
            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_2__home_home__["a" /* HomeComponent */], null, null, function () {
                loader.dismiss();
            });
        }, function (error) {
            loader.dismiss();
            _this.errorHeader = error["faultheader"];
            _this.errorText = error["faultstring"];
        });
    };
    LoginComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "login",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\login\login.html"*/'<ion-header>\n  <ion-toolbar>\n    <hr>\n    <ion-title class="">Вход</ion-title>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-item>\n    <ion-label color="primary" stacked>\n      <label for="user">Пользователь</label>\n    </ion-label>\n    <ion-input type="user" [(ngModel)]="user" required placeholder="Пользователь"></ion-input>\n  </ion-item>\n\n  <ion-item>\n    <ion-label color="primary" stacked>\n      <label for="password">Пароль</label>\n    </ion-label>\n    <ion-input type="password" [(ngModel)]="password" required placeholder="Пароль"></ion-input>\n  </ion-item>\n\n  <div>\n    <ion-item>\n      <ion-label>Запомнить меня</ion-label>\n      <ion-checkbox color="dark" [(ngModel)]="saveUser"></ion-checkbox>\n    </ion-item>\n  </div>\n  <br>\n  <br>\n\n  <div padding>\n    <button ion-button submit block (click)="userLogin()">Вход</button>\n  </div>\n\n  <div padding *ngIf="errorText">\n    <ion-card>\n      <ion-card-header class="danger">\n        {{errorHeader}}\n      </ion-card-header>\n      <ion-card-content class="danger">\n        {{errorText}}\n      </ion-card-content>\n    </ion-card>\n  </div>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\login\login.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_3__app_service_getData_service__["a" /* GetDataService */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_storage__["b" /* Storage */]])
    ], LoginComponent);
    return LoginComponent;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 242:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(243);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(263);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 263:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_login_login__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_home_home__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_listTask_listTask__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_createTask_createTask__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_myListTask_myListTask__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_search_search__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_editTask_editTask__ = __webpack_require__(133);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_settings_settings__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_help_help__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_status_bar__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_splash_screen__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__angular_common_http__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__service_constants__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__service_authenticationInterceptor_service__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__service_authenticatedSoap_service__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__service_getData_service__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_textEditor_textEditor__ = __webpack_require__(357);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};














// import { CTask, CUser, CUrgency, CStatus, CCategory, CService }   from './classes';








var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* KNGKEngineer */],
                __WEBPACK_IMPORTED_MODULE_6__components_home_home__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_7__components_listTask_listTask__["a" /* ListTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_5__components_login_login__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_8__components_createTask_createTask__["a" /* CreateTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_myListTask_myListTask__["a" /* MyListTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_10__components_search_search__["a" /* SearchComponent */],
                __WEBPACK_IMPORTED_MODULE_11__components_editTask_editTask__["a" /* EditTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_12__components_settings_settings__["a" /* SettingsComponent */],
                __WEBPACK_IMPORTED_MODULE_13__components_help_help__["a" /* HelpComponent */],
                __WEBPACK_IMPORTED_MODULE_21__components_textEditor_textEditor__["a" /* TextEditorComponent */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["c" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* KNGKEngineer */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* KNGKEngineer */],
                __WEBPACK_IMPORTED_MODULE_6__components_home_home__["a" /* HomeComponent */],
                __WEBPACK_IMPORTED_MODULE_7__components_listTask_listTask__["a" /* ListTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_5__components_login_login__["a" /* LoginComponent */],
                __WEBPACK_IMPORTED_MODULE_8__components_createTask_createTask__["a" /* CreateTaskComponent */],
                __WEBPACK_IMPORTED_MODULE_9__components_myListTask_myListTask__["a" /* MyListTaskComponent */],
                // SearchComponent,
                __WEBPACK_IMPORTED_MODULE_11__components_editTask_editTask__["a" /* EditTaskComponent */],
                // SettingsComponent,
                __WEBPACK_IMPORTED_MODULE_13__components_help_help__["a" /* HelpComponent */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_splash_screen__["a" /* SplashScreen */],
                {
                    provide: __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["a" /* HTTP_INTERCEPTORS */],
                    useClass: __WEBPACK_IMPORTED_MODULE_18__service_authenticationInterceptor_service__["a" /* AuthenticationInterceptor */],
                    multi: true
                },
                {
                    provide: __WEBPACK_IMPORTED_MODULE_19__service_authenticatedSoap_service__["a" /* AuthenticatedSoapService */],
                    useFactory: function (hd) {
                        return new __WEBPACK_IMPORTED_MODULE_19__service_authenticatedSoap_service__["a" /* AuthenticatedSoapService */](new __WEBPACK_IMPORTED_MODULE_16__angular_common_http__["b" /* HttpClient */](hd), __WEBPACK_IMPORTED_MODULE_17__service_constants__["b" /* MAIN_URL */], __WEBPACK_IMPORTED_MODULE_17__service_constants__["a" /* MAIN_NAMESPACE */]);
                    },
                    deps: [__WEBPACK_IMPORTED_MODULE_16__angular_common_http__["d" /* HttpHandler */]]
                },
                __WEBPACK_IMPORTED_MODULE_20__service_getData_service__["a" /* GetDataService */],
                { provide: __WEBPACK_IMPORTED_MODULE_1__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["d" /* IonicErrorHandler */] }
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 308:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return KNGKEngineer; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(232);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_home_home__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_listTask_listTask__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_login_login__ = __webpack_require__(241);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_createTask_createTask__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_myListTask_myListTask__ = __webpack_require__(77);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









// import { SearchComponent } from '../components/search/search';
// import { SettingsComponent } from '../components/settings/settings';
// import { HelpComponent } from '../components/help/help';
var KNGKEngineer = /** @class */ (function () {
    function KNGKEngineer(platform, statusBar, splashScreen) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.rootPage = __WEBPACK_IMPORTED_MODULE_6__components_login_login__["a" /* LoginComponent */]; // HomeComponent;
        this.lastPage = __WEBPACK_IMPORTED_MODULE_4__components_home_home__["a" /* HomeComponent */];
        this.initializeApp();
        // used for an example of ngFor and navigation
        this.pages = [
            { title: "Домашняя страница", component: __WEBPACK_IMPORTED_MODULE_4__components_home_home__["a" /* HomeComponent */] },
            { title: "Все заявки", component: __WEBPACK_IMPORTED_MODULE_5__components_listTask_listTask__["a" /* ListTaskComponent */] },
            { title: "Заявки выполняемые мною", component: __WEBPACK_IMPORTED_MODULE_8__components_myListTask_myListTask__["a" /* MyListTaskComponent */] },
            // { title: 'Поиск заявки', component: SearchComponent },
            { title: "Создать заявку", component: __WEBPACK_IMPORTED_MODULE_7__components_createTask_createTask__["a" /* CreateTaskComponent */] },
            // { title: 'Настройки', component: SettingsComponent },
            // { title: 'Справка', component: HelpComponent },
            { title: "Выход", component: __WEBPACK_IMPORTED_MODULE_6__components_login_login__["a" /* LoginComponent */] }
        ];
    }
    KNGKEngineer.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            _this.statusBar.styleDefault();
            _this.splashScreen.hide();
        });
    };
    KNGKEngineer.prototype.openPage = function (page) {
        // Reset the content nav to have just this page
        // we wouldn't want the back button to show in this scenario
        this.nav.setRoot(page.component);
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* Nav */])
    ], KNGKEngineer.prototype, "nav", void 0);
    KNGKEngineer = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\app\app.html"*/'<ion-menu [content]="content">\n  <ion-header no-border>\n    <ion-toolbar>\n      <ion-title>Меню</ion-title>\n    </ion-toolbar>\n  </ion-header>\n\n  <ion-content>\n    <ion-list>\n      <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">\n        {{p.title}}\n      </button>\n    </ion-list>\n  </ion-content>\n\n</ion-menu>\n\n<!-- Disable swipe-to-go-back because it\'s poor UX to combine STGB with side menus -->\n<ion-nav [root]="rootPage" #content swipeBackEnabled="false"></ion-nav>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], KNGKEngineer);
    return KNGKEngineer;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 31:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GetDataService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__authenticatedSoap_service__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__classes__ = __webpack_require__(50);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var GetDataService = /** @class */ (function () {
    function GetDataService(soap) {
        this.soap = soap;
        /*
         * User
         */
        this.user = "";
        this.debugMode = false;
    }
    GetDataService.prototype.clearAuth = function () {
        this.user = "";
        this.cuser = undefined;
        this.soap.setAuth("", "");
    };
    GetDataService.prototype.setAuth = function (user, password, debugText) {
        this.user = user;
        this.soap.setAuth(user, password);
    };
    GetDataService.prototype.handleError = function (observer, error) {
        var errorHeader = "";
        var errorText = "";
        if (typeof error["envelope"] === "object") {
            errorHeader = error["envelope"]["body"]["fault"]["faultcode"] || "";
            errorText =
                error["envelope"]["body"]["fault"]["faultstring"] || "Server error.";
        }
        else if (typeof error["html"] === "object") {
            if (error["html"]["h1"]) {
                errorHeader = error["html"]["h1"];
                errorText = error["html"]["_"];
            }
            else {
                errorHeader = error["html"]["body"]["div"]["div"][0]["h3"];
                errorText = error["html"]["body"]["div"]["div"][0]["h4"];
            }
        }
        else {
            errorHeader = "Server error";
            errorText = error;
        }
        observer.error(new __WEBPACK_IMPORTED_MODULE_3__classes__["c" /* CError */]({
            faultheader: errorHeader,
            faultstring: errorText
        }));
        observer.complete();
    };
    GetDataService.prototype.envelopedRequest = function (req, pred, method, targetNamespace) {
        return ('<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:' +
            pred +
            '="' +
            targetNamespace +
            '">' +
            "   <soapenv:Header/>" +
            "     <soapenv:Body>" +
            "      <" +
            pred +
            ":" +
            method +
            ">" +
            req +
            "      </" +
            pred +
            ":" +
            method +
            ">" +
            "   </soapenv:Body>" +
            "</soapenv:Envelope>");
    };
    GetDataService.prototype.GetUser = function (user) {
        var _this = this;
        if (this.cuser && undefined === this.cuser) {
            return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) { return _this.cuser; });
        }
        this.soap.envelopeBuilder = this.envelopedRequest;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "GetUser", "m:return", {
                log: user,
                pic: false,
                Executor: false
            })
                .subscribe(function (data) {
                _this.cuser = new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                    fio: data["envelope"]["body"]["getuserresponse"]["return"]["фио"]["_"],
                    avatar: data["envelope"]["body"]["getuserresponse"]["return"]["аватар"]["_"],
                    position: data["envelope"]["body"]["getuserresponse"]["return"]["должность"]["_"],
                    channelTelephone: data["envelope"]["body"]["getuserresponse"]["return"]["каналтелефонии"]["_"],
                    countActive: data["envelope"]["body"]["getuserresponse"]["return"]["количествоактивных"]["_"],
                    company: data["envelope"]["body"]["getuserresponse"]["return"]["организация"]["_"],
                    email: data["envelope"]["body"]["getuserresponse"]["return"]["основнойemail"]["_"],
                    telephone: data["envelope"]["body"]["getuserresponse"]["return"]["основнойтелефон"]["_"],
                    departament: data["envelope"]["body"]["getuserresponse"]["return"]["подразделение"]["_"],
                    manager: data["envelope"]["body"]["getuserresponse"]["return"]["руководительнаименование"]["_"]
                });
                observer.next(_this.cuser);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.GetTask = function (isCurUser, status, isAllTast, debugText) {
        var _this = this;
        // if (this.tasks && this.tasks.length != 0 && undefined === debugText) {
        //   return Observable.create( observer => {
        //     return this.tasks;
        //   });
        // }
        var stat = "";
        if (status === true) {
            stat = "в работе";
        }
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_GetTask", "m:return", {
                log: _this.user,
                Dept: isCurUser
                    ? ""
                    : undefined === _this.cuser.departament
                        ? ""
                        : _this.cuser.departament,
                Status: stat,
                Executor: isCurUser ? true : false,
                Alltask: isAllTast ? true : false
            })
                .subscribe(function (data) {
                _this.tasks = [];
                var self = _this;
                if (Array.isArray(data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"])) {
                    data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"].forEach(function (d) {
                        self.tasks.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["g" /* CTask */]({
                            created: d["дата"].replace("T", " "),
                            owner: "object" !== typeof d["инициатор"]
                                ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                                : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                                    avatar: d["инициатор"]["аватар"],
                                    position: d["инициатор"]["должность"],
                                    channelTelephone: d["инициатор"]["channelTelephone"],
                                    countActive: d["инициатор"]["количествоактивных"],
                                    company: d["инициатор"]["организация"],
                                    email: d["инициатор"]["основнойemail"],
                                    telephone: d["инициатор"]["основнойтелефон"],
                                    department: d["инициатор"]["подразделение"],
                                    manager: d["инициатор"]["руководительнаименование"],
                                    fio: d["инициатор"]["фио"]
                                }),
                            id: d["код"],
                            subject: d["наименование"],
                            body: d["описание"],
                            dateOfExecution: d["срокиисполнения"],
                            status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                                status: d["статус"]
                            }),
                            executor: "object" !== typeof d["текущийисполнитель"]
                                ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                                : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                                    avatar: d["текущийисполнитель"]["аватар"],
                                    position: d["текущийисполнитель"]["должность"],
                                    channelTelephone: d["текущийисполнитель"]["channelTelephone"],
                                    countActive: d["текущийисполнитель"]["количествоактивных"],
                                    company: d["текущийисполнитель"]["организация"],
                                    email: d["текущийисполнитель"]["основнойemail"],
                                    telephone: d["текущийисполнитель"]["основнойтелефон"],
                                    department: d["текущийисполнитель"]["подразделение"],
                                    manager: d["текущийисполнитель"]["руководительнаименование"],
                                    fio: d["текущийисполнитель"]["фио"]
                                }),
                            usageType: d["типобращения"],
                            service: "object" !== typeof d["услуга"]
                                ? new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({})
                                : new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                                    avatar: d["услуга"]["аватар"],
                                    id: d["услуга"]["код"],
                                    name: d["услуга"]["наименование"]
                                })
                        }));
                    });
                }
                else {
                    var d = data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"];
                    self.tasks.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["g" /* CTask */]({
                        created: d["дата"].replace("T", " "),
                        owner: "object" !== typeof d["инициатор"]
                            ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                            : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                                avatar: d["инициатор"]["аватар"],
                                position: d["инициатор"]["должность"],
                                channelTelephone: d["инициатор"]["channelTelephone"],
                                countActive: d["инициатор"]["количествоактивных"],
                                company: d["инициатор"]["организация"],
                                email: d["инициатор"]["основнойemail"],
                                telephone: d["инициатор"]["основнойтелефон"],
                                department: d["инициатор"]["подразделение"],
                                manager: d["инициатор"]["руководительнаименование"],
                                fio: d["инициатор"]["фио"]
                            }),
                        id: d["код"],
                        subject: d["наименование"],
                        body: d["описание"],
                        dateOfExecution: d["срокиисполнения"],
                        status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                            status: d["статус"]
                        }),
                        executor: "object" !== typeof d["текущийисполнитель"]
                            ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                            : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                                avatar: d["текущийисполнитель"]["аватар"],
                                position: d["текущийисполнитель"]["должность"],
                                channelTelephone: d["текущийисполнитель"]["channelTelephone"],
                                countActive: d["текущийисполнитель"]["количествоактивных"],
                                company: d["текущийисполнитель"]["организация"],
                                email: d["текущийисполнитель"]["основнойemail"],
                                telephone: d["текущийисполнитель"]["основнойтелефон"],
                                department: d["текущийисполнитель"]["подразделение"],
                                manager: d["текущийисполнитель"]["руководительнаименование"],
                                fio: d["текущийисполнитель"]["фио"]
                            }),
                        usageType: d["типобращения"],
                        service: "object" !== typeof d["услуга"]
                            ? new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({})
                            : new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                                avatar: d["услуга"]["аватар"],
                                id: d["услуга"]["код"],
                                name: d["услуга"]["наименование"]
                            })
                    }));
                }
                observer.next(_this.tasks);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.GetTaskDescription = function (nomer, typeOfReq, debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_GetTaskDescription", "m:return", {
                log: nomer,
                Type: typeOfReq
            })
                .subscribe(function (data) {
                _this.taskD = [];
                var desc = data["envelope"]["body"]["kngk_gettaskdescriptionresponse"]["return"];
                _this.taskD.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["g" /* CTask */]({
                    created: desc["дата"]["_"].replace("T", " "),
                    owner: "object" !== typeof desc["инициатор"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: desc["инициатор"]["аватар"],
                            position: desc["инициатор"]["должность"],
                            channeltelephone: desc["инициатор"]["channelTelephone"],
                            countAction: desc["инициатор"]["количествоактивных"],
                            company: desc["инициатор"]["организация"],
                            email: desc["инициатор"]["основнойemail"],
                            telephone: desc["инициатор"]["основнойтелефон"],
                            departament: desc["инициатор"]["подразделение"],
                            manager: desc["инициатор"]["руководительнаименование"],
                            fio: desc["инициатор"]["фио"]
                        }),
                    id: desc["код"]["_"],
                    subject: desc["наименование"]["_"],
                    body: desc["описание"]["_"],
                    dateOfExecution: desc["срокиисполнения"],
                    status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                        status: desc["статус"]["_"]
                    }),
                    executor: "object" !== typeof desc["текущийисполнитель"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: desc["текущийисполнитель"]["аватар"],
                            position: desc["текущийисполнитель"]["должность"],
                            channelTelephone: desc["текущийисполнитель"]["channelTelephone"],
                            countActive: desc["текущийисполнитель"]["количествоактивных"],
                            company: desc["текущийисполнитель"]["организация"],
                            email: desc["текущийисполнитель"]["основнойemail"],
                            telephone: desc["текущийисполнитель"]["основнойтелефон"],
                            department: desc["текущийисполнитель"]["подразделение"],
                            manager: desc["текущийисполнитель"]["руководительнаименование"],
                            fio: desc["текущийисполнитель"]["фио"]
                        }),
                    usegeType: desc["типобращения"]["_"],
                    service: "object" !== typeof desc["услуга"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                            avatar: desc["услуга"]["аватар"],
                            id: desc["услуга"]["код"],
                            name: desc["услуга"]["наименование"]
                        }),
                    category: "object" !== typeof desc["категорияуслуги"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({
                            avatar: desc["категорияуслуги"]["аватар"],
                            id: desc["категорияуслуги"]["код"],
                            name: desc["категорияуслуги"]["наименование"]
                        }),
                    dateOfCompletion: desc["датазавершения"],
                    comBody: desc["описаниефд"]["_"]
                }));
                observer.next(_this.taskD);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.EditTask = function (nomer, typeOfReq, ComBody, Attaches, debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_EditTask", "m:return", {
                log: nomer,
                Type: typeOfReq,
                NewComment: ComBody,
                Executor: "",
                NFile: "",
                DFile: "",
                Attaches: Attaches,
                AutorComment: _this.user
            })
                .subscribe(function (data) {
                _this.taskD = [];
                var desc = data["envelope"]["body"]["kngk_edittaskresponse"]["return"];
                _this.taskD.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["g" /* CTask */]({
                    created: desc["дата"]["_"].replace("T", " "),
                    owner: "object" !== typeof desc["инициатор"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: desc["инициатор"]["аватар"],
                            position: desc["инициатор"]["должность"],
                            channeltelephone: desc["инициатор"]["channelTelephone"],
                            countAction: desc["инициатор"]["количествоактивных"],
                            company: desc["инициатор"]["организация"],
                            email: desc["инициатор"]["основнойemail"],
                            telephone: desc["инициатор"]["основнойтелефон"],
                            departament: desc["инициатор"]["подразделение"],
                            manager: desc["инициатор"]["руководительнаименование"],
                            fio: desc["инициатор"]["фио"]
                        }),
                    id: desc["код"]["_"],
                    subject: desc["наименование"]["_"],
                    body: desc["описание"]["_"],
                    dateOfExecution: desc["срокиисполнения"],
                    status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                        status: desc["статус"]["_"]
                    }),
                    executor: "object" !== typeof desc["текущийисполнитель"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: desc["текущийисполнитель"]["аватар"],
                            position: desc["текущийисполнитель"]["должность"],
                            channelTelephone: desc["текущийисполнитель"]["channelTelephone"],
                            countActive: desc["текущийисполнитель"]["количествоактивных"],
                            company: desc["текущийисполнитель"]["организация"],
                            email: desc["текущийисполнитель"]["основнойemail"],
                            telephone: desc["текущийисполнитель"]["основнойтелефон"],
                            department: desc["текущийисполнитель"]["подразделение"],
                            manager: desc["текущийисполнитель"]["руководительнаименование"],
                            fio: desc["текущийисполнитель"]["фио"]
                        }),
                    usegeType: desc["типобращения"]["_"],
                    service: "object" !== typeof desc["услуга"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                            avatar: desc["услуга"]["аватар"],
                            id: desc["услуга"]["код"],
                            name: desc["услуга"]["наименование"]
                        }),
                    category: "object" !== typeof desc["категорияуслуги"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({
                            avatar: desc["категорияуслуги"]["аватар"],
                            id: desc["категорияуслуги"]["код"],
                            name: desc["категорияуслуги"]["наименование"]
                        }),
                    dateOfCompletion: desc["датазавершения"],
                    comBody: desc["описаниефд"]["_"]
                }));
                observer.next(_this.taskD);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.Service = function (debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_GetRoutes", "m:return", { log: _this.user })
                .subscribe(function (data) {
                _this.service = [];
                _this.servcat = [];
                var self = _this;
                data["envelope"]["body"]["kngk_getroutesresponse"]["return"]["услуга"].forEach(function (dc, dsc) {
                    if (dsc < 17 || dsc > 17) {
                        dc["составуслуги"]["элементсоставауслуги"].forEach(function (cc) {
                            self.servcat.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({
                                avatar: cc["аватар"],
                                name: cc["наименование"],
                                id: cc["код"],
                                serviceOwner: cc["услугавладелец"]
                            }));
                        });
                    }
                });
                data["envelope"]["body"]["kngk_getroutesresponse"]["return"]["услуга"].forEach(function (d, ds) {
                    if (ds <= 16 || ds >= 18) {
                        self.category = [];
                        d["составуслуги"]["элементсоставауслуги"].forEach(function (c) {
                            self.category.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({
                                avatar: c["аватар"],
                                name: c["наименование"],
                                id: c["код"],
                                typeCategory: c["типзначениякатегории"],
                                serviceOwner: c["услугавладелец"]
                            }));
                        });
                        self.service.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                            id: d["код"],
                            name: d["наименование"],
                            avatar: d["аватар"],
                            group: d["группа"],
                            comBody: d["описаниефд"],
                            category: self.category,
                            keys: ds
                        }));
                        // self.category = [];
                    }
                });
                observer.next(_this.service);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.NewTask = function (body, subjectTask, id, CatId, typeCat, Attaches, debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_NewTask", "m:return", {
                log: _this.user,
                Title: subjectTask,
                deskr: body,
                route: id,
                category: CatId,
                TypeOfCategory: typeCat,
                Executor: false,
                NFile: "",
                DFile: "",
                Attaches: Attaches
            })
                .subscribe(function (data) {
                _this.newTask = [];
                var nt = data["envelope"]["body"]["kngk_newtaskresponse"]["return"];
                _this.newTask.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["d" /* COption */]({
                    created: nt["времясоздания"]["_"].replace("T", " "),
                    code: nt["код"],
                    name: nt["наименование"],
                    reqSource: nt["реквизитисточника"],
                    org: nt["ТекущийСтатус"],
                    serviceCategory: nt["категорияуслуг"],
                    status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                        status: nt["текущийстатус"]
                    })
                }));
                observer.next(_this.newTask);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.CancelTask = function (nomer, typeOfReq, debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap
                .post("main", "kngk_CancelTask", "m:return", {
                log: nomer,
                Type: typeOfReq
            })
                .subscribe(function (data) {
                _this.cancelTask = [];
                var ct = data["envelope"]["body"]["kngk_canceltaskresponse"]["return"];
                _this.cancelTask.push(new __WEBPACK_IMPORTED_MODULE_3__classes__["a" /* CCancelTask */]({
                    created: ct["дата"]["_"].replace("T", " "),
                    owner: "object" !== typeof ct["инициатор"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: ct["инициатор"]["аватар"],
                            position: ct["инициатор"]["должность"],
                            channeltelephone: ct["инициатор"]["каналтелефонии"],
                            countAction: ct["инициатор"]["количествоактивных"],
                            company: ct["инициатор"]["организация"],
                            email: ct["инициатор"]["основнойemail"],
                            telephone: ct["инициатор"]["основнойтелефон"],
                            departament: ct["инициатор"]["подразделение"],
                            manager: ct["инициатор"]["руководительнаименование"],
                            fio: ct["инициатор"]["фио"]
                        }),
                    code: ct["код"]["_"],
                    subject: ct["наименование"]["_"],
                    body: ct["описание"]["_"],
                    dateOfExecution: ct["срокиисполнения"],
                    status: new __WEBPACK_IMPORTED_MODULE_3__classes__["f" /* CStatus */]({
                        status: ct["статус"]["_"]
                    }),
                    executor: "object" !== typeof ct["текущийисполнитель"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["i" /* CUser */]({
                            avatar: ct["текущийисполнитель"]["аватар"],
                            position: ct["текущийисполнитель"]["должность"],
                            channelTelephone: ct["текущийисполнитель"]["channelTelephone"],
                            countActive: ct["текущийисполнитель"]["количествоактивных"],
                            company: ct["текущийисполнитель"]["организация"],
                            email: ct["текущийисполнитель"]["основнойemail"],
                            telephone: ct["текущийисполнитель"]["основнойтелефон"],
                            department: ct["текущийисполнитель"]["подразделение"],
                            manager: ct["текущийисполнитель"]["руководительнаименование"],
                            fio: ct["текущийисполнитель"]["фио"]
                        }),
                    usegeType: ct["типобращения"]["_"],
                    service: "object" !== typeof ct["услуга"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["e" /* CService */]({
                            avatar: ct["услуга"]["аватар"],
                            id: ct["услуга"]["код"],
                            name: ct["услуга"]["наименование"]
                        }),
                    category: "object" !== typeof ct["категорияуслуги"]
                        ? new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({})
                        : new __WEBPACK_IMPORTED_MODULE_3__classes__["b" /* CCategory */]({
                            avatar: ct["категорияуслуги"]["аватар"],
                            id: ct["категорияуслуги"]["код"],
                            name: ct["категорияуслуги"]["наименование"]
                        }),
                    dateOfCompletion: ct["датазавершения"],
                    comBody: ct["описаниефд"]["_"]
                }));
                observer.next(_this.cancelTask);
                observer.complete();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService.prototype.SearchFunc = function (debugText) {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].create(function (observer) {
            _this.soap.post("main", "kngk_Search", "m:return", {}).subscribe(function (data) {
                _this.search = [];
                observer.next(_this.search);
                observer.complite();
            }, function (error) { return _this.handleError(observer, error); });
        });
    };
    GetDataService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__authenticatedSoap_service__["a" /* AuthenticatedSoapService */]])
    ], GetDataService);
    return GetDataService;
}());

//# sourceMappingURL=getData.service.js.map

/***/ }),

/***/ 344:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCategory; });
var CCategory = /** @class */ (function () {
    function CCategory(object) {
        this.avatar = object["avatar"];
        this.id = object["id"];
        this.name = object["name"];
        this.serviceOwner = object["serviceOwner"];
        this.typeCategory = object["typeCategory"];
    }
    return CCategory;
}());

//# sourceMappingURL=CCategory.js.map

/***/ }),

/***/ 345:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CUser; });
var CUser = /** @class */ (function () {
    function CUser(object) {
        this.fio = object["fio"];
        this.avatar = object["avatar"];
        this.position = object["position"];
        this.channelTelephone = object["channelTelephone"];
        this.countActive = object["countActive"];
        this.company = object["company"];
        this.email = object["email"];
        this.telephone = object["telephone"];
        this.departament = object["departament"];
        this.manager = object["manager"];
    }
    return CUser;
}());

//# sourceMappingURL=CUser.js.map

/***/ }),

/***/ 346:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CUrgency; });
var CUrgency = /** @class */ (function () {
    function CUrgency(object) {
        this.urgency = undefined !== object["urgency"] ? object["urgency"] : "";
    }
    return CUrgency;
}());

//# sourceMappingURL=CUrgency.js.map

/***/ }),

/***/ 347:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CStatus; });
var CStatus = /** @class */ (function () {
    function CStatus(object) {
        this.status = object["status"];
    }
    return CStatus;
}());

//# sourceMappingURL=CStatus.js.map

/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes__ = __webpack_require__(50);

var CService = /** @class */ (function () {
    function CService(object) {
        this.avatar = object["avatar"];
        this.id = object["id"];
        this.name = object["name"];
        this.group = object["group"];
        this.category =
            "object" === typeof object["category"]
                ? object["category"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["b" /* CCategory */]({});
        this.comBody = object["comBody"];
        this.keys = object["keys"];
    }
    return CService;
}());

//# sourceMappingURL=CService.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CError; });
var CError = /** @class */ (function () {
    function CError(object) {
        this.faultheader = object["faultheader"];
        this.faultstring = object["faultstring"];
    }
    return CError;
}());

//# sourceMappingURL=CError.js.map

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CTask; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes__ = __webpack_require__(50);

var CTask = /** @class */ (function () {
    function CTask(object) {
        this.created = object["created"];
        this.owner =
            "object" === typeof object["owner"] ? object["owner"] : new __WEBPACK_IMPORTED_MODULE_0__classes__["i" /* CUser */]({});
        this.id = object["id"];
        this.subject = object["subject"];
        this.body = object["body"];
        this.dateOfExecution = object["dateOfExecution"];
        this.status =
            "object" === typeof object["status"] ? object["status"] : new __WEBPACK_IMPORTED_MODULE_0__classes__["f" /* CStatus */]({});
        this.executor =
            "object" === typeof object["executor"]
                ? object["executor"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["i" /* CUser */]({});
        this.usageType = object["usageType"];
        this.service =
            "object" === typeof object["service"]
                ? object["service"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["e" /* CService */]({});
        this.category =
            "object" === typeof object["category"]
                ? object["category"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["b" /* CCategory */]({});
        this.lastupdate = object["lastupdate"];
        this.dateOfCompletion = object["dateOfCompletion"];
        this.urgency =
            "object" === typeof object["urgency"]
                ? object["urgency"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["h" /* CUrgency */]({});
        this.comBody = object["comBody"];
    }
    return CTask;
}());

//# sourceMappingURL=CTask.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return COption; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes__ = __webpack_require__(50);

var COption = /** @class */ (function () {
    function COption(object) {
        this.serviceCategory = object["serviceCategory"];
        this.status =
            "object" === typeof object["status"] ? object["status"] : new __WEBPACK_IMPORTED_MODULE_0__classes__["f" /* CStatus */]({});
        this.created = object["created"];
        this.code = object["code"];
        this.reqSource = object["reqSource"];
        this.name = object["name"];
        this.org = object["org"];
    }
    return COption;
}());

//# sourceMappingURL=COption.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CCancelTask; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__classes__ = __webpack_require__(50);

var CCancelTask = /** @class */ (function () {
    function CCancelTask(object) {
        this.created = object["created"];
        this.owner =
            "object" === typeof object["owner"] ? object["owner"] : new __WEBPACK_IMPORTED_MODULE_0__classes__["i" /* CUser */]({});
        this.code = object["code"];
        this.status =
            "object" === typeof object["status"] ? object["status"] : new __WEBPACK_IMPORTED_MODULE_0__classes__["f" /* CStatus */]({});
        this.executor =
            "object" === typeof object["executor"]
                ? object["executor"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["i" /* CUser */]({});
        this.usageType = object["usageType"];
        this.service =
            "object" === typeof object["service"]
                ? object["service"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["e" /* CService */]({});
        this.dateOfExecution = object["dateOfExecution"];
        this.category =
            "object" === typeof object["category"]
                ? object["category"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["b" /* CCategory */]({});
        this.urgency =
            "object" === typeof object["urgency"]
                ? object["urgency"]
                : new __WEBPACK_IMPORTED_MODULE_0__classes__["h" /* CUrgency */]({});
        this.comBody = object["comBody"];
    }
    return CCancelTask;
}());

//# sourceMappingURL=CCancelTask.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SearchComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var SearchComponent = /** @class */ (function () {
    function SearchComponent() {
        this.sClick = false; // для вывода результатов поиска
    }
    SearchComponent.prototype.searchOrder = function () {
        // проверка заполнености поля
        if (this.sInput != null) {
            this.sClick = true;
        }
    };
    SearchComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "search",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\search\search.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Поиск\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-row justify-content-center>\n    <ion-col col-xs>\n      <ion-searchbar [showCancelButton]="shouldShowCancel" [(ngModel)]="sInput" placeholder="Что ищем?"></ion-searchbar>\n    </ion-col>\n  </ion-row>\n\n  <ion-row justify-content-left>\n    <ion-col col-xs>\n      <ion-item>\n        <ion-label>Номер заявки</ion-label>\n        <ion-checkbox checked="true"></ion-checkbox>\n      </ion-item>\n\n      <ion-item>\n        <ion-label>Исполнитель</ion-label>\n        <ion-checkbox checked="true"></ion-checkbox>\n      </ion-item>\n\n      <ion-item>\n        <ion-label>Название заявки</ion-label>\n        <ion-checkbox checked="true"></ion-checkbox>\n      </ion-item>\n    </ion-col>\n  </ion-row>\n    \n  <ion-row justify-content-center>\n    <ion-col col-xs>\n      <button ion-button icon-start block (click)="searchOrder()">\n      	<ion-icon name="search"></ion-icon>\n          Найти заявку\n      </button>\n    </ion-col>\n  </ion-row>\n  <br>\n<hr>\n      <br>\n      \n   <ion-list>\n    <button ion-item *ngIf="sClick==true">\n      <ion-row justify-content-center>\n        <ion-col col-4>\n          Заявка\n        </ion-col>\n\n        <ion-col col-8>\n          <div>\n            [(names)]="sInput"\n          </div>\n          <div>Инициатор: 123</div>\n          <div>Статус: 123</div>\n          <div>Срочность: 123</div>\n\n\n           <a href="#" ion-item color="white" *ngFor="let task of tasks" (click)="itemTapped($event, task.id, task.usageType)" >\n              <h2>{{task.subject}}</h2>\n              <p>Номер: {{task.id}}</p>\n              <p>Дата: {{task.created}}</p>\n              <p>Инициатор: {{task.owner.fio}}</p>\n              <p>Кому назначена: {{task.executor.fio}}</p>\n              <p>Статус: {{task.status.status}}</p>\n              <span *ngIf="task.urgency.urgency">\n                <p>Срочность: {{task.urgency.urgency}}</p>\n              </span>\n            </a>\n        </ion-col>\n      </ion-row>\n    </button>\n  </ion-list>\n\n \n\n    \n</ion-content>'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\search\search.html"*/
        })
    ], SearchComponent);
    return SearchComponent;
}());

//# sourceMappingURL=search.js.map

/***/ }),

/***/ 354:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettingsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var SettingsComponent = /** @class */ (function () {
    function SettingsComponent(data, loadingCtrl) {
        this.data = data;
        this.loadingCtrl = loadingCtrl;
        this.datas = new Array();
        this.service = [];
        this.serviceCat = [];
        this.id = "000000007";
        this.CatId = "000000005";
        this.Keys = 0;
    }
    SettingsComponent.prototype.ngOnInit = function () {
        this.Service();
    };
    SettingsComponent.prototype.doRefresh = function (refresher) {
        this.Category(refresher);
        this.Service(refresher);
        refresher.complete();
    };
    SettingsComponent.prototype.Service = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.Service().subscribe(function (result) {
            _this.service = result;
            _this.serviceCat[0] = _this.service[_this.Keys].category;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
    };
    SettingsComponent.prototype.Category = function (refresher) {
        if (this.Keys === 18) {
            this.CatId = this.service[17].category[0].id;
            this.id = this.service[17].id;
            this.serviceCat[0] = this.service[17].category;
        }
        if (this.Keys === 19) {
            this.CatId = this.service[18].category[0].id;
            this.id = this.service[17].id;
            this.serviceCat[0] = this.service[18].category;
        }
        if (this.Keys <= 16) {
            this.CatId = this.service[this.Keys].category[0].id;
            this.id = this.service[this.Keys].id;
            this.serviceCat[0] = this.service[this.Keys].category;
        }
    };
    SettingsComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "settings",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\settings\settings.html"*/'<ion-header class="body">\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Настройки\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <ion-refresher (ionPull)="doRefresh($event)">\n    <ion-refresher-content>\n    </ion-refresher-content>\n  </ion-refresher>\n  <br />\n  <br />\n\n  <ion-list>\n    <br>\n    <ion-item>\n      <ion-label>Услуги</ion-label>\n      <ion-select [(ngModel)]="Keys" interface="popover" placeholder="Выберите услугу" (ionChange)="Category($event)">\n        <ion-option *ngFor="let s of service" [value]="s.keys">{{s.name}} </ion-option>\n      </ion-select>\n    </ion-item>\n\n    <br>\n\n    <ion-item>\n      <ion-label>Категории</ion-label>\n      <ion-select [(ngModel)]="CatId" interface="popover" placeholder="Выберите категорию">\n        <ion-option *ngFor="let sc of serviceCat[0]" [value]="sc.id">{{sc.name}}</ion-option>\n      </ion-select>\n    </ion-item>\n\n  </ion-list>\n\n  {{id}} {{CatId}}\n\n  <hr>\n  <div *ngFor="let s of service">{{s.category[0].id}}</div>\n  <hr>\n  <div *ngFor="let s of serviceCat[0]">{{s.id}}</div>\n\n  <hr>\n  <div *ngFor="let s of serviceCat[0]">{{s.typeCategory}}</div>\n  <!-- <ion-list>\n  <ion-item>\n\n    <ion-input type="number" [(ngModel)]="Keys"></ion-input>\n  </ion-item>\n\n\n</ion-list> -->\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\settings\settings.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__["a" /* GetDataService */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], SettingsComponent);
    return SettingsComponent;
}());

//# sourceMappingURL=settings.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return MAIN_URL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MAIN_NAMESPACE; });
// export const MAIN_URL = "https://portal.kngk-group.ru:446/sd/ws/MainInfoService.1cws";
var MAIN_URL = "https://portal.kngk-group.ru:446/basic/ajax-basic.php";
var MAIN_NAMESPACE = "MainInfoService";
//# sourceMappingURL=constants.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthenticationInterceptor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__authenticatedSoap_service__ = __webpack_require__(125);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AuthenticationInterceptor = /** @class */ (function () {
    function AuthenticationInterceptor(injector) {
        this.injector = injector;
    }
    AuthenticationInterceptor.prototype.intercept = function (req, next) {
        var authenticationService = this.injector.get(__WEBPACK_IMPORTED_MODULE_1__authenticatedSoap_service__["a" /* AuthenticatedSoapService */]);
        // Get the auth header from the service.
        var authHeader = authenticationService.getAuthBasic();
        // Clone the request to add the new header.
        var authReq = req.clone({
            headers: req.headers.set("Authorization", authHeader)
        });
        // Pass on the cloned request instead of the original request.
        return next.handle(authReq);
    };
    AuthenticationInterceptor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injector */]])
    ], AuthenticationInterceptor);
    return AuthenticationInterceptor;
}());

//# sourceMappingURL=authenticationInterceptor.service.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TextEditorComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
// import { StatusBar } from "@ionic-native/status-bar";


var TextEditorComponent = /** @class */ (function () {
    function TextEditorComponent() {
        this.uniqueId = "editor" + Math.floor(Math.random() * 1000000);
    }
    // private wireupResize() {
    //   let element = this.editor.nativeElement as HTMLDivElement;
    //   let height = (window.innerHeight || document.body.clientHeight) - 250;
    //   let textareaHeight = Math.round((height / 100.00) * 45);
    //   element.style.height = `${textareaHeight}px`;
    // }
    TextEditorComponent.prototype.updateItem = function () {
        var _this = this;
        var element = this.editor.nativeElement;
        element.innerHTML = this.formControlItem.value;
        if (element.innerHTML != null || element.innerHTML !== "") {
            element.innerHTML = "";
        }
        else {
            element.innerHTML = "<p></p>";
        }
        var updateItem = function () {
            _this.formControlItem.setValue(element.innerHTML);
        };
        element.onchange = function () { return updateItem(); };
        element.onkeyup = function () { return updateItem(); };
        element.onpaste = function () { return updateItem(); };
        element.oninput = function () { return updateItem(); };
    };
    TextEditorComponent.prototype.wireupButtons = function () {
        var buttons = this.decorate
            .nativeElement.getElementsByTagName("button");
        var _loop_1 = function (i) {
            var button = buttons[i];
            var command = button.getAttribute("data-command");
            if (command.includes("|")) {
                var parameter_1 = command.split("|")[1];
                command = command.split("|")[0];
                button.addEventListener("click", function () {
                    document.execCommand(command, false, parameter_1);
                });
            }
            else {
                button.addEventListener("click", function () {
                    document.execCommand(command);
                });
            }
        };
        // for (const button of buttons) {
        for (var i = 0; i < buttons.length; i++) {
            _loop_1(i);
        }
    };
    TextEditorComponent.prototype.ngAfterContentInit = function () {
        this.updateItem();
        this.wireupButtons();
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])("editor"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], TextEditorComponent.prototype, "editor", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])("decorate"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], TextEditorComponent.prototype, "decorate", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])("styler"),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], TextEditorComponent.prototype, "styler", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])(),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__angular_forms__["b" /* FormControl */])
    ], TextEditorComponent.prototype, "formControlItem", void 0);
    TextEditorComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "text-editor",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\textEditor\textEditor.html"*/'<div #styler></div>\n\n<div #editor contenteditable="true" class="maineditor" tappable></div>\n\n<div #decorate class="decorator">\n  <button data-command="bold">\n    <strong>B</strong>\n  </button>\n  <button data-command="italic">\n    <i>I</i>\n  </button>\n  <button data-command="underline">\n    <u>U</u>\n  </button> &nbsp;\n  <button data-command="fontSize|6">\n    <span style="font-size: 1.5em;">A</span>\n  </button>\n  <button data-command="removeFormat">\n    <span style="font-size: 1.0em;">A</span>\n  </button>\n  <button data-command="fontSize|1">\n    <span style="font-size: 0.6em;">A</span>\n  </button> &nbsp;\n  <button data-command="formatBlock|<h1>">H1</button>\n  <button data-command="formatBlock|<h2>">H2</button>\n  <button data-command="formatBlock|<p>">Normal</button> &nbsp;\n  <button data-command="justifyLeft">Left</button>\n  <button data-command="justifyCenter">Center</button>\n  <button data-command="justifyRight">Right</button>\n  <button data-command="justifyFull">Full</button> &nbsp;\n  <button data-command="insertHorizontalRule">HR</button>\n  <button data-command="insertOrderedList">OL</button>\n  <button data-command="insertUnorderedList">UL</button>\n</div>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\textEditor\textEditor.html"*/
        })
    ], TextEditorComponent);
    return TextEditorComponent;
}());

//# sourceMappingURL=textEditor.js.map

/***/ }),

/***/ 50:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__CCategory__ = __webpack_require__(344);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return __WEBPACK_IMPORTED_MODULE_0__CCategory__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__CUser__ = __webpack_require__(345);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "i", function() { return __WEBPACK_IMPORTED_MODULE_1__CUser__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__CUrgency__ = __webpack_require__(346);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "h", function() { return __WEBPACK_IMPORTED_MODULE_2__CUrgency__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__CStatus__ = __webpack_require__(347);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return __WEBPACK_IMPORTED_MODULE_3__CStatus__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__CService__ = __webpack_require__(348);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return __WEBPACK_IMPORTED_MODULE_4__CService__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__CError__ = __webpack_require__(349);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return __WEBPACK_IMPORTED_MODULE_5__CError__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__CTask__ = __webpack_require__(350);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return __WEBPACK_IMPORTED_MODULE_6__CTask__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__COption__ = __webpack_require__(351);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return __WEBPACK_IMPORTED_MODULE_7__COption__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__CCancelTask__ = __webpack_require__(352);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return __WEBPACK_IMPORTED_MODULE_8__CCancelTask__["a"]; });









//# sourceMappingURL=index.js.map

/***/ }),

/***/ 62:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomeComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__listTask_listTask__ = __webpack_require__(63);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__myListTask_myListTask__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__createTask_createTask__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_help__ = __webpack_require__(240);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import { SearchComponent } from '../search/search';


// import { SettingsComponent } from '../settings/settings';
var HomeComponent = /** @class */ (function () {
    function HomeComponent(navCtrl, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.loadingCtrl = loadingCtrl;
        this.pages = [
            { title: "Все заявки", component: __WEBPACK_IMPORTED_MODULE_2__listTask_listTask__["a" /* ListTaskComponent */] },
            { title: "Заявки выполняемые мною", component: __WEBPACK_IMPORTED_MODULE_3__myListTask_myListTask__["a" /* MyListTaskComponent */] },
            { title: "Создать заявку", component: __WEBPACK_IMPORTED_MODULE_4__createTask_createTask__["a" /* CreateTaskComponent */] },
            // { title: 'Поиск заявки', component: SearchComponent },
            // { title: 'Настройки', component: SettingsComponent },
            { title: "Справка", component: __WEBPACK_IMPORTED_MODULE_5__help_help__["a" /* HelpComponent */] }
        ];
    }
    HomeComponent.prototype.openPage = function (page) {
        var loader = this.loadingCtrl.create({
            content: "Пожалуйста подождите..."
        });
        loader.present();
        this.navCtrl.setRoot(page.component, null, null, function () {
            loader.dismiss();
        });
    };
    HomeComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "page-home",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Домашняя страница\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n  <ion-grid>\n    <ion-row *ngFor="let p of pages">\n      <ion-col col-12>\n        <button ion-button large block (click)="openPage(p)">{{p.title}}</button>\n      </ion-col>\n    </ion-row>\n  </ion-grid>\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], HomeComponent);
    return HomeComponent;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 63:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ListTaskComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editTask_editTask__ = __webpack_require__(133);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var ListTaskComponent = /** @class */ (function () {
    // public nomer: string;
    // public typeOfReq: string;
    // public stats: string;
    function ListTaskComponent(navCtrl, navParams, loadingCtrl, data) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.data = data;
        this.tasks = [];
        this.inWork = true;
    }
    ListTaskComponent.prototype.ngOnInit = function () {
        this.getTask();
    };
    ListTaskComponent.prototype.doRefresh = function (refresher) {
        this.getTask(refresher);
    };
    ListTaskComponent.prototype.getTask = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.GetTask(false, this.inWork, true).subscribe(function (result) {
            _this.tasks = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("GetTask(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
    };
    ListTaskComponent.prototype.itemTapped = function (event, id, req, status, bases) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__editTask_editTask__["a" /* EditTaskComponent */], {
            nomer: id,
            typeOfReq: req,
            stats: status,
            myPages: "ListTaskComponent",
            base: bases
        });
    };
    ListTaskComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "page-list",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\listTask\listTask.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Все заявки\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content\n      pullingIcon="arrow-dropdown"\n      pullingText="Нажмите вниз чтобы обновить..."\n      refreshingSpinner="circles"\n      refreshingText="Обновление..."\n    ></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-item>\n    <ion-label>В работе</ion-label>\n    <ion-checkbox color="blue" [(ngModel)]="inWork" (click)="getTask()"></ion-checkbox>\n  </ion-item>\n\n  <a href="#" ion-item color="white" *ngFor="let task of tasks" (click)="itemTapped($event, task.id, task.usageType, task.status.status, task.owner.avatar)" >\n    <h2>{{task.subject}}</h2>\n    <p>Номер: {{task.id}}</p>\n    <p>Дата: {{task.created}}</p>\n    <p>Инициатор: {{task.owner.fio}}</p>\n    <p>Кому назначена: {{task.executor.fio}}</p>\n    <p>Статус: {{task.status.status}}</p>\n    <span *ngIf="task.urgency.urgency">\n      <p>Срочность: {{task.urgency.urgency}}</p>\n    </span>\n\n   <!--  <div padding [innerHTML]="task.body"></div> -->\n     <!-- <div > {{task.usageType}}</div>  -->\n    <!-- <div> {{task.service.avatar}}</div> -->\n  </a>\n\n  \n\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\listTask\listTask.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__["a" /* GetDataService */]])
    ], ListTaskComponent);
    return ListTaskComponent;
}());

//# sourceMappingURL=listTask.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyListTaskComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editTask_editTask__ = __webpack_require__(133);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var MyListTaskComponent = /** @class */ (function () {
    function MyListTaskComponent(events, navCtrl, navParams, loadingCtrl, data) {
        this.events = events;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.data = data;
        this.tasks = [];
        this.inWork = true;
    }
    MyListTaskComponent.prototype.ngOnInit = function () {
        this.getTask();
    };
    MyListTaskComponent.prototype.doRefresh = function (refresher) {
        this.getTask(refresher);
    };
    MyListTaskComponent.prototype.getTask = function (refresher) {
        var _this = this;
        if (undefined === refresher) {
            this.loader = this.loadingCtrl.create({
                content: "Пожалуйста подождите пока данные подгружаются..."
            });
            this.loader.present();
        }
        this.data.GetTask(true, this.inWork, false).subscribe(function (result) {
            _this.tasks = result;
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        }, function (error) {
            debugger;
            console.log("GetTask(error => ...)", error);
            if (undefined === refresher) {
                _this.loader.dismiss();
            }
            else {
                refresher.complete();
            }
        });
    };
    MyListTaskComponent.prototype.itemTapped = function ($event, id, req, status, bases) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__editTask_editTask__["a" /* EditTaskComponent */], {
            nomer: id,
            typeOfReq: req,
            stats: status,
            myPages: "MyListTaskComponent",
            base: bases
        });
    };
    MyListTaskComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: "myListTask",template:/*ion-inline-start:"C:\Users\White Fox\KNGKEngineer\src\components\myListTask\myListTask.html"*/'<ion-header>\n  <ion-navbar>\n    <button ion-button menuToggle icon-only>\n      <ion-icon name="menu"></ion-icon>\n    </button>\n    <ion-title>\n      Заявки выполняемые мною\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content pullingIcon="arrow-dropdown" pullingText="Нажмите вниз чтобы обновить..." refreshingSpinner="circles"\n      refreshingText="Обновление..."></ion-refresher-content>\n  </ion-refresher>\n\n  <ion-item>\n    <ion-label>В работе</ion-label>\n    <ion-checkbox color="blue" [(ngModel)]="inWork" (click)="getTask()"></ion-checkbox>\n  </ion-item>\n\n  <a href="#" ion-item color="white" *ngFor="let task of tasks" (click)="itemTapped($event, task.id, task.usageType, task.status.status, task.owner.avatar)">\n    <h2 ion-text>{{task.subject}}</h2>\n    <p>Номер: {{task.id}}</p>\n    <p>Дата: {{task.created}}</p>\n    <p>Статус: {{task.status.status}}</p>\n    <p>Инициатор: {{task.owner.fio}}</p>\n    <p>Кому назначена: {{task.executor.fio}}</p>\n    \n\n    <span *ngIf="task.urgency.urgency">\n      <p>Срочность: {{task.urgency.urgency}}</p>\n    </span>\n  </a>\n\n</ion-content>\n'/*ion-inline-end:"C:\Users\White Fox\KNGKEngineer\src\components\myListTask\myListTask.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */],
            __WEBPACK_IMPORTED_MODULE_2__app_service_getData_service__["a" /* GetDataService */]])
    ], MyListTaskComponent);
    return MyListTaskComponent;
}());

//# sourceMappingURL=myListTask.js.map

/***/ })

},[242]);
//# sourceMappingURL=main.js.map