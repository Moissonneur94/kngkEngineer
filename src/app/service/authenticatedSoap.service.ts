import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import * as xml2js from "xml2js";
import * as processors from "xml2js/lib/processors";
// import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class AuthenticatedSoapService {
  private username: string = "";
  private password: string = "";

  public envelopeBuilder: (
    requestBody: string,
    predicate: string,
    method: string,
    targetNamespace: string
  ) => string = null;

  constructor(
    public http: HttpClient,
    public serviceUrl: string,
    public targetNamespace: string
  ) {}

  public setAuth(username: string, password: string) {
    this.username = username;
    this.password = password;
  }

  public getAuthBasic(): string {
    return "Basic " + btoa(this.username + ":" + this.password);
  }

  public post(
    predicate: string,
    method: string,
    responseRoot: string,
    body: any
  ): Observable<any> {
    if (!this.serviceUrl || !this.envelopeBuilder || !method || !body) {
      return null;
    }

    const envelopedRequest: string = this.envelopeBuilder(
      this.toXml(body, predicate),
      predicate,
      method,
      this.targetNamespace
    );

    return Observable.create(observer => {
      this.http
        .request("POST", this.serviceUrl, {
          body: envelopedRequest,
          headers: { SOAPAction: this.targetNamespace + "/" + method },
          withCredentials: true,
          responseType: "text"
        })
        .subscribe(
          res1 => {
            return this.convert(res1, responseRoot).subscribe(
              res => {
                observer.next(res);
                observer.complete();
              },
              err => {
                observer.error(err);
                observer.complete();
              }
            );
          },
          (err1: HttpErrorResponse) => {
            return this.convert(err1.error, responseRoot).subscribe(
              res => {
                observer.error(res);
                observer.complete();
              },
              err => {
                observer.error(err1);
                observer.complete();
              }
            );
          }
        );
    });
  }

  /*
   *
   * SOAP
   *
   */
  private convert(data: string, responseRoot?: string): Observable<any> {
    return Observable.create(observer => {
      new xml2js.Parser({
        normalizeTags: true,
        tagNameProcessors: [processors.stripPrefix],
        valueNameProcessors: [
          processors.parseBooleans,
          processors.parseNumbers
        ],
        xmlns: false,
        explicitArray: false,
        explicitChildren: false,
        mergeAttrs: false
      }).parseString(data, (err, result) => {
        if (null !== err) {
          observer.error(err);
          observer.complete();
          return;
        }
        observer.next(result);
        observer.complete();
      });
    });
  }

  private toXml(parameters: any, predicate?: string): string {
    let xml: string = "";
    let parameter: any;

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
          const year: string = parameters.getFullYear().toString();
          const month: string = (
            "0" + (parameters.getMonth() + 1).toString()
          ).slice(-2);
          const date: string = ("0" + parameters.getDate().toString()).slice(
            -2
          );
          const hours: string = ("0" + parameters.getHours().toString()).slice(
            -2
          );
          const minutes: string = (
            "0" + parameters.getMinutes().toString()
          ).slice(-2);
          const seconds: string = (
            "0" + parameters.getSeconds().toString()
          ).slice(-2);
          const milliseconds: string = parameters.getMilliseconds().toString();

          let tzOffsetMinutes: number = Math.abs(
            parameters.getTimezoneOffset()
          );
          let tzOffsetHours: number = 0;

          while (tzOffsetMinutes >= 60) {
            tzOffsetHours++;
            tzOffsetMinutes -= 60;
          }

          const tzMinutes: string = ("0" + tzOffsetMinutes.toString()).slice(
            -2
          );
          const tzHours: string = ("0" + tzOffsetHours.toString()).slice(-2);

          const timezone: string =
            (parameters.getTimezoneOffset() < 0 ? "-" : "+") +
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
        } else if (
          parameters.constructor.toString().indexOf("function Array()") > -1
        ) {
          // Array
          for (parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
              if (!isNaN(parameter)) {
                // linear array
                /function\s+(\w*)\s*\(/gi.exec(
                  parameters[parameter].constructor.toString()
                );

                let type = RegExp.$1;

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
              } else {
                // associative array
                xml += this.toElement(
                  parameter,
                  parameters[parameter],
                  predicate
                );
              }
            }
          }
        } else {
          // Object or custom function
          for (parameter in parameters) {
            if (parameters.hasOwnProperty(parameter)) {
              xml += this.toElement(
                parameter,
                parameters[parameter],
                predicate
              );
            }
          }
        }
        break;

      default:
        throw new Error(
          "SoapService error: type '" + typeof parameters + "' is not supported"
        );
    }

    return xml;
  }

  private toElement(
    tagNamePotentiallyWithAttributes: string,
    parameters: any,
    predicate?: string
  ): string {
    const elementContent: string = this.toXml(parameters, predicate);

    if (undefined !== predicate) {
      predicate += ":";
    } else {
      predicate = "";
    }

    return "" === elementContent
      ? "<" + predicate + tagNamePotentiallyWithAttributes + "/>"
      : "<" +
          predicate +
          tagNamePotentiallyWithAttributes +
          ">" +
          elementContent +
          "</" +
          predicate +
          AuthenticatedSoapService.stripTagAttributes(
            tagNamePotentiallyWithAttributes
          ) +
          ">";
  }

  private static stripTagAttributes(
    tagNamePotentiallyWithAttributes: string
  ): string {
    tagNamePotentiallyWithAttributes = tagNamePotentiallyWithAttributes + " ";

    return tagNamePotentiallyWithAttributes.slice(
      0,
      tagNamePotentiallyWithAttributes.indexOf(" ")
    );
  }
}
