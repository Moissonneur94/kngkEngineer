import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthenticatedSoapService } from './authenticatedSoap.service';

import { CUser, CError, CStatus, CTask, CService, CCategory, COption, CCancelTask } from '../classes';


@Injectable()
export class GetDataService {

  /*
   * User string
   */
  public user: string;


  /*
   * Debug
   */
  private debug: boolean = false;


  /*
   * Cache
   */
  private cuser: CUser;
  private tasks: Array<CTask>;
  private taskD: Array<CTask>;
  private newTask: Array<any>;
  private cancelTask: Array<CCancelTask>;

  private search: Array<any>;

  public service: Array<CService>;
  private category: Array<CCategory>;
  servcat: Array<CCategory>;
  

  constructor(private soap: AuthenticatedSoapService) {}

  clearAuth() {
    this.user = '';
    this.cuser = undefined;
    this.soap.setAuth('','');
  }

  set debugMode(on: boolean) {
    this.debug = on;
    this.soap.debugMode = on;
  }
  get debugMode() { return this.debug; }


  setAuthData(user: string, password: string, debugText?: any): void {
    if (undefined !== debugText) this.debugMode = true;
    this.user = user;
    this.soap.setAuth(user, password);
    if (this.debugMode) {
      debugger;
      debugText.debugText += "setAuthData(..) ";
    }
  }


  private envelopedRequest(req: string, pred: string, method: string, targetNamespace: string): string {
    return  '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:' + pred + '="' + targetNamespace + '">' +
            '   <soapenv:Header/>' +
            '     <soapenv:Body>' +
            '      <' + pred + ':' + method + '>' +
                     req +
            '      </' + pred + ':' + method + '>' +
            '   </soapenv:Body>' +
            '</soapenv:Envelope>'
            ;
  }


  handleError(observer: any, error: any, debugText?: any) {
    if (this.debugMode) {
      debugText.debugText += "Observable.create(this.soap.post(error => ..)..) ";
      console.error("Observable.create(this.soap.post(error => ..)..", error);
      debugger;
    }

    let errorHeader = '';
    let errorText = '';

    if (typeof error["envelope"] === 'object' ) {
      errorHeader = error["envelope"]["body"]["fault"]["faultcode"] || "";
      errorText = error["envelope"]["body"]["fault"]["faultstring"] || "Server error.";
    } else if (typeof error["html"] === 'object') {
      errorHeader = error["html"]["body"]["div"]["div"][0]["h3"];
      errorText = error["html"]["body"]["div"]["div"][0]["h4"];
    } else {
      errorHeader = "Server error";
      errorText = error;
    }

    observer.error(new CError({
      faultheader: errorHeader,
      faultstring: errorText,
    }));
    observer.complete();
  }


  GetUser(user: string, debugText?: any): Observable<CUser> {
    if (this.cuser && undefined === this.cuser && undefined === debugText) {
      return Observable.create( observer => {
        return this.cuser;
      });
    }
    this.soap.envelopeBuilder = this.envelopedRequest;
    if (undefined !== debugText) this.debugMode = true;
    if (this.debugMode) debugText.debugText += "GetUser(..) ";
    return Observable.create( observer => {
        this.soap.post("main", "GetUser", "m:return", {log: user, pic: false, Executor: false}, (this.debugMode)? debugText : undefined)
          .subscribe(
            data => {
              if (this.debugMode) {
                debugText.debugText += "Observable.create(this.soap.post('GetUser', result => ..)..) ";
                console.log("Observable.create(this.soap.post('GetUser', result => ..)..", data);
                debugger;
              }
              this.cuser = new CUser({
                fio: data["envelope"]["body"]["getuserresponse"]["return"]["фио"]["_"],
                avatar: data["envelope"]["body"]["getuserresponse"]["return"]["аватар"]["_"],
                position: data["envelope"]["body"]["getuserresponse"]["return"]["должность"]["_"],
                channelTelephone: data["envelope"]["body"]["getuserresponse"]["return"]["каналтелефонии"]["_"],
                countActive: data["envelope"]["body"]["getuserresponse"]["return"]["количествоактивных"]["_"],
                company: data["envelope"]["body"]["getuserresponse"]["return"]["организация"]["_"],
                email: data["envelope"]["body"]["getuserresponse"]["return"]["основнойemail"]["_"],
                telephone: data["envelope"]["body"]["getuserresponse"]["return"]["основнойтелефон"]["_"],
                departament: data["envelope"]["body"]["getuserresponse"]["return"]["подразделение"]["_"],
                manager: data["envelope"]["body"]["getuserresponse"]["return"]["руководительнаименование"]["_"],
              });
              observer.next(this.cuser);
              observer.complete();
            },
            error => this.handleError(observer, error, debugText),
          )
    });
  }


