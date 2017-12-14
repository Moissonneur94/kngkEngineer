import { Observable } from "rxjs/Observable";
import { Injectable, Injector } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from "@angular/common/http";
import { AuthenticatedSoapService } from "./authenticatedSoap.service";

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  constructor(private injector: Injector) {}

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authenticationService = this.injector.get(AuthenticatedSoapService);
    // Get the auth header from the service.
    const authHeader = authenticationService.getAuthBasic();
    // Clone the request to add the new header.
    const authReq = req.clone({
      headers: req.headers.set("Authorization", authHeader)
    });
    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
