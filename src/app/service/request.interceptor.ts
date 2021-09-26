import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let token = this.getToken();
    const clonedRequest = request.clone({ headers: request.headers.append('x-access-token', token ? token : "") });
    return next.handle(clonedRequest);
  }

  getToken(){
  	const savedCredentials = sessionStorage.getItem("credentials") || localStorage.getItem("credentials");
    try {
    	 return savedCredentials;
    } catch(e){
    	return null;
    }
  }
}