  GetTask(isCurUser: boolean, status: boolean, debugText?: any): Observable<Array<CTask>> {
    // if (this.tasks && this.tasks.length != 0 && undefined === debugText) {
    //   return Observable.create( observer => {
    //     return this.tasks;
    //   });
    // }
    let stat;
    if (status === true) {
      stat = 'в работе';
    } else {
      stat = '';
    }
    return Observable.create( observer => {
        this.soap.post("main", "kngk_GetTask", "m:return", {log: this.user, Dept: (isCurUser)? '' : (undefined === this.cuser.departament)? '' : this.cuser.departament, Status: stat, Executor: (isCurUser)? true : false}, (this.debug)? debugText : undefined)
          .subscribe(
            data => {
              if (this.debugMode) {
                debugText.debugText += "Observable.create(this.soap.post('GetTask', result => ..)..) ";
                console.log("Observable.create(this.soap.post('GetTask', result => ..)..", data);
                debugger;
              }
              this.tasks = [];
              let self = this;
              if (undefined === data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"]) {
              } else if (undefined === data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"]["дата"]) {
                data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"].forEach(function(d) {
                  self.tasks.push(
                    new CTask({
                      created: d["дата"].replace("T"," "),
                      owner: ('object' !== typeof d["инициатор"])? new CUser({}) :
                        new CUser({
                          avatar: d["инициатор"]["аватар"],
                          position: d["инициатор"]["должность"],
                          channelTelephone: d["инициатор"]["channelTelephone"],
                          countActive: d["инициатор"]["количествоактивных"],
                          company: d["инициатор"]["организация"],
                          email: d["инициатор"]["основнойemail"],
                          telephone: d["инициатор"]["основнойтелефон"],
                          department: d["инициатор"]["подразделение"],
                          manager: d["инициатор"]["руководительнаименование"],
                          fio: d["инициатор"]["фио"],
                        }),
                      id: d["код"],
                      subject: d["наименование"],
                      body: d["описание"],
                      dateOfExecution: d["срокиисполнения"],
                      status: new CStatus({
                        status: d["статус"],
                      }),
                      executor: ('object' !== typeof d["текущийисполнитель"])? new CUser({}) :
                        new CUser({
                          avatar: d["текущийисполнитель"]["аватар"],
                          position: d["текущийисполнитель"]["должность"],
                          channelTelephone: d["текущийисполнитель"]["channelTelephone"],
                          countActive: d["текущийисполнитель"]["количествоактивных"],
                          company: d["текущийисполнитель"]["организация"],
                          email: d["текущийисполнитель"]["основнойemail"],
                          telephone: d["текущийисполнитель"]["основнойтелефон"],
                          department: d["текущийисполнитель"]["подразделение"],
                          manager: d["текущийисполнитель"]["руководительнаименование"],
                          fio: d["текущийисполнитель"]["фио"],
                        }),
                      usageType: d["типобращения"],
                      service: ('object' !== typeof d["услуга"])? new CService({}) : 
                        new CService({
                          avatar: d["услуга"]["аватар"],
                          id: d["услуга"]["код"],
                          name: d["услуга"]["наименование"],
                        }),
                    })
                  );
                });
              } else {
                 let d = data["envelope"]["body"]["kngk_gettaskresponse"]["return"]["задача"];

                self.tasks.push(
                  new CTask({
                    created: d["дата"].replace("T"," "),
                    owner: ('object' !== typeof d["инициатор"])? new CUser({}) :
                      new CUser({
                        avatar: d["инициатор"]["аватар"],
                        position: d["инициатор"]["должность"],
                        channelTelephone: d["инициатор"]["channelTelephone"],
                        countActive: d["инициатор"]["количествоактивных"],
                        company: d["инициатор"]["организация"],
                        email: d["инициатор"]["основнойemail"],
                        telephone: d["инициатор"]["основнойтелефон"],
                        department: d["инициатор"]["подразделение"],
                        manager: d["инициатор"]["руководительнаименование"],
                        fio: d["инициатор"]["фио"],
                      }),
                    id: d["код"],
                    subject: d["наименование"],
                    body: d["описание"],
                    dateOfExecution: d["срокиисполнения"],
                    status: new CStatus({
                      status: d["статус"],
                    }),
                    executor: ('object' !== typeof d["текущийисполнитель"])? new CUser({}) :
                      new CUser({
                        avatar: d["текущийисполнитель"]["аватар"],
                        position: d["текущийисполнитель"]["должность"],
                        channelTelephone: d["текущийисполнитель"]["channelTelephone"],
                        countActive: d["текущийисполнитель"]["количествоактивных"],
                        company: d["текущийисполнитель"]["организация"],
                        email: d["текущийисполнитель"]["основнойemail"],
                        telephone: d["текущийисполнитель"]["основнойтелефон"],
                        department: d["текущийисполнитель"]["подразделение"],
                        manager: d["текущийисполнитель"]["руководительнаименование"],
                        fio: d["текущийисполнитель"]["фио"],
                      }),
                    usageType: d["типобращения"],
                    service: ('object' !== typeof d["услуга"])? new CService({}) : 
                      new CService({
                        avatar: d["услуга"]["аватар"],
                        id: d["услуга"]["код"],
                        name: d["услуга"]["наименование"],
                      }),
                  })
                );
              }
              observer.next(this.tasks);
              observer.complete();
            },
            error => this.handleError(observer, error, debugText),
          )
    });
  }


  GetTaskDescription(nomer: string, typeOfReq: string, debugText?: any): Observable<Array<CTask>> {
    return Observable.create( observer => {
        this.soap.post("main", "kngk_GetTaskDescription", "m:return", {log: nomer, Type: typeOfReq}, (this.debug)? debugText : undefined)
          .subscribe(
            data => {
              if (this.debugMode) {
                debugText.debugText += "Observable.create(this.soap.post('GetTaskDescription', result => ..)..) ";
                console.log("Observable.create(this.soap.post('GetTaskDescription', result => ..)..", data);
                debugger;
              }
 
                     this.taskD =[];
                     let desc = data["envelope"]["body"]["kngk_gettaskdescriptionresponse"]["return"];
                      this.taskD.push( new CTask({
                          created: desc["дата"]["_"].replace("T"," "),
                          
                          owner: ('object' !== typeof desc["инициатор"])? new CUser({}):
                            new CUser({
                              avatar: desc["инициатор"]["аватар"],
                              position: desc["инициатор"]["должность"],
                              channeltelephone: desc["инициатор"]["channelTelephone"],
                              countAction: desc["инициатор"]["количествоактивных"],
                              company: desc["инициатор"]["организация"],
                              email: desc["инициатор"]["основнойemail"],
                              telephone: desc["инициатор"]["основнойтелефон"],
                              departament: desc["инициатор"]["подразделение"],
                              manager: desc["инициатор"]["руководительнаименование"],
                              fio: desc["инициатор"]["фио"],
                            }),
                          id: desc["код"]["_"],
                          
                          subject:  desc["наименование"]["_"],
                          body: desc["описание"]["_"],
                          dateOfExecution: desc["срокиисполнения"],
                          status: new CStatus({
                            status: desc["статус"]["_"],
                          }),
                          
                          executor: ('object' !== typeof desc["текущийисполнитель"])? new CUser({}) :
                            new CUser({
                              avatar: desc["текущийисполнитель"]["аватар"],
                              position: desc["текущийисполнитель"]["должность"],
                              channelTelephone: desc["текущийисполнитель"]["channelTelephone"],
                              countActive: desc["текущийисполнитель"]["количествоактивных"],
                              company: desc["текущийисполнитель"]["организация"],
                              email: desc["текущийисполнитель"]["основнойemail"],
                              telephone: desc["текущийисполнитель"]["основнойтелефон"],
                              department: desc["текущийисполнитель"]["подразделение"],
                              manager: desc["текущийисполнитель"]["руководительнаименование"],
                              fio: desc["текущийисполнитель"]["фио"],
                          
                            }),
                          usegeType: desc["типобращения"]["_"],
                          service: ('object' !== typeof desc["услуга"])? new CService({}):
                            new CService({
                              avatar: desc["услуга"]["аватар"],
                              id: desc["услуга"]["код"],
                              name: desc["услуга"]["наименование"],
                            }),
                          category: ('object' !== typeof desc["категорияуслуги"])? new CCategory({}):
                            new CCategory({
                              avatar: desc["категорияуслуги"]["аватар"],
                              id: desc["категорияуслуги"]["код"],
                              name: desc["категорияуслуги"]["наименование"],
                            }),
                          dateOfCompletion: desc["датазавершения"],
                          comBody: desc["описаниефд"]["_"],
                          }),  
                        )
                     
              observer.next(this.taskD);
              observer.complete();
            },
            error => this.handleError(observer, error, debugText),
          )
        });
      }


    EditTask( nomer: string, typeOfReq: string, ComBody: string, Attaches: Array<any>, debugText?: any ): Observable<Array<any>>  {
       return Observable.create( observer => {

        this.soap.post("main", "kngk_EditTask", "m:return", {log: nomer, Type: typeOfReq, NewComment: ComBody, Executor: "", NFile: "", DFile: "", Attaches: Attaches, AutorComment: this.user}, (this.debug)? debugText : undefined)
          .subscribe(
            data => {
              if (this.debugMode) {
                debugText.debugText += "Observable.create(this.soap.post('EditTask', result => ..)..) ";
                console.log("Observable.create(this.soap.post('EditTask', result => ..)..", data);
                debugger;
              }

              this.taskD =[];
                let desc = data["envelope"]["body"]["kngk_edittaskresponse"]["return"];
                  this.taskD.push( new CTask({
                    created: desc["дата"]["_"].replace("T"," "),
                    owner: ('object' !== typeof desc["инициатор"])? new CUser({}):
                      new CUser({
                        avatar: desc["инициатор"]["аватар"],
                        position: desc["инициатор"]["должность"],
                        channeltelephone: desc["инициатор"]["channelTelephone"],
                        countAction: desc["инициатор"]["количествоактивных"],
                        company: desc["инициатор"]["организация"],
                        email: desc["инициатор"]["основнойemail"],
                        telephone: desc["инициатор"]["основнойтелефон"],
                        departament: desc["инициатор"]["подразделение"],
                        manager: desc["инициатор"]["руководительнаименование"],
                        fio: desc["инициатор"]["фио"],
                        }),
                    id: desc["код"]["_"],
                    subject:  desc["наименование"]["_"],
                    body: desc["описание"]["_"],
                    dateOfExecution: desc["срокиисполнения"],
                    status: new CStatus({
                      status: desc["статус"]["_"],
                      }),
                          
                    executor: ('object' !== typeof desc["текущийисполнитель"])? new CUser({}) :
                      new CUser({

                        avatar: desc["текущийисполнитель"]["аватар"],
                        position: desc["текущийисполнитель"]["должность"],
                        channelTelephone: desc["текущийисполнитель"]["channelTelephone"],
                        countActive: desc["текущийисполнитель"]["количествоактивных"],
                              company: desc["текущийисполнитель"]["организация"],
                              email: desc["текущийисполнитель"]["основнойemail"],
                              telephone: desc["текущийисполнитель"]["основнойтелефон"],
                              department: desc["текущийисполнитель"]["подразделение"],
                              manager: desc["текущийисполнитель"]["руководительнаименование"],
                              fio: desc["текущийисполнитель"]["фио"],
                          
                            }),
                          usegeType: desc["типобращения"]["_"],
                          service: ('object' !== typeof desc["услуга"])? new CService({}):
                            new CService({
                              avatar: desc["услуга"]["аватар"],
                              id: desc["услуга"]["код"],
                              name: desc["услуга"]["наименование"],
                            }),
                          category: ('object' !== typeof desc["категорияуслуги"])? new CCategory({}):
                            new CCategory({
                              avatar: desc["категорияуслуги"]["аватар"],
                              id: desc["категорияуслуги"]["код"],
                              name: desc["категорияуслуги"]["наименование"],
                            }),
                          dateOfCompletion: desc["датазавершения"],
                          comBody: desc["описаниефд"]["_"],
                          }),  
                        )
                     
              observer.next(this.taskD);
              observer.complete();

            },
            error => this.handleError(observer, error, debugText),
            )
          });
    }

  Service(debugText?: any): Observable<Array<CService>> {
    return Observable.create( observer => {
      this.soap.post("main", "kngk_GetRoutes", "m:return", {log: this.user}, (this.debug)? debugText:undefined)
        .subscribe(
          data=> {
            if(this.debugMode) {
              debugText.debugText += "Observable.create(this.soap.post('GetRoutes', result => ..)..) ";
              console.log("Observable.create(this.soap.post('GetRoutes', result => ..)..)", data);
              debugger;
            }

            this.service = [];
            this.servcat = [];
            let self = this;
            data["envelope"]["body"]["kngk_getroutesresponse"]["return"]["услуга"].forEach(function(dc, dsc) {
              if(dsc<17 || dsc>17){
                dc["составуслуги"]["элементсоставауслуги"].forEach(function(cc) {
                self.servcat.push(new CCategory({
                  avatar: cc["аватар"],
                  name: cc["наименование"],
                  id: cc["код"],
                  serviceOwner: cc["услугавладелец"],

                }),)
                });
              }
            });


            
            data["envelope"]["body"]["kngk_getroutesresponse"]["return"]["услуга"].forEach(function(d, ds) {
                if(ds<=16 || ds>=18){
                self.category = [];
                d["составуслуги"]["элементсоставауслуги"].forEach(function(c) {
                  self.category.push( new CCategory({
                        avatar: c["аватар"],
                        name: c["наименование"],
                        id: c["код"],
                        typeCategory: c["типзначениякатегории"],
                        serviceOwner: c["услугавладелец"],
                  }),
                  )

                });
                
                self.service.push( new CService({  
                    id: d["код"],
                    name: d["наименование"],
                    avatar: d["аватар"],
                    group: d["группа"],               
                    comBody: d["описаниефд"],
                    category: self.category,
                    keys: ds,
                  }), 
                );
             
               // self.category = [];
              }    
            });    
      

          observer.next(this.service);
          observer.complete();
         },
           error => this.handleError(observer, error, debugText),
         )

       });

  }  


 
 

  NewTask(body:string, subjectTask: string, id: string, CatId: string, typeCat:string, Attaches: Array<any>, debugText?: any): Observable<Array<CTask>> {

    return Observable.create( observer => {
      this.soap.post("main", "kngk_NewTask", "m:return", {log: this.user, Title: subjectTask, deskr: body, route: id, category: CatId, TypeOfCategory: typeCat, Executor: false, NFile: "", DFile: "", Attaches: Attaches}, (this.debug)? debugText:undefined)
        .subscribe(
          data=> {
            if(this.debugMode) {
              debugText.debugText += "Observable.create(this.soap.post('NewTask', result => ..)..) ";
              console.log("Observable.create(this.soap.post('NewText', result => ..)..)", data);
              debugger;
            }

            this.newTask = [];
              let nt = data["envelope"]["body"]["kngk_newtaskresponse"]["return"];
                  this.newTask.push( new COption({
                    created: nt["времясоздания"]["_"].replace("T"," "),
                    code: nt["код"],
                    name: nt["наименование"],
                    reqSource: nt["реквизитисточника"],
                    org: nt["ТекущийСтатус"],
                    serviceCategory: nt["категорияуслуг"],
                    status: new CStatus({
                      status: nt["текущийстатус"],
                      }),
                          
                    
                          }),  
                        )



              observer.next(this.newTask);
              observer.complete();
            },
             error => this.handleError(observer, error, debugText),
        )
    });
  }



  CancelTask(nomer: string, typeOfReq: string, debugText?: any){
    return Observable.create( observer => {
      this.soap.post("main", "kngk_CancelTask", "m:return", {log: nomer, Type: typeOfReq}, (this.debug)? debugText : undefined)
        .subscribe(
          data => {
            if (this.debugMode) {
              debugText.debugText += "Observable.create(this.soap.post('CancelTask', result => ..)..) ";
              console.log("Observable.create(this.soap.post('CancelTask', result => ..)..", data);
              debugger;
            }
        this.cancelTask = [];
          let ct = data["envelope"]["body"]["kngk_canceltaskresponse"]["return"];
            this.cancelTask.push( new CCancelTask({
              created: ct["дата"]["_"].replace("T"," "),
              owner: ('object' !== typeof ct["инициатор"])? new CUser({}):
                new CUser({
                  avatar: ct["инициатор"]["аватар"],
                  position: ct["инициатор"]["должность"],
                  channeltelephone: ct["инициатор"]["каналтелефонии"],
                  countAction: ct["инициатор"]["количествоактивных"],
                  company: ct["инициатор"]["организация"],
                  email: ct["инициатор"]["основнойemail"],
                  telephone: ct["инициатор"]["основнойтелефон"],
                  departament: ct["инициатор"]["подразделение"],
                  manager: ct["инициатор"]["руководительнаименование"],
                  fio: ct["инициатор"]["фио"],
                }),
              code: ct["код"]["_"],
              subject:  ct["наименование"]["_"],
              body: ct["описание"]["_"],
              dateOfExecution: ct["срокиисполнения"],
              status: new CStatus({
                status: ct["статус"]["_"],
                }),           
              executor: ('object' !== typeof ct["текущийисполнитель"])? new CUser({}) :
                new CUser({
                  avatar: ct["текущийисполнитель"]["аватар"],
                  position: ct["текущийисполнитель"]["должность"],
                  channelTelephone: ct["текущийисполнитель"]["channelTelephone"],
                  countActive: ct["текущийисполнитель"]["количествоактивных"],
                  company: ct["текущийисполнитель"]["организация"],
                  email: ct["текущийисполнитель"]["основнойemail"],
                  telephone: ct["текущийисполнитель"]["основнойтелефон"],
                  department: ct["текущийисполнитель"]["подразделение"],
                  manager: ct["текущийисполнитель"]["руководительнаименование"],
                  fio: ct["текущийисполнитель"]["фио"],
                }),
              usegeType: ct["типобращения"]["_"],
              service: ('object' !== typeof ct["услуга"])? new CService({}):
                new CService({
                  avatar: ct["услуга"]["аватар"],
                  id: ct["услуга"]["код"],
                  name: ct["услуга"]["наименование"],
                }),
              category: ('object' !== typeof ct["категорияуслуги"])? new CCategory({}):
                new CCategory({
                  avatar: ct["категорияуслуги"]["аватар"],
                  id: ct["категорияуслуги"]["код"],
                  name: ct["категорияуслуги"]["наименование"],
                }),
              dateOfCompletion: ct["датазавершения"],
              comBody: ct["описаниефд"]["_"],
            }),  
          )
                     
          observer.next(this.cancelTask);
          observer.complete();
        },
          error => this.handleError(observer, error, debugText),
      )
    });
  }

  SearchFunc(debugText?: any){
    return Observable.create( observer => {
      this.soap.post("main", "kngk_Search", "m:return", {}, (this.debug)? debugText : undefined)
        .subscribe(
          data => {
            if (this.debugMode) {
                debugText.debugText += "Observable.create(this.soap.post('GetTask', result => ..)..) ";
                console.log("Observable.create(this.soap.post('GetTask', result => ..)..", data);
                debugger;
            }
            this.search = [];

            observer.next(this.search);
            observer.complite();
          },
            error => this.handleError(observer, error, debugText),
          )
    });
  }
}
